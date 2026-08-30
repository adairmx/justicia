import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ArrowRightLeft, 
  Activity,
  Send,
  PhoneCall
} from 'lucide-react';
import { LegalCase } from '../types';

interface SoftphoneProps {
  activeCase: LegalCase | null;
  activeRole: 'LINER' | 'CLOSER' | 'ADMIN';
  onTransferToCloser: (caseId: string, linerNotes: string) => void;
  onSendRetainer: (caseId: string) => void;
  onLogCall: (caseId: string, duration: number) => void;
}

export const Softphone: React.FC<SoftphoneProps> = ({
  activeCase,
  activeRole,
  onTransferToCloser,
  onSendRetainer,
  onLogCall
}) => {
  const [callStatus, setCallStatus] = useState<'IDLE' | 'RINGING' | 'CONNECTED'>('IDLE');
  const [dialNumber, setDialNumber] = useState(activeCase?.phone || '+1 (818) 555-0192');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [transferNotes, setTransferNotes] = useState('');
  const [showTransferPrompt, setShowTransferPrompt] = useState(false);

  useEffect(() => {
    if (activeCase?.phone) {
      setDialNumber(activeCase.phone);
    }
  }, [activeCase]);

  useEffect(() => {
    let interval: any = null;
    if (callStatus === 'CONNECTED') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return ${mins.toString().padStart(2, '0')}:;
  };

  const handleStartCall = () => {
    setCallStatus('RINGING');
    setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 1200);
  };

  const handleEndCall = () => {
    if (activeCase && callDuration > 0) {
      onLogCall(activeCase.id, callDuration);
    }
    setCallStatus('IDLE');
    setIsMuted(false);
    setIsOnHold(false);
    setShowTransferPrompt(false);
  };

  const handleExecuteTransfer = () => {
    if (activeCase) {
      onTransferToCloser(activeCase.id, transferNotes || 'Liner completó intake inicial. Transferido a Closer.');
      setShowTransferPrompt(false);
      setTransferNotes('');
    }
  };

  return (
    <div className="bg-[#0e1626] border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col gap-3 relative overflow-hidden min-w-0">
      
      {callStatus === 'CONNECTED' && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className={p-1.5 rounded-lg shrink-0 }>
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-200 truncate">Twilio Softphone</h3>
            <p className="text-[10px] text-slate-400 truncate">VoIP Opus 48kHz</p>
          </div>
        </div>

        {callStatus === 'CONNECTED' ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-mono font-bold animate-pulse shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{formatDuration(callDuration)}</span>
          </div>
        ) : callStatus === 'RINGING' ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-bold animate-bounce shrink-0">
            <span>Marcando...</span>
          </div>
        ) : (
          <span className="text-[10px] font-medium text-slate-500 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0">
            En Espera
          </span>
        )}
      </div>

      {/* Dial Bar */}
      <div className="bg-[#080c14] border border-slate-800 rounded-xl p-2.5 sm:p-3 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between text-[11px] min-w-0">
          <span className="text-slate-400 truncate">Lead:</span>
          <span className="font-semibold text-amber-400 truncate max-w-[150px]">{activeCase?.leadName || 'Ninguno'}</span>
        </div>
        
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={dialNumber}
            onChange={(e) => setDialNumber(e.target.value)}
            disabled={callStatus !== 'IDLE'}
            className="flex-1 bg-slate-900 border border-slate-800 text-white font-mono text-xs sm:text-sm px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-amber-500 min-w-0"
            placeholder="+1 (000) 000-0000"
          />

          {callStatus === 'IDLE' ? (
            <button
              onClick={handleStartCall}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-lg shadow-emerald-950/40 active:scale-95 shrink-0"
            >
              <Phone className="w-3 h-3" />
              <span>Llamar</span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-lg shadow-red-950/40 active:scale-95 shrink-0"
            >
              <PhoneOff className="w-3 h-3" />
              <span>Colgar</span>
            </button>
          )}
        </div>
      </div>

      {/* In-Call Controls */}
      {callStatus === 'CONNECTED' && (
        <div className="flex flex-col gap-2.5 pt-1 border-t border-slate-800/80 min-w-0">
          
          <div className="flex items-center justify-between bg-slate-950/80 rounded-xl px-3 py-2 border border-slate-800 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span className="text-[11px] font-semibold text-slate-300 truncate">Voz Activa</span>
            </div>
            
            <div className="flex items-end gap-1 h-5 shrink-0">
              <span className="w-1 bg-amber-400 rounded-full animate-wave-1" />
              <span className="w-1 bg-amber-500 rounded-full animate-wave-2" />
              <span className="w-1 bg-amber-300 rounded-full animate-wave-3" />
              <span className="w-1 bg-amber-400 rounded-full animate-wave-4" />
              <span className="w-1 bg-amber-500 rounded-full animate-wave-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 min-w-0">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={py-1.5 px-2 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 transition-all }
            >
              {isMuted ? <MicOff className="w-3 h-3 text-amber-400" /> : <Mic className="w-3 h-3 text-slate-400" />}
              <span>{isMuted ? 'Silenciado' : 'Silenciar'}</span>
            </button>

            <button
              onClick={() => setIsOnHold(!isOnHold)}
              className={py-1.5 px-2 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 transition-all }
            >
              {isOnHold ? <VolumeX className="w-3 h-3 text-blue-400" /> : <Volume2 className="w-3 h-3 text-slate-400" />}
              <span>{isOnHold ? 'Hold' : 'Pausar'}</span>
            </button>

            {activeRole === 'LINER' && (
              <button
                onClick={() => setShowTransferPrompt(!showTransferPrompt)}
                className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-md"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Pasar</span>
              </button>
            )}

            {activeRole === 'CLOSER' && activeCase && (
              <button
                onClick={() => onSendRetainer(activeCase.id)}
                className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1 shadow-md active:scale-95"
              >
                <Send className="w-3 h-3 stroke-[2.5]" />
                <span>Retainer</span>
              </button>
            )}
          </div>

          {showTransferPrompt && (
            <div className="bg-slate-950 p-2.5 rounded-xl border border-blue-500/40 flex flex-col gap-2 min-w-0">
              <label className="text-[10px] font-bold text-blue-400 truncate">Nota para el Closer:</label>
              <textarea
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
                placeholder="Resumen de calificación..."
                rows={2}
                className="bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded-lg focus:outline-none focus:border-blue-500 w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowTransferPrompt(false)}
                  className="px-2 py-1 text-xs text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExecuteTransfer}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg"
                >
                  Transferir
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
