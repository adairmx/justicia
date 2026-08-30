import React from 'react';
import { 
  Scale, 
  PhoneCall, 
  Bot, 
  UserCheck, 
  Sparkles, 
  FileSignature, 
  TrendingUp, 
  Plus,
  LayoutDashboard,
  Headphones
} from 'lucide-react';
import { Stats } from '../types';

interface NavbarProps {
  stats: Stats;
  activeRole: 'LINER' | 'CLOSER' | 'ADMIN';
  setActiveRole: (role: 'LINER' | 'CLOSER' | 'ADMIN') => void;
  currentView: 'ADMIN_DASHBOARD' | 'AGENT_WORKSPACE';
  setCurrentView: (view: 'ADMIN_DASHBOARD' | 'AGENT_WORKSPACE') => void;
  aiMode: 'OFF' | 'HYBRID' | 'FULL_AUTONOMOUS';
  setAiMode: (mode: 'OFF' | 'HYBRID' | 'FULL_AUTONOMOUS') => void;
  onOpenNewCase: () => void;
  onOpenAIModal: () => void;
  onRefresh: () => void;
  isWsConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  activeRole,
  setActiveRole,
  currentView,
  setCurrentView,
  aiMode,
  setAiMode,
  onOpenNewCase,
  onOpenAIModal,
  isWsConnected
}) => {
  return (
    <header className="bg-[#0c121e]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 md:px-6 py-2.5 sticky top-0 z-40 w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-[1800px] mx-auto min-w-0">
        
        {/* Brand & Main View Switcher */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/40 shrink-0">
              <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold tracking-tight text-base sm:text-lg text-white font-['Outfit'] truncate">JUSTICIA</span>
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  Voice OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden md:block truncate">Workers' Comp & PI Operating System</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="bg-slate-950 p-0.5 sm:p-1 rounded-xl border border-slate-800 hidden md:flex items-center text-xs font-semibold shrink-0">
            <button
              onClick={() => setCurrentView('ADMIN_DASHBOARD')}
              className={
                currentView === 'ADMIN_DASHBOARD'
                  ? 'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all bg-amber-600 text-white font-bold shadow-md shadow-amber-950/40'
                  : 'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all text-slate-400 hover:text-slate-200'
              }
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Panel Central</span>
              <span className="lg:hidden">Admin</span>
            </button>

            <button
              onClick={() => setCurrentView('AGENT_WORKSPACE')}
              className={
                currentView === 'AGENT_WORKSPACE'
                  ? 'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all bg-blue-600 text-white font-bold shadow-md shadow-blue-950/40'
                  : 'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all text-slate-400 hover:text-slate-200'
              }
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Puesto de Agente</span>
              <span className="lg:hidden">Agente</span>
            </button>
          </div>
        </div>

        {/* Live Operational Stats Banner */}
        <div className="hidden 2xl:flex items-center gap-4 px-4 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Llamadas:</span>
            <span className="font-bold text-white">{stats.totalCallsToday}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Calificados:</span>
            <span className="font-bold text-amber-300">{stats.intakeQualified}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <FileSignature className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Firmados:</span>
            <span className="font-bold text-emerald-400">{stats.retainersSignedOnCall}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Conversión:</span>
            <span className="font-bold text-purple-300">{stats.conversionRate}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] sm:text-[11px] shrink-0">
            <span className={isWsConnected ? 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse' : 'w-2 h-2 rounded-full bg-red-400'} />
            <span className="text-slate-400 font-mono hidden sm:inline">{isWsConnected ? 'Live' : 'Offline'}</span>
          </div>

          {currentView === 'AGENT_WORKSPACE' && (
            <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center text-[10px] sm:text-xs shrink-0">
              <button
                onClick={() => setActiveRole('LINER')}
                className={
                  activeRole === 'LINER'
                    ? 'px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-all bg-blue-600 text-white shadow-sm'
                    : 'px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-all text-slate-400 hover:text-slate-200'
                }
              >
                Liner
              </button>
              <button
                onClick={() => setActiveRole('CLOSER')}
                className={
                  activeRole === 'CLOSER'
                    ? 'px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-all bg-amber-600 text-white shadow-sm'
                    : 'px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-all text-slate-400 hover:text-slate-200'
                }
              >
                Closer
              </button>
            </div>
          )}

          <button
            onClick={onOpenAIModal}
            className={
              aiMode === 'FULL_AUTONOMOUS'
                ? 'flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-xs font-semibold transition-all shrink-0 bg-purple-950/60 text-purple-300 border-purple-500/50 shadow-lg shadow-purple-900/20'
                : aiMode === 'HYBRID'
                ? 'flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-xs font-semibold transition-all shrink-0 bg-blue-950/60 text-blue-300 border-blue-500/50'
                : 'flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-xs font-semibold transition-all shrink-0 bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xs:inline sm:inline">IA:</span>
            <span className="font-bold">
              {aiMode === 'FULL_AUTONOMOUS' ? 'Auto' : aiMode === 'HYBRID' ? 'Híbrido' : 'Humano'}
            </span>
            <Sparkles className="w-3 h-3 text-amber-400 hidden sm:inline" />
          </button>

          <button
            onClick={onOpenNewCase}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-[11px] sm:text-xs shadow-md shadow-amber-950/40 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Nuevo Lead</span>
          </button>
        </div>

      </div>
    </header>
  );
};
