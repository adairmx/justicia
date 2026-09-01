import React, { useState } from "react";
import { Calculator, DollarSign, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface CompensationCalculatorProps {
  onStartAssessment: (type?: string) => void;
}

export const CompensationCalculator: React.FC<CompensationCalculatorProps> = ({ onStartAssessment }) => {
  const [daysOffWork, setDaysOffWork] = useState(30);
  const [hadSurgeryOrHospital, setHadSurgeryOrHospital] = useState(true);
  const [weeklyWage, setWeeklyWage] = useState(850);
  const [injurySeverity, setInjurySeverity] = useState<"MODERATE" | "SEVERE" | "PERMANENT">("SEVERE");

  // Approximate estimation formula for Workers' Comp + Pain & Suffering
  const calculateEstimate = () => {
    const baseWageLoss = (weeklyWage * (daysOffWork / 7)) * 0.666;
    let medicalMultiplier = 1.8;
    if (hadSurgeryOrHospital) medicalMultiplier += 1.5;
    if (injurySeverity === "SEVERE") medicalMultiplier += 1.2;
    if (injurySeverity === "PERMANENT") medicalMultiplier += 2.5;

    const estimatedTotal = Math.round((baseWageLoss + 12000) * medicalMultiplier);
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
      Math.max(25000, estimatedTotal)
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#070a12] via-[#0b101d] to-[#070a12] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Herramienta Interactiva
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Calculadora de Compensación por Accidente
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2">
            Ajusta los factores de tu caso para obtener un estimado aproximado del valor de tu reclamo legal y beneficios médicos.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#0f172a]/90 border border-zinc-700/80 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders and Questions */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Sueldo Semanal Promedio
                </label>
                <span className="text-sm font-extrabold text-amber-400">${weeklyWage} USD / semana</span>
              </div>
              <input
                type="range"
                min="400"
                max="2500"
                step="50"
                value={weeklyWage}
                onChange={(e) => setWeeklyWage(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>$400/sem</span>
                <span>$1,450/sem</span>
                <span>$2,500/sem</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Días sin poder trabajar por la lesión
                </label>
                <span className="text-sm font-extrabold text-cyan-400">{daysOffWork} días</span>
              </div>
              <input
                type="range"
                min="7"
                max="180"
                step="7"
                value={daysOffWork}
                onChange={(e) => setDaysOffWork(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>1 semana</span>
                <span>3 meses</span>
                <span>6+ meses</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2">
                ¿Requirió hospitalización, cirugía o terapia intensiva?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHadSurgeryOrHospital(true)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    hadSurgeryOrHospital
                      ? "bg-amber-500/20 border-amber-400 text-amber-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  Sí (Hospital / Cirugía)
                </button>
                <button
                  type="button"
                  onClick={() => setHadSurgeryOrHospital(false)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    !hadSurgeryOrHospital
                      ? "bg-amber-500/20 border-amber-400 text-amber-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  No (Tratamiento Ambulatorio)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2">
                Gravedad del impacto o secuela
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setInjurySeverity("MODERATE")}
                  className={`py-2 px-2 rounded-lg border text-[11px] font-bold transition-all ${
                    injurySeverity === "MODERATE"
                      ? "bg-zinc-700 border-zinc-500 text-white"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  Moderada
                </button>
                <button
                  type="button"
                  onClick={() => setInjurySeverity("SEVERE")}
                  className={`py-2 px-2 rounded-lg border text-[11px] font-bold transition-all ${
                    injurySeverity === "SEVERE"
                      ? "bg-amber-500/20 border-amber-400 text-amber-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  Grave (Fractura/Disco)
                </button>
                <button
                  type="button"
                  onClick={() => setInjurySeverity("PERMANENT")}
                  className={`py-2 px-2 rounded-lg border text-[11px] font-bold transition-all ${
                    injurySeverity === "PERMANENT"
                      ? "bg-red-500/20 border-red-400 text-red-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  Secuela Permanente
                </button>
              </div>
            </div>
          </div>

          {/* Right Box: Results & CTA */}
          <div className="lg:col-span-5 bg-gradient-to-br from-zinc-900 via-[#131b2e] to-zinc-900 border border-amber-500/30 rounded-xl p-6 text-center space-y-4 shadow-xl">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Rango Estimado de Recuperación
            </div>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 font-serif tracking-tight">
              {calculateEstimate()}
            </div>
            <div className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-950/60 p-3 rounded-lg border border-zinc-800">
              *Incluye salarios caídos provisionales, cobertura de tratamientos médicos futuros y liquidación por incapacidad permanente.
            </div>

            <button
              onClick={() => onStartAssessment()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-black/30" />
              <span>Hacer Válido mi Reclamo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantía de Cero Costo de Bolsillo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
