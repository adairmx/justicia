import React, { useState } from 'react';
import { 
  FolderKanban, 
  Search, 
  Filter, 
  FileText, 
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileSignature, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  Download, 
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';
import { LegalCase, CaseStatus, CaseType } from '../types';

interface CasesListViewProps {
  cases: LegalCase[];
  onUpdateCase: (caseId: string, updatedFields: Partial<LegalCase>) => void;
  onSendRetainer: (caseId: string) => void;
  onOpenSignModal: (caseItem: LegalCase) => void;
  onOpenNewCase: () => void;
}

export const CasesListView: React.FC<CasesListViewProps> = ({
  cases,
  onUpdateCase,
  onSendRetainer,
  onOpenSignModal,
  onOpenNewCase
}) => {
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [activeDetailTab, setActiveDetailTab] = useState<'OVERVIEW' | 'DOCUMENTS' | 'TIMELINE' | 'CHAT'>('OVERVIEW');

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'NUEVO_LEAD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 shrink-0">Nuevo Lead</span>;
      case 'EN_INTAKE_LINER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800 shrink-0">En Intake</span>;
      case 'CALIFICADO_PARA_CLOSER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse shrink-0">Fila Closer</span>;
      case 'EN_LLAMADA_CLOSER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 animate-pulse shrink-0">En Cierre</span>;
      case 'CONTRATO_ENVIADO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">SMS Enviado</span>;
      case 'FIRMA_COMPLETADA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 shrink-0"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Firmado</span>;
      case 'EN_TRATAMIENTO_MEDICO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800 shrink-0">Citas Médicas</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 shrink-0">{status}</span>;
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch = 
      c.leadName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.employer.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && c.caseType !== typeFilter) return false;

    return true;
  });

  // IF A CASE IS SELECTED, SHOW THE FULL FILE DRILL-DOWN VIEW
  if (selectedCase) {
    const currentCase = cases.find(c => c.id === selectedCase.id) || selectedCase;
    const retainer = currentCase.retainer;

    return (
      <div className="flex flex-col gap-5 w-full max-w-[1800px] mx-auto pb-12 animate-fadeIn min-w-0">
        
        {/* Back navigation & Case Header */}
        <div className="bg-[#0d1527] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSelectedCase(null)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shrink-0"
              title="Volver a la lista de expedientes"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h1 className="text-lg sm:text-2xl font-extrabold text-white truncate">{currentCase.leadName}</h1>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-900 text-amber-400 border border-amber-500/30 shrink-0">
                  {currentCase.id}
                </span>
                {getStatusBadge(currentCase.status)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                Expediente Legal • {currentCase.caseType.replace('_', ' ')} • {currentCase.state}, USA ({currentCase.language})
              </p>
            </div>
          </div>

          {/* Value & Retainer Action */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Valor Estimado</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">{currentCase.estimatedCaseValue}</span>
            </div>

            {retainer ? (
              <button
                onClick={() => onOpenSignModal(currentCase)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>Ver Contrato ({retainer.status})</span>
              </button>
            ) : (
              <button
                onClick={() => onSendRetainer(currentCase.id)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-950/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Retainer SMS</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Tabs: Overview, Documents & Retainer, Timeline & Notes */}
        <div className="flex items-center gap-1 bg-[#080c14] p-1 rounded-xl border border-slate-800 text-xs font-bold w-fit">
          <button
            onClick={() => setActiveDetailTab('OVERVIEW')}
            className={
              activeDetailTab === 'OVERVIEW'
                ? 'px-3.5 py-2 rounded-lg bg-blue-600 text-white shadow-sm'
                : 'px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200'
            }
          >
            Ficha General del Caso
          </button>
          <button
            onClick={() => setActiveDetailTab('DOCUMENTS')}
            className={
              activeDetailTab === 'DOCUMENTS'
                ? 'px-3.5 py-2 rounded-lg bg-amber-600 text-white shadow-sm'
                : 'px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200'
            }
          >
            Documentos & Retainer ({retainer ? '1' : '0'})
          </button>
          <button
            onClick={() => setActiveDetailTab('TIMELINE')}
            className={
              activeDetailTab === 'TIMELINE'
                ? 'px-3.5 py-2 rounded-lg bg-purple-600 text-white shadow-sm'
                : 'px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200'
            }
          >
            Historial de Notas ({currentCase.notes.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeDetailTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Column 1: Client & Employer Info */}
            <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
                Datos del Prospecto & Contacto
              </h3>
              
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Teléfono:</span>
                  <span className="font-mono font-bold text-amber-400">{currentCase.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-300">{currentCase.email || 'No registrado'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ubicación / Estado:</span>
                  <span className="text-slate-200 font-semibold">{currentCase.state}, USA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Idioma Preferido:</span>
                  <span className="text-slate-200">{currentCase.language === 'ES' ? 'Español' : 'English'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Empresa / Empleador:</span>
                  <span className="font-bold text-white text-right">{currentCase.employer}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Legal Checklist */}
            <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
                Calificación Legal (Intake Checklist)
              </h3>
              
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Fecha del Accidente:</span>
                  <span className="font-mono font-semibold text-slate-200">{currentCase.injuryDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">¿Reportó a su patrón?:</span>
                  <span className={currentCase.reportedToBoss ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {currentCase.reportedToBoss ? 'Sí Reportó' : 'No Reportó'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">¿Atención médica recibida?:</span>
                  <span className={currentCase.receivedMedicalCare ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {currentCase.receivedMedicalCare ? 'Sí Atendido' : 'Sin Doctor Aún'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">¿Tiene abogado previo?:</span>
                  <span className={currentCase.hasAttorney ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {currentCase.hasAttorney ? 'Sí (Conflicto)' : 'No (Califica)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Liner Asignado:</span>
                  <span className="text-slate-300">{currentCase.assignedLiner}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Closer Asignado:</span>
                  <span className="text-amber-400 font-semibold">{currentCase.assignedCloser || 'Por Asignar'}</span>
                </div>
              </div>
            </div>

            {/* Column 3: Injury Narrative */}
            <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
                Descripción de la Lesión & Hechos
              </h3>
              
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed min-h-[140px]">
                {currentCase.injuryDetails}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DOCUMENTS */}
        {activeDetailTab === 'DOCUMENTS' && (
          <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-emerald-400" />
              <span>Documentos Legales & Retainer Agreement</span>
            </h3>

            {retainer ? (
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Retainer Agreement (Contrato de Representación)</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                      {retainer.documentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Enviado vía SMS • Contingencia del {retainer.contingencyFeePercentage}% • Estado: <strong className="text-emerald-400">{retainer.status}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenSignModal(currentCase)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver / Probar Documento</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
                No se ha generado ningún contrato de representación para este expediente.
                <div className="mt-3">
                  <button
                    onClick={() => onSendRetainer(currentCase.id)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Generar y Enviar Retainer SMS</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TIMELINE & NOTES */}
        {activeDetailTab === 'TIMELINE' && (
          <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white">Historial de Calificación y Notas</h3>
            <div className="flex flex-col gap-3">
              {currentCase.notes.map((note) => (
                <div key={note.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-amber-400">{note.author}</span>
                    <span className="font-mono">{new Date(note.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // MAIN CASES TABLE VIEW (Dedicated explorer)
  return (
    <div className="flex flex-col gap-5 w-full max-w-[1800px] mx-auto pb-12 min-w-0">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#0d1527] via-[#0e1b38] to-[#121128] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Legal Records & Files
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit'] mt-1">
            Expedientes de Casos & Documentación
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Directorio maestro de reclamos de Workers' Comp y Personal Injury con historial clínico y contratos.
          </p>
        </div>

        <button
          onClick={onOpenNewCase}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-950/40 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Registrar Nuevo Expediente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 min-w-0">
        
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre de cliente, teléfono, empresa patronal, código de caso..."
            className="w-full bg-[#080c14] border border-slate-800 text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#080c14] border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Todos los Tipos</option>
            <option value="Workers_Comp">Workers' Comp</option>
            <option value="Personal_Injury">Personal Injury</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#080c14] border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="NUEVO_LEAD">Nuevo Lead</option>
            <option value="CALIFICADO_PARA_CLOSER">Fila Closer</option>
            <option value="EN_LLAMADA_CLOSER">En Cierre</option>
            <option value="CONTRATO_ENVIADO">SMS Enviado</option>
            <option value="FIRMA_COMPLETADA">Firmado</option>
            <option value="EN_TRATAMIENTO_MEDICO">En Tratamiento</option>
          </select>
        </div>

      </div>

      {/* Cases Table */}
      <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden min-w-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Código / Cliente</th>
                <th className="py-3.5 px-3">Tipo & Estado</th>
                <th className="py-3.5 px-3">Empresa / Patrón</th>
                <th className="py-3.5 px-3">Fecha Accidente</th>
                <th className="py-3.5 px-3 text-center">Etapa Actual</th>
                <th className="py-3.5 px-3 text-center">Contrato Retainer</th>
                <th className="py-3.5 px-3 text-right">Valor Estimado</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#080c14]/40">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No se encontraron expedientes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className="hover:bg-slate-900/50 cursor-pointer transition-colors"
                  >
                    
                    {/* Code & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold font-mono text-[10px] shrink-0">
                          {c.id.split('-')[1] || 'ID'}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate">{c.leadName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{c.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Case Type & State */}
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-200 block">{c.caseType.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-400">{c.state}, USA ({c.language})</span>
                    </td>

                    {/* Employer */}
                    <td className="py-3.5 px-3 max-w-[200px]">
                      <span className="text-slate-300 block truncate">{c.employer}</span>
                    </td>

                    {/* Injury Date */}
                    <td className="py-3.5 px-3 font-mono text-slate-400">
                      {c.injuryDate}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center">
                      {getStatusBadge(c.status)}
                    </td>

                    {/* Retainer Status */}
                    <td className="py-3.5 px-3 text-center">
                      {c.retainer ? (
                        <span className={
                          c.retainer.status === 'SIGNED'
                            ? 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700 animate-pulse'
                        }>
                          {c.retainer.status === 'SIGNED' ? 'FIRMADO' : 'SMS ENVIADO'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600">Sin contrato</span>
                      )}
                    </td>

                    {/* Estimated Value */}
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {c.estimatedCaseValue}
                    </td>

                    {/* Action button */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300">
                        <span>Ver Expediente</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
