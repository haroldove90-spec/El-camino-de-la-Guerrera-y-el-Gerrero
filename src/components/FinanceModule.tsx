import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Search, 
  Plus, 
  Filter,
  Download,
  CreditCard,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_PAYMENTS, MOCK_PATIENTS, MONTHLY_INCOME, SUCCESS_RATE } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';

export const FinanceModule: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // --- Calculations ---
  const totalIncome = MONTHLY_INCOME[MONTHLY_INCOME.length - 1].ingresos;
  const pendingBalance = MOCK_PAYMENTS
    .filter(p => p.estatus === 'Pendiente' || p.estatus === 'Vencido')
    .reduce((acc, curr) => acc + curr.monto, 0);
  
  const occupationRate = 85; // Mocked KPI

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter(p => {
      const patient = MOCK_PATIENTS.find(pat => pat.id === p.paciente_id);
      const matchesSearch = patient?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.concepto.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || p.estatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pagado': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pendiente': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Vencido': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <ArrowUpRight className="w-4 h-4" />
              +12%
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ingresos (Marzo)</p>
          <p className="text-3xl font-black text-slate-900">${totalIncome.toLocaleString()}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-rose-600 text-xs font-bold">
              <ArrowDownRight className="w-4 h-4" />
              -5%
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Saldo Pendiente</p>
          <p className="text-3xl font-black text-slate-900">${pendingBalance.toLocaleString()}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-50 rounded-2xl text-brand-black">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ocupación Actual</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-slate-900">{occupationRate}%</p>
            <p className="text-xs text-slate-400 mb-1 font-medium">24/28 Camas</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Becas Aplicadas</p>
          <p className="text-3xl font-black text-slate-900">12%</p>
        </motion.div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Ingresos Mensuales</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_INCOME}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="ingresos" fill="var(--color-brand-gold)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Tasa de Éxito vs Recaída</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SUCCESS_RATE}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SUCCESS_RATE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payments Management */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Control de Pagos</h3>
              <p className="text-sm text-slate-500">Gestión de ingresos y cobranza</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-gold transition-all"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-gold transition-all"
              >
                <option value="Todos">Todos los estatus</option>
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Vencido">Vencido</option>
              </select>
              <button className="bg-brand-black text-white px-6 py-2 rounded-xl font-bold text-sm shadow-xl shadow-brand-black/20 hover:bg-brand-surface transition-all flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-gold" />
                Registrar Pago
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Paciente</th>
                <th className="px-8 py-4">Concepto</th>
                <th className="px-8 py-4">Monto</th>
                <th className="px-8 py-4">Fecha</th>
                <th className="px-8 py-4">Estatus</th>
                <th className="px-8 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((payment) => {
                const patient = MOCK_PATIENTS.find(p => p.id === payment.paciente_id);
                return (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                          {patient?.nombre.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{patient?.nombre}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600">{payment.concepto}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-900">${payment.monto.toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm text-slate-500">{payment.fecha}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(payment.estatus)}`}>
                        {payment.estatus}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <button className="p-2 text-slate-400 hover:text-brand-gold transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scholarship Section */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-gold/20 rounded-lg text-brand-gold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Gestión de Becas y Apoyos</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Aplique descuentos o apoyos económicos a familias de escasos recursos. 
              El sistema recalculará automáticamente los saldos pendientes y generará los reportes fiscales correspondientes.
            </p>
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex-1 lg:w-64">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Buscar Paciente</label>
              <input 
                type="text"
                placeholder="Nombre o Folio..."
                className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <div className="lg:w-32">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">% Beca</label>
              <input 
                type="number"
                placeholder="0"
                className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <button className="mt-6 bg-brand-black text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-black/20 hover:bg-brand-surface transition-all">
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
