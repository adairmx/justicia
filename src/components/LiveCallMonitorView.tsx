import React, { useState, useEffect } from "react";
import { 
  Headphones, 
  Mic, 
  MicOff, 
  Radio, 
  UserCheck, 
  Volume2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  PhoneForwarded,
  FileSignature
} from "lucide-react";

interface LiveCall {
  callSid: string;
  agentName: string;
  clientName: string;
  clientPhone: string;
  caseType: string;
  durationSeconds: number;
  status: string;
  supervisorListening: boolean;
  supervisorWhispering: boolean;
  retainerSent: boolean;
  retainerSigned: boolean;
}

export const LiveCallMonitorView: React.FC = () => {
  const [calls, setCalls] = useState<LiveCall[]>([]);
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null);
  const [monitorMode, setMonitorMode] = useState<"IDLE" | "SHADOW_LISTEN" | "WHISPER">("IDLE");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCalls = async () => {
    try {
      const res = await fetch("/api/voice/active-calls");
      const data = await res.json();
      if (Array.isArray(data)) setCalls(data);
    } catch (e) {
      // Keep existing state if offline
    }
  };

  useEffect(() => {
    fetchCalls();
    const interval = setInterval(fetchCalls, 3000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartShadow = async (callSid: string) => {
    setActiveCallSid(callSid);
    setMonitorMode("SHADOW_LISTEN");
    try {
      const res = await fetch("/api/voice/shadow/listen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callSid, supervisorName: "José (Supervisor)" })
      });
      const data = await res.json();
      showToast(data.message || "Conectado en Modo Sombra (silencioso).");
      fetchCalls();
    } catch (e) {
      showToast("Conectado a la conferencia en Modo Sombra (Audio 1-vía).");
    }
  };

  const handleToggleWhisper = async (callSid: string) => {
    if (monitorMode === "WHISPER") {
      // Revert to shadow listen
      setMonitorMode("SHADOW_LISTEN");
      await fetch("/api/voice/shadow/listen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callSid })
      });
      showToast("Modo Susurro desactivado. Regresando a escucha en silencio.");
    } else {
      setMonitorMode("WHISPER");
      await fetch("/api/voice/shadow/whisper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callSid, supervisorName: "José (Supervisor)" })
      });
      showToast("Modo Susurro ACTIVADO: Hablas directo a la diadema del agente.");
    }
    fetchCalls();
  };

  const handleLeaveMonitor = async (callSid: string) => {
    setActiveCallSid(null);
    setMonitorMode("IDLE");
    try {
      await fetch("/api/voice/shadow/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callSid })
      });
    } catch (e) {}
    showToast("Te has desconectado de la llamada.");
    fetchCalls();
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-16 min-w-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-amber-500/50 text-amber-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-bold text-zinc-100 font-['Outfit'] tracking-tight">
              Torre de Control de Llamadas en Vivo
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Supervisión en tiempo real con <strong>Modo Sombra</strong> (escucha oculta) y <strong>Susurro</strong> (coaching privado al agente).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Canal de Monitoreo: <strong>Activo (Twilio WebRTC)</strong></span>
        </div>
      </div>

      {/* Active Monitor Status Banner */}
      {activeCallSid && (
        <div className="bg-gradient-to-r from-amber-500/10 via-zinc-900 to-amber-500/5 border border-amber-500/40 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {monitorMode === "WHISPER" ? "Modo Susurro Activo (Coach)" : "Modo Sombra Activo (Escucha Silenciosa)"}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                  Canal Seguro
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                {monitorMode === "WHISPER" 
                  ? "Tu micrófono está abierto SÓLO para el agente. El cliente NO te escucha."
                  : "Estás escuchando la conversación en sigilo total. Ni el agente ni el cliente saben que estás conectado."
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => handleToggleWhisper(activeCallSid)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                monitorMode === "WHISPER"
                  ? "bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-zinc-800 text-amber-300 hover:bg-zinc-700 border border-amber-500/30"
              }`}
            >
              {monitorMode === "WHISPER" ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{monitorMode === "WHISPER" ? "Desactivar Susurro" : "Susurrar al Agente"}</span>
            </button>
            <button
              onClick={() => handleLeaveMonitor(activeCallSid)}
              className="px-3 py-2 bg-red-600/90 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Salir de Llamada
            </button>
          </div>
        </div>
      )}

      {/* Grid of Active Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {calls.map((call) => {
          const isBeingMonitored = activeCallSid === call.callSid;

          return (
            <div 
              key={call.callSid}
              className={`bg-[#0b0f19] border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all ${
                isBeingMonitored 
                  ? "border-amber-500/80 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/40" 
                  : "border-zinc-800/90 hover:border-zinc-700"
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <h3 className="text-sm font-bold text-zinc-100">{call.clientName}</h3>
                    <span className="text-xs text-zinc-400 font-mono">{call.clientPhone}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 block mt-1 font-medium">
                    {call.caseType}
                  </span>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                    <Radio className="w-3 h-3 animate-pulse" />
                    {formatSeconds(call.durationSeconds)}
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-1">Llamada en curso</span>
                </div>
              </div>

              {/* Middle Agent & Retainer Status */}
              <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-400 block">Agente en Línea</span>
                    <span className="font-bold text-zinc-200">{call.agentName}</span>
                  </div>
                </div>

                {/* Retainer Status Badge */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">Estatus Retainer</span>
                    {call.retainerSigned ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-400 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ¡Firmado en Llamada!
                      </span>
                    ) : call.retainerSent ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-400 text-xs animate-pulse">
                        <FileSignature className="w-3.5 h-3.5" /> SMS Enviado (Esperando)
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-xs">No enviado aún</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span>Sala:</span>
                  <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{call.conferenceRoom}</code>
                </div>

                <div className="flex items-center gap-2">
                  {isBeingMonitored ? (
                    <button
                      onClick={() => handleLeaveMonitor(call.callSid)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                    >
                      Desconectar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartShadow(call.callSid)}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Escuchar (Modo Sombra)</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Philosophy Callout */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 flex items-start gap-3 text-xs text-zinc-400">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-zinc-200">Protocolo de Cierre en Caliente:</strong>
          <span className="ml-1">
            Los agentes tienen instrucción estricta de no descartar ningún lead por teléfono. A todos se les envía el link del Retainer por SMS durante la llamada para asegurar el contrato de representación; la evaluación de mérito legal final la realiza el bufete receptor.
          </span>
        </div>
      </div>
    </div>
  );
};
