import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/mockData';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="p-4 bg-rose-100 rounded-full text-rose-600 mb-6">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Acceso Restringido</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          No tienes los permisos necesarios para acceder a este módulo. 
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>
        <div className="mt-8 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg">
          Rol Requerido: {allowedRoles.join(' / ')}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
