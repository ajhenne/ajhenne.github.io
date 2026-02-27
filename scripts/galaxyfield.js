const canvas = document.getElementById("galaxyfield");
const c = canvas.getContext("2d");

let w;
let h;

let warpspeed = 1;

const setCanvasExtents = () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
};

setCanvasExtents();

window.onresize = () => {
  setCanvasExtents();
};

const makegalaxys = count => {
  const out = [];
  for (let i = 0; i < count; i++) {
    let color;
    const r = Math.random();

    if (r > 0.9) { color = { r: 155, g: 176, b: 255 }; }
    else if (r > 0.7) { color = { r: 255, g: 255, b: 255 }; }
    else if (r > 0.4) { color = { r: 255, g: 244, b: 234 }; }
    else { color = { r: 255, g: 210, b: 161 }; }

    const s = {
      x: Math.random() * 1600 - 800,
      y: Math.random() * 900 - 450,
      z: Math.random() * 1000,
      color: color
    };
    out.push(s);
  }
  return out;
};

let galaxys = makegalaxys(2000);

const clear = () => {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
};

const putPixel = (x, y, brightness, color) => {
  const r = Math.floor(color.r * brightness);
  const g = Math.floor(color.g * brightness);
  const b = Math.floor(color.b * brightness);

  c.fillStyle = `rgb(${r}, ${g}, ${b})`;
  c.fillRect(x, y, 2, 2);
};

const movegalaxys = distance => {
  const count = galaxys.length;
  for (var i = 0; i < count; i++) {
    const s = galaxys[i];
    s.z -= distance;
    while (s.z <= 1) {
      s.z += 1000;
    }
  }
};

let prevTime;
const init = time => {
  prevTime = time;
  requestAnimationFrame(tick);
};

let bursts = [];

const spawnBurst = (galaxy) => {
  bursts.push({
    galaxy: galaxy,
    radius: 0,
    maxRadius: Math.random() * 60 + 20,
    alpha: 1,
    speed: Math.random() * 0.2 + 0.1
  });
};

const drawBursts = (elapsed, cx, cy) => {
  const dt = isNaN(elapsed) ? 16 : elapsed;

  for (let i = bursts.length - 1; i >= 0; i--) {
    let b = bursts[i];

    b.radius += b.speed * dt;
    b.alpha -= 0.0008 * dt;

    const jitter = Math.random() * 0.4 + 0.6;
    const flickrAlpha = b.alpha * jitter;

    if (b.alpha <= 0 || isNaN(b.radius) || b.radius <= 0) {
      bursts.splice(i, 1);
      continue;
    }

    try {
      const x = cx + b.galaxy.x / (b.galaxy.z * 0.001);
      const y = cy + b.galaxy.y / (b.galaxy.z * 0.001);

      const r = Math.max(0.1, b.radius);
      const gradient = c.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${flickrAlpha})`);
      gradient.addColorStop(0.1, `rgba(0, 150, 255, ${flickrAlpha * 0.7})`);
      gradient.addColorStop(0.4, `rgba(0, 50, 200, ${flickrAlpha * 0.2})`);
      gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

      c.fillStyle = gradient;
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    } catch (e) {
      bursts.splice(i, 1);
    }
  }
};

const tick = time => {
  let elapsed = time - prevTime;
  prevTime = time;

  const cx = w / 2;
  const cy = h / 2;

  if (Math.floor(Math.random() * 100) + 1 == 1) {
    const randomgalaxy = galaxys[Math.floor(Math.random() * galaxys.length)];
    const x = cx + randomgalaxy.x / (randomgalaxy.z * 0.001);
    const y = cy + randomgalaxy.y / (randomgalaxy.z * 0.001);
    if (x >= 0 && x < w && y >= 0 && y < h) {
      spawnBurst(randomgalaxy);
    }
  }

  movegalaxys(elapsed * 0.07 * warpspeed);
  clear();
  drawBursts(elapsed, cx, cy);

  const count = galaxys.length;
  for (var i = 0; i < count; i++) {
    const galaxy = galaxys[i];

    const x = cx + galaxy.x / (galaxy.z * 0.001);
    const y = cy + galaxy.y / (galaxy.z * 0.001);

    if (x < 0 || x >= w || y < 0 || y >= h) {
      continue;
    }

    const d = galaxy.z / 1000.0;
    const b = 1 - d * d;

    putPixel(x, y, b, galaxy.color);
  }

  requestAnimationFrame(tick);
};

requestAnimationFrame(init);