import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { WebSocketServer } from "ws";
import { getDb, saveDb, defaultCases, defaultStats } from "./db.js";
import twilioRoutes from "./twilioRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/voice", twilioRoutes);

function broadcast(type, data) {
  const payload = JSON.stringify({ type, data });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

let messagesStore = {
  "WC-8921": [
    { id: 1, channel: "WHATSAPP", sender: "CLIENT", text: "Hola, sufrí un accidente en el almacén de Amazon y mi supervisor no me quiere dar el reporte médico.", timestamp: "2026-08-30T14:02:00Z" },
    { id: 2, channel: "WHATSAPP", sender: "AI_AGENT", text: "Hola Carlos. Sentimos mucho lo ocurrido. En California la ley te protege al 100%. Te estamos conectando con un especialista legal ahora mismo.", timestamp: "2026-08-30T14:02:15Z" },
    { id: 3, channel: "SMS", sender: "AGENT", text: "Carlos, te enviamos tu contrato Retainer al celular: https://justicia.legal/sign/RET-2026-8921", timestamp: "2026-08-30T14:15:00Z" },
    { id: 4, channel: "SMS", sender: "CLIENT", text: "¡Listo! Ya lo firmé desde mi celular. ¿Qué sigue con la clínica?", timestamp: "2026-08-30T14:18:50Z" }
  ],
  "PI-4019": [
    { id: 1, channel: "WEBCHAT", sender: "CLIENT", text: "I was hit by an SUV while driving for Uber. I need legal representation.", timestamp: "2026-08-30T15:05:00Z" },
    { id: 2, channel: "WEBCHAT", sender: "AI_AGENT", text: "Hello Michael, we operate strictly on contingency (zero upfront cost). A Closer will call you right away.", timestamp: "2026-08-30T15:05:12Z" },
    { id: 3, channel: "SMS", sender: "AGENT", text: "Retainer agreement link sent: https://justicia.legal/sign/RET-2026-4019", timestamp: "2026-08-30T15:20:00Z" }
  ],
  "WC-9042": [
    { id: 1, channel: "INSTAGRAM", sender: "CLIENT", text: "Me lastimé la mano en la empacadora y tengo miedo que me corran porque no tengo papeles.", timestamp: "2026-08-30T15:50:00Z" },
    { id: 2, channel: "INSTAGRAM", sender: "AI_AGENT", text: "Guadalupe, el estatus migratorio no afecta tu derecho a compensación ni atención médica en California. Te estamos llamando.", timestamp: "2026-08-30T15:50:30Z" }
  ],
  "WC-9105": [
    { id: 1, channel: "WHATSAPP", sender: "CLIENT", text: "Hola, me caí en la plataforma de FedEx en Fontana. Necesito saber si me cubren.", timestamp: "2026-08-30T16:10:00Z" }
  ]
};

app.get("/api/cases", (req, res) => {
  const db = getDb();
  res.json(db.cases);
});

app.get("/api/cases/:id", (req, res) => {
  const db = getDb();
  const found = db.cases.find(c => c.id === req.params.id);
  if (!found) return res.status(404).json({ error: "Case not found" });
  res.json(found);
});

app.post("/api/leads", (req, res) => {
  const db = getDb();
  const {
    leadName,
    phone,
    email = "",
    caseType = "Workers_Comp",
    state = "CA",
    employer = "",
    injuryDate = new Date().toISOString().split("T")[0],
    reportedToBoss = false,
    receivedMedicalCare = false,
    hasAttorney = false,
    injuryDetails = "",
    source = "PUBLICIDAD_WEB",
    estimatedCaseValue = "$50,000"
  } = req.body;

  const prefix = caseType === "Personal_Injury" ? "PI" : "WC";
  const newLead = {
    id: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
    leadName: leadName || "Lead Web",
    phone: phone || "No proporcionado",
    email,
    language: "ES",
    caseType,
    state,
    employer: employer || "No especificado",
    injuryDate,
    reportedToBoss: Boolean(reportedToBoss),
    receivedMedicalCare: Boolean(receivedMedicalCare),
    hasAttorney: Boolean(hasAttorney),
    injuryDetails: injuryDetails || `Lead recibido desde Campaña Web (${source})`,
    estimatedCaseValue: estimatedCaseValue || "$50,000",
    status: "NUEVO_LEAD",
    assignedLiner: "Sin Asignar (Entrante)",
    assignedCloser: null,
    retainer: null,
    notes: [
      {
        id: 1,
        author: "Sistema Web / Ads",
        text: `Lead capturado desde Landing Page de Publicidad [Origen: ${source}]. Requiere llamada inmediata del Liner.`,
        timestamp: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  };

  db.cases.unshift(newLead);
  if (db.stats) {
    db.stats.totalCallsToday = (db.stats.totalCallsToday || 0) + 1;
  }
  saveDb(db);
  broadcast("NEW_CASE", newLead);
  if (db.stats) broadcast("STATS_UPDATED", db.stats);

  res.status(201).json({ success: true, caseId: newLead.id, lead: newLead });
});

app.post("/api/cases", (req, res) => {
  const db = getDb();
  const newCase = {
    id: `WC-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: "NUEVO_LEAD",
    notes: [],
    retainer: null,
    ...req.body
  };
  db.cases.unshift(newCase);
  saveDb(db);
  broadcast("NEW_CASE", newCase);
  res.status(201).json(newCase);
});

app.patch("/api/cases/:id", (req, res) => {
  const db = getDb();
  const idx = db.cases.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Case not found" });
  db.cases[idx] = { ...db.cases[idx], ...req.body };
  saveDb(db);
  broadcast("CASE_UPDATED", db.cases[idx]);
  res.json(db.cases[idx]);
});

app.get("/api/stats", (req, res) => {
  const db = getDb();
  res.json(db.stats || defaultStats);
});

app.get("/api/cases/:id/messages", (req, res) => {
  const msgs = messagesStore[req.params.id] || [];
  res.json(msgs);
});

app.post("/api/cases/:id/messages", (req, res) => {
  const { text, channel = "SMS", sender = "AGENT" } = req.body;
  if (!messagesStore[req.params.id]) {
    messagesStore[req.params.id] = [];
  }
  const newMsg = {
    id: Date.now(),
    channel,
    sender,
    text,
    timestamp: new Date().toISOString()
  };
  messagesStore[req.params.id].push(newMsg);
  broadcast("NEW_MESSAGE", { caseId: req.params.id, message: newMsg });
  res.status(201).json(newMsg);
});

app.post("/api/retainers/:caseId/send", (req, res) => {
  const db = getDb();
  const idx = db.cases.findIndex(c => c.id === req.params.caseId);
  if (idx === -1) return res.status(404).json({ error: "Case not found" });
  const retainer = {
    documentId: `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    sentAt: new Date().toISOString(),
    openedAt: null,
    signedAt: null,
    contingencyFeePercentage: 15,
    status: "SENT",
    signatureUrl: null
  };
  db.cases[idx].retainer = retainer;
  db.cases[idx].status = "CONTRATO_ENVIADO";
  saveDb(db);
  broadcast("RETAINER_UPDATED", { caseId: req.params.caseId, ...retainer });
  res.json({ success: true, retainer });
});

app.post("/api/retainers/:caseId/sign", (req, res) => {
  const db = getDb();
  const idx = db.cases.findIndex(c => c.id === req.params.caseId);
  if (idx === -1) return res.status(404).json({ error: "Case not found" });
  const { signatureDataUrl } = req.body;
  const currentRetainer = db.cases[idx].retainer || { documentId: `RET-${Date.now()}`, sentAt: new Date().toISOString(), contingencyFeePercentage: 15 };
  const updatedRetainer = { ...currentRetainer, status: "SIGNED", signedAt: new Date().toISOString(), signatureUrl: signatureDataUrl || "data:image/svg+xml;utf8,<svg>Firmado</svg>" };
  db.cases[idx].retainer = updatedRetainer;
  db.cases[idx].status = "FIRMA_COMPLETADA";
  if (db.stats) { db.stats.retainersSignedOnCall = (db.stats.retainersSignedOnCall || 0) + 1; }
  saveDb(db);
  broadcast("RETAINER_UPDATED", { caseId: req.params.caseId, ...updatedRetainer });
  broadcast("STATS_UPDATED", db.stats);
  res.json({ success: true, retainer: updatedRetainer });
});

app.post("/api/cases/:id/retainer/status-update", (req, res) => {
  const db = getDb();
  const idx = db.cases.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Case not found" });
  const { status = "SIGNED", signatureDataUrl } = req.body;
  const currentRetainer = db.cases[idx].retainer || { documentId: `RET-${Date.now()}`, sentAt: new Date().toISOString(), contingencyFeePercentage: 15 };
  const updatedRetainer = {
    ...currentRetainer,
    status,
    signedAt: status === "SIGNED" ? new Date().toISOString() : currentRetainer.signedAt,
    signatureUrl: signatureDataUrl || currentRetainer.signatureUrl || "data:image/svg+xml;utf8,<svg>Firmado</svg>"
  };
  db.cases[idx].retainer = updatedRetainer;
  if (status === "SIGNED") {
    db.cases[idx].status = "FIRMA_COMPLETADA";
    if (db.stats) { db.stats.retainersSignedOnCall = (db.stats.retainersSignedOnCall || 0) + 1; }
  }
  saveDb(db);
  broadcast("RETAINER_UPDATED", { caseId: req.params.id, ...updatedRetainer });
  broadcast("CASE_UPDATED", db.cases[idx]);
  if (db.stats) broadcast("STATS_UPDATED", db.stats);
  res.json({ success: true, retainer: updatedRetainer, case: db.cases[idx] });
});

const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

server.listen(PORT, () => {
  console.log(`JUSTICIA Server running on port ${PORT}`);
});
