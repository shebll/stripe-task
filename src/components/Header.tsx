import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, LogIn, UserPlus, Crown, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b-2 border-blue-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2.5 bg-blue-50 rounded-xl">
              <Stethoscope className="w-5 h-5 sm:w-7 sm:h-7 text-blue-900" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-blue-900 tracking-tight">
                HealthChat
              </h1>
              <p className="hidden sm:block text-sm text-blue-600">
                Your AI Health Assistant
              </p>
            </div>
          </Link>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden sm:block">
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-900 rounded-full">
                Powered by AI
              </span>
            </div>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/pro"
                  className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 
                           bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl
                           hover:from-blue-800 hover:to-blue-700 transition-colors duration-200 shadow-sm"
                >
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium">Upgrade to Pro</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 
                           bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                           transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 
                           bg-blue-900 text-white rounded-xl hover:bg-blue-800 
                           transition-colors duration-200 shadow-sm"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium">Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 
                           bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                           transition-colors duration-200"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};