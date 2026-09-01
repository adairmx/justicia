import React, { useState } from "react";
import { X, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, PhoneCall, HardHat, Car, Flame, Sparkles, Building2 } from "lucide-react";

interface CaseAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (data: any) => Promise<boolean>;
  initialCaseType?: string;
}

export const CaseAssessmentModal: React.FC<CaseAssessmentModalProps> = ({
  isOpen,
  onClose,
  onSubmitLead,
  initialCaseType = "Workers_Comp"
}) => {
  const [step, setStep] = useState(1);
  const [caseType, setCaseType] = useState(initialCaseType);
  const [injuryTimeframe, setInjuryTimeframe] = useState("MENOS_DE_30_DIAS");
  const [reportedToBoss, setReportedToBoss] = useState("SI");
  const [receivedMedicalCare, setReceivedMedicalCare] = useState("SI");
  const [hasAttorney, setHasAttorney] = useState("NO");
  const [injuryType, setInjuryType] = useState("ESPALDA_CUELLO");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("CA");
  const [employer, setEmployer] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    const estimatedValue = caseType === "Personal_Injury" ? "$95,000" : "$65,000";

    const leadData = {
      leadName: name,
      phone,
      email,
      caseType,
      state,
      employer: employer || "No especificado",
      reportedToBoss: reportedToBoss === "SI",
      receivedMedicalCare: receivedMedicalCare === "SI",
      hasAttorney: hasAttorney === "SI",
      injuryDetails: `[Evaluación Guiada Web] Tipo de Lesión: ${injuryType} | Plazo: ${injuryTimeframe} | Reportado: ${reportedToBoss} | Médico: ${receivedMedicalCare} | Detalle: ${details || "Sin notas adicionales"}`,
      estimatedCaseValue: estimatedValue,
      source: "MODAL_MULTI_STEP_ASSESSMENT"
    };

    const success = await onSubmitLead(leadData);
    setIsSubmitting(false);
    if (success) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#0e1424] border border-amber-500/40 rounded-2xl w-full max-w-xl p-5 sm:p-8 shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        {!isSubmitted && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Paso {step} de 3
              </span>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Confidencial
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white font-serif">¡Caso Pre-Calificado con Éxito!</h3>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              Hemos registrado tus datos en nuestro sistema prioritario. Uno de nuestros <strong>Directores de Admisiones Legales</strong> te llamará de inmediato al teléfono <strong>{phone}</strong>.
            </p>
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-left space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>¿Qué pasará durante la llamada?</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                <li>Evaluaremos la cuantía exacta de tu reclamo laboral o médico.</li>
                <li>Te explicaremos cómo proteger tu trabajo contra despidos injustificados.</li>
                <li>Te conectamos con clínicas especializadas sin costo adelantado.</li>
              </ul>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+18447448339"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <PhoneCall className="w-4 h-4" />
                Llamar Ahora Directo: (844) 744-8339
              </a>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step 1: Incident & Timeline */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-white font-serif">¿Qué tipo de accidente sufriste?</h3>
                  <p className="text-xs text-zinc-400 mt-1">Selecciona la opción que mejor describe tu situación actual.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCaseType("Workers_Comp")}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                      caseType === "Workers_Comp"
                        ? "bg-amber-500/15 border-amber-400 text-white shadow-md shadow-amber-500/10"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <HardHat className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-sm">Accidente de Trabajo</span>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      En bodega, construcción, fábrica, restaurante, limpieza, etc.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCaseType("Personal_Injury")}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                      caseType === "Personal_Injury"
                        ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-cyan-400" />
                      <span className="font-bold text-sm">Accidente de Tránsito</span>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      Choque de auto, Uber/Lyft, camión o atropello.
                    </span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    ¿Cuándo ocurrió el accidente aproximadamente?
                  </label>
                  <select
                    value={injuryTimeframe}
                    onChange={(e) => setInjuryTimeframe(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="MENOS_DE_30_DIAS">Hace menos de 30 días (Reciente)</option>
                    <option value="1_A_6_MESES">Entre 1 y 6 meses</option>
                    <option value="6_A_12_MESES">Entre 6 meses y 1 año</option>
                    <option value="MAS_DE_1_ANO">Más de 1 año</option>
                  </select>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Qualification questions */}
            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-white font-serif">Detalles del Accidente</h3>
                  <p className="text-xs text-zinc-400 mt-1">Estas preguntas nos permiten calcular tu rango de compensación.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-2">
                    ¿Reportaste la lesión a tu patrón / supervisor o a la policía?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setReportedToBoss("SI")}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                        reportedToBoss === "SI"
                          ? "bg-amber-500/20 border-amber-400 text-amber-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                      }`}
                    >
                      Sí, fue reportado
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportedToBoss("NO")}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                        reportedToBoss === "NO"
                          ? "bg-amber-500/20 border-amber-400 text-amber-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                      }`}
                    >
                      No / No me lo permitieron
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-2">
                    ¿Has recibido atención médica o fuiste a la clínica?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setReceivedMedicalCare("SI")}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                        receivedMedicalCare === "SI"
                          ? "bg-amber-500/20 border-amber-400 text-amber-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                      }`}
                    >
                      Sí, fui al médico
                    </button>
                    <button
                      type="button"
                      onClick={() => setReceivedMedicalCare("NO")}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                        receivedMedicalCare === "NO"
                          ? "bg-amber-500/20 border-amber-400 text-amber-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                      }`}
                    >
                      Aún no / Necesito médico
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-2">
                    ¿Tienes actualmente un abogado contratado para este caso?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setHasAttorney("NO")}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                        hasAttorney === "NO"
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                      }`}
                    >
                      No, busco abogado
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasAttorney("SI")}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                        hasAttorney === "SI"
                          ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                      }`}
                    >
                      Sí, ya tengo
                    </button>
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-sm flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Submission */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-white font-serif">¿A dónde te enviamos los resultados?</h3>
                  <p className="text-xs text-zinc-400 mt-1">Te contactaremos para darte la evaluación oficial de tu compensación.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. María Elena González"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">Número de Teléfono *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(312) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">Estado de EE.UU.</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="CA">California</option>
                      <option value="IL">Illinois</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      <option value="NY">New York</option>
                      <option value="OTHER">Otro Estado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">Empresa / Empleador (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Almacén de Logística / Amazon / Constructora"
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">Breve descripción de cómo ocurrió (Opcional)</label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Levantando una caja pesada sentí un jalón en la espalda baja..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-sm flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Enviando al Especialista..." : "SOLICITAR EVALUACIÓN AHORA"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
