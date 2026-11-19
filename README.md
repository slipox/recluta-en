# Recluta EN

PWA instalable que convierte el plan de 10 semanas del informe *Entrena como soldado, domina el inglés* en una rutina diaria. Funciona sin conexión después de la primera carga y guarda todo en el dispositivo.

## Qué incluye

- Itinerario de 10 etapas con estado: en curso, completado, cancelado, pendiente.
- Sesiones de 1 h, 2 h y variante de fines de semana con día mínimo de 5 minutos.
- Ocho taladros con contador de aciertos y errores (los minutos los acredita el reloj de la sesión, no el taladro).
- Flashcards con repetición espaciada local (sin Anki ni cuenta externa).
- Dictado y shadowing con voz del dispositivo y grabación del micrófono.
- Seis tarjetas de role-play con complicación aleatoria.
- Bitácora, inspección del viernes con cinco barreras, rangos y copia de seguridad JSON.
- Zona iso: cartel, bloques de 30/60/120/180 minutos, regla de los 5 segundos, tarjetas de rescate y lista de contrabando.

## Verla en la PC

Desde esta carpeta:

```powershell
npx serve .
```

Abre `http://localhost:3000`. El service worker solo se registra en `localhost` o HTTPS.

## Instalarla en el celular

### Opción A: URL pública (recomendada)

Abre **https://slipox.github.io/recluta-en/** en el celular.

1. Android/Chrome: menú → **Añadir a pantalla de inicio** o el aviso **INSTALAR**.
2. iPhone/Safari: botón compartir → **Añadir a la pantalla de inicio**.
3. Carga la app una vez con internet: después funciona offline y guarda el progreso en el dispositivo.

El sitio se publica desde `main` en el repo `slipox/recluta-en` con GitHub Pages. Netlify y Cloudflare Pages también servirían la carpeta tal cual.

### Opción B: servirla desde la PC en la misma red

HTTPS es obligatorio para micrófono e instalación fuera de `localhost`. Usa un túnel, por ejemplo:

```powershell
npx localtunnel --port 3000
```

Abre la URL HTTPS resultante en el celular.

## Datos y privacidad

- El progreso vive en `localStorage` bajo la clave `recluta-en-v1`.
- Las grabaciones viven en IndexedDB (`recluta-en-media`).
- **Exporta JSON** desde Registro antes de cambiar de celular. Las grabaciones no se incluyen en la copia.
- No hay backend, telemetría, anuncios ni claves de API.

## Límites honestos

- La voz en inglés depende de los paquetes de voz del sistema. Si no se escucha el dictado, usa VOA o BBC Learning English.
- La grabación requiere HTTPS (o `localhost`) y permiso de micrófono.
- Sesenta horas automatizan supervivencia y hábito; no producen competencia profesional. El propio plan lo advierte.
- La primera versión no incluye chat con IA. El "sargento" con Ollama queda como siguiente paso opcional.

## Archivos

| Archivo | Función |
|---|---|
| `index.html` | Estructura de las seis vistas |
| `styles.css` | Sistema visual de cartilla de billetes |
| `data.js` | Plan, taladros, tarjetas y guiones |
| `app.js` | Estado, temporizadores, SRS, grabación e inspección |
| `sw.js` | Caché offline |
| `manifest.webmanifest` | Instalación como PWA |
| `tools/make-icons.js` | Regenera los iconos PNG |
