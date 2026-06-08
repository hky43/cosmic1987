<template>
  <canvas ref="cvs" class="wave-bg"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const cvs = ref(null);
let ctx,
  animId,
  w,
  h,
  t = 0;

const TIME_SCALE = 0.9;
const OPACITY = 0.5;

const WAVE_A = {
  layers: [
    { freq: 0.0022, amp: 0.22, speed: 0.35 },
    { freq: 0.0041, amp: 0.08, speed: 0.22 },
    { freq: 0.0075, amp: 0.03, speed: 0.48 },
  ],
};

const WAVE_B = {
  layers: [
    { freq: 0.0028, amp: 0.2, speed: 0.28 },
    { freq: 0.0052, amp: 0.07, speed: 0.55 },
    { freq: 0.009, amp: 0.03, speed: 0.18 },
  ],
};

function getY(x, wave, flatten = 0, offsetY = 0) {
  let y = 0;
  for (const L of wave.layers) {
    y += Math.sin(x * L.freq + t * L.speed * TIME_SCALE) * (h * L.amp);
  }
  const centerY = h * 0.75 + offsetY;
  return centerY + y * (1 - flatten);
}

function draw() {
  if (!ctx) {
    animId = requestAnimationFrame(draw);
    return;
  }

  if (!w || !h) {
    resize();
    if (!w || !h) {
      animId = requestAnimationFrame(draw);
      return;
    }
  }

  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = "round";
  ctx.lineWidth = 1.5;

  ctx.strokeStyle = `rgba(0, 0, 0, ${OPACITY})`;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 2) {
    const y = getY(x, WAVE_A);
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = `rgba(0, 0, 0, ${OPACITY * 0.45})`;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 2) {
    const y = getY(x, WAVE_B);
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  t += 0.016;
  animId = requestAnimationFrame(draw);
}

function resize() {
  const c = cvs.value;
  if (!c) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = c.getBoundingClientRect();
  w = rect.width;
  h = rect.height;
  c.width = w * dpr;
  c.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

onMounted(() => {
  ctx = cvs.value.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
  draw();
});

onUnmounted(() => {
  window.removeEventListener("resize", resize);
  cancelAnimationFrame(animId);
});
</script>

<style scoped>
.wave-bg {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: block;
  pointer-events: none;
}
</style>
