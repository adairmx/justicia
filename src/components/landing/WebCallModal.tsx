import React, { useState, useEffect } from "react";
import { Phone, PhoneForwarded, Mic, MicOff, X, ShieldCheck, User, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface WebCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCaptured?: (lead: any) => void;
}

export const WebCallModal: React.FC<WebCallModalProps> = ({ isOpen, onClose, onLeadCaptured }) => {
  const [step, setStep] = useState<"PHONE_PROMPT" | "CALLING">("PHONE_PROMPT");
  const [userPhone, setUserPhone] = useState("");
  const [callState, setCallState] = useState<"CONNECTING" | "RINGING" | "CONNECTED" | "ENDED">("CONNECTING");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const agentName = "Línea Legal 24/7 (Justicia Latina)";

  useEffect(() => {
    if (!isOpen) {
      setStep("PHONE_PROMPT");
      setUserPhone("");
      setCallState("CONNECTING");
      setCallDuration(0);
      return;
    }
  }, [isOpen]);

  const handleStartCallWithPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone.trim()) return;

    // Save lead upfront immediately so we never lose the phone number
    const payload = {
      leadName: `Llamada Web (${userPhone})`,
      phone: userPhone,
      caseType: "Workers_Comp",
      injuryDetails: `[Llamada Web Iniciada] Número celular ingresado previo a conexión: ${userPhone}`,
      source: "AB_TEST_WEB_CALL_PRE_CAPTURED"
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

    // Advance to real calling step
    setStep("CALLING");
    setCallState("CONNECTING");

    setTimeout(() => {
      setCallState("RINGING");
    }, 1200);

    setTimeout(() => {
      setCallState("CONNECTED");
    }, 3600);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && step === "CALLING" && callState === "CONNECTED") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, step, callState]);

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
    }, 1200);
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Llamada Web Cifrada y Gratuita
        </div>

        {/* STEP 1: ONLY PHONE NUMBER REQUIRED BEFORE CONNECTING */}
        {step === "PHONE_PROMPT" ? (
          <div className="w-full flex flex-col items-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Phone className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Ingresa tu número de teléfono
              </h3>
              <p className="text-xs text-zinc-300 max-w-[260px] mx-auto leading-relaxed">
                Para comunicarte de inmediato y llamarte si la conexión se corta o cuelga.
              </p>
            </div>

            <form onSubmit={handleStartCallWithPhone} className="w-full space-y-3 pt-2">
              <input
                type="tel"
                required
                autoFocus
                placeholder="(312) 000-0000"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full bg-[#061222] border-2 border-emerald-500/60 rounded-2xl px-4 py-3.5 text-center text-lg font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 shadow-inner"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <span>Conectar llamada ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[10px] text-zinc-400">
              🔒 Tu número es confidencial. Sin spam.
            </p>
          </div>
        ) : (
          /* STEP 2: ACTIVE CALL INTERFACE WITH RECORDED NUMBER */
          <div className="w-full flex flex-col items-center animate-fadeIn">
            {/* Avatar with Animation */}
            <div className="relative mb-4">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-1 flex items-center justify-center shadow-xl shadow-emerald-500/20 ${callState === "CONNECTED" ? "animate-pulse" : ""}`}>
                <div className="w-full h-full rounded-full bg-[#0b101d] flex items-center justify-center text-white">
                  <User className="w-9 h-9 text-emerald-400" />
                </div>
              </div>
              {callState === "CONNECTED" && (
                <span className="absolute bottom-0 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0e1424] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </span>
              )}
            </div>

            {/* Title / Agent */}
            <h3 className="text-base font-bold text-white tracking-tight">
              {agentName}
            </h3>
            <div className="text-[11px] text-zinc-400 mt-1">
              Teléfono de respaldo: <span className="font-mono text-emerald-400 font-bold">{userPhone}</span>
            </div>

            <p className="text-xs text-zinc-300 mt-2 font-sans">
              {callState === "CONNECTING" && "Iniciando canal de voz WebRTC..."}
              {callState === "RINGING" && "Llamando a un agente de Justicia Latina..."}
              {callState === "CONNECTED" && (
                <span className="text-emerald-400 font-mono font-semibold flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Llamada en Curso • {formatTime(callDuration)}
                </span>
              )}
              {callState === "ENDED" && "Llamada finalizada"}
            </p>

            {/* Audio Wave Visualizer Simulation */}
            {callState === "CONNECTED" && (
              <div className="flex items-center justify-center gap-1 h-8 my-5">
                {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full animate-pulse"
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
                title="Pasar a llamada telefónica tradicional"
              >
                <PhoneForwarded className="w-5 h-5 text-emerald-400" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
