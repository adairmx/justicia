import React, { useState } from "react";
import { Phone, Mail, MapPin, CheckCircle, ShieldCheck, ArrowRight, UserCheck, Scale, LogIn, ExternalLink, Globe } from "lucide-react";
import { WebCallModal } from "./WebCallModal";

interface ClassicLandingProps {
  onOpenCRM: () => void;
  onLeadCaptured?: (lead: any) => void;
  onSwitchToVariantB?: () => void;
  callMode?: "NATIVE_PHONE" | "WEB_CALL";
}

export const ClassicLandingPage: React.FC<ClassicLandingProps> = ({
  onOpenCRM,
  onLeadCaptured,
  onSwitchToVariantB,
  callMode = "NATIVE_PHONE"
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    incidentType: "Accidente Laboral",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isWebCallOpen, setIsWebCallOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);

    const isCar = formData.incidentType.toLowerCase().includes("auto") || formData.incidentType.toLowerCase().includes("tránsito");

    const payload = {
      leadName: formData.name,
      phone: formData.phone,
      email: formData.email,
      caseType: isCar ? "Personal_Injury" : "Workers_Comp",
      state: "IL",
      injuryDetails: `[Clon Clásico Original - A/B Test A] Ciudad: ${formData.city || "N/A"} | Tipo: ${formData.incidentType} | Mensaje: ${formData.message || "Sin mensaje"}`,
      source: "AB_TEST_VARIANTE_A_CLASSIC"
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (onLeadCaptured) onLeadCaptured(data.lead);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Top Bar with Chicago / National Numbers */}
      <div className="bg-[#1e293b] text-white py-2 px-4 text-xs border-b border-slate-700">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              4048 W 63rd St, Chicago, IL 60629
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              iam@justicialatinaoficial.com
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="tel:+13129894525" className="font-bold text-amber-400 hover:underline flex items-center gap-1">
              <Phone className="w-3 h-3" /> Chicago: (312) 989-4525
            </a>
            <span className="text-slate-500">/</span>
            <a href="tel:+18447448339" className="font-bold text-emerald-400 hover:underline flex items-center gap-1">
              <Phone className="w-3 h-3" /> Nacional: (844) 744-8339
            </a>
            <button
              onClick={onOpenCRM}
              title="Acceso Staff / CRM"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <LogIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Logo */}
      <header className="bg-white shadow-sm border-b border-slate-200 py-4 px-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-amber-400 shadow-md">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-black text-blue-950 tracking-tight leading-none font-serif">
                JUSTICIA <span className="text-amber-600">LATINA</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium tracking-wide mt-0.5">
                ENLACE MÉDICO Y LEGAL • CONSULTAS CON CHEPPOV & SCOTT, LLC
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onSwitchToVariantB && (
              <button
                onClick={onSwitchToVariantB}
                className="hidden md:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 transition-colors"
              >
                <span>Ver Variante B (High-CRO)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            {callMode === "WEB_CALL" ? (
              <button
                onClick={() => setIsWebCallOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-lg shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>LLAMAR ONLINE (VOIP)</span>
              </button>
            ) : (
              <a
                href="tel:+18447448339"
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-lg shadow transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>CONSULTA GRATIS 24/7</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <WebCallModal
        isOpen={isWebCallOpen}
        onClose={() => setIsWebCallOpen(false)}
        onLeadCaptured={onLeadCaptured}
      />

      {/* Hero Banner (Classic Corporate Style) */}
      <section className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white py-12 lg:py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-block bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
              Abogados y Médicos a tu Servicio
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight font-serif">
              ¿Tuviste un Accidente en el Trabajo o de Auto?
            </h1>
            <p className="text-slate-200 text-base leading-relaxed">
              En <strong>Justicia Latina</strong> te conectamos de inmediato con profesionales médicos y con el bufete de abogados <strong>Cheppov and Scott, LLC</strong> para que recibas el tratamiento médico que necesitas y la compensación que por ley te corresponde.
            </p>

            <div className="space-y-2 pt-2 text-sm text-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>No cobramos si no ganamos:</strong> Cero gastos de tu bolsillo.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Atención 100% en Español:</strong> Te guiamos en cada paso del proceso.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Sin importar tu estatus:</strong> Tus derechos están protegidos.</span>
              </div>
            </div>
          </div>

          {/* Form Box */}
          <div className="lg:col-span-5 bg-white text-slate-800 rounded-xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-extrabold text-blue-950 font-serif mb-1">
              Contáctanos Ahora
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Envía tus datos y un representante te contactará en minutos.
            </p>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs text-emerald-700">
                  Hemos transferido tu consulta a la oficina de abogados para evaluarla de inmediato.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre y apellido"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-blue-900 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Teléfono *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(312) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-blue-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ciudad / Área</label>
                    <input
                      type="text"
                      placeholder="Ej. Chicago / Suburbios"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-blue-900 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Caso</label>
                  <select
                    value={formData.incidentType}
                    onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-blue-900 text-sm"
                  >
                    <option value="Accidente Laboral / Trabajo">Accidente Laboral / Trabajo</option>
                    <option value="Accidente de Tránsito / Choque">Accidente de Tránsito / Choque</option>
                    <option value="Caída o Lesión en Establecimiento">Caída o Lesión en Establecimiento</option>
                    <option value="Atención Médica Post-Accidente">Atención Médica Post-Accidente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Breve Comentario (Opcional)</label>
                  <textarea
                    rows={2}
                    placeholder="Cuéntanos brevemente qué ocurrió..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-lg shadow-md transition-all uppercase tracking-wide cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "SOLICITAR ASESORÍA GRATUITA"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid (Classic Format) */}
      <section className="py-12 px-4 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-serif">
              Nuestros Servicios de Apoyo a la Comunidad
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl mx-auto">
              Facilitamos el acceso a profesionales de primer nivel para que no enfrentes solo a las aseguradoras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center mb-3">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-blue-950 mb-2">Accidentes de Trabajo</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Asesoría legal a través de Cheppov and Scott, LLC para reclamos de Workers' Comp: caídas, maquinaria pesada, sobreesfuerzo y más.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center mb-3">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-blue-950 mb-2">Accidentes de Auto</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Representación y enlace para conductores y peatones involucrados en colisiones viales en el área de Chicago e Illinois.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-blue-950 mb-2">Enlace Médico</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Te conectamos con doctores, clínicas y terapeutas especializados que aceptan casos de accidentes sin cobro por adelantado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Disclaimer & Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="font-bold text-white text-base font-serif">JUSTICIA LATINA LLC</div>
              <div>4048 W 63rd St, Chicago, IL 60629 | (312) 989-4525</div>
            </div>
            <div className="text-right text-slate-300">
              iam@justicialatinaoficial.com
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500">
            <strong>Aviso de Publicidad y Descargo Legal:</strong> Justicia Latina LLC es una empresa de marketing y publicidad enfocada en los campos médico y legal. No somos un bufete de abogados. Todas las consultas legales son realizadas y atendidas directamente por la oficina de los abogados <strong>Cheppov and Scott, LLC</strong>.
          </p>

          <div className="text-[10px] text-slate-600 flex justify-between pt-2">
            <div>© {new Date().getFullYear()} Justicia Latina LLC. Todos los derechos reservados.</div>
            <div>[Variante A - Versión Institucional Oficial]</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
