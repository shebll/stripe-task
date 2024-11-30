import { getStripe } from './config';
import { createCheckoutSession } from './api';
import { StripeError } from './types';

export async function initiateCheckout(userId: string): Promise<void> {
  if (!userId) {
    throw new StripeError('User ID is required');
  }

  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new StripeError('Failed to initialize Stripe');
    }

    const { sessionId } = await createCheckoutSession({ userId });
    
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw new StripeError(error.message || 'Checkout redirect failed');
    }
  } catch (error) {
    if (error instanceof StripeError) {
      throw error;
    }
    throw new StripeError('Failed to start checkout process');
  }
}