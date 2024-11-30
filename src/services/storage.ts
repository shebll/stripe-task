import { User } from '../types/auth';

const USER_STORAGE_KEY = 'healthchat_user';

export const storage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};