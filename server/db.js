import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "data.json");

export const defaultCases = [
  {
    id: "WC-8921",
    leadName: "Carlos Ramirez",
    phone: "+1 (818) 555-0192",
    email: "carlos.ramirez@example.com",
    language: "ES",
    caseType: "Workers_Comp",
    state: "CA",
    employer: "Amazon Logistics Warehouse (San Bernardino)",
    injuryDate: "2026-08-14",
    reportedToBoss: true,
    receivedMedicalCare: false,
    hasAttorney: false,
    injuryDetails: "Lesión lumbar severa (L4-L5) levantando tarima de 65 lbs en turno nocturno. Supervisor negó reporte de accidente DWC-1.",
    estimatedCaseValue: "$65,000",
    status: "FIRMA_COMPLETADA",
    assignedLiner: "Maria G. (Liner)",
    assignedCloser: "Adair (Master Closer)",
    retainer: {
      documentId: "RET-2026-8921",
      sentAt: "2026-08-30T14:15:00Z",
      openedAt: "2026-08-30T14:16:30Z",
      signedAt: "2026-08-30T14:18:45Z",
      contingencyFeePercentage: 15,
      status: "SIGNED",
      signatureUrl: "data:image/svg+xml;utf8,<svg>Carlos Ramirez</svg>"
    },
    notes: [
      { id: 1, author: "Maria G. (Liner)", text: "Intake calificado: Sin abogado previo, lesión en horario laboral hace 16 días.", timestamp: "2026-08-30T14:10:00Z" },
      { id: 2, author: "Adair (Closer)", text: "Explicado Código CA § 132a anti-despido. Cliente firmó Retainer en llamada.", timestamp: "2026-08-30T14:18:45Z" }
    ],
    createdAt: "2026-08-30T14:05:00Z"
  },
  {
    id: "PI-4019",
    leadName: "Michael Johnson",
    phone: "+1 (213) 555-0188",
    email: "mjohnson@example.com",
    language: "EN",
    caseType: "Personal_Injury",
    state: "CA",
    employer: "Freelance / Rideshare Driver",
    injuryDate: "2026-08-22",
    reportedToBoss: true,
    receivedMedicalCare: true,
    hasAttorney: false,
    injuryDetails: "Choque en T (T-Bone collision) en intersección en Los Angeles. Esguince cervical y fractura de muñeca.",
    estimatedCaseValue: "$120,000",
    status: "FIRMA_COMPLETADA",
    assignedLiner: "Carlos V. (Liner)",
    assignedCloser: "Adair AI Clone (Hermes 3)",
    retainer: {
      documentId: "RET-2026-4019",
      sentAt: "2026-08-30T15:20:00Z",
      openedAt: "2026-08-30T15:21:00Z",
      signedAt: "2026-08-30T15:23:12Z",
      contingencyFeePercentage: 15,
      status: "SIGNED",
      signatureUrl: "data:image/svg+xml;utf8,<svg>Michael Johnson</svg>"
    },
    notes: [
      { id: 1, author: "Carlos V. (Liner)", text: "Reporte policial disponible, contraparte 100% culpable.", timestamp: "2026-08-30T15:15:00Z" },
      { id: 2, author: "Adair AI Clone", text: "Retainer enviado vía SMS y firmado electrónicamente en 3 minutos.", timestamp: "2026-08-30T15:23:12Z" }
    ],
    createdAt: "2026-08-30T15:10:00Z"
  },
  {
    id: "WC-9042",
    leadName: "Guadalupe Morales",
    phone: "+1 (619) 555-0144",
    email: "gmorales@example.com",
    language: "ES",
    caseType: "Workers_Comp",
    state: "CA",
    employer: "Fresh Produce Packaging Inc. (Vernon, CA)",
    injuryDate: "2026-08-28",
    reportedToBoss: true,
    receivedMedicalCare: false,
    hasAttorney: false,
    injuryDetails: "Atrapamiento de mano derecha en banda transportadora de empaque. Laceración profunda y trauma articular.",
    estimatedCaseValue: "$85,000",
    status: "CALIFICADO_PARA_CLOSER",
    assignedLiner: "Maria G. (Liner)",
    assignedCloser: "Adair (Master Closer)",
    retainer: null,
    notes: [
      { id: 1, author: "Maria G. (Liner)", text: "La empresa no quiso llevarla a la clínica. Muy preocupada por costos.", timestamp: "2026-08-30T16:00:00Z" }
    ],
    createdAt: "2026-08-30T15:55:00Z"
  },
  {
    id: "WC-9105",
    leadName: "Roberto Sanchez",
    phone: "+1 (909) 555-0177",
    email: "rsanchez@example.com",
    language: "ES",
    caseType: "Workers_Comp",
    state: "CA",
    employer: "FedEx Ground Distribution (Fontana)",
    injuryDate: "2026-08-29",
    reportedToBoss: true,
    receivedMedicalCare: true,
    hasAttorney: false,
    injuryDetails: "Caída desde plataforma de carga (altura 4 pies). Lesión en menisco de rodilla izquierda.",
    estimatedCaseValue: "$55,000",
    status: "CONTRATO_ENVIADO",
    assignedLiner: "Carlos V. (Liner)",
    assignedCloser: "Adair (Master Closer)",
    retainer: {
      documentId: "RET-2026-9105",
      sentAt: "2026-08-30T16:20:00Z",
      openedAt: "2026-08-30T16:22:00Z",
      signedAt: null,
      contingencyFeePercentage: 15,
      status: "OPENED",
      signatureUrl: null
    },
    notes: [
      { id: 1, author: "Carlos V. (Liner)", text: "Intake completo. Retainer SMS enviado mientras habla con Closer.", timestamp: "2026-08-30T16:18:00Z" }
    ],
    createdAt: "2026-08-30T16:15:00Z"
  }
];

export const defaultStats = {
  totalCallsToday: 76,
  intakeQualified: 42,
  closersTransferred: 33,
  retainersSignedOnCall: 19,
  conversionRate: "25.0%"
};

export function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    const data = { cases: defaultCases, stats: defaultStats, callLogs: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
  try {
    const content = fs.readFileSync(DB_FILE, "utf8");
    const data = JSON.parse(content);
    if (!data.cases || data.cases.length === 0) {
      data.cases = defaultCases;
      data.stats = defaultStats;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    }
    return data;
  } catch (err) {
    const data = { cases: defaultCases, stats: defaultStats, callLogs: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
}

export function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}
