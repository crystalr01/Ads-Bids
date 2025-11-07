import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Eye, DollarSign, Shield, Zap, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Ad Bids</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-indigo-600 font-semibold hover:text-indigo-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            The Smart Way to Advertise & Earn
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect advertisers with viewers through a transparent, bid-based platform.
            Advertisers pay per view, viewers earn for sharing.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition text-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition text-lg"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Advertiser Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-100">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Advertisers</h3>
            <p className="text-gray-600 mb-6">
              Create targeted ads with flexible budgets. Pay only for real, verified views.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Set your own bid per view</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Control your total budget</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Track views in real-time</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">One view per device guarantee</span>
              </li>
            </ul>
          </div>

          {/* Viewer Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Viewers</h3>
            <p className="text-gray-600 mb-6">
              Share ads and earn money for every unique view. Simple and transparent.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Earn for each unique view</span>
              </li>
              <li className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Get unique share links</span>
              </li>
              <li className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">View highest-paying ads first</span>
              </li>
              <li className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Track your earnings instantly</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">1. Sign Up</h4>
              <p className="text-gray-600">
                Choose your role: Advertiser to create ads or Viewer to earn money
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">2. Create or Share</h4>
              <p className="text-gray-600">
                Advertisers create ads with bids, viewers get unique share links
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">3. Track & Earn</h4>
              <p className="text-gray-600">
                Monitor views and earnings in real-time with automatic updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2024 Ad Bids Platform. Built with Firebase, React, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
