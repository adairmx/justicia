import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Softphone } from './components/Softphone';
import { PipelineBoard } from './components/PipelineBoard';
import { CaseDetails } from './components/CaseDetails';
import { AdminDashboard } from './components/AdminDashboard';
import { RetainerSigningModal } from './components/RetainerSigningModal';
import { NewCaseModal } from './components/NewCaseModal';
import { AIAgentControlModal } from './components/AIAgentControlModal';
import { LegalCase, Stats, CallRecord } from './types';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  PhoneCall, 
  Headphones 
} from 'lucide-react';

export const App: React.FC = () => {
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<'LINER' | 'CLOSER' | 'ADMIN'>('CLOSER');
  const [currentView, setCurrentView] = useState<'ADMIN_DASHBOARD' | 'AGENT_WORKSPACE'>('ADMIN_DASHBOARD');
  const [aiMode, setAiMode] = useState<'OFF' | 'HYBRID' | 'FULL_AUTONOMOUS'>('OFF');
  const [stats, setStats] = useState<Stats>({
    totalCallsToday: 42,
    intakeQualified: 28,
    closersTransferred: 22,
    retainersSignedOnCall: 18,
    conversionRate: '81.8%'
  });
  const [isWsConnected, setIsWsConnected] = useState(false);

  // Mobile Active View
  const [mobileTab, setMobileTab] = useState<'ADMIN' | 'CASES' | 'DETAILS' | 'PHONE'>('ADMIN');

  // Modals
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [signModalCase, setSignModalCase] = useState<LegalCase | null>(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [casesRes, statsRes] = await Promise.all([
        fetch('/api/cases'),
        fetch('/api/stats')
      ]);
      const casesData = await casesRes.json();
      const statsData = await statsRes.json();
      setCases(casesData);
      setStats(statsData);
      if (casesData.length > 0 && !selectedCaseId) {
        setSelectedCaseId(casesData[0].id);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  useEffect(() => {
    fetchData();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    let ws: WebSocket;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => setIsWsConnected(true);
      ws.onclose = () => setIsWsConnected(false);

      ws.onmessage = (event) => {
        try {
          const { event: wsEvent, payload } = JSON.parse(event.data);
          
          if (wsEvent === 'CASE_CREATED') {
            setCases((prev) => [payload, ...prev]);
            setSelectedCaseId(payload.id);
          } else if (wsEvent === 'CASE_UPDATED' || wsEvent === 'RETAINER_STATUS_CHANGED') {
            setCases((prev) =>
              prev.map((c) => (c.id === (payload.id || payload.caseId) ? { ...c, ...payload } : c))
            );
            fetchData();
          } else if (wsEvent === 'WARM_TRANSFER_TRIGGERED') {
            fetchData();
          } else if (wsEvent === 'AI_LEAD_QUALIFIED') {
            setCases((prev) => [payload, ...prev]);
            setSelectedCaseId(payload.id);
            fetchData();
          }
        } catch (e) {
          console.error('WS Message parsing error', e);
        }
      };
    } catch (e) {
      console.error('WS connection error', e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || null;

  const handleUpdateCase = async (updatedFields: Partial<LegalCase>) => {
    if (!selectedCaseId) return;
    try {
      const res = await fetch(`/api/cases/${selectedCaseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const updated = await res.json();
      setCases((prev) => prev.map((c) => (c.id === selectedCaseId ? updated : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransferToCloser = async (caseId: string, linerNotes: string) => {
    try {
      await fetch(`/api/cases/${caseId}/transfer-to-closer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linerNotes,
          assignedLiner: 'Maria G. (Venezuela)',
          closerName: 'Adair (Closer/Clone)'
        })
      });
      fetchData();
      setActiveRole('CLOSER');
      setCurrentView('AGENT_WORKSPACE');
      setMobileTab('DETAILS');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendRetainer = async (caseId: string) => {
    try {
      await fetch(`/api/cases/${caseId}/retainer/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contingencyFeePercentage: 15 })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogCall = async (caseId: string, durationSeconds: number) => {
    try {
      await fetch('/api/calls/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          durationSeconds,
          callerName: activeCase?.leadName || 'Desconocido',
          phoneNumber: activeCase?.phone || '',
          type: activeRole === 'LINER' ? 'INTAKE_LINER' : 'CLOSER_ATTEMPT',
          status: 'COMPLETED',
          agent: activeRole === 'LINER' ? 'Liner Venezuela' : 'Closer Adair'
        })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCase = async (caseData: Partial<LegalCase>) => {
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData)
      });
      const created = await res.json();
      setCases((prev) => [created, ...prev]);
      setSelectedCaseId(created.id);
      setCurrentView('AGENT_WORKSPACE');
      setMobileTab('DETAILS');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateAiLead = async () => {
    try {
      const res = await fetch('/api/ai/intake-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: 'Roberto Hernández',
          callerPhone: '+1 (213) 555-0177',
          injuryDate: '2026-08-15',
          employer: 'Target Distribution Center (Fontana, CA)',
          injuryDetails: 'Desgarro en hombro derecho y muñeca por caída de caja en rampa. El supervisor le negó el formulario DWC-1.'
        })
      });
      const data = await res.json();
      fetchData();
      setSelectedCaseId(data.caseId);
      setActiveRole('CLOSER');
      setCurrentView('AGENT_WORKSPACE');
      setMobileTab('DETAILS');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a11] text-slate-100 selection:bg-amber-500 selection:text-black pb-16 lg:pb-0">
      
      {/* Top Navigation */}
      <Navbar
        stats={stats}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setMobileTab(view === 'ADMIN_DASHBOARD' ? 'ADMIN' : 'DETAILS');
        }}
        aiMode={aiMode}
        setAiMode={setAiMode}
        onOpenNewCase={() => setIsNewCaseOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onRefresh={fetchData}
        isWsConnected={isWsConnected}
      />

      {/* VIEW 1: EXECUTIVE ADMIN & ANALYTICS DASHBOARD */}
      {currentView === 'ADMIN_DASHBOARD' && (
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fadeIn">
          <AdminDashboard
            cases={cases}
            stats={stats}
            onSwitchToAgentView={(role) => {
              setActiveRole(role);
              setCurrentView('AGENT_WORKSPACE');
              setMobileTab('DETAILS');
            }}
            onSelectCase={(item) => {
              setSelectedCaseId(item.id);
              setCurrentView('AGENT_WORKSPACE');
              setMobileTab('DETAILS');
            }}
          />
        </main>
      )}

      {/* VIEW 2: FULL AGENT & CLOSER WORKSPACE (Dual column Desktop + Mobile responsive) */}
      {currentView === 'AGENT_WORKSPACE' && (
        <main className="flex-1 p-3 md:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 max-w-[1800px] w-full mx-auto animate-fadeIn">
          
          {/* Left Column: Softphone + Pipeline List (Desktop: always visible, Mobile: conditional) */}
          <div className={`lg:col-span-4 xl:col-span-4 flex flex-col gap-4 ${
            mobileTab === 'DETAILS' ? 'hidden lg:flex' : mobileTab === 'PHONE' ? 'flex lg:flex' : 'flex lg:flex'
          }`}>
            
            {/* Softphone (shown when on PHONE tab or on Desktop) */}
            <div className={`${mobileTab === 'CASES' ? 'hidden lg:block' : 'block'}`}>
              <Softphone
                activeCase={activeCase}
                activeRole={activeRole}
                onTransferToCloser={handleTransferToCloser}
                onSendRetainer={handleSendRetainer}
                onLogCall={handleLogCall}
              />
            </div>

            {/* Pipeline List (shown when on CASES tab or on Desktop) */}
            <div className={`flex-1 ${mobileTab === 'PHONE' ? 'hidden lg:block' : 'block'}`}>
              <PipelineBoard
                cases={cases}
                selectedCaseId={selectedCaseId}
                onSelectCase={(item) => {
                  setSelectedCaseId(item.id);
                  setMobileTab('DETAILS');
                }}
                activeRole={activeRole}
              />
            </div>
          </div>

          {/* Right Column: Case Intake & Retainer Command Center */}
          <div className={`lg:col-span-8 xl:col-span-8 flex flex-col ${
            mobileTab !== 'DETAILS' ? 'hidden lg:flex' : 'flex'
          }`}>
            <CaseDetails
              activeCase={activeCase}
              activeRole={activeRole}
              onUpdateCase={handleUpdateCase}
              onSendRetainer={handleSendRetainer}
              onOpenSignModal={(caseItem) => setSignModalCase(caseItem)}
              onTransferToCloser={handleTransferToCloser}
            />
          </div>

        </main>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c121e]/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around text-xs">
        <button
          onClick={() => {
            setCurrentView('ADMIN_DASHBOARD');
            setMobileTab('ADMIN');
          }}
          className={`flex flex-col items-center gap-1 font-semibold py-1 px-2.5 rounded-xl transition-all ${
            currentView === 'ADMIN_DASHBOARD' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[9px]">Analíticas</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('AGENT_WORKSPACE');
            setMobileTab('CASES');
          }}
          className={`flex flex-col items-center gap-1 font-semibold py-1 px-2.5 rounded-xl transition-all ${
            currentView === 'AGENT_WORKSPACE' && mobileTab === 'CASES' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span className="text-[9px]">Bandeja ({cases.length})</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('AGENT_WORKSPACE');
            setMobileTab('DETAILS');
          }}
          className={`flex flex-col items-center gap-1 font-semibold py-1 px-2.5 rounded-xl transition-all ${
            currentView === 'AGENT_WORKSPACE' && mobileTab === 'DETAILS' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[9px]">Ficha / Cierre</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('AGENT_WORKSPACE');
            setMobileTab('PHONE');
          }}
          className={`flex flex-col items-center gap-1 font-semibold py-1 px-2.5 rounded-xl transition-all ${
            currentView === 'AGENT_WORKSPACE' && mobileTab === 'PHONE' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span className="text-[9px]">Softphone</span>
        </button>
      </div>

      {/* Modals */}
      {isNewCaseOpen && (
        <NewCaseModal
          onClose={() => setIsNewCaseOpen(false)}
          onCreateCase={handleCreateCase}
        />
      )}

      {isAIModalOpen && (
        <AIAgentControlModal
          onClose={() => setIsAIModalOpen(false)}
          aiMode={aiMode}
          setAiMode={setAiMode}
          onSimulateAiLead={handleSimulateAiLead}
        />
      )}

      {signModalCase && (
        <RetainerSigningModal
          caseItem={signModalCase}
          onClose={() => setSignModalCase(null)}
          onConfirmSignature={() => {
            fetchData();
          }}
        />
      )}

    </div>
  );
};
