// Pricing Page Component
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Rocket, 
  Building2,
  Users,
  Brain,
  BarChart3,
  Shield,
  Headphones,
  Zap,
  Globe,
  ArrowRight
} from 'lucide-react';

const PricingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or yearly
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small companies getting started',
      icon: Users,
      price: {
        monthly: 2999, // $29.99
        yearly: 299 // $2.99/month billed yearly
      },
      features: {
        resumeAnalysis: 30,
        jobPostings: 5,
        candidateStorage: 100,
        basicAnalytics: true,
        emailSupport: true,
        apiAccess: false,
        customBranding: false,
        advancedFilters: false,
        bulkOperations: false,
        dedicatedManager: false,
        sla: false,
        customIntegrations: false
      },
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing teams and mid-size companies',
      icon: Building2,
      price: {
        monthly: 9999, // $99.99
        yearly: 999 // $9.99/month billed yearly
      },
      features: {
        resumeAnalysis: 150,
        jobPostings: 25,
        candidateStorage: 1000,
        basicAnalytics: true,
        emailSupport: true,
        apiAccess: true,
        customBranding: true,
        advancedFilters: true,
        bulkOperations: true,
        dedicatedManager: false,
        sla: false,
        customIntegrations: false
      },
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Comprehensive solution for large organizations',
      icon: Crown,
      price: {
        monthly: 29999, // $299.99
        yearly: 2999 // $29.99/month billed yearly
      },
      features: {
        resumeAnalysis: 1000,
        jobPostings: 'unlimited',
        candidateStorage: 'unlimited',
        basicAnalytics: true,
        emailSupport: true,
        apiAccess: true,
        customBranding: true,
        advancedFilters: true,
        bulkOperations: true,
        dedicatedManager: true,
        sla: true,
        customIntegrations: true
      },
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const formatPrice = (cents) => {
    if (typeof cents === 'string') return cents;
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatFeatureValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-gray-400" />;
    }
    if (typeof value === 'string') {
      return value === 'unlimited' ? (
        <span className="text-green-600 font-medium">Unlimited</span>
      ) : (
        <span className="text-gray-700">{value}</span>
      );
    }
    return <span className="text-gray-700">{value.toLocaleString()}</span>;
  };

  const getYearlySavings = (plan) => {
    const monthlyCost = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly * 12;
    const savings = ((monthlyCost - yearlyCost) / monthlyCost * 100).toFixed(0);
    return savings;
  };

  const PlanCard = ({ plan }) => {
    const Icon = plan.icon;
    const currentPrice = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
    const isEnterprise = plan.id === 'enterprise';

    return (
      <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
        plan.popular 
          ? 'border-primary-500 transform scale-105' 
          : selectedPlan === plan.id
            ? 'border-primary-300'
            : 'border-gray-200 hover:border-gray-300'
      }`}>
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>Most Popular</span>
            </div>
          </div>
        )}
        
        <div className="p-8">
          {/* Plan Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              plan.popular ? 'bg-primary-100' : 'bg-gray-100'
            }`}>
              <Icon className={`w-8 h-8 ${plan.popular ? 'text-primary-600' : 'text-gray-600'}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <p className="text-gray-600">{plan.description}</p>
          </div>

          {/* Pricing */}
          <div className="text-center mb-8">
            {isEnterprise ? (
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">Custom</div>
                <div className="text-gray-600">Contact us for pricing</div>
              </div>
            ) : (
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatPrice(currentPrice)}
                  <span className="text-lg font-normal text-gray-600">
                    /{billingCycle === 'monthly' ? 'month' : 'month'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="text-sm text-green-600 font-medium">
                    Save {getYearlySavings(plan)}% with yearly billing
                  </div>
                )}
                <div className="text-gray-500 text-sm mt-1">
                  {plan.features.resumeAnalysis} AI resume analyses included
                </div>
              </div>
            )}
          </div>

          {/* Key Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">AI Resume Analysis</span>
              {formatFeatureValue(plan.features.resumeAnalysis)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Job Postings</span>
              {formatFeatureValue(plan.features.jobPostings)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Candidate Storage</span>
              {formatFeatureValue(plan.features.candidateStorage)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">API Access</span>
              {formatFeatureValue(plan.features.apiAccess)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Custom Branding</span>
              {formatFeatureValue(plan.features.customBranding)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Advanced Analytics</span>
              {formatFeatureValue(plan.features.basicAnalytics)}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            {isAuthenticated && user?.role === 'hr' ? (
              <Link
                to={isEnterprise ? '/contact' : `/billing/upgrade/${plan.id}`}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors flex items-center justify-center space-x-2 ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/register"
                className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors flex items-center justify-center space-x-2 ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose the Perfect Plan for Your Team
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Unlock the power of AI-driven recruitment with our flexible pricing plans. 
            Start with a free trial and scale as your hiring needs grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Save up to 50%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-xl text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-lg font-semibold text-gray-900">
                    Features
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-6">
                      <div className="text-lg font-semibold text-gray-900">{plan.name}</div>
                      <div className="text-sm text-gray-600">{plan.description}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">AI Resume Analysis</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {formatFeatureValue(plan.features.resumeAnalysis)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Job Postings</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {formatFeatureValue(plan.features.jobPostings)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Candidate Storage</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {formatFeatureValue(plan.features.candidateStorage)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">API Access</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {formatFeatureValue(plan.features.apiAccess)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Custom Branding</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {formatFeatureValue(plan.features.customBranding)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Advanced Filters</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {formatFeatureValue(plan.features.advancedFilters)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Bulk Operations</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {formatFeatureValue(plan.features.bulkOperations)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Dedicated Manager</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {formatFeatureValue(plan.features.dedicatedManager)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">SLA Guarantee</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {formatFeatureValue(plan.features.sla)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What does "AI resume analysis" include?
              </h3>
              <p className="text-gray-600">
                Our AI analyzes resumes for skills, experience, education, and cultural fit. 
                It provides matching scores, highlights key qualifications, and ranks candidates 
                based on job requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. Upgrades take effect immediately, 
                while downgrades apply at the end of your current billing cycle.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600">
                Yes, all plans include a 14-day free trial. No credit card required to start. 
                You'll have access to all features during the trial period.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my plan limits?
              </h3>
              <p className="text-gray-600">
                We'll notify you when you're approaching your limits. You can either upgrade 
                your plan or purchase additional credits for resume analyses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of companies already using TalentSift AI to hire better, faster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;