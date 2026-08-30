import React, { useState, useEffect } from "react";
import { FolderKanban, Search, Phone, FileSignature, CheckCircle2, ChevronRight, ArrowLeft, Send, Plus, MessageSquare, Globe, Share2, ExternalLink, Bot } from "lucide-react";
import { LegalCase, CaseStatus, ChatMessage } from "../types";

interface CasesListViewProps {
  cases: LegalCase[];
  onUpdateCase: (caseId: string, updatedFields: Partial<LegalCase>) => void;
  onSendRetainer: (caseId: string) => void;
  onOpenSignModal: (caseItem: LegalCase) => void;
  onOpenNewCase: () => void;
}

export const CasesListView: React.FC<CasesListViewProps> = ({
  cases,
  onUpdateCase,
  onSendRetainer,
  onOpenSignModal,
  onOpenNewCase
}) => {
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [activeDetailTab, setActiveDetailTab] = useState<"OVERVIEW" | "MESSAGING" | "DOCUMENTS" | "TIMELINE">("OVERVIEW");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsgText, setNewMsgText] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"WHATSAPP" | "SMS" | "WEBCHAT" | "INSTAGRAM">("WHATSAPP");
  const [isAiAutoReply, setIsAiAutoReply] = useState(true);

  const currentCase = selectedCase ? (cases.find(c => c.id === selectedCase.id) || selectedCase) : null;

  useEffect(() => {
    if (currentCase?.id) {
      fetch("/api/cases/" + currentCase.id + "/messages")
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(() => {});
    }
  }, [currentCase?.id]);

  const handleSendMessage = async () => {
    if (!newMsgText.trim() || !currentCase) return;
    try {
      const res = await fetch("/api/cases/" + currentCase.id + "/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newMsgText,
          channel: selectedChannel,
          sender: "AGENT"
        })
      });
      const saved = await res.json();
      setMessages(prev => [...prev, saved]);
      setNewMsgText("");
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case "NUEVO_LEAD": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">Nuevo Lead</span>;
      case "EN_INTAKE_LINER": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">En Intake</span>;
      case "CALIFICADO_PARA_CLOSER": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">Fila Closer</span>;
      case "EN_LLAMADA_CLOSER": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 animate-pulse">En Cierre</span>;
      case "CONTRATO_ENVIADO": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">SMS Enviado</span>;
      case "FIRMA_COMPLETADA": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Firmado</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.leadName.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.employer.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (typeFilter !== "ALL" && c.caseType !== typeFilter) return false;
    return true;
  });

  if (currentCase) {
    const retainer = currentCase.retainer;
    return (
      <div className="flex flex-col gap-4 w-full max-w-[1800px] mx-auto pb-12 animate-fadeIn min-w-0">
        <div className="bg-[#0d1527] border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedCase(null)} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"><ArrowLeft className="w-4 h-4" /></button>
            <div><div className="flex items-center gap-2 flex-wrap"><h1 className="text-xl font-extrabold text-white">{currentCase.leadName}</h1><span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-900 text-amber-400 border border-amber-500/30">{currentCase.id}</span>{getStatusBadge(currentCase.status)}</div><p className="text-xs text-slate-400 mt-0.5">{currentCase.caseType.replace("_", " ")} • {currentCase.employer} • {currentCase.state}, USA</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-right"><span className="text-[10px] text-slate-400 uppercase font-semibold block">Valor Legal</span><span className="text-sm font-extrabold text-emerald-400 font-mono">{currentCase.estimatedCaseValue}</span></div>
            {retainer ? <button onClick={() => onOpenSignModal(currentCase)} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"><FileSignature className="w-3.5 h-3.5" /><span>Ver Retainer ({retainer.status})</span></button> : <button onClick={() => onSendRetainer(currentCase.id)} className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /><span>Enviar Retainer SMS</span></button>}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#080c14] p-1 rounded-xl border border-slate-800 text-xs font-bold w-fit flex-wrap">
          <button onClick={() => setActiveDetailTab("OVERVIEW")} className={activeDetailTab === "OVERVIEW" ? "px-3.5 py-2 rounded-lg bg-blue-600 text-white" : "px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200"}>Ficha General</button>
          <button onClick={() => setActiveDetailTab("MESSAGING")} className={activeDetailTab === "MESSAGING" ? "px-3.5 py-2 rounded-lg bg-emerald-600 text-white flex items-center gap-1.5" : "px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200 flex items-center gap-1.5"}><MessageSquare className="w-3.5 h-3.5 text-emerald-400" /><span>Mensajería (WhatsApp / SMS / Web)</span></button>
          <button onClick={() => setActiveDetailTab("DOCUMENTS")} className={activeDetailTab === "DOCUMENTS" ? "px-3.5 py-2 rounded-lg bg-amber-600 text-white" : "px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200"}>Documentos & Retainer</button>
          <button onClick={() => setActiveDetailTab("TIMELINE")} className={activeDetailTab === "TIMELINE" ? "px-3.5 py-2 rounded-lg bg-purple-600 text-white" : "px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200"}>Notas ({currentCase.notes.length})</button>
        </div>
        {activeDetailTab === "OVERVIEW" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-3"><h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">Contacto</h3><div className="flex flex-col gap-2 text-xs"><div className="flex justify-between"><span className="text-slate-400">Teléfono:</span><span className="font-mono font-bold text-amber-400">{currentCase.phone}</span></div><div className="flex justify-between"><span className="text-slate-400">Email:</span><span className="text-slate-300">{currentCase.email}</span></div><div className="flex justify-between"><span className="text-slate-400">Empresa:</span><span className="font-bold text-white text-right">{currentCase.employer}</span></div></div></div>
            <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-3"><h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">Intake</h3><div className="flex flex-col gap-2 text-xs"><div className="flex justify-between"><span className="text-slate-400">Fecha Accidente:</span><span className="font-mono text-slate-200">{currentCase.injuryDate}</span></div><div className="flex justify-between"><span className="text-slate-400">Aviso Patrón:</span><span className={currentCase.reportedToBoss ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>{currentCase.reportedToBoss ? "Sí" : "No"}</span></div><div className="flex justify-between"><span className="text-slate-400">Abogado Previo:</span><span className={currentCase.hasAttorney ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>{currentCase.hasAttorney ? "Sí" : "No (Califica)"}</span></div></div></div>
            <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-3"><h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">Descripción Lesión</h3><div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed min-h-[120px]">{currentCase.injuryDetails}</div></div>
          </div>
        )}
        {activeDetailTab === "MESSAGING" && (
          <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5 bg-[#080c14] p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button onClick={() => setSelectedChannel("WHATSAPP")} className={selectedChannel === "WHATSAPP" ? "px-3 py-1.5 rounded-lg bg-emerald-600 text-white" : "px-3 py-1.5 rounded-lg text-slate-400"}>WhatsApp</button>
                <button onClick={() => setSelectedChannel("SMS")} className={selectedChannel === "SMS" ? "px-3 py-1.5 rounded-lg bg-blue-600 text-white" : "px-3 py-1.5 rounded-lg text-slate-400"}>SMS</button>
                <button onClick={() => setSelectedChannel("WEBCHAT")} className={selectedChannel === "WEBCHAT" ? "px-3 py-1.5 rounded-lg bg-purple-600 text-white" : "px-3 py-1.5 rounded-lg text-slate-400"}>Chat Web</button>
                <button onClick={() => setSelectedChannel("INSTAGRAM")} className={selectedChannel === "INSTAGRAM" ? "px-3 py-1.5 rounded-lg bg-pink-600 text-white" : "px-3 py-1.5 rounded-lg text-slate-400"}>Redes (IG/FB)</button>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs"><Bot className="w-3.5 h-3.5 text-purple-400" /><span className="text-slate-300 font-semibold">Respuesta IA:</span><button onClick={() => setIsAiAutoReply(!isAiAutoReply)} className={`px-2 py-0.5 rounded text-[10px] font-bold ${isAiAutoReply ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40" : "bg-slate-800 text-slate-400"}`}>{isAiAutoReply ? "Activo 24/7" : "Pausado"}</button></div>
            </div>
            <div className="bg-[#080c14] border border-slate-800/80 rounded-2xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto flex flex-col gap-3">
              {messages.length === 0 ? <div className="text-center py-12 text-slate-500 text-xs">No hay mensajes previos en este canal.</div> : messages.map((m) => (
                <div key={m.id} className={m.sender === "CLIENT" ? "flex flex-col max-w-[80%] rounded-2xl p-3 text-xs bg-slate-800 text-slate-200 self-start border border-slate-700" : m.sender === "SYSTEM" ? "flex flex-col max-w-[80%] rounded-xl p-2 text-xs bg-amber-950/60 text-amber-200 self-center border border-amber-500/30 text-center text-[11px]" : m.sender === "AI_AGENT" ? "flex flex-col max-w-[80%] rounded-2xl p-3 text-xs bg-purple-950/80 text-purple-200 border border-purple-500/50 self-end" : "flex flex-col max-w-[80%] rounded-2xl p-3 text-xs bg-blue-600 text-white self-end"}>
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 mb-1"><span className="font-bold">{m.sender === "CLIENT" ? `${currentCase.leadName} (${m.channel})` : m.sender === "AI_AGENT" ? "Clon IA Legal" : m.sender === "SYSTEM" ? "Sistema" : "Operador"}</span><span>{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
                  <p className="leading-relaxed break-words">{m.text}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input type="text" value={newMsgText} onChange={(e) => setNewMsgText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder={`Responder por ${selectedChannel} a ${currentCase.leadName}...`} className="flex-1 bg-[#080c14] border border-slate-800 text-xs text-white px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500" />
              <button onClick={handleSendMessage} className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /><span>Enviar</span></button>
            </div>
          </div>
        )}
        {activeDetailTab === "DOCUMENTS" && (
          <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col gap-4"><h3 className="text-sm font-bold text-white flex items-center gap-2"><FileSignature className="w-4 h-4 text-emerald-400" /><span>Documentos Legales & Retainer</span></h3>{retainer ? <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between"><div><span className="font-bold text-white text-sm">Contrato Retainer ({retainer.documentId})</span><p className="text-xs text-slate-400 mt-1">15% Contingencia • Estado: <strong className="text-emerald-400">{retainer.status}</strong></p></div><button onClick={() => onOpenSignModal(currentCase)} className="px-3.5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5" /><span>Ver Documento</span></button></div> : <div className="text-center py-6 text-slate-500 text-xs">Sin contrato. <button onClick={() => onSendRetainer(currentCase.id)} className="ml-2 text-amber-400 underline font-bold">Enviar Retainer SMS</button></div>}</div>
        )}
        {activeDetailTab === "TIMELINE" && (
          <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col gap-3"><h3 className="text-sm font-bold text-white">Historial de Notas</h3><div className="flex flex-col gap-2.5">{currentCase.notes.map((n) => <div key={n.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs"><div className="flex justify-between text-slate-400 mb-1"><strong className="text-amber-400">{n.author}</strong><span>{new Date(n.timestamp).toLocaleDateString()}</span></div><p className="text-slate-300">{n.text}</p></div>)}</div></div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1800px] mx-auto pb-12 min-w-0">
      <div className="bg-gradient-to-r from-[#0d1527] via-[#0e1b38] to-[#121128] border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">Directorio Maestro</span><h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">Casos & Expedientes</h1><p className="text-xs text-slate-400 mt-0.5">Gestión de reclamos, contratos Retainer y mensajería multicanal (WhatsApp / SMS / Web / Social).</p></div>
        <button onClick={onOpenNewCase} className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md shrink-0"><Plus className="w-4 h-4 stroke-[3]" /><span>Nuevo Caso</span></button>
      </div>
      <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-3.5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por cliente, teléfono, empresa..." className="w-full bg-[#080c14] border border-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-amber-500" /></div>
        <div className="flex items-center gap-2"><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-[#080c14] border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"><option value="ALL">Todos los Tipos</option><option value="Workers_Comp">Workers Comp</option><option value="Personal_Injury">Personal Injury</option></select><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#080c14] border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"><option value="ALL">Todos los Estados</option><option value="NUEVO_LEAD">Nuevo Lead</option><option value="CALIFICADO_PARA_CLOSER">Fila Closer</option><option value="CONTRATO_ENVIADO">SMS Enviado</option><option value="FIRMA_COMPLETADA">Firmado</option></select></div>
      </div>
      <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto w-full"><table className="w-full text-left text-xs border-collapse min-w-[800px]"><thead><tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]"><th className="py-3 px-4">Código / Cliente</th><th className="py-3 px-3">Tipo & Estado</th><th className="py-3 px-3">Empresa / Empleador</th><th className="py-3 px-3">Accidente</th><th className="py-3 px-3 text-center">Retainer</th><th className="py-3 px-3 text-right">Valor Estimado</th><th className="py-3 px-4 text-right">Acción</th></tr></thead><tbody className="divide-y divide-slate-800/60 bg-[#080c14]/40">{filteredCases.map((c) => (<tr key={c.id} onClick={() => setSelectedCase(c)} className="hover:bg-slate-900/50 cursor-pointer transition-colors"><td className="py-3 px-4"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold font-mono text-[10px]">{c.id.split("-")[1]}</div><div><span className="font-bold text-white block">{c.leadName}</span><span className="text-[10px] text-slate-400 font-mono">{c.phone}</span></div></div></td><td className="py-3 px-3"><span className="font-semibold text-slate-200 block">{c.caseType.replace("_", " ")}</span>{getStatusBadge(c.status)}</td><td className="py-3 px-3 text-slate-300">{c.employer}</td><td className="py-3 px-3 font-mono text-slate-400">{c.injuryDate}</td><td className="py-3 px-3 text-center">{c.retainer ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">FIRMADO</span> : <span className="text-[10px] text-slate-600">Sin contrato</span>}</td><td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">{c.estimatedCaseValue}</td><td className="py-3 px-4 text-right"><span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400"><span>Ver Ficha</span><ChevronRight className="w-3.5 h-3.5" /></span></td></tr>))}</tbody></table></div>
      </div>
    </div>
  );
};
