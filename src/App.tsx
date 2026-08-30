import React, { useState, useEffect } from 'react';
import { Navbar, MainTabType } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { CasesListView } from './components/CasesListView';
import { Softphone } from './components/Softphone';
import { RetainerSigningModal } from './components/RetainerSigningModal';
import { NewCaseModal } from './components/NewCaseModal';
import { AIAgentControlModal } from './components/AIAgentControlModal';
import { LegalCase, Stats } from './types';
import { X } from 'lucide-react';

const initialMockCases: LegalCase[] = [
  {
    id: "WC-8921",
    leadName: "Carlos Ramirez",
    phone: "+1 (818) 555-0192",
    email: "carlos.ramirez@example.com",
    language: "ES",
    caseType: "Workers_Comp",
    state: "CA",
    employer: "Amazon Logistics Warehouse (San Bernardino)",
    injuryDate: "2026-08-14",
    reportedToBoss: true,
    receivedMedicalCare: false,
    hasAttorney: false,
    injuryDetails: "Lesión lumbar severa (L4-L5) levantando tarima de 65 lbs en turno nocturno. Supervisor negó reporte de accidente DWC-1.",
    estimatedCaseValue: "$65,000",
    status: "FIRMA_COMPLETADA",
    assignedLiner: "Maria G. (Liner)",
    assignedCloser: "Adair (Master Closer)",
    retainer: {
      documentId: "RET-2026-8921",
      sentAt: "2026-08-30T14:15:00Z",
      openedAt: "2026-08-30T14:16:30Z",
      signedAt: "2026-08-30T14:18:45Z",
      contingencyFeePercentage: 15,
      status: "SIGNED",
      signatureUrl: "data:image/svg+xml;utf8,<svg>Carlos Ramirez</svg>"
    },
    notes: [
      { id: 1, author: "Maria G. (Liner)", text: "Intake calificado: Sin abogado previo, lesión en horario laboral hace 16 días.", timestamp: "2026-08-30T14:10:00Z" },
      { id: 2, author: "Adair (Closer)", text: "Explicado Código CA § 132a anti-despido. Cliente firmó Retainer en llamada.", timestamp: "2026-08-30T14:18:45Z" }
    ],
    createdAt: "2026-08-30T14:05:00Z"
  },
  {
    id: "PI-4019",
    leadName: "Michael Johnson",
    phone: "+1 (213) 555-0188",
    email: "mjohnson@example.com",
    language: "EN",
    caseType: "Personal_Injury",
    state: "CA",
    employer: "Freelance / Rideshare Driver",
    injuryDate: "2026-08-22",
    reportedToBoss: true,
    receivedMedicalCare: true,
    hasAttorney: false,
    injuryDetails: "Choque en T (T-Bone collision) en intersección en Los Angeles. Esguince cervical y fractura de muñeca.",
    estimatedCaseValue: "$120,000",
    status: "FIRMA_COMPLETADA",
    assignedLiner: "Carlos V. (Liner)",
    assignedCloser: "Adair AI Clone (Hermes 3)",
    retainer: {
      documentId: "RET-2026-4019",
      sentAt: "2026-08-30T15:20:00Z",
      openedAt: "2026-08-30T15:21:00Z",
      signedAt: "2026-08-30T15:23:12Z",
      contingencyFeePercentage: 15,
      status: "SIGNED",
      signatureUrl: "data:image/svg+xml;utf8,<svg>Michael Johnson</svg>"
    },
    notes: [
      { id: 1, author: "Carlos V. (Liner)", text: "Reporte policial disponible, contraparte 100% culpable.", timestamp: "2026-08-30T15:15:00Z" },
      { id: 2, author: "Adair AI Clone", text: "Retainer enviado vía SMS y firmado electrónicamente en 3 minutos.", timestamp: "2026-08-30T15:23:12Z" }
    ],
    createdAt: "2026-08-30T15:10:00Z"
  },
  {
    id: "WC-9042",
    leadName: "Guadalupe Morales",
    phone: "+1 (619) 555-0144",
    email: "gmorales@example.com",
    language: "ES",
    caseType: "Workers_Comp",
    state: "CA",
    employer: "Fresh Produce Packaging Inc. (Vernon, CA)",
    injuryDate: "2026-08-28",
    reportedToBoss: true,
    receivedMedicalCare: false,
    hasAttorney: false,
    injuryDetails: "Atrapamiento de mano derecha en banda transportadora de empaque. Laceración profunda y trauma articular.",
    estimatedCaseValue: "$85,000",
    status: "CALIFICADO_PARA_CLOSER",
    assignedLiner: "Maria G. (Liner)",
    assignedCloser: "Adair (Master Closer)",
    retainer: null,
    notes: [
      { id: 1, author: "Maria G. (Liner)", text: "La empresa no quiso llevarla a la clínica. Muy preocupada por costos.", timestamp: "2026-08-30T16:00:00Z" }
    ],
    createdAt: "2026-08-30T15:55:00Z"
  },
  {
    id: "WC-9105",
    leadName: "Roberto Sanchez",
    phone: "+1 (909) 555-0177",
    email: "rsanchez@example.com",
    language: "ES",
    caseType: "Workers_Comp",
    state: "CA",
    employer: "FedEx Ground Distribution (Fontana)",
    injuryDate: "2026-08-29",
    reportedToBoss: true,
    receivedMedicalCare: true,
    hasAttorney: false,
    injuryDetails: "Caída desde plataforma de carga (altura 4 pies). Lesión en menisco de rodilla izquierda.",
    estimatedCaseValue: "$55,000",
    status: "CONTRATO_ENVIADO",
    assignedLiner: "Carlos V. (Liner)",
    assignedCloser: "Adair (Master Closer)",
    retainer: {
      documentId: "RET-2026-9105",
      sentAt: "2026-08-30T16:20:00Z",
      openedAt: "2026-08-30T16:22:00Z",
      signedAt: null,
      contingencyFeePercentage: 15,
      status: "OPENED",
      signatureUrl: null
    },
    notes: [
      { id: 1, author: "Carlos V. (Liner)", text: "Intake completo. Retainer SMS enviado mientras habla con Closer.", timestamp: "2026-08-30T16:18:00Z" }
    ],
    createdAt: "2026-08-30T16:15:00Z"
  }
];

export function App() {
  const [cases, setCases] = useState<LegalCase[]>(initialMockCases);
  const [stats, setStats] = useState<Stats>({
    totalCallsToday: 76,
    intakeQualified: 42,
    closersTransferred: 33,
    retainersSignedOnCall: 19,
    conversionRate: "25.0%"
  });

  // THE 2 MAIN TABS: 'METRICS' (default) or 'CASES'
  const [currentTab, setCurrentTab] = useState<MainTabType>('METRICS');
  
  // Modals & Softphone Shortcut
  const [isSoftphoneOpen, setIsSoftphoneOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [signingModalCase, setSigningModalCase] = useState<LegalCase | null>(null);
  const [aiMode, setAiMode] = useState<'OFF' | 'HYBRID' | 'FULL_AUTONOMOUS'>('FULL_AUTONOMOUS');
  const [isWsConnected, setIsWsConnected] = useState(true);

  // Fetch data
  const fetchData = async () => {
    try {
      const [casesRes, statsRes] = await Promise.all([
        fetch('/api/cases'),
        fetch('/api/stats')
      ]);
      const casesData = await casesRes.json();
      const statsData = await statsRes.json();
      if (Array.isArray(casesData) && casesData.length > 0) {
        setCases(casesData);
      }
      if (statsData && statsData.totalCallsToday) {
        setStats(statsData);
      }
    } catch (err) {
      console.warn("Using local mock cases store:", err);
    }
  };

  useEffect(() => {
    fetchData();

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
        } catch (e) {}
      };
    } catch (e) {}

    return () => {
      if (ws) ws.close();
    };
  }, []);

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
      setCases((prev) => prev.map((c) => (c.id === caseId ? { ...c, ...updatedFields } : c)));
    }
  };

  const handleSendRetainer = async (caseId: string) => {
    try {
      const res = await fetch(`/api/retainers/${caseId}/send`, { method: 'POST' });
      const data = await res.json();
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, status: 'CONTRATO_ENVIADO', retainer: data.retainer } : c
        )
      );
    } catch (err) {
      const fakeRetainer = {
        documentId: `RET-${Date.now()}`,
        sentAt: new Date().toISOString(),
        openedAt: null,
        signedAt: null,
        contingencyFeePercentage: 15,
        status: 'SENT' as const,
        signatureUrl: null
      };
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, status: 'CONTRATO_ENVIADO', retainer: fakeRetainer } : c
        )
      );
    }
  };

  const handleSignContract = async (caseId: string, signatureDataUrl: string) => {
    try {
      await fetch(`/api/retainers/${caseId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureDataUrl })
      });
    } catch (err) {}

    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId && c.retainer
          ? {
              ...c,
              status: 'FIRMA_COMPLETADA',
              retainer: { ...c.retainer, status: 'SIGNED', signedAt: new Date().toISOString(), signatureUrl: signatureDataUrl }
            }
          : c
      )
    );
    setSigningModalCase(null);
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar with the 2 Main Tabs & Softphone Shortcut */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSoftphoneModal={() => setIsSoftphoneOpen(true)}
        onOpenNewCase={() => setIsNewCaseOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        aiMode={aiMode}
        isWsConnected={isWsConnected}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-3 sm:p-5 md:p-6 overflow-hidden flex flex-col min-w-0">
        
        {/* TAB 1: MÉTRICAS DE NEGOCIO (THE DEFAULT & FIRST VIEW) */}
        {currentTab === 'METRICS' && (
          <div className="flex-1 animate-fadeIn overflow-y-auto">
            <AdminDashboard
              cases={cases}
              stats={stats}
              onSwitchToAgentView={() => setIsSoftphoneOpen(true)}
              onSelectCase={() => setCurrentTab('CASES')}
            />
          </div>
        )}

        {/* TAB 2: CASOS & EXPEDIENTES (DEDICATED DIRECTORY & DRILL-DOWN) */}
        {currentTab === 'CASES' && (
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

      </main>

      {/* FLOATING SOFTPHONE MODAL / SHORTCUT */}
      {isSoftphoneOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1626] border border-slate-700 rounded-3xl w-full max-w-md p-5 shadow-2xl relative flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Acceso Directo Softphone</h3>
              <button
                onClick={() => setIsSoftphoneOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Softphone
              activeCase={cases[0] || null}
              activeRole="CLOSER"
              onTransferToCloser={() => setIsSoftphoneOpen(false)}
              onSendRetainer={handleSendRetainer}
              onLogCall={() => {}}
            />
          </div>
        </div>
      )}

      {/* NEW CASE MODAL */}
      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        onCreateCase={(newCase) => {
          setCases((prev) => [newCase, ...prev]);
          setCurrentTab('CASES');
        }}
      />

      {/* AI CONTROL MODAL */}
      <AIAgentControlModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        aiMode={aiMode}
        setAiMode={setAiMode}
      />

      {/* RETAINER SIGNING SIMULATOR */}
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
