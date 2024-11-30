// Export Firebase configuration
export { auth, db } from '../../config/firebase';

// Export authentication services
export {
  loginUser,
  signupUser,
  logoutUser,
  onAuthChange
} from './auth';

// Export Firestore services
export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  type UserProfile
} from './firestore';