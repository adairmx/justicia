import React, { useState, useEffect } from "react";
import { Search, Send } from "lucide-react";
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
}

export const OmnichannelInboxView: React.FC<OmnichannelInboxViewProps> = ({ cases }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("WC-8921");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setNewReplyText] = useState<string>("");
  const [activeChannel, setActiveChannel] = useState<"WHATSAPP" | "SMS" | "WEBCHAT">("WHATSAPP");

  const threads: ConversationThread[] = [
    { caseId: "WC-8921", clientName: "Carlos Ramirez", phone: "+1 (818) 555-0192", caseType: "Workers Comp", lastMessage: { id: 4, channel: "SMS", sender: "CLIENT", text: "¡Listo! Ya lo firmé desde mi celular. ¿Qué sigue con la clínica?", timestamp: "2026-08-30T14:18:50Z" } },
    { caseId: "WC-9042", clientName: "Guadalupe Morales", phone: "+1 (619) 555-0144", caseType: "Workers Comp", lastMessage: { id: 2, channel: "INSTAGRAM", sender: "AI_AGENT", text: "Guadalupe, el estatus migratorio no afecta tu derecho a compensación.", timestamp: "2026-08-30T15:50:30Z" } },
    { caseId: "PI-4019", clientName: "Michael Johnson", phone: "+1 (213) 555-0188", caseType: "Personal Injury", lastMessage: { id: 3, channel: "SMS", sender: "AGENT", text: "Retainer agreement link sent: https://justicia.legal/sign/RET-2026-4019", timestamp: "2026-08-30T15:20:00Z" } },
    { caseId: "WC-9105", clientName: "Roberto Sanchez", phone: "+1 (909) 555-0177", caseType: "Workers Comp", lastMessage: { id: 1, channel: "WHATSAPP", sender: "CLIENT", text: "Hola, me caí en la plataforma de FedEx en Fontana.", timestamp: "2026-08-30T16:10:00Z" } }
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
        body: JSON.stringify({ text: replyText, channel: activeChannel, sender: "AGENT" })
      });
      const saved = await res.json();
      setMessages(prev => [...prev, saved]);
      setNewReplyText("");
    } catch (e) {}
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1600px] mx-auto pb-16 h-[calc(100vh-140px)] min-w-0">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div><h1 className="text-xl font-bold text-zinc-100 font-[\x27Outfit\x27] tracking-tight">Mensajería Unificada</h1><p className="text-xs text-zinc-400">Conversaciones de WhatsApp, SMS y Web en orden cronológico descendente.</p></div>
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-medium"><button onClick={() => setChannelFilter("ALL")} className={`px-2.5 py-1 rounded-md ${channelFilter === "ALL" ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400"}`}>Todos</button><button onClick={() => setChannelFilter("WHATSAPP")} className={`px-2.5 py-1 rounded-md ${channelFilter === "WHATSAPP" ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400"}`}>WhatsApp</button><button onClick={() => setChannelFilter("SMS")} className={`px-2.5 py-1 rounded-md ${channelFilter === "SMS" ? "bg-zinc-800 text-zinc-100 font-semibold" : "text-zinc-400"}`}>SMS</button></div>
      </div>
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 bg-[#0b0f19] border border-zinc-800/90 rounded-xl overflow-hidden p-3">
        <div className="col-span-12 md:col-span-4 flex flex-col gap-2.5 border-r border-zinc-800/80 pr-3 h-full overflow-hidden">
          <div className="relative"><Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar chat..." className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 pl-9 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-zinc-700" /></div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">{filteredThreads.map((t) => { const isSelected = t.caseId === selectedCaseId; return (<div key={t.caseId} onClick={() => setSelectedCaseId(t.caseId)} className={`p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? "bg-zinc-800/90 border-zinc-700" : "bg-zinc-900/50 border-zinc-800/60 hover:bg-zinc-900"}`}><div className="flex items-start justify-between gap-2 mb-1"><div><span className="font-medium text-xs text-zinc-200 block">{t.clientName}</span><span className="text-[10px] text-zinc-500 font-mono">{t.phone}</span></div><span className="text-[9px] text-zinc-400 font-mono">{new Date(t.lastMessage.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div><p className="text-[11px] text-zinc-400 line-clamp-1">{t.lastMessage.text}</p></div>); })}</div>
        </div>
        <div className="hidden md:flex col-span-8 flex-col h-full min-h-0 pl-1">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-2.5"><div><span className="font-semibold text-sm text-zinc-200">{activeCase?.leadName}</span><span className="text-xs text-zinc-500 ml-2 font-mono">{activeCase?.phone}</span></div><div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-md border border-zinc-800 text-[11px]"><button onClick={() => setActiveChannel("WHATSAPP")} className={`px-2 py-0.5 rounded ${activeChannel === "WHATSAPP" ? "bg-zinc-800 text-zinc-100 font-medium" : "text-zinc-400"}`}>WhatsApp</button><button onClick={() => setActiveChannel("SMS")} className={`px-2 py-0.5 rounded ${activeChannel === "SMS" ? "bg-zinc-800 text-zinc-100 font-medium" : "text-zinc-400"}`}>SMS</button></div></div>
          <div className="flex-1 overflow-y-auto bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-3.5 flex flex-col gap-2.5 min-h-0 mb-2.5">{messages.map((m) => (<div key={m.id} className={`flex flex-col max-w-[75%] rounded-lg p-2.5 text-xs ${m.sender === "CLIENT" ? "bg-zinc-800 text-zinc-200 self-start border border-zinc-700/60" : "bg-zinc-700/80 text-zinc-100 self-end"}`}><div className="flex items-center justify-between gap-3 text-[10px] text-zinc-400 mb-1"><span>{m.sender === "CLIENT" ? activeCase?.leadName : "Abogado"}</span><span>{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div><p className="leading-relaxed">{m.text}</p></div>))}</div>
          <div className="flex items-center gap-2"><input type="text" value={replyText} onChange={(e) => setNewReplyText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={`Escribir respuesta por ${activeChannel}...`} className="flex-1 bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-zinc-700" /><button onClick={handleSend} className="px-4 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /><span>Enviar</span></button></div>
        </div>
      </div>
    </div>
  );
};
