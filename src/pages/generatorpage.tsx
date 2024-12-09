import React, { useState } from "react";
import { AlertTriangle, Dumbbell, Utensils, ArrowRight } from "lucide-react";
import { PlanQuestionnaire, PlanType } from "../components/planquestionnaire";
import { PlanResult } from "../components/planresults";

const CarePlan: React.FC = () => {
  const [planType, setPlanType] = useState<PlanType | null>(null);
  const [step, setStep] = useState<"select" | "questionnaire" | "plan">(
    "select"
  );
  const [generatedPlan, setGeneratedPlan] = useState<string>("");

  const handlePlanGenerated = (plan: string) => {
    setGeneratedPlan(plan);
    setStep("plan");
  };

  const resetPlan = () => {
    setPlanType(null);
    setGeneratedPlan("");
    setStep("select");
  };

  return (
    <main className="max-w-4xl px-4 py-8 mx-auto">
      <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-2xl">
        <div className="p-6">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Personalized Plan Generator
          </h1>

          {step === "select" && (
            <div className="space-y-6">
              <p className="text-gray-600">
                Choose the type of plan you'd like to generate:
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  onClick={() => {
                    setPlanType("workout");
                    setStep("questionnaire");
                  }}
                  className="flex items-center p-6 transition-colors duration-200 border-2 border-gray-200 rounded-xl hover:border-blue-500 group"
                >
                  <div className="p-3 transition-colors duration-200 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                    <Dumbbell className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="font-semibold text-gray-900">
                      Workout Plan
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get a customized exercise routine
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-blue-500" />
                </button>

                <button
                  onClick={() => {
                    setPlanType("diet");
                    setStep("questionnaire");
                  }}
                  className="flex items-center p-6 transition-colors duration-200 border-2 border-gray-200 rounded-xl hover:border-blue-500 group"
                >
                  <div className="p-3 transition-colors duration-200 bg-green-100 rounded-lg group-hover:bg-green-200">
                    <Utensils className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="font-semibold text-gray-900">Diet Plan</h3>
                    <p className="text-sm text-gray-600">
                      Get a personalized meal plan
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-green-500" />
                </button>
              </div>
            </div>
          )}

          {step === "questionnaire" && planType && (
            <PlanQuestionnaire
              type={planType}
              onPlanGenerated={handlePlanGenerated}
            />
          )}

          {step === "plan" && (
            <PlanResult
              plan={generatedPlan}
              type={planType!}
              onReset={resetPlan}
            />
          )}

          <div className="mt-6">
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  This plan is for informational purposes only. Consult with
                  healthcare professionals before starting any new workout or
                  diet program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CarePlan;
