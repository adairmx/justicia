import React, { useState, useEffect } from 'react';
import { Navbar, MainViewType } from './components/Navbar';
import { Softphone } from './components/Softphone';
import { PipelineBoard } from './components/PipelineBoard';
import { CaseDetails } from './components/CaseDetails';
import { AdminDashboard } from './components/AdminDashboard';
import { CasesListView } from './components/CasesListView';
import { RetainerSigningModal } from './components/RetainerSigningModal';
import { NewCaseModal } from './components/NewCaseModal';
import { AIAgentControlModal } from './components/AIAgentControlModal';
import { LegalCase, Stats, RetainerAgreement } from './types';
import { 
  FolderKanban, 
  FileText, 
  PhoneCall, 
  LayoutDashboard
} from 'lucide-react';

export function App() {
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCallsToday: 76,
    intakeQualified: 42,
    closersTransferred: 33,
    retainersSignedOnCall: 19,
    conversionRate: "25.0%"
  });

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<'LINER' | 'CLOSER' | 'ADMIN'>('CLOSER');
  const [currentView, setCurrentView] = useState<MainViewType>('ADMIN_DASHBOARD');
  const [mobileTab, setMobileTab] = useState<'METRICS' | 'CASES' | 'AGENT_WORKSPACE' | 'PHONE'>('METRICS');
  const [aiMode, setAiMode] = useState<'OFF' | 'HYBRID' | 'FULL_AUTONOMOUS'>('FULL_AUTONOMOUS');
  const [isWsConnected, setIsWsConnected] = useState(true);

  // Modals state
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [signingModalCase, setSigningModalCase] = useState<LegalCase | null>(null);

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
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // WebSocket real-time subscription
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(wsUrl);
      ws.onopen = () => setIsWsConnected(true);
      ws.onclose = () => setIsWsConnected(false);
      ws.onerror = () => setIsWsConnected(false);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'NEW_CASE') {
            setCases((prev) => [msg.data, ...prev]);
          } else if (msg.type === 'CASE_UPDATED') {
            setCases((prev) => prev.map((c) => (c.id === msg.data.id ? msg.data : c)));
          } else if (msg.type === 'RETAINER_UPDATED') {
            setCases((prev) =>
              prev.map((c) =>
                c.id === msg.data.caseId ? { ...c, retainer: msg.data, status: msg.data.status === 'SIGNED' ? 'FIRMA_COMPLETADA' : c.status } : c
              )
            );
          } else if (msg.type === 'STATS_UPDATED') {
            setStats(msg.data);
          }
        } catch (e) {
          console.error("WS message parse error:", e);
        }
      };
    } catch (e) {
      console.warn("WebSocket not supported or failed:", e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0] || null;

  const handleUpdateCase = async (caseId: string, updatedFields: Partial<LegalCase>) => {
    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const updated = await res.json();
      setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendRetainer = async (caseId: string) => {
    try {
      const res = await fetch(`/api/retainers/${caseId}/send`, {
        method: 'POST'
      });
      const data = await res.json();
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? { ...c, status: 'CONTRATO_ENVIADO', retainer: data.retainer }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransferToCloser = async (caseId: string, linerNotes: string) => {
    try {
      const targetCase = cases.find((c) => c.id === caseId);
      const newNotes = [
        ...(targetCase?.notes || []),
        {
          id: Date.now(),
          author: 'Liner (Venezuela Hub)',
          text: `WARM TRANSFER EJECUTADO: ${linerNotes}`,
          timestamp: new Date().toISOString()
        }
      ];

      await handleUpdateCase(caseId, {
        status: 'CALIFICADO_PARA_CLOSER',
        assignedCloser: 'Adair (Master Closer)',
        notes: newNotes
      });
      setActiveRole('CLOSER');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignContract = async (caseId: string, signatureDataUrl: string) => {
    try {
      const res = await fetch(`/api/retainers/${caseId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureDataUrl })
      });
      const data = await res.json();
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? { ...c, status: 'FIRMA_COMPLETADA', retainer: data.retainer }
            : c
        )
      );
      setSigningModalCase(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogCall = (caseId: string, duration: number) => {
    setStats((prev) => ({
      ...prev,
      totalCallsToday: prev.totalCallsToday + 1
    }));
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        stats={stats}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          if (view === 'ADMIN_DASHBOARD') setMobileTab('METRICS');
          else if (view === 'CASES_LIST') setMobileTab('CASES');
          else setMobileTab('AGENT_WORKSPACE');
        }}
        aiMode={aiMode}
        setAiMode={setAiMode}
        onOpenNewCase={() => setIsNewCaseOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onRefresh={fetchData}
        isWsConnected={isWsConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-2 sm:p-4 md:p-6 overflow-hidden flex flex-col min-w-0">
        
        {/* VIEW 1: DEDICATED METRICS & ADMIN DASHBOARD */}
        {currentView === 'ADMIN_DASHBOARD' && (
          <div className="flex-1 animate-fadeIn overflow-y-auto">
            <AdminDashboard
              cases={cases}
              stats={stats}
              onSwitchToAgentView={(role) => {
                setActiveRole(role);
                setCurrentView('AGENT_WORKSPACE');
                setMobileTab('AGENT_WORKSPACE');
              }}
              onSelectCase={(c) => {
                setSelectedCaseId(c.id);
                setCurrentView('CASES_LIST');
              }}
            />
          </div>
        )}

        {/* VIEW 2: DEDICATED CASES & FILES EXPLORER */}
        {currentView === 'CASES_LIST' && (
          <div className="flex-1 animate-fadeIn overflow-y-auto">
            <CasesListView
              cases={cases}
              onUpdateCase={handleUpdateCase}
              onSendRetainer={handleSendRetainer}
              onOpenSignModal={(c) => setSigningModalCase(c)}
              onOpenNewCase={() => setIsNewCaseOpen(true)}
            />
          </div>
        )}

        {/* VIEW 3: DEDICATED AGENT WORKSPACE & SOFTPHONE */}
        {currentView === 'AGENT_WORKSPACE' && (
          <div className="flex-1 flex flex-col gap-4 animate-fadeIn overflow-hidden">
            
            {/* Desktop Layout: Split 4 cols (Softphone + Queue) vs 8 cols (Intake / Closer Desk) */}
            <div className="hidden lg:grid grid-cols-12 gap-4 h-full flex-1 min-h-0">
              
              {/* Left Column (Softphone & Pipeline Queue) */}
              <div className="col-span-4 flex flex-col gap-4 h-full min-h-0">
                <Softphone
                  activeCase={activeCase}
                  activeRole={activeRole}
                  onTransferToCloser={handleTransferToCloser}
                  onSendRetainer={handleSendRetainer}
                  onLogCall={handleLogCall}
                />
                <div className="flex-1 min-h-0">
                  <PipelineBoard
                    cases={cases}
                    selectedCaseId={selectedCaseId}
                    onSelectCase={(c) => setSelectedCaseId(c.id)}
                    activeRole={activeRole}
                  />
                </div>
              </div>

              {/* Right Column (Case Details & Closer Command Center) */}
              <div className="col-span-8 h-full min-h-0">
                <CaseDetails
                  activeCase={activeCase}
                  activeRole={activeRole}
                  onUpdateCase={(fields) => activeCase && handleUpdateCase(activeCase.id, fields)}
                  onSendRetainer={handleSendRetainer}
                  onOpenSignModal={(c) => setSigningModalCase(c)}
                  onTransferToCloser={handleTransferToCloser}
                />
              </div>

            </div>

            {/* Mobile Layout for Agent Workspace */}
            <div className="lg:hidden flex flex-col gap-3 flex-1 pb-16 overflow-y-auto">
              <Softphone
                activeCase={activeCase}
                activeRole={activeRole}
                onTransferToCloser={handleTransferToCloser}
                onSendRetainer={handleSendRetainer}
                onLogCall={handleLogCall}
              />
              <CaseDetails
                activeCase={activeCase}
                activeRole={activeRole}
                onUpdateCase={(fields) => activeCase && handleUpdateCase(activeCase.id, fields)}
                onSendRetainer={handleSendRetainer}
                onOpenSignModal={(c) => setSigningModalCase(c)}
                onTransferToCloser={handleTransferToCloser}
              />
            </div>

          </div>
        )}

      </main>

      {/* Mobile Sticky Bottom Bar: Clean 3-Tab Navigator */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0f1b]/95 backdrop-blur-lg border-t border-slate-800/90 py-1.5 px-3 flex items-center justify-around z-50 text-[10px] font-bold">
        <button
          onClick={() => {
            setCurrentView('ADMIN_DASHBOARD');
            setMobileTab('METRICS');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            currentView === 'ADMIN_DASHBOARD' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Métricas</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('CASES_LIST');
            setMobileTab('CASES');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            currentView === 'CASES_LIST' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Expedientes</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('AGENT_WORKSPACE');
            setMobileTab('AGENT_WORKSPACE');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            currentView === 'AGENT_WORKSPACE' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Agente</span>
        </button>
      </div>

      {/* MODALS */}
      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        onCreateCase={(newCase) => {
          setCases((prev) => [newCase, ...prev]);
          setSelectedCaseId(newCase.id);
        }}
      />

      <AIAgentControlModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        aiMode={aiMode}
        setAiMode={setAiMode}
      />

      {signingModalCase && (
        <RetainerSigningModal
          caseItem={signingModalCase}
          isOpen={true}
          onClose={() => setSigningModalCase(null)}
          onSign={(sig) => handleSignContract(signingModalCase.id, sig)}
        />
      )}

    </div>
  );
}

export default App;
