# Chat web ⇄ Telegram · Blessed Extinction

Backend del chat de la landing (`../landingBlessedExtinction`). Es un **Cloudflare Worker** con base de datos **D1** (las dos tienen plan gratuito). La página en GitHub Pages sólo habla con este Worker; el token del bot nunca llega al navegador ni al repositorio.

```
Visitante ──HTTPS──► Worker ──HTTPS──► Telegram (grupo de la banda)
    ▲                  │  D1: mensajes cifrados (AES-GCM)
    └────HTTPS─────────┘◄──── webhook verificado ◄── la banda usa «Responder»
```

## Cómo lo usa la banda

1. El visitante escribe su nombre (sólo la primera vez) y su mensaje. En el grupo de Telegram aparece, con el encabezado en negrita:
   `🟢 #12 · Carlos · 🆕 nueva conversación · ES` y debajo el mensaje. Los siguientes mensajes de esa persona llegan como `🟢 #12 · Carlos`.
2. Cualquier integrante del grupo **mantiene pulsado el mensaje → Responder** y escribe.
3. El bot marca la respuesta con 👍 (significa que se envió) y el visitante la ve en la web firmada como **Blessed Extinction**. Con `SHOW_MEMBER_NAME = "true"` aparece como «Julio · Blessed Extinction».
4. Los mensajes que no son respuestas no salen del grupo: la banda puede hablar ahí con normalidad.

Sólo se envía texto. Cada conversación tiene **número consecutivo, nombre y un color** (🔴🟠🟡🟢🔵🟣🟤⚪, que se repiten cada 8), así varias conversaciones a la vez no se mezclan. La respuesta va siempre a la persona del mensaje que se responde, aunque en el grupo haya varios nombres iguales. El nombre se guarda cifrado, como los mensajes.

> Base creada antes de los nombres: aplicar una vez `npx wrangler d1 execute blessed-chat --remote --file=migrations/001-nombre-y-numero.sql`.

## Tienda: «Quiero que vuelva»

Cuando un producto está agotado, la página envía `POST /vote` con el producto, el color y la talla. El Worker lo guarda en la tabla `votes` y publica en el grupo:
`🗳️ Quieren que vuelva · hoodie · talla L · Votos: 7 (3 en talla L)`. Escribe **`/votos`** en el grupo para ver el ranking.

- Se acepta un voto por producto y navegador, con un máximo de 20 votos por IP y día. Sólo se aceptan identificadores cortos (`a-z0-9-`) y tallas conocidas, así que nadie puede usar el voto para mandar texto libre al grupo.
- Los votos se guardan 180 días.
- **Base creada antes de la tienda:** `npm run db:votes` (aplica `migrations/002-votos.sql`). Hazlo **antes** de desplegar el Worker nuevo: la limpieza diaria también borra los votos viejos y fallaría sin la tabla.

## Tienda: avisos de pedido por correo

Al pulsar «Pedir por correo» o «Avísame por correo», la página envía `POST /intent` (producto, color, talla, nombre legible e idioma) y el Worker publica en el grupo `🛒 Pedido de merch por correo` o `🔔 Piden aviso cuando vuelva`. Escribe **`/pedidos`** en el grupo para ver el ranking de los últimos 30 días.

- Es un aviso de intención: el pedido real es el correo que llega a Gmail.
- Mismas validaciones que los votos, más el nombre legible (sólo letras, números, espacios, `·` y guiones; si no, se muestra el identificador). 10 avisos por IP y hora, y el mismo pedido del mismo navegador no se repite en 15 minutos.
- **Base creada antes de estos avisos:** `npm run db:intents` (aplica `migrations/003-pedidos.sql`), también **antes** de desplegar.

## Seguridad

| Riesgo | Medida |
|---|---|
| Robo del token del bot | Vive como *secret* de Cloudflare. No está en el código, ni en la página ni en git. |
| Mensajes interceptados | HTTPS en todo el camino (GitHub Pages → Worker → Telegram). |
| Fuga de la base de datos | El texto se guarda cifrado con AES-256-GCM (`ENC_KEY`). El identificador del visitante se guarda como hash SHA-256. La IP no se guarda, sólo un hash para limitar abusos. |
| Webhook falso (alguien que se hace pasar por Telegram) | Telegram envía `WEBHOOK_SECRET` en un encabezado y el Worker lo comprueba. Además sólo acepta mensajes del grupo `CHAT_ID`. |
| Otra web usando tu chat | CORS: sólo responde a `ALLOWED_ORIGINS`. |
| Bots y spam | Cloudflare Turnstile al iniciar una conversación. Límites: 5 conversaciones por IP y hora, 8 mensajes cada 5 minutos, 1000 caracteres por mensaje. |
| Inyección de HTML/XSS | La web pinta los mensajes como texto, nunca como HTML. A Telegram se envían sin formato. |
| Spam de avisos de pedido (`/intent`) | 10 por IP y hora · el mismo pedido del mismo navegador no se repite en 15 min · sólo productos y tallas válidos · el nombre legible no admite enlaces ni símbolos. |
| Retención | Un cron diario borra el chat de más de 30 días, los avisos de pedido de más de 30 días y los votos de más de 180. |

> **Hay que tenerlo claro:** los chats con bots de Telegram **no tienen cifrado de extremo a extremo**. Van cifrados en tránsito, pero Telegram y quien esté en el grupo pueden leerlos. Por eso el widget le dice al visitante que no comparta contraseñas ni datos bancarios.

## Probar en local (sin bot real)

Hace falta Node.js. Abre tres terminales:

```bash
# 1) en chat-worker-blessed/ — la primera vez:
npm install
npm run db:init:local
#    crea .dev.vars (está en .gitignore) con valores de prueba:
#    BOT_TOKEN=test-token
#    WEBHOOK_SECRET=local-webhook-secret
#    TURNSTILE_SECRET=1x0000000000000000000000000000000AA   ← clave de prueba oficial de Cloudflare
#    ENC_KEY=<32 bytes en base64, ver paso 2 de abajo>
#    CHAT_ID=-100123
#    TG_API=http://127.0.0.1:8788
npm run dev        # Worker en http://127.0.0.1:8787

# 2) en chat-worker-blessed/
npm run mock       # Telegram simulado: muestra lo que llega al "grupo"

# 3) en landingBlessedExtinction/
py -m http.server 5500 --bind 127.0.0.1
```

Abre `http://127.0.0.1:5500` y escribe en el chat. Con `CHAT_API` vacío, en localhost la página usa el Worker local y la clave de prueba de Turnstile. Para responder como la banda, abre
`http://127.0.0.1:8788/reply?text=Hola desde la banda`.

Si aparece «Demasiados mensajes seguidos», es el límite de 5 conversaciones por hora y por IP. Para vaciar la base local: `npm run db:reset:local`.

---

## Configuración (una sola vez, ~20 min, sin instalar nada)

### 1. Bot de Telegram
1. En Telegram, habla con **@BotFather** → `/newbot` → elige nombre y usuario. Guarda el **token**: es una contraseña, no lo compartas.
2. Deja el *Privacy mode* activado (es lo predeterminado). Así el bot sólo ve las respuestas a sus mensajes y los comandos, no la conversación del grupo.
3. Crea un grupo, por ejemplo «Blessed Extinction · Web», y añade a la banda y al bot.

### 2. Generar dos claves aleatorias (PowerShell)
```powershell
$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
"ENC_KEY:        " + [Convert]::ToBase64String($b)
$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
"WEBHOOK_SECRET: " + (-join ($b | ForEach-Object { $_.ToString('x2') }))
```

### 3. Cloudflare (cuenta gratuita en dash.cloudflare.com)
1. **Turnstile** → *Add widget* → dominios `jhongamesrepo.github.io` y `localhost` → modo *Managed*. Anota la **Site Key** (es pública) y la **Secret Key**.
2. **Storage & Databases → D1** → *Create* → nombre `blessed-chat` → pestaña *Console* → pega el contenido de `schema.sql` → *Execute*.
3. **Workers & Pages** → *Create* → *Hello World* → nombre `blessed-chat` → *Deploy* → *Edit code* → reemplaza todo por `src/index.js` → *Deploy*.
4. En el Worker, ve a **Settings**:
   - **Bindings** → *Add* → *D1 database* → nombre de variable `DB` → base `blessed-chat`.
   - **Variables and Secrets**:
     - Tipo *Text*: `ALLOWED_ORIGINS` = `https://jhongamesrepo.github.io`, `CHAT_ID` = `0` (se cambia en el paso 5) y `SHOW_MEMBER_NAME` = `false`.
     - Tipo *Secret*: `BOT_TOKEN`, `WEBHOOK_SECRET`, `TURNSTILE_SECRET` y `ENC_KEY`.
   - **Triggers → Cron** → `17 4 * * *` (limpieza diaria).
5. Copia la URL del Worker, por ejemplo `https://blessed-chat.TU-SUBDOMINIO.workers.dev`.

### 4. Conectar Telegram con el Worker (PowerShell)
```powershell
Invoke-RestMethod -Method Post -Uri "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" -Body @{
  url = "https://blessed-chat.TU-SUBDOMINIO.workers.dev/telegram"
  secret_token = "<WEBHOOK_SECRET>"
  allowed_updates = '["message"]'
  drop_pending_updates = "true"
}
```
Debe responder `ok: True`. Después cierra la ventana de PowerShell para que el token no quede en el historial visible.

### 5. Conocer el chat_id del grupo
En el grupo escribe `/id@UsuarioDeTuBot`. El bot responde `chat_id: -100…`. Pon ese número en la variable `CHAT_ID` del Worker y guarda.

> Si Telegram convierte el grupo en supergrupo, el id cambia: repite este paso.

### 6. Activar el chat en la página
En `../landingBlessedExtinction/js/main.js`:
```js
const CHAT_API = 'https://blessed-chat.TU-SUBDOMINIO.workers.dev';
const TURNSTILE_SITEKEY = '0x4AAAA…';   // Site Key de Turnstile (pública)
```
Sube los cambios. Mientras `CHAT_API` esté vacío, el botón del chat sólo aparece al probar en local.

### 7. Probar
Abre la web, escribe un mensaje y responde desde el grupo con «Responder». En menos de 5 segundos debería aparecer en la web.

---

### Alternativa con Node.js (Wrangler)
```bash
npm install
npx wrangler login
npx wrangler d1 create blessed-chat      # pega el database_id en wrangler.toml
npm run db:init
npx wrangler secret put BOT_TOKEN        # repetir con WEBHOOK_SECRET, TURNSTILE_SECRET, ENC_KEY
npm run deploy
```
Para probar en local, crea `.dev.vars` (ya está en `.gitignore`) con los secretos.

**Nunca** subas a git el token, `ENC_KEY`, `WEBHOOK_SECRET` ni `.dev.vars`. Si el token se filtra: @BotFather → `/revoke`, cambia el *secret* y repite el paso 4.
