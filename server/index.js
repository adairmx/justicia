import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import twilio from 'twilio';
import { getDb, saveDb } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve built frontend assets in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

const PORT = process.env.PORT || 3001;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'AC_MOCK_TWILIO_ACCOUNT_SID';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'mock_twilio_auth_token';
const TWILIO_API_KEY = process.env.TWILIO_API_KEY || 'SK_MOCK_TWILIO_API_KEY';
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET || 'mock_twilio_api_secret';
const TWILIO_TWIML_APP_SID = process.env.TWILIO_TWIML_APP_SID || 'AP_MOCK_TWIML_APP_SID';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+18005555878';

// Broadcast helper for real-time WebSockets
function broadcast(event, payload) {
  const message = JSON.stringify({ event, payload });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  console.log('[WS] Client connected to Justicia Live Engine');
  ws.send(JSON.stringify({ event: 'CONNECTED', payload: { time: new Date().toISOString() } }));
});

// --- TWILIO VOICE WEBRTC TOKEN ---
app.get('/api/twilio/token', (req, res) => {
  const identity = req.query.identity || 'agent_venezuela_1';
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET) {
      const AccessToken = twilio.jwt.AccessToken;
      const VoiceGrant = AccessToken.VoiceGrant;
      
      const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: TWILIO_TWIML_APP_SID,
        incomingAllow: true,
      });

      const token = new AccessToken(
        TWILIO_ACCOUNT_SID,
        TWILIO_API_KEY,
        TWILIO_API_SECRET,
        { identity }
      );
      token.addGrant(voiceGrant);
      return res.json({ token: token.toJwt(), identity });
    }
    
    // Dev mock token mode if credentials not yet configured
    res.json({
      token: `mock_jwt_token_for_${identity}`,
      identity,
      isMock: true,
      message: 'Running in WebRTC Simulation Mode. Configure .env with Twilio credentials for live SIP carrier lines.'
    });
  } catch (err) {
    console.error('Error generating Twilio token:', err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// --- TWIML VOICE WEBHOOK ---
app.post('/api/twilio/voice', (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  const to = req.body.To;

  if (to) {
    const dial = twiml.dial({
      callerId: TWILIO_PHONE_NUMBER,
      record: 'record-from-answer',
      recordingStatusCallback: '/api/twilio/recording-callback'
    });
    if (to.startsWith('client:')) {
      dial.client(to.replace('client:', ''));
    } else {
      dial.number(to);
    }
  } else {
    twiml.say({ language: 'es-MX' }, 'Bienvenido a Justicia. Conectando con un especialista en compensación laboral.');
    const dial = twiml.dial();
    dial.client('closer_queue');
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// --- CASES API ---
app.get('/api/cases', (req, res) => {
  const db = getDb();
  res.json(db.cases);
});

app.post('/api/cases', (req, res) => {
  const db = getDb();
  const newCase = {
    id: `CASE-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString(),
    status: 'NUEVO_LEAD',
    notes: [],
    retainer: null,
    ...req.body
  };
  db.cases.unshift(newCase);
  saveDb(db);
  broadcast('CASE_CREATED', newCase);
  res.status(201).json(newCase);
});

app.put('/api/cases/:id', (req, res) => {
  const db = getDb();
  const index = db.cases.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Case not found' });

  db.cases[index] = { ...db.cases[index], ...req.body };
  saveDb(db);
  broadcast('CASE_UPDATED', db.cases[index]);
  res.json(db.cases[index]);
});

// --- LINER TO CLOSER WARM TRANSFER ---
app.post('/api/cases/:id/transfer-to-closer', (req, res) => {
  const db = getDb();
  const caseItem = db.cases.find(c => c.id === req.params.id);
  if (!caseItem) return res.status(404).json({ error: 'Case not found' });

  const { closerName, linerNotes } = req.body;
  caseItem.status = 'EN_LLAMADA_CLOSER';
  caseItem.assignedCloser = closerName || 'Adair (Closer/Clone)';
  
  if (linerNotes) {
    caseItem.notes.push({
      id: Date.now(),
      author: req.body.assignedLiner || 'Liner Operator',
      text: `[WARM TRANSFER] ${linerNotes}`,
      timestamp: new Date().toISOString()
    });
  }

  saveDb(db);
  broadcast('WARM_TRANSFER_TRIGGERED', {
    caseId: caseItem.id,
    leadName: caseItem.leadName,
    closer: caseItem.assignedCloser,
    phone: caseItem.phone,
    notes: linerNotes
  });

  res.json({ success: true, case: caseItem });
});

// --- RETAINER CONTRACT DISPATCH (SMS) & LIVE SIGNING VERIFICATION ---
app.post('/api/cases/:id/retainer/send', (req, res) => {
  const db = getDb();
  const caseItem = db.cases.find(c => c.id === req.params.id);
  if (!caseItem) return res.status(404).json({ error: 'Case not found' });

  const docId = `DOC-${Math.floor(10000 + Math.random() * 90000)}`;
  const signUrl = `https://justicia.law/sign/${docId}?lead=${encodeURIComponent(caseItem.leadName)}`;

  caseItem.retainer = {
    documentId: docId,
    status: 'SENT',
    sentAt: new Date().toISOString(),
    openedAt: null,
    signedAt: null,
    smsUrl: signUrl,
    contingencyFeePercentage: req.body.contingencyFeePercentage || 15
  };
  caseItem.status = 'CONTRATO_ENVIADO';

  db.messages.push({
    id: `MSG-${Date.now()}`,
    caseId: caseItem.id,
    sender: 'SYSTEM',
    channel: 'SMS',
    text: `📄 [CONTRATO DE REPRESENTACIÓN ENVIADO] Estimado ${caseItem.leadName}, favor de abrir y firmar aquí: ${signUrl}`,
    timestamp: new Date().toISOString()
  });

  saveDb(db);
  broadcast('RETAINER_STATUS_CHANGED', {
    caseId: caseItem.id,
    retainer: caseItem.retainer,
    leadName: caseItem.leadName
  });

  res.json({ success: true, retainer: caseItem.retainer });
});

app.post('/api/cases/:id/retainer/status-update', (req, res) => {
  const db = getDb();
  const caseItem = db.cases.find(c => c.id === req.params.id);
  if (!caseItem || !caseItem.retainer) return res.status(404).json({ error: 'Retainer not found for this case' });

  const { status } = req.body;
  caseItem.retainer.status = status;

  if (status === 'OPENED' && !caseItem.retainer.openedAt) {
    caseItem.retainer.openedAt = new Date().toISOString();
  } else if (status === 'SIGNED') {
    caseItem.retainer.signedAt = new Date().toISOString();
    caseItem.status = 'FIRMA_COMPLETADA';
    db.stats.retainersSignedOnCall += 1;
    
    caseItem.notes.push({
      id: Date.now(),
      author: 'SYSTEM (SignNow/DocuSign Hook)',
      text: `✅ Contrato de representación Retainer firmado en vivo por el cliente vía SMS. Caso formalizado.`,
      timestamp: new Date().toISOString()
    });
  }

  saveDb(db);
  broadcast('RETAINER_STATUS_CHANGED', {
    caseId: caseItem.id,
    retainer: caseItem.retainer,
    leadName: caseItem.leadName
  });

  res.json({ success: true, retainer: caseItem.retainer });
});

// --- MESSAGES & CHAT ---
app.get('/api/cases/:id/messages', (req, res) => {
  const db = getDb();
  const list = db.messages.filter(m => m.caseId === req.params.id);
  res.json(list);
});

app.post('/api/cases/:id/messages', (req, res) => {
  const db = getDb();
  const newMsg = {
    id: `MSG-${Date.now()}`,
    caseId: req.params.id,
    sender: req.body.sender || 'AGENT',
    channel: req.body.channel || 'SMS',
    text: req.body.text,
    timestamp: new Date().toISOString()
  };
  db.messages.push(newMsg);
  saveDb(db);
  broadcast('NEW_MESSAGE', newMsg);
  res.status(201).json(newMsg);
});

// --- CALLS & AUDIO ---
app.get('/api/calls', (req, res) => {
  const db = getDb();
  res.json(db.calls);
});

app.post('/api/calls/log', (req, res) => {
  const db = getDb();
  const newCall = {
    id: `CALL-${Date.now().toString().slice(-4)}`,
    startedAt: new Date().toISOString(),
    status: 'IN_PROGRESS',
    ...req.body
  };
  db.calls.unshift(newCall);
  saveDb(db);
  broadcast('CALL_LOGGED', newCall);
  res.status(201).json(newCall);
});

// --- STATS ---
app.get('/api/stats', (req, res) => {
  const db = getDb();
  res.json(db.stats);
});

// --- AI HOOKS ---
app.post('/api/ai/intake-webhook', (req, res) => {
  const db = getDb();
  const { callerPhone, leadName, injuryDetails, employer, injuryDate } = req.body;

  const newCase = {
    id: `CASE-${Date.now().toString().slice(-4)}`,
    leadName: leadName || 'Prospecto WebRTC/Twilio',
    phone: callerPhone || '+1 (000) 000-0000',
    email: '',
    language: 'ES',
    state: 'CA',
    caseType: 'Workers_Comp',
    status: 'CALIFICADO_PARA_CLOSER',
    assignedLiner: 'AI Intake Bot (Vapi/Retell)',
    assignedCloser: 'Adair AI Clone',
    injuryDate: injuryDate || new Date().toISOString().split('T')[0],
    employer: employer || 'No especificado',
    injuryDetails: injuryDetails || 'Calificado automáticamente por Agente de Voz IA',
    reportedToBoss: true,
    receivedMedicalCare: false,
    hasAttorney: false,
    estimatedCaseValue: '$40,000 - $80,000',
    notes: [
      {
        id: Date.now(),
        author: 'AI Intake Engine',
        text: `Intake completado en llamada de voz por IA. Lead calificado con alta probabilidad. Transferido a Closer Queue.`,
        timestamp: new Date().toISOString()
      }
    ],
    retainer: null,
    createdAt: new Date().toISOString()
  };

  db.cases.unshift(newCase);
  saveDb(db);
  broadcast('AI_LEAD_QUALIFIED', newCase);

  res.json({
    status: 'QUALIFIED',
    caseId: newCase.id,
    nextAction: 'TRANSFER_TO_CLOSER_CLONE',
    instructions: 'Transfer call to Adair AI Clone with in-call Retainer agreement dispatch.'
  });
});

// Fallback SPA routing for frontend in production
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`⚖️ JUSTICIA CRM Backend Engine running on port ${PORT}`);
});
