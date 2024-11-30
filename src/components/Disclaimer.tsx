import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Disclaimer: React.FC = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4 shadow-sm">
    <div className="flex items-center space-x-2">
      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
      <p className="text-[11px] sm:text-xs text-yellow-700">
        <span className="font-medium">Medical Disclaimer:</span>
        {' '}For informational purposes only. Not a substitute for professional medical advice. Always consult your healthcare provider.
      </p>
    </div>
  </div>
);