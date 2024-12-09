import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Message } from "../../types";

export interface UserProfile {
  uid: string;
  email: string;
  isPro: boolean;
  isDeluxe: boolean;
  createdAt: Date;
  stripeCustomerId?: string;
  subscriptionId?: string;
}

export const createUserProfile = async (uid: string, email: string) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    uid,
    email,
    isPro: false,
    isDeluxe: false,
    createdAt: serverTimestamp(),
  });
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return {
    uid,
    ...userSnap.data(),
  } as UserProfile;
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export async function saveChatToDatabase(userId: string, messages: Message[]) {
  const chatRef = doc(collection(db, "ChatsCollection"));
  await setDoc(chatRef, {
    userId,
    messages,
    createdAt: Timestamp.now(),
    shared: true,
    upvotes: 0,
    downvotes: 0,
  });
  return chatRef.id; // Return the chat ID
}
