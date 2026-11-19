---
name: Recluta EN
description: Cartilla de billetes de aerolínea de los años 60 para un entrenamiento de inglés de 10 semanas.
colors:
  carrier-navy: "#16263F"
  navy-soft: "#243C5E"
  carrier-red: "#C4262E"
  signal-red-light: "#F06A70"
  active-pink: "#F2B6B9"
  pure-white: "#FFFFFF"
  white-hairline: "rgba(255,255,255,0.2)"
  white-divider: "rgba(255,255,255,0.35)"
  white-idle: "rgba(255,255,255,0.78)"
  navy-tint: "rgba(22,38,63,0.06)"
  carbon: "#3B356B"
  cool-paper: "#E9EDF2"
  cool-paper-2: "#DCE3EC"
  coupon-stock: "#FFFDF8"
  hairline-rule: "#C9C3B4"
  validated-green: "#3F6B3A"
  mission-amber: "#8A4E12"
  basic-blue: "#2E6B8A"
  ink: "#1B1B18"
  muted-ink: "#5E5B53"
typography:
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.04em"
  control:
    fontFamily: "Barlow Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.04em"
  body-sm:
    fontFamily: "Barlow Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  body-md:
    fontFamily: "Barlow Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Barlow Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  stub:
    fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.04em"
  brand:
    fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.05em"
  section:
    fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  clock:
    fontFamily: "Courier New, ui-monospace, monospace"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  prompt:
    fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  iso-sign:
    fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.05em"
  iso-clock:
    fontFamily: "Courier New, ui-monospace, monospace"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  wide-sign:
    fontFamily: "Barlow Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.05em"
  mono:
    fontFamily: "Courier New, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  none: "0px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "26px"
components:
  stub-primary:
    backgroundColor: "{colors.carrier-red}"
    textColor: "#FFFFFF"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "56px"
  button-primary:
    backgroundColor: "{colors.carrier-navy}"
    textColor: "{colors.coupon-stock}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  coupon:
    backgroundColor: "{colors.coupon-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "18px 16px 20px"
---

# Design System: Recluta EN

## Overview

**Creative North Star: "La cartilla de vuelo que se cancela, no el panel de progreso que se llena".**

Una PWA de uso diario que se comporta como la cartilla de billetes de una aerolínea de los años 60: papel de cupón, tinta de carguero azul marino y rojo oficial, cifras en carbonado violeta, reglas de un cabello, cabezas de cupón tabuladas, perforaciones y sellos girados. La metáfora no es decorativa: el itinerario de diez etapas comunica secuencia, estado y consecuencia. Completar un día cancela un talón; nada desaparece.

La densidad es de herramienta de trabajo, no de landing. Una sola Familia tipográfica condensed hace todo el peso; la jerarquía se construye con peso, caso y reglas, nunca con tamaños dispares. En celular manda la claridad táctil: objetivo mínimo de 44 px, contraste verificado y foco visible incluso sobre el navy. Se rechazaron explícitamente los anillos de progreso, la gamificación de insignias y el papel crema templado por defecto: el fondo es frío (`#E9EDF2`) para no parecer una plantilla.

**Key Characteristics:**
- Cupones con talón, perforación y sello de estado (COMPLETADO / DÍA MÍNIMO); ANULADO aparece como estado de etapas pasadas.
- Tira de color por fase y riel de siete días como único indicador de racha.
- Un tamaño de letra por bloque; el peso y las mayúsculas hacen la jerarquía.
- Tinta carbonada para cifras, rojo sólo para la acción y el estado activo.
- Sin esquinas redondeadas: cada borde es una regla impresa.

## Colors

Paleta de imprenta de billete: navy y rojo de compañía, papel frío de fondo y blanco de cupón, violeta carbonado para los datos rellenados a máquina.

### Primary
- **Carrier Red** (`#C4262E`): botón de talón «INICIAR SESIÓN», etapa en curso, sello de día mínimo y estados ANULADO. Es el único color de acción.
- **Carrier Navy** (`#16263F`): franja superior, barra de pestañas, cabezas de cupón y botones primarios.

### Secondary
- **Carbon** (`#3B356B`): cifras de los campos, relojes y conteos. La tinta carbonada simula el relleno manual del billete.
- **Validated Green** (`#3F6B3A`): sello «COMPLETADO» y barreras de inspección aprobadas.

### Tertiary
- **Mission Amber** (`#8A4E12`): fase Misión. Se oscureció desde `#B26A1E` (4,15:1) para que el texto de fase alcance contraste suficiente sobre papel; la tira decorativa conserva el mismo valor.
- **Basic Blue** (`#2E6B8A`): fase Básico.

### Neutral
- **Cool Paper** (`#E9EDF2`): fondo de la app, frío y deliberado.
- **Cool Paper 2** (`#DCE3EC`): talones y cabeceras de tabla.
- **Coupon Stock** (`#FFFDF8`): superficie de los cupones; el único papel cálido, reservado al billete.
- **Hairline Rule** (`#C9C3B4`): todas las divisiones de 1 px.
- **Ink** (`#1B1B18`): cuerpo.
- **Muted Ink** (`#5E5B53`): texto secundario; verificado sobre Cool Paper 2 (antes `#6A675E`, 4,37:1).

### Named Rules
**The Four-Leg Rule.** La tira de fase tiene exactamente cuatro valores — RECLUTA `#C4262E`, BÁSICO `#2E6B8A`, MISIÓN `#8A4E12`, DESPLIEGUE `#3F6B3A` — y se decodifica en el cupón activo. Nunca se inventa un color de fase nuevo.

**The Cold Paper Rule.** El fondo es frío. Sólo el cupón puede ser cálido; si una superficie nueva parece crema, está mal.

## Typography

**Display Font:** Barlow Condensed (con Arial Narrow / Arial como respaldo).
**Body Font:** Barlow Condensed (misma familia; una sola voz).
**Label/Mono Font:** Courier New para cifras, relojes y códigos de vuelo.

**Character:** Condensed de alta densidad, heredera de los letreros de horarios y las matrices de puntos. Comprime sin perder lectura; el mono aporta el registro de máquina de escribir para los datos.

### Hierarchy
- **Display** (700, 30 px, 1.05): títulos de página.
- **Headline** (700, 20–24 px, 1.1): frases objetivo de los taladros y título de sesión.
- **Body** (400, 15–16 px, 1.4): objetivo del vuelo y texto de procedimiento; máximo ~62 ch.
- **Label** (700, 12 px, tracking ≤0.05em, mayúsculas): códigos de cupón, fases y estados.
- **Mono** (700, 12–22 px): campos carbonados, relojes y bitácora; cifras tabulares.

### Named Rules
**The One Size Per Block Rule.** Dentro de un bloque hay un solo tamaño de letra. El peso, el caso y la regla hacen la jerarquía; no se sube el punto para destacar.

## Layout

Contenedor único `.wallet` con máximo de 760 px centrado. En celular, un cupón principal ocupa el primer viewport bajo la franja navy: cabeza tabulada, arco de diez puntos, cuatro campos carbonados, objetivo, riel de siete días y talón rojo. Debajo, modalidad, ritmo semanal y pila de cupones restantes. Barra de pestañas fija de cinco destinos con `env(safe-area-inset-bottom)`. A partir de 620 px, el talón pasa a dos columnas y el cupón gana padding. La franja superior respeta `env(safe-area-inset-top)`.

## Elevation & Depth

Sombra baja y difusa reservada al cupón y al aviso de instalación; el resto de la profundidad viene de reglas de 1 px y del contraste entre papel frío y papel de cupón. Sin halos de color ni sombras neutras en cada tarjeta.

### Shadow Vocabulary
- **Coupon lift** (`box-shadow: 0 8px 20px rgba(22,38,63,.09), 0 1px 2px rgba(22,38,63,.12)`): cupón activo.
- **Stub press** (`box-shadow: 0 4px 12px rgba(196,38,46,.22)`): talón en reposo; se acentúa al pasar el cursor.

### Named Rules
**The Printed Edge Rule.** Un borde definido es suficiente para la mayoría de los bloques. La sombra es un privilegio del cupón, no un hábito.

## Shapes

Esquinas cuadradas en todo el sistema (`border-radius: 0`). Las formas vienen de la perforación punteada del talón, del `clip-path` de la marca en la franja superior y del sello girado −11°. Las esquinas del cupón son reglas de 1 px que se cruzan como un billete impreso.

## Components

### Buttons
- **Shape:** rectángulo sin radio, borde de 1 px, mínimo 44 px de alto.
- **Stub primary:** rojo de compañía, texto blanco, 56 px, tinta «INICIAR SESIÓN» a la izquierda y meta mono a la derecha.
- **Primary:** navy con texto color cupón; al hover pasa a rojo.
- **Quiet:** borde de regla y texto atenuado, para abandonar sin registro.
- **Focus:** rojo sobre papel, blanco sobre navy; nunca rojo sobre navy (2,65:1).

### Coupon
- **Corner Style:** 0 px.
- **Background:** Coupon Stock con borde Hairline Rule.
- **Head:** tres celdas — código navy, fase flexible, secuencia mono.
- **Stripe:** 6 px del color de fase.
- **Stamp:** doble borde, girado, opacidad .85; verde para completado, rojo para mínimo/anulado.

### Fields
- **Style:** rejilla de cuatro celdas con divisiones de 1 px; etiqueta de 12 px y valor mono de 15 px en carbono.

### Day Rail
- **Style:** siete celdas de 10 px; negro = sesión completada, violeta = día mínimo, vacío = pendiente. Expuesto a lectores de pantalla como resumen textual.

### Navigation
- **Style:** barra inferior navy de 64 px con cinco iconos SVG de trazo 1.6 y etiqueta de 12 px. Activo con fondo navy-soft y trazo rosa pálido. Foco blanco.

### Inputs / Fields
- **Style:** borde navy de 1 px, fondo Coupon Stock, altura mínima 44 px, caret rojo.

## Do's and Don'ts

### Do:
- **Do** usar Barlow Condensed self-hosteada en `fonts/` y añadirla al caché del Service Worker.
- **Do** mantener targets de al menos 44 px y foco visible sobre cualquier superficie.
- **Do** derivar el estado del cupón de la evidencia guardada; una semana pasada sin pruebas se anula, no se finge completada.

### Don't:
- **Don't** usar Arial Narrow como fuente principal: no existe en Android/iOS.
- **Don't** poner rojo sobre navy ni texto secundario por debajo de 4,5:1.
- **Don't** acreditar minutos por reloj que no haya corrido: cerrar una sesión requiere tiempo real transcurrido.
- **Don't** acreditar minutos por abrir y guardar un taladro: los taladros registran aciertos y errores; los minutos los dan la sesión o un bloque iso completo.
- **Don't** introducir esquinas redondeadas, anillos de progreso ni fondo crema.

## Provenance

- Dirección elegida: cartilla de billetes de aerolínea de los años 60, elevada con tira de fase y riel de días. Semilla de dirección: `d4213e50` (modo operate, `concept-seed --kind assigned --from d4213e50`).
- Contrato de superficie: `.impeccable/surfaces/index-html.md`.
- Iconos generados con `node tools/make-icons.js` (sin dependencias; PNG RGBA, zlib/crc32 propios). Fondo navy a sangre y cupón centrado dentro del círculo seguro del 80 % para sobrevivir máscaras circulares de launcher.
  - `icon-192.png` — SHA-256 `E83DD81DC0DD4A6329000E692E7FDDD9D4EE9DF013CCF260B97B34415D8608A1`
  - `icon-512.png` — SHA-256 `C9CDAEB879F09C296A773EBE501EA78CD1B6E42558F266546B0B89975D5A3C5B`
- Fuente: Barlow Condensed (SIL Open Font License), woff2 latín embebido en `fonts/`; pesos 400/600/700.
