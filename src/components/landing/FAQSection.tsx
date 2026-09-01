import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldAlert, Sparkles, Phone } from "lucide-react";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Pueden llamar a inmigración (ICE) o deportarme si hago un reclamo?",
      answer: "ROTUNDAMENTE NO. La ley en los Estados Unidos protege a TODOS los trabajadores sin importar su estatus migratorio. Es estrictamente ilegal que un empleador o aseguradora use tu estatus como represalia. Todo lo que hables con nosotros y con los abogados es 100% confidencial y protegido por el privilegio abogado-cliente."
    },
    {
      question: "¿Cuánto cuesta la consulta y los servicios de un abogado?",
      answer: "No pagas ABSOLUTAMENTE NADA de tu propio bolsillo. Trabajamos bajo el modelo de 'Honorarios de Contingencia' (No Win, No Fee). Esto significa que los abogados solo cobran un porcentaje acordado cuando GANAN tu caso o consiguen tu cheque de compensación. Si no se gana el caso, tú no debes ni un solo dólar."
    },
    {
      question: "¿Me pueden despedir de mi trabajo por abrir un reclamo de Workers' Comp?",
      answer: "En estados como California (Labor Code § 132a), Illinois y en casi todo el país, es un delito y una violación laboral grave que el empleador te despida, te baje de puesto o te castigue por haber reportado una lesión en el trabajo. Si lo hacen, puedes tener derecho a una demanda adicional por represalias con compensaciones aún más altas."
    },
    {
      question: "¿Quién paga mis cuentas médicas y medicamentos?",
      answer: "El seguro de compensación laboral de tu empleador o el seguro del conductor culpable tiene la obligación legal de cubrir el 100% de tus tratamientos médicos aprobados, consultas médicas, medicamentos con receta, terapias físicas y cirugías necesarias."
    },
    {
      question: "¿Qué pasa si mi supervisor no quiso reportar el accidente?",
      answer: "Muchos supervisores intentan ocultar los accidentes para no subir las primas de sus pólizas de seguro. Si tu patrón se negó a darte el formulario o no quiso enviarte a la clínica, un abogado puede notificar directamente al estado y a la aseguradora para obligarlos a abrir tu reclamo de inmediato."
    },
    {
      question: "¿Cuánto tiempo tengo para hacer mi reclamo legal?",
      answer: "El tiempo es limitado por ley (Estatuto de Limitaciones). En muchos estados, debes notificar a tu empleador dentro de los primeros 30 días de la lesión y presentar formalmente el reclamo legal antes de que venza el plazo legal. Por eso es crucial actuar lo más rápido posible."
    }
  ];

  return (
    <section className="py-16 bg-[#090e1a] border-b border-zinc-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Preguntas Frecuentes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Resolvemos tus Miedos y Dudas
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Conoce tus derechos como trabajador en Estados Unidos. La información es tu mejor defensa.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0c1220] border border-zinc-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-100 hover:text-amber-300 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 text-xs flex items-center justify-center font-mono shrink-0">
                      {idx + 1}
                    </span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 bg-zinc-900/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-amber-600/20 via-zinc-900 to-amber-600/20 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-white font-serif">¿Tienes otra pregunta sobre tu caso?</h4>
            <p className="text-xs text-zinc-400">Nuestros coordinadores legales están disponibles para orientarte gratis.</p>
          </div>
          <a
            href="tel:+18447448339"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0"
          >
            <Phone className="w-4 h-4" />
            Llamar al (844) 744-8339
          </a>
        </div>
      </div>
    </section>
  );
};
