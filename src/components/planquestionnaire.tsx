import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { generatePlanQuestions, generatePlan } from '../services/planGenerator';

export type PlanType = 'workout' | 'diet';

interface PlanQuestionnaireProps {
  type: PlanType;
  onPlanGenerated: (plan: string) => void;
}

export const PlanQuestionnaire: React.FC<PlanQuestionnaireProps> = ({
  type,
  onPlanGenerated,
}) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState('');

  const handleGoalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goals.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const generatedQuestions = await generatePlanQuestions(type, goals);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswersSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const plan = await generatePlan(type, goals, answers);
      onPlanGenerated(plan);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (questions.length === 0) {
    return (
      <form onSubmit={handleGoalsSubmit} className="space-y-4">
        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
            What are your {type === 'workout' ? 'fitness' : 'dietary'} goals?
          </label>
          <textarea
            id="goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Please describe your ${type === 'workout' ? 'fitness' : 'dietary'} goals and preferences...`}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !goals.trim()}
          className="w-full bg-blue-900 text-white py-3 px-6 rounded-xl hover:bg-blue-800 
                   transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating questions...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleAnswersSubmit} className="space-y-6">
      {questions.map((question, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {question}
          </label>
          <textarea
            value={answers[question] || ''}
            onChange={(e) => setAnswers(prev => ({
              ...prev,
              [question]: e.target.value
            }))}
            className="w-full h-24 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your answer..."
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={isLoading || questions.some(q => !answers[q]?.trim())}
        className="w-full bg-blue-900 text-white py-3 px-6 rounded-xl hover:bg-blue-800 
                 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating {type} plan...</span>
          </>
        ) : (
          <span>Generate {type === 'workout' ? 'Workout' : 'Diet'} Plan</span>
        )}
      </button>
    </form>
  );
};