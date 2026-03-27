import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { User, Activity, Bed, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

// Esquema de validación con Zod
const admissionSchema = z.object({
  // Paso 1: Datos Generales
  nombre_completo: z.string().min(3, "El nombre es demasiado corto"),
  curp: z.string().length(18, "El CURP debe tener 18 caracteres"),
  fecha_nacimiento: z.string().min(1, "Fecha requerida"),
  contacto_emergencia: z.string().min(5, "Contacto requerido"),
  procedencia: z.string().min(3, "Procedencia requerida"),
  
  // Paso 2: Perfil de Consumo
  sustancia_principal: z.string().min(1, "Seleccione una sustancia"),
  edad_inicio: z.number().min(5, "Edad no válida").max(99),
  es_reingreso: z.boolean(),
  
  // Paso 3: Logística
  cama_id: z.string().min(1, "Seleccione una cama"),
  tipo_ingreso: z.enum(['voluntario', 'involuntario']),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

const STEPS = [
  { id: 1, title: 'Datos Generales', icon: User },
  { id: 2, title: 'Consumo Inicial', icon: Activity },
  { id: 3, title: 'Asignación', icon: Bed },
];

// Mock de camas disponibles
const MOCK_CAMAS = [
  { id: 'c1', numero: '101-A', habitacion: 'Habitación 1' },
  { id: 'c2', numero: '101-B', habitacion: 'Habitación 1' },
  { id: 'c3', numero: '102-A', habitacion: 'Habitación 2' },
  { id: 'c4', numero: '102-B', habitacion: 'Habitación 2' },
];

export const AdmissionStepper: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
    setValue
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      es_reingreso: false,
      edad_inicio: 18,
      sustancia_principal: '',
      tipo_ingreso: undefined,
      cama_id: '',
    }
  });

  const nextStep = async () => {
    const fields = step === 1 
      ? ['nombre_completo', 'curp', 'fecha_nacimiento', 'contacto_emergencia', 'procedencia']
      : ['sustancia_principal', 'edad_inicio', 'es_reingreso'];
    
    const isValid = await trigger(fields as any);
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const onSubmit = (data: AdmissionFormData) => {
    console.log('Datos de Admisión:', data);
    // Aquí iría la lógica de Supabase para insertar paciente y actualizar cama
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-200 text-center max-w-lg mx-auto"
      >
        <div className="w-20 h-20 bg-brand-black text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-black/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-display font-light text-brand-black mb-2 tracking-tight">¡Admisión Exitosa!</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">El paciente ha sido registrado y la cama asignada correctamente en el sistema.</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-premium px-8 py-3"
        >
          Nueva Admisión
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-0">
      {/* Step Tracker */}
      <div className="mb-8 lg:mb-12">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          {STEPS.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 border-2 border-slate-200'
              }`}>
                <s.icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <span className={`mt-2 text-[10px] lg:text-xs font-bold uppercase tracking-wider ${
                step >= s.id ? 'text-blue-600' : 'text-slate-400'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 lg:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg lg:text-xl font-bold text-slate-800 border-b pb-4">Datos Generales del Paciente</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                    <input 
                      {...register('nombre_completo')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Ej. Juan Pérez García"
                    />
                    {errors.nombre_completo && <p className="mt-1 text-xs text-red-500">{errors.nombre_completo.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">CURP</label>
                    <input 
                      {...register('curp')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase"
                      placeholder="18 caracteres"
                    />
                    {errors.curp && <p className="mt-1 text-xs text-red-500">{errors.curp.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha de Nacimiento</label>
                    <input 
                      type="date"
                      {...register('fecha_nacimiento')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    {errors.fecha_nacimiento && <p className="mt-1 text-xs text-red-500">{errors.fecha_nacimiento.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Contacto de Emergencia</label>
                    <input 
                      {...register('contacto_emergencia')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Nombre y Teléfono"
                    />
                    {errors.contacto_emergencia && <p className="mt-1 text-xs text-red-500">{errors.contacto_emergencia.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Procedencia</label>
                    <input 
                      {...register('procedencia')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Ciudad / Estado"
                    />
                    {errors.procedencia && <p className="mt-1 text-xs text-red-500">{errors.procedencia.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg lg:text-xl font-bold text-slate-800 border-b pb-4">Perfil de Consumo Inicial</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Sustancia Principal</label>
                    <select 
                      {...register('sustancia_principal')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="alcohol">Alcohol</option>
                      <option value="metanfetaminas">Metanfetaminas</option>
                      <option value="cannabis">Cannabis</option>
                      <option value="cocaina">Cocaína</option>
                      <option value="opioides">Opioides</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.sustancia_principal && <p className="mt-1 text-xs text-red-500">{errors.sustancia_principal.message}</p>}
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Edad de Inicio de Consumo</label>
                    <input 
                      type="number"
                      {...register('edad_inicio', { valueAsNumber: true })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    {errors.edad_inicio && <p className="mt-1 text-xs text-red-500">{errors.edad_inicio.message}</p>}
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <input 
                      type="checkbox"
                      id="es_reingreso"
                      {...register('es_reingreso')}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="es_reingreso" className="text-sm font-medium text-slate-700 cursor-pointer">
                      ¿Es un reingreso del paciente?
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg lg:text-xl font-bold text-slate-800 border-b pb-4">Asignación Logística</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Seleccionar Cama Disponible</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                      {MOCK_CAMAS.map((cama) => (
                        <label 
                          key={cama.id}
                          className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            watch('cama_id') === cama.id 
                              ? 'border-brand-gold bg-brand-black/5 ring-2 ring-brand-gold/20' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input 
                            type="radio"
                            value={cama.id}
                            {...register('cama_id')}
                            className="sr-only"
                          />
                          <span className="font-bold text-slate-900">{cama.numero}</span>
                          <span className="text-xs text-slate-500">{cama.habitacion}</span>
                          {watch('cama_id') === cama.id && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-5 h-5 text-brand-gold" />
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.cama_id && <p className="mt-2 text-xs text-red-500">{errors.cama_id.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Estatus de Ingreso</label>
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                      <button
                        type="button"
                        onClick={() => setValue('tipo_ingreso', 'voluntario')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                          watch('tipo_ingreso') === 'voluntario'
                            ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Voluntario
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('tipo_ingreso', 'involuntario')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                          watch('tipo_ingreso') === 'involuntario'
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Involuntario
                      </button>
                    </div>
                    {errors.tipo_ingreso && <p className="mt-2 text-xs text-red-500">{errors.tipo_ingreso.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="px-5 lg:px-8 py-5 lg:py-6 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-black text-white px-8 py-2.5 rounded-xl font-bold hover:bg-brand-surface shadow-xl shadow-brand-black/20 transition-all"
            >
              Siguiente
              <ChevronRight className="w-5 h-5 text-brand-gold" />
            </button>
          ) : (
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-black text-white px-10 py-2.5 rounded-xl font-bold hover:bg-brand-surface shadow-xl shadow-brand-black/20 transition-all"
            >
              Finalizar Admisión
              <CheckCircle2 className="w-5 h-5 text-brand-gold" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
