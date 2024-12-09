import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";

// Ensure the publishable key is loaded securely
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeCheckoutForm = ({
  plan,
  price,
  priceId,
}: {
  plan: string;
  priceId: string;
  price: number;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex-1 w-full">
      <h2 className="mb-4 text-xl font-bold text-start">
        Subscribe to {plan} Plan
      </h2>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "subscription",
          currency: "gbp",
          amount: price * 100,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#0570de",
              colorBackground: "#ffffff",
              borderRadius: "8px",
            },
          },
        }}
      >
        <PaymentForm
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          planId={priceId}
        />
      </Elements>
    </div>
  );
};

export default StripeCheckoutForm;
