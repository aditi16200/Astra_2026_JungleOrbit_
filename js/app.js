'use strict';

/* ==========================================================
   JUNGLEORBIT: COMPLETE JAVASCRIPT ENGINE (js/app.js)
   - 200 Hz to 1500 Hz Multi-Harmonic Bee Audio Synthesizer
   - Locopilot In-Cab Vocal Alert Engine (SpeechSynthesis)
   - Continuous Train Motion Towards Elephant with Dynamic Deceleration
   - Prominent Glowing Elephant Symbol with Radar Halos
   - Orion Nebula Canvas & Dynamic Retardation Graph
   - Tamper-Proof Satellite Blackbox (JSON & CSV Export)
   ========================================================== */

const $ = (id) => document.getElementById(id);
const screens = [...document.querySelectorAll('.screen')];

// ----------------------------------------------------------
// 1. SCREEN NAVIGATION CONTROLLER
// ----------------------------------------------------------
function openScreen(id) {
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (id === 'retardation') drawBrakeChart();
  if (id === 'planbee') drawMainWave();
  if (id === 'mission' && window.leafletMap) {
    setTimeout(() => { window.leafletMap.invalidateSize(); }, 200);
  }
}

document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => openScreen(btn.dataset.open));
});

document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => openScreen('dashboard'));
});

// ----------------------------------------------------------
// 2. ORION NEBULA STARFIELD BACKGROUND
// ----------------------------------------------------------
(function initNebulaStarfield() {
  const canvas = $('nebula-starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 2800);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.4 ? 'rgba(247, 210, 232,' : 'rgba(206, 125, 202,'
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let s of stars) {
      s.alpha += s.speed;
      if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color + Math.abs(s.alpha) + ')';
      ctx.fill();
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();

// ----------------------------------------------------------
// 3. FEATURE 01: DYNAMIC RETARDATION PHYSICS ENGINE
// ----------------------------------------------------------
function calculateBrake() {
  const speed = +$('speed-input').value;
  const load = Math.max(100, +$('load-input').value || 1500);
  const distance = +$('distance-input').value;

  const v = speed / 3.6; // convert km/h to m/s
  const loadFactor = 1 + Math.max(0, load - 1500) / 15000;
  const decel = 0.22 / loadFactor;
  const stop = (v * v) / (2 * decel);
  const clear = distance - stop;
  const risk = clear >= 0 ? 0 : Math.min(99, Math.round((Math.abs(clear) / Math.max(distance, 1)) * 100));

  $('speed-label').textContent = speed + ' km/h';
  $('distance-label').textContent = distance.toLocaleString() + ' m';
  $('stop-value').textContent = Math.round(stop).toLocaleString() + ' m';
  $('decel-value').textContent = decel.toFixed(2) + ' m/s²';
  $('clear-value').textContent = (clear >= 0 ? '+' : '') + Math.round(clear).toLocaleString() + ' m';
  $('clear-value').style.color = clear >= 0 ? '#38e3a2' : '#ff5264';
  $('risk-value').textContent = 'Derailment Risk: ' + risk + '%';
  $('energy-value').textContent = ((0.5 * load * 1000 * v * v) / 1e6).toFixed(0) + ' MJ';
  $('countdown-value').textContent = distance.toLocaleString() + ' m';

  if ($('dash-stop')) $('dash-stop').textContent = Math.round(stop) + ' m';
  if ($('dash-speed')) $('dash-speed').textContent = speed + ' km/h';

  drawBrakeChart();
}

['speed-input', 'load-input', 'distance-input'].forEach(id => {
  const el = $(id);
  if (el) el.addEventListener('input', calculateBrake);
});

function drawBrakeChart() {
  const c = $('brake-chart');
  if (!c) return;
  const r = c.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  c.width = Math.max(1, r.width * dpr);
  c.height = Math.max(1, r.height * dpr);
  const x = c.getContext('2d');
  x.scale(dpr, dpr);
  const w = r.width, h = r.height;
  const p = { l: 45, r: 20, t: 25, b: 35 };

  x.clearRect(0, 0, w, h);
  x.strokeStyle = 'rgba(206, 125, 202, 0.15)';
  x.fillStyle = '#b057ad';
  x.font = '11px -apple-system, sans-serif';

  // Y-axis grid
  for (let i = 0; i <= 6; i++) {
    let yy = p.t + ((h - p.t - p.b) * i) / 6;
    x.beginPath();
    x.moveTo(p.l, yy);
    x.lineTo(w - p.r, yy);
    x.stroke();
    x.fillText((6 - i).toFixed(0) + '.0', 10, yy + 4);
  }

  // X-axis grid
  for (let i = 0; i <= 10; i++) {
    let xx = p.l + ((w - p.l - p.r) * i) / 10;
    x.beginPath();
    x.moveTo(xx, p.t);
    x.lineTo(xx, h - p.b);
    x.stroke();
    x.fillText(i * 100 + '', xx - 10, h - 12);
  }

  const speed = +$('speed-input').value;
  const load = +$('load-input').value || 1500;
  const v = speed / 3.6;
  const dec = 0.22 / (1 + Math.max(0, load - 1500) / 15000);
  const stop = (v * v) / (2 * dec);
  const max = 1200;
  const base = h - p.b;

  // Deceleration area
  x.beginPath();
  for (let i = 0; i <= 100; i++) {
    let dist = (max * i) / 100;
    let vel = (Math.sqrt(Math.max(0, v * v - 2 * dec * dist)) * 3.6) / 30;
    let xx = p.l + ((w - p.l - p.r) * dist) / max;
    let yy = base - (h - p.t - p.b) * Math.min(1, vel / 8);
    if (i === 0) x.moveTo(xx, yy);
    else x.lineTo(xx, yy);
  }

  x.strokeStyle = '#ce7dca';
  x.lineWidth = 3;
  x.stroke();
  x.lineTo(w - p.r, base);
  x.lineTo(p.l, base);
  x.closePath();
  x.fillStyle = 'rgba(176, 87, 173, 0.18)';
  x.fill();

  // Stop vertical marker line
  let stopX = p.l + ((w - p.l - p.r) * Math.min(1, stop / max));
  x.setLineDash([5, 4]);
  x.strokeStyle = '#f5be38';
  x.beginPath();
  x.moveTo(stopX, p.t);
  x.lineTo(stopX, base);
  x.stroke();
  x.setLineDash([]);
  x.fillStyle = '#f5be38';
  x.fillText('Calculated Stop: ' + Math.round(stop) + ' m', Math.min(stopX + 8, w - 160), p.t + 15);
}

// ----------------------------------------------------------
// 4. LOCOPILOT IN-CAB VOCAL ALERT ENGINE (SPEECHSYNTHESIS)
// ----------------------------------------------------------
let lastSpokenZone = '';

function speakLocopilotAlert(type, customText) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Cancel any existing speech

  let text = customText;
  if (!text) {
    if (type === 'critical') {
      text = "Critical Emergency. Locopilot Alert. Elephant herd breached 800 meter perimeter on track sector KM-142. Full service braking engaged. Plan Bee acoustic active.";
    } else if (type === 'advisory') {
      text = "Locopilot Advisory. Elephant herd detected in 2 kilometer safety buffer. Restrict locomotive speed to 60 kilometers per hour.";
    } else {
      text = "NavIC Satellite link verified. Corridor sector clear. Standard line speed authorized.";
    }
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.05;
  utter.pitch = 0.95; // Authoritative locomotive driver alert pitch
  window.speechSynthesis.speak(utter);
}

$('btn-locopilot-speak')?.addEventListener('click', () => {
  speakLocopilotAlert('critical');
});

// ----------------------------------------------------------
// 5. LOCOPILOT TUNABLE BEE AUDIO ENGINE (500 HZ TO 1500 HZ DROPDOWN)
// ----------------------------------------------------------
let audioContext = null;
let analyserNode = null;
let dataArray = null;
let beeOscillators = [];
let beeModulator = null;
let beeGain = null;
let isBroadcasting = false;
let currentFreq = 1500; // Dropdown range 500 Hz to 1500 Hz (default 1500 Hz)
let currentAudioMode = 'swarm'; // 'swarm' or 'pure1500'
let activeWaveMode = 'swarm'; // 'swarm' or '1500'

function updateSelectedFrequency(freq, triggerVoice = false) {
  currentFreq = Math.max(500, Math.min(1500, +freq || 1500));
  
  // Synchronize both dropdowns (Plan Bee screen & Driver HUD)
  if ($('bee-freq-select')) $('bee-freq-select').value = String(currentFreq);
  if ($('mission-freq-select')) $('mission-freq-select').value = String(currentFreq);
  
  // Update UI telemetry badges
  if ($('active-freq-label')) $('active-freq-label').textContent = currentFreq + ' Hz Active';
  if ($('btn-freq-indicator')) $('btn-freq-indicator').textContent = currentFreq + 'Hz';
  if ($('hint-freq-label')) $('hint-freq-label').textContent = currentFreq + ' Hz';
  if ($('wave-spec-label')) $('wave-spec-label').textContent = currentFreq + ' HZ ACTIVE';
  if ($('mission-bee-tag')) $('mission-bee-tag').textContent = (isBroadcasting ? 'ACTIVE (' : 'STANDBY (') + currentFreq + 'Hz)';

  // If already broadcasting, dynamically retune oscillators in real time
  if (isBroadcasting && audioContext && beeOscillators.length > 0) {
    tuneRunningOscillators();
  }

  if (triggerVoice) {
    speakLocopilotAlert('custom', "Locopilot selected Plan Bee deterrent frequency: " + currentFreq + " Hertz.");
  }
}

function tuneRunningOscillators() {
  if (!audioContext) return;
  const now = audioContext.currentTime;

  if (currentAudioMode === 'pure1500') {
    if (beeOscillators[0]) {
      beeOscillators[0].frequency.cancelScheduledValues(now);
      beeOscillators[0].frequency.exponentialRampToValueAtTime(currentFreq, now + 0.08);
    }
  } else {
    const ratios = [0.35, 0.60, 0.82, 1.0];
    beeOscillators.forEach((osc, i) => {
      const targetF = Math.max(100, Math.round(currentFreq * ratios[i]));
      osc.frequency.cancelScheduledValues(now);
      osc.frequency.exponentialRampToValueAtTime(targetF, now + 0.08);
    });
  }
}

function startBeeSound(mode = 'swarm') {
  currentAudioMode = mode;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!audioContext) audioContext = new AC();
    if (audioContext.state === 'suspended') audioContext.resume();

    stopBeeSound(false); // Clean up active nodes without resetting UI status

    // Analyser for real-time waveform visualization
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 512;
    dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    // Master Volume Gain
    beeGain = audioContext.createGain();
    beeGain.gain.setValueAtTime(0.14, audioContext.currentTime);

    // 22 Hz LFO Modulator for authentic wingbeat flutter
    beeModulator = audioContext.createOscillator();
    const modGain = audioContext.createGain();
    beeModulator.frequency.setValueAtTime(22, audioContext.currentTime);
    modGain.gain.setValueAtTime(currentAudioMode === 'pure1500' ? 14 : 32, audioContext.currentTime);
    beeModulator.connect(modGain);

    // Resonant Peaking Filter tuned directly to selected frequency (500Hz - 1500Hz)
    const filter = audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.setValueAtTime(currentFreq, audioContext.currentTime);
    filter.Q.setValueAtTime(1.4, audioContext.currentTime);
    filter.gain.setValueAtTime(6.0, audioContext.currentTime);

    if (currentAudioMode === 'pure1500') {
      // Direct Pure Resonant Tone Mode at selected frequency
      const osc1 = audioContext.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(currentFreq, audioContext.currentTime);
      modGain.connect(osc1.frequency);

      const osc2 = audioContext.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(currentFreq + 2, audioContext.currentTime); // stereo phase body

      const g1 = audioContext.createGain();
      g1.gain.setValueAtTime(0.12, audioContext.currentTime);
      const g2 = audioContext.createGain();
      g2.gain.setValueAtTime(0.04, audioContext.currentTime);

      osc1.connect(g1); g1.connect(filter);
      osc2.connect(g2); g2.connect(filter);
      osc1.start(); osc2.start();
      beeOscillators = [osc1, osc2];

    } else {
      // Multi-Harmonic Swarm Buzz covering 500 Hz to 1500 Hz
      const ratios = [0.35, 0.60, 0.82, 1.0];
      beeOscillators = ratios.map((ratio, idx) => {
        const osc = audioContext.createOscillator();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        const f = Math.max(100, Math.round(currentFreq * ratio));
        osc.frequency.setValueAtTime(f, audioContext.currentTime);
        modGain.connect(osc.frequency);

        const oscGain = audioContext.createGain();
        oscGain.gain.setValueAtTime(0.14 / (idx + 1), audioContext.currentTime);
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        return osc;
      });
    }

    beeModulator.start();
    filter.connect(analyserNode);
    analyserNode.connect(beeGain);
    beeGain.connect(audioContext.destination);

    isBroadcasting = true;

    // UI Updates
    if ($('sound-status')) {
      $('sound-status').textContent = `🐝 Broadcasting ${currentFreq} Hz ${currentAudioMode === 'pure1500' ? 'Direct Deterrent Tone' : 'Multi-Harmonic Swarm Buzz'}...`;
      $('sound-status').style.color = '#f5be38';
    }
    if ($('broadcast-btn')) {
      $('broadcast-btn').textContent = `■ Stop Bio-Acoustic Broadcast (${currentFreq}Hz)`;
    }
    if ($('wave-overlay-hint')) {
      $('wave-overlay-hint').innerHTML = `<span class="pulse-dot"></span> ■ Active: ${currentFreq} Hz · Click to Stop`;
      $('wave-overlay-hint').style.borderColor = '#ff5264';
      $('wave-overlay-hint').style.color = '#ff5264';
    }
    if ($('mission-bee-tag')) {
      $('mission-bee-tag').textContent = `ACTIVE (${currentFreq}Hz Buzz)`;
      $('mission-bee-tag').style.color = '#f5be38';
    }

  } catch (err) {
    console.error("Audio engine error:", err);
  }
}

function stopBeeSound(resetUI = true) {
  if (beeOscillators.length > 0) {
    try {
      beeOscillators.forEach(o => { o.stop(); o.disconnect(); });
      if (beeModulator) { beeModulator.stop(); beeModulator.disconnect(); }
    } catch (_) {}
  }
  beeOscillators = [];
  beeModulator = null;
  isBroadcasting = false;

  if (resetUI) {
    if ($('sound-status')) {
      $('sound-status').textContent = `System idle · Select frequency (500Hz–1500Hz) from dropdown or click waveform to emit sound`;
      $('sound-status').style.color = '#ad9ebf';
    }
    if ($('broadcast-btn')) {
      $('broadcast-btn').textContent = `🔊   Test Emit Bio-Acoustic Wave (${currentFreq}Hz Buzz)`;
    }
    if ($('wave-overlay-hint')) {
      $('wave-overlay-hint').innerHTML = `<span class="pulse-dot"></span> Click Waveform to Play <span id="hint-freq-label">${currentFreq} Hz</span> Sound`;
      $('wave-overlay-hint').style.borderColor = '#38e6e9';
      $('wave-overlay-hint').style.color = '#38e6e9';
    }
    if ($('mission-bee-tag')) {
      $('mission-bee-tag').textContent = `STANDBY (${currentFreq}Hz)`;
      $('mission-bee-tag').style.color = '#ad9ebf';
    }
  }
}

// Frequency Dropdown Event Listeners
$('bee-freq-select')?.addEventListener('change', (e) => updateSelectedFrequency(e.target.value, true));
$('mission-freq-select')?.addEventListener('change', (e) => updateSelectedFrequency(e.target.value, true));

// Test Emit Swarm Button
$('broadcast-btn')?.addEventListener('click', () => {
  if (isBroadcasting) {
    stopBeeSound();
  } else {
    startBeeSound('swarm');
    speakLocopilotAlert('custom', "Plan Bee bio acoustic deterrent broadcast active at " + currentFreq + " Hertz.");
  }
});

// Force 1500 Hz Tone Button
$('btn-1500-tone')?.addEventListener('click', () => {
  updateSelectedFrequency(1500, false);
  if (isBroadcasting && currentAudioMode === 'pure1500') {
    stopBeeSound();
  } else {
    startBeeSound('pure1500');
    speakLocopilotAlert('custom', "1500 Hertz peak pachyderm deterrent waveform engaged.");
  }
});

// Clickable Waveform Canvases to Toggle Sound
$('wave-canvas-wrap')?.addEventListener('click', () => {
  if (isBroadcasting) {
    stopBeeSound();
  } else {
    startBeeSound('pure1500');
  }
});

$('mission-wave')?.addEventListener('click', () => {
  if (isBroadcasting) {
    stopBeeSound();
  } else {
    startBeeSound('swarm');
  }
});

// Waveform Mode Switchers
$('btn-wave-mode-all')?.addEventListener('click', () => {
  activeWaveMode = 'swarm';
  $('btn-wave-mode-all')?.classList.add('active');
  $('btn-wave-mode-1500')?.classList.remove('active');
  if (isBroadcasting) startBeeSound('swarm');
});

$('btn-wave-mode-1500')?.addEventListener('click', () => {
  activeWaveMode = '1500';
  updateSelectedFrequency(1500, false);
  $('btn-wave-mode-1500')?.classList.add('active');
  $('btn-wave-mode-all')?.classList.remove('active');
  startBeeSound('pure1500');
});

// Canvas Waveform Animation Engine (with Real-time Audio Spectrum when active)
let wavePhase = 0;
function drawWave(canvas, detail = 1, isMain = false) {
  if (!canvas) return;
  const r = canvas.getBoundingClientRect();
  if (!r.width || !r.height) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = r.width * dpr;
  canvas.height = r.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const w = r.width, h = r.height;

  ctx.clearRect(0, 0, w, h);

  // If live sound is broadcasting, render true real-time Web Audio API waveform
  if (isBroadcasting && analyserNode && dataArray) {
    analyserNode.getByteTimeDomainData(dataArray);

    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = currentFreq >= 1200 ? '#f5be38' : '#38e6e9';
    ctx.shadowBlur = 12;
    ctx.shadowColor = ctx.strokeStyle;

    const sliceWidth = w / dataArray.length;
    let xPos = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const yPos = (v * h) / 2;
      if (i === 0) ctx.moveTo(xPos, yPos);
      else ctx.lineTo(xPos, yPos);
      xPos += sliceWidth;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    return;
  }

  // Idle state: Wave frequency scales dynamically with currentFreq (500Hz - 1500Hz)
  const freqRatio = currentFreq / 500; // 1.0 (500Hz) to 3.0 (1500Hz)
  const cycles = (activeWaveMode === '1500' || currentFreq >= 1350) ? 26 : (12 * freqRatio);

  for (let layer = 0; layer < 2; layer++) {
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      let t = px / w;
      let envelope = 0.2 + 0.8 * Math.pow(Math.sin(Math.PI * t), 0.7);
      let y = h / 2 + Math.sin(t * detail * cycles * Math.PI + wavePhase * (layer ? -0.8 : 1.2)) * (h * (layer ? 0.16 : 0.32)) * envelope;
      if (px === 0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.strokeStyle = layer ? '#b057ad' : (currentFreq >= 1200 ? '#f5be38' : '#f7d2e8');
    ctx.lineWidth = layer ? 1.5 : 2.5;
    ctx.shadowBlur = layer ? 0 : 8;
    ctx.shadowColor = '#ce7dca';
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

function animateWaves() {
  wavePhase += 0.045;
  drawWave($('main-wave'), 1, true);
  drawWave($('dash-wave'), 1.2);
  drawWave($('mission-wave'), 1.4);
  requestAnimationFrame(animateWaves);
}
requestAnimationFrame(animateWaves);
function drawMainWave() { drawWave($('main-wave'), 1, true); }

// ----------------------------------------------------------
// 6. FEATURE 02: LEAFLET MAP WITH TRAIN MOTION TOWARDS ELEPHANT
// ----------------------------------------------------------
const CORRIDOR_DATA = {
  center: [26.75, 88.90],
  zoom: 13,
  // Railway Track Points leading directly towards elephant crossing
  track: [
    [26.715, 88.835],
    [26.728, 88.855],
    [26.740, 88.878],
    [26.750, 88.898],
    [26.758, 88.915], // Closest point to elephant herd
    [26.770, 88.938],
    [26.785, 88.960]
  ],
  // Elephant Herd Location
  elephantCoord: [26.758, 88.918]
};

let mapInstance = null;
let mapTrackPoly = null;
let mapTrainMarker = null;
let mapElephantMarker = null;
let mapYellowCircle = null;
let mapRedCircle = null;
let mapTile = null;

// Train Movement Towards Elephant Variables
let isTrainMoving = false;
let trainStep = 0;
let trainProgress = 0;
let trainTimer = null;

function initLeafletMap() {
  const mapEl = $('liveLeafletMap');
  if (!mapEl || mapInstance) return;

  mapInstance = L.map('liveLeafletMap', { zoomControl: false }).setView(CORRIDOR_DATA.center, CORRIDOR_DATA.zoom);
  window.leafletMap = mapInstance;

  mapTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(mapInstance);

  mapTrackPoly = L.polyline(CORRIDOR_DATA.track, { color: '#ce7dca', weight: 4, dashArray: '6, 8' }).addTo(mapInstance);

  // Train Marker
  const tIcon = L.divIcon({
    html: '<div style="font-size:26px; transform:translate(-12px,-14px); filter:drop-shadow(0 0 10px #38e6e9)">🚆</div>',
    className: 'train-marker'
  });
  mapTrainMarker = L.marker(CORRIDOR_DATA.track[0], { icon: tIcon }).addTo(mapInstance);

  // PROMINENT ELEPHANT EMBLEM WITH RADAR PULSE
  const elephantIcon = L.divIcon({
    html: `
      <div class="elephant-beacon">
        <div class="beacon-pulse"></div>
        <div class="elephant-badge">🐘</div>
        <span class="elephant-tag">ELEPHANT HERD ALPHA</span>
      </div>
    `,
    className: 'elephant-beacon-container',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });
  mapElephantMarker = L.marker(CORRIDOR_DATA.elephantCoord, { icon: elephantIcon }).addTo(mapInstance);

  // Geofence Rings around Elephant
  mapYellowCircle = L.circle(CORRIDOR_DATA.elephantCoord, {
    color: '#f5be38',
    dashArray: '6,6',
    fillColor: '#f5be38',
    fillOpacity: 0.08,
    radius: 2000
  }).addTo(mapInstance);

  mapRedCircle = L.circle(CORRIDOR_DATA.elephantCoord, {
    color: '#ff5264',
    fillColor: '#ff5264',
    fillOpacity: 0.18,
    radius: 800
  }).addTo(mapInstance);

  // Layer Switcher
  $('geo-layer-select')?.addEventListener('change', (e) => {
    mapInstance.removeLayer(mapTile);
    if (e.target.value === 'satellite') {
      mapTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 });
    } else if (e.target.value === 'topo') {
      mapTile = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 });
    } else {
      mapTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 });
    }
    mapTile.addTo(mapInstance);
  });

  // Train Motion Toggle Button
  $('btn-toggle-approach')?.addEventListener('click', toggleTrainMotion);
}

// Distance Formula (Haversine in meters)
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Train Motion Loop Moving Directly Towards Elephant
function toggleTrainMotion() {
  const btn = $('btn-toggle-approach');
  isTrainMoving = !isTrainMoving;

  if (isTrainMoving) {
    if (btn) {
      btn.textContent = "⏸️ Pause Train Motion";
      btn.classList.add('active');
    }
    trainTimer = setInterval(moveTrainTowardElephant, 350);
  } else {
    if (btn) {
      btn.textContent = "▶️ Start Train Motion Towards Elephant";
      btn.classList.remove('active');
    }
    clearInterval(trainTimer);
  }
}

function moveTrainTowardElephant() {
  const pts = CORRIDOR_DATA.track;
  // Index 4 is the closest track point to the elephant
  const maxTargetIndex = 4;

  if (trainStep >= maxTargetIndex) {
    // Train has reached safe halt in front of the elephant
    toggleTrainMotion();
    return;
  }

  trainProgress += 0.08;
  if (trainProgress >= 1.0) {
    trainProgress = 0;
    trainStep++;
  }

  const p1 = pts[trainStep];
  const p2 = pts[Math.min(trainStep + 1, pts.length - 1)];

  const curLat = p1[0] + (p2[0] - p1[0]) * trainProgress;
  const curLng = p1[1] + (p2[1] - p1[1]) * trainProgress;

  mapTrainMarker.setLatLng([curLat, curLng]);

  // Compute live distance between train and elephant
  const dist = getDistanceMeters(curLat, curLng, CORRIDOR_DATA.elephantCoord[0], CORRIDOR_DATA.elephantCoord[1]);
  setMissionDistance(dist);
}

let missionDistance = 1800;

function setMissionDistance(d) {
  missionDistance = Math.max(100, Math.min(3000, d));
  $('mission-distance').value = missionDistance;
  $('mission-distance-label').textContent = missionDistance.toLocaleString() + ' m';

  const alert = $('mission-alert');
  const speed = $('mission-speed');
  const beeTag = $('mission-bee-tag');
  const targetLimit = $('mission-target-limit');

  if (missionDistance <= 800) {
    speed.textContent = '20';
    speed.style.color = '#ff5264';
    if (targetLimit) targetLimit.textContent = '25 km/h';
    alert.textContent = '🚨 CRITICAL EMERGENCY: ELEPHANT HERD IN 800M ZONE // FULL SERVICE BRAKE';
    alert.className = 'alert-banner critical';
    if (beeTag) { beeTag.textContent = 'ACTIVE (' + currentFreq + 'Hz Buzz)'; beeTag.style.color = '#f5be38'; }

    startBeeSound('swarm');
    if (lastSpokenZone !== 'critical') {
      speakLocopilotAlert('critical');
      lastSpokenZone = 'critical';
    }

  } else if (missionDistance <= 2000) {
    speed.textContent = '58';
    speed.style.color = '#f5be38';
    if (targetLimit) targetLimit.textContent = '60 km/h';
    alert.textContent = '⚠️ ADVISORY: ELEPHANT HERD WITHIN ' + (missionDistance / 1000).toFixed(1) + ' KM // THROTTLE TO 60';
    alert.className = 'alert-banner';
    if (beeTag) { beeTag.textContent = 'STANDBY (' + currentFreq + 'Hz)'; beeTag.style.color = '#ce7dca'; }

    stopBeeSound();
    if (lastSpokenZone !== 'advisory') {
      speakLocopilotAlert('advisory');
      lastSpokenZone = 'advisory';
    }

  } else {
    speed.textContent = '100';
    speed.style.color = '#38e3a2';
    if (targetLimit) targetLimit.textContent = '100 km/h';
    alert.textContent = '🟢 TRACK CLEAR // LINE SPEED 100 KM/H';
    alert.className = 'alert-banner';
    alert.style.borderColor = '#38e3a2';
    alert.style.color = '#38e3a2';
    alert.style.background = 'rgba(56, 227, 162, 0.15)';
    if (beeTag) { beeTag.textContent = 'STANDBY (' + currentFreq + 'Hz)'; beeTag.style.color = '#ad9ebf'; }

    stopBeeSound();
    lastSpokenZone = 'clear';
  }
}

$('mission-distance')?.addEventListener('input', (e) => setMissionDistance(+e.target.value));
$('mission-step')?.addEventListener('click', () => setMissionDistance(missionDistance - 250));
$('mission-reset')?.addEventListener('click', () => {
  trainStep = 0;
  trainProgress = 0;
  if (mapTrainMarker) mapTrainMarker.setLatLng(CORRIDOR_DATA.track[0]);
  setMissionDistance(1800);
});

// ----------------------------------------------------------
// 7. FEATURE 04: SPLIT-SCREEN MISSION COMMAND ENGINE
// ----------------------------------------------------------
const scenarios = {
  cruise: {
    speed: 100,
    limit: 100,
    gap: '2,650 m',
    decel: '0.20 m/s² (Normal)',
    status: 'STATUS: TRACK CLEAR // 100 KM/H CRUISE',
    headline: 'NO WILDLIFE WITHIN 2.0 KM SAFETY CORRIDOR',
    corridor: 'GREEN // TRACK SAFE',
    bee: 'READY (200Hz–1500Hz)'
  },
  advisory: {
    speed: 60,
    limit: 60,
    gap: '1,800 m',
    decel: '0.22 m/s² (Advisory)',
    status: 'STATUS: ADVISORY // SPEED REDUCED',
    headline: 'WILDLIFE DETECTED IN 2.0 KM YELLOW ZONE',
    corridor: 'YELLOW // CAUTION',
    bee: 'ARMED (STANDBY)'
  },
  emergency: {
    speed: 20,
    limit: 20,
    gap: '650 m',
    decel: '0.35 m/s² (Emergency)',
    status: 'STATUS: EMERGENCY // BRAKE CLAMP',
    headline: 'WILDLIFE INSIDE 800 M EMERGENCY ZONE',
    corridor: 'RED // EMERGENCY',
    bee: 'ACTIVE (EMITTING 200–1500Hz)'
  }
};

document.querySelectorAll('[data-scenario]').forEach(btn => {
  btn.addEventListener('click', () => {
    let s = btn.dataset.scenario;
    let v = scenarios[s];

    document.querySelectorAll('[data-scenario]').forEach(b => b.classList.toggle('selected', b === btn));
    $('command-speed').textContent = v.speed;
    $('speed-limit').textContent = v.limit;
    $('gap-value').textContent = v.gap;
    $('command-decel').textContent = v.decel;
    $('command-bee-state').textContent = v.bee;

    const ts = $('track-status');
    ts.querySelector('b').textContent = v.status;
    ts.querySelector('strong').textContent = v.headline;

    const cs = $('corridor-status');
    cs.textContent = v.corridor;
    cs.style.color = s === 'emergency' ? '#ff5264' : (s === 'advisory' ? '#f5be38' : '#38e3a2');

    if (s === 'emergency') {
      $('command-bee-state').textContent = 'ACTIVE (' + currentFreq + 'Hz Buzz)';
      startBeeSound('swarm');
      speakLocopilotAlert('critical');
    } else {
      $('command-bee-state').textContent = 'READY (' + currentFreq + 'Hz)';
      stopBeeSound();
    }

    addLog(
      s === 'emergency' ? 'CRITICAL' : (s === 'advisory' ? 'ADVISORY' : 'MONITOR'),
      v.speed + ' km/h',
      s === 'emergency' ? 'Emergency clamp engaged; 200Hz–1500Hz Plan Bee broadcasted' : (s === 'advisory' ? 'Yellow ring alert; locopilot throttled to 60' : 'Buffer distance safe; regular scan')
    );
  });
});

// ----------------------------------------------------------
// 8. FEATURE 05: SATELLITE BLACKBOX AUDIT LOG & EXPORTERS
// ----------------------------------------------------------
let logs = [
  ['#NAVIC-9027', '22:48:12 IST', '🐘 Elephant Herd Alpha (#EL-09)', 'Dooars KM-142', '20 km/h', 'CRITICAL', 'Emergency clamp engaged; Plan Bee broadcasted'],
  ['#NAVIC-9026', '22:46:05 IST', '🐘 Elephant Herd Alpha (#EL-09)', 'Dooars KM-142', '60 km/h', 'ADVISORY', 'Yellow ring alert; locopilot throttled 100 → 60'],
  ['#NAVIC-9025', '22:42:30 IST', '🐅 Tiger (#TR-04)', 'Rajaji KM-88', '100 km/h', 'MONITOR', 'Buffer distance 2.8 km safe; regular scan'],
  ['#NAVIC-9024', '22:38:50 IST', '🦏 Rhino (#RH-12)', 'Kaziranga North', '95 km/h', 'CLEAR', '3.4 km from track line; no speed cut required']
];

function renderLogs() {
  const body = $('audit-body');
  if (!body) return;
  body.innerHTML = '';
  logs.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach((value, i) => {
      const td = document.createElement('td');
      if (i === 5) {
        const badge = document.createElement('span');
        badge.className = 'event ' + value;
        badge.textContent = value;
        td.appendChild(badge);
      } else {
        td.textContent = value;
      }
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
  if ($('packet-count')) $('packet-count').textContent = (14820 + Math.max(0, logs.length - 4)).toLocaleString();
}

function addLog(event = 'MONITOR', speed = '100 km/h', action = 'Routine telemetry packet received') {
  const now = new Date();
  const time = now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
  const id = '#NAVIC-' + String(9028 + logs.length - 4).padStart(4, '0');
  logs.unshift([id, time, '🐘 Elephant Herd Alpha (#EL-09)', 'Dooars KM-142', speed, event, action]);
  renderLogs();
}

$('add-log')?.addEventListener('click', () => addLog());

// JSON Exporter
$('export-json')?.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({
    project: 'JungleOrbit',
    constellation: 'ISRO NavIC S-Band/L5',
    generatedAt: new Date().toISOString(),
    auditCompliance: 'MoEFCC Verified',
    records: logs.map(r => ({
      packetId: r[0],
      timestamp: r[1],
      species: r[2],
      trackKm: r[3],
      speed: r[4],
      event: r[5],
      action: r[6]
    }))
  }, null, 2)], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jungleorbit-audit-moefcc.json';
  a.click();
  URL.revokeObjectURL(url);
});

// CSV Exporter
$('export-csv')?.addEventListener('click', () => {
  let csv = "data:text/csv;charset=utf-8,";
  csv += "Packet ID,Timestamp,Species,Track KM,Speed,Event,Action\n";
  logs.forEach(r => {
    csv += `"${r[0]}","${r[1]}","${r[2]}","${r[3]}","${r[4]}","${r[5]}","${r[6]}"\n`;
  });
  const url = encodeURI(csv);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jungleorbit-moefcc-audit.csv';
  a.click();
});

// INITIALIZATION
updateSelectedFrequency(1500, false);
calculateBrake();
setMissionDistance(missionDistance);
renderLogs();
initLeafletMap();

window.addEventListener('resize', () => {
  drawBrakeChart();
  drawMainWave();
});
