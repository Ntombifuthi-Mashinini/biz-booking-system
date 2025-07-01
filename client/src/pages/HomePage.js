import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaChartLine, 
  FaMobileAlt,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';

const HomePage = () => {
  const features = [
    {
      icon: FaCalendarAlt,
      title: 'Easy Booking',
      description: 'Simple and intuitive booking process for your clients'
    },
    {
      icon: FaUsers,
      title: 'Client Management',
      description: 'Keep track of all your clients and their preferences'
    },
    {
      icon: FaChartLine,
      title: 'Business Growth',
      description: 'Analytics and insights to help grow your business'
    },
    {
      icon: FaMobileAlt,
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices and screen sizes'
    },
    {
      icon: FaShieldAlt,
      title: 'Secure & Reliable',
      description: 'Bank-level security to protect your business data'
    },
    {
      icon: FaClock,
      title: '24/7 Availability',
      description: 'Your clients can book anytime, anywhere'
    }
  ];

  const benefits = [
    'Reduce no-shows with automated reminders',
    'Save time with online booking',
    'Increase revenue with better scheduling',
    'Professional appearance for your business',
    'Easy payment processing',
    'Detailed reporting and analytics'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Streamline Your Business
              <span className="block text-primary-200">with Smart Booking</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              The complete online booking solution for small businesses. 
              Manage appointments, clients, and grow your business with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Book Now
              </Link>
              <Link
                to="/register"
                className="bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed specifically for small businesses to streamline operations and boost growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-primary-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose BizBooking?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of small businesses that have transformed their operations with our comprehensive booking solution.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <FaCheckCircle className="text-primary-600 text-xl flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-soft">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Perfect for Any Business
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>• Salons & Spas</p>
                <p>• Medical Practices</p>
                <p>• Fitness Trainers</p>
                <p>• Consultants</p>
                <p>• Service Providers</p>
                <p>• And many more!</p>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 mt-6 text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200"
              >
                <span>Start Your Free Trial</span>
                <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that have already streamlined their booking process and grown their revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 