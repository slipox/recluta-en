# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

HTML/CSS/JS vanilla, sin build. PWA con Service Worker y Web App Manifest. El usuario eligió esta opción explícitamente.

## Users

Usuario principal: hispanohablante adulto que quiere aprender inglés en casa usando la arquitectura de entrenamiento del ejército de EE. UU. (inmersión, taladros cronometrados, tareas de misión, evaluación por desempeño). Dispone de un celular y una computadora con Node, Python y Ollama. Situación de uso: sesiones diarias cortas (1–2 h), frecuentemente a solas, con acceso intermitente a internet.

## Product Purpose

Convertir el informe "Entrena como soldado, domina el inglés" en una aplicación instalable que guíe al usuario durante 10 semanas: plan por fases, rutinas diarias, ocho taladros, grabación de voz, bitácora, inspección semanal y rangos. El éxito es sostener la cadena de práctica diaria y ver progreso medible, no alcanzar competencia profesional en 60 horas.

## Positioning

No es otro curso de vocabulario: es una arquitectura de restricciones fabricadas —zona iso, taladros cronometrados, inspección del viernes y rangos visibles— derivada de fuentes oficiales del DLIFLC y de evidencia de recuperación espaciada. Difiere de las apps de idiomas por su foco en desempeño medible y disciplina sostenible en lugar de gamificación superficial.

## Operating Context

Uso en celular, preferentemente offline tras la primera carga. El usuario puede grabar su voz, revisar grabaciones pasadas y exportar/importar su progreso. La app debe poder instalarse como PWA desde un navegador móvil y funcionar sin conexión.

## Capabilities and Constraints

- Plan completo de 10 semanas con fases Reclutamiento, Básico, Misión y Despliegue.
- Rutinas diarias de 1 h y 2 h, además de variante de fines de semana con microsesión entre semana.
- Ocho taladros cronometrados: repetición coral, sustitución, órdenes TPR, flashcards SRS, dictado, shadowing, traducción humano-máquina y role-play de misión.
- Grabación de audio local y comparación semanal.
- Bitácora/cuadro de mando, inspección de los viernes con cinco barreras, rangos y día mínimo viable.
- Contenido del plan y de los taladros en español con frases objetivo en inglés.
- Restricción: 100 % offline después de la instalación; sin backend, sin API key, sin dependencias externas.
- Restricción: la primera versión no incluye chat con IA.

## Brand Commitments

Nombre confirmado: "Recluta EN". Voz del producto: directa, militar sin beligerancia, honesta sobre limitaciones. El usuario pidió explícitamente evitar la venta de humo sobre resultados Irrealistas.

## Evidence on Hand

Informe completo en `C:\reports\Entrenamiento militar de ingles.md` con el plan maestro, tablas de semanas, plantillas diarias, guiones de taladros, protocolo de zona iso, matriz de herramientas y sistema de medición. Apuntes de investigación en `C:\research_notes\Entrenamiento militar de ingles\`. No hay capturas ni pruebas de usuario.

## Product Principles

1. Copiar la arquitectura verificable, no el folclore.
2. Medir desempeño con evidencia grabada, no horas acumuladas.
3. Hacer que la disciplina sea sostenible: día mínimo viable y recuperación, nunca castigo.
4. Funcionar offline y conservar los datos del usuario en su dispositivo.
5. Decir la verdad sobre la escala: 60 horas automatizan supervivencia y hábito, no profesionalismo.

## Accessibility & Inclusion

Interfaz en español, compatible con teclado y lectores de pantalla, objetivos táctiles amplios para uso en celular, contraste suficiente y sin dependencia de color para transmitir estado.
