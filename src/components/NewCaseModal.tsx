import React, { useState } from 'react';
import { X, Plus, Scale, User, Phone, MapPin, Building2, Calendar } from 'lucide-react';
import { LegalCase, CaseType } from '../types';

interface NewCaseModalProps {
  onClose: () => void;
  onCreateCase: (caseData: Partial<LegalCase>) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({ onClose, onCreateCase }) => {
  const [leadName, setLeadName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [state, setState] = useState('CA');
  const [caseType, setCaseType] = useState<CaseType>('Workers_Comp');
  const [employer, setEmployer] = useState('');
  const [injuryDate, setInjuryDate] = useState(new Date().toISOString().split('T')[0]);
  const [injuryDetails, setInjuryDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !phone.trim()) return;

    onCreateCase({
      leadName,
      phone,
      email,
      language,
      state,
      caseType,
      employer: employer || 'No especificado',
      injuryDate,
      injuryDetails: injuryDetails || 'Ingreso de nuevo prospecto desde llamada entrante o web.',
      reportedToBoss: true,
      receivedMedicalCare: false,
      hasAttorney: false,
      estimatedCaseValue: caseType === 'Workers_Comp' ? '$35,000 - $70,000' : '$50,000 - $120,000',
      assignedLiner: 'Operador en Turno',
      assignedCloser: null,
      status: 'NUEVO_LEAD'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Registrar Nuevo Lead Legal</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">Nombre del Prospecto *</label>
              <input
                type="text"
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="bg-slate-900 border border-slate-800 text-white p-2 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">Teléfono *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (818) 555-0199"
                className="bg-slate-900 border border-slate-800 text-white font-mono p-2 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">Tipo de Caso</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value as CaseType)}
                className="bg-slate-900 border border-slate-800 text-white p-2 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="Workers_Comp">Workers' Comp</option>
                <option value="Personal_Injury">Personal Injury</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">Estado (USA)</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white p-2 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="CA">California (CA)</option>
                <option value="TX">Texas (TX)</option>
                <option value="FL">Florida (FL)</option>
                <option value="NV">Nevada (NV)</option>
                <option value="NY">New York (NY)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">Idioma</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ES' | 'EN')}
                className="bg-slate-900 border border-slate-800 text-white p-2 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="ES">Español</option>
                <option value="EN">English</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">Empresa / Patrón</label>
              <input
                type="text"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                placeholder="Ej. Fedex Ground Warehouse"
                className="bg-slate-900 border border-slate-800 text-white p-2 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">Fecha de Lesión / Accidente</label>
              <input
                type="date"
                value={injuryDate}
                onChange={(e) => setInjuryDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white p-2 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-semibold">Detalles de Lesión / Accidente</label>
            <textarea
              rows={2}
              value={injuryDetails}
              onChange={(e) => setInjuryDetails(e.target.value)}
              placeholder="Explica cómo ocurrió el accidente y qué parte del cuerpo fue afectada..."
              className="bg-slate-900 border border-slate-800 text-white p-2 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-950/40"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Crear e Iniciar Intake</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
