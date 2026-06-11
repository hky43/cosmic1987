<template>
  <div class="wavy-container" ref="containerRef">
    <svg ref="svgRef"></svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, inject, watchEffect } from "vue";

/* ==================== Props ==================== */
const props = defineProps({
  xGap: { type: Number, default: 4 },
  yGap: { type: Number, default: 18 },
  stroke: { type: String, default: "#444444" }, // 【调亮】确保黑底看得见
  strokeWidth: { type: Number, default: 0.4 },
  bg: { type: String, default: "transparent" },
  mouseRadius: { type: Number, default: 200 },
  spring: { type: Number, default: 0.004 },
  damp: { type: Number, default: 0.92 },
  paused: { type: Boolean, default: false },

  // ========== 【波纹参数 —— 全部暴力加大】==========
  rippleSpeed: { type: Number, default: 28 },
  rippleAmplitude: { type: Number, default: 80 }, // 【力度核心】原来35，现在80
  rippleFrequency: { type: Number, default: 0.015 }, // 【调密】波环更密更可见
  rippleWidth: { type: Number, default: 60 }, // 【调锐】波前更窄更集中
  rippleInterval: { type: Number, default: 2.0 }, // 发射稍快
});

/* ==================== Simplex 噪声 ==================== */
class SimplexNoise {
  constructor(seed = Math.random()) {
    this.grad3 = [
      [1, 1, 0],
      [-1, 1, 0],
      [1, -1, 0],
      [-1, -1, 0],
      [1, 0, 1],
      [-1, 0, 1],
      [1, 0, -1],
      [-1, 0, -1],
      [0, 1, 1],
      [0, -1, 1],
      [0, 1, -1],
      [0, -1, -1],
    ];
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) this.p[i] = i;
    let val = seed * 12345;
    for (let i = 255; i > 0; i--) {
      val = (val * 16807) % 2147483647;
      const j = val % (i + 1);
      [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
    }
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }
  dot(g, x, y) {
    return g[0] * x + g[1] * y;
  }
  noise2D(xin, yin) {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s),
      j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t,
      Y0 = j - t;
    const x0 = xin - X0,
      y0 = yin - Y0;
    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    const x1 = x0 - i1 + G2,
      y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2,
      y2 = y0 - 1.0 + 2.0 * G2;
    const ii = i & 255,
      jj = j & 255;
    let n0 = 0,
      n1 = 0,
      n2 = 0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      t0 *= t0;
      n0 =
        t0 *
        t0 *
        this.dot(this.grad3[this.permMod12[ii + this.perm[jj]]], x0, y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      t1 *= t1;
      n1 =
        t1 *
        t1 *
        this.dot(
          this.grad3[this.permMod12[ii + i1 + this.perm[jj + j1]]],
          x1,
          y1,
        );
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      t2 *= t2;
      n2 =
        t2 *
        t2 *
        this.dot(
          this.grad3[this.permMod12[ii + 1 + this.perm[jj + 1]]],
          x2,
          y2,
        );
    }
    return 70.0 * (n0 + n1 + n2);
  }
}

/* ==================== 波纹对象 ==================== */
class Ripple {
  constructor(cfg) {
    this.radius = 0;
    this.speed = cfg.speed * (0.85 + Math.random() * 0.3);
    this.amp = cfg.amplitude * (0.8 + Math.random() * 0.4); // 64 ~ 112
    this.freq = cfg.frequency * (0.85 + Math.random() * 0.3);
    this.width = cfg.width * (0.8 + Math.random() * 0.4); // 48 ~ 84
    this.active = true;
  }
  update(dt, maxR) {
    this.radius += this.speed * dt;
    if (this.radius > maxR * 1.3) this.active = false;
  }
}

/* ==================== 状态 ==================== */
const containerRef = ref(null);
const svgRef = ref(null);
let lines = [];
let paths = [];
let rafId = null;
let cleaners = [];
let noise = null;
let cx = 0,
  cy = 0;
let maxDist = 0;
let resizeObs = null;

let ripples = [];
let nextRippleAt = 0;

const mouse = {
  x: -9999,
  y: -9999,
  lx: -9999,
  ly: -9999,
  sx: -9999,
  sy: -9999,
  v: 0,
  vs: 0,
  a: 0,
};

/* ==================== 网格构建 ==================== */
function setSize() {
  const el = containerRef.value;
  if (!el) return { width: 0, height: 0 };
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  if (w === 0 || h === 0) return { width: 0, height: 0 };
  svgRef.value.style.width = w + "px";
  svgRef.value.style.height = h + "px";
  cx = w / 2;
  cy = h / 2;
  maxDist = Math.hypot(cx, cy) * 1.5;
  return { width: w, height: h };
}

function buildGrid() {
  const { width, height } = setSize();
  if (width === 0 || height === 0) return;

  const svg = svgRef.value;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  lines = [];
  paths = [];

  const minSide = Math.min(width, height);
  const padX = minSide * 0.5; // 【加大】余量更大，防止大力波纹穿帮
  const padY = minSide * 0.5;

  const totalLines = Math.ceil((width + padX * 2) / props.xGap);
  const totalPoints = Math.ceil((height + padY * 2) / props.yGap);
  const xStart = (width - props.xGap * totalLines) / 2;
  const yStart = (height - props.yGap * totalPoints) / 2;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i <= totalLines; i++) {
    const pts = [];
    const baseX = xStart + props.xGap * i;
    for (let j = 0; j <= totalPoints; j++) {
      pts.push({
        ox: baseX,
        oy: yStart + props.yGap * j,
        x: baseX,
        y: yStart + props.yGap * j,
        cursor: { x: 0, y: 0, vx: 0, vy: 0 },
      });
    }
    lines.push(pts);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", props.stroke);
    path.setAttribute("stroke-width", props.strokeWidth);
    path.setAttribute("stroke-linecap", "round");
    fragment.appendChild(path);
    paths.push(path);
  }
  svg.appendChild(fragment);
}

function setPointer(clientX, clientY) {
  const rect = containerRef.value.getBoundingClientRect();
  mouse.x = clientX - rect.left;
  mouse.y = clientY - rect.top + window.scrollY;
}

/* ==================== 物理核心 ==================== */
let lastTime = 0;
let time = 0;

function updatePhysics(now) {
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
  lastTime = now;
  time += dt;

  /* ---- 鼠标平滑 ---- */
  mouse.sx += (mouse.x - mouse.sx) * 0.1;
  mouse.sy += (mouse.y - mouse.sy) * 0.1;
  const mdx = mouse.x - mouse.lx;
  const mdy = mouse.y - mouse.ly;
  const md = Math.hypot(mdx, mdy);
  mouse.v = md;
  mouse.vs += (md - mouse.vs) * 0.1;
  mouse.vs = Math.min(120, mouse.vs);
  mouse.lx = mouse.x;
  mouse.ly = mouse.y;
  mouse.a = Math.atan2(mdy, mdx);

  const limit = Math.max(props.mouseRadius, mouse.vs);
  const spring = props.spring;
  const damp = props.damp;

  /* ---- 发射新波纹 ---- */
  if (time > nextRippleAt) {
    ripples.push(
      new Ripple({
        speed: props.rippleSpeed,
        amplitude: props.rippleAmplitude,
        frequency: props.rippleFrequency,
        width: props.rippleWidth,
      }),
    );
    nextRippleAt = time + props.rippleInterval * (0.7 + Math.random() * 0.6);
  }

  /* ---- 更新波纹 ---- */
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update(dt, maxDist);
    if (!ripples[i].active) ripples.splice(i, 1);
  }

  /* ---- 逐点计算 ---- */
  const nScale = 0.0005;
  const nSpeed = 0.0001;
  const nStr = 1.0;

  lines.forEach((pts) => {
    pts.forEach((p) => {
      let dx = 0,
        dy = 0;

      // 1. 底层噪声蠕动
      const nx = p.ox * nScale + time * nSpeed;
      const ny = p.oy * nScale + time * nSpeed;
      dx += noise.noise2D(nx, ny) * nStr;
      dy += noise.noise2D(nx + 100, ny + 100) * nStr * 0.4;

      // 2. 中心扩散波纹（纯水平位移）
      const pdx = p.ox - cx;
      const pdy = p.oy - cy;
      const dist = Math.hypot(pdx, pdy);

      if (dist > 0.5 && ripples.length > 0) {
        let rippleX = 0;
        for (const r of ripples) {
          const dr = dist - r.radius;
          // 高斯包络
          const envelope = Math.exp(-(dr * dr) / (2 * r.width * r.width));
          const oscillation = Math.sin(dr * r.freq);
          rippleX += oscillation * r.amp * envelope;
        }

        // 【力度关键1】去掉 distFade，全屏均匀最大力度
        // 如果非要衰减，用下面这行（极弱）：
        // const distFade = Math.max(0.3, 1 - dist / maxDist); // 最低保留30%
        // dx += rippleX * distFade;

        dx += rippleX; // 不加衰减，全屏满力度
      }

      // 【力度关键2】放宽位移限制，和鼠标交互同级
      dx = Math.max(-150, Math.min(150, dx));

      p.x = p.ox + dx;
      p.y = p.oy + dy;

      // 3. 鼠标交互（保持原有）
      const mPdx = p.ox - mouse.sx;
      const mPdy = p.oy - mouse.sy;
      const pd = Math.hypot(mPdx, mPdy);

      if (pd < limit) {
        const s = 1 - pd / limit;
        const f = Math.cos(pd * 0.001) * s * limit * mouse.vs * 0.00065;
        p.cursor.vx += Math.cos(mouse.a) * f;
        p.cursor.vy += Math.sin(mouse.a) * f;
      }

      p.cursor.vx += (0 - p.cursor.x) * spring;
      p.cursor.vy += (0 - p.cursor.y) * spring;
      p.cursor.vx *= damp;
      p.cursor.vy *= damp;
      p.cursor.x += p.cursor.vx * 2;
      p.cursor.y += p.cursor.vy * 2;

      p.cursor.x = Math.min(150, Math.max(-150, p.cursor.x));
      p.cursor.y = Math.min(150, Math.max(-150, p.cursor.y));
    });
  });
}

/* ==================== 渲染 ==================== */
function moved(point, withCursor = true) {
  const x = point.x + (withCursor ? point.cursor.x : 0);
  const y = point.y + (withCursor ? point.cursor.y : 0);
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}

function render() {
  lines.forEach((pts, idx) => {
    const p0 = moved(pts[0], false);
    let d = `M ${p0.x} ${p0.y}`;

    for (let j = 1; j < pts.length - 1; j++) {
      const p = moved(pts[j], true);
      d += ` L ${p.x} ${p.y}`;
    }

    if (pts.length > 1) {
      const last = moved(pts[pts.length - 1], false);
      d += ` L ${last.x} ${last.y}`;
    }

    paths[idx].setAttribute("d", d);
  });
}

let lastFrame = 0;
const FRAME_INTERVAL = 1000 / 30;

function tick(now) {
  if (props.paused) {
    rafId = null;
    return;
  }
  if (now - lastFrame >= FRAME_INTERVAL) {
    updatePhysics(now);
    lastFrame = now;
  }
  render();
  rafId = requestAnimationFrame(tick);
}

/* ==================== 【新增】paused 动态暂停/恢复 ==================== */
watch(
  () => props.paused,
  (isPaused) => {
    if (!isPaused && !rafId) {
      // 从暂停恢复：重置时间防止 dt 爆冲，重新启动 RAF
      lastTime = 0;
      rafId = requestAnimationFrame(tick);
    }
  },
);
/* ================================================================= */

/* ==================== 【新增】HomePage keep-alive 暂停/恢复 ==================== */
const pageActive = inject("isPageActive", ref(true));
watchEffect(() => {
  if (!pageActive.value) {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  } else if (!props.paused && !rafId) {
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }
});
/* ================================================================= */

/* ==================== 生命周期 ==================== */
onMounted(() => {
  noise = new SimplexNoise(Math.random());
  buildGrid();
  nextRippleAt = 0.8;

  const onMove = (e) => setPointer(e.clientX, e.clientY);
  const onTouch = (e) => {
    e.preventDefault();
    setPointer(e.touches[0].clientX, e.touches[0].clientY);
  };

  window.addEventListener("mousemove", onMove);
  containerRef.value.addEventListener("touchmove", onTouch, { passive: false });

  resizeObs = new ResizeObserver(() => buildGrid());
  resizeObs.observe(containerRef.value);

  cleaners = [
    () => window.removeEventListener("mousemove", onMove),
    () => containerRef.value?.removeEventListener("touchmove", onTouch),
    () => resizeObs?.disconnect(),
  ];

  rafId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  cleaners.forEach((fn) => fn());
  lines = [];
  paths = [];
  ripples = [];
  noise = null;
  if (svgRef.value) {
    while (svgRef.value.firstChild)
      svgRef.value.removeChild(svgRef.value.firstChild);
  }
});
</script>

<style scoped>
.wavy-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: v-bind(bg);
  contain: layout style paint;
}

.wavy-container svg {
  display: block;
  width: 100%;
  height: 100%;
  will-change: contents;
  pointer-events: none;
}
</style>
