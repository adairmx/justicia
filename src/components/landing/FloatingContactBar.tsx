import React from "react";
import { Phone, MessageCircle, Sparkles, Globe } from "lucide-react";

interface FloatingContactBarProps {
  onOpenConsultation: () => void;
  callMode?: "NATIVE_PHONE" | "WEB_CALL";
  onTriggerCall?: () => void;
}

export const FloatingContactBar: React.FC<FloatingContactBarProps> = ({
  onOpenConsultation,
  callMode = "NATIVE_PHONE",
  onTriggerCall
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2.5 sm:p-3 bg-[#070a12]/95 backdrop-blur-xl border-t border-zinc-800 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center gap-2">
        {/* Dynamic Call Button: Web Call VoIP vs Native Device Call */}
        {callMode === "WEB_CALL" ? (
          <button
            onClick={onTriggerCall}
            className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/60 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
          >
            <Globe className="w-4 h-4 animate-spin text-emerald-200" />
            <span>LLAMADA WEB 24/7</span>
          </button>
        ) : (
          <a
            href="tel:+18447448339"
            className="flex-1 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/60 active:scale-95 transition-all"
          >
            <Phone className="w-4 h-4 animate-bounce" />
            <span>LLAMAR 24/7 GRATIS</span>
          </a>
        )}

        {/* WhatsApp Direct Chat */}
        <a
          href="https://wa.me/13129894525?text=Hola,%20sufr%C3%AD%20un%20accidente%20y%20necesito%20asesor%C3%ADa%20legal%20gratuita."
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden xs:inline">WhatsApp</span>
        </a>

        {/* Instant Assessment Button */}
        <button
          onClick={onOpenConsultation}
          className="py-3 px-3 sm:px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>EVALUAR</span>
        </button>
      </div>
    </div>
  );
};
