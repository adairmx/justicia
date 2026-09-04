import express from "express";
import twilio from "twilio";

const router = express.Router();

// Helper to get twilio client or mock
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (accountSid && authToken && !accountSid.startsWith("ACXXXX")) {
    return twilio(accountSid, authToken);
  }
  return null;
};

// In-memory active calls for live monitoring
export let activeLiveCalls = [
  {
    callSid: "CA-demo-live-101",
    agentName: "Maria G. (Liner)",
    clientName: "Juan Delgado",
    clientPhone: "+1 (312) 555-4821",
    caseType: "Workers_Comp (Caída en Construcción)",
    startedAt: new Date(Date.now() - 140000).toISOString(),
    durationSeconds: 140,
    status: "IN_PROGRESS",
    conferenceRoom: "conf-live-101",
    supervisorListening: false,
    supervisorWhispering: false,
    retainerSent: true,
    retainerSigned: false
  },
  {
    callSid: "CA-demo-live-102",
    agentName: "Carlos V. (Closer)",
    clientName: "Rosa Mendoza",
    clientPhone: "+1 (773) 555-8930",
    caseType: "Personal_Injury (Choque Trasero)",
    startedAt: new Date(Date.now() - 320000).toISOString(),
    durationSeconds: 320,
    status: "IN_PROGRESS",
    conferenceRoom: "conf-live-102",
    supervisorListening: true,
    supervisorWhispering: false,
    retainerSent: true,
    retainerSigned: true
  }
];

// 1. Generate Capability Token for Browser Softphone WebRTC
router.get("/token", (req, res) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiSecret = process.env.TWILIO_API_SECRET;
  const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;
  const identity = req.query.identity || `agent_${Math.floor(Math.random() * 1000)}`;

  if (accountSid && apiKey && apiSecret && twimlAppSid && !accountSid.startsWith("ACXXXX")) {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    });

    const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
    token.addGrant(voiceGrant);

    return res.json({ token: token.toJwt(), identity, isLiveTwilio: true });
  }

  // Fallback demo token for immediate local testing
  res.json({
    token: "MOCK_TWILIO_VOIP_TOKEN_READY",
    identity,
    isLiveTwilio: false,
    message: "Twilio simulado listo. Al ingresar tus llaves en .env conectará automáticamente con la red telefónica real de EE.UU."
  });
});

// 2. Incoming Call Webhook (TwiML) - Rings Agents in Browser / Softphone
router.post("/incoming", (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  const callerNumber = req.body.From || "Desconocido";
  const callSid = req.body.CallSid || `CA-${Date.now()}`;
  const roomName = `room-${callSid}`;

  // Log to active calls
  activeLiveCalls.unshift({
    callSid,
    agentName: "Agente Asignado (Liner)",
    clientName: "Cliente Entrante",
    clientPhone: callerNumber,
    caseType: "Intake General",
    startedAt: new Date().toISOString(),
    durationSeconds: 0,
    status: "IN_PROGRESS",
    conferenceRoom: roomName,
    supervisorListening: false,
    supervisorWhispering: false,
    retainerSent: false,
    retainerSigned: false
  });

  const dial = response.dial();
  dial.conference({
    startConferenceOnEnter: true,
    endConferenceOnExit: true,
    waitUrl: "https://twimlets.com/holdmusic?Bucket=com.twilio.music.classical"
  }, roomName);

  res.type("text/xml");
  res.send(response.toString());
});

// 3. Seamless Call Transfer (Liner to Closer)
router.post("/transfer", (req, res) => {
  const { callSid, targetRole = "CLOSER", note = "" } = req.body;
  const call = activeLiveCalls.find(c => c.callSid === callSid);

  if (call) {
    call.agentName = targetRole === "CLOSER" ? "Adair (Closer)" : "Maria G. (Liner)";
    call.transferNote = note;
  }

  res.json({
    success: true,
    message: `Llamada transferida exitosamente a ${targetRole} sin cortar la comunicación.`,
    call
  });
});

// 4. Live Calls List for Supervisor
router.get("/active-calls", (req, res) => {
  res.json(activeLiveCalls);
});

// 5. Supervisor Shadow Mode: Listen-In (Escuchar en silencio)
router.post("/shadow/listen", (req, res) => {
  const { callSid, supervisorName = "José (Supervisor)" } = req.body;
  const call = activeLiveCalls.find(c => c.callSid === callSid);

  if (call) {
    call.supervisorListening = true;
    call.supervisorWhispering = false;
  }

  // TwiML response for supervisor joining conference in muted mode:
  // <Response><Dial><Conference muted="true" beep="false">roomName</Conference></Dial></Response>
  res.json({
    success: true,
    mode: "LISTEN_MUTED",
    message: `Supervisor ${supervisorName} conectado en Modo Sombra (silencioso). Ni el agente ni el cliente perciben la presencia.`,
    conferenceRoom: call ? call.conferenceRoom : null
  });
});

// 6. Supervisor Shadow Mode: Whisper (Susurrar solo al agente)
router.post("/shadow/whisper", (req, res) => {
  const { callSid, supervisorName = "José (Supervisor)" } = req.body;
  const call = activeLiveCalls.find(c => c.callSid === callSid);

  if (call) {
    call.supervisorListening = true;
    call.supervisorWhispering = true;
  }

  res.json({
    success: true,
    mode: "WHISPER_COACHING",
    message: `Modo Susurro activado. El supervisor ${supervisorName} puede hablarle directamente a la diadema del agente sin que el cliente escuche nada.`,
    conferenceRoom: call ? call.conferenceRoom : null
  });
});

// 7. Supervisor Leave Shadow Mode
router.post("/shadow/leave", (req, res) => {
  const { callSid } = req.body;
  const call = activeLiveCalls.find(c => c.callSid === callSid);

  if (call) {
    call.supervisorListening = false;
    call.supervisorWhispering = false;
  }

  res.json({
    success: true,
    message: "Supervisor desconectado del canal de monitoreo."
  });
});

export default router;
