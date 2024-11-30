import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Loader2, CheckCircle } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          isPro: true,
          updatedAt: new Date()
        });
        
        await refreshProfile();
        setTimeout(() => {
          setIsProcessing(false);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }, 1500);
      } catch (error) {
        console.error('Error updating pro status:', error);
        setError('Failed to update subscription status. Please contact support.');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [user, navigate, refreshProfile]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/pro')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Pro page
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        {isProcessing ? (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processing your payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your subscription...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to HealthChat Pro!
            </h2>
            <p className="text-gray-600">
              Your account has been upgraded successfully.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default PaymentSuccess;