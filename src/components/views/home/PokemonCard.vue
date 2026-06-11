<
<template>
  <div
    class="slider"
    ref="sliderRef"
    @mousedown="onDragStart"
    @mousemove="onSliderMouseMove"
    @mouseup="onDragEnd"
    @mouseleave="onDragEnd"
    @touchstart.prevent="onDragStart"
    @touchmove.prevent="onSliderMouseMove"
    @touchend="onDragEnd"
  >
    <div class="arrow arrow-left" @click="prevCard" @mousedown.stop>‹</div>

    <div
      v-for="(card, index) in cards"
      :key="card.id"
      class="card-wrap"
      :style="wrapStyle(index)"
    >
      <div
        class="card-inner"
        :class="cardClass(index)"
        :ref="(el) => setCardRef(el, index)"
      >
        <img :src="card.image" class="card-img" draggable="false" />
        <!-- 基础卡/Trainer：眩光层 -->
        <div class="card__glare"></div>
        <!-- V卡：噪点纹理层 -->
        <div class="card-noise" v-if="index === 2"></div>
      </div>
    </div>

    <div class="arrow arrow-right" @click="nextCard" @mousedown.stop>›</div>

    <button
      class="fullscreen-trigger"
      @click.stop="openFullscreen"
      title="全屏查看"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
        />
      </svg>
    </button>
  </div>

  <Teleport to="body">
    <Transition name="card-fullscreen">
      <div
        v-if="isFullscreen"
        class="fullscreen-overlay"
        @click="closeFullscreen"
        :style="{
          '--noise-size': fullscreenNoiseSize + 'px',
          '--border-radius': fullscreenBorderRadius + 'px',
        }"
      >
        <button class="fullscreen-close" @click="closeFullscreen">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div
          class="fullscreen-slider"
          @click.stop
          @mousedown="onDragStart"
          @mousemove="onFullscreenMouseMove"
          @mouseup="onDragEnd"
          @mouseleave="onDragEnd"
          @touchstart.prevent="onDragStart"
          @touchmove.prevent="onFullscreenMouseMove"
          @touchend="onDragEnd"
        >
          <div class="arrow arrow-left" @click="prevCard" @mousedown.stop>
            ‹
          </div>

          <div
            v-for="(card, index) in cards"
            :key="card.id"
            class="card-wrap"
            :style="fullscreenWrapStyle(index)"
          >
            <div
              class="card-inner"
              :class="cardClass(index)"
              :ref="(el) => setFullscreenCardRef(el, index)"
            >
              <img :src="card.image" class="card-img" draggable="false" />
              <div class="card__glare"></div>
              <div class="card-noise" v-if="index === 2"></div>
            </div>
          </div>

          <div class="arrow arrow-right" @click="nextCard" @mousedown.stop>
            ›
          </div>
        </div>

        <span class="fullscreen-hint">按 ESC 键关闭</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  inject,
  watchEffect,
} from "vue";
import { asset } from "../../../utils/asset";

/* ---------- 配置 ---------- */
const GAP = 40;
const THRESHOLD = 60;
const MAX_IMG_W = 900;
const MAX_IMG_H = 520;
const BUFFER = 10;

const cards = ref([
  { id: 1, image: asset("images/cards/card1.png") },
  { id: 2, image: asset("images/cards/card2.jpg") },
  { id: 3, image: asset("images/cards/card3.jpg") },
]);

/* ---------- 预加载 ---------- */
const cardSizes = ref([]);
const sliderRef = ref(null);
const cardRefs = ref([]);

function preload(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      let w = MAX_IMG_W;
      let h = w / ratio;
      if (h > MAX_IMG_H) {
        h = MAX_IMG_H;
        w = h * ratio;
      }
      resolve({ w: Math.round(w), h: Math.round(h) });
    };
    img.onerror = () => resolve({ w: 300, h: 400 });
    img.src = src;
  });
}

onMounted(async () => {
  const loaded = await Promise.all(cards.value.map((c) => preload(c.image)));
  cardSizes.value = loaded;
});

/* ---------- 循环距离 ---------- */
const LEN = computed(() => cards.value.length);

function getDist(index, current) {
  let dist = index - current;
  const len = LEN.value;
  if (len <= 1) return 0;
  if (dist > len / 2) dist -= len;
  if (dist < -len / 2) dist += len;
  return dist;
}

/* ---------- 状态 ---------- */
const currentIndex = ref(0);
const isDragging = ref(false);
const dragStartX = ref(0);
const dragOffset = ref(0);

/* ---------- 3D 跟踪状态 ---------- */
let trackingState = "active";
let bufferTimer = null;

function clearBufferTimer() {
  if (bufferTimer) {
    clearTimeout(bufferTimer);
    bufferTimer = null;
  }
}

/* ---------- 3D 平滑旋转 ---------- */
const targetRotate = ref({ x: 0, y: 0 });
const currentRotate = ref({ x: 0, y: 0 });
let rafId = null;

function lerp(s, e, f) {
  return s + (e - s) * f;
}

function animate() {
  currentRotate.value.x = lerp(
    currentRotate.value.x,
    targetRotate.value.x,
    0.12,
  );
  currentRotate.value.y = lerp(
    currentRotate.value.y,
    targetRotate.value.y,
    0.12,
  );
  /* 主滑块卡片 */
  const card = cardRefs.value[currentIndex.value];
  if (card && !isDragging.value) {
    card.style.setProperty("--rx", `${currentRotate.value.x.toFixed(2)}deg`);
    card.style.setProperty("--ry", `${currentRotate.value.y.toFixed(2)}deg`);
  }
  /* 全屏卡片 */
  if (isFullscreen.value && !isDragging.value) {
    const fsCard = fullscreenCardRefs.value[currentIndex.value];
    if (fsCard) {
      fsCard.style.setProperty(
        "--rx",
        `${currentRotate.value.x.toFixed(2)}deg`,
      );
      fsCard.style.setProperty(
        "--ry",
        `${currentRotate.value.y.toFixed(2)}deg`,
      );
    }
  }
  rafId = requestAnimationFrame(animate);
}

/* 【新增】HomePage keep-alive 暂停/恢复 */
const pageActive = inject("isPageActive", ref(true));
watchEffect(() => {
  if (!pageActive.value) {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  } else if (!rafId) {
    rafId = requestAnimationFrame(animate);
  }
});

onMounted(() => {
  rafId = requestAnimationFrame(animate);
  window.addEventListener("keydown", handleFullscreenKeydown);
});
onUnmounted(() => {
  cancelAnimationFrame(rafId);
  clearBufferTimer();
  window.removeEventListener("keydown", handleFullscreenKeydown);
  window.removeEventListener("resize", calcFullscreenCardSize);
  document.body.style.overflow = "";
});

/* ---------- 卡片类型 class ---------- */
function cardClass(index) {
  if (index === 0) return "card-common";
  if (index === 1) return "card-trainer";
  if (index === 2) return "card-v";
  return "";
}

/* ============================================================
   【鼠标移动分发】拖动 和 3D 跟踪 完全分离
   ============================================================ */
function onSliderMouseMove(e) {
  if (isDragging.value) {
    onDragMove(e);
    return;
  }
  onCardMove(e);
}

/* ============================================================
   【3D 跟踪】检测范围扩大 10px，三种卡片效果不同
   ============================================================ */
function onCardMove(e) {
  const card = cardRefs.value[currentIndex.value];
  if (!card) return;

  const rect = card.getBoundingClientRect();
  const mx = e.clientX;
  const my = e.clientY;

  /* ---- 检测范围扩大 10px ---- */
  const inCard =
    mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;
  const inBuffer =
    mx >= rect.left - BUFFER &&
    mx <= rect.right + BUFFER &&
    my >= rect.top - BUFFER &&
    my <= rect.bottom + BUFFER;

  if (inCard) {
    clearBufferTimer();
    trackingState = "active";

    const x = (mx - rect.left) / rect.width;
    const y = (my - rect.top) / rect.height;

    /* 所有卡：眩光位置 + 3D 旋转 */
    card.style.setProperty("--x", `${x * 100}%`);
    card.style.setProperty("--y", `${y * 100}%`);
    targetRotate.value.x = (0.5 - y) * 30;
    targetRotate.value.y = (x - 0.5) * 30;

    /* Trainer / V卡：额外设置归一化坐标用于背景位移 */
    const idx = currentIndex.value;
    if (idx === 1 || idx === 2) {
      card.style.setProperty("--mx", x.toFixed(3));
      card.style.setProperty("--my", y.toFixed(3));
    }
  } else if (inBuffer) {
    if (trackingState === "active") {
      trackingState = "buffer";
      bufferTimer = setTimeout(() => {
        trackingState = "stopped";
        resetTilt();
      }, 3000);
    }
  } else {
    clearBufferTimer();
    trackingState = "stopped";
    resetTilt();
  }
}

function resetTilt() {
  targetRotate.value.x = 0;
  targetRotate.value.y = 0;
  const card = cardRefs.value[currentIndex.value];
  if (card) {
    card.style.setProperty("--x", "50%");
    card.style.setProperty("--y", "50%");
  }
}

/* ============================================================
   【拖动切换】
   ============================================================ */
function onDragStart(e) {
  isDragging.value = true;
  dragStartX.value = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  clearBufferTimer();
  trackingState = "stopped";
  resetTilt();
}

function onDragMove(e) {
  const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  dragOffset.value = clientX - dragStartX.value;
}

function onDragEnd() {
  if (!isDragging.value) return;
  isDragging.value = false;
  if (dragOffset.value < -THRESHOLD) {
    currentIndex.value = (currentIndex.value + 1) % LEN.value;
  } else if (dragOffset.value > THRESHOLD) {
    currentIndex.value = (currentIndex.value - 1 + LEN.value) % LEN.value;
  }
  dragOffset.value = 0;
}

/* ---------- 箭头切换 ---------- */
function prevCard() {
  clearBufferTimer();
  trackingState = "active";
  currentIndex.value = (currentIndex.value - 1 + LEN.value) % LEN.value;
  resetTilt();
}

function nextCard() {
  clearBufferTimer();
  trackingState = "active";
  currentIndex.value = (currentIndex.value + 1) % LEN.value;
  resetTilt();
}

/* ============================================================
   【全屏模式】
   ============================================================ */
const isFullscreen = ref(false);
const fullscreenCardSize = ref({ w: 600, h: 800 });
const fullscreenCardRefs = ref([]);

function setFullscreenCardRef(el, index) {
  if (el) fullscreenCardRefs.value[index] = el;
}

const fullscreenNoiseSize = computed(() => {
  const baseW = 300;
  const size = fullscreenCardSize.value.w;
  return Math.round(150 * (size / baseW));
});

const fullscreenBorderRadius = computed(() => {
  const baseW = 300;
  const size = fullscreenCardSize.value.w;
  return Math.round(20 * (size / baseW));
});

function resetFullscreenTilt() {
  targetRotate.value.x = 0;
  targetRotate.value.y = 0;
  const card = fullscreenCardRefs.value[currentIndex.value];
  if (card) {
    card.style.setProperty("--x", "50%");
    card.style.setProperty("--y", "50%");
  }
}

function onFullscreenMouseMove(e) {
  if (isDragging.value) {
    onDragMove(e);
    return;
  }
  const card = fullscreenCardRefs.value[currentIndex.value];
  if (!card) return;

  const rect = card.getBoundingClientRect();
  const mx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  const my = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

  const inCard =
    mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;

  if (inCard) {
    clearBufferTimer();
    trackingState = "active";

    const x = (mx - rect.left) / rect.width;
    const y = (my - rect.top) / rect.height;
    card.style.setProperty("--x", `${x * 100}%`);
    card.style.setProperty("--y", `${y * 100}%`);
    targetRotate.value.x = (0.5 - y) * 30;
    targetRotate.value.y = (x - 0.5) * 30;

    const idx = currentIndex.value;
    if (idx === 1 || idx === 2) {
      card.style.setProperty("--mx", x.toFixed(3));
      card.style.setProperty("--my", y.toFixed(3));
    }
  } else if (trackingState === "active") {
    trackingState = "buffer";
    bufferTimer = setTimeout(() => {
      trackingState = "stopped";
      resetFullscreenTilt();
    }, 1500);
  }
}

const calcFullscreenCardSize = () => {
  const sizes = cardSizes.value;
  if (!sizes.length) {
    fullscreenCardSize.value = { w: 600, h: 800 };
    return;
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const refSize = sizes[currentIndex.value] || sizes[0];
  const ratio = refSize.w / refSize.h;
  const hPad = 80;
  const vPad = 170;
  const maxW = vw - hPad * 2;
  const maxH = vh - vPad;
  let w, h;
  if (maxW / maxH > ratio) {
    h = maxH;
    w = h * ratio;
  } else {
    w = maxW;
    h = w / ratio;
  }
  fullscreenCardSize.value = { w: Math.round(w), h: Math.round(h) };
};

const openFullscreen = () => {
  isFullscreen.value = true;
  calcFullscreenCardSize();
  window.addEventListener("resize", calcFullscreenCardSize);
  document.body.style.overflow = "hidden";
};

const closeFullscreen = () => {
  isFullscreen.value = false;
  window.removeEventListener("resize", calcFullscreenCardSize);
  document.body.style.overflow = "";
};

const handleFullscreenKeydown = (e) => {
  if (e.key === "Escape" && isFullscreen.value) {
    closeFullscreen();
  }
};

function fullscreenWrapStyle(index) {
  const dist = getDist(index, currentIndex.value);
  const isActive = index === currentIndex.value;
  const isNeighbor = Math.abs(dist) === 1;
  const size = fullscreenCardSize.value;
  const vw = window.innerWidth;
  const offset = Math.round(vw / 2 + size.w / 2 + GAP);
  let x = 0;
  if (dist < 0) x -= offset;
  if (dist > 0) x += offset;
  if (!isActive && !isNeighbor) x += dist > 0 ? offset * 2 : -offset * 2;
  return {
    width: `${size.w}px`,
    height: `${size.h}px`,
    transform: `translate(calc(-50% + ${x}px), -50%)`,
    opacity: isActive ? 1 : 0,
    zIndex: isActive ? 10 : isNeighbor ? 5 : 0,
    pointerEvents: isActive ? "auto" : "none",
    transition:
      "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease",
  };
}

/* ---------- 卡片位移 ---------- */
function wrapStyle(index) {
  const dist = getDist(index, currentIndex.value);
  const isActive = index === currentIndex.value;
  const isNeighbor = Math.abs(dist) === 1;
  const size = cardSizes.value[index] || { w: 300, h: 400 };

  const sliderW = sliderRef.value?.offsetWidth || window.innerWidth;
  const maxCardW = Math.max(...cardSizes.value.map((s) => s.w), 300);
  const offset = Math.round(sliderW / 2 + maxCardW / 2 + GAP + 50);

  let x = dragOffset.value;
  if (dist < 0) x -= offset;
  if (dist > 0) x += offset;
  if (!isActive && !isNeighbor) x += dist > 0 ? offset * 2 : -offset * 2;

  return {
    width: `${size.w}px`,
    height: `${size.h}px`,
    transform: `translate(calc(-50% + ${x}px), -50%)`,
    opacity: isActive ? 1 : 0,
    zIndex: isActive ? 10 : isNeighbor ? 5 : 0,
    pointerEvents: isActive ? "auto" : "none",
    transition: isDragging.value
      ? "none"
      : "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease",
  };
}

function setCardRef(el, index) {
  if (el) cardRefs.value[index] = el;
}
</script>

<style scoped>
/* ============================================================
   【组件总高度】固定 600px，黑色背景
   ============================================================ */
.slider {
  position: relative;
  width: 100%;
  height: 600px;
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;
}

/* ============================================================
   【箭头】绝对定位，垂直居中
   ============================================================ */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 56px;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  z-index: 20;
  transition: color 0.2s;
}
.arrow-left {
  left: 20px;
}
.arrow-right {
  right: 20px;
}
.arrow:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* ============================================================
   【卡片外层】自适应尺寸，绝对定位居中
   ============================================================ */
.card-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ============================================================
   【卡片本体】3D 旋转容器
   ============================================================ */
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: var(--border-radius, 20px);
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  transform: perspective(1500px) rotateX(var(--rx, 0deg))
    rotateY(var(--ry, 0deg));
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: #141414;
}

/* ============================================================
   【效果 1/3】基础卡 (card-common)：仅眩光，无全息层
   ============================================================ */
.card-common .card__glare {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(
    farthest-corner circle at var(--x, 50%) var(--y, 50%),
    rgba(255, 255, 255, 0.7) 0%,
    rgba(255, 255, 255, 0.3) 25%,
    rgba(255, 255, 255, 0) 60%
  );
  mix-blend-mode: soft-light;
}
.card-common::before,
.card-common::after {
  display: none;
}

/* ============================================================
   【效果 2/3】Trainer Gallery (card-trainer)：
   彩虹膜 = 双层对角彩虹渐变 + 鼠标跟随流动
   ============================================================ */
.card-trainer::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  /* 【彩虹膜主层】宽条彩虹，模拟视频中的全息光栅 */
  background-image: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255, 0, 128, 0.28) 30%,
    rgba(255, 200, 0, 0.32) 38%,
    rgba(0, 255, 138, 0.32) 46%,
    rgba(0, 231, 255, 0.32) 54%,
    rgba(204, 76, 250, 0.28) 62%,
    transparent 80%
  );
  background-size: 250% 250%;

  /* 【关键】让彩虹膜跟随鼠标移动，产生视频里的倾斜流动感 */
  background-position: calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%);
  mix-blend-mode: color-dodge;
  opacity: 0.75;
}

.card-trainer::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;

  /* 【彩虹膜辅层】反向细条纹，增强膜感 */
  background-image: linear-gradient(
    -15deg,
    transparent 25%,
    rgba(255, 255, 255, 0.15) 35%,
    rgba(255, 0, 128, 0.15) 45%,
    rgba(0, 231, 255, 0.15) 55%,
    rgba(255, 255, 255, 0.15) 65%,
    transparent 75%
  );
  background-size: 300% 300%;
  background-position: calc((1 - var(--mx, 0.5)) * 100%)
    calc((1 - var(--my, 0.5)) * 100%);
  mix-blend-mode: overlay;
  opacity: 0.6;
}

.card-trainer .card__glare {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(
    farthest-corner circle at var(--x, 50%) var(--y, 50%),
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.1) 30%,
    transparent 60%
  );
  mix-blend-mode: soft-light;
}

/* ============================================================
   【效果 3/3】V卡 (card-v)：
   双向斜向全息渐变 + SVG噪点
   【修改】整体减淡，避免过曝闪眼
   ============================================================ */
.card-v::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image: linear-gradient(
    55deg,
    rgba(255, 0, 132, 0) 25%,
    rgba(255, 0, 132, 0.22) 40%,
    /* 【减淡】原 0.35 → 0.22 */ rgba(0, 255, 138, 0.22) 50%,
    /* 【减淡】原 0.35 → 0.22 */ rgba(0, 207, 255, 0.22) 60%,
    /* 【减淡】原 0.35 → 0.22 */ rgba(255, 0, 132, 0) 75%
  );
  background-size: 220% 220%;
  background-position: calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%);
  mix-blend-mode: color-dodge;
  opacity: 0.55; /* 【减淡】原 0.9 → 0.55 */
}

.card-v::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background-image: linear-gradient(
    -55deg,
    rgba(252, 164, 0, 0) 25%,
    rgba(252, 164, 0, 0.2) 40%,
    /* 【减淡】原 0.35 → 0.2 */ rgba(204, 76, 250, 0.2) 50%,
    /* 【减淡】原 0.35 → 0.2 */ rgba(0, 231, 255, 0.2) 60%,
    /* 【减淡】原 0.35 → 0.2 */ rgba(252, 164, 0, 0) 75%
  );
  background-size: 220% 220%;
  background-position: calc((1 - var(--mx, 0.5)) * 100%)
    calc((1 - var(--my, 0.5)) * 100%);
  mix-blend-mode: color-dodge;
  opacity: 0.5; /* 【减淡】原 0.85 → 0.5 */
}

/* V卡：SVG 噪点纹理层 */
.card-v .card-noise {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0.08; /* 【减淡】原 0.12 → 0.08 */
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-size: var(--noise-size, 150px) var(--noise-size, 150px);
}

.card-v .card__glare {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  background: radial-gradient(
    farthest-corner circle at var(--x, 50%) var(--y, 50%),
    rgba(255, 255, 255, 0.35) 0%,
    /* 【减淡】原 0.6 → 0.35 */ rgba(255, 255, 255, 0.08) 25%,
    /* 【减淡】原 0.15 → 0.08 */ transparent 55%
  );
  mix-blend-mode: soft-light;
}

/* ============================================================
   【全屏模式】覆盖层
   ============================================================ */
.fullscreen-trigger {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.35);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  transition: all 0.25s ease;
}
.fullscreen-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.9);
}
.fullscreen-trigger svg {
  width: 18px;
  height: 18px;
}

.fullscreen-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* 强制 2D 裁剪，防止 3D 旋转时 ::before/::after 溢出卡片 */
.fullscreen-overlay .card-inner {
  clip-path: inset(0 round var(--border-radius, 20px));
  background: #1a1a2e;
}

.fullscreen-slider {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;
}

.fullscreen-close {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: all 0.25s ease;
}
.fullscreen-close:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
}
.fullscreen-close svg {
  width: 22px;
  height: 22px;
}

.fullscreen-hint {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  z-index: 10001;
  letter-spacing: 0.05em;
}

/* 全屏过渡动画 */
.card-fullscreen-enter-active,
.card-fullscreen-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card-fullscreen-enter-from {
  opacity: 0;
}
.card-fullscreen-enter-from .fullscreen-slider {
  transform: scale(0.85);
}
.card-fullscreen-enter-from .fullscreen-close {
  opacity: 0;
  transform: scale(0.5) rotate(-180deg);
}
.card-fullscreen-enter-from .fullscreen-hint {
  opacity: 0;
}
.card-fullscreen-leave-to {
  opacity: 0;
}
.card-fullscreen-leave-to .fullscreen-slider {
  transform: scale(1.05);
}
.card-fullscreen-leave-to .fullscreen-close {
  opacity: 0;
}
.card-fullscreen-leave-to .fullscreen-hint {
  opacity: 0;
}
</style>
