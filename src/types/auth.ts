export interface User {
  id: string;
  email: string;
  isPro: boolean;
  createdAt: Date;
}

export interface AuthError {
  code: string;
  message: string;
}