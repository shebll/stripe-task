import { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { retryOperation } from '../utils/firebase-utils';

export interface UserProfile {
  email: string;
  isPro: boolean;
  createdAt: Date;
}

export async function createUserProfile(user: FirebaseUser): Promise<void> {
  try {
    await retryOperation(async () => {
      const userRef = doc(db, 'users', user.uid);
      const profile = {
        email: user.email || '',
        isPro: false,
        createdAt: Timestamp.fromDate(new Date())
      };
      await setDoc(userRef, profile);
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile. Please try again.');
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    return await retryOperation(async () => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return null;
      }

      const data = userSnap.data();
      return {
        email: data.email,
        isPro: data.isPro || false,
        createdAt: data.createdAt?.toDate() || new Date()
      };
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to fetch user profile. Please try again.');
  }
}