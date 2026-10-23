/* Endurance — web homage of the 1983 endurance racer.
   Original pixel art, road and sounds. Not the Activision ROM. Solo only. */
(function () {
  "use strict";

  const W = 160;
  const H = 192;
  const ROAD_Y0 = 50;
  const ROAD_Y1 = 156;
  const NEAR = 8;
  const FAR = 130;
  const SCALE_FAR = NEAR / FAR;
  const HALF_BASE = 4;
  const HALF_GAIN = 54;
  const BOTTOM_HALF = HALF_BASE + HALF_GAIN;
  const TOP_U = 76;
  const DAY_LEN = 115;
  const CURVE_K = 0.008;
  const CURVE_DRAW = 0.032;
  const KM_RATE = 1.6;
  const HIT_X = 0.17;

  const KEYS = [
    { f: 0.00, sky: "#24103F", sky2: "#E4789A", mtn: "#1A1028", gnd: "#2C6A34", road: "#45454E", edge: "#F4F2E6", line: "#F0DC58", ice: 0, fog: 0, night: 0 },
    { f: 0.08, sky: "#2E6EBE", sky2: "#A9DFFF", mtn: "#2E6434", gnd: "#3C8A3A", road: "#55555F", edge: "#F7F7F2", line: "#F0DC58", ice: 0, fog: 0, night: 0 },
    { f: 0.22, sky: "#6EC6F0", sky2: "#E7F7FF", mtn: "#4E9A46", gnd: "#5EBE4A", road: "#686872", edge: "#FFFFFF", line: "#FFE45A", ice: 0, fog: 0, night: 0 },
    { f: 0.34, sky: "#B7CDD8", sky2: "#EEF5F8", mtn: "#D5E2E8", gnd: "#E7F0F4", road: "#D5DEE4", edge: "#8FA3B0", line: "#C3D0D6", ice: 0.15, fog: 0, night: 0 },
    { f: 0.40, sky: "#D5E2EA", sky2: "#F8FBFD", mtn: "#F2F6F8", gnd: "#F8FBFD", road: "#EEF3F6", edge: "#9AADBA", line: "#D5DEE4", ice: 1, fog: 0.04, night: 0 },
    { f: 0.52, sky: "#E4D2C0", sky2: "#F6EEE4", mtn: "#E4DCD4", gnd: "#F0E8E0", road: "#E8E0D8", edge: "#B0A498", line: "#DDD4C8", ice: 1, fog: 0, night: 0 },
    { f: 0.60, sky: "#E07030", sky2: "#F8C878", mtn: "#7A2844", gnd: "#3E6E2E", road: "#4A4A52", edge: "#F4F4F0", line: "#E8C44A", ice: 0, fog: 0, night: 0 },
    { f: 0.70, sky: "#1A1028", sky2: "#4A2848", mtn: "#140C18", gnd: "#14121A", road: "#1C1C24", edge: "#F0E6B0", line: "#5A5840", ice: 0, fog: 0, night: 0.4 },
    { f: 0.78, sky: "#07080E", sky2: "#141824", mtn: "#08090E", gnd: "#0A0C12", road: "#12141A", edge: "#F4F0C4", line: "#3A3828", ice: 0, fog: 0, night: 1 },
    { f: 0.84, sky: "#3C4652", sky2: "#8E98A2", mtn: "#4A545E", gnd: "#5A646E", road: "#6A727A", edge: "#D0D6DA", line: "#A8B0B4", ice: 0, fog: 1, night: 0.7 },
    { f: 0.92, sky: "#4A5460", sky2: "#9AA4AE", mtn: "#525C66", gnd: "#646E76", road: "#727A82", edge: "#D8DEE2", line: "#B0B6BA", ice: 0, fog: 1, night: 0.35 },
    { f: 0.97, sky: "#E09058", sky2: "#F8D8B0", mtn: "#5C3050", gnd: "#3E7834", road: "#4C4C54", edge: "#F4F4F0", line: "#F0D860", ice: 0, fog: 0.08, night: 0 },
    { f: 1.00, sky: "#F2B070", sky2: "#FFF0D0", mtn: "#6A3860", gnd: "#4C8E3A", road: "#52525A", edge: "#FFFFFF", line: "#FFE45A", ice: 0, fog: 0, night: 0 },
  ];

  const CAR_COLORS = ["#E24B3C", "#3A6AD4", "#F0D84A", "#3EAA58", "#F4F4F0", "#F09A3A", "#C86AD4"];

  const CAR_ROWS = [
    "......ssss......",
    "....ssssssss....",
    "...sbbbbbbbbb...",
    "...sbb++++bbs...",
    "..sbbbbbbbbbbs..",
    "..ssssssssssss..",
    "..ww.ssssss.ww..",
    "..rr.ssssss.rr..",
  ];

  const FONT = {
    A: ["010", "101", "111", "101", "101"],
    B: ["110", "101", "110", "101", "110"],
    C: ["111", "100", "100", "100", "111"],
    D: ["110", "101", "101", "101", "110"],
    E: ["111", "100", "110", "100", "111"],
    F: ["111", "100", "110", "100", "100"],
    G: ["111", "100", "101", "101", "111"],
    H: ["101", "101", "111", "101", "101"],
    I: ["111", "010", "010", "010", "111"],
    J: ["001", "001", "001", "101", "010"],
    K: ["101", "110", "100", "110", "101"],
    L: ["100", "100", "100", "100", "111"],
    M: ["101", "111", "101", "101", "101"],
    N: ["101", "111", "111", "101", "101"],
    O: ["111", "101", "101", "101", "111"],
    P: ["111", "101", "111", "100", "100"],
    Q: ["111", "101", "101", "111", "001"],
    R: ["110", "101", "110", "101", "101"],
    S: ["111", "100", "111", "001", "111"],
    T: ["111", "010", "010", "010", "010"],
    U: ["101", "101", "101", "101", "111"],
    V: ["101", "101", "101", "101", "010"],
    W: ["101", "101", "101", "111", "101"],
    X: ["101", "101", "010", "101", "101"],
    Y: ["101", "101", "010", "010", "010"],
    Z: ["111", "001", "010", "100", "111"],
    "0": ["111", "101", "101", "101", "111"],
    "1": ["010", "110", "010", "010", "111"],
    "2": ["111", "001", "111", "100", "111"],
    "3": ["111", "001", "111", "001", "111"],
    "4": ["101", "101", "111", "001", "001"],
    "5": ["111", "100", "111", "001", "111"],
    "6": ["111", "100", "111", "101", "111"],
    "7": ["111", "001", "001", "001", "001"],
    "8": ["111", "101", "111", "101", "111"],
    "9": ["111", "101", "111", "001", "111"],
    " ": ["000", "000", "000", "000", "000"],
    "-": ["000", "000", "111", "000", "000"],
  };

  const STARS = [
    [8, 6], [22, 14], [40, 4], [55, 18], [70, 8], [88, 3],
    [100, 16], [120, 7], [140, 12], [150, 4], [30, 22], [96, 11], [14, 28],
  ];

  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.imageSmoothingEnabled = false;

  const down = new Set();
  const touch = { left: false, right: false, gas: false, brake: false };
  let padLeft = false;
  let padRight = false;
  let padGas = false;
  let padBrake = false;
  let padStartEdge = false;
  let padWasButton = false;
  let pointerStart = false;
  let wasStart = false;

  const sfx = createSfx();
  const playerSprite = makeCar("#F4F1E6");
  const carSprites = CAR_COLORS.map(makeCar);

  let mode = "title";
  let day = 1;
  let dayT = 0;
  let quota = 50;
  let remaining = 50;
  let flagsUp = false;
  let km = 0;
  let speed = 0;
  let playerX = 0;
  let latV = 0;
  let playerZ = 0;
  let playerPrevZ = 0;
  let spawnZ = 70;
  let cars = [];
  let sparks = [];
  let invuln = 0;
  let crashT = 0;
  let trophyT = 0;
  let toast = "";
  let toastT = 0;
  let alarm = false;
  let warnT = 0.4;
  let demoT = 0;
  let celebrated = false;
  let bestKm = Number(storageGet("endurance-best-km", "0")) || 0;
  let bestDay = Number(storageGet("endurance-best-day", "0")) || 0;
  let roadbuster = storageGet("endurance-roadbuster") === "1";
  let muted = storageGet("endurance-muted") === "1";
  let rows = [];

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function storageGet(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }

  function hexToRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }

  function rgbToHex(c) {
    return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
  }

  function lerpHex(a, b, t) {
    const A = hexToRgb(a);
    const B = hexToRgb(b);
    return rgbToHex(A.map((v, i) => Math.round(v + (B[i] - v) * t)));
  }

  function shade(hex, f) {
    return rgbToHex(hexToRgb(hex).map((v) => Math.max(0, Math.min(255, Math.round(v * f)))));
  }

  function phaseAt(frac) {
    const f = clamp(frac, 0, 1);
    if (f >= 1) return blend(KEYS[KEYS.length - 1], KEYS[KEYS.length - 1], 0);
    let i = 0;
    while (i < KEYS.length - 2 && f >= KEYS[i + 1].f) i++;
    const a = KEYS[i];
    const b = KEYS[i + 1];
    return blend(a, b, (f - a.f) / (b.f - a.f));
  }

  function blend(a, b, t) {
    const n = (k) => a[k] + (b[k] - a[k]) * t;
    return {
      sky: lerpHex(a.sky, b.sky, t),
      sky2: lerpHex(a.sky2, b.sky2, t),
      mtn: lerpHex(a.mtn, b.mtn, t),
      gnd: lerpHex(a.gnd, b.gnd, t),
      road: lerpHex(a.road, b.road, t),
      edge: lerpHex(a.edge, b.edge, t),
      line: lerpHex(a.line, b.line, t),
      ice: n("ice"),
      fog: n("fog"),
      night: n("night"),
    };
  }

  function curveAt(z) {
    const s = z * 0.012;
    const fade = Math.min(1, z / 70);
    return fade * (Math.sin(s * 1.05) * 0.9 + Math.sin(s * 0.41 + Math.PI) * 0.42);
  }

  function quotaFor(d) { return d <= 1 ? 50 : 55; }

  function profile(d) {
    const rowsP = [
      { cruise: 0.30, spacing: 90, packP: 0, packN: 2, lane: true },
      { cruise: 0.36, spacing: 86, packP: 0, packN: 2, lane: true },
      { cruise: 0.42, spacing: 84, packP: 0, packN: 2, lane: true },
      { cruise: 0.46, spacing: 82, packP: 0, packN: 2, lane: true },
      { cruise: 0.50, spacing: 80, packP: 0, packN: 2, lane: true },
    ];
    return rowsP[Math.min(rowsP.length, d) - 1];
  }

  function paint(rowsIn, colorOf) {
    const h = rowsIn.length;
    const w = rowsIn[0].length;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d");
    const img = g.createImageData(w, h);
    const data = img.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const hex = colorOf(rowsIn[y][x]);
        if (!hex) continue;
        const i = (y * w + x) * 4;
        const rgb = hexToRgb(hex);
        data[i] = rgb[0];
        data[i + 1] = rgb[1];
        data[i + 2] = rgb[2];
        data[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }

  function makeCar(body) {
    const trim = shade(body, 0.55);
    const map = { s: trim, b: body, "+": "#14161C", w: "#101114", r: "#FF3A28", ".": null };
    return paint(CAR_ROWS, (ch) => map[ch] || null);
  }

  function ridge(x) {
    return 14 + Math.sin(x * 0.07) * 7 + Math.sin(x * 0.021 + 1.4) * 9 + Math.sin(x * 0.16) * 2.5;
  }

  function steerInput() {
    const l = down.has("ArrowLeft") || down.has("KeyA") || touch.left || padLeft;
    const r = down.has("ArrowRight") || down.has("KeyD") || touch.right || padRight;
    if (l === r) return 0;
    return l ? -1 : 1;
  }

  function gasHeld() {
    return down.has("Space") || down.has("KeyZ") || down.has("KeyX") || down.has("ArrowUp") || down.has("KeyW") || touch.gas || padGas;
  }

  function brakeHeld() {
    return down.has("ArrowDown") || down.has("KeyS") || touch.brake || padBrake;
  }

  function showToast(text, t) {
    toast = text;
    toastT = t || 1.4;
  }

  function saveBest() {
    const k = Math.floor(km);
    if (day > bestDay || (day === bestDay && k > bestKm)) {
      bestDay = day;
      bestKm = k;
      storageSet("endurance-best-day", String(bestDay));
      storageSet("endurance-best-km", String(bestKm));
    }
  }

  function startGame() {
    mode = "playing";
    day = 1;
    dayT = 0;
    quota = 50;
    remaining = 50;
    flagsUp = false;
    km = 0;
    speed = 0;
    playerX = 0;
    latV = 0;
    playerZ = 0;
    playerPrevZ = 0;
    spawnZ = 62;
    cars = [];
    sparks = [];
    invuln = 0;
    crashT = 0;
    trophyT = 0;
    alarm = false;
    warnT = 2;
    celebrated = false;
    showToast("DAY 1", 1.6);
  }

  function onDayAdvance() {
    day += 1;
    dayT = 0;
    quota = quotaFor(day);
    remaining = quota;
    flagsUp = false;
    warnT = 1.2;
    showToast("DAY " + day, 1.7);
    saveBest();
    if (day >= 5 && !celebrated) {
      celebrated = true;
      trophyT = 5.5;
      roadbuster = true;
      storageSet("endurance-roadbuster", "1");
      sfx.trophy();
    } else {
      sfx.salute();
    }
  }

  function endGame() {
    mode = "over";
    saveBest();
    sfx.over();
    sfx.engine(false, 0, 0, 0);
  }

  function addRemaining(d) {
    const prev = remaining;
    remaining = clamp(remaining + d, 0, 999);
    if (prev > 0 && remaining === 0) {
      flagsUp = true;
      sfx.flags();
    } else if (remaining > 0) {
      flagsUp = false;
    }
  }

  function spawnGroup(z, prof) {
    const pack = Math.random() < prof.packP;
    const n = pack ? prof.packN : 1;
    const sp = prof.cruise * TOP_U * (0.94 + Math.random() * 0.1);
    const lanes = [-0.66, -0.26, 0.26, 0.66];
    for (let i = 0; i < n; i++) {
      const x = pack
        ? -0.78 + (i + 0.5) * (1.56 / n) + (Math.random() - 0.5) * 0.05
        : lanes[(Math.random() * lanes.length) | 0] + (Math.random() - 0.5) * 0.1;
      cars.push({
        z: z + (pack ? i * 1.1 : 0),
        prevZ: z,
        x: clamp(x, -0.9, 0.9),
        speed: sp,
        sprite: carSprites[(Math.random() * carSprites.length) | 0],
        drift: (Math.random() * 2 - 1) * 0.03,
        ahead: true,
        bumped: false,
        overtaker: false,
      });
    }
  }

  function ensureTraffic(prof) {
    while (spawnZ < playerZ + 220) {
      spawnGroup(spawnZ, prof);
      spawnZ += prof.spacing * (0.78 + Math.random() * 0.44);
    }
  }

  function spawnOvertakers() {
    for (let i = 0; i < 5; i++) {
      const z = playerZ - 8 - i * 6;
      cars.push({
        z: z,
        prevZ: z,
        x: clamp(-0.62 + i * 0.31, -0.88, 0.88),
        speed: TOP_U * (0.76 + Math.random() * 0.16),
        sprite: carSprites[i % carSprites.length],
        drift: 0,
        ahead: false,
        bumped: false,
        overtaker: true,
      });
    }
  }

  function hitCar(car) {
    speed = Math.min(speed, 0.05);
    invuln = 1.25;
    crashT = 0.42;
    latV += playerX >= 0 ? 1.1 : -1.1;
    car.bumped = true;
    car.ahead = true;
    car.z = playerZ + 24;
    car.x = clamp(car.x + (car.x >= playerX ? 0.4 : -0.4), -0.9, 0.9);
    sfx.crash();
    spawnOvertakers();
    const px = W / 2 + playerX * BOTTOM_HALF;
    for (let i = 0; i < 8; i++) {
      sparks.push({
        x: px + Math.random() * 12 - 6,
        y: ROAD_Y1 - 6,
        vx: Math.random() * 50 - 25,
        vy: -18 - Math.random() * 36,
        t: 0.32 + Math.random() * 0.12,
        color: i % 2 ? "#FFE58A" : "#FFFFFF",
      });
    }
  }

  function resolveCars() {
    for (const car of cars) {
      const dz = car.z - playerZ;
      const prevDz = car.prevZ - playerPrevZ;
      if (invuln <= 0 && !car.overtaker && Math.abs(car.x - playerX) < HIT_X) {
        const a = Math.min(dz, prevDz);
        const b = Math.max(dz, prevDz);
        if (b > 3.5 && a < 11) {
          hitCar(car);
          continue;
        }
      }
      if (car.ahead && dz < 4) {
        car.ahead = false;
        if (!car.bumped) addRemaining(-1);
        car.bumped = false;
      } else if (!car.ahead && dz > 9) {
        car.ahead = true;
        addRemaining(1);
      }
    }
  }

  function updateSparks(dt) {
    for (const s of sparks) {
      s.t -= dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 90 * dt;
    }
    sparks = sparks.filter((s) => s.t > 0);
  }

  function moveCars(dt) {
    for (const car of cars) {
      car.prevZ = car.z;
      car.z += car.speed * dt;
      car.x += car.drift * dt;
      if (car.x > 0.9 || car.x < -0.9) car.drift = -car.drift;
      car.x = clamp(car.x, -0.92, 0.92);
      if (Math.random() < dt * 0.12) {
        car.drift = (Math.random() * 2 - 1) * 0.03;
      }
    }
  }

  function updateDemo(dt) {
    demoT += dt;
    speed = 0.5;
    playerX = Math.sin(demoT * 0.7) * 0.48;
    latV = 0;
    playerPrevZ = playerZ;
    playerZ += speed * TOP_U * dt;
    const prof = profile(1);
    moveCars(dt);
    ensureTraffic(prof);
    cars = cars.filter((c) => c.z > playerZ - 50 && c.z < playerZ + 250);
    sfx.engine(false, 0, 0, 0);
  }

  function updateRace(dt) {
    const frac = dayT / DAY_LEN;
    const phase = phaseAt(frac);
    const ice = phase.ice > 0.55;
    const steer = steerInput();
    latV += steer * (ice ? 8 : 18) * dt;
    latV -= latV * Math.min(1, (ice ? 2.0 : 6.2) * dt);

    const curve = curveAt(playerZ);
    const ds = speed * TOP_U * dt;
    playerX += latV * dt;
    playerX -= curve * ds * CURVE_K * (ice ? 1.2 : 1);
    playerX = clamp(playerX, -1.18, 1.18);

    const off = Math.abs(playerX) > 1;
    if (brakeHeld()) speed = Math.max(0, speed - 0.72 * dt);
    else if (gasHeld()) speed = Math.min(off ? 0.48 : 1, speed + (off ? 0.16 : 0.38) * dt);
    else if (off) speed = Math.max(0, speed - 0.28 * dt);
    const grit = off ? 1 : 0;

    playerPrevZ = playerZ;
    playerZ += ds;
    km += speed * KM_RATE * dt;

    const prof = profile(day);
    moveCars(dt);
    ensureTraffic(prof);
    resolveCars();
    cars = cars.filter((c) => c.z > playerZ - 80 && c.z < playerZ + 900);
    updateSparks(dt);

    if (invuln > 0) invuln -= dt;
    if (crashT > 0) crashT -= dt;

    dayT += dt;
    if (dayT >= DAY_LEN) {
      if (remaining <= 0) onDayAdvance();
      else endGame();
    }

    if (mode !== "playing") return;

    const timeLeft = 1 - clamp(dayT / DAY_LEN, 0, 1);
    const expected = quota * timeLeft;
    const behind = dayT / DAY_LEN > 0.14 && remaining > expected + 16;
    const dawnPanic = dayT / DAY_LEN > 0.94 && remaining > 0;
    alarm = behind || dawnPanic;
    warnT -= dt;
    if (alarm && warnT <= 0) {
      sfx.warn(dawnPanic);
      warnT = dawnPanic ? 0.26 : 0.5;
    }
    sfx.engine(true, speed, ice ? 1 : 0, grit);
  }

  function pollPad() {
    padLeft = false;
    padRight = false;
    padGas = false;
    padBrake = false;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let any = false;
    for (const p of pads) {
      if (!p) continue;
      const ax = p.axes[0] || 0;
      const ay = p.axes[1] || 0;
      if (ax < -0.35) padLeft = true;
      if (ax > 0.35) padRight = true;
      if (ay > 0.55) padBrake = true;
      if (p.buttons[14] && p.buttons[14].pressed) padLeft = true;
      if (p.buttons[15] && p.buttons[15].pressed) padRight = true;
      if (p.buttons[13] && p.buttons[13].pressed) padBrake = true;
      for (let i = 0; i < p.buttons.length && i < 8; i++) {
        if (p.buttons[i] && p.buttons[i].pressed) {
          any = true;
          padGas = true;
        }
      }
      if (p.buttons[9] && p.buttons[9].pressed) any = true;
    }
    if (any && !padWasButton) padStartEdge = true;
    padWasButton = any;
  }

  function update(dt) {
    pollPad();
    const start = gasHeld() || down.has("Enter") || pointerStart || padStartEdge;
    if ((mode === "title" || mode === "over") && start && !wasStart) startGame();
    wasStart = gasHeld() || down.has("Enter") || padWasButton;
    pointerStart = false;
    padStartEdge = false;

    if (toastT > 0) toastT -= dt;
    if (trophyT > 0) trophyT -= dt;

    if (mode === "title") updateDemo(dt);
    else if (mode === "playing") updateRace(dt);
    else {
      updateSparks(dt);
      sfx.engine(false, 0, 0, 0);
    }
  }

  function drawText(str, x, y, scale, color) {
    ctx.fillStyle = color;
    let cx = x;
    const s = String(str).toUpperCase();
    for (const ch of s) {
      const glyph = FONT[ch] || FONT[" "];
      for (let yy = 0; yy < glyph.length; yy++) {
        for (let xx = 0; xx < glyph[yy].length; xx++) {
          if (glyph[yy][xx] === "1") ctx.fillRect(cx + xx * scale, y + yy * scale, scale, scale);
        }
      }
      cx += 4 * scale;
    }
  }

  function textWidth(str, scale) {
    return String(str).length * 4 * scale - scale;
  }

  function drawTextOutlined(str, x, y, scale, color) {
    drawText(str, x + 1, y, scale, "#000000");
    drawText(str, x - 1, y, scale, "#000000");
    drawText(str, x, y + 1, scale, "#000000");
    drawText(str, x, y - 1, scale, "#000000");
    drawText(str, x, y, scale, color);
  }

  function drawCentered(str, y, scale, color, outline) {
    const x = Math.round((W - textWidth(str, scale)) / 2);
    if (outline) drawTextOutlined(str, x, y, scale, color);
    else drawText(str, x, y, scale, color);
  }

  function viewFrac() {
    if (mode === "title") return (demoT / 28) % 1;
    if (mode === "over") return 0.98;
    return clamp(dayT / DAY_LEN, 0, 1);
  }

  function buildRows() {
    rows = new Array(H);
    let x = 0;
    let prev = NEAR;
    for (let y = ROAD_Y1; y >= ROAD_Y0; y--) {
      const u = (y - ROAD_Y0) / (ROAD_Y1 - ROAD_Y0);
      const scale = SCALE_FAR + u * (1 - SCALE_FAR);
      const dist = NEAR / scale;
      if (y !== ROAD_Y1) {
        const h = dist - prev;
        x += curveAt(playerZ + (prev + dist) / 2) * h * CURVE_DRAW;
      }
      rows[y] = { y: y, dist: dist, scale: scale, roadX: x, half: HALF_BASE + scale * HALF_GAIN };
      prev = dist;
    }
  }

  function project(dist, roadX) {
    let y = ROAD_Y1;
    while (y > ROAD_Y0 && rows[y].dist < dist) y--;
    const row = rows[y];
    if (!row || dist > FAR + 4) return null;
    return {
      x: W / 2 + (row.roadX + roadX) * row.half,
      y: row.y,
      half: row.half,
      scale: row.scale,
    };
  }

  function drawLights(proj) {
    const w = Math.max(1, Math.round(proj.scale * 3));
    const gap = Math.max(1, Math.round(proj.half * 0.08));
    ctx.fillStyle = "#FF2E1E";
    const y = proj.y - w;
    ctx.fillRect(Math.round(proj.x - gap - w), y, w, w);
    ctx.fillRect(Math.round(proj.x + gap), y, w, w);
  }

  function renderWorld(phase) {
    for (let y = 0; y < ROAD_Y0; y++) {
      ctx.fillStyle = lerpHex(phase.sky, phase.sky2, y / ROAD_Y0);
      ctx.fillRect(0, y, W, 1);
    }

    if (phase.night > 0.72) {
      ctx.fillStyle = "#F4F4F0";
      const tw = Math.floor(demoT + dayT);
      for (let i = 0; i < STARS.length; i++) {
        if ((i + tw) % 5 === 0) continue;
        ctx.fillRect(STARS[i][0], STARS[i][1], 1, 1);
      }
    }

    const scroll = playerZ * 0.16 + playerX * 20;
    ctx.fillStyle = phase.mtn;
    for (let x = 0; x < W; x++) {
      const h = Math.max(2, Math.round(ridge(x + scroll)));
      ctx.fillRect(x, ROAD_Y0 - h, 1, h);
    }

    const fogAmt = clamp(phase.fog, 0, 1);
    const fogFar = FAR - (FAR - 34) * fogAmt;
    const fogCol = lerpHex(phase.sky2, "#D4DCE2", fogAmt);
    const gAlt = shade(phase.gnd, 0.9);

    if (phase.fog > 0.82) {
      ctx.fillStyle = fogCol;
      ctx.fillRect(0, 0, W, ROAD_Y0);
    }

    for (let y = ROAD_Y0; y <= ROAD_Y1; y++) {
      const row = rows[y];
      if (row.dist > fogFar) {
        ctx.fillStyle = fogCol;
        ctx.fillRect(0, y, W, 1);
        continue;
      }
      const band = Math.floor((playerZ + row.dist) / 10) % 2 === 0;
      ctx.fillStyle = band ? phase.gnd : gAlt;
      ctx.fillRect(0, y, W, 1);
      const cx = W / 2 + row.roadX * row.half;
      const left = Math.round(cx - row.half);
      const right = Math.round(cx + row.half);
      if (right <= left) continue;
      ctx.fillStyle = phase.road;
      ctx.fillRect(left, y, right - left, 1);
      ctx.fillStyle = phase.edge;
      ctx.fillRect(left, y, 1, 1);
      ctx.fillRect(right - 1, y, 1, 1);
      const z = playerZ + row.dist;
      if (right - left > 5 && Math.floor(z / 8) % 2 === 0) {
        ctx.fillStyle = phase.line;
        const lw = row.scale > 0.5 ? 2 : 1;
        ctx.fillRect(Math.round(cx) - (lw > 1 ? 1 : 0), y, lw, 1);
      }
      if (Math.floor(z / 16) % 2 === 0 && row.scale > 0.25) {
        ctx.fillStyle = phase.night > 0.6 ? "#F0E080" : gAlt;
        ctx.fillRect(left - 2, y, 1, 1);
        ctx.fillRect(right + 1, y, 1, 1);
      }
    }

    const visible = [];
    for (const car of cars) {
      const dist = car.z - playerZ;
      if (dist < 2.2 || dist > fogFar) continue;
      const proj = project(dist, car.x);
      if (!proj) continue;
      visible.push({ car: car, proj: proj, dist: dist });
    }
    visible.sort((a, b) => b.dist - a.dist);
    for (const item of visible) {
      const show = {
        x: item.proj.x,
        y: item.proj.y,
        half: item.proj.half,
        scale: Math.min(1, item.proj.scale * 0.7 + 0.22),
      };
      if (phase.night > 0.62) {
        drawLights(show);
        continue;
      }
      const spr = item.car.sprite;
      const dw = Math.max(3, Math.round(spr.width * show.scale));
      const dh = Math.max(2, Math.round(spr.height * show.scale));
      ctx.drawImage(spr, Math.round(show.x - dw / 2), show.y - dh + 1, dw, dh);
      if (phase.night > 0.28) drawLights(show);
    }

    const blink = invuln > 0 && Math.floor(invuln * 14) % 2 === 0;
    if (!blink) {
      const bob = Math.abs(playerX) > 1.02 && Math.floor(playerZ * 0.4) % 2 ? 1 : 0;
      const px = Math.round(W / 2 + playerX * BOTTOM_HALF - playerSprite.width / 2) + bob;
      const py = ROAD_Y1 - playerSprite.height - 1;
      ctx.drawImage(playerSprite, px, py);
    }

    for (const s of sparks) {
      ctx.fillStyle = s.color;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
    }
  }

  function drawFlags(x, y) {
    const frame = Math.floor((dayT + demoT) * 6) % 2;
    for (let i = 0; i < 4; i++) {
      const fx = x + i * 8;
      ctx.fillStyle = "#E8E6D8";
      ctx.fillRect(fx, y, 1, 12);
      ctx.fillStyle = frame ? "#3CB44A" : "#2C8A36";
      const dy = frame ? 1 : 0;
      ctx.fillRect(fx + 1, y + dy, 5, 3);
      ctx.fillStyle = "#8BE08A";
      ctx.fillRect(fx + 1, y + dy, 5, 1);
    }
  }

  function renderDash() {
    ctx.fillStyle = "#0C0C0E";
    ctx.fillRect(0, 157, W, H - 157);
    ctx.fillStyle = "#8A8A92";
    ctx.fillRect(0, 157, W, 1);

    const showKm = String(Math.floor(mode === "title" ? 0 : km)).padStart(5, "0");
    const showDay = String(mode === "title" ? 1 : day).padStart(2, "0");
    const showN = mode === "title" ? "050" : String(remaining).padStart(3, "0");

    drawText("MI", 4, 172, 1, "#8C8C94");
    drawText(showKm, 16, 166, 2, "#E8E230");
    drawText("DAY", 62, 172, 1, "#8C8C94");
    drawText(showDay, 80, 166, 2, "#F4F4F0");

    if (flagsUp && mode === "playing") {
      drawFlags(122, 168);
    } else {
      const hot = alarm && mode === "playing" && Math.floor((dayT + demoT) * 8) % 2 === 0;
      drawText(showN, 116, 164, 3, hot ? "#FF3B30" : "#F4F4F0");
    }
  }

  function renderOverlay() {
    if (toastT > 0 && toast) drawCentered(toast, 8, 1, "#E8E230", true);
    if (mode === "title") {
      drawCentered("ENDURANCE", 16, 2, "#E8E230", true);
      if (Math.floor(demoT * 2) % 2 === 0) drawCentered("PRESS FIRE", 36, 1, "#F4F4F0", true);
      if (bestDay > 0) {
        const best = "BEST " + String(bestDay).padStart(2, "0") + " " + String(bestKm).padStart(5, "0");
        drawCentered(best, 48, 1, "#F4F4F0", true);
      }
      if (roadbuster) drawCentered("ROADBUSTER", 60, 1, "#7DDC78", true);
    } else if (mode === "paused") {
      drawCentered("PAUSED", 36, 2, "#E8E230", true);
    } else if (mode === "over") {
      drawCentered("GAME OVER", 8, 2, "#E8E230", true);
      drawCentered("DAY " + String(day).padStart(2, "0"), 28, 1, "#F4F4F0", true);
      drawCentered("MI " + String(Math.floor(km)).padStart(5, "0"), 40, 1, "#F4F4F0", true);
      if (bestDay > 0) {
        drawCentered("BEST " + String(bestDay).padStart(2, "0") + " " + String(bestKm).padStart(5, "0"), 52, 1, "#F4F4F0", true);
      }
      if (Math.floor(Date.now() / 500) % 2 === 0) drawCentered("PRESS FIRE", 66, 1, "#F4F4F0", true);
    }
    if (trophyT > 0 && mode === "playing") {
      drawCentered("ROADBUSTER", 28, 1, "#7DDC78", true);
      drawTrophy(W / 2 - 4, 40);
    }
  }

  function drawTrophy(x, y) {
    ctx.fillStyle = "#E8E230";
    ctx.fillRect(x + 1, y, 6, 1);
    ctx.fillRect(x, y + 1, 8, 3);
    ctx.fillRect(x + 2, y + 4, 4, 1);
    ctx.fillRect(x + 3, y + 5, 2, 3);
    ctx.fillRect(x + 1, y + 8, 6, 2);
    ctx.fillStyle = "#F4F4F0";
    ctx.fillRect(x + 3, y + 2, 2, 2);
  }

  function render() {
    ctx.imageSmoothingEnabled = false;
    const phase = phaseAt(viewFrac());
    buildRows();
    const shake = crashT > 0 ? (Math.floor(crashT * 40) % 2 ? 1 : -1) : 0;
    ctx.save();
    if (shake) ctx.translate(shake, 0);
    renderWorld(phase);
    ctx.restore();
    renderDash();
    renderOverlay();
  }

  function createSfx() {
    let actx = null;
    let master = null;
    let engine = null;
    let oscA = null;
    let oscB = null;
    let oscC = null;
    let lfo = null;
    let lfoAmt = null;
    let iceGain = null;
    let gritGain = null;
    let shiftGain = null;
    let gear = -1;
    let rev = 0;
    let revAt = 0;
    let audioFailed = false;

    function unlock() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!actx) {
        actx = new AC();
        master = actx.createGain();
        master.gain.value = muted ? 0 : 0.2;
        master.connect(actx.destination);
      }
      if (actx.state === "suspended") actx.resume();
      master.gain.value = muted ? 0 : 0.2;
    }

    function lfsrBuffer(seconds) {
      const n = Math.floor(actx.sampleRate * seconds);
      const buf = actx.createBuffer(1, n, actx.sampleRate);
      const data = buf.getChannelData(0);
      let reg = 0x51;
      for (let i = 0; i < n; i++) {
        const bit = ((reg >> 0) ^ (reg >> 3) ^ (reg >> 5)) & 1;
        reg = ((reg >> 1) | (bit << 14)) & 0x7fff;
        data[i] = reg & 1 ? 0.55 : -0.55;
      }
      const src = actx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      return src;
    }

    function ensure() {
      if (audioFailed || engine || !actx) return;
      try {
      engine = actx.createGain();
      engine.gain.value = 0;
      engine.connect(master);

      const vca = actx.createGain();
      vca.gain.value = 0.72;
      shiftGain = actx.createGain();
      shiftGain.gain.value = 1;
      vca.connect(shiftGain);
      shiftGain.connect(engine);

      function voice(type, gain) {
        const o = actx.createOscillator();
        o.type = type;
        const g = actx.createGain();
        g.gain.value = gain;
        o.connect(g);
        g.connect(vca);
        o.start();
        return o;
      }

      oscA = voice("square", 0.2);
      oscB = voice("square", 0.06);
      oscC = voice("sawtooth", 0.045);

      lfo = actx.createOscillator();
      lfo.type = "square";
      lfo.frequency.value = 8;
      lfoAmt = actx.createGain();
      lfoAmt.gain.value = 0.4;
      lfo.connect(lfoAmt);
      lfoAmt.connect(vca.gain);
      lfo.start();

      iceGain = actx.createGain();
      iceGain.gain.value = 0;
      const iceFilter = actx.createBiquadFilter();
      iceFilter.type = "bandpass";
      iceFilter.frequency.value = 980;
      iceFilter.Q.value = 0.7;
      const iceSrc = lfsrBuffer(0.18);
      iceSrc.connect(iceFilter);
      iceFilter.connect(iceGain);
      iceGain.connect(master);
      iceSrc.start();

      gritGain = actx.createGain();
      gritGain.gain.value = 0;
      const gritFilter = actx.createBiquadFilter();
      gritFilter.type = "lowpass";
      gritFilter.frequency.value = 420;
      const gritSrc = lfsrBuffer(0.14);
      gritSrc.connect(gritFilter);
      gritFilter.connect(gritGain);
      gritGain.connect(master);
      gritSrc.start();
      } catch (err) {
        audioFailed = true;
        engine = null;
        console.warn("sfx", err && err.message);
      }
    }

    function tone(freq, dur, type, gain, delay) {
      if (!actx || muted) return;
      const t0 = actx.currentTime + (delay || 0);
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = type || "square";
      o.frequency.value = freq;
      g.gain.setValueAtTime(gain || 0.12, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      o.connect(g);
      g.connect(master);
      o.start(t0);
      o.stop(t0 + dur + 0.02);
    }

    function noise(dur, gain) {
      if (!actx || muted) return;
      const n = Math.floor(actx.sampleRate * dur);
      const buf = actx.createBuffer(1, n, actx.sampleRate);
      const data = buf.getChannelData(0);
      let reg = 0x2d;
      for (let i = 0; i < n; i++) {
        const bit = ((reg >> 0) ^ (reg >> 2) ^ (reg >> 4)) & 1;
        reg = ((reg >> 1) | (bit << 14)) & 0x7fff;
        data[i] = (reg & 1 ? 1 : -1) * (1 - i / n);
      }
      const src = actx.createBufferSource();
      const g = actx.createGain();
      src.buffer = buf;
      g.gain.value = gain || 0.4;
      src.connect(g);
      g.connect(master);
      src.start();
    }

    return {
      unlock: unlock,
      engine(on, spd, iceAmt, gritAmt) {
        if (!actx || audioFailed) return;
        try {
          ensure();
          if (!engine) return;
          const now = actx.currentTime;
          const s = clamp(spd || 0, 0, 1);
          const step = revAt ? Math.min(0.05, Math.max(0, now - revAt)) : 0.016;
          revAt = now;
          engine.gain.setTargetAtTime(on ? 0.92 : 0, now, on ? 0.05 : 0.04);
          if (!on) {
            gear = -1;
            rev = 0;
          } else if (rev < s) {
            rev = Math.min(s, rev + 0.18 * step);
          } else {
            rev = Math.max(s, rev + (s - rev) * Math.min(1, step / 0.45));
          }
          // Four automatic gears. The tach climbs slower than the car, so the
          // shifts land a little over a second apart, then fourth holds.
          const pace = on ? rev : 0;
          const edges = [0.22, 0.48, 0.74, 1];
          const loF = [42, 50, 58, 66];
          const hiF = [88, 104, 124, 150];
          const loP = [7, 9, 12, 16];
          const hiP = [14, 18, 24, 32];
          let g = 0;
          while (g < 3 && pace >= edges[g]) g++;
          const lo = g === 0 ? 0 : edges[g - 1];
          const span = edges[g] - lo;
          const t = span <= 0 ? 1 : clamp((pace - lo) / span, 0, 1);
          const shifted = on && gear >= 0 && g !== gear;
          if (shifted && shiftGain) {
            shiftGain.gain.cancelScheduledValues(now);
            shiftGain.gain.setValueAtTime(0.22, now);
            shiftGain.gain.linearRampToValueAtTime(1, now + 0.08);
            noise(0.045, g > gear ? 0.2 : 0.09);
          }
          if (on) gear = g;
          const f = loF[g] + (hiF[g] - loF[g]) * t;
          const glide = shifted ? 0.012 : 0.04;
          oscA.frequency.setTargetAtTime(f, now, glide);
          oscB.frequency.setTargetAtTime(f * 2.01, now, glide);
          oscC.frequency.setTargetAtTime(Math.max(24, f * 0.5), now, glide);
          lfo.frequency.setTargetAtTime(loP[g] + (hiP[g] - loP[g]) * t, now, glide);
          lfoAmt.gain.setTargetAtTime(0.5 - t * 0.22, now, 0.04);
          iceGain.gain.setTargetAtTime(on ? (iceAmt || 0) * (0.04 + s * 0.1) : 0, now, 0.08);
          gritGain.gain.setTargetAtTime(on ? (gritAmt || 0) * 0.2 : 0, now, 0.04);
        } catch (err) {
          audioFailed = true;
          console.warn("sfx", err && err.message);
        }
      },
      crash() {
        noise(0.34, 0.55);
        if (!actx || muted) return;
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = "sawtooth";
        const t0 = actx.currentTime;
        o.frequency.setValueAtTime(220, t0);
        o.frequency.exponentialRampToValueAtTime(48, t0 + 0.28);
        g.gain.setValueAtTime(0.22, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);
        o.connect(g);
        g.connect(master);
        o.start(t0);
        o.stop(t0 + 0.32);
      },
      warn(urgent) {
        tone(urgent ? 620 : 480, urgent ? 0.06 : 0.07, "square", 0.1);
        tone(urgent ? 420 : 300, urgent ? 0.07 : 0.08, "square", 0.08, 0.08);
      },
      flags() {
        tone(784, 0.08, "square", 0.12);
        tone(1174, 0.12, "square", 0.1, 0.09);
      },
      salute() {
        tone(523, 0.09, "square", 0.12);
        tone(659, 0.09, "square", 0.12, 0.1);
        tone(784, 0.09, "square", 0.12, 0.2);
        tone(1046, 0.16, "square", 0.12, 0.3);
      },
      trophy() {
        tone(523, 0.1, "square", 0.12);
        tone(659, 0.1, "square", 0.12, 0.11);
        tone(784, 0.1, "square", 0.12, 0.22);
        tone(1046, 0.12, "square", 0.12, 0.33);
        tone(784, 0.08, "square", 0.1, 0.48);
        tone(1174, 0.2, "square", 0.12, 0.58);
      },
      over() {
        tone(392, 0.12, "square", 0.12);
        tone(330, 0.14, "square", 0.12, 0.14);
        tone(262, 0.22, "square", 0.12, 0.3);
      },
      setMuted(v) {
        muted = v;
        if (master) master.gain.value = v ? 0 : 0.2;
      },
    };
  }

  window.addEventListener("keydown", (e) => {
    const controls = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "KeyW", "KeyA", "KeyS", "KeyD", "KeyZ", "KeyX", "Enter"];
    if (controls.includes(e.code)) e.preventDefault();
    down.add(e.code);
    sfx.unlock();
    if (e.code === "KeyP" && !e.repeat) {
      if (mode === "playing") mode = "paused";
      else if (mode === "paused") mode = "playing";
    }
    if (e.code === "Enter" && !e.repeat && mode === "paused") mode = "playing";
    if (e.code === "KeyM" && !e.repeat) {
      muted = !muted;
      storageSet("endurance-muted", muted ? "1" : "0");
      sfx.setMuted(muted);
      showToast(muted ? "MUTED" : "SOUND", 1);
    }
  });

  window.addEventListener("keyup", (e) => down.delete(e.code));
  window.addEventListener("blur", () => down.clear());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && mode === "playing") mode = "paused";
  });

  function sideOf(e) {
    const rect = canvas.getBoundingClientRect();
    return (e.clientX - rect.left) / rect.width < 0.5 ? "left" : "right";
  }

  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    sfx.unlock();
    if (mode === "title" || mode === "over") {
      pointerStart = true;
      return;
    }
    if (mode !== "playing") return;
    const side = sideOf(e);
    touch.left = side === "left";
    touch.right = side === "right";
    touch.gas = true;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!touch.gas || mode !== "playing") return;
    const side = sideOf(e);
    touch.left = side === "left";
    touch.right = side === "right";
  });

  function releasePointer() {
    touch.left = false;
    touch.right = false;
    touch.gas = false;
  }

  canvas.addEventListener("pointerup", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);

  for (const button of document.querySelectorAll(".pad button")) {
    const hold = button.dataset.hold;
    const press = (ev) => {
      ev.preventDefault();
      sfx.unlock();
      touch[hold] = true;
      if ((mode === "title" || mode === "over") && hold === "gas") pointerStart = true;
    };
    const release = () => { touch[hold] = false; };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointerleave", release);
    button.addEventListener("pointercancel", release);
  }

  let last = 0;
  function loop(now) {
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
