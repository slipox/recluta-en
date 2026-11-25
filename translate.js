/* Recluta EN —traductor inglés → español, local y sin red.
   No es un modelo neuronal: usa frases exactas del curso, un diccionario de
   alta frecuencia y reglas simples. Lo desconocido se deja en inglés y se informa. */
(function () {
  'use strict';

  const D = window.RECLUTA_DATA || {};
  const CUSTOM_KEY = 'recluta-en-translate-custom-v1';
  const EXACT = Object.create(null);
  const WORDS = Object.create(null);

  function norm(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/[^a-z0-9ñáéíóúü' ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function addExact(en, es) {
    const key = norm(en);
    if (key && es) EXACT[key] = String(es);
  }

  function addWords(map) {
    Object.keys(map).forEach((key) => { WORDS[norm(key)] = map[key]; });
  }

  /* ---------- Frases del propio curso ---------- */

  (D.CARDS || []).forEach((card) => addExact(card.en, card.es));
  (D.DRILLS || []).forEach((drill) => {
    (drill.prompts || []).forEach((prompt) => {
      if (typeof prompt === 'string' && prompt.indexOf('|') !== -1) {
        const parts = prompt.split('|');
        addExact(parts[1], parts[0]);
      }
    });
  });

  const ROLEPLAY_TRANSLATIONS = {
    'Excuse me.': 'Disculpe.',
    'Where is the station?': '¿Dónde está la estación?',
    'Turn left at the corner.': 'Gire a la izquierda en la esquina.',
    'What time is the appointment?': '¿A qué hora es la cita?',
    'I would like a refund.': 'Me gustaría un reembolso.',
    'Can you help me?': '¿Puede ayudarme?',
    'Could you repeat that?': '¿Podría repetir eso?',
    'Can you explain that?': '¿Puede explicar eso?',
    'How much is it?': '¿Cuánto cuesta?'
  };
  (D.ROLEPLAYS || []).forEach((card) => {
    (card.must || []).forEach((phrase) => addExact(phrase, ROLEPLAY_TRANSLATIONS[phrase] || phrase));
  });

  /* ---------- Frases frecuentes y carteles ---------- */

  const PHRASES = {
    'can you repeat that please': '¿Puedes repetir eso, por favor?',
    'could you repeat that please': '¿Podría repetir eso, por favor?',
    'could you speak more slowly': '¿Podría hablar más despacio?',
    'can you speak a little more slowly': '¿Puede hablar un poco más despacio?',
    'could you speak a little more slowly': '¿Podría hablar un poco más despacio?',
    'i do not understand': 'No entiendo.',
    "i don't understand": 'No entiendo.',
    'i do not understand yet': 'No entiendo todavía.',
    'i need help': 'Necesito ayuda.',
    'i need help with my bag': 'Necesito ayuda con mi maleta.',
    'i need to see a doctor': 'Necesito ver a un médico.',
    'i have a headache': 'Me duele la cabeza.',
    'i have a reservation': 'Tengo una reserva.',
    'i have been here for two days': 'Llevo aquí dos días.',
    'i have been waiting for twenty minutes': 'Llevo veinte minutos esperando.',
    'i have been here since monday': 'Estoy aquí desde el lunes.',
    'i have worked here since march': 'Trabajo aquí desde marzo.',
    'i am learning english': 'Estoy aprendiendo inglés.',
    'i am from mexico': 'Soy de México.',
    'my name is ana': 'Me llamo Ana.',
    'what is your name': '¿Cómo te llamas?',
    'where are you from': '¿De dónde eres?',
    'nice to meet you': 'Mucho gusto.',
    'see you tomorrow': 'Hasta mañana.',
    'have a good day': 'Que tengas un buen día.',
    'thank you very much': 'Muchas gracias.',
    "you're welcome": 'De nada.',
    'no problem': 'No hay problema.',
    'excuse me': 'Disculpe.',
    'one moment please': 'Un momento, por favor.',
    'give me a second': 'Dame un segundo.',
    'let us go': 'Vamos.',
    "let's go": 'Vamos.',
    'hurry up': 'Date prisa.',
    'be careful': 'Ten cuidado.',
    'follow me': 'Sígueme.',
    'wait here': 'Espera aquí.',
    'come with me': 'Ven conmigo.',
    'fill out this form': 'Llena este formulario.',
    'sign here': 'Firma aquí.',
    'show your id': 'Muestra tu identificación.',
    'stand up': 'Levántate.',
    'sit down': 'Siéntate.',
    'open the door': 'Abre la puerta.',
    'close the window': 'Cierra la ventana.',
    'close the door': 'Cierra la puerta.',
    'point to the table': 'Señala la mesa.',
    'touch your nose': 'Tócate la nariz.',
    'take the pen': 'Toma la pluma.',
    'give me the book': 'Dame el libro.',
    'put it on the chair': 'Ponlo en la silla.',
    'walk to the door': 'Camina hacia la puerta.',
    'show me your hand': 'Muéstrame la mano.',
    'write your name': 'Escribe tu nombre.',
    'read aloud': 'Lee en voz alta.',
    'repeat after me': 'Repite después de mí.',
    'look at me': 'Mírame.',
    'listen carefully': 'Escucha con atención.',
    'try again': 'Inténtalo de nuevo.',
    'good job': 'Bien hecho.',
    'do not worry': 'No te preocupes.',
    "don't worry": 'No te preocupes.',
    'i do not know': 'No sé.',
    "i don't know": 'No sé.',
    'what does this mean': '¿Qué significa esto?',
    'what does ___ mean': '¿Qué significa ___?',
    'how do you say this in english': '¿Cómo se dice esto en inglés?',
    'i would like a table for two': 'Quisiera una mesa para dos.',
    'the train leaves at six thirty': 'El tren sale a las seis y treinta.',
    'turn left at the second corner': 'Gira a la izquierda en la segunda esquina.',
    'it is not what i ordered': 'No es lo que pedí.',
    "it's not what i ordered": 'No es lo que pedí.',
    'i get up at seven and i make coffee': 'Me levanto a las siete y hago café.',
    'she has been working here since march': 'Ella trabaja aquí desde marzo.',
    'if it rains we will stay at home': 'Si llueve, nos quedaremos en casa.',
    'i was walking when i saw the accident': 'Estaba caminando cuando vi el accidente.',
    'could you tell me where the station is': '¿Podría decirme dónde está la estación?',
    'i think therefore i am': 'Pienso, luego existo.',
    'the ship sank': 'El barco se hundió.',
    'this is mine': 'Esto es mío.',
    'actually i do not agree': 'En realidad, no estoy de acuerdo.',
    'currently i work in madrid': 'Actualmente trabajo en Madrid.',
    'i am embarrassed': 'Estoy avergonzado.',
    'i am pregnant': 'Estoy embarazada.',
    'i have to leave now': 'Debo irme ahora.',
    'you do not have to go': 'No hace falta que vayas.',
    "you don't have to go": 'No hace falta que vayas.',
    'i would like a quiet room': 'Me gustaría una habitación tranquila.',
    'the check please': 'La cuenta, por favor.',
    'how much does it cost': '¿Cuánto cuesta?',
    'do you take cards': '¿Aceptan tarjeta?',
    'where is the restroom': '¿Dónde está el baño?',
    'where is the nearest station': '¿Dónde está la estación más cercana?',
    'turn left at the corner': 'Gira a la izquierda en la esquina.',
    'turn right at the corner': 'Gira a la derecha en la esquina.',
    'go straight ahead': 'Sigue recto.',
    'on your left': 'A tu izquierda.',
    'on your right': 'A tu derecha.',
    'i want a coffee please': 'Quiero un café, por favor.',
    'i would like a coffee please': 'Quisiera un café, por favor.',
    'i would like to pay please': 'Me gustaría pagar, por favor.',
    'i want a ticket': 'Quiero un boleto.',
    'i want some water': 'Quiero un poco de agua.',
    'i would like some help': 'Me gustaría algo de ayuda.',
    'i think it is a good idea': 'Creo que es una buena idea.',
    'i do not agree because': 'No estoy de acuerdo porque…',
    "i don't agree because": 'No estoy de acuerdo porque…',
    'when it rains i stay home': 'Cuando llueve, me quedo en casa.',
    'i was walking when i saw it': 'Estaba caminando cuando lo vi.',
    'i have to practice every day': 'Tengo que practicar todos los días.',
    'today i do not break the chain': 'Hoy no rompo la cadena.',
    "today i don't break the chain": 'Hoy no rompo la cadena.',
    'english only': 'Sólo inglés.',
    'no spanish': 'Prohibido hablar español.',
    'no smoking': 'Prohibido fumar.',
    'no parking': 'Prohibido estacionar.',
    'no entry': 'Prohibido el paso.',
    'keep out': 'No entrar.',
    'staff only': 'Sólo personal.',
    'employees only': 'Sólo empleados.',
    'authorized personnel only': 'Sólo personal autorizado.',
    'emergency exit': 'Salida de emergencia.',
    'fire exit': 'Salida de incendios.',
    'first aid': 'Primeros auxilios.',
    'wet floor': 'Suelo mojado.',
    'out of order': 'Fuera de servicio.',
    'one way': 'Dirección única.',
    'speed limit': 'Límite de velocidad.',
    'restroom': 'Baño.',
    'restrooms': 'Baños.',
    'men': 'Hombres.',
    'women': 'Mujeres.',
    'police': 'Policía.',
    'ambulance': 'Ambulancia.',
    'emergency': 'Emergencia.',
    'help': 'Ayuda.',
    'exit': 'Salida.',
    'entrance': 'Entrada.',
    'open': 'Abierto.',
    'closed': 'Cerrado.',
    'push': 'Empujar.',
    'pull': 'Tirar.',
    'caution': 'Precaución.',
    'warning': 'Advertencia.',
    'danger': 'Peligro.',
    'stop': 'Alto.',
    'wait': 'Esperar.',
    'go': 'Ir.',
    'yes': 'Sí.',
    'no': 'No.'
  };
  Object.keys(PHRASES).forEach((key) => addExact(key, PHRASES[key]));

  /* ---------- Diccionario de alta frecuencia ---------- */

  addWords({
    // Pronombres, determinantes e interrogativos
    'i': 'yo', 'me': 'me', 'my': 'mi', 'mine': 'mío', 'you': 'tú', 'your': 'tu',
    'yours': 'tuyo', 'he': 'él', 'him': 'él', 'his': 'su', 'she': 'ella', 'her': 'su',
    'it': 'eso', 'its': 'su', 'we': 'nosotros', 'us': 'nos', 'our': 'nuestro',
    'they': 'ellos', 'them': 'los', 'their': 'su', 'this': 'este', 'that': 'ese',
    'these': 'estos', 'those': 'esos', 'who': 'quién', 'what': 'qué', 'where': 'dónde',
    'when': 'cuándo', 'why': 'por qué', 'how': 'cómo', 'which': 'cuál', 'whose': 'de quién',
    'myself': 'mí mismo', 'yourself': 'ti mismo', 'everyone': 'todos', 'someone': 'alguien',
    'anyone': 'alguien', 'nobody': 'nadie', 'everything': 'todo', 'something': 'algo',
    'anything': 'algo', 'nothing': 'nada', 'each': 'cada', 'every': 'cada', 'some': 'algunos',
    'any': 'algunos', 'many': 'muchos', 'much': 'mucho', 'few': 'pocos', 'little': 'poco',
    'more': 'más', 'less': 'menos', 'all': 'todos', 'both': 'ambos', 'other': 'otro',
    'another': 'otro', 'same': 'mismo', 'different': 'diferente',
    // Ser, estar, tener, hacer, modales
    'am': 'estoy', 'is': 'es', 'are': 'son', 'was': 'era', 'were': 'eran', 'be': 'ser',
    'been': 'sido', 'being': 'siendo', 'have': 'tener', 'has': 'tiene', 'had': 'tenía',
    'do': 'hacer', 'does': 'hace', 'did': 'hizo', 'done': 'hecho', 'can': 'poder',
    'could': 'podría', 'may': 'puede', 'might': 'podría', 'must': 'debe', 'should': 'debería',
    'will': 'va a', 'would': 'sería', 'shall': 'deberé',
    'cannot': 'no puede', "can't": 'no puede', "don't": 'no', "doesn't": 'no',
    "didn't": 'no', "won't": 'no va a', "isn't": 'no es', "aren't": 'no son',
    "wasn't": 'no era', "weren't": 'no eran', "couldn't": 'no podría',
    "shouldn't": 'no debería', "wouldn't": 'no sería', "i'm": 'yo soy',
    "you're": 'tú eres', "we're": 'nosotros somos', "they're": 'ellos son',
    "it's": 'es', "i've": 'yo he', "you've": 'tú has', "we've": 'nosotros hemos',
    "i'll": 'yo voy a', "you'll": 'tú vas a', "we'll": 'nosotros vamos a',
    "i'd": 'yo sería', "you'd": 'tú serías', "we'd": 'nosotros seríamos',
    // Conectores y preposiciones
    'a': 'un', 'an': 'un', 'the': 'el', 'and': 'y', 'or': 'o', 'but': 'pero',
    'if': 'si', 'because': 'porque', 'so': 'así que', 'then': 'entonces', 'than': 'que',
    'of': 'de', 'in': 'en', 'on': 'en', 'at': 'en', 'to': 'a', 'from': 'de',
    'with': 'con', 'without': 'sin', 'for': 'para', 'by': 'por', 'about': 'sobre',
    'into': 'dentro de', 'over': 'sobre', 'under': 'debajo de', 'before': 'antes de',
    'after': 'después de', 'during': 'durante', 'near': 'cerca de', 'through': 'por',
    'between': 'entre', 'against': 'contra', 'around': 'alrededor de', 'here': 'aquí',
    'there': 'allí', 'up': 'arriba', 'down': 'abajo', 'out': 'fuera', 'off': 'apagado',
    'back': 'atrás', 'again': 'de nuevo', 'very': 'muy', 'too': 'demasiado', 'just': 'sólo',
    'only': 'sólo', 'not': 'no', 'yes': 'sí', 'please': 'por favor', 'thanks': 'gracias',
    'thank': 'agradecer', 'sorry': 'perdón', 'excuse': 'disculpar', 'welcome': 'bienvenido',
    // Verbos frecuentes
    'want': 'querer', 'wants': 'quiere', 'wanted': 'quiso', 'need': 'necesitar',
    'needs': 'necesita', 'needed': 'necesitó', 'like': 'gustar', 'likes': 'gusta',
    'love': 'encantar', 'know': 'saber', 'knows': 'sabe', 'think': 'pensar',
    'thinks': 'piensa', 'thought': 'pensó', 'say': 'decir', 'says': 'dice',
    'said': 'dijo', 'tell': 'decir', 'tells': 'dice', 'told': 'dijo', 'ask': 'preguntar',
    'asks': 'pregunta', 'asked': 'preguntó', 'answer': 'responder', 'answered': 'respondió',
    'speak': 'hablar', 'speaks': 'habla', 'spoke': 'habló', 'talk': 'hablar',
    'listen': 'escuchar', 'listens': 'escucha', 'listened': 'escuchó', 'hear': 'oír',
    'heard': 'oyó', 'see': 'ver', 'sees': 've', 'saw': 'vio', 'seen': 'visto',
    'look': 'mirar', 'looks': 'mira', 'looked': 'miró', 'read': 'leer', 'reads': 'lee',
    'write': 'escribir', 'writes': 'escribe', 'wrote': 'escribió', 'work': 'trabajar',
    'works': 'trabaja', 'worked': 'trabajó', 'working': 'trabajando', 'live': 'vivir',
    'lives': 'vive', 'lived': 'vivió', 'eat': 'comer', 'eats': 'come', 'ate': 'comió',
    'drink': 'beber', 'drinks': 'bebe', 'drank': 'bebió', 'sleep': 'dormir',
    'sleeps': 'duerme', 'slept': 'durmió', 'go': 'ir', 'goes': 'va', 'went': 'fue',
    'gone': 'ido', 'going': 'yendo', 'come': 'venir', 'comes': 'viene', 'came': 'vino',
    'get': 'conseguir', 'gets': 'consigue', 'got': 'consiguió', 'give': 'dar',
    'gives': 'da', 'gave': 'dio', 'given': 'dado', 'take': 'tomar', 'takes': 'toma',
    'took': 'tomó', 'taken': 'tomado', 'make': 'hacer', 'makes': 'hace', 'made': 'hizo',
    'play': 'jugar', 'plays': 'juega', 'played': 'jugó', 'study': 'estudiar',
    'studies': 'estudia', 'studied': 'estudió', 'learn': 'aprender', 'learns': 'aprende',
    'learned': 'aprendió', 'teach': 'enseñar', 'teaches': 'enseña', 'taught': 'enseñó',
    'help': 'ayudar', 'helps': 'ayuda', 'helped': 'ayudó', 'pay': 'pagar', 'pays': 'paga',
    'paid': 'pagó', 'buy': 'comprar', 'buys': 'compra', 'bought': 'compró',
    'sell': 'vender', 'wait': 'esperar', 'waits': 'espera', 'waited': 'esperó',
    'stop': 'parar', 'stops': 'para', 'stopped': 'paró', 'start': 'empezar',
    'starts': 'empieza', 'started': 'empezó', 'open': 'abrir', 'opens': 'abre',
    'opened': 'abrió', 'close': 'cerrar', 'closes': 'cierra', 'closed': 'cerró',
    'sit': 'sentarse', 'sits': 'se sienta', 'sat': 'se sentó', 'stand': 'estar de pie',
    'stands': 'está de pie', 'stood': 'estuvo de pie', 'walk': 'caminar', 'walks': 'camina',
    'walked': 'caminó', 'run': 'correr', 'runs': 'corre', 'ran': 'corrió', 'drive': 'conducir',
    'drives': 'conduce', 'drove': 'condujo', 'turn': 'girar', 'turns': 'gira',
    'turned': 'giró', 'point': 'señalar', 'points': 'señala', 'pointed': 'señaló',
    'touch': 'tocar', 'touches': 'toca', 'show': 'mostrar', 'shows': 'muestra',
    'showed': 'mostró', 'follow': 'seguir', 'follows': 'sigue', 'followed': 'siguió',
    'bring': 'traer', 'brings': 'trae', 'brought': 'trajo', 'carry': 'llevar',
    'put': 'poner', 'puts': 'pone', 'leave': 'salir', 'leaves': 'sale', 'left': 'salió',
    'arrive': 'llegar', 'arrives': 'llega', 'arrived': 'llegó', 'return': 'devolver',
    'returns': 'devuelve', 'returned': 'devolvió', 'call': 'llamar', 'calls': 'llama',
    'called': 'llamó', 'check': 'revisar', 'checks': 'revisa', 'checked': 'revisó',
    'fill': 'llenar', 'fills': 'llena', 'filled': 'llenó', 'sign': 'firmar',
    'signs': 'firma', 'signed': 'firmó', 'wear': 'usar', 'wears': 'usa', 'wore': 'usó',
    'use': 'usar', 'uses': 'usa', 'used': 'usó', 'try': 'intentar', 'tries': 'intenta',
    'tried': 'intentó', 'repeat': 'repetir', 'repeats': 'repite', 'repeated': 'repitió',
    'explain': 'explicar', 'explains': 'explica', 'explained': 'explicó',
    'understand': 'entender', 'understands': 'entiende', 'understood': 'entendió',
    'remember': 'recordar', 'remembers': 'recuerda', 'forgot': 'olvidó', 'forget': 'olvidar',
    'choose': 'elegir', 'chooses': 'elige', 'chose': 'eligió', 'decide': 'decidir',
    'decided': 'decidió', 'agree': 'estar de acuerdo', 'agrees': 'está de acuerdo',
    'disagree': 'no estar de acuerdo', 'believe': 'creer', 'believes': 'cree',
    'hope': 'esperar', 'hopes': 'espera', 'feel': 'sentir', 'feels': 'siente',
    'felt': 'sintió', 'hurt': 'doler', 'hurts': 'duele', 'recommend': 'recomendar',
    'suggest': 'sugerir', 'improve': 'mejorar', 'improves': 'mejora',
    'practice': 'practicar', 'practices': 'practica', 'practiced': 'practicó',
    'train': 'entrenar', 'trains': 'entrena', 'trained': 'entrenó', 'complete': 'completar',
    'completed': 'completó', 'finish': 'terminar', 'finishes': 'termina',
    'finished': 'terminó', 'continue': 'continuar', 'continues': 'continúa',
    'continued': 'continuó', 'begin': 'empezar', 'begins': 'empieza', 'began': 'empezó',
    'watch': 'ver', 'watches': 've', 'watched': 'vio', 'visit': 'visitar',
    'visited': 'visitó', 'travel': 'viajar', 'travels': 'viaja', 'traveled': 'viajó',
    'stay': 'quedarse', 'stays': 'se queda', 'stayed': 'se quedó', 'meet': 'conocer',
    'meets': 'conoce', 'met': 'conoció', 'miss': 'extrañar', 'misses': 'extraña',
    'order': 'pedir', 'orders': 'pide', 'ordered': 'pidió', 'cook': 'cocinar',
    'clean': 'limpiar', 'cleans': 'limpia', 'cleaned': 'limpió', 'wash': 'lavar',
    'fix': 'arreglar', 'fixed': 'arregló', 'break': 'romper', 'broke': 'rompió',
    'build': 'construir', 'built': 'construyó', 'move': 'mover', 'moves': 'mueve',
    'moved': 'movió', 'change': 'cambiar', 'changes': 'cambia', 'changed': 'cambió',
    'send': 'enviar', 'sends': 'envía', 'sent': 'envió', 'receive': 'recibir',
    'received': 'recibió', 'text': 'enviar un mensaje', 'email': 'correo electrónico',
    // Tiempo y números
    'time': 'hora', 'hour': 'hora', 'minute': 'minuto', 'second': 'segundo',
    'day': 'día', 'days': 'días', 'week': 'semana', 'weeks': 'semanas', 'month': 'mes',
    'year': 'año', 'years': 'años', 'today': 'hoy', 'tomorrow': 'mañana',
    'yesterday': 'ayer', 'now': 'ahora', 'later': 'después', 'soon': 'pronto',
    'always': 'siempre', 'never': 'nunca', 'often': 'a menudo', 'sometimes': 'a veces',
    'already': 'ya', 'still': 'todavía', 'yet': 'todavía', 'once': 'una vez',
    'twice': 'dos veces', 'morning': 'mañana', 'afternoon': 'tarde', 'evening': 'noche',
    'night': 'noche', 'tonight': 'esta noche', 'weekend': 'fin de semana',
    'monday': 'lunes', 'tuesday': 'martes', 'wednesday': 'miércoles',
    'thursday': 'jueves', 'friday': 'viernes', 'saturday': 'sábado', 'sunday': 'domingo',
    'january': 'enero', 'february': 'febrero', 'march': 'marzo', 'april': 'abril',
    'may': 'mayo', 'june': 'junio', 'july': 'julio', 'august': 'agosto',
    'september': 'septiembre', 'october': 'octubre', 'november': 'noviembre',
    'december': 'diciembre',
    'one': 'uno', 'two': 'dos', 'three': 'tres', 'four': 'cuatro', 'five': 'cinco',
    'six': 'seis', 'seven': 'siete', 'eight': 'ocho', 'nine': 'nueve', 'ten': 'diez',
    'eleven': 'once', 'twelve': 'doce', 'thirteen': 'trece', 'fourteen': 'catorce',
    'fifteen': 'quince', 'sixteen': 'dieciséis', 'seventeen': 'diecisiete',
    'eighteen': 'dieciocho', 'nineteen': 'diecinueve', 'twenty': 'veinte',
    'thirty': 'treinta', 'forty': 'cuarenta', 'fifty': 'cincuenta', 'sixty': 'sesenta',
    'hundred': 'cien', 'thousand': 'mil', 'first': 'primero', 'third': 'tercero',
    'last': 'último', 'next': 'siguiente', 'half': 'mitad',
    // Comida, compras y servicios
    'coffee': 'café', 'water': 'agua', 'tea': 'té', 'milk': 'leche', 'beer': 'cerveza',
    'food': 'comida', 'breakfast': 'desayuno', 'lunch': 'almuerzo', 'dinner': 'cena',
    'restaurant': 'restaurante', 'menu': 'menú', 'table': 'mesa', 'bill': 'cuenta',
    'check': 'cuenta', 'refund': 'reembolso', 'ticket': 'boleto', 'price': 'precio',
    'cost': 'costo', 'change': 'cambio', 'money': 'dinero', 'cash': 'efectivo',
    'card': 'tarjeta', 'cards': 'tarjetas', 'size': 'talla', 'color': 'color',
    'shirt': 'camisa', 'shoes': 'zapatos', 'clothes': 'ropa', 'bag': 'bolsa',
    'store': 'tienda', 'shop': 'tienda', 'market': 'mercado', 'receipt': 'recibo',
    'train': 'tren', 'bus': 'autobús', 'station': 'estación', 'airport': 'aeropuerto',
    'flight': 'vuelo', 'plane': 'avión', 'hotel': 'hotel', 'room': 'habitación',
    'key': 'llave', 'reservation': 'reserva', 'address': 'dirección', 'corner': 'esquina',
    'street': 'calle', 'road': 'carretera', 'city': 'ciudad', 'country': 'país',
    'map': 'mapa', 'left': 'izquierda', 'right': 'derecha', 'straight': 'recto',
    'north': 'norte', 'south': 'sur', 'east': 'este', 'west': 'oeste',
    'doctor': 'médico', 'hospital': 'hospital', 'pharmacy': 'farmacia',
    'medicine': 'medicamento', 'pain': 'dolor', 'headache': 'dolor de cabeza',
    'fever': 'fiebre', 'cold': 'resfriado', 'appointment': 'cita', 'symptom': 'síntoma',
    'restroom': 'baño', 'bathroom': 'baño', 'toilet': 'inodoro',
    'police': 'policía', 'fire': 'incendio', 'ambulance': 'ambulancia',
    'emergency': 'emergencia', 'help': 'ayuda', 'exit': 'salida', 'entrance': 'entrada',
    'caution': 'precaución', 'warning': 'advertencia', 'danger': 'peligro',
    'smoking': 'fumar', 'parking': 'estacionamiento', 'push': 'empujar', 'pull': 'tirar',
    'staff': 'personal', 'employees': 'empleados', 'elevator': 'ascensor',
    'stairs': 'escaleras', 'step': 'escalón', 'floor': 'piso', 'wet': 'mojado',
    'speed': 'velocidad', 'limit': 'límite', 'restricted': 'restringido',
    'authorized': 'autorizado', 'delivery': 'entregas', 'loading': 'carga',
    // Objetos y estudio
    'name': 'nombre', 'number': 'número', 'phone': 'teléfono', 'door': 'puerta',
    'window': 'ventana', 'chair': 'silla', 'pen': 'pluma', 'pencil': 'lápiz',
    'paper': 'papel', 'book': 'libro', 'books': 'libros', 'word': 'palabra',
    'words': 'palabras', 'sentence': 'frase', 'sentences': 'frases',
    'question': 'pregunta', 'questions': 'preguntas', 'answer': 'respuesta',
    'answers': 'respuestas', 'example': 'ejemplo', 'meaning': 'significado',
    'pronunciation': 'pronunciación', 'accent': 'acento', 'grammar': 'gramática',
    'rule': 'regla', 'rules': 'reglas', 'level': 'nivel', 'test': 'examen',
    'exam': 'examen', 'result': 'resultado', 'error': 'error', 'errors': 'errores',
    'mistake': 'error', 'practice': 'práctica', 'progress': 'progreso',
    'goal': 'objetivo', 'plan': 'plan', 'mission': 'misión', 'drill': 'taladro',
    'recording': 'grabación', 'evidence': 'evidencia', 'inspection': 'inspección',
    'rank': 'rango', 'chain': 'cadena', 'habit': 'hábito', 'routine': 'rutina',
    'diary': 'diario', 'log': 'bitácora', 'course': 'curso', 'lesson': 'lección',
    'lessons': 'lecciones', 'class': 'clase', 'student': 'estudiante',
    'students': 'estudiantes', 'teacher': 'profesor', 'work': 'trabajo',
    'job': 'trabajo', 'office': 'oficina', 'school': 'escuela',
    // Adjetivos y estados
    'good': 'bueno', 'bad': 'malo', 'big': 'grande', 'small': 'pequeño',
    'new': 'nuevo', 'old': 'viejo', 'young': 'joven', 'hot': 'caliente',
    'fast': 'rápido', 'slow': 'lento', 'easy': 'fácil', 'hard': 'difícil',
    'difficult': 'difícil', 'important': 'importante', 'ready': 'listo',
    'busy': 'ocupado', 'tired': 'cansado', 'happy': 'feliz', 'sad': 'triste',
    'angry': 'enojado', 'careful': 'cuidadoso', 'quiet': 'tranquilo',
    'loud': 'ruidoso', 'clean': 'limpio', 'dirty': 'sucio', 'open': 'abierto',
    'closed': 'cerrado', 'free': 'libre', 'available': 'disponible',
    'correct': 'correcto', 'wrong': 'incorrecto', 'sure': 'seguro',
    'possible': 'posible', 'impossible': 'imposible', 'simple': 'simple',
    'long': 'largo', 'short': 'corto', 'high': 'alto', 'low': 'bajo',
    'full': 'lleno', 'empty': 'vacío', 'near': 'cercano', 'far': 'lejano',
    'early': 'temprano', 'late': 'tardío', 'legal': 'legal', 'illegal': 'ilegal',
    'safe': 'seguro', 'dangerous': 'peligroso', 'fine': 'bien', 'okay': 'está bien',
    'great': 'excelente', 'nice': 'agradable', 'wrong': 'incorrecto'
  });

  /* ---------- Traducción ---------- */

  function customWords() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) { return {}; }
  }

  function saveCustomWords(map) {
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(map)); return true; }
    catch (err) { return false; }
  }

  function addCustomWord(en, es) {
    const key = norm(en);
    const value = String(es || '').trim();
    if (!key || !value) return false;
    const map = customWords();
    map[key] = value;
    return saveCustomWords(map);
  }

  function removeCustomWord(en) {
    const map = customWords();
    delete map[norm(en)];
    return saveCustomWords(map);
  }

  function lookup(raw, custom) {
    const clean = raw.replace(/[^A-Za-zñÑáéíóúüÁÉÍÓÚÜ']/g, '').toLowerCase();
    const key = norm(clean);
    if (!key) return { text: raw, known: true };
    if (custom[key]) return { text: custom[key], known: true };
    if (WORDS[key]) return { text: WORDS[key], known: true };

    const candidates = [];
    if (/ies$/.test(key) && key.length > 4) candidates.push(key.slice(0, -3) + 'y', key.slice(0, -2));
    if (/es$/.test(key) && key.length > 4) candidates.push(key.slice(0, -2), key.slice(0, -1));
    if (/s$/.test(key) && key.length > 3) candidates.push(key.slice(0, -1));
    if (/ing$/.test(key) && key.length > 5) candidates.push(key.slice(0, -3), key.slice(0, -3) + 'e');
    if (/ed$/.test(key) && key.length > 4) candidates.push(key.slice(0, -2), key.slice(0, -1));
    if (/ly$/.test(key) && key.length > 4) candidates.push(key.slice(0, -2));
    for (let i = 0; i < candidates.length; i++) {
      const base = candidates[i];
      if (WORDS[base]) return { text: WORDS[base], known: true };
    }
    return { text: raw, known: false };
  }

  function translateLine(line, custom) {
    const source = String(line || '');
    const tokens = source.match(/[A-Za-zñÑáéíóúüÁÉÍÓÚÜ']+|[^A-Za-zñÑáéíóúüÁÉÍÓÚÜ']+/g) || [];
    const words = tokens.filter((t) => /[A-Za-zñÑáéíóúüÁÉÍÓÚÜ']/.test(t)).map(norm);
    const full = words.join(' ');

    // Frase completa: la traducción exacta gana siempre.
    if (EXACT[full]) {
      return { text: EXACT[full], unknown: [] };
    }

    // Coincidencia parcial larga (frases dentro de una línea con más texto).
    let best = null;
    for (let size = Math.min(8, words.length); size >= 2 && !best; size--) {
      for (let i = 0; i <= words.length - size; i++) {
        const key = words.slice(i, i + size).join(' ');
        if (EXACT[key]) { best = { at: i, size, text: EXACT[key] }; break; }
      }
    }

    const output = [];
    const unknown = [];
    let index = 0;
    let firstWord = true;
    while (index < tokens.length) {
      const token = tokens[index];
      const isWord = /[A-Za-zñÑáéíóúüÁÉÍÓÚÜ']/.test(token);
      if (!isWord) { output.push(token); index++; continue; }

      const wordIndex = tokens.slice(0, index + 1).filter((t) => /[A-Za-zñÑáéíóúüÁÉÍÓÚÜ']/.test(t)).length - 1;
      if (best && wordIndex === best.at) {
        let translated = best.text;
        if (firstWord && /^[a-z]/.test(token)) translated = translated.charAt(0).toUpperCase() + translated.slice(1);
        output.push(translated);
        index += best.size;
        // Avanzar el cursor de tokens hasta consumir `size` palabras.
        let consumed = 1;
        while (consumed < best.size && index < tokens.length) {
          if (/[A-Za-zñÑáéíóúüÁÉÍÓÚÜ']/.test(tokens[index])) consumed++;
          index++;
        }
        firstWord = false;
        best = null;
        continue;
      }

      const found = lookup(token, custom);
      let translated = found.text;
      if (firstWord && /^[a-z]/.test(token) && /^[a-z]/.test(translated)) {
        translated = translated.charAt(0).toUpperCase() + translated.slice(1);
      }
      output.push(translated);
      if (!found.known && norm(token)) unknown.push(token.replace(/[^A-Za-zñÑáéíóúüÁÉÍÓÚÜ']/g, ''));
      firstWord = false;
      index++;
    }

    let text = output.join('');
    // Preguntas: añadir el signo de apertura si falta.
    if (/\?\s*$/.test(text) && text.indexOf('¿') === -1 && /^(who|what|where|when|why|how|which|can|could|do|does|did|is|are|was|were|will|would|should|may|must)/i.test(source.trim())) {
      text = '¿' + text;
    }
    return { text, unknown };
  }

  function translateText(text) {
    const custom = customWords();
    const lines = String(text || '').split(/\r?\n/);
    const results = lines.map((line) => translateLine(line, custom));
    const unknown = [];
    results.forEach((result) => result.unknown.forEach((word) => {
      const key = norm(word);
      if (key && unknown.indexOf(key) === -1) unknown.push(key);
    }));
    return {
      text: results.map((r) => r.text).join('\n'),
      unknown
    };
  }

  window.RECLUTA_TRANSLATE = {
    translateText,
    customWords,
    addCustomWord,
    removeCustomWord,
    norm
  };
})();
