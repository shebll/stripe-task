import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { getFirebaseErrorMessage } from "../utils/firebase-errors";

export function useProStatus(user: User | null) {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsPro(false);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (doc) => {
        setIsPro(doc.data()?.isPro || false);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching pro status:", error);
        setError(getFirebaseErrorMessage(error.code));
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { isPro, isLoading, error };
}
