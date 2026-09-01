import React from "react";
import { HardHat, Car, Building2, Truck, Utensils, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface ServicesSectionProps {
  onSelectService: (type: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const practiceAreas = [
    {
      title: "Accidentes en Bodegas & Almacenes",
      badge: "Workers' Comp",
      icon: <Building2 className="w-6 h-6 text-amber-400" />,
      description: "Caídas de tarimas, lesiones de espalda por levantar peso excesivo, accidentes con montacargas (forklifts) y falta de equipo de seguridad.",
      cases: "Amazon, Walmart, FedEx, DHL, Target Warehouses"
    },
    {
      title: "Accidentes en Construcción",
      badge: "Alta Cuantía",
      icon: <HardHat className="w-6 h-6 text-amber-400" />,
      description: "Caídas de andamios, techos, zanjas, electrocuciones o golpes por maquinaria pesada y objetos en caída libre.",
      cases: "Techadores, albañiles, pintores, soldadores, electricistas"
    },
    {
      title: "Choques de Auto & Rideshare",
      badge: "Personal Injury",
      icon: <Car className="w-6 h-6 text-cyan-400" />,
      description: "Colisiones por alcance, choques laterales en intersecciones, accidentes manejando Uber/Lyft y atropellos peatonales.",
      cases: "Conductores, pasajeros, repartidores y peatones"
    },
    {
      title: "Accidentes en Restaurantes & Cocinas",
      badge: "Workers' Comp",
      icon: <Utensils className="w-6 h-6 text-amber-400" />,
      description: "Quemaduras con aceite hirviendo o vapor, resbalones en pisos mojados y cortes profundos por maquinaria de cocina.",
      cases: "Cocineros, lavaplatos, meseros y personal de limpieza"
    },
    {
      title: "Empacadoras & Fábricas de Alimentos",
      badge: "Workers' Comp",
      icon: <Truck className="w-6 h-6 text-amber-400" />,
      description: "Atrapamiento de extremidades en bandas transportadoras, congelación en cuartos fríos y lesiones articulares crónicas.",
      cases: "Empacadores, operarios de línea y cortadores de carne"
    },
    {
      title: "Lesiones por Esfuerzo Repetitivo",
      badge: "Derecho Laboral",
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      description: "Túnel carpiano, desgaste discal severo, tendinitis y dolores crónicos que se desarrollaron con los años de trabajo duro.",
      cases: "Trabajadores de limpieza, costureras, operadores y jardineros"
    }
  ];

  return (
    <section className="py-16 bg-[#070a12] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Áreas de Práctica Especializada
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            ¿En qué área sufriste tu accidente?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Contamos con una red nacional de abogados litigantes y médicos especialistas listos para defenderte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceAreas.map((area, idx) => (
            <div
              key={idx}
              className="bg-[#0e1424]/90 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/20 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {area.icon}
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-zinc-800 text-amber-300 border border-zinc-700 uppercase tracking-wider">
                    {area.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-serif">
                  {area.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {area.description}
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                  <strong className="text-zinc-300 font-semibold">Casos Frecuentes: </strong>
                  {area.cases}
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  onClick={() => onSelectService(area.badge.includes("Injury") ? "Personal_Injury" : "Workers_Comp")}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-amber-500 text-zinc-200 hover:text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Reclamar por este tipo de caso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
