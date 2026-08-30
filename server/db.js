import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

const INITIAL_DATA = {
  cases: [
    {
      id: "CASE-101",
      leadName: "Carlos Ramirez",
      phone: "+1 (818) 555-0192",
      email: "carlos.ramirez@example.com",
      language: "ES",
      state: "CA",
      caseType: "Workers_Comp",
      status: "EN_LLAMADA_CLOSER",
      assignedLiner: "Maria G. (Venezuela)",
      assignedCloser: "Adair (Closer/Clone)",
      injuryDate: "2026-06-14",
      employer: "Amazon Logistics Warehouse (Ontario, CA)",
      injuryDetails: "Hernia discal L4-L5 y dolor ciático severo al levantar tarima de 65 lbs.",
      reportedToBoss: true,
      receivedMedicalCare: false,
      hasAttorney: false,
      estimatedCaseValue: "$45,000 - $85,000",
      notes: [
        { id: 1, author: "Maria G. (Liner)", text: "Liner Intake: Lesión en almacén hace 2 meses. El patrón no quiso abrir reclamo de seguro. Tiene miedo de despido. Califica 100%. Pasado a Closer.", timestamp: "2026-08-30T13:45:00Z" }
      ],
      retainer: {
        documentId: "DOC-88392",
        status: "SENT", // SENT | OPENED | SIGNED
        sentAt: "2026-08-30T14:02:10Z",
        openedAt: "2026-08-30T14:03:00Z",
        signedAt: null,
        smsUrl: "https://justicia.law/sign/DOC-88392",
        contingencyFeePercentage: 15
      },
      createdAt: "2026-08-30T13:30:00Z"
    },
    {
      id: "CASE-102",
      leadName: "Guadalupe Morales",
      phone: "+1 (323) 555-0144",
      email: "guadalupe.m@example.com",
      language: "ES",
      state: "CA",
      caseType: "Workers_Comp",
      status: "CALIFICADO_PARA_CLOSER",
      assignedLiner: "Carlos V. (Venezuela)",
      assignedCloser: null,
      injuryDate: "2026-07-02",
      employer: "Fresh Produce Packaging Inc. (Vernon, CA)",
      injuryDetails: "Síndrome de túnel carpiano bilateral y tendinitis por movimiento repetitivo en banda.",
      reportedToBoss: true,
      receivedMedicalCare: true,
      hasAttorney: false,
      estimatedCaseValue: "$30,000 - $55,000",
      notes: [
        { id: 1, author: "Carlos V. (Liner)", text: "Trabajó 4 años cortando verdura. Patrón le dio solo hielo y pastillas. Requiere resonancia urgente. Lista en fila para llamada de Closer.", timestamp: "2026-08-30T14:10:00Z" }
      ],
      retainer: null,
      createdAt: "2026-08-30T14:05:00Z"
    },
    {
      id: "CASE-103",
      leadName: "Michael Johnson",
      phone: "+1 (213) 555-0188",
      email: "mjohnson99@example.com",
      language: "EN",
      state: "TX",
      caseType: "Personal_Injury",
      status: "FIRMA_COMPLETADA",
      assignedLiner: "Maria G.",
      assignedCloser: "Adair AI Clone",
      injuryDate: "2026-08-10",
      employer: "N/A - Auto Accident T-Bone collision",
      injuryDetails: "Cervical whiplash and knee trauma after delivery van collision.",
      reportedToBoss: true,
      receivedMedicalCare: true,
      hasAttorney: false,
      estimatedCaseValue: "$95,000 - $150,000",
      notes: [
        { id: 1, author: "Maria G.", text: "Intake done. Police report ready.", timestamp: "2026-08-30T11:00:00Z" },
        { id: 2, author: "Adair AI Clone", text: "In-call close executed in 6m 12s. Retainer signed via SMS on-call. Case assigned to Medical Network for MRI.", timestamp: "2026-08-30T11:15:30Z" }
      ],
      retainer: {
        documentId: "DOC-88310",
        status: "SIGNED",
        sentAt: "2026-08-30T11:08:00Z",
        openedAt: "2026-08-30T11:09:12Z",
        signedAt: "2026-08-30T11:14:45Z",
        smsUrl: "https://justicia.law/sign/DOC-88310",
        contingencyFeePercentage: 33
      },
      createdAt: "2026-08-30T10:45:00Z"
    }
  ],
  calls: [
    {
      id: "CALL-901",
      caseId: "CASE-101",
      callerName: "Carlos Ramirez",
      phoneNumber: "+1 (818) 555-0192",
      type: "TRANSFER_CLOSER",
      status: "IN_PROGRESS",
      agent: "Adair (Closer)",
      durationSeconds: 312,
      startedAt: "2026-08-30T14:00:00Z",
      transcript: "Liner Maria: Carlos, te paso con el especialista de retención... Closer Adair: Qué tal Carlos, ya leí lo de tu hernia en Amazon. No te preocupes por el patrón, en California el código laboral 132a prohíbe represalias..."
    },
    {
      id: "CALL-900",
      caseId: "CASE-103",
      callerName: "Michael Johnson",
      phoneNumber: "+1 (213) 555-0188",
      type: "INBOUND_AI_CLOSE",
      status: "COMPLETED",
      agent: "Adair AI Clone",
      durationSeconds: 435,
      startedAt: "2026-08-30T11:05:00Z",
      recordingUrl: "https://actions.google.com/sounds/v1/telephones/phone_calling.ogg",
      transcript: "AI Closer: Michael, I'm sending your representation contract right now via text. Stay on the line... Michael: Got the text! Just signed it with my finger. AI Closer: Received! Your case is officially opened."
    }
  ],
  messages: [
    {
      id: "MSG-1",
      caseId: "CASE-101",
      sender: "CLIENT",
      channel: "SMS",
      text: "Ya me llegó el mensaje pero tengo miedo de que el supervisor se entere si firmo esto hoy.",
      timestamp: "2026-08-30T14:02:40Z"
    },
    {
      id: "MSG-2",
      caseId: "CASE-101",
      sender: "AGENT",
      channel: "SMS",
      text: "Carlos, el reclamo va directo a la aseguradora estatal/privada. Tu supervisor no puede tocar tu trabajo por ley. Abre el enlace con confianza.",
      timestamp: "2026-08-30T14:03:15Z"
    }
  ],
  stats: {
    totalCallsToday: 42,
    intakeQualified: 28,
    closersTransferred: 22,
    retainersSignedOnCall: 18,
    conversionRate: "81.8%"
  }
};

export function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
    return INITIAL_DATA;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_DATA;
  }
}

export function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
