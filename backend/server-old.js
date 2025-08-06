// In backend/server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// Import Models
const Job = require("./models/Job");
const Candidate = require("./models/Candidate");

const app = express();
const PORT = process.env.PORT || 5000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- API ROUTES ---

// System Routes
app.get("/api", (req, res) =>
  res.json({ message: "TalentSift API is running." })
);
app.get("/api/health", (req, res) => res.json({ status: "UP" }));

// Job Routes
app.post("/api/jobs", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/jobs/:id/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find({ associatedJob: req.params.id });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Candidate Routes
app.post(
  "/api/candidates/upload/:jobId",
  upload.single("resume"),
  async (req, res) => {
    if (!req.file)
      return res.status(400).json({ error: "Resume file is required." });
    if (!AI_SERVICE_URL)
      return res.status(500).json({ error: "AI service URL not configured." });

    try {
      // Correctly define formData inside the try block
      const formData = new FormData();
      formData.append("file", req.file.buffer, req.file.originalname);

      const aiResponse = await axios.post(AI_SERVICE_URL, formData, {
        headers: formData.getHeaders(),
      });

      const newCandidate = new Candidate({
        name: req.body.name || "N/A",
        email: req.body.email || "N/A",
        associatedJob: req.params.jobId,
        resumeFilename: req.file.originalname,
        analysis: aiResponse.data.analysis,
      });
      
      await newCandidate.save();

      res.status(201).json(newCandidate);

    } catch (error) {
      console.error("Full upload error object:", error);
      res.status(500).json({ error: "Failed to process resume." });
    }
  }
);

app.get("/api/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate("associatedJob", "title")
      .sort({ uploadedAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/candidates/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found." });
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});