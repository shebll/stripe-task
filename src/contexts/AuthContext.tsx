import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthError } from '../types/auth';
import { auth } from '../services/auth';
import { storage } from '../services/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProStatus: (isPro: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProStatus: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.getUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await auth.login(email, password);
      setUser(user);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await auth.signup(email, password);
      setUser(user);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await auth.logout();
      setUser(null);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProStatus = (isPro: boolean) => {
    if (user) {
      const updatedUser = { ...user, isPro };
      setUser(updatedUser);
      storage.setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      signup,
      logout,
      updateProStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);