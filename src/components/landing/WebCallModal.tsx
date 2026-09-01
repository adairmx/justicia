import React, { useState, useEffect } from "react";
import { Phone, PhoneCall, PhoneForwarded, Mic, MicOff, Volume2, X, ShieldCheck, User, Sparkles, CheckCircle2 } from "lucide-react";

interface WebCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCaptured?: (lead: any) => void;
}

export const WebCallModal: React.FC<WebCallModalProps> = ({ isOpen, onClose, onLeadCaptured }) => {
  const [callState, setCallState] = useState<"CONNECTING" | "RINGING" | "CONNECTED" | "ENDED">("CONNECTING");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [agentName, setAgentName] = useState("Lic. Adair Morales (Línea Legal 24/7)");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isCapturingData, setIsCapturingData] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setCallState("CONNECTING");
      setCallDuration(0);
      return;
    }

    // Realistic Web Call State Flow
    const timer1 = setTimeout(() => {
      setCallState("RINGING");
    }, 1200);

    const timer2 = setTimeout(() => {
      setCallState("CONNECTED");
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && callState === "CONNECTED") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, callState]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setCallState("ENDED");
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone) return;

    const payload = {
      leadName: userName || "Llamada WebRTC Entrante",
      phone: userPhone,
      caseType: "Workers_Comp",
      injuryDetails: `[Llamada Web In-Browser] Duración: ${callDuration}s | Contacto ingresado durante la llamada web`,
      source: "AB_TEST_WEB_CALL"
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && onLeadCaptured) {
        onLeadCaptured(data.lead);
      }
    } catch (err) {}
    setIsCapturingData(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0e1424] border border-emerald-500/40 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Security / Confidentiality Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          Llamada Web Cifrada y Gratuita
        </div>

        {/* Avatar with Animation */}
        <div className="relative mb-4">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-1 flex items-center justify-center shadow-xl shadow-amber-500/20 ${callState === "CONNECTED" ? "animate-pulse" : ""}`}>
            <div className="w-full h-full rounded-full bg-[#0b101d] flex items-center justify-center text-white">
              <User className="w-10 h-10 text-amber-400" />
            </div>
          </div>
          {callState === "CONNECTED" && (
            <span className="absolute bottom-0 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0e1424] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </span>
          )}
        </div>

        {/* Title / Agent */}
        <h3 className="text-lg font-bold text-white font-serif tracking-tight">
          {agentName}
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5 font-sans">
          {callState === "CONNECTING" && "Iniciando canal de voz VoIP..."}
          {callState === "RINGING" && "Llamando a la central legal..."}
          {callState === "CONNECTED" && (
            <span className="text-emerald-400 font-mono font-semibold flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Llamada en Curso • {formatTime(callDuration)}
            </span>
          )}
          {callState === "ENDED" && "Llamada finalizada"}
        </p>

        {/* Quick Lead Capture During Call */}
        {callState === "CONNECTED" && isCapturingData && (
          <div className="w-full mt-5 p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-left text-xs animate-fadeIn">
            <div className="text-[11px] font-bold text-amber-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Por si se interrumpe la llamada:</span>
            </div>
            <form onSubmit={handleSaveContact} className="space-y-2">
              <input
                type="text"
                placeholder="Tu Nombre"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <div className="flex gap-2">
                <input
                  type="tel"
                  required
                  placeholder="Tu Teléfono Celular"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        )}

        {callState === "CONNECTED" && !isCapturingData && (
          <div className="w-full mt-4 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Contacto respaldado con el asesor</span>
          </div>
        )}

        {/* Audio Wave Visualizer Simulation */}
        {callState === "CONNECTED" && (
          <div className="flex items-center justify-center gap-1 h-8 my-5">
            {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-gradient-to-t from-emerald-500 to-amber-400 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.4 + (i % 4) * 0.2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Call Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-all ${
              isMuted
                ? "bg-red-500/20 border-red-500 text-red-400"
                : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            }`}
            title={isMuted ? "Activar Micrófono" : "Silenciar Micrófono"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/40 transition-transform active:scale-95"
            title="Colgar llamada"
          >
            <Phone className="w-6 h-6 rotate-[135deg]" />
          </button>

          <a
            href="tel:+18447448339"
            className="p-3.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all"
            title="Pasar a llamada telefónica normal"
          >
            <PhoneForwarded className="w-5 h-5 text-amber-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
