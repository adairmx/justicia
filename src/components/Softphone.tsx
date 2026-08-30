import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ArrowRightLeft, 
  User, 
  Clock, 
  Activity,
  Send,
  Sparkles,
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

  // Call timer effect
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setCallStatus('RINGING');
    setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 1500);
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
    <div className="bg-[#0e1626] border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-col gap-3 relative overflow-hidden">
      
      {/* Background soft glow when in call */}
      {callStatus === 'CONNECTED' && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${
            callStatus === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
          }`}>
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Twilio WebRTC Softphone</h3>
            <p className="text-[11px] text-slate-400">Línea VoIP de Alta Fidelidad (Opus 48kHz)</p>
          </div>
        </div>

        {/* Live Call Duration / Status */}
        {callStatus === 'CONNECTED' ? (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{formatDuration(callDuration)}</span>
          </div>
        ) : callStatus === 'RINGING' ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-xs font-bold animate-bounce">
            <span>Marcando...</span>
          </div>
        ) : (
          <span className="text-[11px] font-medium text-slate-500 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            En Espera
          </span>
        )}
      </div>

      {/* Dial / Caller Information Bar */}
      <div className="bg-[#080c14] border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Prospecto Seleccionado:</span>
          <span className="font-semibold text-amber-400">{activeCase?.leadName || 'Ninguno'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={dialNumber}
            onChange={(e) => setDialNumber(e.target.value)}
            disabled={callStatus !== 'IDLE'}
            className="flex-1 bg-slate-900 border border-slate-800 text-white font-mono text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="+1 (000) 000-0000"
          />

          {callStatus === 'IDLE' ? (
            <button
              onClick={handleStartCall}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Llamar</span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-red-950/40 transition-transform active:scale-95"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Colgar</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Audio Visualizer + In-Call Controls */}
      {callStatus === 'CONNECTED' && (
        <div className="flex flex-col gap-3 pt-1 border-t border-slate-800/80">
          
          {/* Real-time audio waveform animation */}
          <div className="flex items-center justify-between bg-slate-950/80 rounded-xl px-4 py-2.5 border border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">Voz Activa (Full-Duplex)</span>
            </div>
            
            <div className="flex items-end gap-1 h-6">
              <span className="w-1 bg-amber-400 rounded-full animate-wave-1" />
              <span className="w-1 bg-amber-500 rounded-full animate-wave-2" />
              <span className="w-1 bg-amber-300 rounded-full animate-wave-3" />
              <span className="w-1 bg-amber-400 rounded-full animate-wave-4" />
              <span className="w-1 bg-amber-500 rounded-full animate-wave-5" />
              <span className="w-1 bg-amber-300 rounded-full animate-wave-2" />
              <span className="w-1 bg-amber-400 rounded-full animate-wave-4" />
            </div>
          </div>

          {/* Action Buttons: Mute, Hold, Warm Transfer, Live Retainer Dispatch */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            {/* Mute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isMuted
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5 text-amber-400" /> : <Mic className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isMuted ? 'Silenciado' : 'Silenciar'}</span>
            </button>

            {/* Hold */}
            <button
              onClick={() => setIsOnHold(!isOnHold)}
              className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isOnHold
                  ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {isOnHold ? <VolumeX className="w-3.5 h-3.5 text-blue-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isOnHold ? 'En Espera' : 'Hold'}</span>
            </button>

            {/* Liner: Warm Transfer to Closer */}
            {activeRole === 'LINER' && (
              <button
                onClick={() => setShowTransferPrompt(!showTransferPrompt)}
                className="py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/40"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Pasar a Closer</span>
              </button>
            )}

            {/* Closer: Retainer Instant SMS Dispatch */}
            {activeRole === 'CLOSER' && activeCase && (
              <button
                onClick={() => onSendRetainer(activeCase.id)}
                className="py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Enviar Retainer SMS</span>
              </button>
            )}

          </div>

          {/* Warm Transfer Note Drawer */}
          {showTransferPrompt && (
            <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/40 flex flex-col gap-2 animate-fadeIn">
              <label className="text-[11px] font-bold text-blue-400">Nota para el Closer / Resumen de Calificación:</label>
              <textarea
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
                placeholder="Ej. Lesión en almacén, patrón amenazó con despido, 100% calificado para firmar."
                rows={2}
                className="bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowTransferPrompt(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExecuteTransfer}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Transferir Llamada Ahora</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
