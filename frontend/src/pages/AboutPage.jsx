// About Page Component
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Users, 
  Target, 
  Award,
  TrendingUp,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Rocket,
  Star,
  CheckCircle
} from 'lucide-react';

const AboutPage = () => {
  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      image: '/api/placeholder/300/300',
      bio: 'Former VP of Engineering at Google with 15+ years in AI and machine learning.',
      linkedin: '#'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-Founder',
      image: '/api/placeholder/300/300',
      bio: 'Ex-Amazon AI researcher specializing in natural language processing and recruitment technology.',
      linkedin: '#'
    },
    {
      name: 'Emily Johnson',
      role: 'Head of Product',
      image: '/api/placeholder/300/300',
      bio: 'Product leader from LinkedIn with deep expertise in HR technology and user experience.',
      linkedin: '#'
    },
    {
      name: 'David Kim',
      role: 'Head of AI',
      image: '/api/placeholder/300/300',
      bio: 'PhD in Computer Science from MIT, previously led AI initiatives at Microsoft.',
      linkedin: '#'
    }
  ];

  const values = [
    {
      icon: Brain,
      title: 'Innovation First',
      description: 'We continuously push the boundaries of AI technology to solve real-world recruitment challenges.'
    },
    {
      icon: Users,
      title: 'People-Centered',
      description: 'Every feature we build is designed with both recruiters and candidates in mind, creating win-win outcomes.'
    },
    {
      icon: Shield,
      title: 'Trust & Privacy',
      description: 'We handle sensitive data with the highest security standards and complete transparency.'
    },
    {
      icon: Target,
      title: 'Results Driven',
      description: 'Our success is measured by the quality of matches we create and the time we save our users.'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Company Founded',
      description: 'TalentSift AI was born from the vision to democratize AI-powered recruitment.'
    },
    {
      year: '2023',
      title: 'First MVP',
      description: 'Launched our initial product with basic resume parsing and matching capabilities.'
    },
    {
      year: '2024',
      title: 'AI Breakthrough',
      description: 'Achieved 95% accuracy in resume analysis through advanced machine learning models.'
    },
    {
      year: '2024',
      title: '1,000+ Companies',
      description: 'Reached our first major milestone with over 1,000 companies using our platform.'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Expanded to serve companies worldwide with multi-language support.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Candidates Matched' },
    { number: '1K+', label: 'Companies Served' },
    { number: '95%', label: 'Accuracy Rate' },
    { number: '70%', label: 'Time Reduction' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Revolutionizing Recruitment
              <span className="block text-accent-400">with AI</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              We're on a mission to connect the world's best talent with amazing opportunities, 
              using cutting-edge AI to make hiring faster, fairer, and more effective.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-2">{stat.number}</div>
                  <div className="text-primary-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Traditional recruitment is broken. It's time-consuming, biased, and often fails to identify 
                the best candidates. We believe technology can do better.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                TalentSift AI leverages advanced machine learning to analyze resumes, understand job requirements, 
                and create perfect matches between candidates and companies. Our AI doesn't just look at keywords – 
                it understands context, experience, and potential.
              </p>
              <div className="flex items-center space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-700">Reduce hiring time by 70%</span>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-700">Eliminate unconscious bias</span>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-700">Improve match accuracy by 95%</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-primary-50 rounded-2xl p-8">
                <Brain className="w-16 h-16 text-primary-600 mb-6 mx-auto" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Powered by Advanced AI
                  </h3>
                  <p className="text-gray-600">
                    Our proprietary algorithms analyze over 100 data points from each resume, 
                    understanding not just what candidates have done, but what they're capable of achieving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              From startup to industry leader
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year.slice(-2)}
                  </div>
                  <div className="ml-6">
                    <div className="text-sm text-primary-600 font-medium">{milestone.year}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The brilliant minds behind TalentSift AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <Users className="w-24 h-24 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <a
                    href={member.linkedin}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Connect on LinkedIn →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Cutting-Edge Technology
                </h2>
                <p className="text-lg text-gray-600">
                  Our AI platform is built on the latest advancements in machine learning, 
                  natural language processing, and data science.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Natural Language Processing</h3>
                    <p className="text-gray-600 text-sm">
                      Advanced NLP models understand context, skills, and experience from resume text.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Intelligent Matching</h3>
                    <p className="text-gray-600 text-sm">
                      Machine learning algorithms continuously improve match accuracy based on feedback.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
                    <p className="text-gray-600 text-sm">
                      Enterprise-grade security ensures all candidate data is protected and compliant.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <div className="text-center">
                <Rocket className="w-16 h-16 text-primary-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Continuously Improving
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI learns from every interaction, becoming smarter and more accurate over time.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">&lt;0.1s</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join the Future of Recruitment
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Ready to experience the power of AI-driven hiring? Start your journey with us today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
