# In ai_service/main.py

import re
import io
import spacy
from spacy.matcher import Matcher
from fastapi import FastAPI, UploadFile, File, HTTPException
from pypdf import PdfReader
import docx

# --- Setup ---
# Load a larger, more capable spaCy model for better entity recognition
# Run this in your terminal first: python -m spacy download en_core_web_lg
try:
    nlp = spacy.load("en_core_web_lg")
except OSError:
    print("Downloading 'en_core_web_lg' model...")
    from spacy.cli import download
    download("en_core_web_lg")
    nlp = spacy.load("en_core_web_lg")

app = FastAPI(title="TalentSift AI Service - Advanced Model")

# --- Keyword Lists for Extraction ---
SKILLS_KEYWORDS = [
    'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'AWS',
    'Git', 'Docker', 'Kubernetes', 'Agile', 'Scrum', 'Teamwork', 'Communication',
    'Leadership', 'Problem Solving', 'Jira', 'Figma', 'TensorFlow', 'PyTorch'
]

EDUCATION_DEGREES = [
    'B.E.', 'B.Tech', 'M.Tech', 'B.S.', 'M.S.', 'B.Sc', 'M.Sc', 'Ph.D',
    'Bachelor of Engineering', 'Master of Engineering',
    'Bachelor of Technology', 'Master of Technology',
    'Bachelor of Science', 'Master of Science', 'Doctor of Philosophy'
]

# --- Helper Functions for Text Extraction ---

def extract_text_from_pdf(file_contents: bytes) -> str:
    pdf_stream = io.BytesIO(file_contents)
    pdf_reader = PdfReader(pdf_stream)
    text = "".join(page.extract_text() or "" for page in pdf_reader.pages)
    return text

def extract_text_from_docx(file_contents: bytes) -> str:
    doc_stream = io.BytesIO(file_contents)
    document = docx.Document(doc_stream)
    return "\n".join(para.text for para in document.paragraphs)

# --- Core Extraction Logic ---

def extract_personal_info(text: str, doc: spacy.tokens.doc.Doc):
    name = next((ent.text for ent in doc.ents if ent.label_ == "PERSON"), None)
    email = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    phone = re.search(r"(\(?\d{3}\)?[-.\s]?)?(\d{3}[-.\s]?\d{4})", text)
    linkedin = re.search(r"linkedin\.com/in/[\w-]+", text)
    github = re.search(r"github\.com/[\w-]+", text)
    location = next((ent.text for ent in doc.ents if ent.label_ == "GPE"), None)

    return {
        "full_name": name,
        "email": email.group(0) if email else None,
        "phone_number": phone.group(0) if phone else None,
        "linkedin_url": "https://www." + linkedin.group(0) if linkedin else None,
        "github_url": "https://www." + github.group(0) if github else None,
        "location": location
    }

def extract_education(text: str):
    education_entries = []
    # Simple regex to find degree keywords and capture surrounding text
    for degree in EDUCATION_DEGREES:
        pattern = re.compile(rf"{re.escape(degree)}.*?(?:\n|\Z)", re.IGNORECASE)
        matches = pattern.findall(text)
        for match in matches:
            # Further parsing could be done here to find institution, year, etc.
            education_entries.append({"degree_info": match.strip()})
    return list({v['degree_info']: v for v in education_entries}.values()) # Remove duplicates

def extract_skills(text: str):
    # Use regex to find skills case-insensitively
    found_skills = set()
    for skill in SKILLS_KEYWORDS:
        if re.search(r"\b" + re.escape(skill) + r"\b", text, re.IGNORECASE):
            found_skills.add(skill)
    return sorted(list(found_skills))

def extract_experience(text: str, doc: spacy.tokens.doc.Doc):
    # This is a challenging task. We use a rule-based approach with spaCy's Matcher.
    matcher = Matcher(nlp.vocab)
    # Pattern to find Job Title (as a proper noun phrase) followed by a Company (ORG entity)
    pattern = [
        {'POS': 'PROPN', 'OP': '+'},  # Job title like "Software Engineer"
        {'IS_PUNCT': True, 'OP': '?'},
        {'ENT_TYPE': 'ORG'}          # Company Name
    ]
    matcher.add("WORK_EXPERIENCE", [pattern])
    matches = matcher(doc)
    
    experiences = []
    for match_id, start, end in matches:
        span = doc[start:end]
        experiences.append(span.text)
        
    # Also, extract all mentioned companies
    companies = list(set(ent.text for ent in doc.ents if ent.label_ == "ORG"))
    
    return {
        "job_roles_and_companies": experiences,
        "all_companies_mentioned": companies
    }

def extract_section(text: str, section_title: str):
    # Extracts text from a specific section like "Projects" or "Certifications"
    pattern = re.compile(rf"^\s*{section_title}\s*$", re.IGNORECASE | re.MULTILINE)
    match = pattern.search(text)
    if not match:
        return None
    
    # Find the start of the next section or end of the text
    next_section_pattern = re.compile(r"^\s*\w+[\s\w]*\s*$", re.MULTILINE)
    next_match = next_section_pattern.search(text, pos=match.end())
    
    end_pos = next_match.start() if next_match else len(text)
    return text[match.end():end_pos].strip()

# --- API Endpoint ---

@app.post("/analyze/")
async def analyze_resume(file: UploadFile = File(...)):
    file_contents = await file.read()
    
    try:
        if file.content_type == "application/pdf":
            extracted_text = extract_text_from_pdf(file_contents)
        elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            extracted_text = extract_text_from_docx(file_contents)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type.")

        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from document.")

        doc = nlp(extracted_text)

        # --- Extract all features ---
        personal_info = extract_personal_info(extracted_text, doc)
        education = extract_education(extracted_text)
        skills = extract_skills(extracted_text)
        experience = extract_experience(extracted_text, doc)
        projects = extract_section(extracted_text, "Projects")
        certifications = extract_section(extracted_text, "Certifications")
        summary = extract_section(extracted_text, "Summary") or extract_section(extracted_text, "Objective")

        # --- Assemble the final structured output ---
        structured_output = {
            "candidate_personal_info": personal_info,
            "education": education,
            "work_experience": experience,
            "skills": skills,
            "projects": projects,
            "certifications": certifications,
            "summary": summary,
            # Placeholders for features not easily extracted with this model
            "achievements_awards": None,
            "languages": None,
            "availability_work_preference": None,
        }

        return {
            "filename": file.filename,
            "analysis": structured_output
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")