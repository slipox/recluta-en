/* Recluta EN — lógica local, sin dependencias ni red. */
(function () {
  'use strict';

  const D = window.RECLUTA_DATA;
  const STORE_KEY = 'recluta-en-v1';
  const $ = (id) => document.getElementById(id);
  const DAY_MS = 86400000;

  let state = loadState();
  let installPrompt = null;
  let session = null;
  let iso = { duration: 30, remaining: 30 * 60, timerId: null, running: false };
  let drill = null;
  let recorder = null;
  let mediaDb = null;
  let recordingUrls = [];
  let previousView = 'taladros';

  /* ---------- Estado ---------- */

  function todayKey(date) {
    const d = date || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function defaultState() {
    return {
      version: 1,
      startDate: todayKey(),
      mode: '60',
      rank: 0,
      days: {},
      cards: {},
      inspections: [],
      consecutivePasses: 0,
      contraband: [],
      installDismissed: false
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (err) {
      console.warn('No se pudo leer el progreso guardado.', err);
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (err) {
      toast('No se pudo guardar: el almacenamiento está lleno o bloqueado.');
    }
  }

  function dayRecord(key) {
    const k = key || todayKey();
    if (!state.days[k]) {
      state.days[k] = { done: false, minimum: false, minutes: 0, isoMinutes: 0, drills: {}, aar: '' };
    }
    return state.days[k];
  }

  function currentWeek() {
    const start = new Date(state.startDate + 'T00:00:00');
    const now = new Date(todayKey() + 'T00:00:00');
    const diff = Math.round((now - start) / DAY_MS);
    return Math.min(10, Math.max(1, Math.floor(diff / 7) + 1));
  }

  function currentDayNumber() {
    const start = new Date(state.startDate + 'T00:00:00');
    const now = new Date(todayKey() + 'T00:00:00');
    return Math.min(70, Math.max(1, Math.round((now - start) / DAY_MS) + 1));
  }

  // Rango de fechas de una semana del itinerario, anclado a startDate.
  function weekDates(n) {
    const start = new Date(state.startDate + 'T00:00:00');
    const from = new Date(start);
    from.setDate(start.getDate() + (n - 1) * 7);
    const to = new Date(from);
    to.setDate(from.getDate() + 6);
    return [todayKey(from), todayKey(to)];
  }

  // El estado del cupón sale de la evidencia real, no del calendario.
  function weekDoneCount(n) {
    const [from, to] = weekDates(n);
    return Object.entries(state.days).filter(([date, rec]) => date >= from && date <= to && rec.done).length;
  }

  function weekInspected(n) {
    const [from, to] = weekDates(n);
    return state.inspections.some((i) => i.date >= from && i.date <= to && i.passed);
  }

  function weekStatus(n) {
    if (weekDoneCount(n) >= 5 || weekInspected(n)) return 'COMPLETADO';
    if (n < currentWeek()) return 'ANULADO';   // pasó sin evidencia: se cancela, no se finge
    if (n === currentWeek()) return 'EN CURSO';
    return 'PENDIENTE';
  }

  function inspectionWeekIndex(dateStr) {
    const start = new Date(state.startDate + 'T00:00:00');
    const d = new Date(dateStr + 'T00:00:00');
    const diff = Math.round((d - start) / DAY_MS);
    return Math.max(1, Math.floor(diff / 7) + 1);
  }

  function streak() {
    let count = 0;
    const cursor = new Date(todayKey() + 'T00:00:00');
    const today = state.days[todayKey()];
    if (!today || (!today.done && !today.minimum)) cursor.setDate(cursor.getDate() - 1);
    for (let i = 0; i < 400; i++) {
      const rec = state.days[todayKey(cursor)];
      if (rec && (rec.done || rec.minimum)) { count++; cursor.setDate(cursor.getDate() - 1); }
      else break;
    }
    return count;
  }

  function totalMinutes() {
    return Object.values(state.days).reduce((sum, d) => sum + (d.minutes || 0) + (d.isoMinutes || 0), 0);
  }

  function modeMinutes() {
    if (state.mode === '120') return 120;
    if (state.mode === 'weekend') return 180;
    return 60;
  }

  /* ---------- Utilidades de interfaz ---------- */

  let toastTimer = null;
  function toast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3600);
  }

  function beep() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 720;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.23);
      setTimeout(() => ctx.close(), 500);
    } catch (err) { /* audio optional */ }
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      toast('Este navegador no tiene voz en inglés. Usa VOA o BBC para escuchar la frase.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices() || [];
    const englishVoice = voices.find((v) => /^en([-_]|$)/i.test(v.lang)) ||
      voices.find((v) => /english/i.test(v.name));
    if (englishVoice) {
      utterance.voice = englishVoice;
      utterance.lang = englishVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  function showView(name) {
    document.querySelectorAll('.view').forEach((v) => { v.hidden = true; });
    const target = $('view-' + name);
    if (target) {
      target.hidden = false;
      target.focus({ preventScroll: true });
    }
    document.querySelectorAll('.tabbar__tab').forEach((t) => {
      t.classList.toggle('is-active', t.dataset.view === name);
    });
    if (name !== 'drill') previousView = name;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  /* ---------- HOY ---------- */

  function renderRoute(week) {
    const svg = $('route-svg');
    const points = [];
    for (let i = 0; i < 10; i++) {
      const x = 12 + i * (296 / 9);
      const y = 54 - 34 * Math.sin(Math.PI * i / 9);
      points.push([x, y]);
    }
    const path = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const dots = points.map((p, i) => {
      const filled = i + 1 <= week;
      const fill = filled ? D.PHASE_COLORS[D.PLAN[i].code] : '#FFFDF8';
      return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (i + 1 === week ? 5 : 3.5) + '" fill="' + fill + '" stroke="#16263F" stroke-width="1.2"/>' +
        '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 15).toFixed(1) + '" text-anchor="middle" font-family="Courier New, monospace" font-size="8" fill="#3B356B">' + String(i + 1).padStart(2, '0') + '</text>';
    }).join('');
    svg.innerHTML = '<path d="' + path + '" fill="none" stroke="#16263F" stroke-width="1.4" stroke-dasharray="' + (week >= 10 ? '0' : '5 3') + '"/>' + dots;
    svg.setAttribute('aria-label', 'Ruta de diez etapas. Etapa ' + week + ' en curso: ' + D.PLAN[week - 1].phase + '.');
  }

  function renderRail() {
    const cells = [];
    const parts = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(todayKey() + 'T00:00:00');
      date.setDate(date.getDate() - i);
      const key = todayKey(date);
      const rec = state.days[key];
      let cls = 'rail__cell';
      let label = 'pendiente';
      if (rec && rec.done) { cls += ' rail__cell--done'; label = 'sesión completada'; }
      else if (rec && rec.minimum) { cls += ' rail__cell--minimum'; label = 'día mínimo'; }
      cells.push('<span class="' + cls + '" aria-hidden="true"></span>');
      parts.push(key + ': ' + label);
    }
    const rail = $('day-rail');
    rail.innerHTML = cells.join('');
    rail.setAttribute('aria-label', 'Últimos siete días. ' + parts.join('. ') + '.');
  }

  function renderHoy() {
    const week = currentWeek();
    const plan = D.PLAN[week - 1];
    const color = D.PHASE_COLORS[plan.code];
    const rec = dayRecord();
    const mode = D.MODES.find((m) => m.id === state.mode) || D.MODES[0];

    $('coupon-code').textContent = 'VUELO ' + String(week).padStart(2, '0');
    $('coupon-phase').textContent = plan.phase.toUpperCase();
    $('coupon-seq').textContent = 'LEG ' + String(week).padStart(2, '0') + ' / 10';
    $('coupon-stripe').style.background = color;
    $('field-phase').textContent = plan.code;
    $('field-day').textContent = String(currentDayNumber()).padStart(2, '0');
    $('field-streak').textContent = streak();
    $('field-minutes').textContent = totalMinutes();
    $('coupon-goal').textContent = plan.goal;
    $('rank-label').textContent = D.RANKS[state.rank];
    $('day-label').textContent = 'DÍA ' + String(currentDayNumber()).padStart(2, '0') + ' / 70';
    $('stub-meta').textContent = modeMinutes() + ' MIN · ' + new Date().toLocaleDateString('es', { weekday: 'short' }).toUpperCase();

    const coupon = $('current-coupon');
    coupon.classList.toggle('is-torn', rec.done || rec.minimum);
    let stamp = coupon.querySelector('.coupon__stamp');
    if (rec.done || rec.minimum) {
      if (!stamp) {
        stamp = document.createElement('span');
        stamp.className = 'coupon__stamp';
        coupon.appendChild(stamp);
      }
      stamp.textContent = rec.done ? 'COMPLETADO' : 'DÍA MÍNIMO';
      stamp.classList.toggle('coupon__stamp--void', !rec.done);
    } else if (stamp) {
      stamp.remove();
    }

    renderRoute(week);
    renderRail();

    $('mode-selector').innerHTML = D.MODES.map((m) =>
      '<button type="button" data-mode="' + m.id + '" aria-pressed="' + (state.mode === m.id) + '">' + escapeHtml(m.label) + '</button>'
    ).join('');
    $('mode-note').textContent = mode.note;

    const todayName = new Date().toLocaleDateString('es', { weekday: 'long' }).toLowerCase();
    $('rhythm-list').innerHTML = D.DAILY_RHYTHM.map((r) =>
      '<div class="rhythm__row' + (r.day === todayName ? ' is-today' : '') + '"><span class="rhythm__day">' + r.label + '</span><span class="rhythm__focus">' + escapeHtml(r.focus) + '</span></div>'
    ).join('');

    $('stack-list').innerHTML = D.PLAN.map((p, i) => {
      const status = weekStatus(i + 1);
      const cls = status === 'COMPLETADO' ? ' stack__state--done' : status === 'ANULADO' ? ' stack__state--void' : '';
      return '<div class="stack__row"><span class="stack__num">' + String(i + 1).padStart(2, '0') + '</span><span class="stack__name">' + escapeHtml(p.phase) + ' · ' + escapeHtml(p.goal.split(',')[0]) + '</span><span class="stack__state' + cls + '">' + status + '</span></div>';
    }).join('');

    if (session) renderSession();
  }

  /* ---------- Sesión (reloj de pared) ---------- */

  function stepsForMode() {
    if (state.mode === '120') return D.SESSION_120.slice();
    if (state.mode === 'weekend') return D.SESSION_WEEKEND.slice();
    return D.SESSION_60.slice();
  }

  function sessionElapsedSeconds() {
    return session ? Math.max(0, Math.floor((Date.now() - session.startedAt) / 1000)) : 0;
  }

  function startSession(minimum) {
    if (session) { toast('Ya hay una sesión abierta. Ciérrala antes de empezar otra.'); showView('hoy'); return; }
    const steps = minimum
      ? [{ drill: 'srs', label: 'Día mínimo · 5 min de Anki', minutes: 5 }]
      : stepsForMode();
    session = { minimum: !!minimum, steps, index: 0, startedAt: Date.now(), total: steps.reduce((s, x) => s + x.minutes, 0) };
    session.timerId = setInterval(tickSession, 1000);
    $('session-panel').hidden = false;
    renderSession();
    showView('hoy');
    toast(minimum ? 'Día mínimo iniciado. Cinco minutos y no rompes la cadena.' : 'Sesión iniciada. El reloj corre.');
  }

  function tickSession() {
    if (!session) return;
    renderSessionClock();
    if (sessionElapsedSeconds() >= session.total * 60) finishSession(true);
  }

  function renderSessionClock() {
    const elapsed = sessionElapsedSeconds();
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    $('session-clock').textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    $('session-progress').style.transform = 'scaleX(' + Math.min(1, elapsed / (session.total * 60)).toFixed(4) + ')';
  }

  function renderSession() {
    if (!session) return;
    $('session-title').textContent = session.minimum ? 'Día mínimo' : 'Orden del día';
    $('session-steps').innerHTML = session.steps.map((step, i) =>
      '<li' + (i === session.index ? ' class="is-active"' : '') + '><span class="step__no">' + String(i + 1).padStart(2, '0') + '</span><span class="step__name">' + escapeHtml(step.label) + '</span><span class="step__min">' + step.minutes + ' MIN</span></li>'
    ).join('');
    $('session-next').textContent = session.index >= session.steps.length - 1 ? 'FINALIZAR SESIÓN' : 'SIGUIENTE BLOQUE';
    renderSessionClock();
  }

  function nextSessionStep() {
    if (!session) return;
    if (session.index >= session.steps.length - 1) { finishSession(false); return; }
    const drillId = session.steps[session.index].drill;
    const info = D.DRILLS.find((d) => d.id === drillId);
    session.index += 1;
    renderSession();
    if (info) openDrill(info.id);
  }

  // Sólo acredita tiempo realmente transcurrido. Dos clics no bastan para cerrar.
  function finishSession(force) {
    if (!session) return;
    const elapsed = sessionElapsedSeconds();
    const planned = session.total * 60;
    // Cerrar antes del tiempo mínimo no registra nada. Entre el mínimo y el final
    // se acreditan minutos reales, pero el día queda como mínimo, no como sesión completa.
    const threshold = session.minimum ? 300 : Math.min(planned, 600);
    if (!force && elapsed < threshold) {
      const need = Math.ceil((threshold - elapsed) / 60);
      toast('Faltan ' + need + ' min para acreditar. Sigue entrenando o usa «Abandonar sin registrar».');
      return;
    }
    clearInterval(session.timerId);
    const credited = Math.max(1, Math.floor(elapsed / 60));
    const complete = elapsed >= planned;
    const wasMinimum = session.minimum;
    const rec = dayRecord();
    if (session.minimum || !complete) rec.minimum = true;
    else rec.done = true;
    rec.minutes += credited;
    saveState();
    session = null;
    $('session-panel').hidden = true;
    beep();
    renderAll();
    if (wasMinimum) {
      toast(credited + ' minutos registrados como día mínimo. La racha sigue.');
    } else if (complete) {
      toast(credited + ' minutos registrados. Sesión completa: el cupón se ha cancelado.');
    } else {
      toast(credited + ' minutos reales registrados como día mínimo. Mantén la sesión hasta el final para completar el cupón.');
    }
  }

  function abandonSession() {
    if (!session) return;
    clearInterval(session.timerId);
    session = null;
    $('session-panel').hidden = true;
    renderAll();
    toast('Sesión abandonada. No se registraron minutos.');
  }

  /* ---------- Taladros ---------- */

  function renderDrills() {
    $('drill-list').innerHTML = D.DRILLS.map((d) =>
      '<button type="button" class="drill" data-drill="' + d.id + '"><span class="drill__name">' + escapeHtml(d.name) + '</span><span class="drill__dose">' + escapeHtml(d.dose) + '</span><span class="drill__purpose">' + escapeHtml(d.purpose) + ' · ' + escapeHtml(d.procedure) + '</span></button>'
    ).join('');
    $('pitfall-list').innerHTML = D.PITFALLS.map((p) =>
      '<div class="pitfall"><div class="pitfall__pair">' + escapeHtml(p.es) + ' → ' + escapeHtml(p.en) + '</div><div class="pitfall__note">' + escapeHtml(p.note) + '</div></div>'
    ).join('');
  }

  function openDrill(id) {
    const info = D.DRILLS.find((d) => d.id === id);
    if (!info) return;
    drill = {
      info, index: 0, hits: 0, errors: 0,
      prompts: info.kind === 'srs' ? dueCards() : info.prompts.slice(),
      revealed: false, correct: null, recording: false
    };
    $('drill-title').textContent = info.name;
    $('drill-purpose').textContent = info.purpose + ' · ' + info.procedure;
    showView('drill');
    renderDrillStage();
  }

  function renderDrillStage() {
    if (!drill) return;
    const info = drill.info;
    $('drill-meta').innerHTML = '<span>' + escapeHtml(info.dose) + '</span><span>ACIRTOS ' + drill.hits + ' · ERRORES ' + drill.errors + '</span>';
    const stage = $('drill-stage');
    const controls = $('drill-controls');
    const prompt = drill.prompts[drill.index];

    if (!prompt && info.kind !== 'srs' && info.kind !== 'roleplay') {
      stage.innerHTML = '<p class="drill-prompt">Ronda completa</p><p class="drill-sub">Los aciertos y errores ya están registrados en la bitácora.</p>';
      controls.innerHTML = '<button class="btn btn--primary" data-action="save">GUARDAR Y SALIR</button>';
      return;
    }

    if (info.kind === 'repeat') {
      stage.innerHTML = '<p class="drill-prompt">' + escapeHtml(prompt) + '</p><p class="drill-sub">Di la frase en voz alta, tres veces, sin traducir.</p>';
      controls.innerHTML = '<button class="btn btn--primary" data-action="hit">BIEN</button><button class="btn" data-action="error">REPETIR</button><button class="btn" data-action="next">SIGUIENTE</button>';
    } else if (info.kind === 'srs') {
      if (!prompt) {
        stage.innerHTML = '<p class="drill-prompt">Al día con las tarjetas</p><p class="drill-sub">Vuelve mañana o añade contrabando desde la zona iso.</p>';
        controls.innerHTML = '<button class="btn btn--primary" data-action="save">GUARDAR Y SALIR</button>';
      } else if (!drill.revealed) {
        stage.innerHTML = '<p class="drill-prompt">' + escapeHtml(prompt.es) + '</p><p class="drill-sub">' + escapeHtml(prompt.tag) + '</p>';
        controls.innerHTML = '<button class="btn btn--primary" data-action="reveal">VER EN INGLÉS</button>';
      } else {
        stage.innerHTML = '<p class="drill-prompt">' + escapeHtml(prompt.en) + '</p><p class="drill-sub">' + escapeHtml(prompt.es) + '</p>' +
          '<p class="drill-sub">Escucha la pronunciación y repite en voz alta antes de calificar.</p>';
        controls.innerHTML = '<button class="btn" data-action="speak">ESCUCHAR</button>' +
          '<button class="btn btn--primary" data-action="easy">FÁCIL</button><button class="btn" data-action="hard">DIFÍCIL</button>';
      }
    } else if (info.kind === 'dictation' || info.kind === 'translate') {
      const source = info.kind === 'translate' ? prompt.split('|')[0] : 'Escucha y escribe la frase en inglés.';
      stage.innerHTML = '<p class="drill-prompt">' + escapeHtml(info.kind === 'translate' ? source : prompt) + '</p>' +
        (info.kind === 'dictation' ? '<p class="drill-sub">Usa la voz del dispositivo. Si no se escucha, cambia el idioma del sistema a inglés.</p>' : '') +
        '<input class="drill-input" id="drill-answer" type="text" autocomplete="off" placeholder="Tu respuesta en inglés" aria-label="Tu respuesta en inglés">' +
        (drill.correct === true ? '<p class="drill-correct">CORRECTO</p>' : drill.correct === false ? '<p class="drill-wrong">CORRECTO: ' + escapeHtml(info.kind === 'translate' ? prompt.split('|')[1] : prompt) + '</p>' : '');
      controls.innerHTML = (info.kind === 'dictation' ? '<button class="btn" data-action="speak">ESCUCHAR</button>' : '') +
        '<button class="btn btn--primary" data-action="check">COMPROBAR</button><button class="btn" data-action="next">SIGUIENTE</button>';
    } else if (info.kind === 'shadow') {
      stage.innerHTML = '<p class="drill-prompt">' + escapeHtml(prompt) + '</p>' +
        '<p class="drill-sub">Cuatro pasadas: escuchar, coral, con retardo y grabar.</p>' +
        (drill.recording ? '<p class="drill-correct">GRABANDO…</p>' : '');
      controls.innerHTML = '<button class="btn" data-action="speak">ESCUCHAR</button>' +
        '<button class="btn btn--primary" data-action="' + (drill.recording ? 'stop' : 'record') + '">' + (drill.recording ? 'DETENER' : 'GRABAR') + '</button>' +
        '<button class="btn" data-action="next">SIGUIENTE</button>';
    } else if (info.kind === 'roleplay') {
      if (!drill.roleplay) drill.roleplay = D.ROLEPLAYS[Math.floor(Math.random() * D.ROLEPLAYS.length)];
      const card = drill.roleplay;
      stage.innerHTML = '<p class="drill-prompt">' + escapeHtml(card.title) + '</p>' +
        '<p class="drill-sub">' + escapeHtml(card.role) + '</p>' +
        '<p class="drill-sub">FRASES OBLIGATORIAS: ' + card.must.map(escapeHtml).join(' · ') + '</p>' +
        '<p class="drill-sub">COMPLICACIÓN: ' + escapeHtml(card.twist) + '</p>' +
        (drill.recording ? '<p class="drill-correct">GRABANDO…</p>' : '');
      controls.innerHTML = '<button class="btn btn--primary" data-action="' + (drill.recording ? 'stop' : 'record') + '">' + (drill.recording ? 'DETENER Y GUARDAR' : 'GRABAR MISIÓN') + '</button>' +
        '<button class="btn" data-action="next">OTRA TARJETA</button><button class="btn" data-action="save">TERMINAR</button>';
    }
    renderDrillTally();
  }

  function renderDrillTally() {
    if (!drill) return;
    $('drill-tally').innerHTML = '<span>ACIRTOS <b>' + drill.hits + '</b></span><span>ERRORES <b>' + drill.errors + '</b></span><span>FRASE <b>' + (drill.index + 1) + '</b></span>';
  }

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9áéíóúñü ]/g, '').replace(/\s+/g, ' ').trim();
  }

  function dueCards() {
    const now = Date.now();
    const due = D.CARDS.filter((c) => {
      const s = state.cards[c.id];
      return !s || s.due <= now;
    });
    return due.slice(0, 12);
  }

  function gradeCard(card, easy) {
    const s = state.cards[card.id] || { interval: 0, reps: 0, ease: 2.5 };
    if (easy) {
      s.reps += 1;
      s.interval = s.reps === 1 ? 1 : Math.max(1, Math.round(s.interval * s.ease));
      s.ease = Math.min(2.8, s.ease + 0.1);
      drill.hits += 1;
    } else {
      s.reps = 0;
      s.interval = 1;
      s.ease = Math.max(1.3, s.ease - 0.2);
      drill.errors += 1;
    }
    s.due = Date.now() + s.interval * DAY_MS;
    state.cards[card.id] = s;
    saveState();
  }

  function advanceDrill() {
    if (!drill) return;
    drill.index += 1;
    drill.revealed = false;
    drill.correct = null;
    renderDrillStage();
  }

  function saveDrill() {
    if (!drill) return;
    const rec = dayRecord();
    const id = drill.info.id;
    const prev = rec.drills[id] || { hits: 0, errors: 0 };
    rec.drills[id] = { hits: prev.hits + drill.hits, errors: prev.errors + drill.errors };
    // Los taladros registran aciertos/errores; los minutos sólo los acredita
    // el reloj de la sesión o un bloque iso completado.
    saveState();
    drill = null;
    showView(previousView);
    renderAll();
    toast('Taladro guardado en la bitácora.');
  }

  function handleDrillAction(action) {
    if (!drill) return;
    const kind = drill.info.kind;
    const prompt = drill.prompts[drill.index];

    if (action === 'save') { saveDrill(); return; }
    if (action === 'next') {
      if (kind === 'roleplay') {
        drill.roleplay = D.ROLEPLAYS[Math.floor(Math.random() * D.ROLEPLAYS.length)];
        renderDrillStage();
      } else advanceDrill();
      return;
    }
    if (action === 'hit') { drill.hits += 1; advanceDrill(); return; }
    if (action === 'error') { drill.errors += 1; advanceDrill(); return; }
    if (action === 'speak') { speak(kind === 'srs' ? prompt.en : prompt); return; }
    if (action === 'reveal') {
      drill.revealed = true;
      renderDrillStage();
      speak(prompt.en); // El gesto de revelar autoriza la voz; así se oye la pronunciación.
      return;
    }
    if (action === 'easy' || action === 'hard') {
      gradeCard(prompt, action === 'easy');
      advanceDrill();
      return;
    }
    if (action === 'check') {
      const answer = $('drill-answer') ? $('drill-answer').value : '';
      const expected = kind === 'translate' ? prompt.split('|')[1] : prompt;
      const ok = normalize(answer) === normalize(expected);
      if (ok) drill.hits += 1; else drill.errors += 1;
      drill.correct = ok;
      renderDrillStage();
      return;
    }
    if (action === 'record') { startRecording(drill.info.name); drill.recording = true; renderDrillStage(); return; }
    if (action === 'stop') { stopRecording(); drill.recording = false; renderDrillStage(); return; }
  }

  /* ---------- Grabaciones (IndexedDB) ---------- */

  function openMediaDb() {
    if (mediaDb) return Promise.resolve(mediaDb);
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) { reject(new Error('IndexedDB no disponible')); return; }
      const req = indexedDB.open('recluta-en-media', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('recordings')) db.createObjectStore('recordings', { keyPath: 'id', autoIncrement: true });
      };
      req.onsuccess = () => { mediaDb = req.result; resolve(mediaDb); };
      req.onerror = () => reject(req.error);
    });
  }

  async function saveRecording(blob, label) {
    const db = await openMediaDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('recordings', 'readwrite');
      tx.objectStore('recordings').add({ date: todayKey(), label, blob });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async function listRecordings() {
    try {
      const db = await openMediaDb();
      return await new Promise((resolve, reject) => {
        const req = db.transaction('recordings', 'readonly').objectStore('recordings').getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (err) { return []; }
  }

  async function renderRecordings() {
    const items = await listRecordings();
    const container = $('recordings-list');
    recordingUrls.forEach((url) => URL.revokeObjectURL(url));
    recordingUrls = [];
    if (!items.length) {
      container.innerHTML = '<p class="empty">Aún no hay grabaciones. Corre un taladro de shadowing o una misión para dejar evidencia.</p>';
      return;
    }
    container.innerHTML = items.slice().reverse().map((item) => {
      const url = URL.createObjectURL(item.blob);
      recordingUrls.push(url);
      return '<div class="recording"><span class="recording__date">' + escapeHtml(item.date) + ' · ' + escapeHtml(item.label) + '</span><audio controls src="' + url + '"></audio></div>';
    }).join('');
  }

  async function startRecording(label) {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      toast('Este navegador no permite grabar. Usa HTTPS y un navegador moderno.');
      return;
    }
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
        try { await saveRecording(blob, label); toast('Grabación guardada en este dispositivo.'); }
        catch (err) { toast('No se pudo guardar la grabación.'); }
        stream.getTracks().forEach((t) => t.stop());
        recorder = null;
        renderRecordings();
      };
      mr.start();
      recorder = mr;
    } catch (err) {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      toast('No se pudo acceder al micrófono. Revisa los permisos del sitio.');
    }
  }

  function stopRecording() {
    if (recorder && recorder.state !== 'inactive') recorder.stop();
  }

  /* ---------- Ruta, registro e inspección ---------- */

  function renderRuta() {
    $('itinerary-list').innerHTML = D.PLAN.map((p, i) => {
      const n = i + 1;
      const status = weekStatus(n);
      const statusCls = status === 'COMPLETADO' ? ' leg__status--done' : status === 'EN CURSO' ? ' leg__status--active' : status === 'ANULADO' ? ' leg__status--void' : '';
      const color = D.PHASE_COLORS[p.code];
      return '<article class="leg"><div class="leg__head"><span class="leg__num">' + String(n).padStart(2, '0') + '</span>' +
        '<span class="leg__phase" style="color:' + color + '">' + escapeHtml(p.phase.toUpperCase()) + '</span>' +
        '<span class="leg__status' + statusCls + '">' + status + '</span></div>' +
        '<p class="leg__goal">' + escapeHtml(p.goal) + '</p>' +
        '<p class="leg__check">ACTIVIDAD: ' + escapeHtml(p.activity) + '<br>CONTROL: ' + escapeHtml(p.checkpoint) + '</p>' +
        '<div class="leg__bar" style="background:' + color + '"></div></article>';
    }).join('');
  }

  const GATE_COMPARE = { vocab: 'min', speed: 'max', tpr: 'min', dictation: 'min', evidence: 'min' };

  function renderInspectionForm() {
    $('inspection-form').innerHTML = D.INSPECTION_GATES.map((gate) =>
      '<div class="gate"><div class="gate__label">' + escapeHtml(gate.label) + '</div>' +
      '<div class="gate__detail">' + escapeHtml(gate.detail) + '</div>' +
      '<div class="gate__input"><input type="number" inputmode="numeric" id="gate-' + gate.id + '" min="0" aria-label="' + escapeHtml(gate.label) + '"><span class="gate__unit">' + escapeHtml(gate.unit) + '</span></div></div>'
    ).join('') +
      '<div class="gate"><div class="gate__label">Tres enunciados can-do con prueba</div>' +
      '<div class="gate__detail">Una línea por enunciado, con la evidencia que lo verifica.</div>' +
      '<textarea class="drill-input" id="gate-cando" rows="3" aria-label="Enunciados can-do"></textarea></div>';
  }

  function saveInspection() {
    const values = {};
    let passed = true;
    D.INSPECTION_GATES.forEach((gate) => {
      const raw = $('gate-' + gate.id).value;
      const value = raw === '' ? NaN : Number(raw);
      values[gate.id] = value;
      const ok = !Number.isNaN(value) && (GATE_COMPARE[gate.id] === 'max' ? value <= gate.target : value >= gate.target);
      if (!ok) passed = false;
    });
    const text = $('gate-cando').value.trim();
    const lines = text ? text.split('\n').filter((l) => l.trim()).length : 0;
    if (lines < 3) passed = false;

    // Una inspección por semana: repetirla no puede inflar el rango.
    const week = inspectionWeekIndex(todayKey());
    state.inspections = state.inspections.filter((i) => inspectionWeekIndex(i.date) !== week);
    state.inspections.push({ date: todayKey(), week, values, canDo: text, passed });
    state.inspections.sort((a, b) => a.date.localeCompare(b.date));

    const passedCount = state.inspections.filter((i) => i.passed).length;
    state.consecutivePasses = passedCount;
    const newRank = Math.min(D.RANKS.length - 1, Math.floor(passedCount / 2));
    const promoted = newRank > state.rank;
    state.rank = newRank;
    saveState();

    $('inspection-result').textContent = promoted
      ? 'INSPECCIÓN APROBADA · ASCENDISTE A ' + D.RANKS[state.rank]
      : passed ? 'INSPECCIÓN REGISTRADA · RANGO ACTUAL: ' + D.RANKS[state.rank]
      : 'INSPECCIÓN NO APROBADA · Revisa la barrera fallida y vuelve a presentarte.';
    $('inspection-result').style.color = passed ? 'var(--green)' : 'var(--red)';
    renderAll();
  }

  function renderRegistro() {
    const doneDays = Object.values(state.days).filter((d) => d.done || d.minimum).length;
    const inspectionsPassed = state.inspections.filter((i) => i.passed).length;
    const due = dueCards().length;
    const stats = [
      [totalMinutes(), 'MINUTOS TOTALES'],
      [doneDays, 'DÍAS SIN ROMPER'],
      [streak(), 'RACHA ACTUAL'],
      [inspectionsPassed, 'INSPECCIONES APROBADAS'],
      [due, 'TARJETAS PENDIENTES'],
      [D.RANKS[state.rank], 'RANGO']
    ];
    $('stats-grid').innerHTML = stats.map((s) => '<div class="stat"><div class="stat__value">' + escapeHtml(String(s[0])) + '</div><div class="stat__label">' + escapeHtml(s[1]) + '</div></div>').join('');

    const entries = Object.entries(state.days).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 12);
    $('log-table').innerHTML = '<div class="log__row log__row--head"><span>FECHA</span><span>MIN</span><span>ISO</span><span>ESTADO</span></div>' +
      (entries.length ? entries.map(([date, rec]) =>
        '<div class="log__row"><span>' + date + '</span><span>' + (rec.minutes || 0) + '</span><span>' + (rec.isoMinutes || 0) + '</span><span>' + (rec.done ? 'COMPLETADO' : rec.minimum ? 'MÍNIMO' : '—') + '</span></div>'
      ).join('') : '<p class="empty">La bitácora está vacía. Tu primera sesión aparecerá aquí.</p>');
    renderRecordings();
  }

  function exportData() {
    const payload = JSON.stringify({ state, exportedAt: new Date().toISOString() }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recluta-en-' + todayKey() + '.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Copia exportada. Las grabaciones no se incluyen.');
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.state || typeof parsed.state !== 'object') throw new Error('formato');
        state = Object.assign(defaultState(), parsed.state);
        saveState();
        renderAll();
        toast('Progreso importado correctamente.');
      } catch (err) {
        toast('El archivo no es una copia válida de Recluta EN.');
      }
    };
    reader.readAsText(file);
  }

  /* ---------- Zona iso ---------- */

  function renderZonaIso() {
    $('iso-rules').innerHTML = [
      'Delimita espacio y horario con el cartel visible «ENGLISH ONLY — NO SPANISH».',
      'Prohíbe traducir y cierra el diccionario español→inglés durante el bloque.',
      'Aplica la regla de los 5 segundos: si no sabes decirlo, parafrasea en inglés.',
      'Anota cada palabra española en la lista de contrabando y tradúcela después.',
      'Usa tres tarjetas de rescate como máximo; baja la complejidad, no cambies de idioma.',
      'Al terminar, pasa el contrabando a Anki y escribe una autohabla de 15 minutos.'
    ].map((r) => '<li>' + escapeHtml(r) + '</li>').join('');
    $('rescue-list').innerHTML = D.RESCUE.map((r) => '<div class="rescue__card">' + escapeHtml(r) + '</div>').join('');
    $('contraband-list').innerHTML = state.contraband.slice().reverse().map((item, idx) =>
      '<li><span>' + escapeHtml(item.text) + '</span><button type="button" data-contraband="' + (state.contraband.length - 1 - idx) + '">QUITAR</button></li>'
    ).join('');
    updateIsoClock();
  }

  function updateIsoClock() {
    const total = iso.duration * 60;
    const m = Math.floor(iso.remaining / 60);
    const s = iso.remaining % 60;
    $('iso-clock').textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    $('iso-progress').style.transform = 'scaleX(' + ((total - iso.remaining) / total).toFixed(4) + ')';
    $('iso-start').textContent = iso.running ? 'PAUSAR BLOQUE' : iso.remaining < total ? 'CONTINUAR BLOQUE' : 'INICIAR BLOQUE';
    document.querySelectorAll('[data-iso-min]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.isoMin) === iso.duration)));
  }

  function setIsoDuration(min) {
    clearInterval(iso.timerId);
    iso = { duration: min, remaining: min * 60, timerId: null, running: false };
    updateIsoClock();
  }

  function toggleIso() {
    if (iso.running) {
      clearInterval(iso.timerId);
      iso.running = false;
    } else {
      iso.running = true;
      iso.timerId = setInterval(() => {
        iso.remaining -= 1;
        if (iso.remaining <= 0) {
          clearInterval(iso.timerId);
          iso.running = false;
          const rec = dayRecord();
          rec.isoMinutes += iso.duration;
          saveState();
          beep();
          toast('Bloque iso de ' + iso.duration + ' minutos completado y registrado.');
          iso.remaining = iso.duration * 60;
          renderAll();
        }
        updateIsoClock();
      }, 1000);
    }
    updateIsoClock();
  }

  /* ---------- Eventos ---------- */

  function bindEvents() {
    document.querySelectorAll('.tabbar__tab').forEach((btn) => btn.addEventListener('click', () => showView(btn.dataset.view)));
    $('drill-back').addEventListener('click', () => { drill = null; showView(previousView); renderAll(); });

    $('start-session').addEventListener('click', () => startSession(false));
    $('start-minimum').addEventListener('click', () => startSession(true));
    $('session-next').addEventListener('click', nextSessionStep);
    $('session-finish').addEventListener('click', () => finishSession(false));
    $('session-abandon').addEventListener('click', abandonSession);

    $('mode-selector').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-mode]');
      if (!btn) return;
      const mode = btn.dataset.mode;
      state.mode = mode;
      saveState();
      renderHoy();
      const next = $('mode-selector').querySelector('[data-mode="' + mode + '"]');
      if (next) next.focus();
    });

    $('drill-list').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-drill]');
      if (btn) openDrill(btn.dataset.drill);
    });
    $('drill-stage').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) handleDrillAction(btn.dataset.action);
    });
    $('drill-controls').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) handleDrillAction(btn.dataset.action);
    });
    // El campo se crea dinámicamente: delegación en el documento, sin listener muerto.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target && e.target.id === 'drill-answer') handleDrillAction('check');
    });

    $('inspection-save').addEventListener('click', saveInspection);
    $('export-data').addEventListener('click', exportData);
    $('import-button').addEventListener('click', () => $('import-file').click());
    $('import-file').addEventListener('change', (e) => { if (e.target.files[0]) importData(e.target.files[0]); });

    $('iso-start').addEventListener('click', toggleIso);
    $('iso-reset').addEventListener('click', () => setIsoDuration(iso.duration));
    document.querySelectorAll('[data-iso-min]').forEach((btn) =>
      btn.addEventListener('click', () => setIsoDuration(Number(btn.dataset.isoMin)))
    );
    $('contraband-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('contraband-input');
      const text = input.value.trim();
      if (!text) return;
      state.contraband.push({ text, date: todayKey() });
      input.value = '';
      saveState();
      renderZonaIso();
    });
    $('contraband-list').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-contraband]');
      if (!btn) return;
      state.contraband.splice(Number(btn.dataset.contraband), 1);
      saveState();
      renderZonaIso();
    });

    const installHelp = () => {
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      toast(ios
        ? 'iPhone/iPad: pulsa Compartir → «Añadir a pantalla de inicio».'
        : 'Android/Chrome: pulsa ⋮ → «Instalar aplicación» o «Añadir a pantalla de inicio».');
    };
    const promptInstall = async () => {
      if (!installPrompt) { installHelp(); return; }
      try {
        await installPrompt.prompt();
        await installPrompt.userChoice;
      } catch (err) {
        installHelp();
      }
      installPrompt = null;
      $('install-banner').hidden = true;
    };
    $('install-button').addEventListener('click', promptInstall);
    $('install-always').addEventListener('click', promptInstall);
    // Cerrar el aviso no desactiva la instalación: el botón de Registro sigue disponible.
    $('install-close').addEventListener('click', () => { $('install-banner').hidden = true; });
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      installPrompt = e;
      $('install-banner').hidden = false;
    });
    window.addEventListener('appinstalled', () => {
      installPrompt = null;
      $('install-banner').hidden = true;
      toast('Recluta EN instalado. Ábrelo desde tu pantalla de inicio.');
    });
  }

  function renderAll() {
    renderHoy();
    renderRuta();
    renderDrills();
    if (!$('inspection-form').children.length) renderInspectionForm();
    renderRegistro();
    renderZonaIso();
  }

  function init() {
    bindEvents();
    renderAll();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Service worker no disponible:', err));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
