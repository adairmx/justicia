import React, { useState } from "react";
import { Phone, Mail, MapPin, CheckCircle, ShieldCheck, ArrowRight, UserCheck, Scale, LogIn, ExternalLink, Globe, Facebook, MessageSquare, Award, Clock, FileText, Check } from "lucide-react";
import { WebCallModal } from "./WebCallModal";

interface ExactCloneProps {
  onOpenCRM: () => void;
  onLeadCaptured?: (lead: any) => void;
  onSwitchToVariantA?: () => void;
  callMode?: "NATIVE_PHONE" | "WEB_CALL";
}

export const ExactCloneJusticiaLatina: React.FC<ExactCloneProps> = ({
  onOpenCRM,
  onLeadCaptured,
  onSwitchToVariantA,
  callMode = "NATIVE_PHONE"
}) => {
  // Form 1: Accidentes de Trabajo
  const [workForm, setWorkForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    codigoPostal: "",
    mensaje: ""
  });
  const [workSubmitting, setWorkSubmitting] = useState(false);
  const [workSubmitted, setWorkSubmitted] = useState(false);

  // Form 2: Accidentes de Auto
  const [autoForm, setAutoForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    codigoPostal: "",
    mensaje: ""
  });
  const [autoSubmitting, setAutoSubmitting] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const [isWebCallOpen, setIsWebCallOpen] = useState(false);

  const handleWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workForm.nombre || !workForm.telefono) return;
    setWorkSubmitting(true);

    const payload = {
      leadName: workForm.nombre,
      phone: workForm.telefono,
      email: workForm.email,
      caseType: "Workers_Comp",
      state: "IL",
      injuryDetails: `[Clon Exacto Oficial B - Accidente de Trabajo] C.P.: ${workForm.codigoPostal || "N/A"} | Mensaje: ${workForm.mensaje || "Sin mensaje"}`,
      source: "AB_TEST_VARIANTE_B_EXACT_CLONE_WORK"
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setWorkSubmitted(true);
        if (onLeadCaptured) onLeadCaptured(data.lead);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWorkSubmitting(false);
    }
  };

  const handleAutoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoForm.nombre || !autoForm.telefono) return;
    setAutoSubmitting(true);

    const payload = {
      leadName: autoForm.nombre,
      phone: autoForm.telefono,
      email: autoForm.email,
      caseType: "Personal_Injury",
      state: "IL",
      injuryDetails: `[Clon Exacto Oficial B - Accidente de Auto] C.P.: ${autoForm.codigoPostal || "N/A"} | Mensaje: ${autoForm.mensaje || "Sin mensaje"}`,
      source: "AB_TEST_VARIANTE_B_EXACT_CLONE_AUTO"
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setAutoSubmitted(true);
        if (onLeadCaptured) onLeadCaptured(data.lead);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAutoSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F2847] text-white font-sans flex flex-col selection:bg-[#5BB356] selection:text-white">
      {/* 1. TOPBAR EXACTA */}
      <div className="bg-[#0A1D34] text-zinc-300 py-1.5 px-4 text-[11px] border-b border-[#1A385E]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span>Illinois: <a href="tel:+13129894525" className="text-white font-bold hover:underline">312-989-4525</a></span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span>Otros estados: <a href="tel:+18447448339" className="text-white font-bold hover:underline">844-744-8339</a></span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-[#5BB356] font-semibold flex items-center gap-1">
              WhatsApp: 708 698 9954
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/justicialatina"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <span className="text-zinc-600">|</span>
            <button
              onClick={onOpenCRM}
              title="Acceso CRM / Operaciones"
              className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <LogIn className="w-3 h-3" />
              <span>Staff CRM</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR EXACTO */}
      <header className="bg-[#0F2847] border-b border-[#1B3B63] py-4 px-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1E4575] to-[#0A1D34] border border-[#2D588D] flex items-center justify-center text-[#5BB356] shadow-inner">
              <Scale className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-white font-serif uppercase">
                JUSTICIA <span className="text-[#5BB356]">LATINA</span>
              </div>
              <div className="text-[10px] text-zinc-300 font-semibold tracking-wider uppercase">
                ENLACE MÉDICO & LEGAL
              </div>
            </div>
          </div>

          {/* Menú de Navegación Exacto de justicialatinaoficial.com */}
          <nav className="flex items-center gap-4 sm:gap-6 text-xs font-extrabold uppercase tracking-wide">
            <span className="text-[#5BB356] border-b-2 border-[#5BB356] pb-0.5">PRINCIPAL</span>
            <span className="text-zinc-300 hover:text-white cursor-pointer">INFORMATE</span>
            <span className="text-[#5BB356] hover:text-[#76ca71] cursor-pointer">ASESORATE GRATIS</span>
            <span className="text-[#5BB356] hover:text-[#76ca71] cursor-pointer">BLOG</span>
          </nav>

          {/* Botón de Llamada Dinámica */}
          <div className="flex items-center gap-2">
            {callMode === "WEB_CALL" ? (
              <button
                onClick={() => setIsWebCallOpen(true)}
                className="px-4 py-2 bg-[#5BB356] hover:bg-[#4ea249] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center gap-1.5 cursor-pointer uppercase"
              >
                <Globe className="w-3.5 h-3.5 animate-spin" />
                <span>Llamar Online (VoIP)</span>
              </button>
            ) : (
              <a
                href="tel:+13129894525"
                className="px-4 py-2 bg-[#5BB356] hover:bg-[#4ea249] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center gap-1.5 uppercase"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>IL. (312) 989-4525</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO & SECCIÓN "CONTÁCTANOS AHORA" (FORMULARIOS 1 & 2) */}
      <section className="py-10 px-4 bg-[#0F2847]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-serif">
              CONTÁCTANOS AHORA
            </h1>
            <div className="w-20 h-1 bg-[#5BB356] mx-auto mt-3 rounded-full" />
          </div>

          {/* FORMULARIO 1: ACCIDENTES DE TRABAJO */}
          <div className="bg-[#143256] border border-[#1E4575] rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
            <div className="text-center sm:text-left mb-6">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#5BB356] uppercase tracking-wide">
                DÉJANOS TUS DATOS SI SUFRISTE UN ACCIDENTE DE TRABAJO.
              </h2>
              <p className="text-xs text-zinc-300 mt-1">
                Evaluación gratuita, confidencial y sin compromiso.
              </p>
            </div>

            {workSubmitted ? (
              <div className="p-6 bg-emerald-950/60 border border-[#5BB356] rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-[#5BB356] mx-auto" />
                <h3 className="text-lg font-bold text-white">Tu mensaje fue enviado con éxito</h3>
                <p className="text-xs text-zinc-200">
                  Un asesor legal y médico de <strong>Justicia Latina</strong> te contactará en breve al teléfono indicado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWorkSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-200 uppercase mb-1">Nombre *</label>
                    <input
                      type="text"
                      required
                      value={workForm.nombre}
                      onChange={(e) => setWorkForm({ ...workForm, nombre: e.target.value })}
                      className="w-full bg-[#0A1D34] border border-[#2D588D] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#5BB356]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-200 uppercase mb-1">Número de teléfono *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(312) 000-0000"
                        value={workForm.telefono}
                        onChange={(e) => setWorkForm({ ...workForm, telefono: e.target.value })}
                        className="w-full bg-[#0A1D34] border border-[#2D588D] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#5BB356]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-200 uppercase mb-1">Código postal</label>
                      <input
                        type="text"
                        placeholder="Ej. 60629"
                        value={workForm.codigoPostal}
                        onChange={(e) => setWorkForm({ ...workForm, codigoPostal: e.target.value })}
                        className="w-full bg-[#0A1D34] border border-[#2D588D] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#5BB356]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-200 uppercase mb-1">Correo electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@ejemplo.com"
                      value={workForm.email}
                      onChange={(e) => setWorkForm({ ...workForm, email: e.target.value })}
                      className="w-full bg-[#0A1D34] border border-[#2D588D] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#5BB356]"
                    />
                  </div>
                </div>

                <div className="md:col-span-6 flex flex-col justify-between">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-200 uppercase mb-1">Mensaje (Detalles de la lesión)</label>
                    <textarea
                      rows={5}
                      placeholder="Cuéntanos brevemente cómo ocurrió el accidente de trabajo..."
                      value={workForm.mensaje}
                      onChange={(e) => setWorkForm({ ...workForm, mensaje: e.target.value })}
                      className="w-full bg-[#0A1D34] border border-[#2D588D] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#5BB356]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={workSubmitting}
                    className="w-full mt-3 py-3 bg-[#5BB356] hover:bg-[#4ea249] text-white font-black text-sm uppercase rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {workSubmitting ? "ENVIANDO DATOS..." : "ENVIAR MENSAJE"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="border-t border-[#1E4575] my-8" />

          {/* FORMULARIO 2: ACCIDENTES DE AUTO */}
          <div className="bg-[#143256] border border-[#1E4575] rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="text-center sm:text-left mb-6">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#5BB356] uppercase tracking-wide">
                DÉJANOS TUS DATOS SI SUFRISTE UN ACCIDENTE DE AUTO.
              </h2>
              <p className="text-xs text-zinc-300 mt-1">
                Atención para conductores, pasajeros y peatones en Chicago y otros estados.
              </p>
            </div>

            {autoSubmitted ? (
              <div className="p-6 bg-emerald-950/60 border border-[#5BB356] rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-[#5BB356] mx-auto" />
                <h3 className="text-lg font-bold text-white">Su mensaje fue enviado con éxito!</h3>
                <p className="text-xs text-zinc-200">
                  Nos comunicaremos contigo enseguida para iniciar tu reclamo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAutoSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-200 uppercase mb-1">Nombre *</label>
                    <input
                      type="text"
                      required
                      value={autoForm.nombre}
                      onChange={(e) => setAutoForm({ ...autoForm, nombre: e.target.value })}
                      className="w-full bg-[#0A1D34] border border-[#2D588D] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#5BB356]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-200 uppercase mb-1">Número de teléfono *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(312) 000-0000"
                        value={autoForm.telefono}
                        onChange={(e) => setAutoForm({ ...autoForm, telefono: e.target.value })}
                        className="w-full bg-[#0A1D34] border border-[#2D588D] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#5BB356]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-200 uppercase mb-1">Código postal</label>
                      <input
                        type="text"
                        placeholder="Ej. 60629"
                        value={autoForm.codigoPostal}
                        onChange={(e) => setAutoForm({ ...autoForm, codigoPostal: e.target.value })}
                        className="w-full bg-[#0A1D34] border border-[#2D588D] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#5BB356]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-200 uppercase mb-1">Correo electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@ejemplo.com"
                      value={autoForm.email}
                      onChange={(e) => setAutoForm({ ...autoForm, email: e.target.value })}
                      className="w-full bg-[#0A1D34] border border-[#2D588D] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#5BB356]"
                    />
                  </div>
                </div>

                <div className="md:col-span-6 flex flex-col justify-between">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-200 uppercase mb-1">Mensaje (Detalles del choque)</label>
                    <textarea
                      rows={5}
                      placeholder="Cuéntanos brevemente cómo ocurrió el accidente vehicular..."
                      value={autoForm.mensaje}
                      onChange={(e) => setAutoForm({ ...autoForm, mensaje: e.target.value })}
                      className="w-full bg-[#0A1D34] border border-[#2D588D] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#5BB356]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={autoSubmitting}
                    className="w-full mt-3 py-3 bg-[#5BB356] hover:bg-[#4ea249] text-white font-black text-sm uppercase rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {autoSubmitting ? "ENVIANDO DATOS..." : "ENVIAR MENSAJE"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN OFICINAS & ASESORÍA DIRECTA */}
      <section className="py-12 px-4 bg-[#0A1D34] border-t border-b border-[#1A385E]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Dale click ☑️ y asesórate con un abogado ahora.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1">
              Estas son algunas de nuestras oficinas, llámanos GRATIS con cualquier duda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Mapa de Cobertura */}
            <div className="bg-[#143256] p-4 rounded-2xl border border-[#2D588D] shadow-lg">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-[#5BB356] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Cobertura Chicago y Suburbios
                </span>
                <span className="text-[10px] text-zinc-400">4048 W 63rd St, Chicago</span>
              </div>
              <div className="w-full h-64 bg-[#0F2847] rounded-xl flex flex-col items-center justify-center p-4 text-center border border-[#1E4575]">
                <MapPin className="w-10 h-10 text-red-400 animate-bounce mb-2" />
                <div className="text-sm font-bold text-white">Oficina Principal Chicago</div>
                <div className="text-xs text-zinc-300 mt-1">4048 W 63rd St, Chicago, IL 60629</div>
                <div className="text-[11px] text-[#5BB356] font-semibold mt-2">
                  *Debes llamar al 312-989-4525 para una cita previa
                </div>
              </div>
            </div>

            {/* Video / Banner Promocional */}
            <div className="bg-gradient-to-br from-[#143256] to-[#0A1D34] p-6 rounded-2xl border border-[#2D588D] text-center space-y-4 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-[#5BB356]/20 border border-[#5BB356] text-[#5BB356] flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase font-serif">
                Línea Directa de Asesoría Legal
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Consultas atendidas en conjunto con el bufete de abogados <strong>Cheppov and Scott, LLC</strong>.
              </p>
              <div className="p-3 bg-[#0A1D34] rounded-xl border border-[#1E4575]">
                <div className="text-[10px] text-zinc-400 uppercase">Llama al número en pantalla:</div>
                <div className="text-2xl font-black text-[#5BB356] tracking-wider mt-0.5">(312) 989-4525</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN PROPUESTA DE VALOR & GARANTÍA (FONDO CLARO #EAEAEA) */}
      <section className="py-16 px-4 bg-[#EAEAEA] text-[#102A45]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed">
            Más de 15 años asistiendo a la comunidad latina de Estados Unidos en caso de accidentes o lesiones laborales, accidentes de auto y demás tipos de accidentes.
          </p>

          <h2 className="text-2xl sm:text-4xl font-black text-[#0F2847] uppercase font-serif tracking-tight">
            ¡Asesoría Legal GRATIS AHORA!
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl mx-auto">
            Con <strong>Justicia Latina™</strong> contarás con los mejores Doctores y Abogados de Accidentes, los mejores especialistas en casos de Compensación Laboral al trabajador, Accidentes de Tráfico, Lesiones Personales. No lo pienses más y llámanos para consultar tu caso.
          </p>

          <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-300 max-w-2xl mx-auto text-xs sm:text-sm text-slate-800 leading-relaxed">
            El abogado que te represente solo cobrará un porcentaje de tu compensación, el cual es dictado por la ley del estado en donde se defiende el caso. Una vez ganado el caso el abogado cobra, en pocas palabras: <br />
            <strong className="text-red-700 text-base uppercase font-black tracking-wide mt-1 block">
              SI NO GANAS NO PAGAS
            </strong>
          </div>

          <div className="pt-2">
            <a
              href="tel:+13129894525"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#5BB356] hover:bg-[#4ea249] text-white font-black text-sm uppercase rounded-full shadow-lg transition-transform hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>LLÁMANOS AHORA 📳 (312) 989-4525</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. PROCESO EN 4 PASOS ("¿Qué hace Justicia Latina por tí?") */}
      <section className="py-14 px-4 bg-[#0F2847] border-t border-[#1E4575]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#5BB356] uppercase tracking-tight font-serif">
              ¿Qué hace Justicia Latina por tí?
            </h2>
            <div className="w-16 h-1 bg-[#5BB356] mx-auto mt-2 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#143256] border border-[#1E4575] p-6 rounded-2xl text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white text-[#0F2847] font-black text-xl flex items-center justify-center mx-auto shadow-md">
                ✏️
              </div>
              <h3 className="font-extrabold text-sm text-white uppercase">Tomamos la información</h3>
              <p className="text-xs text-zinc-300">Recabamos todos los antecedentes y detalles médicos de tu accidente.</p>
            </div>

            <div className="bg-[#143256] border border-[#1E4575] p-6 rounded-2xl text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white text-[#0F2847] font-black text-xl flex items-center justify-center mx-auto shadow-md">
                📜
              </div>
              <h3 className="font-extrabold text-sm text-white uppercase">Entregamos un informe</h3>
              <p className="text-xs text-zinc-300">Evaluamos la viabilidad y cuantía estimada de compensación legal.</p>
            </div>

            <div className="bg-[#143256] border border-[#1E4575] p-6 rounded-2xl text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white text-[#0F2847] font-black text-xl flex items-center justify-center mx-auto shadow-md">
                💡
              </div>
              <h3 className="font-extrabold text-sm text-white uppercase">Creamos una forma de trabajo</h3>
              <p className="text-xs text-zinc-300">Diseñamos la estrategia médico-legal adecuada para tu situación.</p>
            </div>

            <div className="bg-[#143256] border border-[#1E4575] p-6 rounded-2xl text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white text-[#0F2847] font-black text-xl flex items-center justify-center mx-auto shadow-md">
                🗄️
              </div>
              <h3 className="font-extrabold text-sm text-white uppercase">Damos seguimiento a tu caso</h3>
              <p className="text-xs text-zinc-300">Acompañamiento continuo hasta el cobro final de tu cheque.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECCIÓN EQUIPO ("CONOCE QUIENES SOMOS") (FONDO CLARO #EAEAEA) */}
      <section className="py-16 px-4 bg-[#EAEAEA] text-[#102A45]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#5BB356] uppercase tracking-tight font-serif">
              CONOCE QUIENES SOMOS
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              Con quien cuentas a la hora de pasar por una situación de lesión o accidente laboral.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { name: "Jose", role: "El fundador" },
              { name: "Clever", role: "Supervisora" },
              { name: "Emily", role: "Supervisora" },
              { name: "Elena", role: "Gerente General" },
              { name: "Gustavo", role: "Supervisor (Medico)" },
              { name: "Fernando", role: "Operador" },
              { name: "Trinidad", role: "Recursos Humanos" },
              { name: "Leonel", role: "Supervisor" }
            ].map((member, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-300 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-[#0F2847] text-white font-bold text-lg flex items-center justify-center mx-auto mb-2 shadow-inner">
                  {member.name.charAt(0)}
                </div>
                <div className="font-extrabold text-sm text-[#0F2847]">{member.name}</div>
                <div className="text-[11px] text-[#5BB356] font-semibold">{member.role}</div>
              </div>
            ))}
          </div>

          {/* Citas / Testimonios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs italic text-slate-700">
            <div className="bg-white p-4 rounded-xl border border-slate-300">
              “Trabajar para la comunidad latina en Chicago y suburbios es un trabajo muy reconfortante.” <br />
              <strong className="not-italic text-slate-900 font-bold block mt-1">- Miguel A.</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-300">
              “Nos ocuparemos de tu caso de accidente como si fueras parte de mi familia...” <br />
              <strong className="not-italic text-slate-900 font-bold block mt-1">- Noe Rodriguez.</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECCIÓN INFORMATIVA MÉDICA & LEGAL */}
      <section className="py-14 px-4 bg-[#0F2847] border-t border-[#1E4575]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 bg-[#143256] p-6 rounded-2xl border border-[#2D588D] text-center space-y-3 shadow-lg">
            <div className="w-20 h-20 rounded-full bg-[#5BB356]/20 border-2 border-[#5BB356] flex items-center justify-center mx-auto text-[#5BB356]">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-white font-serif">Red Médica Especializada</h3>
            <p className="text-xs text-zinc-300">Atención médica inmediata sin pagos por adelantado.</p>
          </div>

          <div className="md:col-span-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-serif">
              Nuestro grupo de profesionales están a tu servicio.
            </h2>
            <div className="p-4 bg-[#0A1D34] rounded-xl border border-[#1E4575] space-y-2 text-xs leading-relaxed text-zinc-300">
              <strong className="text-[#5BB356] block text-sm">
                Una de las preguntas más comunes de los trabajadores latinos es ¿qué se considera un accidente de trabajo?
              </strong>
              <p>
                Un accidente de trabajo son las lesiones que se presentan durante horas laborales. Las personas que sufren de un accidente de trabajo son considerados bajo la ley como individuos con derecho a recibir ciertos beneficios tales como una compensación económica, incapacidad laboral, un porcentaje de su salario por semana o quincena y/o tratamiento médico, según aplique en cada caso.
              </p>
              <p>
                El grupo de Abogados y Doctores de Accidentes con los cuales cuenta <strong>Justicia Latina™</strong> son profesionales expertos en compensación laboral y te asesorarán de forma GRATUITA e inmediata, te sacarán de cualquier duda y darán seguimiento a tu caso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER EXACTO */}
      <footer className="bg-[#F4F5F7] text-[#102A45] text-[11px] py-8 px-4 border-t border-slate-300 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <div className="font-extrabold uppercase text-xs">
              ALL RIGHTS RESERVED by Justicia Latina LLC a marketing and advertising company for medical and legal field.
            </div>
            <div className="text-slate-600 mt-1">
              IAM@justicialatinaoficial.com | www.justicialatinaoficial.com
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/justicialatina"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#0F2847] text-white flex items-center justify-center hover:bg-[#5BB356] transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* Web Call In-Browser Modal */}
      <WebCallModal
        isOpen={isWebCallOpen}
        onClose={() => setIsWebCallOpen(false)}
        onLeadCaptured={onLeadCaptured}
      />
    </div>
  );
};
