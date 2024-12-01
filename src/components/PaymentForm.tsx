import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface PaymentFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  isLoading,
  setIsLoading,
}) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!user) return;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/create-checkout-intent`,
          {
            userId: user.uid,
            email: user.email,
          }
        );
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
        toast.error("Failed to initialize payment. Please try again.");
      }
    };

    createPaymentIntent();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(undefined);

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setIsLoading(false);
        return;
      }
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              email: user?.email,
            },
          },
        },
        // redirect: "if_required",
      });

      if (error) setError(error.message || "Payment failed");
    } catch (err) {
      console.error("Payment submission error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  if (!elements || !clientSecret || !stripe) {
    return (
      <div className="flex items-center justify-center w-full h-[200px]">
        <Loader className=" animate-spin" size={40} />
      </div>
    );
  }

  return (
    <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}

      {error && <div className="mb-2 text-sm text-red-500">{error}</div>}

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className={`
          w-full py-3 rounded-md text-white font-semibold transition-colors
          ${
            isLoading || !stripe
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }
        `}
      >
        {isLoading ? "Processing..." : "Subscribe - $30/month"}
      </button>
    </form>
  );
};

export default PaymentForm;
