import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Crown } from 'lucide-react';

interface ChatLimitProps {
  remainingMessages: number;
}

export const ChatLimit: React.FC<ChatLimitProps> = ({ remainingMessages }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
    <div className="flex items-start space-x-2 sm:space-x-3">
      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs sm:text-sm text-blue-800">
          <span className="font-medium">Free Plan Limit:</span>
          {' '}{remainingMessages} messages remaining today
        </p>
        <Link
          to="/pro"
          className="inline-flex items-center space-x-1.5 sm:space-x-2 mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Upgrade to Pro for unlimited messages</span>
        </Link>
      </div>
    </div>
  </div>
);