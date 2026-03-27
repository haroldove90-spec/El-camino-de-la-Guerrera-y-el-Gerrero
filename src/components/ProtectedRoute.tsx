import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/mockData';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // Bypassing role protection for development/testing as requested
  return <>{children}</>;
};
