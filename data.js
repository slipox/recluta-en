/* Recluta EN — contenido del plan. Datos estáticos, sin dependencias. */
window.RECLUTA_DATA = (function () {
  const PLAN = [
    {
      week: 1, phase: 'Reclutamiento', code: 'RECLUTA',
      goal: 'Saludar, identificarse, pedir ayuda y ejecutar 12 órdenes.',
      activity: 'TPR con 12 verbos · 40 tarjetas · grabación del día 1',
      checkpoint: '12/12 órdenes sin error · 20 frases en 60 s',
      canDo: 'Puedo decir mi nombre, pedir ayuda y seguir órdenes simples en inglés.'
    },
    {
      week: 2, phase: 'Reclutamiento', code: 'RECLUTA',
      goal: 'Números, horarios, compras y deletrear.',
      activity: 'Role-play «checkout» · sustitución con I want…',
      checkpoint: '30 ítems al 80 % · 1 min sin cambiar al español',
      canDo: 'Puedo comprar algo, dar mi número y deletrear una palabra.'
    },
    {
      week: 3, phase: 'Básico', code: 'BÁSICO',
      goal: 'Pronunciar /θ/, /ð/, schwa y marcar el ritmo.',
      activity: 'Pares mínimos · 60 s de shadowing · YouGlish',
      checkpoint: '4/5 palabras inteligibles para un oyente externo',
      canDo: 'Puedo distinguir y producir think/sink y this/sis con claridad.'
    },
    {
      week: 4, phase: 'Básico', code: 'BÁSICO',
      goal: 'Diferenciar presente simple y continuo.',
      activity: 'Narración en vivo · 15 sustituciones en 60 s',
      checkpoint: '≤2 errores en 15 sustituciones',
      canDo: 'Puedo narrar qué hago ahora y qué hago normalmente.'
    },
    {
      week: 5, phase: 'Básico', code: 'BÁSICO',
      goal: 'Usar el pasado simple en secuencias.',
      activity: 'Timeline cards · relato de 90 s',
      checkpoint: '8 verbos en pasado correctos',
      canDo: 'Puedo contar qué hice ayer en una secuencia ordenada.'
    },
    {
      week: 6, phase: 'Básico · carga 50 %', code: 'BÁSICO',
      goal: 'Consolidar e introducir present perfect.',
      activity: 'Repaso Anki · for/since · autoevaluación can-do',
      checkpoint: '≥90 % de aciertos · autoevaluación can-do',
      canDo: 'Puedo decir desde cuándo hago algo con for y since.'
    },
    {
      week: 7, phase: 'Misión', code: 'MISIÓN',
      goal: 'Transacciones: comida, direcciones y médico.',
      activity: '3 role-plays cronometrados · intercambio de 20 min',
      checkpoint: '3 misiones sin cambiar al español',
      canDo: 'Puedo pedir comida, preguntar una dirección y describir un síntoma.'
    },
    {
      week: 8, phase: 'Misión', code: 'MISIÓN',
      goal: 'Quejas, malentendidos y pedir que repitan.',
      activity: 'Role-play con complicación aleatoria · grabación de 3 min',
      checkpoint: 'Grabación de 3 min sin repetición ni cambio de idioma',
      canDo: 'Puedo aclarar un malentendido y pedir repetición con cortesía.'
    },
    {
      week: 9, phase: 'Misión', code: 'MISIÓN',
      goal: 'Presentación y defensa de una opinión.',
      activity: 'Charla grabada de 2 min · 5 preguntas',
      checkpoint: '≤3 pausas largas · 5/5 preguntas respondidas',
      canDo: 'Puedo presentar una idea breve y defenderla con razones simples.'
    },
    {
      week: 10, phase: 'Despliegue', code: 'DESPLIEGUE',
      goal: 'Uso real fuera de casa.',
      activity: 'Intercambio real · sesión con desconocido · AAR final',
      checkpoint: 'AAR final con 5 can-do verificados',
      canDo: 'Puedo sostener una interacción real en inglés y evaluarla con evidencia.'
    }
  ];

  const PHASE_COLORS = {
    'RECLUTA': '#C4262E',
    'BÁSICO': '#2E6B8A',
    'MISIÓN': '#8A4E12',
    'DESPLIEGUE': '#3F6B3A'
  };

  const DAILY_RHYTHM = [
    { day: 'lunes', label: 'LUN', focus: 'Entrada y vocabulario' },
    { day: 'martes', label: 'MAR', focus: 'TPR y sustitución' },
    { day: 'miércoles', label: 'MIÉ', focus: 'Shadowing y dictado' },
    { day: 'jueves', label: 'JUE', focus: 'Role-play e interacción' },
    { day: 'viernes', label: 'VIE', focus: 'Misión e inspección' },
    { day: 'sábado', label: 'SÁB', focus: 'Bloque iso de 2–3 h' },
    { day: 'domingo', label: 'DOM', focus: 'Balance y plan' }
  ];

  const MODES = [
    { id: '60', label: '1 h / día', minutes: 60, note: '6–7 h/semana · ~12 % del referencia' },
    { id: '120', label: '2 h / día', minutes: 120, note: '12–14 h/semana · ~25 % del referencia' },
    { id: 'weekend', label: 'Fines de semana', minutes: 180, note: '5–7 h/semana + 10 min de Anki diarios' }
  ];

  const SESSION_60 = [
    { drill: 'srs', label: 'Anki', minutes: 5 },
    { drill: 'coral', label: 'Fonética y repetición coral', minutes: 10 },
    { drill: 'input', label: 'Entrada comprensible (VOA/BBC)', minutes: 15 },
    { drill: 'sustitucion', label: 'Producción', minutes: 15 },
    { drill: 'shadowing', label: 'Dictado o shadowing grabado', minutes: 10 },
    { drill: 'aar', label: 'Diario can-do', minutes: 5 }
  ];

  const SESSION_120 = [
    { drill: 'srs', label: 'Anki', minutes: 10 },
    { drill: 'coral', label: 'Fonética', minutes: 20 },
    { drill: 'input', label: 'Entrada comprensible', minutes: 25 },
    { drill: 'mision', label: 'Misión', minutes: 30 },
    { drill: 'intercambio', label: 'Intercambio / IA', minutes: 20 },
    { drill: 'dictado', label: 'Dictado', minutes: 10 },
    { drill: 'aar', label: 'After-action review', minutes: 5 }
  ];

  // Bloque único de fin de semana: 20+30+30+40+30+20+10 = 180 min.
  // Coincide con lo que anuncia MODES['weekend'], igual que SESSION_60 y SESSION_120.
  const SESSION_WEEKEND = [
    { drill: 'srs', label: 'Anki', minutes: 20 },
    { drill: 'coral', label: 'Fonética y repetición coral', minutes: 30 },
    { drill: 'input', label: 'Entrada comprensible', minutes: 30 },
    { drill: 'mision', label: 'Misión', minutes: 40 },
    { drill: 'shadowing', label: 'Shadowing y dictado', minutes: 30 },
    { drill: 'intercambio', label: 'Intercambio / IA', minutes: 20 },
    { drill: 'aar', label: 'After-action review', minutes: 10 }
  ];

  const DRILLS = [
    {
      id: 'coral', name: 'Repetición coral', kind: 'repeat', dose: '8–10 min',
      purpose: 'Precisión y ritmo',
      procedure: '8–10 frases, 3 veces cada una, a la vez con el audio, sin traducir.',
      prompts: [
        'I want a coffee, please.', 'Can you repeat that, please?',
        'My name is Ana.', 'I need help with my bag.',
        'Where is the nearest station?', 'I would like to pay, please.',
        'That sounds good to me.', 'I do not understand yet.'
      ]
    },
    {
      id: 'sustitucion', name: 'Sustitución', kind: 'repeat', dose: '10 min',
      purpose: 'Fluidez automática',
      procedure: '15–20 turnos por minuto fijando el patrón. El error se repite dos veces.',
      prompts: [
        'I want a coffee.', 'I want a ticket.', 'I want some water.',
        'I would like a coffee.', 'I would like a ticket.', 'I would like some help.',
        'I have been here for two days.', 'I have been here since Monday.'
      ]
    },
    {
      id: 'tpr', name: 'Órdenes TPR', kind: 'repeat', dose: '10–15 min',
      purpose: 'Comprensión y anclaje',
      procedure: '12 órdenes: con demostración → sin demostración → aleatorias → combinadas.',
      prompts: [
        'Stand up.', 'Sit down.', 'Open the door.', 'Close the window.',
        'Point to the table.', 'Touch your nose.', 'Take the pen.',
        'Give me the book.', 'Put it on the chair.', 'Walk to the door.',
        'Show me your hand.', 'Write your name.'
      ]
    },
    {
      id: 'srs', name: 'Flashcards SRS', kind: 'srs', dose: '10–20 min',
      purpose: 'Memoria de vocabulario',
      procedure: 'Una sola imagen o frase por cara; definición en inglés; audio. Repasar antes de dormir.',
      prompts: []
    },
    {
      id: 'dictado', name: 'Dictado', kind: 'dictation', dose: '10 min',
      purpose: 'Escucha y ortografía',
      procedure: '30–60 s: escuchar, escribir, corregir contra la transcripción.',
      prompts: [
        'I would like a table for two.', 'The train leaves at six thirty.',
        'Could you speak a little more slowly?', 'I have been waiting for twenty minutes.',
        'Turn left at the second corner.', 'It is not what I ordered.'
      ]
    },
    {
      id: 'shadowing', name: 'Shadowing', kind: 'shadow', dose: '10 min',
      purpose: 'Atención y prosodia',
      procedure: 'Cuatro pasadas: escuchar, coral, con retardo, grabar y comparar.',
      prompts: [
        'I get up at seven and I make coffee.',
        'She has been working here since March.',
        'If it rains, we will stay at home.',
        'I was walking when I saw the accident.',
        'Could you tell me where the station is?'
      ]
    },
    {
      id: 'traduccion', name: 'Traducción humano-máquina', kind: 'translate', dose: '10 min',
      purpose: 'Transferencia rápida',
      procedure: '20 frases ES→EN en 5 s como máximo. Luego invertir la dirección.',
      prompts: [
        'Quiero un café, por favor.|I want a coffee, please.',
        '¿Puedes repetir eso?|Can you repeat that?',
        'No entiendo la pregunta.|I do not understand the question.',
        'Llevo aquí dos días.|I have been here for two days.',
        'Estoy aprendiendo inglés.|I am learning English.',
        '¿Dónde está el baño?|Where is the restroom?'
      ]
    },
    {
      id: 'mision', name: 'Role-play de misión', kind: 'roleplay', dose: '15–30 min',
      purpose: 'Transferencia bajo presión',
      procedure: 'Tarjeta con rol, objetivo, tres frases obligatorias y una complicación aleatoria.',
      prompts: []
    }
  ];

  const CARDS = [
    { id: 'c1', es: 'Quiero un café, por favor.', en: 'I want a coffee, please.', tag: 'supervivencia' },
    { id: 'c2', es: '¿Puedes repetir eso, por favor?', en: 'Can you repeat that, please?', tag: 'supervivencia' },
    { id: 'c3', es: 'No entiendo todavía.', en: 'I do not understand yet.', tag: 'supervivencia' },
    { id: 'c4', es: 'Necesito ayuda con mi maleta.', en: 'I need help with my bag.', tag: 'supervivencia' },
    { id: 'c5', es: 'Me llamo Ana.', en: 'My name is Ana.', tag: 'identidad' },
    { id: 'c6', es: 'Soy de México.', en: 'I am from Mexico.', tag: 'identidad' },
    { id: 'c7', es: '¿Cuánto cuesta?', en: 'How much does it cost?', tag: 'compras' },
    { id: 'c8', es: 'Quiero pagar, por favor.', en: 'I would like to pay, please.', tag: 'compras' },
    { id: 'c9', es: '¿Dónde está la estación?', en: 'Where is the station?', tag: 'direcciones' },
    { id: 'c10', es: 'Gire a la izquierda en la esquina.', en: 'Turn left at the corner.', tag: 'direcciones' },
    { id: 'c11', es: 'Tengo reserva.', en: 'I have a reservation.', tag: 'servicios' },
    { id: 'c12', es: '¿Aceptan tarjeta?', en: 'Do you take cards?', tag: 'compras' },
    { id: 'c13', es: 'Me duele la cabeza.', en: 'I have a headache.', tag: 'médico' },
    { id: 'c14', es: 'Necesito ver a un médico.', en: 'I need to see a doctor.', tag: 'médico' },
    { id: 'c15', es: 'Llevo aquí dos días.', en: 'I have been here for two days.', tag: 'present perfect' },
    { id: 'c16', es: 'Trabajo aquí desde marzo.', en: 'I have worked here since March.', tag: 'present perfect' },
    { id: 'c17', es: 'Estoy aprendiendo inglés.', en: 'I am learning English.', tag: 'presente' },
    { id: 'c18', es: 'Trabajo en una oficina.', en: 'I work in an office.', tag: 'presente' },
    { id: 'c19', es: 'Ayer fui al mercado.', en: 'Yesterday I went to the market.', tag: 'pasado' },
    { id: 'c20', es: 'Vi una película anoche.', en: 'I watched a movie last night.', tag: 'pasado' },
    { id: 'c21', es: 'Pienso, luego existo.', en: 'I think, therefore I am.', tag: 'pronunciación' },
    { id: 'c22', es: 'El barco se hundió.', en: 'The ship sank.', tag: 'pronunciación' },
    { id: 'c23', es: 'Esto es mío.', en: 'This is mine.', tag: 'pronunciación' },
    { id: 'c24', es: 'En realidad, no estoy de acuerdo.', en: 'Actually, I do not agree.', tag: 'falsos cognados' },
    { id: 'c25', es: 'Actualmente trabajo en Madrid.', en: 'Currently I work in Madrid.', tag: 'falsos cognados' },
    { id: 'c26', es: 'Estoy avergonzado.', en: 'I am embarrassed.', tag: 'falsos cognados' },
    { id: 'c27', es: 'Estoy embarazada.', en: 'I am pregnant.', tag: 'falsos cognados' },
    { id: 'c28', es: 'Debo irme ahora.', en: 'I have to leave now.', tag: 'obligación' },
    { id: 'c29', es: 'No hace falta que vayas.', en: 'You do not have to go.', tag: 'obligación' },
    { id: 'c30', es: 'Me gustaría una habitación tranquila.', en: 'I would like a quiet room.', tag: 'hotel' },
    { id: 'c31', es: 'La cuenta, por favor.', en: 'The check, please.', tag: 'restaurante' },
    { id: 'c32', es: 'No es lo que pedí.', en: 'It is not what I ordered.', tag: 'restaurante' },
    { id: 'c33', es: '¿Puedes hablar más despacio?', en: 'Could you speak more slowly?', tag: 'supervivencia' },
    { id: 'c34', es: 'Dame un segundo.', en: 'Give me a second.', tag: 'supervivencia' },
    { id: 'c35', es: 'Creo que es una buena idea.', en: 'I think it is a good idea.', tag: 'opinión' },
    { id: 'c36', es: 'No estoy de acuerdo porque…', en: 'I do not agree because…', tag: 'opinión' },
    { id: 'c37', es: 'Cuando llueve, me quedo en casa.', en: 'When it rains, I stay home.', tag: 'condicionales' },
    { id: 'c38', es: 'Estaba caminando cuando lo vi.', en: 'I was walking when I saw it.', tag: 'pasado' },
    { id: 'c39', es: 'Tengo que practicar todos los días.', en: 'I have to practice every day.', tag: 'disciplina' },
    { id: 'c40', es: 'Hoy no rompo la cadena.', en: 'Today I do not break the chain.', tag: 'disciplina' }
  ];

  const RESCUE = [
    'Can you repeat that, please?',
    'What does ___ mean?',
    'Give me a second.'
  ];

  const ROLEPLAYS = [
    {
      title: 'Mostrador de café', role: 'Eres el cliente. Quieres un café y la cuenta.',
      must: ['I want a coffee, please.', 'How much is it?', 'The check, please.'],
      twist: 'El camarero no entiende «check»: usa «bill».'
    },
    {
      title: 'Direcciones en la calle', role: 'Preguntas cómo llegar a la estación.',
      must: ['Excuse me.', 'Where is the station?', 'Turn left at the corner.'],
      twist: 'La persona da indicaciones contradictorias: pide repetir.'
    },
    {
      title: 'Cita médica', role: 'Describe un síntoma y pregunta la hora.',
      must: ['I need to see a doctor.', 'I have a headache.', 'What time is the appointment?'],
      twist: 'La recepcionista habla rápido: pide hablar más despacio.'
    },
    {
      title: 'Compra con problema', role: 'El artículo está defectuoso.',
      must: ['It is not what I ordered.', 'I would like a refund.', 'Can you help me?'],
      twist: 'No hay reembolso: negocia un cambio.'
    },
    {
      title: 'Hotel de noche', role: 'Llegas tarde con reserva.',
      must: ['I have a reservation.', 'I would like a quiet room.', 'Could you repeat that?'],
      twist: 'La habitación no está lista: pregunta cuándo estará.'
    },
    {
      title: 'Opinión en equipo', role: 'Defiendes una idea en una reunión breve.',
      must: ['I think it is a good idea.', 'I do not agree because…', 'Can you explain that?'],
      twist: 'Te interrumpen: pide terminar tu punto.'
    }
  ];

  const PITFALLS = [
    { es: 'Estoy agree', en: 'I agree', note: 'be + verbo no vale con agree; usa el verbo directo.' },
    { es: 'Estoy embarazada (como «avergonzada»)', en: 'I am embarrassed', note: 'embarazada = pregnant.' },
    { es: 'Actualmente…', en: 'Currently…', note: 'actually = en realidad.' },
    { es: 'I have 2 years', en: 'I am 2 years old / I have been here for 2 years', note: 'tener años y llevo tiempo no se traducen con have directo.' },
    { es: 'Think / sink', en: '/θ/ vs /s/', note: 'la lengua entre los dientes; taladra pares mínimos.' },
    { es: 'This / sis', en: '/ð/ vs /s/', note: 'sonido voiced; mantén la vibración.' },
    { es: 'FOtograph / foTOGraphy', en: 'schwa y estrés', note: 'la vocal átona se reduce; no deletrees cada vocal.' },
    { es: 'Un house big', en: 'a big house', note: 'el orden adjetivo cambia; mide con sustituciones.' }
  ];

  const CAN_DO = [
    'Puedo saludar, identificarme y pedir ayuda.',
    'Puedo comprar y pedir comida sin cambiar de idioma.',
    'Puedo describir mi rutina y mi pasado reciente.',
    'Puedo sostener una misión de 3 minutos con complicación.',
    'Puedo presentar y defender una opinión breve.'
  ];

  const RANKS = ['Soldado', 'Cabo', 'Sargento', 'Teniente', 'Capitán'];

  const INSPECTION_GATES = [
    { id: 'vocab', label: 'Vocabulario', detail: '≥80 % en 30 tarjetas maduras', target: 80, unit: '%' },
    { id: 'speed', label: 'Velocidad', detail: '15 sustituciones en 60 s con ≤2 errores', target: 2, unit: 'errores' },
    { id: 'tpr', label: 'Órdenes TPR', detail: '12 órdenes sin fallo', target: 12, unit: 'órdenes' },
    { id: 'dictation', label: 'Precisión', detail: 'Dictado de 60 s con ≥80 %', target: 80, unit: '%' },
    { id: 'evidence', label: 'Evidencia grabada', detail: 'Role-play de 2–3 min, 1–5', target: 3, unit: 'puntos' }
  ];

  return {
    PLAN, PHASE_COLORS, DAILY_RHYTHM, MODES, SESSION_60, SESSION_120, SESSION_WEEKEND,
    DRILLS, CARDS, RESCUE, ROLEPLAYS, PITFALLS, CAN_DO, RANKS, INSPECTION_GATES
  };
})();
