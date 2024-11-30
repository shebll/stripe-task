import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { generateCarePlanQuestions, generateCarePlan } from '../services/openai';

const CarePlan: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [carePlan, setCarePlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'symptoms' | 'questions' | 'plan'>('symptoms');

  const handleSymptomsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const generatedQuestions = await generateCarePlanQuestions(symptoms);
      setQuestions(generatedQuestions);
      setStep('questions');
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
      const plan = await generateCarePlan(symptoms, answers);
      setCarePlan(plan);
      setStep('plan');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate care plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Personal Care Plan Generator
          </h1>

          {step === 'symptoms' && (
            <form onSubmit={handleSymptomsSubmit} className="space-y-4">
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your symptoms
                </label>
                <textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please describe your symptoms in detail..."
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !symptoms.trim()}
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
          )}

          {step === 'questions' && (
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
                    <span>Generating care plan...</span>
                  </>
                ) : (
                  <span>Generate Care Plan</span>
                )}
              </button>
            </form>
          )}

          {step === 'plan' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    This care plan is for informational purposes only. Always consult with healthcare professionals for medical advice.
                  </p>
                </div>
              </div>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {carePlan}
                </div>
              </div>
              <button
                onClick={() => {
                  setStep('symptoms');
                  setSymptoms('');
                  setQuestions([]);
                  setAnswers({});
                  setCarePlan('');
                }}
                className="mt-6 w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 
                         transition-colors duration-200"
              >
                Start New Care Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CarePlan;