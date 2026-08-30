import React from 'react';
import { 
  Scale, 
  PhoneCall, 
  Bot, 
  UserCheck, 
  Sparkles, 
  FileSignature, 
  TrendingUp, 
  Radio, 
  Plus,
  RefreshCw,
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
  onRefresh,
  isWsConnected
}) => {
  return (
    <header className="bg-[#0c121e]/95 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 py-2.5 md:py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-3">
        
        {/* Brand & Main View Switcher (Admin Dashboard vs Agent Workspace) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/40 shrink-0">
              <Scale className="w-4 h-4 md:w-5 md:h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="font-extrabold tracking-tight text-base md:text-lg text-white font-['Outfit']">JUSTICIA</span>
                <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Legal Voice OS
                </span>
              </div>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium hidden sm:block">Workers' Comp & PI Operating System</p>
            </div>
          </div>

          {/* Navigation Tabs: Admin Executive Dashboard vs Agent Operations */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 hidden md:flex items-center text-xs font-semibold">
            <button
              onClick={() => setCurrentView('ADMIN_DASHBOARD')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'ADMIN_DASHBOARD'
                  ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Panel Central & Analíticas</span>
            </button>

            <button
              onClick={() => setCurrentView('AGENT_WORKSPACE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'AGENT_WORKSPACE'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Puesto de Agente / Softphone</span>
            </button>
          </div>
        </div>

        {/* Live Operational Stats Banner (Desktop) */}
        <div className="hidden 2xl:flex items-center gap-5 px-4 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs">
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

        {/* Controls: Role Selector (Liner/Closer) + AI Switch + Action Button */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* WebSocket Status Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isWsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-slate-400 font-mono text-[10px] md:text-[11px] hidden md:inline">{isWsConnected ? 'Twilio Live' : 'Conectando'}</span>
          </div>

          {/* Operator Role Switcher (Liner vs Closer) - Available in Agent Workspace */}
          {currentView === 'AGENT_WORKSPACE' && (
            <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center text-[11px] md:text-xs animate-fadeIn">
              <button
                onClick={() => setActiveRole('LINER')}
                className={`px-2.5 md:px-3 py-1 rounded-md font-semibold transition-all ${
                  activeRole === 'LINER'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Liner
              </button>
              <button
                onClick={() => setActiveRole('CLOSER')}
                className={`px-2.5 md:px-3 py-1 rounded-md font-semibold transition-all ${
                  activeRole === 'CLOSER'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Closer
              </button>
            </div>
          )}

          {/* AI Mode Selector */}
          <button
            onClick={onOpenAIModal}
            className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg border text-[11px] md:text-xs font-semibold transition-all ${
              aiMode === 'FULL_AUTONOMOUS'
                ? 'bg-purple-950/60 text-purple-300 border-purple-500/50 shadow-lg shadow-purple-900/20'
                : aiMode === 'HYBRID'
                ? 'bg-blue-950/60 text-blue-300 border-blue-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">IA:</span>
            <span className="font-bold">
              {aiMode === 'FULL_AUTONOMOUS' ? 'Autónomo' : aiMode === 'HYBRID' ? 'Híbrido' : 'Humano'}
            </span>
            <Sparkles className="w-3 h-3 text-amber-400 hidden sm:inline" />
          </button>

          {/* New Case Button */}
          <button
            onClick={onOpenNewCase}
            className="flex items-center gap-1 px-3 md:px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-amber-950/40 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Nuevo Lead</span>
          </button>
        </div>

      </div>
    </header>
  );
};
