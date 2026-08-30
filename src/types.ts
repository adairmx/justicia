export type CaseStatus = 
  | 'NUEVO_LEAD'
  | 'EN_INTAKE_LINER'
  | 'CALIFICADO_PARA_CLOSER'
  | 'EN_LLAMADA_CLOSER'
  | 'CONTRATO_ENVIADO'
  | 'FIRMA_COMPLETADA'
  | 'EN_TRATAMIENTO_MEDICO'
  | 'DESCARTADO';

export type CaseType = 'Workers_Comp' | 'Personal_Injury';

export interface Note {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

export interface RetainerAgreement {
  documentId: string;
  status: 'SENT' | 'OPENED' | 'SIGNED';
  sentAt: string;
  openedAt: string | null;
  signedAt: string | null;
  smsUrl: string;
  contingencyFeePercentage: number;
}

export interface LegalCase {
  id: string;
  leadName: string;
  phone: string;
  email: string;
  language: 'ES' | 'EN';
  state: string;
  caseType: CaseType;
  status: CaseStatus;
  assignedLiner: string;
  assignedCloser: string | null;
  injuryDate: string;
  employer: string;
  injuryDetails: string;
  reportedToBoss: boolean;
  receivedMedicalCare: boolean;
  hasAttorney: boolean;
  estimatedCaseValue: string;
  notes: Note[];
  retainer: RetainerAgreement | null;
  createdAt: string;
}

export interface CallRecord {
  id: string;
  caseId: string;
  callerName: string;
  phoneNumber: string;
  type: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';
  agent: string;
  durationSeconds: number;
  startedAt: string;
  recordingUrl?: string;
  transcript?: string;
}

export interface ChatMessage {
  id: string;
  caseId: string;
  sender: 'CLIENT' | 'AGENT' | 'SYSTEM';
  channel: 'SMS' | 'WHATSAPP';
  text: string;
  timestamp: string;
}

export interface Stats {
  totalCallsToday: number;
  intakeQualified: number;
  closersTransferred: number;
  retainersSignedOnCall: number;
  conversionRate: string;
}
