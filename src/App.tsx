import React, { useState, useEffect } from "react";
import { Navbar, MainTabType } from "./components/Navbar";
import { AdminDashboard } from "./components/AdminDashboard";
import { CasesListView } from "./components/CasesListView";
import { OmnichannelInboxView } from "./components/OmnichannelInboxView";
import { Softphone } from "./components/Softphone";
import { RetainerSigningModal } from "./components/RetainerSigningModal";
import { NewCaseModal } from "./components/NewCaseModal";
import { LegalCase, Stats } from "./types";
import { X, LayoutDashboard, FolderKanban, MessageSquare, PhoneCall } from "lucide-react";

const initialMockCases: LegalCase[] = [
  {
    id: "WC-8921",
    leadName: "Carlos Ramirez",
    phone: "+1 (818) 555-0192",
    email: "carlos.ramirez@example.com",
    language: "ES",
    caseType: "Workers_Comp",
    state: "CA",
    employer: "Amazon Logistics Warehouse",
    injuryDate: "2026-08-14",
    reportedToBoss: true,
    receivedMedicalCare: false,
    hasAttorney: false,
    injuryDetails: "Lesión lumbar severa (L4-L5) levantando tarima de 65 lbs.",
    estimatedCaseValue: "$65,000",
    status: "FIRMA_COMPLETADA",
    assignedLiner: "Maria G.",
    assignedCloser: "Adair",
    retainer: { documentId: "RET-2026-8921", sentAt: "2026-08-30T14:15:00Z", openedAt: "2026-08-30T14:16:30Z", signedAt: "2026-08-30T14:18:45Z", contingencyFeePercentage: 15, status: "SIGNED", signatureUrl: "data:image/svg+xml;utf8,<svg>Carlos Ramirez</svg>" },
    notes: [{ id: 1, author: "Maria G.", text: "Intake calificado: Sin abogado previo, lesión en horario laboral.", timestamp: "2026-08-30T14:10:00Z" }],
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
    employer: "Rideshare Driver",
    injuryDate: "2026-08-22",
    reportedToBoss: true,
    receivedMedicalCare: true,
    hasAttorney: false,
    injuryDetails: "Choque en intersección en Los Angeles. Esguince cervical.",
    estimatedCaseValue: "$120,000",
    status: "FIRMA_COMPLETADA",
    assignedLiner: "Carlos V.",
    assignedCloser: "Adair",
    retainer: { documentId: "RET-2026-4019", sentAt: "2026-08-30T15:20:00Z", openedAt: "2026-08-30T15:21:00Z", signedAt: "2026-08-30T15:23:12Z", contingencyFeePercentage: 15, status: "SIGNED", signatureUrl: "data:image/svg+xml;utf8,<svg>Michael Johnson</svg>" },
    notes: [{ id: 1, author: "Carlos V.", text: "Reporte policial disponible, contraparte culpable.", timestamp: "2026-08-30T15:15:00Z" }],
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
    employer: "Fresh Produce Packaging Inc.",
    injuryDate: "2026-08-28",
    reportedToBoss: true,
    receivedMedicalCare: false,
    hasAttorney: false,
    injuryDetails: "Atrapamiento de mano derecha en banda transportadora.",
    estimatedCaseValue: "$85,000",
    status: "CALIFICADO_PARA_CLOSER",
    assignedLiner: "Maria G.",
    assignedCloser: "Adair",
    retainer: null,
    notes: [{ id: 1, author: "Maria G.", text: "Lesión confirmada, pendiente cierre.", timestamp: "2026-08-30T16:00:00Z" }],
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
    employer: "FedEx Ground Distribution",
    injuryDate: "2026-08-29",
    reportedToBoss: true,
    receivedMedicalCare: true,
    hasAttorney: false,
    injuryDetails: "Caída desde plataforma de carga. Lesión de rodilla.",
    estimatedCaseValue: "$55,000",
    status: "CONTRATO_ENVIADO",
    assignedLiner: "Carlos V.",
    assignedCloser: "Adair",
    retainer: { documentId: "RET-2026-9105", sentAt: "2026-08-30T16:20:00Z", openedAt: "2026-08-30T16:22:00Z", signedAt: null, contingencyFeePercentage: 15, status: "OPENED", signatureUrl: null },
    notes: [{ id: 1, author: "Carlos V.", text: "Retainer SMS enviado.", timestamp: "2026-08-30T16:18:00Z" }],
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

  const [currentTab, setCurrentTab] = useState<MainTabType>("METRICS");
  const [isSoftphoneOpen, setIsSoftphoneOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [signingModalCase, setSigningModalCase] = useState<LegalCase | null>(null);

  const fetchData = async () => {
    try {
      const [casesRes, statsRes] = await Promise.all([
        fetch("/api/cases"),
        fetch("/api/stats")
      ]);
      const casesData = await casesRes.json();
      const statsData = await statsRes.json();
      if (Array.isArray(casesData) && casesData.length > 0) setCases(casesData);
      if (statsData && statsData.totalCallsToday) setStats(statsData);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "NEW_CASE") setCases((prev) => [msg.data, ...prev]);
          else if (msg.type === "CASE_UPDATED") setCases((prev) => prev.map((c) => (c.id === msg.data.id ? msg.data : c)));
          else if (msg.type === "RETAINER_UPDATED") setCases((prev) => prev.map((c) => (c.id === msg.data.caseId ? { ...c, retainer: msg.data, status: msg.data.status === "SIGNED" ? "FIRMA_COMPLETADA" : c.status } : c)));
          else if (msg.type === "STATS_UPDATED") setStats(msg.data);
        } catch (e) {}
      };
    } catch (e) {}
    return () => { if (ws) ws.close(); };
  }, []);

  const handleUpdateCase = async (caseId: string, updatedFields: Partial<LegalCase>) => {
    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
      const res = await fetch(`/api/retainers/${caseId}/send`, { method: "POST" });
      const data = await res.json();
      setCases((prev) => prev.map((c) => (c.id === caseId ? { ...c, status: "CONTRATO_ENVIADO", retainer: data.retainer } : c)));
    } catch (err) {}
  };

  const handleSignContract = async (caseId: string, signatureDataUrl: string) => {
    try {
      await fetch(`/api/retainers/${caseId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureDataUrl })
      });
    } catch (err) {}
    setCases((prev) => prev.map((c) => (c.id === caseId && c.retainer ? { ...c, status: "FIRMA_COMPLETADA", retainer: { ...c.retainer, status: "SIGNED", signedAt: new Date().toISOString(), signatureUrl: signatureDataUrl } } : c)));
    setSigningModalCase(null);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSoftphoneModal={() => setIsSoftphoneOpen(true)}
        onOpenNewCase={() => setIsNewCaseOpen(true)}
      />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 overflow-hidden flex flex-col min-w-0">
        {currentTab === "METRICS" && (
          <div className="flex-1 animate-fadeIn overflow-y-auto">
            <AdminDashboard cases={cases} stats={stats} onSwitchToAgentView={() => setIsSoftphoneOpen(true)} onSelectCase={() => setCurrentTab("CASES")} />
          </div>
        )}

        {currentTab === "CASES" && (
          <div className="flex-1 animate-fadeIn overflow-y-auto">
            <CasesListView cases={cases} onUpdateCase={handleUpdateCase} onSendRetainer={handleSendRetainer} onOpenSignModal={(c) => setSigningModalCase(c)} onOpenNewCase={() => setIsNewCaseOpen(true)} />
          </div>
        )}

        {currentTab === "INBOX" && (
          <div className="flex-1 animate-fadeIn overflow-hidden">
            <OmnichannelInboxView cases={cases} onOpenCase={() => setCurrentTab("CASES")} />
          </div>
        )}
      </main>

      {/* Clean Mobile Bottom Navigation Bar (Visible ONLY on mobile, no duplicate buttons on top) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#090d16]/95 backdrop-blur-lg border-t border-zinc-800/90 py-2 px-4 flex items-center justify-around z-50 text-[11px] font-medium">
        <button onClick={() => setCurrentTab("METRICS")} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${currentTab === "METRICS" ? "text-zinc-100 font-semibold" : "text-zinc-500"}`}><LayoutDashboard className="w-4 h-4" /><span>Métricas</span></button>
        <button onClick={() => setCurrentTab("CASES")} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${currentTab === "CASES" ? "text-zinc-100 font-semibold" : "text-zinc-500"}`}><FolderKanban className="w-4 h-4" /><span>Casos</span></button>
        <button onClick={() => setCurrentTab("INBOX")} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${currentTab === "INBOX" ? "text-zinc-100 font-semibold" : "text-zinc-500"}`}><MessageSquare className="w-4 h-4" /><span>Mensajería</span></button>
      </nav>

      {isSoftphoneOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border border-zinc-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl relative flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3"><h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Softphone VoIP</h3><button onClick={() => setIsSoftphoneOpen(false)} className="p-1 rounded-md text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button></div>
            <Softphone activeCase={cases[0] || null} activeRole="CLOSER" onTransferToCloser={() => setIsSoftphoneOpen(false)} onSendRetainer={handleSendRetainer} onLogCall={() => {}} />
          </div>
        </div>
      )}

      <NewCaseModal isOpen={isNewCaseOpen} onClose={() => setIsNewCaseOpen(false)} onCreateCase={(newCase) => { setCases((prev) => [newCase, ...prev]); setCurrentTab("CASES"); }} />
      {signingModalCase && <RetainerSigningModal caseItem={signingModalCase} onClose={() => setSigningModalCase(null)} onConfirmSignature={(id) => handleSignContract(id, "data:image/svg+xml;utf8,<svg>Signed</svg>")} />}
    </div>
  );
}
export default App;
