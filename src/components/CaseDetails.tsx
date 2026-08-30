import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Send, 
  FileSignature, 
  Sparkles, 
  ShieldAlert, 
  ArrowRightLeft, 
  MessageSquare, 
  FileText, 
  ExternalLink,
  Flame,
  Clock
} from 'lucide-react';
import { LegalCase, ChatMessage } from '../types';

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

  useEffect(() => {
    if (activeRole === 'CLOSER' || activeCase?.status === 'CALIFICADO_PARA_CLOSER' || activeCase?.status === 'EN_LLAMADA_CLOSER' || activeCase?.status === 'CONTRATO_ENVIADO') {
      setActiveTab('CLOSER');
    } else {
      setActiveTab('INTAKE');
    }
  }, [activeCase?.id, activeRole]);

  useEffect(() => {
    if (activeCase?.id) {
      fetch(/api/cases//messages)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(() => {});
    }
  }, [activeCase?.id]);

  if (!activeCase) {
    return (
      <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xl h-full min-h-[400px]">
        <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-700 mb-3" />
        <h3 className="text-sm sm:text-base font-bold text-slate-300">Ningún caso seleccionado</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Selecciona un lead de la bandeja o presiona "Nuevo Lead" para comenzar.
        </p>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!newMsgText.trim() || !activeCase) return;
    try {
      const res = await fetch(/api/cases//messages, {
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
    <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-3.5 sm:p-5 flex flex-col gap-3 sm:gap-4 shadow-xl h-full min-w-0 overflow-hidden">
      
      {/* Top Header: Lead Identity & Value Card */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-slate-800/80 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-white truncate">{activeCase.leadName}</h1>
            <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-amber-500/30 shrink-0">
              {activeCase.id}
            </span>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold bg-blue-950 text-blue-300 border border-blue-800 shrink-0">
              {activeCase.caseType.replace('_', ' ')}
            </span>
          </div>

          {/* Contact Details Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-400 mt-1.5 min-w-0">
            <div className="flex items-center gap-1 text-slate-200 font-mono font-semibold truncate">
              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{activeCase.phone}</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">{activeCase.state}, USA ({activeCase.language})</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{activeCase.employer}</span>
            </div>
          </div>
        </div>

        {/* Case Value & Retainer Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="bg-slate-950/80 border border-slate-800 px-2.5 sm:px-3 py-1.5 rounded-xl text-right shrink-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold block">Valor Estimado</span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono">{activeCase.estimatedCaseValue}</span>
          </div>

          {retainer && (
            <div className={px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center gap-1.5 sm:gap-2 shrink-0 }>
              <FileSignature className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <div className="text-left">
                <span className="text-[9px] uppercase font-bold block">Retainer</span>
                <span className="text-[10px] sm:text-xs font-extrabold">
                  {retainer.status === 'SIGNED' ? 'FIRMADO' : retainer.status === 'OPENED' ? 'ABIERTO' : 'ENVIADO'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mode Tabs: Scrollable horizontally on mobile without breaking */}
      <div className="flex items-center gap-1 bg-[#080c14] p-1 rounded-xl border border-slate-800 text-xs font-bold overflow-x-auto no-scrollbar min-w-0">
        <button
          onClick={() => setActiveTab('INTAKE')}
          className={shrink-0 flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 transition-all text-[11px] sm:text-xs }
        >
          <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Intake (Liner)</span>
        </button>

        <button
          onClick={() => setActiveTab('CLOSER')}
          className={shrink-0 flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 transition-all text-[11px] sm:text-xs }
        >
          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
          <span className="whitespace-nowrap">Cierre (Closer)</span>
        </button>

        <button
          onClick={() => setActiveTab('CHAT')}
          className={shrink-0 flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 transition-all text-[11px] sm:text-xs }
        >
          <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Chat ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('NOTES')}
          className={shrink-0 flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 transition-all text-[11px] sm:text-xs }
        >
          <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Notas ({activeCase.notes.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: LINER INTAKE */}
      {activeTab === 'INTAKE' && (
        <div className="flex flex-col gap-3 sm:gap-4 flex-1 overflow-y-auto pr-1 min-w-0">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
            
            {/* Reported to Boss */}
            <div className="bg-[#080c14] border border-slate-800 p-3 sm:p-3.5 rounded-xl flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">¿Reportó al supervisor?</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Aviso legal (30 días)</p>
              </div>
              <button
                onClick={() => onUpdateCase({ reportedToBoss: !activeCase.reportedToBoss })}
                className={px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-all }
              >
                {activeCase.reportedToBoss ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                <span>{activeCase.reportedToBoss ? 'Sí' : 'No'}</span>
              </button>
            </div>

            {/* Received Medical Treatment */}
            <div className="bg-[#080c14] border border-slate-800 p-3 sm:p-3.5 rounded-xl flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">¿Atención médica?</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Clínica / Urgencias</p>
              </div>
              <button
                onClick={() => onUpdateCase({ receivedMedicalCare: !activeCase.receivedMedicalCare })}
                className={px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-all }
              >
                {activeCase.receivedMedicalCare ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-amber-400" />}
                <span>{activeCase.receivedMedicalCare ? 'Sí' : 'Sin Doctor'}</span>
              </button>
            </div>

            {/* Has Attorney */}
            <div className="bg-[#080c14] border border-slate-800 p-3 sm:p-3.5 rounded-xl flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">¿Tiene abogado previo?</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Filtro no-representación</p>
              </div>
              <button
                onClick={() => onUpdateCase({ hasAttorney: !activeCase.hasAttorney })}
                className={px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-all }
              >
                {activeCase.hasAttorney ? 'Sí (Descartar)' : 'No (Califica)'}
              </button>
            </div>

            {/* Injury Date */}
            <div className="bg-[#080c14] border border-slate-800 p-3 sm:p-3.5 rounded-xl flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">Fecha del Accidente</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Estatuto de limitaciones</p>
              </div>
              <input
                type="date"
                value={activeCase.injuryDate}
                onChange={(e) => onUpdateCase({ injuryDate: e.target.value })}
                className="bg-slate-900 border border-slate-800 text-[11px] sm:text-xs text-white p-1 rounded-lg focus:outline-none focus:border-amber-500 font-mono shrink-0"
              />
            </div>

          </div>

          {/* Injury Narrative */}
          <div className="bg-[#080c14] border border-slate-800 p-3 sm:p-3.5 rounded-xl flex flex-col gap-1.5 min-w-0">
            <label className="text-xs font-bold text-slate-300 truncate">Descripción Detallada de la Lesión:</label>
            <textarea
              value={activeCase.injuryDetails}
              onChange={(e) => onUpdateCase({ injuryDetails: e.target.value })}
              rows={3}
              className="bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-amber-500 leading-relaxed w-full"
            />
          </div>

          {/* Liner Action Bar */}
          <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">¿Prospecto Calificado?</span>
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Transfiere en caliente al Closer.</p>
            </div>
            
            <button
              onClick={() => onTransferToCloser(activeCase.id, 'Intake calificado: Lesión laboral confirmada, sin abogado previo, listo para firma.')}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 active:scale-95 shrink-0"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Pasar a Closer</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: CLOSER COMMAND CENTER */}
      {activeTab === 'CLOSER' && (
        <div className="flex flex-col gap-3 sm:gap-4 flex-1 overflow-y-auto pr-1 min-w-0">
          
          {/* Objections Playbook */}
          <div className="bg-[#080c14] border border-amber-500/30 p-3 sm:p-3.5 rounded-xl flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 truncate">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Guion Maestro de Rebate de Objeciones (Tu Clon)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] min-w-0">
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg min-w-0">
                <span className="font-bold text-amber-300 block mb-1 truncate">Miedo a Despido / Represalia</span>
                <p className="text-slate-400 leading-snug text-[10px] sm:text-[11px]">
                  "El código laboral 132a prohíbe represalias. El reclamo lo paga la aseguradora, no tu patrón."
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg min-w-0">
                <span className="font-bold text-amber-300 block mb-1 truncate">Estatus Migratorio</span>
                <p className="text-slate-400 leading-snug text-[10px] sm:text-[11px]">
                  "No importa tu estatus. La ley protege a todo trabajador lesionado por igual y no se reporta a nadie."
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg min-w-0">
                <span className="font-bold text-amber-300 block mb-1 truncate">Honorarios (15% Contingencia)</span>
                <p className="text-slate-400 leading-snug text-[10px] sm:text-[11px]">
                  "Cero dinero por adelantado. Solo se cobra si ganamos tu compensación económica."
                </p>
              </div>
            </div>
          </div>

          {/* Retainer Agreement Center */}
          <div className="bg-[#080c14] border border-slate-800 p-3.5 sm:p-4 rounded-xl flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <FileSignature className="w-4 h-4 text-emerald-400 shrink-0" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider truncate">Contrato de Representación</h3>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 shrink-0">15% Contingencia</span>
            </div>

            {/* Retainer Tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-800/80 min-w-0">
              
              <div className={lex items-center gap-2 p-2 rounded-lg min-w-0 }>
                <CheckCircle2 className={w-3.5 h-3.5 shrink-0 } />
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold block truncate">1. SMS Enviado</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 truncate">{retainer?.sentAt ? 'Enviado al celular' : 'Pendiente'}</span>
                </div>
              </div>

              <div className={lex items-center gap-2 p-2 rounded-lg min-w-0 }>
                <CheckCircle2 className={w-3.5 h-3.5 shrink-0 } />
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold block truncate">2. Abierto</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 truncate">{retainer?.openedAt ? 'Viendo documento' : 'Esperando apertura'}</span>
                </div>
              </div>

              <div className={lex items-center gap-2 p-2 rounded-lg min-w-0 }>
                <CheckCircle2 className={w-3.5 h-3.5 shrink-0 } />
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold block truncate">3. Firmado</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 truncate">{retainer?.status === 'SIGNED' ? 'Caso Formalizado' : 'Sin firma'}</span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 min-w-0">
              <button
                onClick={() => onSendRetainer(activeCase.id)}
                className="flex-1 py-2.5 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                <span className="truncate">{retainer ? 'Reenviar SMS de Firma' : 'Disparar Retainer vía SMS'}</span>
              </button>

              {retainer && (
                <button
                  onClick={() => onOpenSignModal(activeCase)}
                  className="py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>Probar Firma Móvil</span>
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT 3: CHAT */}
      {activeTab === 'CHAT' && (
        <div className="flex flex-col flex-1 gap-2.5 overflow-hidden min-w-0">
          <div className="flex-1 bg-[#080c14] border border-slate-800 rounded-xl p-3 overflow-y-auto flex flex-col gap-2 max-h-[300px] min-w-0">
            {messages.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No hay mensajes previos.
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={lex flex-col max-w-[85%] rounded-xl p-2.5 text-xs }
                >
                  <div className="flex items-center justify-between gap-2 text-[9px] opacity-75 mb-1">
                    <span className="font-bold truncate">{m.sender === 'CLIENT' ? activeCase.leadName : m.sender === 'SYSTEM' ? 'Sistema' : 'Agente / IA'}</span>
                    <span className="shrink-0">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="leading-relaxed break-words">{m.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje de SMS o WhatsApp..."
              className="flex-1 bg-[#080c14] border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500 min-w-0"
            />
            <button
              onClick={handleSendMessage}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: NOTES */}
      {activeTab === 'NOTES' && (
        <div className="flex flex-col flex-1 gap-2.5 overflow-hidden min-w-0">
          <div className="flex-1 bg-[#080c14] border border-slate-800 rounded-xl p-3 overflow-y-auto flex flex-col gap-2 max-h-[300px] min-w-0">
            {activeCase.notes.map((note) => (
              <div key={note.id} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col gap-1 text-xs min-w-0">
                <div className="flex items-center justify-between text-[10px] text-slate-400 gap-2 min-w-0">
                  <span className="font-bold text-amber-400 truncate">{note.author}</span>
                  <span className="font-mono shrink-0">{new Date(note.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-300 leading-relaxed break-words text-[11px]">{note.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              placeholder="Escribir nota interna del caso..."
              className="flex-1 bg-[#080c14] border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500 min-w-0"
            />
            <button
              onClick={handleAddNote}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shrink-0"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
