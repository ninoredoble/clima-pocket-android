/* ClimaPocket design study.
   Everything below is sample data produced by a few written rules.
   Nothing is measured, fetched or forecast. */
(() => {
  'use strict';

  // ---- The rules -----------------------------------------------------------
  const LAPSE = 6.5;          // °C lost per km of climb
  const DEW_COAST = 21.5;     // dew point at the coast, °C (invented)
  const METRES_PER_DEG = 125; // cloud base: metres per °C of dew-point gap
  const SUNRISE = 5.7, SUNSET = 17.7;

  const gauss = (h, mu, sd) => {
    let d = Math.abs(h - mu);
    d = Math.min(d, 24 - d);
    return Math.exp(-(d * d) / (2 * sd * sd));
  };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  const coastTemp = h => 26.5 + 4 * Math.cos(2 * Math.PI * (h - 14.5) / 24);
  const cloudBase = h => METRES_PER_DEG * (coastTemp(h) - DEW_COAST);
  const convection = h => gauss(h, 15.2, 3.2);
  const deckDepth = h => 300 + 500 * convection(h); // metres of cloud above its base

  function conditions(z, h) {
    const t = coastTemp(h) - LAPSE * z / 1000;
    const base = cloudBase(h);
    const top = base + deckDepth(h);
    const inCloud = z >= base - 15 && z <= top;
    const above = z > top;
    const gap = inCloud ? 0 : above ? 2 + (z - top) / 200 : (base - z) / METRES_PER_DEG;
    const td = t - gap;
    const rh = Math.min(100, 100 * Math.exp(17.625 * td / (243.04 + td) - 17.625 * t / (243.04 + t)));
    const rain = clamp(0.04 + (0.62 * gauss(h, 15.5, 2.6) + 0.1 * gauss(h, 4.5, 3)) * (0.55 + 0.9 * z / 1000), 0, 0.92);
    const wind = 6 + 8 * gauss(h, 13.5, 4) + 5 * z / 1000;
    const cover = clamp(0.15 + 0.8 * convection(h) + (inCloud ? 0.7 : 0), 0, 1);
    return { t, base, top, inCloud, above, rh, rain, wind, cover };
  }

  function describe(c, night) {
    if (c.inCloud) return night ? 'Misty night' : 'Wrapped in cloud';
    if (c.above) return 'Above the cloud';
    if (c.rain >= 0.6) return 'Showers likely';
    if (c.rain >= 0.35) return 'Showers building';
    if (c.cover < 0.35) return night ? 'Clear night' : 'Clear';
    if (c.cover < 0.7) return 'Partly cloudy';
    return 'Cloudy';
  }

  // ---- The slope -----------------------------------------------------------
  // Control points: [position 0..1 across the scene, elevation in metres].
  const PLACES = [
    { name: 'Carmen', x: 0.10, z: 25 },
    { name: 'Maramag', x: 0.40, z: 340 },
    { name: 'Malaybalay', x: 0.68, z: 620 },
    { name: 'Claveria', x: 0.90, z: 980 },
  ];
  const KNOTS = [[0, 0], ...PLACES.map(p => [p.x, p.z]), [1, 1060]];

  // Monotone cubic (Fritsch–Carlson) so the profile passes through every place.
  const slopes = (() => {
    const n = KNOTS.length, d = [], m = [];
    for (let i = 0; i < n - 1; i++) d[i] = (KNOTS[i + 1][1] - KNOTS[i][1]) / (KNOTS[i + 1][0] - KNOTS[i][0]);
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
    }
    return m;
  })();

  function elevationAt(x) {
    x = clamp(x, 0, 1);
    let i = 0;
    while (i < KNOTS.length - 2 && x > KNOTS[i + 1][0]) i++;
    const [x0, y0] = KNOTS[i], [x1, y1] = KNOTS[i + 1], h = x1 - x0, t = (x - x0) / h;
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * h * slopes[i] +
           (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * h * slopes[i + 1];
  }

  // ---- Scene geometry ------------------------------------------------------
  const W = 390, H = 250;
  const yOf = z => 224 - z * 0.14;
  const fmt = n => String(Math.round(n)).padStart(2, '0');
  const clock = h => { const m = Math.round(h * 4) * 15; return fmt(Math.floor(m / 60) % 24) + ':' + fmt(m % 60); };

  const KEYS = [ // hour, sky colour
    [0, '#0f1b31'], [4.8, '#1b2f48'], [6.2, '#e9a27c'], [8.5, '#86c0d8'],
    [12.5, '#4fa3d1'], [16.2, '#7fb4d0'], [17.8, '#e6a35e'], [18.9, '#3b4659'],
    [20.5, '#101c32'], [24, '#0f1b31'],
  ].map(([h, c]) => [h, hex(c)]);

  function hex(c) { return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); }
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const css = c => `rgb(${c.map(Math.round).join(',')})`;

  function skyAt(h) {
    let i = 0;
    while (i < KEYS.length - 2 && h > KEYS[i + 1][0]) i++;
    const [h0, c0] = KEYS[i], [h1, c1] = KEYS[i + 1];
    return mix(c0, c1, (h - h0) / (h1 - h0));
  }

  // ---- DOM ------------------------------------------------------------------
  const $ = id => document.getElementById(id);
  const el = {
    sky: $('sky'), sun: $('sun'), moon: $('moon'), stars: $('stars'),
    far: $('farRidge'), mid: $('midRidge'), near: $('nearRidge'), dots: $('stationDots'),
    cloud: $('cloud'), rain: $('rain'), pin: $('pin'), pinLabel: $('pinLabel'),
    scene: $('scene'), slope: $('slope'), hour: $('hour'),
    place: $('place'), sub: $('sub'), temp: $('temp'), cond: $('cond'), clock: $('clock'),
    sRain: $('sRain'), sHum: $('sHum'), sWind: $('sWind'), sBase: $('sBase'),
    nightBands: $('nightBands'), dry: $('dryBand'), bars: $('rainBars'),
    line: $('tempLine'), scrub: $('scrub'), dot: $('tempDot'),
    play: $('play'), places: $('places'), window: $('window'), live: $('live'),
  };
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // static pieces
  const ridgePath = (pts, bottom) => 'M' + pts.map(p => p.join(',')).join(' L') + ` L${W},${bottom} L0,${bottom} Z`;
  const wave = (base, amp, f, ph) => Array.from({ length: 27 }, (_, i) => {
    const x = i * 15;
    return [x, +(base - amp * (0.5 + 0.5 * Math.sin(x * f + ph)) - 0.12 * x * (1 - x / W)).toFixed(1)];
  });
  el.far.setAttribute('d', ridgePath(wave(150, 70, 0.021, 1.2), H));
  el.mid.setAttribute('d', ridgePath(wave(180, 60, 0.016, 3.1), H));
  const nearPts = Array.from({ length: 131 }, (_, i) => { const x = i * 3; return [x, +yOf(elevationAt(x / W)).toFixed(1)]; });
  el.near.setAttribute('d', ridgePath(nearPts, H));

  PLACES.forEach(p => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', p.x * W); c.setAttribute('cy', yOf(p.z)); c.setAttribute('r', 3.5);
    c.setAttribute('class', 'station');
    el.dots.appendChild(c);
  });

  const starSpots = [[30, 24], [74, 52], [118, 18], [160, 40], [205, 14], [248, 46], [290, 22], [330, 56], [364, 20], [52, 90], [190, 80], [312, 96]];
  starSpots.forEach(([x, y], i) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', i % 3 ? 1.2 : 1.8);
    el.stars.appendChild(c);
  });

  // chart (358 x 104)
  const CW = 358, CH = 92;
  const cx = h => h / 24 * CW;
  const cy = t => 9 + (32 - t) / 20 * 68;
  const bar = (x, w, cls) => { const r = document.createElementNS(NS, 'rect'); r.setAttribute('x', x); r.setAttribute('width', w); r.setAttribute('y', 0); r.setAttribute('height', CH); r.setAttribute('class', cls); return r; };
  el.nightBands.append(bar(0, cx(SUNRISE), 'night'), bar(cx(SUNSET), CW - cx(SUNSET), 'night'));
  const rainRects = Array.from({ length: 48 }, (_, i) => {
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', cx(i / 2) + 0.8); r.setAttribute('width', CW / 48 - 1.6); r.setAttribute('rx', 2);
    el.bars.appendChild(r);
    return r;
  });

  // places buttons
  const placeButtons = PLACES.map(p => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip';
    b.innerHTML = `${p.name}<span>${p.z} m</span>`;
    b.addEventListener('click', () => travel(p.x * 1000, null));
    el.places.appendChild(b);
    return b;
  });

  // ---- Render ---------------------------------------------------------------
  let s = 680, hour = 10; // s: 0..1000 across the slope
  let lastSummary = '';

  function dryWindow(z) {
    let best = null, start = null;
    for (let i = 0; i <= 96; i++) {
      const h = i * 0.25;
      const ok = i < 96 && h >= SUNRISE && h <= SUNSET && (() => { const c = conditions(z, h); return c.rain < 0.25 && !c.inCloud; })();
      if (ok && start === null) start = h;
      if (!ok && start !== null) { const len = h - start; if (!best || len > best[1] - best[0]) best = [start, h]; start = null; }
    }
    return best;
  }

  function cloudPath(base, thick) {
    const yb = yOf(base), bumps = [1, 0.62, 0.9, 0.5, 1, 0.74, 0.58, 0.95, 0.7];
    const step = (W + 40) / (bumps.length - 1);
    const pts = bumps.map((b, i) => [-20 + i * step, yb - thick * (0.72 + 0.28 * b)]);
    let d = `M-20,${yb.toFixed(1)} L${W + 20},${yb.toFixed(1)} L${W + 20},${pts[pts.length - 1][1].toFixed(1)}`;
    for (let i = pts.length - 1; i > 0; i--) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i - 1];
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      d += ` Q${x0.toFixed(1)},${(y0 - 8).toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
    }
    return d + ` L-20,${yb.toFixed(1)} Z`;
  }

  function render() {
    const z = elevationAt(s / 1000);
    const c = conditions(z, hour);
    const sky = skyAt(hour);
    const night = 1 - smooth(SUNRISE - 0.8, SUNRISE + 0.6, hour) * (1 - smooth(SUNSET - 0.9, SUNSET + 1.1, hour));
    const isNight = night > 0.55;

    // page + scene colours
    const root = document.documentElement.style;
    root.setProperty('--sky', css(sky));
    root.setProperty('--ground', css(mix(sky, [250, 252, 252], 0.86)));
    el.sky.style.fill = css(sky);
    el.far.style.fill = css(mix(sky, [22, 48, 31], 0.32));
    el.mid.style.fill = css(mix(sky, [22, 48, 31], 0.58));
    el.near.style.fill = css(mix(sky, [20, 44, 29], 0.86));
    const cloudCol = mix([255, 255, 255], sky, 0.1 + 0.75 * night);
    el.cloud.style.fill = css(cloudCol);
    el.stars.style.opacity = clamp(night * 1.2 - 0.2, 0, 1).toFixed(2);

    // sun and moon
    const arc = u => [30 + u * 330, 175 - 140 * Math.sin(Math.PI * u)];
    const su = (hour - SUNRISE) / (SUNSET - SUNRISE);
    const mu = ((hour - SUNSET + 24) % 24) / (24 - (SUNSET - SUNRISE));
    const [sx, sy] = arc(clamp(su, 0, 1)), [mx, my] = arc(clamp(mu, 0, 1));
    el.sun.setAttribute('cx', sx); el.sun.setAttribute('cy', sy);
    el.sun.style.opacity = su >= 0 && su <= 1 ? 1 : 0;
    el.moon.setAttribute('cx', mx); el.moon.setAttribute('cy', my);
    el.moon.style.opacity = su >= 0 && su <= 1 ? 0 : 1;

    // cloud deck and rain
    el.cloud.setAttribute('d', cloudPath(c.base, deckDepth(hour) * 0.14));
    const yb = yOf(c.base);
    let streaks = '';
    for (let i = 0; i < 24; i++) {
      const x = 10 + i * 16 + (i % 3) * 4;
      const ground = yOf(elevationAt(x / W));
      const top = Math.max(yb + 2, 0);
      if (ground - top > 10) streaks += `M${x},${top.toFixed(1)} L${(x - 5).toFixed(1)},${(ground - 3).toFixed(1)} `;
    }
    el.rain.setAttribute('d', streaks);
    el.rain.style.opacity = clamp((c.rain - 0.28) * 1.6, 0, 0.6).toFixed(2);

    // pin
    const px = s / 1000 * W, py = yOf(z);
    el.pin.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)})`);
    const near = PLACES.reduce((a, p) => Math.abs(p.x * 1000 - s) < Math.abs(a.x * 1000 - s) ? p : a);
    const atPlace = Math.abs(near.x * 1000 - s) < 24;
    const rounded = Math.round(z / 5) * 5;
    el.pinLabel.textContent = atPlace ? `${near.name} · ${near.z} m` : `${rounded} m`;
    const sw = el.scene.clientWidth, lw = el.pinLabel.offsetWidth;
    el.pinLabel.style.left = `${clamp(px / W * sw, lw / 2 + 8, sw - lw / 2 - 8).toFixed(1)}px`;
    el.pinLabel.style.top = `${(py / H * 100).toFixed(2)}%`;

    // readouts
    if (atPlace) {
      el.place.textContent = near.name;
      el.sub.textContent = `${near.z} m above sea level, approx.`;
    } else {
      const below = [...PLACES].reverse().find(p => p.x * 1000 < s), above = PLACES.find(p => p.x * 1000 > s);
      el.place.textContent = `${rounded} m up the slope`;
      el.sub.textContent = !below ? 'Between the coast and Carmen' : !above ? 'Above Claveria' : `Between ${below.name} and ${above.name}`;
    }
    el.temp.textContent = Math.round(c.t);
    const condText = describe(c, isNight);
    el.cond.textContent = condText;
    el.clock.textContent = clock(hour);
    el.sRain.textContent = `${Math.round(c.rain * 100)}%`;
    el.sHum.textContent = `${Math.round(c.rh)}%`;
    el.sWind.textContent = `${Math.round(c.wind)} km/h`;
    el.sBase.textContent = c.inCloud ? 'Here' : `${Math.round(c.base / 10) * 10} m`;

    el.slope.setAttribute('aria-valuetext', atPlace ? `${near.name}, ${near.z} metres` : `${rounded} metres, ${el.sub.textContent.toLowerCase()}`);
    el.hour.setAttribute('aria-valuetext', clock(hour));
    el.slope.value = s; el.hour.value = hour;

    // chart
    let line = '', win = dryWindow(z);
    for (let i = 0; i <= 96; i++) {
      const h = i * 0.25;
      line += (i ? 'L' : 'M') + cx(h).toFixed(1) + ',' + cy(coastTemp(h) - LAPSE * z / 1000).toFixed(1) + ' ';
    }
    el.line.setAttribute('d', line);
    rainRects.forEach((r, i) => {
      const p = conditions(z, i / 2 + 0.25).rain, bh = Math.max(2, p * 46);
      r.setAttribute('y', CH - bh); r.setAttribute('height', bh);
    });
    if (win) { el.dry.setAttribute('x', cx(win[0])); el.dry.setAttribute('width', cx(win[1]) - cx(win[0])); el.dry.style.opacity = 1; }
    else el.dry.style.opacity = 0;
    el.scrub.setAttribute('x1', cx(hour)); el.scrub.setAttribute('x2', cx(hour));
    el.dot.setAttribute('cx', cx(hour)); el.dot.setAttribute('cy', cy(c.t));
    el.window.textContent = win
      ? `Longest dry stretch in daylight at this height: ${clock(win[0])} to ${clock(win[1])}, rain chance under 25%.`
      : 'No daylight stretch at this height stays under a 25% rain chance.';

    placeButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(Math.abs(PLACES[i].x * 1000 - s) < 24)));

    const summary = `${el.place.textContent}, ${clock(hour)}: ${Math.round(c.t)} degrees, ${condText.toLowerCase()}, ${Math.round(c.rain * 100)} percent chance of rain.`;
    if (summary !== lastSummary) { lastSummary = summary; clearTimeout(render.t); render.t = setTimeout(() => { el.live.textContent = summary; }, 600); }
  }

  // ---- Motion ----------------------------------------------------------------
  let raf = 0, playing = false, last = 0;
  const ease = t => 1 - Math.pow(1 - t, 3);

  function travel(toS, toH) {
    stopPlay();
    if (reduced.matches) { if (toS !== null) s = toS; if (toH !== null) hour = toH; render(); return; }
    const fromS = s, fromH = hour, t0 = performance.now(), dur = 520;
    cancelAnimationFrame(raf);
    const step = now => {
      const t = clamp((now - t0) / dur, 0, 1), e = ease(t);
      if (toS !== null) s = fromS + (toS - fromS) * e;
      if (toH !== null) hour = fromH + (toH - fromH) * e;
      render();
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  function tick(now) {
    if (!playing) return;
    hour = (hour + (now - last) / 1000 * 1.5) % 24;
    last = now;
    render();
    raf = requestAnimationFrame(tick);
  }
  function startPlay() {
    if (reduced.matches) return;
    cancelAnimationFrame(raf);
    playing = true; last = performance.now();
    el.play.textContent = 'Pause';
    raf = requestAnimationFrame(tick);
  }
  function stopPlay() {
    playing = false; cancelAnimationFrame(raf);
    el.play.textContent = 'Play the day';
  }
  function syncMotion() { el.play.hidden = reduced.matches; if (reduced.matches) stopPlay(); }

  // ---- Entrances ---------------------------------------------------------------
  // Each part rises into place once as it enters. Skipped for reduced motion.
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.intro > *, .try, .phone, .how h2, .how-lede, .rules li, .about h2, .about-grid > div, .foot-name').forEach(node => {
      const siblings = [...node.parentElement.children];
      node.style.transitionDelay = `${siblings.indexOf(node) * 80}ms`;
      node.classList.add('rise');
      io.observe(node);
    });
  }

  // ---- Wiring ---------------------------------------------------------------
  el.slope.addEventListener('input', () => { stopPlay(); cancelAnimationFrame(raf); s = +el.slope.value; render(); });
  el.hour.addEventListener('input', () => { stopPlay(); cancelAnimationFrame(raf); hour = +el.hour.value; render(); });
  el.play.addEventListener('click', () => (playing ? stopPlay() : startPlay()));
  document.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => travel(+b.dataset.s, +b.dataset.h)));
  reduced.addEventListener('change', syncMotion);
  new ResizeObserver(() => render()).observe(el.scene);
  document.fonts.ready.then(render);
  syncMotion();
  render();
})();
