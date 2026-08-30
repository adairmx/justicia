import React, { useState } from 'react';
import { 
  DollarSign, 
  FileSignature, 
  PhoneCall, 
  Users, 
  ArrowUpRight, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Award, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Headphones, 
  Play, 
  Pause 
} from 'lucide-react';
import { LegalCase, Stats } from '../types';

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
      commissionEarned: ""
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
      commissionEarned: ""
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
      commissionEarned: ",450"
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
      commissionEarned: ",200"
    }
  ];

  const employerHotspots = [
    { name: "Amazon Logistics Warehouses", location: "Ontario / San Bernardino, CA", count: 8, avgValue: ",000" },
    { name: "Fresh Produce Packaging Inc.", location: "Vernon / East LA, CA", count: 5, avgValue: ",000" },
    { name: "FedEx Ground Distribution", location: "Fontana, CA", count: 4, avgValue: ",000" },
    { name: "Target Supply Chain Centers", location: "Rialto, CA", count: 3, avgValue: ",000" }
  ];

  const objectionsLog = [
    { objection: "Miedo a despido o represalia patronal", occurrences: 19, rebuttalSuccessRate: "94.7%", legalBasis: "Código Laboral CA § 132a" },
    { objection: "Preocupación por estatus migratorio / Sin documentos", occurrences: 14, rebuttalSuccessRate: "100%", legalBasis: "Protección Universal Workers' Comp" },
    { objection: "Duda sobre costo / Cobro por adelantado", occurrences: 11, rebuttalSuccessRate: "90.9%", legalBasis: "Esquema de Contingencia 15%" },
    { objection: "La empresa ya me mandó a su clínica y me dio de alta", occurrences: 8, rebuttalSuccessRate: "87.5%", legalBasis: "Derecho a Segunda Opinión / QME" }
  ];

  return (
    <div className=\"flex flex-col gap-4 sm:gap-6 w-full max-w-[1800px] mx-auto pb-12 overflow-hidden min-w-0\">
      
      {/* Top Welcome Banner */}
      <div className=\"bg-gradient-to-r from-[#0d1527] via-[#0e1b38] to-[#121128] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 min-w-0\">
        <div className=\"min-w-0\">
          <div className=\"flex items-center gap-2 min-w-0 flex-wrap\">
            <span className=\"px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0\">
              Executive Command
            </span>
            <span className=\"text-[11px] text-slate-400 font-mono\">Bilingual Legal Operations</span>
          </div>
          <h1 className=\"text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-['Outfit'] mt-1 tracking-tight truncate\">
            Panel Central de Analíticas & Auditoría
          </h1>
          <p className=\"text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed\">
            Embudo en tiempo real: desde el primer timbrado de intake con operadores en Venezuela hasta el cierre de contratos Retainer en vivo.
          </p>
        </div>

        {/* Quick Actions & Agent Workspace Launcher */}
        <div className=\"flex flex-wrap items-center gap-2 sm:gap-3 shrink-0\">
          
          {/* Timeframe Filter */}
          <div className=\"bg-slate-950/80 p-0.5 sm:p-1 rounded-xl border border-slate-800 flex items-center text-[11px] sm:text-xs font-semibold\">
            {(['TODAY', 'WEEK', 'MONTH', 'ALL'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={px-2 sm:px-3 py-1 rounded-lg transition-all }
              >
                {t === 'TODAY' ? 'Hoy' : t === 'WEEK' ? 'Semana' : t === 'MONTH' ? 'Mes' : 'Todo'}
              </button>
            ))}
          </div>

          {/* Jump into Agent Seat Button */}
          <button
            onClick={() => onSwitchToAgentView('CLOSER')}
            className=\"flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-950/50 active:scale-95 transition-all\"
          >
            <Headphones className=\"w-3.5 h-3.5\" />
            <span>Operar como Agente</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className=\"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 min-w-0\">
        
        {/* Card 1 */}
        <div className=\"bg-[#0b101d] border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between min-w-0\">
          <div className=\"flex items-center justify-between gap-2\">
            <span className=\"text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate\">Valor Cartera en Cierre</span>
            <div className=\"p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0\">
              <DollarSign className=\"w-4 h-4 sm:w-5 sm:h-5\" />
            </div>
          </div>
          <div className=\"mt-2 sm:mt-3 min-w-0\">
            <h3 className=\"text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-mono truncate\">,280,000</h3>
            <div className=\"flex items-center gap-1 mt-1 text-[11px] sm:text-xs text-emerald-400 font-semibold truncate\">
              <ArrowUpRight className=\"w-3.5 h-3.5 shrink-0\" />
              <span className=\"truncate\">+24.5% vs semana anterior</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className=\"bg-[#0b101d] border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between min-w-0\">
          <div className=\"flex items-center justify-between gap-2\">
            <span className=\"text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate\">Retainers Firmados (In-Call)</span>
            <div className=\"p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0\">
              <FileSignature className=\"w-4 h-4 sm:w-5 sm:h-5\" />
            </div>
          </div>
          <div className=\"mt-2 sm:mt-3 min-w-0\">
            <h3 className=\"text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400 font-mono truncate\">{stats.retainersSignedOnCall}</h3>
            <div className=\"flex items-center gap-1 mt-1 text-[11px] sm:text-xs text-amber-400 font-semibold truncate\">
              <Flame className=\"w-3.5 h-3.5 text-amber-500 shrink-0\" />
              <span className=\"truncate\">Cierre en Línea: {stats.conversionRate}</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className=\"bg-[#0b101d] border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between min-w-0\">
          <div className=\"flex items-center justify-between gap-2\">
            <span className=\"text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate\">Llamadas Gestionadas</span>
            <div className=\"p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0\">
              <PhoneCall className=\"w-4 h-4 sm:w-5 sm:h-5\" />
            </div>
          </div>
          <div className=\"mt-2 sm:mt-3 min-w-0\">
            <h3 className=\"text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-mono truncate\">{stats.totalCallsToday}</h3>
            <div className=\"flex items-center gap-1 mt-1 text-[11px] sm:text-xs text-blue-400 font-semibold truncate\">
              <Clock className=\"w-3.5 h-3.5 shrink-0\" />
              <span className=\"truncate\">Speed-to-Lead: &lt; 8s</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className=\"bg-[#0b101d] border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between min-w-0\">
          <div className=\"flex items-center justify-between gap-2\">
            <span className=\"text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate\">Pase Calificado (Warm Transfer)</span>
            <div className=\"p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0\">
              <Users className=\"w-4 h-4 sm:w-5 sm:h-5\" />
            </div>
          </div>
          <div className=\"mt-2 sm:mt-3 min-w-0\">
            <h3 className=\"text-xl sm:text-2xl md:text-3xl font-extrabold text-purple-300 font-mono truncate\">
              {stats.closersTransferred} / {stats.intakeQualified}
            </h3>
            <div className=\"flex items-center gap-1 mt-1 text-[11px] sm:text-xs text-purple-400 font-semibold truncate\">
              <CheckCircle2 className=\"w-3.5 h-3.5 shrink-0\" />
              <span className=\"truncate\">78.5% Calificación efectiva</span>
            </div>
          </div>
        </div>

      </div>

      {/* OPERATORS PERFORMANCE MATRIX (Responsive Table) */}
      <div className=\"bg-[#0c121e] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col gap-4 min-w-0 overflow-hidden\">
        <div className=\"flex flex-wrap items-center justify-between gap-2 min-w-0\">
          <div className=\"min-w-0\">
            <h2 className=\"text-sm sm:text-base font-extrabold text-white flex items-center gap-2 truncate\">
              <Award className=\"w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0\" />
              <span className=\"truncate\">Desempeño de Operadores & Closers</span>
            </h2>
            <p className=\"text-[11px] sm:text-xs text-slate-400 truncate\">Tiempos de atención, calificación y contratos firmados por agente.</p>
          </div>

          <span className=\"text-[10px] sm:text-xs text-slate-400 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0\">
            4 Agentes en Turno
          </span>
        </div>

        {/* Scrollable table container */}
        <div className=\"overflow-x-auto w-full border border-slate-800/80 rounded-xl\">
          <table className=\"w-full text-left text-xs border-collapse min-w-[700px]\">
            <thead>
              <tr className=\"border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]\">
                <th className=\"py-3 px-3.5\">Agente / Rol</th>
                <th className=\"py-3 px-3\">Estado</th>
                <th className=\"py-3 px-3 text-center\">Llamadas</th>
                <th className=\"py-3 px-3 text-center\">Intakes / Cierres</th>
                <th className=\"py-3 px-3 text-center\">Tasa Conversión</th>
                <th className=\"py-3 px-3 text-center\">AHT Promedio</th>
                <th className=\"py-3 px-3 text-center\">Auditoría QA</th>
                <th className=\"py-3 px-3.5 text-right\">Comisión / Ahorro</th>
              </tr>
            </thead>
            <tbody className=\"divide-y divide-slate-800/60 bg-[#080c14]/40\">
              {agentsData.map((agent, idx) => (
                <tr key={idx} className=\"hover:bg-slate-900/40 transition-colors\">
                  <td className=\"py-3 px-3.5\">
                    <div className=\"flex items-center gap-2.5\">
                      <div className={w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 }>
                        {agent.avatar}
                      </div>
                      <div className=\"min-w-0\">
                        <span className=\"font-bold text-white block truncate\">{agent.name}</span>
                        <span className=\"text-[10px] text-slate-400 truncate\">{agent.role}</span>
                      </div>
                    </div>
                  </td>

                  <td className=\"py-3 px-3\">
                    <span className={px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border shrink-0 }>
                      {agent.status === 'ACTIVE_24_7' ? 'IA 24/7' : agent.status === 'IN_CALL' ? 'En Llamada' : 'Disponible'}
                    </span>
                  </td>

                  <td className=\"py-3 px-3 text-center font-mono font-semibold text-slate-300\">
                    {agent.callsHandled}
                  </td>

                  <td className=\"py-3 px-3 text-center font-mono font-bold text-amber-300\">
                    {agent.intakesCompleted}
                  </td>

                  <td className=\"py-3 px-3 text-center font-mono font-bold text-emerald-400\">
                    {agent.qualifiedRate}
                  </td>

                  <td className=\"py-3 px-3 text-center font-mono text-slate-400\">
                    {agent.avgHandleTime}
                  </td>

                  <td className=\"py-3 px-3 text-center\">
                    <span className=\"px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold text-blue-300\">
                      {agent.qualityScore}
                    </span>
                  </td>

                  <td className=\"py-3 px-3.5 text-right font-mono font-bold text-emerald-400\">
                    {agent.commissionEarned}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TWO COLUMN GRID: EMPLOYERS HOTSPOTS & OBJECTIONS INTELLIGENCE */}
      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 min-w-0\">
        
        {/* Left Box */}
        <div className=\"bg-[#0c121e] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col gap-3 min-w-0\">
          <div className=\"flex items-center justify-between gap-2 min-w-0\">
            <h3 className=\"text-xs sm:text-sm font-bold text-white flex items-center gap-2 truncate\">
              <Building2 className=\"w-4 h-4 text-blue-400 shrink-0\" />
              <span className=\"truncate\">Patrones con Mayor Incidencia de Lesiones</span>
            </h3>
            <span className=\"text-[9px] sm:text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0\">
              CA / TX
            </span>
          </div>

          <div className=\"flex flex-col gap-2 mt-1 min-w-0\">
            {employerHotspots.map((emp, idx) => (
              <div key={idx} className=\"bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between gap-2 text-xs min-w-0\">
                <div className=\"min-w-0\">
                  <span className=\"font-bold text-white block truncate\">{emp.name}</span>
                  <div className=\"flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 truncate\">
                    <MapPin className=\"w-3 h-3 text-blue-400 shrink-0\" />
                    <span className=\"truncate\">{emp.location}</span>
                  </div>
                </div>
                <div className=\"text-right shrink-0\">
                  <span className=\"font-bold text-amber-400 font-mono block\">{emp.count} Reclamos</span>
                  <span className=\"text-[10px] text-emerald-400 font-mono\">Prom: {emp.avgValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Box */}
        <div className=\"bg-[#0c121e] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col gap-3 min-w-0\">
          <div className=\"flex items-center justify-between gap-2 min-w-0\">
            <h3 className=\"text-xs sm:text-sm font-bold text-white flex items-center gap-2 truncate\">
              <ShieldCheck className=\"w-4 h-4 text-emerald-400 shrink-0\" />
              <span className=\"truncate\">Efectividad de Rebate de Objeciones</span>
            </h3>
            <span className=\"text-[9px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0\">
              93.2% Global
            </span>
          </div>

          <div className=\"flex flex-col gap-2 mt-1 min-w-0\">
            {objectionsLog.map((obj, idx) => (
              <div key={idx} className=\"bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex flex-col gap-1 text-xs min-w-0\">
                <div className=\"flex items-center justify-between gap-2 min-w-0\">
                  <span className=\"font-bold text-slate-200 truncate\">{obj.objection}</span>
                  <span className=\"font-mono font-bold text-[10px] sm:text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0\">
                    {obj.rebuttalSuccessRate}
                  </span>
                </div>
                <div className=\"flex items-center justify-between gap-2 text-[10px] text-slate-400 min-w-0\">
                  <span className=\"truncate\">{obj.occurrences} menciones</span>
                  <span className=\"text-amber-400 font-medium truncate shrink-0\">{obj.legalBasis}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT CALLS & QA AUDIT PLAYER */}
      <div className=\"bg-[#0c121e] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col gap-4 min-w-0\">
        <div className=\"flex items-center justify-between gap-2 min-w-0\">
          <h2 className=\"text-sm sm:text-base font-extrabold text-white flex items-center gap-2 truncate\">
            <Headphones className=\"w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0\" />
            <span className=\"truncate\">Auditoría de Llamadas & Transcripciones en Vivo</span>
          </h2>
          <span className=\"text-[10px] sm:text-xs text-slate-400 hidden sm:inline shrink-0\">Grabaciones con canal dual</span>
        </div>

        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 min-w-0\">
          
          {/* Call 1 */}
          <div className=\"bg-slate-950/90 border border-slate-800 p-3.5 sm:p-4 rounded-2xl flex flex-col gap-3 min-w-0\">
            <div className=\"flex items-center justify-between gap-2 text-xs min-w-0\">
              <div className=\"min-w-0\">
                <span className=\"font-bold text-white block truncate\">Carlos Ramirez (Amazon Warehouse)</span>
                <span className=\"text-[10px] sm:text-[11px] text-slate-400 font-mono truncate\">+1 (818) 555-0192 • Duración: 5m 12s</span>
              </div>
              <span className=\"px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 shrink-0\">
                FIRMADO ON-CALL
              </span>
            </div>

            <div className=\"bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-800/80 text-[10px] sm:text-[11px] text-slate-300 font-mono leading-relaxed max-h-24 overflow-y-auto min-w-0\">
              <p><strong className=\"text-blue-400\">Liner:</strong> \"¿Tu supervisor te dio el reporte DWC-1?\"</p>
              <p><strong className=\"text-amber-400\">Carlos:</strong> \"No, me dijo que si metía reclamo me quitaban las horas.\"</p>
              <p><strong className=\"text-purple-400\">Closer Adair:</strong> \"Carlos, el código 132a te protege al 100%. Te acabo de mandar el Retainer por SMS, ábrelo mientras seguimos en la línea...\"</p>
            </div>

            <div className=\"flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-xs min-w-0\">
              <span className=\"text-slate-400 text-[11px] truncate\">Agente: Adair (Closer)</span>
              <button
                onClick={() => setActiveAudioCallId(activeAudioCallId === '1' ? null : '1')}
                className=\"flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-[11px] sm:text-xs shrink-0\"
              >
                {activeAudioCallId === '1' ? <Pause className=\"w-3 h-3\" /> : <Play className=\"w-3 h-3 text-amber-400\" />}
                <span>{activeAudioCallId === '1' ? 'Pausar' : 'Escuchar Audio'}</span>
              </button>
            </div>
          </div>

          {/* Call 2 */}
          <div className=\"bg-slate-950/90 border border-slate-800 p-3.5 sm:p-4 rounded-2xl flex flex-col gap-3 min-w-0\">
            <div className=\"flex items-center justify-between gap-2 text-xs min-w-0\">
              <div className=\"min-w-0\">
                <span className=\"font-bold text-white block truncate\">Michael Johnson (T-Bone Collision)</span>
                <span className=\"text-[10px] sm:text-[11px] text-slate-400 font-mono truncate\">+1 (213) 555-0188 • Duración: 7m 15s</span>
              </div>
              <span className=\"px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700 shrink-0\">
                IA AUTÓNOMA CERRADA
              </span>
            </div>

            <div className=\"bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-800/80 text-[10px] sm:text-[11px] text-slate-300 font-mono leading-relaxed max-h-24 overflow-y-auto min-w-0\">
              <p><strong className=\"text-purple-400\">Adair AI Clone:</strong> \"Michael, you shouldn't pay a single dollar upfront. We operate strictly on contingency.\"</p>
              <p><strong className=\"text-amber-400\">Michael:</strong> \"Got the SMS! Just signed it right now on my phone.\"</p>
              <p><strong className=\"text-purple-400\">Adair AI Clone:</strong> \"Received and verified! Your case is now officially assigned to our MRI Medical Network.\"</p>
            </div>

            <div className=\"flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-xs min-w-0\">
              <span className=\"text-slate-400 text-[11px] truncate\">Agente: Adair AI Clone</span>
              <button
                onClick={() => setActiveAudioCallId(activeAudioCallId === '2' ? null : '2')}
                className=\"flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-[11px] sm:text-xs shrink-0\"
              >
                {activeAudioCallId === '2' ? <Pause className=\"w-3 h-3\" /> : <Play className=\"w-3 h-3 text-amber-400\" />}
                <span>{activeAudioCallId === '2' ? 'Pausar' : 'Escuchar Audio'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
