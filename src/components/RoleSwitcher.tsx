import React, { useState } from 'react';
import { ShieldCheck, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/mockData';

export const RoleSwitcher = () => {
  const { role, setRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { id: UserRole; label: string }[] = [
    { id: 'admin', label: 'Administrador' },
    { id: 'medico', label: 'Médico' },
    { id: 'psicologo', label: 'Psicólogo' },
    { id: 'operativo', label: 'Operativo' },
    { id: 'trabajo_social', label: 'Trabajo Social' },
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
      >
        <ShieldCheck className="w-3 h-3 text-brand-gold" />
        {role}
        <ChevronDown className="w-3 h-3" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-brand-surface border border-brand-border rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${
                  role === r.id ? 'bg-brand-gold/10 text-brand-gold' : 'hover:bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
