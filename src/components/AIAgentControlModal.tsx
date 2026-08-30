import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Cpu, 
  Mic2, 
  Radio, 
  Terminal, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AIAgentControlModalProps {
  onClose: () => void;
  aiMode: 'OFF' | 'HYBRID' | 'FULL_AUTONOMOUS';
  setAiMode: (mode: 'OFF' | 'HYBRID' | 'FULL_AUTONOMOUS') => void;
  onSimulateAiLead: () => void;
}

export const AIAgentControlModal: React.FC<AIAgentControlModalProps> = ({
  onClose,
  aiMode,
  setAiMode,
  onSimulateAiLead
}) => {
  const [selectedVoiceModel, setSelectedVoiceModel] = useState('Cartesia_Sonic_Adair_Clone');
  const [selectedLLM, setSelectedLLM] = useState('Hermes_3_70B_LoRA_Closer');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e1626] border border-purple-500/40 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Centro de Control de Agentes de IA</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold border border-purple-700">
                  Hermes 3 / Vapi / Twilio Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">Configuración de voz clonada, orquestación y transición autónoma</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5 text-xs">
          
          {/* Operational Mode Cards */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-200">Modo de Operación del Call Center:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Mode 1: Human */}
              <div
                onClick={() => setAiMode('OFF')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  aiMode === 'OFF'
                    ? 'bg-slate-900 border-blue-500 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">100% Humano</span>
                  {aiMode === 'OFF' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Operadores humanos en Venezuela para Intake y Closer manual con Softphone Twilio.
                </p>
              </div>

              {/* Mode 2: Hybrid */}
              <div
                onClick={() => setAiMode('HYBRID')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  aiMode === 'HYBRID'
                    ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Híbrido (Liner IA)</span>
                  {aiMode === 'HYBRID' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  IA califica llamadas 24/7 y transfiere en caliente al Closer humano para el cierre.
                </p>
              </div>

              {/* Mode 3: 100% Autonomous */}
              <div
                onClick={() => setAiMode('FULL_AUTONOMOUS')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  aiMode === 'FULL_AUTONOMOUS'
                    ? 'bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-purple-300">100% Autónomo</span>
                  {aiMode === 'FULL_AUTONOMOUS' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tu Clon de voz + Hermes 3 ejecutan la llamada completa, envían SMS Retainer y confirman la firma.
                </p>
              </div>

            </div>
          </div>

          {/* Engine Parameters */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Configuración del Motor Neural</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-400 font-semibold">Cerebro de Razonamiento (LLM / LoRA):</label>
                <select
                  value={selectedLLM}
                  onChange={(e) => setSelectedLLM(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white p-2 rounded-lg focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                >
                  <option value="Hermes_3_70B_LoRA_Closer">Hermes 3 70B (LoRA Persuasión & Cierre)</option>
                  <option value="Qwen_2.5_72B_Legal">Qwen 2.5 72B (Multilingüe ES/EN)</option>
                  <option value="Claude_3.5_Sonnet_ToolCalling">Claude 3.5 Sonnet (Tool Calling)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-400 font-semibold">Clon de Voz Acústico (TTS Streaming):</label>
                <select
                  value={selectedVoiceModel}
                  onChange={(e) => setSelectedVoiceModel(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white p-2 rounded-lg focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                >
                  <option value="Cartesia_Sonic_Adair_Clone">Cartesia Sonic (Tu Clon de Voz - Latencia 120ms)</option>
                  <option value="ElevenLabs_PVC_Adair">ElevenLabs PVC (Professional Voice Clone)</option>
                  <option value="Deepgram_Aura_Bilingual">Deepgram Aura (Bilingüe Nativo)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Webhook Endpoints for Live AI Integration */}
          <div className="bg-[#090d16] border border-slate-800 p-4 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Webhooks Expuestos para Vapi / Retell / n8n</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Activo en /api/ai/*</span>
            </div>
            
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 flex flex-col gap-1">
              <div><strong className="text-purple-400">POST</strong> /api/ai/intake-webhook ➔ <span className="text-slate-400">Crea lead calificado por IA</span></div>
              <div><strong className="text-amber-400">POST</strong> /api/cases/:id/retainer/send ➔ <span className="text-slate-400">Dispara Retainer vía SMS</span></div>
              <div><strong className="text-emerald-400">POST</strong> /api/cases/:id/retainer/status-update ➔ <span className="text-slate-400">Recibe firma en vivo</span></div>
            </div>
          </div>

          {/* Test Action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <p className="text-[11px] text-slate-400">¿Quieres probar la inyección de un lead calificado por el Agente de Voz IA?</p>
            <button
              onClick={() => {
                onSimulateAiLead();
                onClose();
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-950/50 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Simular Llamada Entrante de IA</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
