export interface CheckoutSessionRequest {
  userId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
}

export class StripeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StripeError';
  }
}