import React from 'react';
import { 
  Scale, 
  Bot, 
  Sparkles, 
  Plus,
  LayoutDashboard,
  FolderKanban,
  PhoneCall
} from 'lucide-react';
import { Stats } from '../types';

export type MainTabType = 'METRICS' | 'CASES';

interface NavbarProps {
  currentTab: MainTabType;
  setCurrentTab: (tab: MainTabType) => void;
  onOpenSoftphoneModal: () => void;
  onOpenNewCase: () => void;
  onOpenAIModal: () => void;
  aiMode: 'OFF' | 'HYBRID' | 'FULL_AUTONOMOUS';
  isWsConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSoftphoneModal,
  onOpenNewCase,
  onOpenAIModal,
  aiMode,
  isWsConnected
}) => {
  return (
    <header className="bg-[#0c121e]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 sticky top-0 z-40 w-full overflow-hidden">
      <div className="flex items-center justify-between gap-4 max-w-[1800px] mx-auto min-w-0">
        
        {/* Brand & Main Tabs */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/40 shrink-0">
              <Scale className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold tracking-tight text-lg text-white font-['Outfit'] truncate">JUSTICIA</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  Voice OS
                </span>
              </div>
            </div>
          </div>

          {/* THE 2 MAIN TABS: 1. Métricas de Negocio, 2. Casos */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-semibold shrink-0 gap-1">
            <button
              onClick={() => setCurrentTab('METRICS')}
              className={
                currentTab === 'METRICS'
                  ? 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all bg-amber-600 text-white font-bold shadow-md shadow-amber-950/40'
                  : 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all text-slate-400 hover:text-slate-200'
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Métricas de Negocio</span>
            </button>

            <button
              onClick={() => setCurrentTab('CASES')}
              className={
                currentTab === 'CASES'
                  ? 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all bg-amber-600 text-white font-bold shadow-md shadow-amber-950/40'
                  : 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all text-slate-400 hover:text-slate-200'
              }
            >
              <FolderKanban className="w-4 h-4" />
              <span>Casos & Expedientes</span>
            </button>
          </div>
        </div>

        {/* Action Controls: Softphone Shortcut + AI + New Case */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Direct Softphone Shortcut */}
          <button
            onClick={onOpenSoftphoneModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="hidden sm:inline">Softphone</span>
          </button>

          {/* AI Mode Selector */}
          <button
            onClick={onOpenAIModal}
            className={
              aiMode === 'FULL_AUTONOMOUS'
                ? 'flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold bg-purple-950/60 text-purple-300 border-purple-500/50 shadow-sm'
                : 'flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold bg-slate-900 text-slate-400 border-slate-800'
            }
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">IA:</span>
            <span className="font-bold">{aiMode === 'FULL_AUTONOMOUS' ? 'Auto' : aiMode === 'HYBRID' ? 'Híbrido' : 'Off'}</span>
            <Sparkles className="w-3 h-3 text-amber-400 hidden sm:inline" />
          </button>

          {/* New Case */}
          <button
            onClick={onOpenNewCase}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-amber-950/40 active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Nuevo Lead</span>
          </button>

        </div>

      </div>
    </header>
  );
};
