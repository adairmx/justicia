import React from "react";
import { Scale, Phone, MapPin, ShieldCheck, Mail, AlertCircle } from "lucide-react";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#05070c] border-t border-zinc-800/80 pt-12 pb-24 lg:pb-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center border border-amber-400/30">
                <Scale className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white font-serif">
                JUSTICIA<span className="text-amber-400">LATINA</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Plataforma líder de orientación y conexión médico-legal para la comunidad hispana en Estados Unidos. Luchamos incansablemente por los derechos de los trabajadores lesionados en California, Illinois, Texas, Florida y en toda la unión americana.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantía de Cero Honorarios Sin Victoria</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              Líneas de Atención 24/7
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <a href="tel:+18447448339" className="hover:text-amber-300 font-bold text-zinc-200">
                  Línea Gratuita Nacional: (844) 744-8339
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a href="tel:+13129894525" className="hover:text-emerald-300 font-medium text-zinc-300">
                  Oficina Central / Chicago: (312) 989-4525
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <span>4048 W 63rd St, Chicago, IL 60629 (Atención con previa cita y vía telefónica nacional)</span>
              </li>
            </ul>
          </div>

          {/* Quick Legal Coverage */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              Cobertura Principal
            </h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li>• Workers' Compensation (California)</li>
              <li>• Workers' Compensation (Illinois)</li>
              <li>• Accidentes de Tránsito & Uber/Lyft</li>
              <li>• Caídas en Construcción</li>
              <li>• Lesiones en Bodegas y Fábricas</li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer / Bar Compliance */}
        <div className="pt-8 border-t border-zinc-900 space-y-3 text-[11px] text-zinc-500 leading-relaxed">
          <div className="flex items-start gap-2 bg-zinc-950 p-3.5 rounded-xl border border-zinc-850">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Aviso Legal y Publicitario (Disclaimer):</strong> Justicia Latina LLC opera como una empresa y servicio de publicidad y enlace médico-legal. La información provista en este sitio web no constituye asesoramiento legal formal ni crea una relación abogado-cliente. Las consultas y representaciones legales formales son provistas por abogados independientes con licencia en sus respectivas jurisdicciones (incluyendo bufetes asociados como Cheppov & Scott LLC en Illinois y abogados asociados en California). No garantizamos resultados específicos pasados en casos futuros. Si no se logra recuperación económica, el cliente no es responsable por honorarios de abogado según el contrato de contingencia suscrito.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 text-[10px]">
            <div>© {new Date().getFullYear()} Justicia Latina LLC. Todos los derechos reservados.</div>
            <div className="flex gap-4">
              <span className="hover:text-zinc-400 cursor-pointer">Política de Privacidad</span>
              <span className="hover:text-zinc-400 cursor-pointer">Términos de Uso</span>
              <span className="hover:text-zinc-400 cursor-pointer">Aviso de No Discriminación</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
