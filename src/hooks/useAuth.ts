// import { useState, useEffect } from 'react';
// import { User } from 'firebase/auth';
// import { onAuthChange, getUserProfile, UserProfile } from '../services/firebase';
// //
// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthChange(async (user) => {
//       setUser(user);

//       if (user) {
//         try {
//           const profile = await getUserProfile(user.uid);
//           setUserProfile(profile);
//         } catch (error) {
//           console.error('Error loading user profile:', error);
//         }
//       } else {
//         setUserProfile(null);
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return { user, userProfile, loading };
// }
