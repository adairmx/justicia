import React from "react";
import { Split, Sparkles, CheckCircle, TrendingUp, RefreshCw, Phone, Globe } from "lucide-react";

interface ABTestSwitcherProps {
  currentVariant: "CLASSIC_A" | "HIGH_CONVERSION_B";
  onSelectVariant: (variant: "CLASSIC_A" | "HIGH_CONVERSION_B") => void;
  callMode: "NATIVE_PHONE" | "WEB_CALL";
  onSelectCallMode: (mode: "NATIVE_PHONE" | "WEB_CALL") => void;
  onOpenCRM: () => void;
}

export const ABTestSwitcher: React.FC<ABTestSwitcherProps> = ({
  currentVariant,
  onSelectVariant,
  callMode,
  onSelectCallMode,
  onOpenCRM
}) => {
  return (
    <aside aria-label="Control de Pruebas A/B" className="fixed top-20 right-4 z-50 bg-[#0d1322]/95 border border-amber-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-md hidden sm:flex flex-col gap-2.5 max-w-[280px] animate-fadeIn text-xs">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-1.5">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <Split className="w-3.5 h-3.5" />
          <span>A/B Testing Suite</span>
        </div>
        <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-500/30">
          Live Matrix
        </span>
      </div>

      {/* 1. Landing Page Design Test */}
      <div>
        <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>1. Diseño Landing:</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onSelectVariant("CLASSIC_A")}
            className={`px-2 py-1.5 rounded-lg font-bold text-[11px] text-center transition-all ${
              currentVariant === "CLASSIC_A"
                ? "bg-blue-900 border border-blue-400 text-white shadow-sm"
                : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Variante A
            <span className="block text-[9px] font-normal opacity-80">Clon Actual</span>
          </button>

          <button
            onClick={() => onSelectVariant("HIGH_CONVERSION_B")}
            className={`px-2 py-1.5 rounded-lg font-bold text-[11px] text-center transition-all ${
              currentVariant === "HIGH_CONVERSION_B"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-300 text-black shadow-md shadow-amber-500/20 font-black"
                : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Variante B
            <span className="block text-[9px] font-normal opacity-90">High-CRO</span>
          </button>
        </div>
      </div>

      {/* 2. Call Mode Test (Native tel: vs Web VoIP) */}
      <div className="pt-1 border-t border-zinc-800/80">
        <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>2. Modo de Llamada:</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onSelectCallMode("NATIVE_PHONE")}
            className={`px-2 py-1.5 rounded-lg font-bold text-[10px] text-center flex flex-col items-center gap-0.5 transition-all ${
              callMode === "NATIVE_PHONE"
                ? "bg-emerald-700/80 border border-emerald-400 text-white shadow-sm"
                : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>Nativa Tel:</span>
            <span className="text-[8px] font-normal opacity-80">(Marcador móvil)</span>
          </button>

          <button
            onClick={() => onSelectCallMode("WEB_CALL")}
            className={`px-2 py-1.5 rounded-lg font-bold text-[10px] text-center flex flex-col items-center gap-0.5 transition-all ${
              callMode === "WEB_CALL"
                ? "bg-gradient-to-r from-teal-600 to-emerald-600 border border-emerald-300 text-white shadow-md shadow-emerald-500/20 font-black"
                : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Globe className="w-3 h-3 text-teal-300 animate-spin" />
            <span>Web Call</span>
            <span className="text-[8px] font-normal opacity-90">(VoIP navegador)</span>
          </button>
        </div>
      </div>

      <div className="pt-1.5 border-t border-zinc-800 flex items-center justify-between text-[10px]">
        <span className="text-zinc-400 font-medium">Bandeja CRM:</span>
        <button
          onClick={onOpenCRM}
          className="text-amber-400 hover:underline font-semibold"
        >
          Ver Leads en Vivo →
        </button>
      </div>
    </aside>
  );
};
