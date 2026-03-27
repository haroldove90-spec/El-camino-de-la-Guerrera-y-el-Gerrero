import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { RoleSwitcher } from './components/RoleSwitcher';
import { AdmissionStepper } from './components/AdmissionStepper';
import { PatientProfile } from './components/PatientProfile';
import { OperationalModule } from './components/OperationalModule';
import { FinanceModule } from './components/FinanceModule';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './lib/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserPlus, 
  LayoutDashboard, 
  User as UserIcon, 
  Menu, 
  ClipboardList, 
  DollarSign,
  ChevronDown,
  ShieldCheck,
  LogOut,
  ArrowRight,
  Stethoscope,
  Brain,
  Users,
  Activity,
  WifiOff,
  Download
} from 'lucide-react';

// --- Hook for Online Status ---
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

type View = 'dashboard' | 'admission' | 'profile' | 'operations' | 'finanzas';

const LandingPage = () => {
  const { login } = useAuth();

  const roles: { id: UserRole; label: string; icon: any; description: string; color: string }[] = [
    { 
      id: 'admin', 
      label: 'Administrador', 
      icon: ShieldCheck, 
      description: 'Gestión total, finanzas y reportes críticos.',
      color: 'from-brand-gold to-amber-900'
    },
    { 
      id: 'medico', 
      label: 'Médico', 
      icon: Stethoscope, 
      description: 'Expedientes clínicos, diagnósticos y recetas.',
      color: 'from-slate-400 to-slate-600'
    },
    { 
      id: 'psicologo', 
      label: 'Psicólogo', 
      icon: Brain, 
      description: 'Notas de evolución y seguimiento terapéutico.',
      color: 'from-slate-700 to-slate-900'
    },
    { 
      id: 'operativo', 
      label: 'Operativo', 
      icon: Activity, 
      description: 'Bitácora diaria, mapa de camas e incidentes.',
      color: 'from-brand-gold/40 to-brand-gold/60'
    },
    { 
      id: 'trabajo_social', 
      label: 'Trabajo Social', 
      icon: Users, 
      description: 'Admisión, familias y gestión de becas.',
      color: 'from-slate-200 to-slate-400'
    },
  ];

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-brand-gold" />
          <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Sistema de Gestión Integral</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-display font-light text-white mb-4 tracking-tight">
          El camino del <span className="italic text-brand-gold">Guerrero</span>
        </h1>
        <p className="text-white/40 text-lg max-w-2xl mx-auto font-light">
          Seleccione su perfil para acceder al centro de control y gestión de pacientes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl w-full relative z-10">
        {roles.map((r, index) => (
          <motion.button
            key={r.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => login(r.id)}
            className="group relative flex flex-col items-start p-6 bg-white/5 border border-white/10 rounded-3xl text-left transition-all duration-500 hover:bg-white/10 hover:border-brand-gold/50 hover:-translate-y-1 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${r.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
            
            <div className="p-3 bg-white/5 rounded-xl mb-4 group-hover:bg-brand-gold/20 transition-colors duration-500">
              <r.icon className="w-6 h-6 text-white group-hover:text-brand-gold transition-colors" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1">{r.label}</h3>
            <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-2">{r.description}</p>
            
            <div className="mt-auto flex items-center gap-2 text-brand-gold text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-5px] group-hover:translate-x-0">
              Acceder <ArrowRight className="w-3 h-3" />
            </div>
          </motion.button>
        ))}
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold"
      >
        © 2026 Clínica de Rehabilitación • Versión 2.5
      </motion.p>
    </div>
  );
};

const DashboardContent = () => {
  const { role, user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mockPatient = {
    id: 'p1',
    nombre: 'Juan Pérez García',
    edad: 28,
    folio: 'CTA-2026-001',
    cama: '101-A',
    alergias: 'Penicilina',
    curp: 'PEGA980101HDFRRS01',
    procedencia: 'Ciudad de México, CDMX',
    contacto: 'María García (Madre) - 555-0123-456',
    diagnostico: 'Trastorno por consumo de sustancias (Opioides)',
    tratamiento: 'Metadona 20mg/día, Terapia Cognitivo-Conductual'
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
      <Sidebar 
        role={role} 
        userName={user?.name} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onViewChange={(view) => {
          setCurrentView(view as View);
          setIsSidebarOpen(false);
        }}
        currentView={currentView}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-brand-black flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-0.5">Módulo de Gestión</p>
              <h2 className="text-lg lg:text-xl font-display font-light text-white truncate">
                {currentView === 'dashboard' ? 'Panel de Control' : 
                 currentView === 'admission' ? 'Admisión de Paciente' : 
                 currentView === 'operations' ? 'Módulo Operativo y Seguridad' : 
                 currentView === 'finanzas' ? 'Finanzas y Analítica' : 'Expediente Clínico'}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-6">
            <div className="hidden xl:flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  currentView === 'dashboard' ? 'bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20' : 'text-white/40 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('admission')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  currentView === 'admission' ? 'bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20' : 'text-white/40 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Admisión
              </button>
              <button 
                onClick={() => setCurrentView('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  currentView === 'profile' ? 'bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20' : 'text-white/40 hover:text-white'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Expediente
              </button>
              <button 
                onClick={() => setCurrentView('operations')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  currentView === 'operations' ? 'bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20' : 'text-white/40 hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Operaciones
              </button>
              <button 
                onClick={() => setCurrentView('finanzas')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  currentView === 'finanzas' ? 'bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20' : 'text-white/40 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Finanzas
              </button>
            </div>

            <div className="hidden sm:block h-8 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <RoleSwitcher />
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar bg-[#F8F9FA]">
          {currentView === 'dashboard' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] mb-2">Resumen General</p>
                  <h1 className="text-4xl lg:text-5xl font-display font-light text-brand-black tracking-tight">
                    Bienvenido de nuevo, <span className="italic">{user?.name}</span>
                  </h1>
                </div>
                <button 
                  onClick={() => setCurrentView('admission')}
                  className="btn-premium flex items-center justify-center gap-3"
                >
                  <UserPlus className="w-5 h-5" />
                  Nueva Admisión
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                <div className="card-premium group">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pacientes Activos</p>
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-brand-black group-hover:text-white transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-5xl font-display font-light text-brand-black">24</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    +2 esta semana
                  </div>
                </div>
                
                <div className="card-premium group">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Camas Disponibles</p>
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-brand-black group-hover:text-white transition-colors">
                      <LayoutDashboard className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-5xl font-display font-light text-brand-gold">06</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    Capacidad al 80%
                  </div>
                </div>

                <div className="card-premium group">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Ingresos Hoy</p>
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-brand-black group-hover:text-white transition-colors">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-5xl font-display font-light text-emerald-600">03</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    Último hace 2 horas
                  </div>
                </div>
              </div>

              <div className="card-premium overflow-hidden !p-0">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-display text-2xl font-light">Pacientes Recientes</h3>
                    <p className="text-xs text-slate-400 font-medium">Últimos ingresos registrados en el sistema</p>
                  </div>
                  <button className="text-[10px] font-bold text-brand-black uppercase tracking-widest hover:text-brand-gold transition-colors">Ver todos</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                      <tr>
                        <th className="px-8 py-4">Paciente</th>
                        <th className="px-8 py-4">Folio</th>
                        <th className="px-8 py-4">Cama</th>
                        <th className="px-8 py-4">Estatus</th>
                        <th className="px-8 py-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => setCurrentView('profile')}>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-black text-white flex items-center justify-center font-bold text-xs">
                              {mockPatient.nombre.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900">{mockPatient.nombre}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-slate-400 text-xs font-bold tracking-wider">{mockPatient.folio}</td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {mockPatient.cama}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            Activo
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 text-slate-300 group-hover:text-brand-black transition-colors">
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentView === 'admission' && (
            <ProtectedRoute allowedRoles={['admin', 'medico', 'trabajo_social']}>
              <AdmissionStepper />
            </ProtectedRoute>
          )}
          
          {currentView === 'profile' && (
            <ProtectedRoute allowedRoles={['admin', 'medico', 'psicologo', 'trabajo_social']}>
              <PatientProfile userRole={role} patient={mockPatient} />
            </ProtectedRoute>
          )}

          {currentView === 'operations' && (
            <ProtectedRoute allowedRoles={['admin', 'operativo', 'medico', 'psicologo']}>
              <OperationalModule />
            </ProtectedRoute>
          )}

          {currentView === 'finanzas' && (
            <ProtectedRoute allowedRoles={['admin']}>
              <FinanceModule />
            </ProtectedRoute>
          )}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const AppContent = () => {
  const { isLoggedIn } = useAuth();
  const isOnline = useOnlineStatus();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DashboardContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Notification */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-rose-500/50 backdrop-blur-md"
          >
            <WifiOff className="w-5 h-5 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">Sin conexión a internet</span>
              <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Modo Offline Activado</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[200] bg-brand-black border border-brand-gold/30 text-white p-6 rounded-3xl shadow-2xl max-w-xs backdrop-blur-xl"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-brand-gold/10 rounded-2xl">
                <Download className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Instalar Aplicación</h4>
                <p className="text-xs text-white/40 mt-1">Accede más rápido y trabaja sin conexión instalando la app.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleInstall}
                className="flex-1 bg-brand-gold text-brand-black py-2.5 rounded-xl text-xs font-bold hover:bg-white transition-colors"
              >
                Instalar
              </button>
              <button 
                onClick={() => setShowInstallPrompt(false)}
                className="flex-1 bg-white/5 text-white/60 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
              >
                Después
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
