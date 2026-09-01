import React from "react";
import { Scale, Phone, ShieldCheck, Sparkles, LogIn, Globe } from "lucide-react";

interface LandingNavbarProps {
  onOpenConsultation: () => void;
  onOpenCRM: () => void;
  callMode?: "NATIVE_PHONE" | "WEB_CALL";
  onTriggerCall?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenConsultation,
  onOpenCRM,
  callMode = "NATIVE_PHONE",
  onTriggerCall
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#070a12]/90 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      {/* Top emergency & trust notification bar */}
      <div className="bg-gradient-to-r from-amber-600/20 via-emerald-600/20 to-blue-600/20 border-b border-zinc-800/50 py-1.5 px-4 text-center">
        <p className="text-xs font-medium text-zinc-300 flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Confidencial
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-amber-400 font-semibold">
            Sin Importar tu Estatus Migratorio
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-200">
            ¡Si no ganamos tu caso, <strong>NO PAGAS NADA!</strong>
          </span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
            <Scale className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-serif">
                JUSTICIA<span className="text-amber-400">LATINA</span>
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-widest">
                USA
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
              Defensa Legal & Compensación para la Comunidad Hispana
            </p>
          </div>
        </div>

        {/* Quick Actions & Phone */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Dynamic Call Button: Web Call VoIP vs Native Device Call */}
          {callMode === "WEB_CALL" ? (
            <button
              onClick={onTriggerCall}
              className="flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400 text-white font-bold text-sm shadow-md shadow-emerald-950/50 transition-all group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-950/60 flex items-center justify-center text-white group-hover:scale-110 transition-transform animate-pulse">
                <Globe className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider leading-none">Llamar Gratis Online</div>
                <div className="text-sm font-extrabold text-white tracking-tight">Voz por Internet (Web)</div>
              </div>
              <span className="sm:hidden text-xs text-white font-bold">Llamada Web</span>
            </button>
          ) : (
            <a
              href="tel:+18447448339"
              className="flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-emerald-500/40 text-white font-bold text-sm shadow-md shadow-emerald-950/40 transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform animate-pulse">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider leading-none">Llamada Gratis 24/7</div>
                <div className="text-sm font-extrabold text-zinc-100 tracking-tight">(844) 744-8339</div>
              </div>
              <span className="sm:hidden text-xs text-emerald-400 font-bold">Llamar 24/7</span>
            </a>
          )}

          {/* Primary CTA Button */}
          <button
            onClick={onOpenConsultation}
            className="px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 fill-black/30" />
            <span>Evaluar Mi Caso Gratis</span>
          </button>

          {/* CRM Internal Access */}
          <button
            onClick={onOpenCRM}
            title="Acceso Staff / CRM de Operaciones"
            className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <LogIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
