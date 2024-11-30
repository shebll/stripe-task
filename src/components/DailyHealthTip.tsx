import React, { useEffect, useState } from 'react';
import { Lightbulb, Crown } from 'lucide-react';
import { generateDailyHealthTip } from '../services/openai';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const DailyHealthTip: React.FC = () => {
  const [tip, setTip] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTip = async () => {
      if (!user?.isPro) {
        setIsLoading(false);
        return;
      }

      try {
        const lastTipDate = localStorage.getItem('healthchat_last_tip_date');
        const storedTip = localStorage.getItem('healthchat_daily_tip');
        const today = new Date().toDateString();

        if (lastTipDate === today && storedTip) {
          setTip(storedTip);
        } else {
          const newTip = await generateDailyHealthTip();
          setTip(newTip);
          localStorage.setItem('healthchat_daily_tip', newTip);
          localStorage.setItem('healthchat_last_tip_date', today);
        }
      } catch (error) {
        console.error('Error fetching daily tip:', error);
        setTip('Stay healthy and take care of yourself today!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTip();
  }, [user?.isPro]);

  if (!user?.isPro) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-blue-100">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className="flex-shrink-0 p-1.5 sm:p-2 bg-blue-100 rounded-md sm:rounded-lg">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-medium text-blue-900 mb-0.5 sm:mb-1">
              Pro Feature: Daily Health Tips
            </h3>
            <p className="text-xs sm:text-sm text-blue-800 mb-2">
              Receive personalized daily health tips and reminders to maintain a healthy lifestyle.
            </p>
            <Link
              to="/pro"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              <span>Upgrade to Pro</span>
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-3 sm:p-4">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-blue-100">
      <div className="flex items-start space-x-2 sm:space-x-3">
        <div className="flex-shrink-0 p-1.5 sm:p-2 bg-blue-100 rounded-md sm:rounded-lg">
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-medium text-blue-900 mb-0.5 sm:mb-1">
            Your Daily Health Tip
          </h3>
          <p className="text-xs sm:text-sm text-blue-800">{tip}</p>
        </div>
      </div>
    </div>
  );
};