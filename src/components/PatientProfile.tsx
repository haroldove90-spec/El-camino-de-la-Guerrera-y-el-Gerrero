import React, { useState } from 'react';
import { 
  User, 
  Stethoscope, 
  Brain, 
  History, 
  AlertCircle, 
  PlusCircle, 
  Lock,
  Calendar,
  MapPin,
  Phone,
  Activity,
  FileText,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, MOCK_NOTES } from '../lib/mockData';
import { ExportClinicalSummary } from './ReportGenerator';

interface PatientProfileProps {
  userRole: UserRole;
  patient: {
    id: string;
    nombre: string;
    edad: number;
    folio: string;
    cama: string;
    alergias?: string;
    curp: string;
    procedencia: string;
    contacto: string;
    diagnostico?: string;
    tratamiento?: string;
  };
}

type TabType = 'general' | 'medica' | 'psicologia' | 'bitacora';

export const PatientProfile: React.FC<PatientProfileProps> = ({ userRole, patient }) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [noteContent, setNoteContent] = useState('');

  const tabs = [
    { id: 'general', label: 'General', icon: User, roles: ['admin', 'medico', 'psicologo', 'operativo', 'trabajo_social'] },
    { id: 'medica', label: 'Médica', icon: Stethoscope, roles: ['admin', 'medico'] },
    { id: 'psicologia', label: 'Psicología', icon: Brain, roles: ['admin', 'psicologo'] },
    { id: 'social', label: 'Trabajo Social', icon: HeartHandshake, roles: ['admin', 'trabajo_social'] },
    { id: 'bitacora', label: 'Bitácora', icon: History, roles: ['admin', 'medico', 'psicologo', 'operativo', 'trabajo_social'] },
  ];

  const canAccess = (tabRoles: string[]) => tabRoles.includes(userRole);

  const handleAddNote = (type: string) => {
    if (!noteContent.trim()) return;
    console.log(`Guardando nota de tipo ${type}:`, noteContent);
    setNoteContent('');
    alert('Nota guardada (Simulación)');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header de Información Crítica */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-brand-black rounded-2xl flex items-center justify-center text-brand-gold font-bold text-xl lg:text-2xl shrink-0 border border-brand-gold/20 shadow-xl shadow-brand-black/20">
            {patient.nombre.charAt(0)}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 truncate">{patient.nombre}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs lg:text-sm text-slate-500 font-medium">
              <span>Folio: <span className="text-slate-900">{patient.folio}</span></span>
              <span className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
              <span>Edad: <span className="text-slate-900">{patient.edad} años</span></span>
              <span className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
              <span>Cama: <span className="text-brand-gold font-bold">{patient.cama}</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {patient.alergias && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl border border-red-100 animate-pulse flex-1 sm:flex-none justify-center">
              <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-[10px] lg:text-sm font-bold uppercase tracking-tight">Alerta: {patient.alergias}</span>
            </div>
          )}
          <div className="bg-green-50 text-green-700 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl border border-green-100 text-[10px] lg:text-sm font-bold flex-1 sm:flex-none text-center">
            Estatus: Activo
          </div>
          {(userRole === 'admin' || userRole === 'medico') && (
            <ExportClinicalSummary 
              patient={patient} 
              notes={MOCK_NOTES.filter(n => n.paciente_id === patient.id)} 
            />
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex min-w-full sm:min-w-0 gap-1">
          {tabs.map((tab) => {
            const isAccessible = canAccess(tab.roles);
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => isAccessible && setActiveTab(tab.id as TabType)}
                className={`flex-1 min-w-[100px] sm:min-w-0 flex items-center justify-center gap-2 py-2.5 lg:py-3 px-3 rounded-xl text-xs lg:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-brand-black text-brand-gold shadow-xl shadow-brand-black/20' 
                    : isAccessible 
                      ? 'text-slate-500 hover:bg-slate-50 hover:text-slate-700' 
                      : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                {tab.label}
                {!isAccessible && <Lock className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-gold" />
                  Datos Demográficos
                </h3>
                <div className="space-y-3">
                  <InfoRow icon={Calendar} label="CURP" value={patient.curp} />
                  <InfoRow icon={MapPin} label="Procedencia" value={patient.procedencia} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-500" />
                  Contacto de Emergencia
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm font-medium text-slate-900">{patient.contacto}</p>
                  <p className="text-xs text-slate-500 mt-1">Familiar Directo / Tutor</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'medica' && (
            <motion.div
              key="medica"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Activity} label="Presión Arterial" value="120/80" color="black" />
                <StatCard icon={Activity} label="Frecuencia Card." value="72 lpm" color="red" />
                <StatCard icon={Activity} label="Temperatura" value="36.5 °C" color="orange" />
              </div>
              <NoteForm 
                title="Nueva Nota Médica" 
                placeholder="Describa síntomas, signos vitales o cambios en medicación..."
                value={noteContent}
                onChange={setNoteContent}
                onSave={() => handleAddNote('medica')}
              />
            </motion.div>
          )}

          {activeTab === 'psicologia' && (
            <motion.div
              key="psicologia"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Escala de Motivación (Prochaska)</h3>
                <div className="grid grid-cols-2 sm:flex sm:justify-between items-center gap-2">
                  {['Precontemplación', 'Contemplación', 'Preparación', 'Acción', 'Mantenimiento'].map((stage, i) => (
                    <div key={stage} className={`text-center p-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      i === 2 ? 'bg-brand-black text-white' : 'bg-slate-100 text-slate-400'
                    } ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}>
                      {stage}
                    </div>
                  ))}
                </div>
              </div>
              <NoteForm 
                title="Nota de Evolución Psicológica" 
                placeholder="Registro de sesión, avances terapéuticos o crisis..."
                value={noteContent}
                onChange={setNoteContent}
                onSave={() => handleAddNote('psicologica')}
              />
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Entorno Familiar y Socioeconómico</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Evaluación de la red de apoyo primaria y condiciones de vivienda para el plan de reinserción social.
                </p>
              </div>
              <NoteForm 
                title="Nota de Trabajo Social" 
                placeholder="Registro de visitas, gestiones administrativas o entrevistas familiares..."
                value={noteContent}
                onChange={setNoteContent}
                onSave={() => handleAddNote('social')}
              />
            </motion.div>
          )}

          {activeTab === 'bitacora' && (
            <motion.div
              key="bitacora"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <NoteForm 
                title="Registro de Incidente / Bitácora Diaria" 
                placeholder="Reporte de comportamiento, convivencia o eventos relevantes del día..."
                value={noteContent}
                onChange={setNoteContent}
                onSave={() => handleAddNote('bitacora')}
              />
              <div className="space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Registros Recientes</h4>
                {[1, 2].map(i => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-800">El paciente participó activamente en la dinámica grupal de la mañana.</p>
                      <p className="text-xs text-slate-400 mt-1">Hace 2 horas • Por: Operativo Juan</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => {
  const colors: any = {
    black: 'bg-brand-black text-white border-brand-black/10',
    red: 'bg-red-50 text-red-600 border-red-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };
  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} flex items-center gap-4`}>
      <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase opacity-70">{label}</p>
        <p className="text-xl font-black">{value}</p>
      </div>
    </div>
  );
};

const NoteForm = ({ title, placeholder, value, onChange, onSave }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
    <h3 className="font-bold text-lg text-slate-800 flex items-center justify-between">
      {title}
      <PlusCircle className="w-5 h-5 text-brand-gold" />
    </h3>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-gold outline-none transition-all resize-none text-sm"
      placeholder={placeholder}
    />
    <div className="flex justify-end">
      <button 
        onClick={onSave}
        className="bg-brand-black text-white px-6 py-2 rounded-xl font-bold hover:bg-brand-surface transition-all shadow-lg shadow-brand-black/20"
      >
        Guardar Nota
      </button>
    </div>
  </div>
);
