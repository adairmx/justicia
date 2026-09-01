import React, { useState } from "react";
import { LandingNavbar } from "./LandingNavbar";
import { HeroSection } from "./HeroSection";
import { ServicesSection } from "./ServicesSection";
import { CompensationCalculator } from "./CompensationCalculator";
import { FAQSection } from "./FAQSection";
import { TrustProofSection } from "./TrustProofSection";
import { FloatingContactBar } from "./FloatingContactBar";
import { LandingFooter } from "./LandingFooter";
import { CaseAssessmentModal } from "./CaseAssessmentModal";
import { WebCallModal } from "./WebCallModal";

interface LandingPageProps {
  onOpenCRM: () => void;
  onLeadCaptured?: (lead: any) => void;
  callMode?: "NATIVE_PHONE" | "WEB_CALL";
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenCRM,
  onLeadCaptured,
  callMode = "NATIVE_PHONE"
}) => {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isWebCallOpen, setIsWebCallOpen] = useState(false);
  const [initialCaseType, setInitialCaseType] = useState<string>("Workers_Comp");

  const handleOpenAssessment = (type: string = "Workers_Comp") => {
    setInitialCaseType(type);
    setIsAssessmentOpen(true);
  };

  const handleLeadSubmit = async (leadData: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData)
      });
      const data = await res.json();
      if (data.success) {
        if (onLeadCaptured) onLeadCaptured(data.lead);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error al enviar lead:", err);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Top Navbar */}
      <LandingNavbar
        onOpenConsultation={() => handleOpenAssessment("Workers_Comp")}
        onOpenCRM={onOpenCRM}
        callMode={callMode}
        onTriggerCall={() => setIsWebCallOpen(true)}
      />

      {/* Main Landing Flow */}
      <main className="flex-1">
        {/* 1. Hero Section with Direct Conversion Form */}
        <HeroSection
          onStartAssessment={handleOpenAssessment}
          onQuickLeadSubmit={handleLeadSubmit}
        />

        {/* 2. Real Results & Social Proof */}
        <TrustProofSection />

        {/* 3. Interactive Compensation Calculator */}
        <CompensationCalculator onStartAssessment={handleOpenAssessment} />

        {/* 4. Specialized Practice Areas */}
        <ServicesSection onSelectService={handleOpenAssessment} />

        {/* 5. FAQs & Immigration/Legal Objections */}
        <FAQSection />
      </main>

      {/* Persistent Floating Bar for Mobile Devices */}
      <FloatingContactBar
        onOpenConsultation={() => handleOpenAssessment("Workers_Comp")}
        callMode={callMode}
        onTriggerCall={() => setIsWebCallOpen(true)}
      />

      {/* Multi-step Guided Assessment Modal */}
      <CaseAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onSubmitLead={handleLeadSubmit}
        initialCaseType={initialCaseType}
      />

      {/* Web Call In-Browser Modal */}
      <WebCallModal
        isOpen={isWebCallOpen}
        onClose={() => setIsWebCallOpen(false)}
        onLeadCaptured={onLeadCaptured}
      />

      {/* Compliance Footer */}
      <LandingFooter />
    </div>
  );
};
