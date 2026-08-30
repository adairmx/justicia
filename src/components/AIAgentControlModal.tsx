import React, { useState } from "react";
import { X, Bot, Sparkles, Cpu, Mic2, Radio, Terminal, Zap, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

interface AIAgentControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiMode: "OFF" | "HYBRID" | "FULL_AUTONOMOUS";
  setAiMode: (mode: "OFF" | "HYBRID" | "FULL_AUTONOMOUS") => void;
  onSimulateAiLead?: () => void;
}

export const AIAgentControlModal: React.FC<AIAgentControlModalProps> = ({
  isOpen,
  onClose,
  aiMode,
  setAiMode,
  onSimulateAiLead
}) => {
  const [selectedVoiceModel, setSelectedVoiceModel] = useState("Cartesia_Sonic_Adair_Clone");
  const [selectedLLM, setSelectedLLM] = useState("Hermes_3_70B_LoRA_Closer");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e1626] border border-purple-500/40 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Centro de Control de Agentes de IA</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">Hermes 3 / Vapi</span>
              </div>
              <p className="text-xs text-slate-400">Configuración de voz clonada, orquestación y transición autónoma</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div onClick={() => setAiMode("OFF")} className={`p-4 rounded-2xl border cursor-pointer transition-all ${aiMode === "OFF" ? "bg-slate-900 border-blue-500 shadow-lg ring-1 ring-blue-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}><div className="flex justify-between items-center mb-2"><span className="font-bold text-white">100% Humano</span>{aiMode === "OFF" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}</div><p className="text-slate-400 text-[11px] leading-relaxed">Operadores humanos para Intake y Closer manual con Softphone Twilio.</p></div>
            <div onClick={() => setAiMode("HYBRID")} className={`p-4 rounded-2xl border cursor-pointer transition-all ${aiMode === "HYBRID" ? "bg-slate-900 border-blue-500 shadow-lg ring-1 ring-blue-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}><div className="flex justify-between items-center mb-2"><span className="font-bold text-white">Híbrido (Liner IA)</span>{aiMode === "HYBRID" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}</div><p className="text-slate-400 text-[11px] leading-relaxed">IA califica llamadas 24/7 y transfiere en caliente al Closer humano para el cierre.</p></div>
            <div onClick={() => setAiMode("FULL_AUTONOMOUS")} className={`p-4 rounded-2xl border cursor-pointer transition-all ${aiMode === "FULL_AUTONOMOUS" ? "bg-purple-950/60 border-purple-500 shadow-lg ring-1 ring-purple-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}><div className="flex justify-between items-center mb-2"><span className="font-bold text-purple-200">100% Autónomo</span>{aiMode === "FULL_AUTONOMOUS" && <CheckCircle2 className="w-4 h-4 text-purple-400" />}</div><p className="text-slate-300 text-[11px] leading-relaxed">Tu Clon de voz + Hermes 3 ejecutan la llamada completa y envían Retainer SMS.</p></div>
          </div>
        </div>
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Modo actual: <strong className="text-amber-400">{aiMode}</strong></span>
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl">Cerrar</button>
        </div>
      </div>
    </div>
  );
};
