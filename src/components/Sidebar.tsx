import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Brain, 
  ClipboardList, 
  Settings, 
  LogOut,
  DollarSign,
  ShieldCheck,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type UserRole = 'admin' | 'medico' | 'psicologo' | 'operativo' | 'trabajo_social';

interface SidebarProps {
  role: UserRole;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
  onViewChange: (view: string) => void;
  currentView: string;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  roles: UserRole[];
  view: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'medico', 'psicologo', 'operativo', 'trabajo_social'],
    view: 'dashboard',
  },
  {
    title: 'Pacientes',
    icon: Users,
    roles: ['admin', 'medico', 'psicologo', 'operativo', 'trabajo_social'],
    view: 'profile',
  },
  {
    title: 'Clínica',
    icon: Stethoscope,
    roles: ['admin', 'medico', 'psicologo'],
    view: 'profile',
  },
  {
    title: 'Psicología',
    icon: Brain,
    roles: ['admin', 'psicologo'],
    view: 'profile',
  },
  {
    title: 'Trabajo Social',
    icon: Users,
    roles: ['admin', 'trabajo_social'],
    view: 'profile',
  },
  {
    title: 'Finanzas',
    icon: DollarSign,
    roles: ['admin'],
    view: 'finanzas',
  },
  {
    title: 'Operaciones',
    icon: ClipboardList,
    roles: ['admin', 'operativo'],
    view: 'operations',
  },
  {
    title: 'Configuración',
    icon: Settings,
    roles: ['admin'],
    view: 'dashboard',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ role, userName = "Usuario", isOpen, onClose, onViewChange, currentView }) => {
  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-brand-black text-white/60 border-r border-white/5 flex flex-col transition-transform duration-500 transform
        lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header / Logo */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-brand-gold p-2.5 rounded-2xl shadow-lg shadow-brand-gold/20">
              <ShieldCheck className="w-6 h-6 text-brand-black" />
            </div>
            <div>
              <h1 className="font-display font-light text-white text-xl leading-tight">Clínica</h1>
              <p className="text-[10px] text-brand-gold uppercase tracking-[0.2em] font-bold">El Camino</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-white/40 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-8 py-6 mb-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-[1.5rem] border border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold flex items-center justify-center text-brand-black font-bold text-lg shadow-inner">
              {userName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-brand-gold uppercase tracking-widest font-bold">{role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-2 space-y-2 overflow-y-auto custom-scrollbar-dark">
          <p className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Menú Principal</p>
          {filteredMenu.map((item) => {
            const isActive = currentView === item.view;
            return (
              <motion.button
                key={item.title}
                onClick={() => onViewChange(item.view)}
                whileHover={{ x: 4 }}
                className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white text-brand-black shadow-xl shadow-white/5' 
                    : 'hover:bg-white/5 text-white/40 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-brand-black' : 'text-white/20 group-hover:text-brand-gold'
                }`} />
                <span className="text-sm font-bold tracking-wide">{item.title}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 bg-brand-gold rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/5">
          <button className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 font-bold text-sm">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};
