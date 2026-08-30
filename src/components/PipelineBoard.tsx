import React, { useState } from 'react';
import { 
  FolderKanban, 
  Search, 
  Phone, 
  CheckCircle2, 
  DollarSign
} from 'lucide-react';
import { LegalCase, CaseStatus } from '../types';

interface PipelineBoardProps {
  cases: LegalCase[];
  selectedCaseId: string | null;
  onSelectCase: (caseItem: LegalCase) => void;
  activeRole: 'LINER' | 'CLOSER' | 'ADMIN';
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  activeRole
}) => {
  const [filter, setFilter] = useState<'ALL' | 'INTAKE' | 'CLOSER' | 'RETAINER_SENT' | 'SIGNED'>('ALL');
  const [search, setSearch] = useState('');

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'NUEVO_LEAD':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700 shrink-0">Nuevo</span>;
      case 'EN_INTAKE_LINER':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-950 text-blue-400 border border-blue-800 shrink-0">Intake</span>;
      case 'CALIFICADO_PARA_CLOSER':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse shrink-0">Fila Closer</span>;
      case 'EN_LLAMADA_CLOSER':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800 animate-pulse shrink-0">En Cierre</span>;
      case 'CONTRATO_ENVIADO':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">SMS Enviado</span>;
      case 'FIRMA_COMPLETADA':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 shrink-0"><CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Firmado</span>;
      case 'EN_TRATAMIENTO_MEDICO':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-950 text-teal-300 border border-teal-800 shrink-0">Médico</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400 shrink-0">{status}</span>;
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch = 
      c.leadName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.employer.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'INTAKE') return c.status === 'NUEVO_LEAD' || c.status === 'EN_INTAKE_LINER';
    if (filter === 'CLOSER') return c.status === 'CALIFICADO_PARA_CLOSER' || c.status === 'EN_LLAMADA_CLOSER';
    if (filter === 'RETAINER_SENT') return c.status === 'CONTRATO_ENVIADO';
    if (filter === 'SIGNED') return c.status === 'FIRMA_COMPLETADA' || c.status === 'EN_TRATAMIENTO_MEDICO';

    return true;
  });

  return (
    <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-2.5 shadow-xl h-full min-w-0 overflow-hidden">
      
      {/* Header & Search */}
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <FolderKanban className="w-4 h-4 text-amber-400 shrink-0" />
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">Bandeja de Casos</h2>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-mono font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
            {filteredCases.length} Casos
          </span>
        </div>

        {/* Search */}
        <div className="relative min-w-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono, empresa..."
            className="w-full bg-[#080c14] border border-slate-800 text-xs text-white pl-8 pr-3 py-1.5 sm:py-2 rounded-xl focus:outline-none focus:border-amber-500 transition-colors min-w-0"
          />
        </div>

        {/* Quick Filter Tabs: horizontal scroll on small devices */}
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold border-b border-slate-800/80 pb-2 overflow-x-auto no-scrollbar min-w-0">
          <button
            onClick={() => setFilter('ALL')}
            className={px-2 py-0.5 rounded-lg transition-colors shrink-0 }
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('INTAKE')}
            className={px-2 py-0.5 rounded-lg transition-colors shrink-0 }
          >
            Intake
          </button>
          <button
            onClick={() => setFilter('CLOSER')}
            className={px-2 py-0.5 rounded-lg transition-colors shrink-0 }
          >
            Cierre
          </button>
          <button
            onClick={() => setFilter('RETAINER_SENT')}
            className={px-2 py-0.5 rounded-lg transition-colors shrink-0 }
          >
            SMS Enviado
          </button>
          <button
            onClick={() => setFilter('SIGNED')}
            className={px-2 py-0.5 rounded-lg transition-colors shrink-0 }
          >
            Firmados
          </button>
        </div>
      </div>

      {/* Case List */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 max-h-[calc(100vh-280px)] min-w-0">
        {filteredCases.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No se encontraron casos.
          </div>
        ) : (
          filteredCases.map((c) => {
            const isSelected = c.id === selectedCaseId;
            return (
              <div
                key={c.id}
                onClick={() => onSelectCase(c)}
                className={p-3 rounded-xl border cursor-pointer transition-all min-w-0 }
              >
                <div className="flex items-start justify-between gap-2 mb-1 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-xs text-white truncate">{c.leadName}</span>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">({c.id})</span>
                    </div>
                    <span className="text-[9px] font-semibold text-amber-400/90 uppercase tracking-wider block truncate">
                      {c.caseType.replace('_', ' ')} • {c.state}
                    </span>
                  </div>
                  {getStatusBadge(c.status)}
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/50 break-words">
                  {c.injuryDetails}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 min-w-0">
                  <div className="flex items-center gap-1 text-slate-300 font-mono truncate">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-0.5 font-semibold text-emerald-400 shrink-0">
                    <DollarSign className="w-3 h-3 text-emerald-500" />
                    <span>{c.estimatedCaseValue}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
