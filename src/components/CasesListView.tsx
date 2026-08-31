import React, { useState, useEffect } from "react";
import { FolderKanban, Search, FileText, Phone, FileSignature, CheckCircle2, ChevronRight, ArrowLeft, Send, Plus, MessageSquare, ExternalLink } from "lucide-react";
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
        body: JSON.stringify({ text: newMsgText, channel: selectedChannel, sender: "AGENT" })
      });
      const saved = await res.json();
      setMessages(prev => [...prev, saved]);
      setNewMsgText("");
    } catch (err) {}
  };

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case "NUEVO_LEAD": return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300">Nuevo Lead</span>;
      case "EN_INTAKE_LINER": return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300">En Intake</span>;
      case "CALIFICADO_PARA_CLOSER": return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40">Fila Closer</span>;
      case "CONTRATO_ENVIADO": return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-amber-300">SMS Enviado</span>;
      case "FIRMA_COMPLETADA": return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-100 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-zinc-300" /> Firmado</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400">{status}</span>;
    }
  };

  const filteredCases = cases.filter((c) => {
    const match = c.leadName.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.employer.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    if (!match) return false;
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (typeFilter !== "ALL" && c.caseType !== typeFilter) return false;
    return true;
  });

  if (currentCase) {
    const retainer = currentCase.retainer;
    return (
      <div className="flex flex-col gap-5 w-full max-w-[1600px] mx-auto pb-16 min-w-0">
        <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedCase(null)} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100"><ArrowLeft className="w-4 h-4" /></button>
            <div><div className="flex items-center gap-2 flex-wrap"><h1 className="text-lg font-bold text-zinc-100">{currentCase.leadName}</h1><span className="text-xs font-mono text-zinc-400 font-semibold">{currentCase.id}</span>{getStatusBadge(currentCase.status)}</div><p className="text-xs text-zinc-500 mt-0.5">{currentCase.caseType.replace("_", " ")} • {currentCase.employer} • {currentCase.state}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right"><span className="text-[10px] text-zinc-500 block uppercase font-medium">Valor Legal</span><span className="text-sm font-bold text-zinc-200 font-mono">{currentCase.estimatedCaseValue}</span></div>
            {retainer ? <button onClick={() => onOpenSignModal(currentCase)} className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium rounded-lg flex items-center gap-1.5"><FileSignature className="w-3.5 h-3.5" /><span>Retainer ({retainer.status})</span></button> : <button onClick={() => onSendRetainer(currentCase.id)} className="px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"><Send className="w-3.5 h-3.5" /><span>Enviar Retainer</span></button>}
          </div>
        </div>
        <div className="flex items-center bg-zinc-900/80 p-1 rounded-lg border border-zinc-800 text-xs font-medium w-fit gap-1">
          <button onClick={() => setActiveDetailTab("OVERVIEW")} className={`px-3 py-1.5 rounded-md ${activeDetailTab === "OVERVIEW" ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400 hover:text-zinc-200"}`}>Ficha General</button>
          <button onClick={() => setActiveDetailTab("MESSAGING")} className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 ${activeDetailTab === "MESSAGING" ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400 hover:text-zinc-200"}`}><MessageSquare className="w-3.5 h-3.5" /><span>Mensajería</span></button>
          <button onClick={() => setActiveDetailTab("DOCUMENTS")} className={`px-3 py-1.5 rounded-md ${activeDetailTab === "DOCUMENTS" ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400 hover:text-zinc-200"}`}>Contratos</button>
          <button onClick={() => setActiveDetailTab("TIMELINE")} className={`px-3 py-1.5 rounded-md ${activeDetailTab === "TIMELINE" ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400 hover:text-zinc-200"}`}>Notas ({currentCase.notes.length})</button>
        </div>
        {activeDetailTab === "OVERVIEW" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-4 flex flex-col gap-2.5"><h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5">Contacto</h3><div className="flex flex-col gap-2 text-xs"><div className="flex justify-between"><span className="text-zinc-500">Teléfono:</span><span className="font-mono text-zinc-200">{currentCase.phone}</span></div><div className="flex justify-between"><span className="text-zinc-500">Email:</span><span className="text-zinc-300">{currentCase.email}</span></div><div className="flex justify-between"><span className="text-zinc-500">Empresa:</span><span className="text-zinc-200 text-right">{currentCase.employer}</span></div></div></div>
            <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-4 flex flex-col gap-2.5"><h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5">Calificación Legal</h3><div className="flex flex-col gap-2 text-xs"><div className="flex justify-between"><span className="text-zinc-500">Fecha Accidente:</span><span className="font-mono text-zinc-300">{currentCase.injuryDate}</span></div><div className="flex justify-between"><span className="text-zinc-500">Aviso Patrón:</span><span className="text-zinc-200">{currentCase.reportedToBoss ? "Sí" : "No"}</span></div><div className="flex justify-between"><span className="text-zinc-500">Abogado Previo:</span><span className="text-zinc-200">{currentCase.hasAttorney ? "Sí" : "No"}</span></div></div></div>
            <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-4 flex flex-col gap-2"><h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5">Descripción Lesión</h3><div className="bg-zinc-900/60 p-3 rounded-lg text-xs text-zinc-300 leading-relaxed min-h-[100px]">{currentCase.injuryDetails}</div></div>
          </div>
        )}
        {activeDetailTab === "MESSAGING" && (
          <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3"><div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-medium"><button onClick={() => setSelectedChannel("WHATSAPP")} className={`px-2.5 py-1 rounded-md ${selectedChannel === "WHATSAPP" ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400"}`}>WhatsApp</button><button onClick={() => setSelectedChannel("SMS")} className={`px-2.5 py-1 rounded-md ${selectedChannel === "SMS" ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400"}`}>SMS</button><button onClick={() => setSelectedChannel("WEBCHAT")} className={`px-2.5 py-1 rounded-md ${selectedChannel === "WEBCHAT" ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400"}`}>Web</button></div></div>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-4 min-h-[260px] max-h-[360px] overflow-y-auto flex flex-col gap-2.5">{messages.map((m) => (<div key={m.id} className={`flex flex-col max-w-[75%] rounded-xl p-3 text-xs ${m.sender === "CLIENT" ? "bg-zinc-800 text-zinc-200 self-start border border-zinc-700/60" : "bg-zinc-700/80 text-zinc-100 self-end"}`}><div className="flex items-center justify-between gap-3 text-[10px] text-zinc-400 mb-1"><span>{m.sender === "CLIENT" ? currentCase.leadName : "Abogado"}</span><span>{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div><p className="leading-relaxed">{m.text}</p></div>))}</div>
            <div className="flex items-center gap-2"><input type="text" value={newMsgText} onChange={(e) => setNewMsgText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder={`Responder a ${currentCase.leadName}...`} className="flex-1 bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-zinc-600" /><button onClick={handleSendMessage} className="px-4 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"><Send className="w-3.5 h-3.5" /><span>Enviar</span></button></div>
          </div>
        )}
        {activeDetailTab === "DOCUMENTS" && (
          <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-5 flex flex-col gap-3"><h3 className="text-sm font-semibold text-zinc-200">Documentos Legales</h3>{retainer ? <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-lg flex items-center justify-between text-xs"><div><span className="font-medium text-zinc-200 block">Contrato Retainer ({retainer.documentId})</span><span className="text-zinc-500 text-[11px]">15% Contingencia • Estado: {retainer.status}</span></div><button onClick={() => onOpenSignModal(currentCase)} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-md">Ver Documento</button></div> : <div className="text-center py-6 text-zinc-500 text-xs">Sin contrato generado aún.</div>}</div>
        )}
        {activeDetailTab === "TIMELINE" && (
          <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-5 flex flex-col gap-3"><h3 className="text-sm font-semibold text-zinc-200">Historial de Notas</h3><div className="flex flex-col gap-2">{currentCase.notes.map((n) => <div key={n.id} className="bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-lg text-xs"><div className="flex justify-between text-zinc-500 text-[11px] mb-1"><strong>{n.author}</strong><span>{new Date(n.timestamp).toLocaleDateString()}</span></div><p className="text-zinc-300">{n.text}</p></div>)}</div></div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-[1600px] mx-auto pb-16 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div><h1 className="text-xl font-bold text-zinc-100 font-[\x27Outfit\x27] tracking-tight">Expedientes de Casos</h1><p className="text-xs text-zinc-400 mt-0.5">Gestión de reclamos de Workers Comp y Personal Injury.</p></div>
        <button onClick={onOpenNewCase} className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded-lg text-xs shadow-sm self-start"><Plus className="w-3.5 h-3.5 stroke-[2.5]" /><span>Nuevo Expediente</span></button>
      </div>
      <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1"><Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por cliente, teléfono, empresa..." className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-zinc-700" /></div>
        <div className="flex items-center gap-2"><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 px-3 py-2 rounded-lg focus:outline-none"><option value="ALL">Todos los Tipos</option><option value="Workers_Comp">Workers Comp</option><option value="Personal_Injury">Personal Injury</option></select><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 px-3 py-2 rounded-lg focus:outline-none"><option value="ALL">Todos los Estados</option><option value="NUEVO_LEAD">Nuevo Lead</option><option value="CALIFICADO_PARA_CLOSER">Fila Closer</option><option value="FIRMA_COMPLETADA">Firmado</option></select></div>
      </div>
      <div className="bg-[#0b0f19] border border-zinc-800/90 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-left text-xs border-collapse min-w-[700px]"><thead><tr className="border-b border-zinc-800 text-zinc-400 text-[11px] font-semibold"><th className="py-2.5 px-4">Código / Cliente</th><th className="py-2.5 px-3">Tipo</th><th className="py-2.5 px-3">Empresa</th><th className="py-2.5 px-3">Accidente</th><th className="py-2.5 px-3 text-center">Estado</th><th className="py-2.5 px-3 text-right">Valor Estimado</th><th className="py-2.5 px-4 text-right">Acción</th></tr></thead><tbody className="divide-y divide-zinc-800/60">{filteredCases.map((c) => (<tr key={c.id} onClick={() => setSelectedCase(c)} className="hover:bg-zinc-900/40 cursor-pointer transition-colors"><td className="py-3 px-4"><div className="font-medium text-zinc-200">{c.leadName}</div><div className="text-[10px] text-zinc-500 font-mono">{c.phone} • {c.id}</div></td><td className="py-3 px-3 text-zinc-300">{c.caseType.replace("_", " ")}</td><td className="py-3 px-3 text-zinc-400">{c.employer}</td><td className="py-3 px-3 font-mono text-zinc-500">{c.injuryDate}</td><td className="py-3 px-3 text-center">{getStatusBadge(c.status)}</td><td className="py-3 px-3 text-right font-mono text-zinc-200 font-medium">{c.estimatedCaseValue}</td><td className="py-3 px-4 text-right"><span className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 font-medium"><span>Ver</span><ChevronRight className="w-3.5 h-3.5" /></span></td></tr>))}</tbody></table></div>
      </div>
    </div>
  );
};
