import React from 'react';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { PlanType } from './PlanQuestionnaire';

interface PlanResultProps {
  plan: string;
  type: PlanType;
  onReset: () => void;
}

export const PlanResult: React.FC<PlanResultProps> = ({ plan, type, onReset }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([plan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Your {type === 'workout' ? 'Workout' : 'Diet'} Plan
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 whitespace-pre-wrap text-gray-700">
        {plan}
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Generate Another Plan</span>
      </button>
    </div>
  );
};