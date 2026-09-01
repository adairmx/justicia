import React, { useState } from "react";
import { ShieldCheck, ArrowRight, CheckCircle2, DollarSign, Clock, Users, Building2, Car, HardHat, PhoneCall, AlertTriangle } from "lucide-react";

interface HeroSectionProps {
  onStartAssessment: (initialCaseType?: string) => void;
  onQuickLeadSubmit: (data: any) => Promise<boolean>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAssessment, onQuickLeadSubmit }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [caseType, setCaseType] = useState("Workers_Comp");
  const [state, setState] = useState("CA");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);
    const success = await onQuickLeadSubmit({
      leadName: name,
      phone,
      caseType,
      state,
      source: "HERO_QUICK_FORM"
    });
    setIsSubmitting(false);
    if (success) {
      setSubmitted(true);
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 border-b border-zinc-800/80">
      {/* Background glow & mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-32 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & Social Proof */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs sm:text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Más de $45,000,000 Recuperados para Familias Hispanas
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] font-serif">
              ¿Te accidentaste en el <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">trabajo</span> o en un <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">choque</span>?
            </h1>

            <p className="text-base sm:text-xl text-zinc-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              No dejes que la aseguradora ni tu patrón te intimiden. Tienes derecho a <strong>atención médica de calidad</strong>, <strong>pago de sueldos caídos</strong> y una <strong>compensación económica máxima</strong>.
            </p>

            {/* Crucial Confidence Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0 text-left pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-zinc-200">
                  <strong>Cero Costo:</strong> No pagas ni un centavo si no ganamos
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-zinc-200">
                  <strong>Protección Total:</strong> Tu estatus legal no importa
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-zinc-200">
                  <strong>Respuesta Inmediata:</strong> Te llamamos en menos de 5 min
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <Users className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-zinc-200">
                  <strong>100% en Español:</strong> Trato humano y transparente
                </span>
              </div>
            </div>

            {/* Quick Case Selectors */}
            <div className="pt-2 flex flex-wrap gap-2.5 justify-center lg:justify-start">
              <button
                onClick={() => onStartAssessment("Workers_Comp")}
                className="px-3.5 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-2 transition-colors"
              >
                <HardHat className="w-4 h-4 text-amber-400" />
                Accidentes de Trabajo
              </button>
              <button
                onClick={() => onStartAssessment("Personal_Injury")}
                className="px-3.5 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-2 transition-colors"
              >
                <Car className="w-4 h-4 text-cyan-400" />
                Accidentes de Auto
              </button>
              <button
                onClick={() => onStartAssessment("Workers_Comp")}
                className="px-3.5 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-2 transition-colors"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                Fábricas & Bodegas
              </button>
            </div>
          </div>

          {/* Right Column: Lead Conversion Box */}
          <div className="lg:col-span-5">
            <div className="bg-[#0e1424] border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-950/20 relative backdrop-blur-xl">
              {/* Badge */}
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                Consulta 100% Gratis
              </div>

              <div className="mb-5">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-serif">
                  Calcula tu Compensación
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Ingresa tus datos y un especialista legal evaluará tu caso de inmediato sin ningún compromiso.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-white">¡Solicitud Recibida!</h4>
                  <p className="text-xs text-zinc-300">
                    Un asesor legal de <strong>Justicia Latina</strong> te llamará en breve al teléfono indicado para revisar los detalles de tu caso.
                  </p>
                  <a
                    href="tel:+18447448339"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg mt-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    ¿Urgencia? Llámanos ahora al (844) 744-8339
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Tipo de Incidente
                    </label>
                    <select
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    >
                      <option value="Workers_Comp">Accidente en el Trabajo (Workers' Comp)</option>
                      <option value="Personal_Injury">Accidente de Auto / Tránsito</option>
                      <option value="Workers_Comp">Caída / Lesión en Construcción</option>
                      <option value="Workers_Comp">Lesión por Esfuerzo Repetitivo / Maquinaria</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. José Hernández"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Número de Teléfono *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(312) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Estado
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      >
                        <option value="CA">California (CA)</option>
                        <option value="IL">Illinois (IL)</option>
                        <option value="TX">Texas (TX)</option>
                        <option value="FL">Florida (FL)</option>
                        <option value="NY">New York (NY)</option>
                        <option value="OTHER">Otro Estado</option>
                      </select>
                    </div>
                  </div>

                  {/* Anti-retaliation reminder */}
                  <div className="flex items-start gap-2 text-[11px] text-zinc-400 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Es ilegal que tu empleador tome represalias o te despida por reclamar tus derechos.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Enviando al Especialista...</span>
                    ) : (
                      <>
                        <span>RECLAMAR MI CONSULTA GRATIS</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => onStartAssessment()}
                      className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                    >
                      O completa el Cuestionario Detallado Paso a Paso →
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
