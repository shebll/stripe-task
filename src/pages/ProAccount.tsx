import React, { useEffect, useRef, useState } from 'react';
import { Crown, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProAccount: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded && buttonContainerRef.current) {
      const stripeButton = document.createElement('stripe-buy-button');
      stripeButton.setAttribute('buy-button-id', 'buy_btn_1QQ7LBGuEHc4ZQvQlawnRKm6');
      stripeButton.setAttribute('publishable-key', 'pk_test_51QPS8zGuEHc4ZQvQrSAarmHxaqVYHAgf6D4Q5gqWCwen8Xzq5EQWU5na6LegaHt8sUgQycmzEOulCpCej4cgvKBz00sLVTfmOj');
      
      buttonContainerRef.current.innerHTML = '';
      buttonContainerRef.current.appendChild(stripeButton);
    }
  }, [isScriptLoaded]);

  const features = [
    'Unlimited health consultations',
    'Priority response time',
    'Detailed health insights',
    'Personalized wellness plans',
    'Access to specialist knowledge base',
    'Regular health check-in reminders',
  ];

  if (userProfile?.isPro) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
            <Crown className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're a Pro Member!
          </h1>
          <p className="text-gray-600">
            Enjoy unlimited access to all premium features
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
          <Crown className="w-8 h-8 text-blue-900" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upgrade to HealthChat Pro
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get unlimited access to advanced health insights and personalized wellness guidance
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-8">
          <div className="flex items-baseline justify-center mb-8">
            <span className="text-5xl font-bold text-gray-900">$30</span>
            <span className="text-gray-600 ml-2">/month</span>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {user ? (
            <div 
              ref={buttonContainerRef}
              className="mt-6 min-h-[42px] flex justify-center items-center"
            >
              {!isScriptLoaded && (
                <div className="animate-pulse bg-gray-200 rounded-xl w-full h-[42px]" />
              )}
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600">Please log in to upgrade to Pro</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProAccount;