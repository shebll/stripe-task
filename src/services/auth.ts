// import { User, AuthError } from '../types/auth';
// import { storage } from './storage';

// class AuthService {
//   async login(email: string, password: string): Promise<User> {
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       const user: User = {
//         id: crypto.randomUUID(),
//         email,
//         isPro: false,
//         createdAt: new Date()
//       };

//       storage.setUser(user);
//       return user;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async signup(email: string, password: string): Promise<User> {
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       const user: User = {
//         id: crypto.randomUUID(),
//         email,
//         isPro: false,
//         createdAt: new Date()
//       };

//       storage.setUser(user);
//       return user;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async logout(): Promise<void> {
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 500));
//       storage.removeUser();
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   private handleError(error: unknown): AuthError {
//     if (error instanceof Error) {
//       return {
//         code: 'auth/unknown',
//         message: error.message
//       };
//     }
//     return {
//       code: 'auth/unknown',
//       message: 'An unknown error occurred'
//     };
//   }
// }

// export const auth = new AuthService();
