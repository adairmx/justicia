import React from "react";
import { Star, Award, Users, CheckCircle, ShieldCheck, HeartHandshake } from "lucide-react";

export const TrustProofSection: React.FC = () => {
  const settlements = [
    {
      amount: "$1,450,000",
      type: "Accidente en Construcción (Caída de Andamio)",
      state: "California",
      detail: "Cirugía de columna vertebral y recuperación total de sueldos perdidos para un trabajador hispano de 42 años."
    },
    {
      amount: "$875,000",
      type: "Accidente de Auto (Colisión por Camión Comercial)",
      state: "Illinois",
      detail: "Compensación máxima para una familia impactada por chofer de tráiler con cobertura aseguradora comercial."
    },
    {
      amount: "$420,000",
      type: "Accidente en Bodega / Montacargas",
      state: "California",
      detail: "Lesión de pie y tobillo en almacén logístico. El patrón se negaba inicialmente a pagar el tiempo de reposo."
    },
    {
      amount: "$290,000",
      type: "Quemadura en Cocina de Restaurante",
      state: "Texas",
      detail: "Quemaduras de 2do y 3er grado por falla en freidora industrial sin mantenimiento preventivo."
    }
  ];

  const testimonials = [
    {
      name: "Guadalupe M.",
      location: "Los Angeles, CA",
      stars: 5,
      text: "Tenía mucho miedo de reclamar porque no tengo papeles y mi patrón me amenazó con despedirme. En Justicia Latina me hablaron en español, me protegieron y consiguieron una indemnización que le cambió la vida a mis hijos."
    },
    {
      name: "Roberto S.",
      location: "Chicago, IL",
      stars: 5,
      text: "Me caí en el trabajo y la clínica de la empresa me dio de alta a los 2 días con dolor fuertísimo. Gracias al equipo me mandaron con especialistas de verdad y me pagaron todos mis cheques caídos."
    },
    {
      name: "Carlos R.",
      location: "San Bernardino, CA",
      stars: 5,
      text: "Excelente servicio. No me cobraron nada por adelantado y me consiguieron más de $65,000 por mi lesión en la espalda. Los recomiendo al 100% a toda la comunidad latina."
    }
  ];

  return (
    <section className="py-16 bg-[#070a12] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Settlements Showcase */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            Resultados Reales Obtenidos
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Compensaciones Ganadas para Nuestros Clientes
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            No aceptes la primera oferta baja de la aseguradora. Peleamos por el valor máximo que te corresponde.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {settlements.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border border-amber-500/25 rounded-2xl p-5 shadow-lg relative overflow-hidden"
            >
              <div className="text-3xl font-black text-amber-400 font-serif tracking-tight mb-2">
                {item.amount}
              </div>
              <div className="text-xs font-bold text-white mb-1">{item.type}</div>
              <div className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider mb-2">
                {item.state}
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-2">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            Historias de Éxito de Nuestra Comunidad
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="bg-[#0e1424] border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                  "{test.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/30">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{test.name}</div>
                  <div className="text-[11px] text-zinc-500">{test.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
