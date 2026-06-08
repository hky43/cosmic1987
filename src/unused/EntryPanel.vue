<template>
  <div
    class="wave-entry"
    :class="{
      merging: isMerging,
      blending: isBlending,
      revealing: isRevealing,
    }"
  >
    <canvas ref="cvs"></canvas>
    <div class="bg-transition"></div>

    <div class="enter-hint" v-if="!isMerging">
      <p>按任意键进入</p>
      <p class="sub">PRESS ANY KEY</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const cvs = ref(null);
const isMerging = ref(false); // 合并阶段
const isBlending = ref(false); // 融合阶段
const isRevealing = ref(false); // 揭示阶段

let ctx,
  animId,
  w,
  h,
  t = 0;
let mergeT = 0;

const TIME_SCALE = 0.9;
const LINE_COLOR = "rgba(0, 0, 0, 0.85)";
const SUB_LINE_COLOR = "rgba(0, 0, 0, 0.35)";

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
  const centerY = h / 2 + offsetY;
  return centerY + y * (1 - flatten);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  // 根据阶段设置背景
  let bgAlpha = 1;
  if (isBlending.value) {
    const blendProgress = Math.min((mergeT - 0.4) / 0.4, 1);
    bgAlpha = 1 - blendProgress * 0.95;
  } else if (isRevealing.value) {
    bgAlpha = 0.05;
  }
  ctx.fillStyle = `rgba(255, 255, 255, ${bgAlpha})`;
  ctx.fillRect(0, 0, w, h);

  ctx.lineCap = "round";

  if (!isMerging.value) {
    // 正常波动阶段：两条独立曲线
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = LINE_COLOR;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = getY(x, WAVE_A);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = SUB_LINE_COLOR;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = getY(x, WAVE_B);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  } else {
    mergeT = Math.min(mergeT + 0.006, 1);
    const centerY = h / 2;

    // ===== 阶段1：视角右移，右侧开始合并 (0 ~ 0.4) =====
    if (mergeT < 0.4) {
      const progress = easeOutCubic(mergeT / 0.4);

      // 视角右移量（像素）
      const viewShift = progress * w * 0.3;

      // 合并点从右侧向左移动（已合并区域）
      const mergePoint = w - progress * w * 0.8;

      // 波形逐渐压平
      const flatten = progress * 0.4;

      // 绘制未合并区域（右侧）- 两条独立曲线
      ctx.lineWidth = 1.5;

      // 波形A
      ctx.strokeStyle = LINE_COLOR;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const shiftedX = x + viewShift * 0.5; // 波形轻微跟随视角移动
        const y = getY(shiftedX, WAVE_A, flatten);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 波形B
      ctx.strokeStyle = SUB_LINE_COLOR;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const shiftedX = x + viewShift * 0.3;
        const y = getY(shiftedX, WAVE_B, flatten);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 在合并点位置画一个小圆点标记
      if (progress > 0.1) {
        const markerY =
          (getY(mergePoint, WAVE_A, flatten) +
            getY(mergePoint, WAVE_B, flatten)) /
          2;
        ctx.fillStyle = `rgba(0, 0, 0, ${0.6 * progress})`;
        ctx.beginPath();
        ctx.arc(mergePoint, markerY, 4 * progress, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // ===== 阶段2：从右向左逐步合并 (0.4 ~ 0.8) =====
    else if (mergeT < 0.8) {
      isBlending.value = true;
      const progress = easeInOutCubic((mergeT - 0.4) / 0.4);

      // 视角继续右移
      const viewShift = (0.3 + progress * 0.2) * w;

      // 合并点继续向左移动
      const mergePoint = w * (1 - 0.8) - progress * w * 0.2;

      // 波形继续压平
      const flatten = 0.4 + progress * 0.5;

      // 线条变粗
      const lineWidth = 1.5 + progress * 2;

      // 绘制已合并区域（左侧）- 合并成一条线
      const mergedAlpha = 0.85 - progress * 0.2;
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = `rgba(0, 0, 0, ${mergedAlpha})`;
      ctx.beginPath();

      for (let x = 0; x <= mergePoint; x += 2) {
        const shiftedX = x + viewShift * 0.6;
        const yA = getY(shiftedX, WAVE_A, flatten);
        const yB = getY(shiftedX, WAVE_B, flatten);
        const y = (yA + yB) / 2;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 绘制未合并区域（右侧）- 两条曲线逐渐靠近
      ctx.lineWidth = 1.5;

      // 波形A（右侧部分）
      const sideAlpha = 1 - progress * 0.7;
      ctx.strokeStyle = `rgba(0, 0, 0, ${sideAlpha})`;
      ctx.beginPath();
      for (let x = mergePoint; x <= w; x += 2) {
        const shiftedX = x + viewShift * 0.5;
        const y = getY(shiftedX, WAVE_A, flatten);
        x === mergePoint ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 波形B（右侧部分，逐渐变亮靠近A）
      const subAlpha = 0.35 + progress * 0.45;
      ctx.strokeStyle = `rgba(0, 0, 0, ${subAlpha})`;
      ctx.beginPath();
      for (let x = mergePoint; x <= w; x += 2) {
        const shiftedX = x + viewShift * 0.4;
        // 波形B向波形A靠拢
        const yA = getY(shiftedX, WAVE_A, flatten);
        const yB = getY(shiftedX, WAVE_B, flatten);
        const mixFactor = Math.min(
          1,
          ((x - mergePoint) / (w - mergePoint)) * 2,
        );
        const y = yB + (yA - yB) * mixFactor * progress;
        x === mergePoint ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 合并点光晕效果
      if (progress > 0.2) {
        const markerY = getY(mergePoint + viewShift * 0.5, WAVE_A, flatten);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * progress})`;
        ctx.beginPath();
        ctx.arc(mergePoint, markerY, 12 * progress, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(0, 0, 0, ${0.6 * progress})`;
        ctx.beginPath();
        ctx.arc(mergePoint, markerY, 5 * progress, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // ===== 阶段3：完全合并，融入背景 (0.8 ~ 1.0) =====
    else {
      isRevealing.value = true;
      const progress = easeOutCubic((mergeT - 0.8) / 0.2);

      // 波形完全压平
      const flatten = 0.9 + progress * 0.1;

      // 线条逐渐变细消失
      const lineWidth = 3.5 * (1 - progress * 0.7);
      const alpha = 0.55 * (1 - progress);

      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = `rgba(100, 100, 120, ${alpha})`;
      ctx.beginPath();

      // 波形缓慢下沉
      const sinkOffset = progress * h * 0.1;
      for (let x = 0; x <= w; x += 2) {
        const yA = getY(x, WAVE_A, flatten);
        const yB = getY(x, WAVE_B, flatten);
        const y = (yA + yB) / 2 + sinkOffset;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 完成过渡
      if (mergeT >= 1) {
        completeTransition();
        return;
      }
    }
  }

  t += 0.016;
  animId = requestAnimationFrame(draw);
}

function completeTransition() {
  sessionStorage.setItem("fromEntry", "true");
  router.push("/about-2-main");
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

function handleKeyPress(e) {
  if (isMerging.value) return;
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  if (
    [
      "Tab",
      "F5",
      "F12",
      "Escape",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ].includes(e.key)
  )
    return;
  e.preventDefault();
  isMerging.value = true;
}

onMounted(() => {
  ctx = cvs.value.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("keydown", handleKeyPress);
  draw();
});

onUnmounted(() => {
  window.removeEventListener("resize", resize);
  window.removeEventListener("keydown", handleKeyPress);
  cancelAnimationFrame(animId);
});
</script>

<style scoped>
.wave-entry {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 100;
  transition: none;
}

/* 合并阶段：平滑过渡 */
.wave-entry.merging {
  /* 合并动画由Canvas控制 */
}

/* 融合阶段：背景开始变暗 */
.wave-entry.blending {
  background: linear-gradient(to bottom, #fff 0%, #f5f5f8 50%, #eee 100%);
  transition: background 0.6s ease;
}

/* 揭示阶段：几乎透明，让下层内容显现 */
.wave-entry.revealing {
  background: rgba(10, 10, 15, 0.05);
  transition: background 0.4s ease;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* 背景过渡层 */
.bg-transition {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center bottom,
    rgba(10, 20, 40, 0) 0%,
    rgba(10, 20, 40, 0) 50%,
    rgba(10, 20, 40, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.8s ease;
}

.wave-entry.blending .bg-transition {
  opacity: 0.5;
}

.wave-entry.revealing .bg-transition {
  opacity: 1;
}

.enter-hint {
  position: fixed;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
  animation: hintPulse 2s ease-in-out infinite;
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
  z-index: 10;
}

.wave-entry.merging .enter-hint {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.enter-hint p {
  margin: 0;
  font-family: "Courier New", monospace;
  letter-spacing: 4px;
}

.enter-hint p:first-child {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 8px;
}

.enter-hint .sub {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  letter-spacing: 6px;
}

@keyframes hintPulse {
  0%,
  100% {
    opacity: 0.6;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px);
  }
}
</style>
