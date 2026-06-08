<
<template>
  <div>
    <div ref="containerRef" class="scroll-frame-page">
      <!-- 【修改1】高度从 600vh 改为 1800vh，拉长播放时间 -->
      <div class="scroll-spacer"></div>
    </div>

    <Teleport to="body">
      <canvas
        ref="canvasRef"
        class="frame-canvas"
        :class="{ 'is-hidden': !isVisible }"
      ></canvas>
      <div class="scroll-progress-bar" :class="{ 'is-hidden': !isVisible }">
        <div
          class="scroll-progress-fill"
          :style="{ width: scrollProgress + '%' }"
        ></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { asset } from "../../../utils/asset";

/* ======================== 帧配置 ======================== */
// 【修改2】帧总数从 198 改为 219
const FRAME_COUNT = 219;

const FRAME_PATH = "frames/";
const FRAME_PREFIX = "frame_";
const FRAME_DIGITS = 4;
const FRAME_EXT = ".jpg";

/* ======================== 发射事件 ======================== */
const emit = defineEmits(["progress-update", "visibility-update"]);

/* ======================== DOM 引用 ======================== */
const containerRef = ref(null);
const canvasRef = ref(null);

/* ======================== 状态 ======================== */
const frames = ref(new Array(FRAME_COUNT).fill(null));
const loadedCount = ref(0);
const currentIndex = ref(0);
const isVisible = ref(false);

let lastDrawnIdx = -1;
let renderRaf = null;
let io = null;
let lastEmitted = -1;

/* ======================== 性能配置 ======================== */
let lastRenderTime = 0;
const RENDER_THROTTLE = 16;
const CACHE_RANGE = 5;
const MAX_CACHE_SIZE = 40;

/* ======================== 计算属性 ======================== */
const scrollProgress = computed(() => {
  return Math.round((currentIndex.value / Math.max(1, FRAME_COUNT - 1)) * 100);
});

/* ======================== 路径生成函数 ======================== */
function getSrc(idx) {
  const frameNumber = String(idx + 1).padStart(FRAME_DIGITS, "0");
  return asset(`${FRAME_PATH}${FRAME_PREFIX}${frameNumber}${FRAME_EXT}`);
}

/* ======================== 帧加载 ======================== */
function loadFrame(idx) {
  if (idx < 0 || idx >= FRAME_COUNT) return;
  if (frames.value[idx] && frames.value[idx] !== "loading") return;

  frames.value[idx] = "loading";

  const img = new Image();
  const src = getSrc(idx);

  img.onload = () => {
    frames.value[idx] = img;
    loadedCount.value++;
    cleanupDistantFrames(currentIndex.value);
    if (idx === currentIndex.value) requestRender(true);
  };

  img.onerror = () => {
    if (idx < 5 || idx % 20 === 0) {
      console.warn(`[ScrollFrame] 帧 ${idx + 1} 加载失败: ${src}`);
    }
    frames.value[idx] = null;
  };

  img.src = src;
}

/* ======================== 确保可见帧已加载 ======================== */
function ensureVisibleFramesLoaded(idx) {
  const start = Math.max(0, idx - CACHE_RANGE);
  const end = Math.min(FRAME_COUNT - 1, idx + CACHE_RANGE);

  if (!frames.value[idx]) loadFrame(idx);

  for (let i = 1; i <= CACHE_RANGE; i++) {
    const prev = idx - i;
    const next = idx + i;
    if (prev >= start && !frames.value[prev]) loadFrame(prev);
    if (next <= end && !frames.value[next]) loadFrame(next);
  }
}

/* ======================== 清理远处帧（内存管理）======================== */
function cleanupDistantFrames(currentIdx) {
  const keepStart = Math.max(0, currentIdx - MAX_CACHE_SIZE / 2);
  const keepEnd = Math.min(FRAME_COUNT - 1, currentIdx + MAX_CACHE_SIZE / 2);

  let freedCount = 0;

  frames.value.forEach((img, idx) => {
    if (
      img &&
      img !== "loading" &&
      img instanceof Image &&
      (idx < keepStart || idx > keepEnd)
    ) {
      img.src = "";
      img.onload = null;
      img.onerror = null;
      frames.value[idx] = null;
      freedCount++;
    }
  });

  if (freedCount > 0) {
    console.debug(`[ScrollFrame] 内存清理: 释放 ${freedCount} 个远端帧`);
  }
}

/* ======================== Canvas 渲染 ======================== */
function drawCover(ctx, img, w, h) {
  if (!img || !img.complete || img.naturalWidth === 0) return false;

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = w / h;

  let sx, sy, sWidth, sHeight;

  if (imgRatio > canvasRatio) {
    sHeight = img.naturalHeight;
    sWidth = sHeight * canvasRatio;
    sx = (img.naturalWidth - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = img.naturalWidth;
    sHeight = sWidth / canvasRatio;
    sx = 0;
    sy = (img.naturalHeight - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, w, h);
  return true;
}

function render(force = false) {
  if (!isVisible.value && !force) return;

  const canvas = canvasRef.value;
  if (!canvas) return;

  const now = performance.now();
  if (!force && now - lastRenderTime < RENDER_THROTTLE) {
    return;
  }
  lastRenderTime = now;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;

  const displayWidth = w;
  const displayHeight = h;

  if (
    canvas.width !== displayWidth * dpr ||
    canvas.height !== displayHeight * dpr
  ) {
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);
    force = true;
  }

  const idx = currentIndex.value;
  if (!force && idx === lastDrawnIdx) return;

  const img = frames.value[idx];
  let drawn = false;

  if (img && img instanceof Image && img.complete && img.naturalWidth > 0) {
    drawCover(ctx, img, displayWidth, displayHeight);
    lastDrawnIdx = idx;
    drawn = true;
  } else {
    for (let off = 1; off <= CACHE_RANGE; off++) {
      const p = frames.value[idx - off];
      const n = frames.value[idx + off];

      if (p && p instanceof Image && p.complete && p.naturalWidth > 0) {
        drawCover(ctx, p, displayWidth, displayHeight);
        lastDrawnIdx = idx - off;
        drawn = true;
        break;
      }
      if (n && n instanceof Image && n.complete && n.naturalWidth > 0) {
        drawCover(ctx, n, displayWidth, displayHeight);
        lastDrawnIdx = idx + off;
        drawn = true;
        break;
      }
    }
  }

  if (!drawn) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, displayWidth, displayHeight);
    lastDrawnIdx = -1;
  }
}

function requestRender(force = false) {
  if (renderRaf) return;
  renderRaf = requestAnimationFrame(() => {
    render(force);
    renderRaf = null;
  });
}

/* ======================== 滚动逻辑 ======================== */
let updateProgressTimer = null;
function updateProgress() {
  if (updateProgressTimer) {
    cancelAnimationFrame(updateProgressTimer);
  }

  updateProgressTimer = requestAnimationFrame(() => {
    const el = containerRef.value;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const totalH = rect.height;
    const viewportH = window.innerHeight;

    let visible = rect.top < viewportH && rect.bottom > 0;
    if (currentIndex.value >= FRAME_COUNT - 1 && rect.top < -viewportH) {
      visible = false;
    }

    if (visible !== isVisible.value) {
      isVisible.value = visible;
    }

    const maxScroll = Math.max(1, totalH - viewportH);
    const progress = Math.max(0, Math.min(1, -rect.top / maxScroll));
    const idx = Math.floor(progress * (FRAME_COUNT - 1));

    const newIndex = Math.max(0, Math.min(FRAME_COUNT - 1, idx));

    if (newIndex !== currentIndex.value) {
      currentIndex.value = newIndex;
      ensureVisibleFramesLoaded(currentIndex.value);

      if (currentIndex.value % 10 === 0) {
        cleanupDistantFrames(currentIndex.value);
      }
    }

    if (Math.abs(progress - lastEmitted) > 0.005) {
      emit("progress-update", progress);
      lastEmitted = progress;
    }
    emit("visibility-update", visible);

    updateProgressTimer = null;
  });
}

function onScroll() {
  updateProgress();
  requestRender();
}

function onResize() {
  updateProgress();
  requestRender(true);
}

function setupIO() {
  io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          for (let i = 0; i < Math.min(60, FRAME_COUNT); i++) {
            if (!frames.value[i]) loadFrame(i);
          }
        }, 200);
      }
    },
    { threshold: 0, rootMargin: "50% 0px 50% 0px" },
  );
  if (containerRef.value) io.observe(containerRef.value);
}

/* ======================== 生命周期 ======================== */
onMounted(() => {
  for (let i = 0; i < Math.min(20, FRAME_COUNT); i++) loadFrame(i);
  setupIO();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  updateProgress();
  requestRender(true);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  if (renderRaf) cancelAnimationFrame(renderRaf);
  if (updateProgressTimer) cancelAnimationFrame(updateProgressTimer);
  if (io) io.disconnect();

  frames.value.forEach((img) => {
    if (img && img.src) {
      img.src = "";
    }
  });
  frames.value = new Array(FRAME_COUNT).fill(null);
});
</script>

<style scoped>
.scroll-frame-page {
  position: relative;
  width: 100%;
}
.scroll-spacer {
  width: 100%;
  /* 【修改3】高度从 600vh 改为 1800vh，219帧分摊到18屏，每屏约12帧，滚动更慢更顺滑 */
  height: 1800vh;
  position: relative;
  z-index: 1;
}
</style>

<style>
.frame-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  display: block;
  background: #000;
  opacity: 0.8;
  transition: opacity 0.05s linear;
}
.frame-canvas.is-hidden {
  opacity: 0;
  transition: opacity 0.5s ease-out;
  pointer-events: none;
}
.scroll-progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 11;
  pointer-events: none;
  opacity: 0.8;
  transition: opacity 0.05s linear;
}
.scroll-progress-bar.is-hidden {
  opacity: 0;
  transition: opacity 0.5s ease-out;
}
.scroll-progress-fill {
  height: 100%;
  background: #fff;
  will-change: width;
}
</style>
