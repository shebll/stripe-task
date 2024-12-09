import React from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  LogIn,
  UserPlus,
  Crown,
  LogOut,
  Share,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  console.log(user);

  const handleManageBilling = async () => {
    try {
      const response = await fetch("/.netlify/functions/billingportal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: user?.stripeCustomerId,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      window.location.href = data.url;
    } catch (error) {
      console.error("There was an error!", error);
      alert("Failed to redirect to the billing portal.");
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-blue-900">
      <div className="max-w-6xl px-4 py-3 mx-auto sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2.5 bg-blue-50 rounded-xl">
              <Stethoscope className="w-5 h-5 text-blue-900 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-blue-900 sm:text-2xl">
                HealthChat
              </h1>
              <p className="hidden text-sm text-blue-600 sm:block">
                Your AI Health Assistant
              </p>
            </div>
            <div className="hidden sm:block">
              <span className="px-3 py-1 text-xs font-medium text-blue-900 bg-blue-100 rounded-full">
                Powered by AI
              </span>
            </div>
          </Link>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/share-chats"
                  className="flex items-center space-x-1 px-2 py-2 sm:py-2.5 "
                >
                  <Share className="w-4 h-4" />
                  <span className="text-sm underline">Shared Chats</span>
                </Link>

                {user.isPro || user.isDeluxe ? (
                  <button
                    onClick={handleManageBilling}
                    className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 
                           bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl
                           hover:from-blue-800 hover:to-blue-700 transition-colors duration-200 shadow-sm"
                  >
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm font-medium sm:text-base">
                      Mange Plan
                    </span>
                  </button>
                ) : (
                  <Link
                    to="/pro"
                    className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 
                           bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl
                           hover:from-blue-800 hover:to-blue-700 transition-colors duration-200 shadow-sm"
                  >
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm font-medium sm:text-base">
                      Upgrade to Pro
                    </span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 
                           bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                           transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm font-medium sm:text-base">
                    Logout
                  </span>
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
                  <span className="text-sm font-medium sm:text-base">
                    Login
                  </span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 
                           bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                           transition-colors duration-200"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm font-medium sm:text-base">
                    Sign Up
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
