// Home Page Component
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  Users, 
  Target, 
  CheckCircle, 
  Star,
  Briefcase,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Award
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze resumes and match candidates to job requirements with precision.',
    },
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'Intelligent matching system connects the right candidates with the right opportunities based on skills and experience.',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and insights to help HR teams make data-driven hiring decisions.',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security and compliance with data protection regulations to keep candidate information safe.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Candidates Matched' },
    { number: '1K+', label: 'Companies Trust Us' },
    { number: '95%', label: 'Accuracy Rate' },
    { number: '70%', label: 'Time Saved' },
  ];

  const testimonials = [
    {
      quote: "TalentSift AI has revolutionized our hiring process. We've reduced screening time by 70% while finding better candidates.",
      author: "Sarah Johnson",
      role: "Head of HR",
      company: "TechCorp Inc.",
      rating: 5,
    },
    {
      quote: "The AI analysis is incredibly accurate. It helps us identify top talent that we might have missed otherwise.",
      author: "Michael Chen",
      role: "Talent Acquisition Manager",
      company: "Innovation Labs",
      rating: 5,
    },
    {
      quote: "As a candidate, I love how the platform matches me with relevant opportunities. Found my dream job in weeks!",
      author: "Emily Rodriguez",
      role: "Software Engineer",
      company: "StartupXYZ",
      rating: 5,
    },
  ];

  const steps = [
    {
      step: 1,
      title: 'Sign Up',
      description: 'Create your account as a candidate or company in minutes.',
      icon: Users,
    },
    {
      step: 2,
      title: 'Upload & Analyze',
      description: 'Upload resumes or job descriptions for AI-powered analysis.',
      icon: Brain,
    },
    {
      step: 3,
      title: 'Get Matched',
      description: 'Receive intelligent matches based on skills, experience, and requirements.',
      icon: Target,
    },
    {
      step: 4,
      title: 'Connect & Hire',
      description: 'Connect with top candidates or employers and start your journey.',
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Find the Perfect
                <span className="block text-accent-400">Talent Match</span>
                with AI
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Revolutionary HR recruitment platform that uses advanced AI to analyze resumes, 
                match candidates to job requirements, and streamline the hiring process.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/jobs"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3">
                  <div className="bg-primary-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">AI Analysis Complete</h3>
                        <p className="text-gray-600 text-sm">Resume Score: 94%</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Skills Match</span>
                        <span className="font-semibold text-green-600">Excellent</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-semibold text-green-600">5+ years</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Culture Fit</span>
                        <span className="font-semibold text-green-600">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Recruitment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides everything you need to find, analyze, and hire the best talent efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to revolutionize your hiring process
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers who've transformed their hiring process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  <div className="text-primary-600 text-sm font-medium">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies and candidates who are already using TalentSift AI 
            to make better hiring decisions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
