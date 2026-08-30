import React, { useState } from "react";
import { X, Plus, Scale, User, Phone, MapPin, Building2, Calendar } from "lucide-react";
import { LegalCase, CaseType } from "../types";

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCase: (caseData: Partial<LegalCase>) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({ isOpen, onClose, onCreateCase }) => {
  const [leadName, setLeadName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState<"ES" | "EN">("ES");
  const [state, setState] = useState("CA");
  const [caseType, setCaseType] = useState<CaseType>("Workers_Comp");
  const [employer, setEmployer] = useState("");
  const [injuryDate, setInjuryDate] = useState(new Date().toISOString().split("T")[0]);
  const [injuryDetails, setInjuryDetails] = useState("");

  if (!isOpen) return null;

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
      employer: employer || "No especificado",
      injuryDate,
      injuryDetails: injuryDetails || "Ingreso de nuevo prospecto desde llamada entrante o web.",
      reportedToBoss: true,
      receivedMedicalCare: false,
      hasAttorney: false,
      estimatedCaseValue: "$75,000",
      assignedLiner: "Maria G. (Liner)",
      assignedCloser: "Adair (Master Closer)"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e1626] border border-amber-500/40 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><Scale className="w-5 h-5" /></div>
            <h2 className="text-base font-extrabold text-white">Registrar Nuevo Prospecto / Caso</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-slate-400 block mb-1">Nombre Completo *</label><input required type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Ej. Juan Pérez" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500" /></div>
            <div><label className="text-slate-400 block mb-1">Teléfono Móvil *</label><input required type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (000) 000-0000" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-slate-400 block mb-1">Tipo de Caso</label><select value={caseType} onChange={(e) => setCaseType(e.target.value as CaseType)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"><option value="Workers_Comp">Workers Comp</option><option value="Personal_Injury">Personal Injury</option></select></div>
            <div><label className="text-slate-400 block mb-1">Empresa / Empleador</label><input type="text" value={employer} onChange={(e) => setEmployer(e.target.value)} placeholder="Ej. Amazon, FedEx..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" /></div>
          </div>
          <div><label className="text-slate-400 block mb-1">Descripción del Accidente</label><textarea rows={3} value={injuryDetails} onChange={(e) => setInjuryDetails(e.target.value)} placeholder="Detalles de la lesión..." className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500" /></div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-md">Guardar Caso</button>
          </div>
        </form>
      </div>
    </div>
  );
};
