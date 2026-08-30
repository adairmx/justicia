import React, { useState } from 'react';
import { 
  X, 
  FileSignature, 
  CheckCircle2, 
  ShieldCheck, 
  Scale, 
  DollarSign, 
  Lock,
  Smartphone
} from 'lucide-react';
import { LegalCase } from '../types';

interface RetainerSigningModalProps {
  caseItem: LegalCase | null;
  onClose: () => void;
  onConfirmSignature: (caseId: string) => void;
}

export const RetainerSigningModal: React.FC<RetainerSigningModalProps> = ({
  caseItem,
  onClose,
  onConfirmSignature
}) => {
  const [signatureName, setSignatureName] = useState(caseItem?.leadName || '');
  const [hasAgreed, setHasAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignedSuccess, setIsSignedSuccess] = useState(false);

  if (!caseItem) return null;

  const handleSign = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/cases/${caseItem.id}/retainer/status-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SIGNED' })
      });
      onConfirmSignature(caseItem.id);
      setIsSignedSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      
      {/* Mobile Device Mockup Frame */}
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Device Top Bar */}
        <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Vista Móvil del Cliente (SMS Link)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4 text-xs">
          
          {/* Law Firm Header */}
          <div className="text-center pb-3 border-b border-slate-800">
            <div className="inline-flex p-2 rounded-xl bg-amber-500/10 text-amber-400 mb-1.5">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-extrabold text-white">CONTRATO DE REPRESENTACIÓN LEGAL</h2>
            <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">Workers' Compensation & Personal Injury</p>
          </div>

          {/* Legal Summary Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400">Cliente / Trabajador:</span>
              <span className="font-bold text-white">{caseItem.leadName}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400">Patrón / Empleador:</span>
              <span className="font-bold text-slate-200">{caseItem.employer}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Honorarios de Contingencia:</span>
              <span className="font-bold text-emerald-400">15% Solo si se Gana</span>
            </div>
          </div>

          {/* Legal Clauses */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-[11px] text-slate-400 leading-relaxed max-h-36 overflow-y-auto">
            <p className="mb-2">
              <strong className="text-slate-300">1. Acuerdo de Contingencia:</strong> El cliente no pagará ningún honorario legal por adelantado ni de su bolsillo. Los honorarios legales corresponderán al quince por ciento (15%) de la recuperación económica total obtenida.
            </p>
            <p className="mb-2">
              <strong className="text-slate-300">2. Representación y Tratamiento Médico:</strong> El despacho gestionará las evaluaciones médicas especializadas y los beneficios por incapacidad temporal y permanente.
            </p>
            <p>
              <strong className="text-slate-300">3. Firma Digital:</strong> La presente firma electrónica tiene total validez conforme a la ley ESIGN Act de EE. UU.
            </p>
          </div>

          {/* Signature Box */}
          {!isSignedSuccess ? (
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  id="agree"
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="agree" className="text-[11px] cursor-pointer">
                  Acepto los términos y confirmo el inicio de mi caso.
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-300">Escribe tu Nombre para Firmar Digitalmente:</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="bg-slate-900 border border-amber-500/50 text-white font-serif italic text-base px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                  placeholder="Tu nombre completo"
                />
              </div>

              <button
                onClick={handleSign}
                disabled={!hasAgreed || !signatureName.trim() || isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-95 disabled:opacity-50"
              >
                <FileSignature className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? 'Verificando firma...' : 'FIRMADO Y ENVIAR AL DESPACHO'}</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-950/80 border border-emerald-500 p-4 rounded-xl text-center flex flex-col items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
              <h4 className="text-sm font-bold text-emerald-300">¡Contrato Firmado con Éxito!</h4>
              <p className="text-[11px] text-slate-300">
                Tu caso ha sido formalizado. El CRM y el Closer en llamada acaban de recibir la confirmación en tiempo real.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
              >
                Cerrar Simulador
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
