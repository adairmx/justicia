import React, { useState, useEffect } from "react";
import { MessageSquare, Phone, Globe, Share2, Search, Send, CheckCircle2, User, Clock, Bot, Sparkles, Filter, Plus } from "lucide-react";
import { LegalCase, ChatMessage } from "../types";

interface OmnichannelInboxViewProps {
  cases: LegalCase[];
  onOpenCase: (caseId: string) => void;
}

interface ConversationThread {
  caseId: string;
  clientName: string;
  phone: string;
  caseType: string;
  lastMessage: ChatMessage;
  unreadCount: number;
}

export const OmnichannelInboxView: React.FC<OmnichannelInboxViewProps> = ({ cases, onOpenCase }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("WC-8921");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setNewReplyText] = useState<string>("");
  const [activeChannel, setActiveChannel] = useState<"WHATSAPP" | "SMS" | "WEBCHAT" | "INSTAGRAM">("WHATSAPP");

  const threads: ConversationThread[] = [
    {
      caseId: "WC-8921",
      clientName: "Carlos Ramirez",
      phone: "+1 (818) 555-0192",
      caseType: "Workers Comp",
      lastMessage: { id: 4, channel: "SMS", sender: "CLIENT", text: "¡Listo! Ya lo firmé desde mi celular. ¿Qué sigue con la clínica?", timestamp: "2026-08-30T14:18:50Z" },
      unreadCount: 1
    },
    {
      caseId: "WC-9042",
      clientName: "Guadalupe Morales",
      phone: "+1 (619) 555-0144",
      caseType: "Workers Comp",
      lastMessage: { id: 2, channel: "INSTAGRAM", sender: "AI_AGENT", text: "Guadalupe, el estatus migratorio no afecta tu derecho a compensación. Te estamos llamando.", timestamp: "2026-08-30T15:50:30Z" },
      unreadCount: 0
    },
    {
      caseId: "PI-4019",
      clientName: "Michael Johnson",
      phone: "+1 (213) 555-0188",
      caseType: "Personal Injury",
      lastMessage: { id: 3, channel: "SMS", sender: "AGENT", text: "Retainer agreement link sent: https://justicia.legal/sign/RET-2026-4019", timestamp: "2026-08-30T15:20:00Z" },
      unreadCount: 0
    },
    {
      caseId: "WC-9105",
      clientName: "Roberto Sanchez",
      phone: "+1 (909) 555-0177",
      caseType: "Workers Comp",
      lastMessage: { id: 1, channel: "WHATSAPP", sender: "CLIENT", text: "Hola, me caí en la plataforma de FedEx en Fontana. Necesito saber si me cubren.", timestamp: "2026-08-30T16:10:00Z" },
      unreadCount: 2
    }
  ];

  const sortedThreads = [...threads].sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());

  const filteredThreads = sortedThreads.filter((t) => {
    const match = t.clientName.toLowerCase().includes(search.toLowerCase()) || t.phone.includes(search) || t.lastMessage.text.toLowerCase().includes(search.toLowerCase());
    if (!match) return false;
    if (channelFilter !== "ALL" && t.lastMessage.channel !== channelFilter) return false;
    return true;
  });

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  useEffect(() => {
    if (selectedCaseId) {
      fetch("/api/cases/" + selectedCaseId + "/messages")
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(() => {});
    }
  }, [selectedCaseId]);

  const handleSend = async () => {
    if (!replyText.trim() || !selectedCaseId) return;
    try {
      const res = await fetch("/api/cases/" + selectedCaseId + "/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: replyText,
          channel: activeChannel,
          sender: "AGENT"
        })
      });
      const saved = await res.json();
      setMessages(prev => [...prev, saved]);
      setNewReplyText("");
    } catch (e) {}
  };

  const getChannelBadge = (ch: string) => {
    switch (ch) {
      case "WHATSAPP": return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">WhatsApp</span>;
      case "SMS": return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-950 text-blue-300 border border-blue-500/40">SMS</span>;
      case "WEBCHAT": return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40">Web</span>;
      case "INSTAGRAM": return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-950 text-pink-300 border border-pink-500/40">Social</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1800px] mx-auto pb-12 h-[calc(100vh-120px)] min-w-0">
      <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 shadow-xl flex items-center justify-between gap-4">
        <div><span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">Bandeja Unificada</span><h1 className="text-xl font-extrabold text-white mt-1">Mensajería General Multicanal</h1><p className="text-xs text-slate-400">Todas las conversaciones entrantes ordenadas cronológicamente en orden descendente.</p></div>
        <div className="flex items-center gap-1.5 bg-[#080c14] p-1 rounded-xl border border-slate-800 text-xs font-bold"><button onClick={() => setChannelFilter("ALL")} className={channelFilter === "ALL" ? "px-3 py-1.5 rounded-lg bg-amber-600 text-white" : "px-3 py-1.5 rounded-lg text-slate-400"}>Todos ({threads.length})</button><button onClick={() => setChannelFilter("WHATSAPP")} className={channelFilter === "WHATSAPP" ? "px-3 py-1.5 rounded-lg bg-emerald-600 text-white" : "px-3 py-1.5 rounded-lg text-slate-400"}>WhatsApp</button><button onClick={() => setChannelFilter("SMS")} className={channelFilter === "SMS" ? "px-3 py-1.5 rounded-lg bg-blue-600 text-white" : "px-3 py-1.5 rounded-lg text-slate-400"}>SMS</button><button onClick={() => setChannelFilter("INSTAGRAM")} className={channelFilter === "INSTAGRAM" ? "px-3 py-1.5 rounded-lg bg-pink-600 text-white" : "px-3 py-1.5 rounded-lg text-slate-400"}>Redes</button></div>
      </div>
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 bg-[#0c121e] border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden p-3">
        <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col gap-3 border-r border-slate-800/80 pr-3 h-full overflow-hidden">
          <div className="relative"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar conversación o mensaje..." className="w-full bg-[#080c14] border border-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-amber-500" /></div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">{filteredThreads.map((t) => { const isSelected = t.caseId === selectedCaseId; return (<div key={t.caseId} onClick={() => setSelectedCaseId(t.caseId)} className={`p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? "bg-slate-900 border-amber-500/80 shadow-md ring-1 ring-amber-500/30" : "bg-[#080c14] border-slate-800/80 hover:bg-slate-900/40"}`}><div className="flex items-start justify-between gap-2 mb-1"><div><div className="flex items-center gap-1.5"><span className="font-bold text-xs text-white">{t.clientName}</span><span className="text-[9px] font-mono text-slate-400">({t.caseId})</span></div><span className="text-[10px] text-slate-400 font-mono">{t.phone}</span></div><div className="flex flex-col items-end gap-1">{getChannelBadge(t.lastMessage.channel)}<span className="text-[9px] text-slate-500 font-mono">{new Date(t.lastMessage.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div></div><p className="text-[11px] text-slate-300 line-clamp-2 leading-snug">{t.lastMessage.text}</p></div>); })}</div>
        </div>
        <div className="hidden md:flex col-span-7 lg:col-span-8 flex-col h-full min-h-0 pl-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3"><div><div className="flex items-center gap-2"><h2 className="font-extrabold text-sm text-white">{activeCase?.leadName || "Cliente"}</h2><span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-amber-500/30">{selectedCaseId}</span><span className="text-xs text-slate-400 font-mono">{activeCase?.phone}</span></div><p className="text-[11px] text-slate-400 mt-0.5">{activeCase?.employer} • {activeCase?.caseType.replace("_", " ")}</p></div><div className="flex items-center gap-1 bg-[#080c14] p-1 rounded-xl border border-slate-800 text-xs font-bold"><button onClick={() => setActiveChannel("WHATSAPP")} className={activeChannel === "WHATSAPP" ? "px-2.5 py-1 rounded-lg bg-emerald-600 text-white" : "px-2.5 py-1 rounded-lg text-slate-400"}>WhatsApp</button><button onClick={() => setActiveChannel("SMS")} className={activeChannel === "SMS" ? "px-2.5 py-1 rounded-lg bg-blue-600 text-white" : "px-2.5 py-1 rounded-lg text-slate-400"}>SMS</button><button onClick={() => setActiveChannel("INSTAGRAM")} className={activeChannel === "INSTAGRAM" ? "px-2.5 py-1 rounded-lg bg-pink-600 text-white" : "px-2.5 py-1 rounded-lg text-slate-400"}>Social</button></div></div>
          <div className="flex-1 overflow-y-auto bg-[#080c14] border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3 min-h-0 mb-3">{messages.map((m) => (<div key={m.id} className={m.sender === "CLIENT" ? "flex flex-col max-w-[75%] rounded-2xl p-3 text-xs bg-slate-800 text-slate-200 self-start border border-slate-700 shadow-sm" : m.sender === "SYSTEM" ? "flex flex-col max-w-[75%] rounded-xl p-2 text-xs bg-amber-950/60 text-amber-200 self-center border border-amber-500/30 text-center text-[11px]" : m.sender === "AI_AGENT" ? "flex flex-col max-w-[75%] rounded-2xl p-3 text-xs bg-purple-950/80 text-purple-200 border border-purple-500/50 self-end" : "flex flex-col max-w-[75%] rounded-2xl p-3 text-xs bg-blue-600 text-white self-end shadow-sm"}><div className="flex items-center justify-between gap-3 text-[10px] opacity-80 mb-1"><span className="font-bold">{m.sender === "CLIENT" ? `${activeCase?.leadName} (${m.channel})` : m.sender === "AI_AGENT" ? "Clon IA Legal (Hermes 3)" : m.sender === "SYSTEM" ? "Sistema" : "Agente"}</span><span>{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div><p className="leading-relaxed break-words">{m.text}</p></div>))}</div>
          <div className="flex items-center gap-2"><input type="text" value={replyText} onChange={(e) => setNewReplyText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={`Escribir respuesta directa por ${activeChannel}...`} className="flex-1 bg-[#080c14] border border-slate-800 text-xs text-white px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500" /><button onClick={handleSend} className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shrink-0"><Send className="w-3.5 h-3.5" /><span>Responder</span></button></div>
        </div>
      </div>
    </div>
  );
};
