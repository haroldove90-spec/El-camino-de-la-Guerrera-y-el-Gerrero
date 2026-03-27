export type UserRole = 'admin' | 'medico' | 'psicologo' | 'operativo' | 'trabajo_social';

// --- Staff ---
export const MOCK_STAFF = [
  { id: 's1', nombre: 'Dr. Harold Ove', rol: 'admin' as UserRole, email: 'haroldove90@gmail.com' },
  { id: 's2', nombre: 'Dra. Elena Martínez', rol: 'medico' as UserRole, email: 'elena.m@clinica.com' },
  { id: 's3', nombre: 'Lic. Roberto Gómez', rol: 'psicologo' as UserRole, email: 'roberto.g@clinica.com' },
  { id: 's4', nombre: 'Lic. Ana Sofía Ruiz', rol: 'psicologo' as UserRole, email: 'ana.r@clinica.com' },
  { id: 's5', nombre: 'Monitor Juan García', rol: 'operativo' as UserRole, email: 'juan.g@clinica.com' },
  { id: 's6', nombre: 'Monitor Pedro Torres', rol: 'operativo' as UserRole, email: 'pedro.t@clinica.com' },
  { id: 's7', nombre: 'Monitora Lucía López', rol: 'operativo' as UserRole, email: 'lucia.l@clinica.com' },
  { id: 's8', nombre: 'Lic. Mariana Vega', rol: 'trabajo_social' as UserRole, email: 'mariana.v@clinica.com' },
];

// --- Patients ---
export const MOCK_PATIENTS = [
  { id: 'p1', nombre: 'Juan Pérez García', edad: 28, folio: 'CTA-2026-001', estatus: 'Ingresado', cama: '101-A', riesgo: 'estable', beca: 10, diagnostico: 'Trastorno por consumo de sustancias (Opioides)', tratamiento: 'Metadona 20mg/día, Terapia Cognitivo-Conductual' },
  { id: 'p2', nombre: 'Roberto Sánchez', edad: 35, folio: 'CTA-2026-002', estatus: 'Ingresado', cama: '101-B', riesgo: 'observacion', beca: 0, diagnostico: 'Alcoholismo Crónico', tratamiento: 'Disulfiram, Complejo B' },
  { id: 'p3', nombre: 'Carlos Ruiz', edad: 42, folio: 'CTA-2026-003', estatus: 'Ingresado', cama: '102-A', riesgo: 'crisis', beca: 25, diagnostico: 'Policonsumo con rasgos de personalidad límite', tratamiento: 'Quetiapina 100mg, Valproato de Magnesio' },
  { id: 'p4', nombre: 'Miguel Ángel Torres', edad: 21, folio: 'CTA-2026-004', estatus: 'Ingresado', cama: '103-A', riesgo: 'estable', beca: 0, diagnostico: 'Consumo de Estimulantes (Metanfetamina)', tratamiento: 'Fluoxetina 20mg, Terapia de Grupo' },
  { id: 'p5', nombre: 'Fernando López', edad: 31, folio: 'CTA-2026-005', estatus: 'Egregado', cama: '-', riesgo: 'estable', beca: 50, diagnostico: 'Dependencia a Cannabis', tratamiento: 'Alta por cumplimiento de objetivos' },
  { id: 'p6', nombre: 'Santiago Herrera', edad: 25, folio: 'CTA-2026-006', estatus: 'Ingresado', cama: '103-B', riesgo: 'estable', beca: 15, diagnostico: 'Consumo de Inhalantes', tratamiento: 'Terapia Ocupacional, Vitaminas' },
  { id: 'p7', nombre: 'Alejandro Domínguez', edad: 39, folio: 'CTA-2026-007', estatus: 'Baja', cama: '-', riesgo: 'estable', beca: 0, diagnostico: 'Alcoholismo', tratamiento: 'Abandono de tratamiento' },
  { id: 'p8', nombre: 'Daniela Castro', edad: 27, folio: 'CTA-2026-008', estatus: 'Ingresado', cama: '104-A', riesgo: 'observacion', beca: 20, diagnostico: 'Trastorno Dual', tratamiento: 'Sertralina 50mg, Risperidona 1mg' },
  { id: 'p9', nombre: 'Javier Mendoza', edad: 45, folio: 'CTA-2026-009', estatus: 'Egregado', cama: '-', riesgo: 'estable', beca: 0, diagnostico: 'Dependencia a Benzodiacepinas', tratamiento: 'Desintoxicación gradual completada' },
  { id: 'p10', nombre: 'Sofía Valenzuela', edad: 23, folio: 'CTA-2026-010', estatus: 'Ingresado', cama: '104-B', riesgo: 'estable', beca: 10, diagnostico: 'Consumo de Cocaína', tratamiento: 'Terapia de Aceptación y Compromiso' },
];

// --- Evolution Notes ---
export interface Note {
  id: string;
  paciente_id: string;
  autor: string;
  tipo: string;
  contenido: string;
  fecha: string;
  syncStatus?: 'sincronizado' | 'pendiente';
}

export const MOCK_NOTES: Note[] = [
  { id: 'n1', paciente_id: 'p1', autor: 'Dra. Elena Martínez', tipo: 'Médica', contenido: 'Paciente estable, signos vitales dentro de parámetros normales. Se mantiene tratamiento farmacológico.', fecha: '2026-03-20', syncStatus: 'sincronizado' },
  { id: 'n2', paciente_id: 'p1', autor: 'Lic. Roberto Gómez', tipo: 'Psicológica', contenido: 'Sesión individual enfocada en la identificación de disparadores de consumo. Muestra buena disposición.', fecha: '2026-03-21', syncStatus: 'sincronizado' },
  { id: 'n3', paciente_id: 'p3', autor: 'Lic. Ana Sofía Ruiz', tipo: 'Psicológica', contenido: 'Paciente en crisis de ansiedad. Se aplica técnica de contención emocional y se recomienda vigilancia estrecha.', fecha: '2026-03-25', syncStatus: 'sincronizado' },
  { id: 'n4', paciente_id: 'p2', autor: 'Dra. Elena Martínez', tipo: 'Médica', contenido: 'Reporta insomnio persistente. Se ajusta dosis de melatonina para favorecer el descanso nocturno.', fecha: '2026-03-24', syncStatus: 'sincronizado' },
  { id: 'n5', paciente_id: 'p5', autor: 'Lic. Roberto Gómez', tipo: 'Psicológica', contenido: 'Evaluación final previa al egreso. El paciente demuestra herramientas sólidas para la prevención de recaídas.', fecha: '2026-03-15', syncStatus: 'sincronizado' },
  { id: 'n6', paciente_id: 'p1', autor: 'Lic. Mariana Vega', tipo: 'Trabajo Social', contenido: 'Entrevista con la madre del paciente. Se acuerda plan de apoyo familiar post-egreso.', fecha: '2026-03-22', syncStatus: 'sincronizado' },
  { id: 'n7', paciente_id: 'p4', autor: 'Lic. Mariana Vega', tipo: 'Trabajo Social', contenido: 'Gestión de documentos oficiales para el paciente. Trámite de CURP en proceso.', fecha: '2026-03-23', syncStatus: 'pendiente' },
  ...Array.from({ length: 13 }).map((_, i) => ({
    id: `n-extra-${i}`,
    paciente_id: MOCK_PATIENTS[i % 10].id,
    autor: i % 3 === 0 ? 'Dra. Elena Martínez' : i % 3 === 1 ? 'Lic. Roberto Gómez' : 'Lic. Mariana Vega',
    tipo: i % 3 === 0 ? 'Médica' : i % 3 === 1 ? 'Psicológica' : 'Trabajo Social',
    contenido: 'Seguimiento clínico rutinario. Evolución favorable según el plan de tratamiento establecido.',
    fecha: '2026-03-26',
    syncStatus: (i % 5 === 0 ? 'pendiente' : 'sincronizado') as 'pendiente' | 'sincronizado'
  }))
];

// --- Operational Logs ---
export const MOCK_LOGS = [
  { id: 'l1', monitor: 'Juan García', descripcion: 'Ronda de las 02:00 AM completada. Todos los pacientes en sus camas.', nivel: 'informativo', fecha: '2026-03-26T02:00:00Z' },
  { id: 'l2', monitor: 'Pedro Torres', descripcion: 'Paciente Carlos Ruiz (102-A) solicita atención por malestar estomacal.', nivel: 'alerta', fecha: '2026-03-26T04:30:00Z' },
  { id: 'l3', monitor: 'Lucía López', descripcion: 'Ingreso de visita familiar para Juan Pérez. Sin contratiempos.', nivel: 'informativo', fecha: '2026-03-26T10:00:00Z' },
  { id: 'l4', monitor: 'Juan García', descripcion: 'Incidente en comedor: Discusión verbal entre dos pacientes. Se interviene oportunamente.', nivel: 'alerta', fecha: '2026-03-26T14:15:00Z' },
  { id: 'l5', monitor: 'Pedro Torres', descripcion: 'URGENTE: Intento de abandono de tratamiento por parte de Carlos Ruiz. Contenido por staff.', nivel: 'urgente', fecha: '2026-03-26T16:45:00Z' },
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `l-extra-${i}`,
    monitor: MOCK_STAFF[4 + (i % 3)].nombre,
    descripcion: 'Ronda de vigilancia perimetral y de dormitorios concluida sin novedades.',
    nivel: 'informativo',
    fecha: new Date(Date.now() - (i + 1) * 3600000).toISOString()
  }))
];

// --- Payments ---
export const MOCK_PAYMENTS = [
  { id: 'pay1', paciente_id: 'p1', concepto: 'Mensualidad', monto: 12000, fecha: '2026-03-01', estatus: 'Pagado' },
  { id: 'pay2', paciente_id: 'p2', concepto: 'Inscripción', monto: 5000, fecha: '2026-03-05', estatus: 'Pagado' },
  { id: 'pay3', paciente_id: 'p3', concepto: 'Mensualidad', monto: 12000, fecha: '2026-03-10', estatus: 'Pendiente' },
  { id: 'pay4', paciente_id: 'p4', concepto: 'Medicinas', monto: 1500, fecha: '2026-03-15', estatus: 'Pagado' },
  { id: 'pay5', paciente_id: 'p2', concepto: 'Mensualidad', monto: 12000, fecha: '2026-03-15', estatus: 'Vencido' },
  { id: 'pay6', paciente_id: 'p6', concepto: 'Inscripción', monto: 5000, fecha: '2026-03-18', estatus: 'Pagado' },
  { id: 'pay7', paciente_id: 'p8', concepto: 'Mensualidad', monto: 12000, fecha: '2026-03-20', estatus: 'Pendiente' },
  { id: 'pay8', paciente_id: 'p10', concepto: 'Mensualidad', monto: 12000, fecha: '2026-03-22', estatus: 'Pagado' },
  { id: 'pay9', paciente_id: 'p3', concepto: 'Medicinas', monto: 800, fecha: '2026-03-24', estatus: 'Pendiente' },
  { id: 'pay10', paciente_id: 'p1', concepto: 'Medicinas', monto: 450, fecha: '2026-03-25', estatus: 'Pagado' },
];

// --- Analytics Data ---
export const MONTHLY_INCOME = [
  { mes: 'Oct', ingresos: 145000 },
  { mes: 'Nov', ingresos: 168000 },
  { mes: 'Dic', ingresos: 192000 },
  { mes: 'Ene', ingresos: 155000 },
  { mes: 'Feb', ingresos: 175000 },
  { mes: 'Mar', ingresos: 210000 },
];

export const SUCCESS_RATE = [
  { name: 'Éxito (Sobriedad)', value: 65, color: '#10b981' },
  { name: 'Recaída', value: 25, color: '#f43f5e' },
  { name: 'En Proceso', value: 10, color: '#3b82f6' },
];
