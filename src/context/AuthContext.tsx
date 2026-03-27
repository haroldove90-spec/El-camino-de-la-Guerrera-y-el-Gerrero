import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../lib/mockData';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: { name: string; email: string } | null;
  isLoggedIn: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const user = {
    name: role === 'admin' ? 'Dr. Harold Ove' : 
          role === 'medico' ? 'Dra. Elena Martínez' :
          role === 'psicologo' ? 'Lic. Roberto Gómez' :
          role === 'operativo' ? 'Monitor Juan García' : 'Lic. Mariana Vega',
    email: `${role}@clinica.com`
  };

  const login = (newRole: UserRole) => {
    setRole(newRole);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ role, setRole, user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
