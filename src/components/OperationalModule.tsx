import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bed, 
  User, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Clock, 
  Search, 
  Filter,
  Phone,
  X,
  Send,
  MoreVertical,
  FileText,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { ExportIncidentReport } from './ReportGenerator';

// --- Types ---

type RiskLevel = 'estable' | 'observacion' | 'crisis';
type AlertLevel = 'informativo' | 'alerta' | 'urgente';

interface Patient {
  id: string;
  nombre: string;
  foto?: string;
  riesgo: RiskLevel;
  contactoEmergencia: string;
  telefonoEmergencia: string;
}

interface BedInfo {
  id: string;
  numero: string;
  habitacion: string;
  paciente?: Patient;
}

interface LogEntry {
  id: string;
  paciente_id?: string;
  paciente_nombre?: string;
  monitor_id: string;
  monitor_nombre: string;
  descripcion: string;
  nivel_alerta: AlertLevel;
  created_at: string;
}

// --- Mock Data ---

const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', nombre: 'Juan Pérez García', riesgo: 'estable', contactoEmergencia: 'María García (Madre)', telefonoEmergencia: '555-0123' },
  { id: 'p2', nombre: 'Roberto Sánchez', riesgo: 'observacion', contactoEmergencia: 'Ana Sánchez (Hermana)', telefonoEmergencia: '555-0124' },
  { id: 'p3', nombre: 'Carlos Ruiz', riesgo: 'crisis', contactoEmergencia: 'Elena Ruiz (Esposa)', telefonoEmergencia: '555-0125' },
  { id: 'p4', nombre: 'Miguel Ángel Torres', riesgo: 'estable', contactoEmergencia: 'Pedro Torres (Padre)', telefonoEmergencia: '555-0126' },
  { id: 'p5', nombre: 'Fernando López', riesgo: 'estable', contactoEmergencia: 'Lucía López (Hija)', telefonoEmergencia: '555-0127' },
];

const MOCK_BEDS: BedInfo[] = [
  { id: 'b1', numero: '101-A', habitacion: 'Habitación 101', paciente: MOCK_PATIENTS[0] },
  { id: 'b2', numero: '101-B', habitacion: 'Habitación 101', paciente: MOCK_PATIENTS[1] },
  { id: 'b3', numero: '102-A', habitacion: 'Habitación 102', paciente: MOCK_PATIENTS[2] },
  { id: 'b4', numero: '102-B', habitacion: 'Habitación 102', paciente: undefined },
  { id: 'b5', numero: '103-A', habitacion: 'Habitación 103', paciente: MOCK_PATIENTS[3] },
  { id: 'b6', numero: '103-B', habitacion: 'Habitación 103', paciente: MOCK_PATIENTS[4] },
  { id: 'b7', numero: '104-A', habitacion: 'Habitación 104', paciente: undefined },
  { id: 'b8', numero: '104-B', habitacion: 'Habitación 104', paciente: undefined },
];

const INITIAL_LOGS: LogEntry[] = [
  { 
    id: 'l1', 
    monitor_id: 'm1', 
    monitor_nombre: 'Monitor García', 
    descripcion: 'Ronda nocturna sin novedades en pasillo A.', 
    nivel_alerta: 'informativo', 
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() 
  },
  { 
    id: 'l2', 
    paciente_id: 'p3',
    paciente_nombre: 'Carlos Ruiz',
    monitor_id: 'm1', 
    monitor_nombre: 'Monitor García', 
    descripcion: 'Paciente 102-A presenta agitación psicomotriz leve.', 
    nivel_alerta: 'alerta', 
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() 
  },
];

// --- Panic Button Component ---
const PanicFAB = ({ onPanic }: { onPanic: () => void }) => {
  // Bypassing role check for development as requested
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onPanic}
      className="fixed bottom-24 right-6 z-[150] w-16 h-16 bg-brand-black text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-brand-gold lg:bottom-8 lg:right-8 group overflow-hidden"
    >
      <div className="absolute inset-0 bg-brand-gold opacity-0 group-hover:opacity-10 transition-opacity" />
      <ShieldAlert className="w-8 h-8 text-brand-gold" />
    </motion.button>
  );
};

// --- Components ---

export const OperationalModule: React.FC = () => {
  const { user } = useAuth();
  const [beds] = useState<BedInfo[]>(MOCK_BEDS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [newEntry, setNewEntry] = useState('');
  const [selectedBed, setSelectedBed] = useState<BedInfo | null>(null);
  const [filter, setFilter] = useState<AlertLevel | 'todos'>('todos');
  const [showPanicModal, setShowPanicModal] = useState(false);

  // Simulación de Realtime
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular una entrada aleatoria cada cierto tiempo para demostrar "realtime"
      if (Math.random() > 0.8) {
        const randomPatient = MOCK_PATIENTS[Math.floor(Math.random() * MOCK_PATIENTS.length)];
        const autoLog: LogEntry = {
          id: Math.random().toString(36).substr(2, 9),
          paciente_id: randomPatient.id,
          paciente_nombre: randomPatient.nombre,
          monitor_id: 'sys',
          monitor_nombre: 'Sistema Central',
          descripcion: `Actualización automática: Signos vitales estables para ${randomPatient.nombre}.`,
          nivel_alerta: 'informativo',
          created_at: new Date().toISOString()
        };
        setLogs(prev => [autoLog, ...prev]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    const entry: LogEntry = {
      id: Date.now().toString(),
      monitor_id: 'm1',
      monitor_nombre: user?.name || 'Monitor de Turno',
      descripcion: newEntry,
      nivel_alerta: 'informativo', // Por defecto informativo desde el input rápido
      created_at: new Date().toISOString()
    };

    setLogs(prev => [entry, ...prev]);
    setNewEntry('');
  };

  const handlePanic = (type: string) => {
    const entry: LogEntry = {
      id: Date.now().toString(),
      monitor_id: 'm1',
      monitor_nombre: user?.name || 'Monitor de Turno',
      descripcion: `ALERTA DE PÁNICO: ${type}`,
      nivel_alerta: 'urgente',
      created_at: new Date().toISOString()
    };
    setLogs(prev => [entry, ...prev]);
    setShowPanicModal(false);
  };

  const filteredLogs = useMemo(() => {
    if (filter === 'todos') return logs;
    return logs.filter(l => l.nivel_alerta === filter);
  }, [logs, filter]);

  const getRiskColor = (riesgo?: RiskLevel) => {
    switch (riesgo) {
      case 'estable': return 'bg-emerald-500';
      case 'observacion': return 'bg-amber-500';
      case 'crisis': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  const getAlertStyles = (nivel: AlertLevel) => {
    switch (nivel) {
      case 'informativo': return 'border-l-brand-gold bg-brand-black/5 text-slate-600';
      case 'alerta': return 'border-l-amber-400 bg-amber-50/30 text-slate-700 font-medium';
      case 'urgente': return 'border-l-rose-500 bg-rose-50/40 text-rose-900 font-bold animate-pulse';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full lg:h-[calc(100vh-120px)] overflow-y-auto lg:overflow-hidden pb-20 lg:pb-0">
      
      {/* Columna Izquierda: Mapa de Camas */}
      <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-white rounded-3xl p-4 lg:p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Mapa de Camas</h2>
              <p className="text-sm text-slate-500">Control de ocupación y riesgo</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Estable
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Obs.
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-rose-500" /> Crisis
              </div>
            </div>
          </div>

          {/* Grid de Camas con Scroll Horizontal en Móvil */}
          <div className="flex lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 snap-x snap-mandatory">
            {beds.map((bed) => (
              <motion.button
                key={bed.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBed(bed)}
                className={`relative min-w-[160px] lg:min-w-0 p-4 rounded-2xl border-2 transition-all text-left group snap-start ${
                  bed.paciente 
                    ? 'bg-white border-slate-100 shadow-sm hover:border-brand-gold/30' 
                    : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-slate-100 px-2 py-1 rounded-lg text-[10px] font-black text-slate-500">
                    {bed.numero}
                  </div>
                  {bed.paciente && (
                    <div className={`w-3 h-3 rounded-full shadow-sm ${getRiskColor(bed.paciente.riesgo)}`} />
                  )}
                </div>

                {bed.paciente ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-brand-black">
                        <User className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{bed.paciente.nombre}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">{bed.habitacion}</p>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center text-slate-400">
                    <Bed className="w-6 h-6 mb-1 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Disponible</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Resumen Operativo Rápido */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Camas Ocupadas</p>
            <p className="text-2xl font-black text-emerald-700">6/8</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">En Observación</p>
            <p className="text-2xl font-black text-amber-700">1</p>
          </div>
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
            <p className="text-[10px] font-bold text-rose-600 uppercase mb-1">Críticos</p>
            <p className="text-2xl font-black text-rose-700">1</p>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Bitácora de Turno */}
      <div className="lg:col-span-5 flex flex-col bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[400px]">
        {/* Header Bitácora */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-gold" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">Bitácora de Turno</h2>
                </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
              <ExportIncidentReport logs={logs} />
              <div className="flex gap-1">
                {(['todos', 'informativo', 'alerta', 'urgente'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all whitespace-nowrap ${
                      filter === f 
                        ? 'bg-brand-gold text-brand-black' 
                        : 'text-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleAddEntry} className="relative">
            <input 
              type="text"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="¿Qué sucedió ahora?"
              className="w-full bg-slate-800 border-none rounded-xl py-4 pl-4 pr-12 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-brand-gold outline-none transition-all min-h-[44px]"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-gold hover:text-white transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Lista de Logs (Estilo Terminal) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar-dark">
          <AnimatePresence initial={false}>
            {filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl border-l-4 transition-all ${getAlertStyles(log.nivel_alerta)}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                      [{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                    </span>
                    <span className="text-[10px] font-bold text-brand-gold">
                      @{log.monitor_nombre.split(' ')[1] || log.monitor_nombre}
                    </span>
                  </div>
                  {log.nivel_alerta === 'urgente' && <ShieldAlert className="w-3 h-3 text-rose-500" />}
                  {log.nivel_alerta === 'alerta' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                </div>
                <p className="text-xs leading-relaxed">
                  {log.paciente_nombre && (
                    <span className="font-bold mr-1 text-brand-gold">[{log.paciente_nombre}]:</span>
                  )}
                  {log.descripcion}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-600">
              <Search className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-xs font-medium">No hay registros con este filtro</p>
            </div>
          )}
        </div>
      </div>

      {/* FAB de Pánico */}
      <PanicFAB onPanic={() => setShowPanicModal(true)} />

      {/* Modal de Pánico Rápido */}
      <AnimatePresence>
        {showPanicModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPanicModal(false)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                <ShieldAlert className="text-rose-600" /> ALERTA RÁPIDA
              </h3>
              <p className="text-sm text-slate-500 mb-6">Selecciona el tipo de incidente para reporte inmediato.</p>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Intento de Fuga', color: 'bg-rose-600' },
                  { label: 'Crisis Médica', color: 'bg-rose-600' },
                  { label: 'Altercado Físico', color: 'bg-amber-600' },
                  { label: 'Negativa de Alimentos', color: 'bg-slate-700' }
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handlePanic(btn.label)}
                    className={`w-full py-4 ${btn.color} text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowPanicModal(false)}
                className="w-full mt-6 py-3 text-slate-400 font-bold text-sm"
              >
                Cancelar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Quick View de Cama */}
      <AnimatePresence>
        {selectedBed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBed(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${getRiskColor(selectedBed.paciente?.riesgo)}`}>
                      {selectedBed.paciente ? selectedBed.paciente.nombre.charAt(0) : '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {selectedBed.paciente ? selectedBed.paciente.nombre : 'Cama Vacía'}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">{selectedBed.numero} • {selectedBed.habitacion}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedBed(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {selectedBed.paciente ? (
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Contacto de Emergencia</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <User className="w-4 h-4 text-slate-600" />
                          </div>
                          <p className="text-sm font-bold text-slate-700">{selectedBed.paciente.contactoEmergencia}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Phone className="w-4 h-4 text-brand-gold" />
                          </div>
                          <p className="text-sm font-bold text-brand-gold">{selectedBed.paciente.telefonoEmergencia}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-brand-black text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-brand-black/20 hover:bg-brand-surface transition-all min-h-[44px]">
                        Ver Expediente
                      </button>
                      <button className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all min-h-[44px]">
                        Cambiar Cama
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <Bed className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Esta cama está disponible para un nuevo ingreso.</p>
                    <button className="mt-6 bg-brand-black text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-brand-black/20 min-h-[44px]">
                      Asignar Paciente
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default OperationalModule;
