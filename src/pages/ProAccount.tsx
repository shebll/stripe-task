import React, { useState } from "react";
import { Crown, Check, Settings, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Plans } from "../utils/Plans";

const ProAccount: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<"Pro" | "Deluxe">("Pro");

  const currentPlan = Plans[selectedPlan];

  if (user?.isPro || user?.isDeluxe) {
    return (
      <main className="max-w-4xl px-4 py-8 mx-auto">
        <div className="text-center ">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-green-100 rounded-full">
            <Crown className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            You're a Pro Member!
          </h1>
          <p className="text-gray-600">
            Enjoy unlimited access to all premium features
          </p>
          <div className="max-w-md p-6 mx-auto mt-20 bg-white border rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <Settings className="w-10 h-10 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Manage Your Plan
                </h2>
                <p className="text-sm text-gray-600">
                  Easily upgrade, downgrade, or cancel your subscription. Track
                  all your invoices and download them as PDFs.
                </p>
              </div>
            </div>
            <button
              // onClick={handleManageBilling}
              className="flex items-center justify-center w-full px-4 py-2 mt-6 text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <span className="font-medium">Go to Dashboard</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl px-4 py-8 mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-2 mb-4 bg-blue-100 rounded-full">
          <Crown className="w-8 h-8 text-blue-900" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Upgrade Your Plan
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          Choose the plan that best fits your wellness journey.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 p-8 overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
        {/* Tabs for Plan Selection */}
        <div className="flex items-center w-full gap-2">
          {Object.keys(Plans).map((plan) => (
            <button
              key={plan}
              onClick={() => setSelectedPlan(plan as "Pro" | "Deluxe")}
              className={`px-4 w-full py-2 font-semibold transition-all rounded-lg ${
                selectedPlan === plan
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {plan}
            </button>
          ))}
        </div>
        <div className="flex flex-col w-full gap-10 ">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-baseline justify-center ">
              <span className="text-5xl font-bold text-gray-900">
                ${currentPlan.price}
              </span>
              <span className="ml-2 text-gray-600">/month</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-xl font-semibold text-gray-800">
                Upgrade to {selectedPlan}
              </h1>
              <p className="text-center text-gray-600">
                Unlock {selectedPlan} benefits to take your health journey to
                the next level.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 ">
            <div className="mb-8 space-y-4">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Check className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            {user ? (
              <a
                href={`${currentPlan.link}?prefilled_email=${user.email}`}
                className="px-4 py-2 font-bold text-center text-white bg-blue-600 rounded-md"
              >
                Subscribe
              </a>
            ) : (
              // <StripeCheckoutForm plan={currentPlan} />
              <div className="p-4 text-center bg-gray-50 rounded-xl">
                <p className="text-gray-600">
                  Please log in to upgrade your plan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProAccount;
