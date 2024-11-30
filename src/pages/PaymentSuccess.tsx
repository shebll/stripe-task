import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, CheckCircle, ArrowRight, Stethoscope, Brain, Calendar, MessageCircle } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Unlimited Consultations',
      description: 'Chat with our AI health assistant as much as you need, with no daily limits.'
    },
    {
      icon: Brain,
      title: 'Personalized Care Plans',
      description: 'Get detailed, customized wellness plans based on your specific health needs.'
    },
    {
      icon: Calendar,
      title: 'Daily Health Tips',
      description: 'Receive personalized daily tips to help you maintain a healthy lifestyle.'
    },
    {
      icon: Stethoscope,
      title: 'Priority Support',
      description: 'Get faster response times and enhanced support for your health queries.'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
            <Crown className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to HealthChat Pro!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You now have access to our complete suite of premium health and wellness features.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Getting Started Section */}
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Ready to get started?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-blue-800">Try asking detailed health questions - there's no daily limit!</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-blue-800">Create your first personalized care plan</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-blue-800">Check out your daily health tip</p>
            </div>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors duration-200"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;