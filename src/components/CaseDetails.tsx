import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Send, 
  FileSignature, 
  Sparkles, 
  ShieldAlert, 
  DollarSign, 
  ArrowRightLeft, 
  MessageSquare, 
  FileText, 
  ExternalLink,
  Flame,
  Volume2,
  Clock
} from 'lucide-react';
import { LegalCase, ChatMessage, Note } from '../types';

interface CaseDetailsProps {
  activeCase: LegalCase | null;
  activeRole: 'LINER' | 'CLOSER' | 'ADMIN';
  onUpdateCase: (updated: Partial<LegalCase>) => void;
  onSendRetainer: (caseId: string) => void;
  onOpenSignModal: (caseItem: LegalCase) => void;
  onTransferToCloser: (caseId: string, notes: string) => void;
}

export const CaseDetails: React.FC<CaseDetailsProps> = ({
  activeCase,
  activeRole,
  onUpdateCase,
  onSendRetainer,
  onOpenSignModal,
  onTransferToCloser
}) => {
  const [activeTab, setActiveTab] = useState<'INTAKE' | 'CLOSER' | 'CHAT' | 'NOTES'>('INTAKE');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsgText, setNewMsgText] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  // Default to closer tab if role is closer or status is qualified
  useEffect(() => {
    if (activeRole === 'CLOSER' || activeCase?.status === 'CALIFICADO_PARA_CLOSER' || activeCase?.status === 'EN_LLAMADA_CLOSER' || activeCase?.status === 'CONTRATO_ENVIADO') {
      setActiveTab('CLOSER');
    } else {
      setActiveTab('INTAKE');
    }
  }, [activeCase?.id, activeRole]);

  // Fetch messages for active case
  useEffect(() => {
    if (activeCase?.id) {
      fetch(`/api/cases/${activeCase.id}/messages`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(() => {});
    }
  }, [activeCase?.id]);

  if (!activeCase) {
    return (
      <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl h-full min-h-[500px]">
        <FileText className="w-12 h-12 text-slate-700 mb-3" />
        <h3 className="text-base font-bold text-slate-300">Ningún caso seleccionado</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Selecciona un lead de la bandeja izquierda o presiona "Nuevo Lead" para comenzar una llamada de intake o cierre.
        </p>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!newMsgText.trim() || !activeCase) return;
    try {
      const res = await fetch(`/api/cases/${activeCase.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newMsgText,
          channel: 'SMS',
          sender: 'AGENT'
        })
      });
      const saved = await res.json();
      setMessages(prev => [...prev, saved]);
      setNewMsgText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = () => {
    if (!newNoteText.trim() || !activeCase) return;
    const updatedNotes = [
      ...activeCase.notes,
      {
        id: Date.now(),
        author: activeRole === 'LINER' ? 'Maria G. (Liner)' : 'Adair (Closer)',
        text: newNoteText,
        timestamp: new Date().toISOString()
      }
    ];
    onUpdateCase({ notes: updatedNotes });
    setNewNoteText('');
  };

  const retainer = activeCase.retainer;

  return (
    <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-5 flex flex-col gap-4 shadow-xl h-full">
      
      {/* Top Header: Lead Identity & Value Card */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-extrabold text-white">{activeCase.leadName}</h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-amber-500/30">
              {activeCase.id}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-950 text-blue-300 border border-blue-800">
              {activeCase.caseType.replace('_', ' ')}
            </span>
          </div>

          {/* Contact Details Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5">
            <div className="flex items-center gap-1 text-slate-200 font-mono font-semibold">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeCase.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{activeCase.state}, USA ({activeCase.language})</span>
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeCase.employer}</span>
            </div>
          </div>
        </div>

        {/* Case Value & Retainer Status Mini Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Valor Estimado</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">{activeCase.estimatedCaseValue}</span>
          </div>

          {retainer && (
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
              retainer.status === 'SIGNED'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : retainer.status === 'OPENED'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-blue-950/80 border-blue-500 text-blue-300'
            }`}>
              <FileSignature className="w-4 h-4" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold block">Retainer</span>
                <span className="text-xs font-extrabold">
                  {retainer.status === 'SIGNED' ? 'FIRMADO' : retainer.status === 'OPENED' ? 'ABIERTO POR CLIENTE' : 'ENVIADO SMS'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mode Tabs: Liner Intake / Closer Center / Omnichannel Chat / Notes */}
      <div className="flex items-center gap-1 bg-[#080c14] p-1 rounded-xl border border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('INTAKE')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'INTAKE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Ficha de Intake (Liner)</span>
        </button>

        <button
          onClick={() => setActiveTab('CLOSER')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'CLOSER'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-300" />
          <span>Comando de Cierre (Closer)</span>
        </button>

        <button
          onClick={() => setActiveTab('CHAT')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'CHAT'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp / SMS ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('NOTES')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'NOTES'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notas ({activeCase.notes.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: LINER INTAKE QUALIFICATION */}
      {activeTab === 'INTAKE' && (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
          
          {/* Intake Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Reported to Boss */}
            <div className="bg-[#080c14] border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">¿Reportó la lesión a su supervisor?</h4>
                <p className="text-[11px] text-slate-400">Requisito de aviso legal (30 días en CA/TX)</p>
              </div>
              <button
                onClick={() => onUpdateCase({ reportedToBoss: !activeCase.reportedToBoss })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeCase.reportedToBoss
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                    : 'bg-red-950 border border-red-500 text-red-300'
                }`}
              >
                {activeCase.reportedToBoss ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                <span>{activeCase.reportedToBoss ? 'Sí Reportó' : 'No Reportó'}</span>
              </button>
            </div>

            {/* Received Medical Treatment */}
            <div className="bg-[#080c14] border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">¿Recibió atención médica adecuada?</h4>
                <p className="text-[11px] text-slate-400">Clínica de la empresa / Urgencias / Terapia</p>
              </div>
              <button
                onClick={() => onUpdateCase({ receivedMedicalCare: !activeCase.receivedMedicalCare })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeCase.receivedMedicalCare
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                    : 'bg-amber-950 border border-amber-500 text-amber-300'
                }`}
              >
                {activeCase.receivedMedicalCare ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                <span>{activeCase.receivedMedicalCare ? 'Sí Atendido' : 'Sin Doctor Aún'}</span>
              </button>
            </div>

            {/* Has Attorney */}
            <div className="bg-[#080c14] border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">¿Tiene abogado actualmente?</h4>
                <p className="text-[11px] text-slate-400">Filtro de no-representación previa</p>
              </div>
              <button
                onClick={() => onUpdateCase({ hasAttorney: !activeCase.hasAttorney })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeCase.hasAttorney
                    ? 'bg-red-950 border border-red-500 text-red-300'
                    : 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                }`}
              >
                {activeCase.hasAttorney ? 'Tiene Abogado (Descartar)' : 'Sin Abogado (Califica)'}
              </button>
            </div>

            {/* Injury Date */}
            <div className="bg-[#080c14] border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Fecha del Accidente</h4>
                <p className="text-[11px] text-slate-400">Estatuto de limitaciones vigente</p>
              </div>
              <input
                type="date"
                value={activeCase.injuryDate}
                onChange={(e) => onUpdateCase({ injuryDate: e.target.value })}
                className="bg-slate-900 border border-slate-800 text-xs text-white p-1.5 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

          </div>

          {/* Injury Narrative & Employer Details */}
          <div className="bg-[#080c14] border border-slate-800 p-3.5 rounded-xl flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300">Descripción Detallada de la Lesión y Mecánica del Accidente:</label>
            <textarea
              value={activeCase.injuryDetails}
              onChange={(e) => onUpdateCase({ injuryDetails: e.target.value })}
              rows={3}
              className="bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {/* Liner Action Bar: One-Click Qualification to Closer */}
          <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 p-4 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>¿Prospecto Calificado para Cierre?</span>
              </h4>
              <p className="text-[11px] text-slate-400">Transfiere la llamada en vivo a la fila del Closer (humano o Clon IA).</p>
            </div>
            
            <button
              onClick={() => onTransferToCloser(activeCase.id, 'Intake calificado: Lesión laboral confirmada, sin abogado previo, listo para firma.')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-blue-950/50 active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Calificar y Pasar a Closer</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: CLOSER COMMAND CENTER & IN-CALL RETAINER DISPATCH */}
      {activeTab === 'CLOSER' && (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
          
          {/* Objection Playbook Bar (Cloned Persuasion Tactics) */}
          <div className="bg-[#080c14] border border-amber-500/30 p-3.5 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Guion Maestro de Rebate de Objeciones (Tu Clon / Know-How)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <span className="font-bold text-amber-300 block mb-1">Miedo a Despido / Represalia</span>
                <p className="text-slate-400 leading-snug">
                  "El código laboral 132a prohíbe represalias. El reclamo no lo paga tu patrón de su bolsa, lo paga la aseguradora obligatoria."
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <span className="font-bold text-amber-300 block mb-1">Estatus Migratorio / Sin Papeles</span>
                <p className="text-slate-400 leading-snug">
                  "En compensación laboral no importa tu estatus. La ley protege a todo trabajador lesionado por igual y no se reporta a nadie."
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <span className="font-bold text-amber-300 block mb-1">Honorarios (15% Contingencia)</span>
                <p className="text-slate-400 leading-snug">
                  "No pagas ni un solo centavo de tu bolsillo. El 15% solo se descuenta si ganamos tu compensación económica."
                </p>
              </div>
            </div>
          </div>

          {/* Live Retainer Agreement Closing Center */}
          <div className="bg-[#080c14] border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Contrato de Representación (Retainer Agreement)</h3>
              </div>
              <span className="text-[11px] font-bold text-amber-400">Contingencia 15% (No Win, No Fee)</span>
            </div>

            {/* Retainer Status Progress Tracker */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              
              {/* Step 1: Sent */}
              <div className={`flex items-center gap-2 p-2 rounded-lg ${
                retainer ? 'bg-blue-950/80 border border-blue-500/40 text-blue-300' : 'text-slate-600'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${retainer ? 'text-blue-400' : 'text-slate-700'}`} />
                <div>
                  <span className="text-[11px] font-bold block">1. SMS Enviado</span>
                  <span className="text-[10px] text-slate-400">{retainer?.sentAt ? 'Enviado a celular' : 'Pendiente'}</span>
                </div>
              </div>

              {/* Step 2: Opened */}
              <div className={`flex items-center gap-2 p-2 rounded-lg ${
                retainer?.status === 'OPENED' || retainer?.status === 'SIGNED'
                  ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300 animate-pulse'
                  : 'text-slate-600'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${retainer?.openedAt ? 'text-amber-400' : 'text-slate-700'}`} />
                <div>
                  <span className="text-[11px] font-bold block">2. Abierto por Cliente</span>
                  <span className="text-[10px] text-slate-400">{retainer?.openedAt ? 'Viendo documento' : 'Esperando apertura'}</span>
                </div>
              </div>

              {/* Step 3: Signed */}
              <div className={`flex items-center gap-2 p-2 rounded-lg ${
                retainer?.status === 'SIGNED'
                  ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                  : 'text-slate-600'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${retainer?.status === 'SIGNED' ? 'text-emerald-400' : 'text-slate-700'}`} />
                <div>
                  <span className="text-[11px] font-bold block">3. Firma Completada</span>
                  <span className="text-[10px] text-slate-400">{retainer?.status === 'SIGNED' ? 'Caso Formalizado' : 'Sin firma'}</span>
                </div>
              </div>

            </div>

            {/* Retainer Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => onSendRetainer(activeCase.id)}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{retainer ? 'Reenviar SMS de Firma' : 'Disparar Contrato Retainer vía SMS'}</span>
              </button>

              {retainer && (
                <button
                  onClick={() => onOpenSignModal(activeCase)}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
                  title="Abre la pantalla de firma digital tal como la ve el cliente en su celular"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Simular / Probar Firma de Cliente</span>
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT 3: OMNICHANNEL CHAT (SMS & WHATSAPP) */}
      {activeTab === 'CHAT' && (
        <div className="flex flex-col flex-1 gap-3 overflow-hidden">
          
          {/* Chat message stream */}
          <div className="flex-1 bg-[#080c14] border border-slate-800 rounded-xl p-3 overflow-y-auto flex flex-col gap-2.5 max-h-[300px]">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No hay mensajes previos en este canal.
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[80%] rounded-xl p-2.5 text-xs ${
                    m.sender === 'CLIENT'
                      ? 'bg-slate-800 text-slate-200 self-start border border-slate-700'
                      : m.sender === 'SYSTEM'
                      ? 'bg-amber-950/70 text-amber-200 self-center border border-amber-500/30 text-center text-[11px]'
                      : 'bg-blue-600 text-white self-end shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 mb-1">
                    <span className="font-bold">{m.sender === 'CLIENT' ? activeCase.leadName : m.sender === 'SYSTEM' ? 'Sistema' : 'Agente / IA'}</span>
                    <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Send Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje de SMS o WhatsApp al prospecto..."
              className="flex-1 bg-[#080c14] border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-950/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB CONTENT 4: OPERATOR NOTES & HISTORY */}
      {activeTab === 'NOTES' && (
        <div className="flex flex-col flex-1 gap-3 overflow-hidden">
          
          <div className="flex-1 bg-[#080c14] border border-slate-800 rounded-xl p-3 overflow-y-auto flex flex-col gap-2.5 max-h-[300px]">
            {activeCase.notes.map((note) => (
              <div key={note.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-amber-400">{note.author}</span>
                  <span className="font-mono">{new Date(note.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              placeholder="Escribir nota interna del caso..."
              className="flex-1 bg-[#080c14] border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
            >
              Agregar Nota
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
