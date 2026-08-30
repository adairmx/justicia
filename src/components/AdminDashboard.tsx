import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  PhoneCall, 
  FileSignature, 
  DollarSign, 
  Scale, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  BarChart3, 
  PieChart, 
  Flame, 
  Building2, 
  MapPin, 
  Activity, 
  Calendar, 
  Play, 
  Pause, 
  Headphones, 
  Award, 
  Filter, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { LegalCase, Stats, CallRecord } from '../types';

interface AdminDashboardProps {
  cases: LegalCase[];
  stats: Stats;
  onSwitchToAgentView: (role: 'LINER' | 'CLOSER') => void;
  onSelectCase: (caseItem: LegalCase) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  cases,
  stats,
  onSwitchToAgentView,
  onSelectCase
}) => {
  const [timeframe, setTimeframe] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'ALL'>('TODAY');
  const [activeAudioCallId, setActiveAudioCallId] = useState<string | null>(null);

  // Compute rich analytics from cases
  const totalCases = cases.length;
  const workersCompCases = cases.filter(c => c.caseType === 'Workers_Comp').length;
  const personalInjuryCases = cases.filter(c => c.caseType === 'Personal_Injury').length;
  const signedCases = cases.filter(c => c.status === 'FIRMA_COMPLETADA' || c.status === 'EN_TRATAMIENTO_MEDICO').length;
  const inCloserQueue = cases.filter(c => c.status === 'CALIFICADO_PARA_CLOSER' || c.status === 'EN_LLAMADA_CLOSER').length;
  const retainersSent = cases.filter(c => c.retainer !== null).length;

  // Agent Performance Roster
  const agentsData = [
    {
      name: "Maria G.",
      role: "Liner (Venezuela)",
      avatar: "MG",
      callsHandled: 24,
      intakesCompleted: 18,
      qualifiedRate: "75.0%",
      avgHandleTime: "3m 42s",
      qualityScore: "98/100",
      status: "ONLINE",
      commissionEarned: "$360"
    },
    {
      name: "Carlos V.",
      role: "Liner (Venezuela)",
      avatar: "CV",
      callsHandled: 18,
      intakesCompleted: 10,
      qualifiedRate: "55.5%",
      avgHandleTime: "4m 10s",
      qualityScore: "92/100",
      status: "IN_CALL",
      commissionEarned: "$200"
    },
    {
      name: "Adair (Humano / Closer)",
      role: "Lead Closer & Master",
      avatar: "AD",
      callsHandled: 14,
      intakesCompleted: 14,
      qualifiedRate: "85.7%",
      avgHandleTime: "8m 15s",
      qualityScore: "100/100",
      status: "ONLINE",
      commissionEarned: "$3,450"
    },
    {
      name: "Adair AI Clone (Hermes 3)",
      role: "Autonomous AI Closer",
      avatar: "AI",
      callsHandled: 32,
      intakesCompleted: 32,
      qualifiedRate: "81.2%",
      avgHandleTime: "6m 30s",
      qualityScore: "99/100",
      status: "ACTIVE_24_7",
      commissionEarned: "$7,200 (Ahorro Ops)"
    }
  ];

  // Employer Injury Hotspots
  const employerHotspots = [
    { name: "Amazon Logistics Warehouses", location: "Ontario / San Bernardino, CA", count: 8, avgValue: "$65,000", riskLevel: "Alto" },
    { name: "Fresh Produce Packaging Inc.", location: "Vernon / East LA, CA", count: 5, avgValue: "$45,000", riskLevel: "Medio" },
    { name: "FedEx Ground Distribution", location: "Fontana, CA", count: 4, avgValue: "$70,000", riskLevel: "Alto" },
    { name: "Target Supply Chain Centers", location: "Rialto, CA", count: 3, avgValue: "$55,000", riskLevel: "Medio" }
  ];

  // Top In-Call Objections Log
  const objectionsLog = [
    { objection: "Miedo a despido o represalia patronal", occurrences: 19, rebuttalSuccessRate: "94.7%", legalBasis: "Código Laboral CA § 132a" },
    { objection: "Preocupación por estatus migratorio / Sin documentos", occurrences: 14, rebuttalSuccessRate: "100%", legalBasis: "Protección Universal Workers' Comp" },
    { objection: "Duda sobre costo / Cobro por adelantado", occurrences: 11, rebuttalSuccessRate: "90.9%", legalBasis: "Esquema de Contingencia 15%" },
    { objection: "La empresa ya me mandó a su clínica y me dio de alta", occurrences: 8, rebuttalSuccessRate: "87.5%", legalBasis: "Derecho a Segunda Opinión / QME" }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1800px] mx-auto pb-12">
      
      {/* Top Welcome & Quick Switcher Banner */}
      <div className="bg-gradient-to-r from-[#0d1527] via-[#0e1b38] to-[#121128] border border-slate-800/90 rounded-3xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Executive Command & Intelligence
            </span>
            <span className="text-xs text-slate-400 font-mono">Bilingual Legal Operations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-['Outfit'] mt-1 tracking-tight">
            Panel Central de Analíticas & Auditoría
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Control de embudo en tiempo real: desde el primer timbrado de intake con operadores en Venezuela hasta el cierre de contratos Retainer en vivo.
          </p>
        </div>

        {/* Quick Actions & Agent Workspace Launcher */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Timeframe Filter */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-semibold">
            {(['TODAY', 'WEEK', 'MONTH', 'ALL'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === t
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'TODAY' ? 'Hoy' : t === 'WEEK' ? 'Esta Semana' : t === 'MONTH' ? 'Este Mes' : 'Histórico'}
              </button>
            ))}
          </div>

          {/* Jump into Agent Seat Button */}
          <button
            onClick={() => onSwitchToAgentView('CLOSER')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-950/50 active:scale-95 transition-all"
          >
            <Headphones className="w-4 h-4" />
            <span>Operar como Agente (Softphone & Cierre)</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Pipeline Value */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor Cartera en Cierre</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white font-mono">$1,280,000</h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-400 font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+24.5% vs semana anterior</span>
            </div>
          </div>
        </div>

        {/* Card 2: Retainers Signed On-Call */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Retainers Firmados (In-Call)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileSignature className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono">{stats.retainersSignedOnCall}</h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-400 font-semibold">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Tasa de Cierre en Línea: {stats.conversionRate}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Speed-to-Lead & Total Calls */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Llamadas Gestionadas</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white font-mono">{stats.totalCallsToday}</h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-blue-400 font-semibold">
              <Clock className="w-4 h-4" />
              <span>Speed-to-Lead: &lt; 8 segundos</span>
            </div>
          </div>
        </div>

        {/* Card 4: Liner to Closer Conversion */}
        <div className="bg-[#0b101d] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pase Calificado (Warm Transfer)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl md:text-3xl font-extrabold text-purple-300 font-mono">
              {stats.closersTransferred} / {stats.intakeQualified}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-purple-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>78.5% Calificación efectiva</span>
            </div>
          </div>
        </div>

      </div>

      {/* OPERATORS & AGENTS PERFORMANCE MATRIX */}
      <div className="bg-[#0c121e] border border-slate-800/90 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Matriz de Desempeño de Operadores & Closers (Humanos + IA)</span>
            </h2>
            <p className="text-xs text-slate-400">Monitoreo de tiempos de atención, tasa de calificación y contratos firmados por agente.</p>
          </div>

          <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            4 Agentes en Turno
          </span>
        </div>

        {/* Agent Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Agente / Rol</th>
                <th className="pb-3 px-3">Estado</th>
                <th className="pb-3 px-3 text-center">Llamadas</th>
                <th className="pb-3 px-3 text-center">Intakes / Cierres</th>
                <th className="pb-3 px-3 text-center">Tasa Conversión</th>
                <th className="pb-3 px-3 text-center">AHT (Tiempo Promedio)</th>
                <th className="pb-3 px-3 text-center">Auditoría QA</th>
                <th className="pb-3 px-3 text-right">Comisión / Ahorro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {agentsData.map((agent, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  
                  {/* Name & Role */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center ${
                        agent.avatar === 'AI' 
                          ? 'bg-purple-950 text-purple-300 border border-purple-500/40 shadow-sm'
                          : 'bg-slate-800 text-amber-400 border border-slate-700'
                      }`}>
                        {agent.avatar}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{agent.name}</span>
                        <span className="text-[10px] text-slate-400">{agent.role}</span>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      agent.status === 'ONLINE' || agent.status === 'ACTIVE_24_7'
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        : 'bg-amber-950/80 text-amber-400 border-amber-500/40 animate-pulse'
                    }`}>
                      {agent.status === 'ACTIVE_24_7' ? 'IA 24/7' : agent.status === 'IN_CALL' ? 'En Llamada' : 'Disponible'}
                    </span>
                  </td>

                  {/* Calls Handled */}
                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-300">
                    {agent.callsHandled}
                  </td>

                  {/* Intakes / Cierres */}
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-amber-300">
                    {agent.intakesCompleted}
                  </td>

                  {/* Qualified Rate */}
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-400">
                    {agent.qualifiedRate}
                  </td>

                  {/* AHT */}
                  <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                    {agent.avgHandleTime}
                  </td>

                  {/* QA Score */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold text-blue-300">
                      {agent.qualityScore}
                    </span>
                  </td>

                  {/* Commission */}
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">
                    {agent.commissionEarned}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TWO COLUMN GRID: EMPLOYERS HOTSPOTS & OBJECTIONS INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Box: Employer Accident Hotspots */}
        <div className="bg-[#0c121e] border border-slate-800/90 rounded-3xl p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Patrones con Mayor Incidencia de Lesiones (Hotspots)</span>
            </h3>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              California / Texas
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {employerHotspots.map((emp, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{emp.name}</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span>{emp.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-amber-400 font-mono block">{emp.count} Reclamos</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Prom: {emp.avgValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Box: In-Call Objection Intelligence */}
        <div className="bg-[#0c121e] border border-slate-800/90 rounded-3xl p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Efectividad de Rebate de Objeciones (Know-How Cloned)</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              93.2% Global
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {objectionsLog.map((obj, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{obj.objection}</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    {obj.rebuttalSuccessRate} Éxito
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{obj.occurrences} menciones detectadas en llamadas</span>
                  <span className="text-amber-400 font-medium">{obj.legalBasis}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT CALLS & QA AUDIT PLAYER */}
      <div className="bg-[#0c121e] border border-slate-800/90 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-purple-400" />
            <span>Auditoría de Llamadas & Transcripciones en Vivo (Twilio Recordings)</span>
          </h2>
          <span className="text-xs text-slate-400">Grabaciones con canal dual y evaluación automática</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Call 1 */}
          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Carlos Ramirez (Amazon Warehouse)</span>
                <span className="text-[11px] text-slate-400 font-mono">+1 (818) 555-0192 • Duración: 5m 12s</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                FIRMADO ON-CALL
              </span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 font-mono leading-relaxed max-h-24 overflow-y-auto">
              <p><strong className="text-blue-400">Liner:</strong> "¿Tu supervisor te dio el reporte DWC-1?"</p>
              <p><strong className="text-amber-400">Carlos:</strong> "No, me dijo que si metía reclamo me quitaban las horas."</p>
              <p><strong className="text-purple-400">Closer Adair:</strong> "Carlos, el código 132a te protege al 100%. Te acabo de mandar el Retainer por SMS, ábrelo mientras seguimos en la línea..."</p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Agente: Adair (Closer)</span>
              <button
                onClick={() => setActiveAudioCallId(activeAudioCallId === '1' ? null : '1')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg"
              >
                {activeAudioCallId === '1' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                <span>{activeAudioCallId === '1' ? 'Pausar Audio' : 'Escuchar Grabación'}</span>
              </button>
            </div>
          </div>

          {/* Call 2 */}
          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Michael Johnson (T-Bone Collision)</span>
                <span className="text-[11px] text-slate-400 font-mono">+1 (213) 555-0188 • Duración: 7m 15s</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700">
                IA AUTÓNOMA CERRADA
              </span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 font-mono leading-relaxed max-h-24 overflow-y-auto">
              <p><strong className="text-purple-400">Adair AI Clone:</strong> "Michael, you shouldn't pay a single dollar upfront. We operate strictly on contingency."</p>
              <p><strong className="text-amber-400">Michael:</strong> "Got the SMS! Just signed it right now on my phone."</p>
              <p><strong className="text-purple-400">Adair AI Clone:</strong> "Received and verified! Your case is now officially assigned to our MRI Medical Network."</p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Agente: Adair AI Clone</span>
              <button
                onClick={() => setActiveAudioCallId(activeAudioCallId === '2' ? null : '2')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg"
              >
                {activeAudioCallId === '2' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                <span>{activeAudioCallId === '2' ? 'Pausar Audio' : 'Escuchar Grabación'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
