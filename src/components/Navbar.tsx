import React from "react";
import { Scale, Plus, LayoutDashboard, FolderKanban, PhoneCall, MessageSquare } from "lucide-react";

export type MainTabType = "METRICS" | "CASES" | "INBOX";

interface NavbarProps {
  currentTab: MainTabType;
  setCurrentTab: (tab: MainTabType) => void;
  onOpenSoftphoneModal: () => void;
  onOpenNewCase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSoftphoneModal,
  onOpenNewCase
}) => {
  return (
    <header className="bg-[#090d16]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 sticky top-0 z-40 w-full">
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto min-w-0">
        <div className="flex items-center gap-6 min-w-0">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-200">
              <Scale className="w-4 h-4 text-amber-400/90" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-sm text-zinc-100 font-[\x27Outfit\x27]">JUSTICIA</span>
              <span className="text-[9px] text-zinc-500 font-medium ml-1.5 hidden sm:inline">Legal Voice OS</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center bg-zinc-900/90 p-1 rounded-lg border border-zinc-800/80 text-xs font-medium gap-1">
            <button onClick={() => setCurrentTab("METRICS")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${currentTab === "METRICS" ? "bg-zinc-800 text-zinc-100 font-semibold shadow-sm border border-zinc-700/50" : "text-zinc-400 hover:text-zinc-200"}`}><LayoutDashboard className="w-3.5 h-3.5" /><span>Métricas</span></button>
            <button onClick={() => setCurrentTab("CASES")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${currentTab === "CASES" ? "bg-zinc-800 text-zinc-100 font-semibold shadow-sm border border-zinc-700/50" : "text-zinc-400 hover:text-zinc-200"}`}><FolderKanban className="w-3.5 h-3.5" /><span>Casos</span></button>
            <button onClick={() => setCurrentTab("INBOX")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${currentTab === "INBOX" ? "bg-zinc-800 text-zinc-100 font-semibold shadow-sm border border-zinc-700/50" : "text-zinc-400 hover:text-zinc-200"}`}><MessageSquare className="w-3.5 h-3.5" /><span>Mensajería</span></button>
          </nav>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button onClick={onOpenSoftphoneModal} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium rounded-lg transition-colors"><PhoneCall className="w-3.5 h-3.5 text-zinc-400" /><span>Softphone</span></button>
          <button onClick={onOpenNewCase} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg transition-colors shadow-sm"><Plus className="w-3.5 h-3.5 stroke-[2.5]" /><span>Nuevo Caso</span></button>
        </div>
      </div>
    </header>
  );
};
