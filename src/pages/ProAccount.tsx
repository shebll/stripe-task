import React from "react";
import { Crown, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import StripeCheckoutForm from "../components/stripe-checkout-form";

const ProAccount: React.FC = () => {
  const { user } = useAuth();
  console.log(user);

  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // const handleSubscribe = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Call the Netlify function
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_API_URL}/api/create-checkout`,
  //       {
  //         userId: user?.id,
  //         email: user?.email,
  //       }
  //     );
  //     const { url } = response.data;

  //     // Redirect to Stripe Checkout
  //     if (url) {
  //       console.log(url);
  //       window.location.href = url;
  //     } else {
  //       throw new Error("No checkout URL returned");
  //     }
  //   } catch (err: any) {
  //     console.error("Error starting subscription:", err);
  //     setError(
  //       err.response?.data?.error ||
  //         "Failed to start subscription. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const features = [
    "Unlimited health consultations",
    "Priority response time",
    "Detailed health insights",
    "Personalized wellness plans",
    "Access to specialist knowledge base",
    "Regular health check-in reminders",
  ];

  if (user?.isPro) {
    return (
      <main className="max-w-4xl px-4 py-8 mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-green-100 rounded-full">
            <Crown className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
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
    <main className="max-w-4xl px-4 py-8 mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-2 mb-4 bg-blue-100 rounded-full">
          <Crown className="w-8 h-8 text-blue-900" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Upgrade to HealthChat Pro
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          Get unlimited access to advanced health insights and personalized
          wellness guidance
        </p>
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
        <div className="flex flex-col gap-10 p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-baseline justify-center ">
              <span className="text-5xl font-bold text-gray-900">$30</span>
              <span className="ml-2 text-gray-600">/month</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-xl font-semibold text-gray-800">
                Upgrade to Pro
              </h1>
              <p className="text-center text-gray-600">
                Get access to premium features and support by subscribing to
                HealthChat Pro.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 lg:flex-row ">
            <div className="mb-8 space-y-4">
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
              <StripeCheckoutForm />
            ) : (
              <div className="p-4 text-center bg-gray-50 rounded-xl">
                <p className="text-gray-600">Please log in to upgrade to Pro</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProAccount;
