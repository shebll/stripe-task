import { CheckoutSessionRequest, CheckoutSessionResponse, StripeError } from './types';

async function handleResponse(response: Response): Promise<any> {
  if (!response.ok) {
    let errorMessage = 'Failed to create checkout session';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Use default error message if JSON parsing fails
    }
    throw new StripeError(errorMessage);
  }

  try {
    return await response.json();
  } catch {
    throw new StripeError('Invalid response from server');
  }
}

export async function createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
  try {
    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await handleResponse(response);

    if (!data.sessionId) {
      throw new StripeError('Invalid response: missing session ID');
    }

    return { sessionId: data.sessionId };
  } catch (error) {
    if (error instanceof StripeError) {
      throw error;
    }
    throw new StripeError('Failed to create checkout session');
  }
}