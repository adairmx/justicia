# Guía de Conexión Twilio: Pruebas Telefónicas en Vivo

Esta guía contiene los pasos exactos para que José (o tú) configuren una cuenta propia de Twilio y puedan probar llamadas entrantes y salientes en tiempo real desde la plataforma **JUSTICIA Legal OS**.

---

## 1. Crear Cuenta y Obtener Saldo de Prueba

1. Ve a [twilio.com](https://www.twilio.com) y regístrate con tu correo o el de José.
2. Twilio otorga automáticamente **$15 USD de saldo de prueba gratis** para llamadas y SMS.
3. Verifica el correo y un número de celular de prueba (el tuyo o el de José).

---

## 2. Comprar un Número Telefónico de EE.UU. ($1.15 USD)

1. En la consola de Twilio, ve a **Phone Numbers > Manage > Buy a number**.
2. Selecciona **Country: United States (+1)**.
3. En **Area Code**, puedes elegir el de Chicago (`312` o `773`) o California (`213` o `818`).
4. Asegúrate de que tenga palomita en:
   - ✅ **Voice** (Llamadas)
   - ✅ **SMS** (Mensajes de texto)
5. Haz clic en **Buy** ($1.15 USD/mes que se descuentan del saldo de prueba).

---

## 3. Obtener las Credenciales para el Sistema

En el panel principal (**Twilio Console Dashboard**):

1. Copia tu **Account SID** (empieza con `AC...`).
2. Copia tu **Auth Token** (haz clic en *View*).
3. Tu **Twilio Phone Number** (el número que compraste en el paso 2).

---

## 4. Crear el TwiML App (Para llamadas por navegador WebRTC)

Para que los agentes puedan hablar usando la diadema desde la computadora sin celular físico:

1. Ve a **Voice > Manage > TwiML Apps > Create new TwiML App**.
2. **Friendly Name**: `Justicia Call Center App`.
3. **Voice Request URL**: `https://tu-dominio-o-ngrok/api/voice/incoming` (Método: `HTTP POST`).
4. Guarda los cambios y copia el **Application SID** (empieza con `AP...`).

---

## 5. Configurar el archivo `.env` en el Proyecto

Crea o edita el archivo `.env` en la raíz de `c:\Users\Adair\Justicia`:

```env
# Twilio Credentials de José
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_TWIML_APP_SID=APXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_PHONE_NUMBER=+13125550199

# Puerto del Servidor
PORT=3001
```

---

## 6. Probar en Vivo

1. Inicia el servidor con:
   ```bash
   npm run server
   ```
2. Desde la pestaña **Llamadas en Vivo**:
   - Verás todas las llamadas que entran o salen.
   - Presiona **"Escuchar (Modo Sombra)"** para escuchar en silencio total desde la compu de José.
   - Presiona **"Susurrar al Agente"** para hablarle a la diadema al agente sin que el cliente escuche.
3. Desde el **Softphone** del agente:
   - Cualquier rol puede presionar **"Retainer SMS"** en cualquier segundo de la llamada para disparar el contrato de representación al celular del cliente y cerrarlo en caliente.
