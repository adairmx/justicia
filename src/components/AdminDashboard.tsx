import React, { useState } from "react";
import { DollarSign, FileSignature, PhoneCall, Users, ArrowUpRight, Clock, CheckCircle2, Award, Building2, MapPin, ShieldCheck, Headphones, Play, Pause } from "lucide-react";
import { LegalCase, Stats } from "../types";

interface AdminDashboardProps {
  cases: LegalCase[];
  stats: Stats;
  onSwitchToAgentView: (role: "LINER" | "CLOSER") => void;
  onSelectCase: (caseItem: LegalCase) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, onSelectCase }) => {
  const [timeframe, setTimeframe] = useState<"TODAY" | "WEEK" | "MONTH" | "ALL">("TODAY");
  const [activeAudioCallId, setActiveAudioCallId] = useState<string | null>(null);

  const agentsData = [
    { name: "Maria G.", role: "Liner (Intake)", callsHandled: 24, intakesCompleted: 18, qualifiedRate: "75.0%", avgHandleTime: "3m 42s", qualityScore: "98/100", status: "Disponible" },
    { name: "Carlos V.", role: "Liner (Intake)", callsHandled: 18, intakesCompleted: 10, qualifiedRate: "55.5%", avgHandleTime: "4m 10s", qualityScore: "92/100", status: "En Llamada" },
    { name: "Adair", role: "Closer Principal", callsHandled: 14, intakesCompleted: 14, qualifiedRate: "85.7%", avgHandleTime: "8m 15s", qualityScore: "100/100", status: "Disponible" },
    { name: "Clon IA Legal", role: "Agente Automatizado", callsHandled: 32, intakesCompleted: 32, qualifiedRate: "81.2%", avgHandleTime: "6m 30s", qualityScore: "99/100", status: "Activo 24/7" }
  ];

  const employerHotspots = [
    { name: "Amazon Logistics Warehouse", location: "San Bernardino, CA", count: 8, avgValue: "$65,000" },
    { name: "Fresh Produce Packaging Inc.", location: "Vernon, CA", count: 5, avgValue: "$45,000" },
    { name: "FedEx Ground Distribution", location: "Fontana, CA", count: 4, avgValue: "$70,000" },
    { name: "Target Supply Chain Centers", location: "Rialto, CA", count: 3, avgValue: "$55,000" }
  ];

  const objectionsLog = [
    { objection: "Miedo a despido o represalia patronal", occurrences: 19, successRate: "94.7%", basis: "Código Laboral CA § 132a" },
    { objection: "Preocupación por estatus migratorio", occurrences: 14, successRate: "100%", basis: "Protección Universal Workers Comp" },
    { objection: "Honorarios / Cobro por adelantado", occurrences: 11, successRate: "90.9%", basis: "Esquema de Contingencia 15%" },
    { objection: "Alta médica prematura de la empresa", occurrences: 8, successRate: "87.5%", basis: "Derecho a Segunda Opinión / QME" }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-16 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 font-[\x27Outfit\x27] tracking-tight">Métricas de Rendimiento Legal</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Supervisión en tiempo real de embudo de llamadas, intakes calificados y contratos firmados.</p>
        </div>
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-medium self-start">
          {(["TODAY", "WEEK", "MONTH", "ALL"] as const).map((t) => (
            <button key={t} onClick={() => setTimeframe(t)} className={`px-3 py-1 rounded-md transition-colors ${timeframe === t ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400 hover:text-zinc-200"}`}>{t === "TODAY" ? "Hoy" : t === "WEEK" ? "Semana" : t === "MONTH" ? "Mes" : "Todo"}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium"><span>Valor en Cartera</span><DollarSign className="w-4 h-4 text-zinc-400" /></div>
          <div className="mt-3"><h3 className="text-2xl font-bold text-zinc-100 font-mono">$1,280,000</h3><span className="text-[11px] text-zinc-400 mt-0.5 block">+24.5% vs semana anterior</span></div>
        </div>
        <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium"><span>Contratos Firmados</span><FileSignature className="w-4 h-4 text-zinc-400" /></div>
          <div className="mt-3"><h3 className="text-2xl font-bold text-amber-400/90 font-mono">{stats.retainersSignedOnCall}</h3><span className="text-[11px] text-zinc-400 mt-0.5 block">Conversión: {stats.conversionRate}</span></div>
        </div>
        <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium"><span>Llamadas Gestionadas</span><PhoneCall className="w-4 h-4 text-zinc-400" /></div>
          <div className="mt-3"><h3 className="text-2xl font-bold text-zinc-100 font-mono">{stats.totalCallsToday}</h3><span className="text-[11px] text-zinc-400 mt-0.5 block">Tiempo respuesta: &lt; 8 seg</span></div>
        </div>
        <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium"><span>Intakes Calificados</span><Users className="w-4 h-4 text-zinc-400" /></div>
          <div className="mt-3"><h3 className="text-2xl font-bold text-zinc-100 font-mono">{stats.intakeQualified}</h3><span className="text-[11px] text-zinc-400 mt-0.5 block">Pase a Closer: {stats.closersTransferred}</span></div>
        </div>
      </div>
      <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-zinc-200">Desempeño de Equipo</h2><span className="text-xs text-zinc-500 font-mono">4 agentes</span></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-xs border-collapse min-w-[650px]"><thead><tr className="border-b border-zinc-800 text-zinc-400 text-[11px] font-semibold"><th className="py-2.5 px-3">Agente / Rol</th><th className="py-2.5 px-3">Estado</th><th className="py-2.5 px-3 text-center">Llamadas</th><th className="py-2.5 px-3 text-center">Intakes</th><th className="py-2.5 px-3 text-center">Conversión</th><th className="py-2.5 px-3 text-center">AHT</th><th className="py-2.5 px-3 text-right">Calidad QA</th></tr></thead><tbody className="divide-y divide-zinc-800/60">{agentsData.map((a, i) => (<tr key={i} className="hover:bg-zinc-900/40"><td className="py-3 px-3 font-medium text-zinc-200"><div>{a.name}</div><div className="text-[10px] text-zinc-500 font-normal">{a.role}</div></td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-[10px] font-medium ${a.status === "En Llamada" ? "bg-amber-950/60 text-amber-300 border border-amber-800/50" : "bg-zinc-800 text-zinc-300"}`}>{a.status}</span></td><td className="py-3 px-3 text-center font-mono text-zinc-300">{a.callsHandled}</td><td className="py-3 px-3 text-center font-mono text-zinc-300">{a.intakesCompleted}</td><td className="py-3 px-3 text-center font-mono text-zinc-300 font-semibold">{a.qualifiedRate}</td><td className="py-3 px-3 text-center font-mono text-zinc-400">{a.avgHandleTime}</td><td className="py-3 px-3 text-right font-mono text-zinc-300 font-semibold">{a.qualityScore}</td></tr>))}</tbody></table></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-5 flex flex-col gap-3"><h3 className="text-xs font-semibold text-zinc-300">Empresas con Mayor Frecuencia de Reclamos</h3><div className="flex flex-col gap-2">{employerHotspots.map((e, idx) => (<div key={idx} className="bg-zinc-900/60 border border-zinc-800/60 p-3 rounded-lg flex items-center justify-between text-xs"><div><span className="font-medium text-zinc-200 block">{e.name}</span><span className="text-[10px] text-zinc-500">{e.location}</span></div><div className="text-right font-mono"><span className="text-zinc-200 font-medium block">{e.count} casos</span><span className="text-[10px] text-zinc-400">{e.avgValue} prom.</span></div></div>))}</div></div>
        <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-5 flex flex-col gap-3"><h3 className="text-xs font-semibold text-zinc-300">Efectividad de Rebate de Objeciones</h3><div className="flex flex-col gap-2">{objectionsLog.map((o, idx) => (<div key={idx} className="bg-zinc-900/60 border border-zinc-800/60 p-3 rounded-lg flex items-center justify-between text-xs"><div><span className="font-medium text-zinc-200 block">{o.objection}</span><span className="text-[10px] text-zinc-500">{o.basis}</span></div><div className="text-right font-mono"><span className="text-zinc-200 font-semibold">{o.successRate}</span><span className="text-[10px] text-zinc-500 block">{o.occurrences} menciones</span></div></div>))}</div></div>
      </div>
      <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-5 flex flex-col gap-3"><h3 className="text-xs font-semibold text-zinc-300">Auditoría de Audio & Transcripciones Recientes</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><div className="bg-zinc-900/60 border border-zinc-800/60 p-3.5 rounded-lg flex flex-col gap-2"><div className="flex items-center justify-between text-xs"><span className="font-medium text-zinc-200">Carlos Ramirez (Amazon)</span><span className="text-[10px] text-zinc-400 font-mono">5m 12s</span></div><p className="text-[11px] text-zinc-400 leading-relaxed font-mono">"Carlos, el código 132a te protege. Te acabo de mandar el Retainer por SMS para firmarlo..."</p><div className="flex justify-end pt-1"><button onClick={() => setActiveAudioCallId(activeAudioCallId === "1" ? null : "1")} className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-md font-medium flex items-center gap-1">{activeAudioCallId === "1" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}<span>{activeAudioCallId === "1" ? "Pausa" : "Audio"}</span></button></div></div><div className="bg-zinc-900/60 border border-zinc-800/60 p-3.5 rounded-lg flex flex-col gap-2"><div className="flex items-center justify-between text-xs"><span className="font-medium text-zinc-200">Michael Johnson (Colisión)</span><span className="text-[10px] text-zinc-400 font-mono">7m 15s</span></div><p className="text-[11px] text-zinc-400 leading-relaxed font-mono">"Michael, operamos en contingencia. Firmaste el Retainer y tu caso está asignado..."</p><div className="flex justify-end pt-1"><button onClick={() => setActiveAudioCallId(activeAudioCallId === "2" ? null : "2")} className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-md font-medium flex items-center gap-1">{activeAudioCallId === "2" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}<span>{activeAudioCallId === "2" ? "Pausa" : "Audio"}</span></button></div></div></div></div>
    </div>
  );
};
