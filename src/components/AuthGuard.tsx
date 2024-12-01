import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requirePro?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requirePro = false,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requirePro && !user?.isPro) {
    return <Navigate to="/pro" />;
  }

  return <>{children}</>;
};
