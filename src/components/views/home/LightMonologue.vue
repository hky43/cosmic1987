<template>
  <div
    class="matsuo-stage"
    ref="stageRef"
    tabindex="0"
    @keydown.stop="handleKeydown"
    v-bind="$attrs"
  >
    <!-- 1. 背景层（变色背景：phase=0隐藏，phase=1显示） -->
    <div
      class="bg-layer"
      :class="{ 'is-visible': phase >= 1 }"
      :style="{ background: currentBg }"
    ></div>

    <!-- 1.5 装饰背景图（phase=0隐藏，phase>=1显示在变色背景之上） -->
    <div
      class="bg-image-layer"
      :class="{ 'is-visible': phase >= 1 }"
      :style="{ backgroundImage: `url(${currentThemeData.bgImage})` }"
    ></div>

    <!-- 2. 白色剪切层（phase=1 弧形切入 / phase=2 扩展全屏） -->
    <div
      class="white-mask"
      :class="{ 'is-entering': phase === 1, 'is-exiting': phase >= 2 }"
    >
      <!-- 左侧白色块（跟随半圆弧形滑入） -->
      <div class="white-left-block"></div>
      <!-- 半圆弧形剪切层 -->
      <div class="white-curve"></div>
      <div
        v-if="phase >= 1"
        class="sticker-wrapper"
        :class="{ show: phase === 1, hide: phase >= 2 }"
      >
        <div
          class="sticker"
          :style="{ transform: `rotate(${currentSticker.rotate}deg)` }"
        >
          <span class="sticker-emoji">{{ currentSticker.emoji }}</span>
        </div>
      </div>
    </div>

    <!-- 3. 中央舞台 -->
    <main class="center-stage">
      <!-- 唱片组合体 -->
      <div
        class="record-combo"
        ref="sceneRef"
        :class="{ 'is-shifted': phase >= 1, 'is-exiting': phase >= 2 }"
        @mousedown.stop="startDrag"
        @touchstart.stop.prevent="startDrag"
        @wheel="handleWheel"
        @click.stop="handleRecordClick"
      >
        <div
          class="cover-block"
          :class="{ 'is-swallowing': isSwitching, 'is-shifted': phase >= 1 }"
        >
          <div class="cover-inner">
            <div class="cover-art">
              <img
                :src="themes[displayTheme].coverImage"
                class="cover-art-img"
                alt="cover"
              />
            </div>
          </div>
        </div>

        <div
          class="vinyl-disc"
          :class="{ 'is-locked': phase >= 1 }"
          :style="vinylStyle"
        >
          <img
            :src="themes[displayTheme].image"
            class="vinyl-img"
            alt="record"
            draggable="false"
          />
        </div>

        <div class="control-sector" v-if="phase === 0">
          <div class="sector-shape"></div>
          <div class="sector-arrows">
            <div class="arrow arrow-up">▲</div>
            <div class="arrow arrow-down">▼</div>
          </div>
        </div>
      </div>

      <!-- 文字介绍（phase=1 淡入 / phase=2 淡出） -->
      <div
        class="text-intro"
        :class="{ 'is-visible': phase >= 1, 'is-fading': phase >= 2 }"
      >
        <h2 class="intro-title">{{ currentThemeData.title }}</h2>
        <p class="intro-desc">{{ currentThemeData.desc }}</p>
        <a
          v-if="phase >= 1 && currentThemeData.url"
          class="navigate-btn"
          @click.stop.prevent="navigateTo(currentThemeData.url)"
        >
          <span>进入页面</span>
          <span class="btn-arrow">→</span>
        </a>
      </div>
    </main>

    <!-- 4. 底部提示 -->
    <footer class="bottom-bar" :class="{ 'is-fading': phase >= 1 }">
      <div class="phase-hint" v-if="phase === 0">
        <span>拖拽唱片或滚动切换 · 按 ENTER 进入</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { audioManager } from "../../../utils/audioManager";
import { asset } from "../../../utils/asset";

defineOptions({
  inheritAttrs: false,
  name: "CosmicRecordPlayer",
});

const props = defineProps({
  themeData: { type: Array, default: () => [] },
  autoNavigate: { type: Boolean, default: true },
  autoFocus: { type: Boolean, default: false },
});

const emit = defineEmits(["themeChange", "navigate", "phaseChange"]);

const router = useRouter();
const stageRef = ref(null);
const sceneRef = ref(null);

const phase = ref(0);
const rotation = ref(0);
const isDragging = ref(false);
const isSwitching = ref(false);

const currentTheme = ref(0);
const displayTheme = ref(0);

const startAngle = ref(0);
const lastRotation = ref(0);
const clickStartTime = ref(0);
let wheelTimeout = null;
let wheelRaf = null; // 【修复】滚轮动画帧节流标志

/* ========================
   【配置】defaultThemes
   【修复】补充 bg 属性，使 currentBg 不再永远返回 transparent
   ======================== */
const defaultThemes = [
  {
    angle: 0,
    title: "星际回响",
    desc: "从拜科努尔出发的第一声轰鸣。",
    bg: "linear-gradient(135deg, #0c1029 0%, #1c2349 100%)",
    bgImage: asset("/images/posters/海报01.png"),
    coverImage: asset("/images/albums/专辑一.png"),
    sticker: { emoji: "🚀", rotate: -8 },
    image: asset("/images/records/Record01.png"),
    url: "/travel-1",
    music: {
      id: "travel-theme",
      title: "星际旅行主题",
      url: asset("/music/The 1999 - 为了什么.mp3"),
    },
  },
  {
    angle: 90,
    title: "远航前夜",
    desc: "剥去热毯，封装一封无地址的深空信件。",
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    bgImage: asset("/images/posters/海报02.png"),
    coverImage: asset("/images/albums/专辑二.png"),
    sticker: { emoji: "📡", rotate: 5 },
    image: asset("/images/records/Record02.png"),
    url: "/about-2-main",
    music: {
      id: "about-theme",
      title: "关于我们主题",
      url: asset("/music/The 1999 - 冷空气.mp3"),
    },
  },
  {
    angle: 180,
    title: "暗室星图",
    desc: "在化学药水里定影的同一颗星辰。",
    bg: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)",
    bgImage: asset("/images/posters/海报03.png"),
    coverImage: asset("/images/albums/专辑三.png"),
    sticker: { emoji: "🌌", rotate: -4 },
    image: asset("/images/records/Record03.png"),
    url: "/cosmic-wave-3",
    music: {
      id: "cosmic-theme",
      title: "宇宙波纹主题",
      url: asset("/music/Brian Eno - Fine-grained.mp3"),
    },
  },
  {
    angle: 270,
    title: "唱片组曲",
    desc: "雨燕划过天空的轨迹迹。在银河系中的一粒微尘之上。",
    bg: "linear-gradient(135deg, #1e1e2f 0%, #2d2b55 100%)",
    bgImage: asset("/images/posters/海报04.png"),
    coverImage: asset("/images/albums/专辑四.png"),
    sticker: { emoji: "🪐", rotate: 7 },
    image: asset("/images/records/Record04.png"),
    url: "/future-4",
    music: {
      id: "future-theme",
      title: "未来纪元主题",
      url: asset("/music/The 1999 - 热茶炊.mp3"),
    },
  },
];

const themes = computed(() =>
  props.themeData.length ? props.themeData : defaultThemes,
);

const currentThemeData = computed(
  () => themes.value[currentTheme.value] || defaultThemes[0],
);
const currentBg = computed(() => currentThemeData.value.bg || "transparent");
const currentSticker = computed(() => currentThemeData.value.sticker);

const vinylStyle = computed(() => {
  if (isSwitching.value) {
    return {
      transform: `translate(-50%, -50%) translateX(-90px) scale(0.08) rotate(${rotation.value}deg)`,
      opacity: 0,
      transition: "all 0.25s cubic-bezier(0.23, 1, 0.32, 1)",
    };
  }
  return {
    transform: `translate(-50%, -50%) translateX(20px) rotate(${rotation.value}deg)`,
    opacity: 1,
    transition: isDragging.value
      ? "none"
      : "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
  };
});

watch(phase, (newVal, oldVal) => {
  emit("phaseChange", newVal);

  // 当进入 Phase 1 时，设置主题音乐模式并播放当前专题音乐
  if (newVal === 1 && oldVal === 0) {
    const themeMusic = currentThemeData.value.music;
    if (themeMusic && themeMusic.url) {
      audioManager.setThemeMusic(themeMusic, {
        fadeOutDuration: 500,
        fadeInDuration: 800,
        autoPlay: true,
      });
    }
  }

  // 当从 Phase 1 返回 Phase 0 时，恢复首页音乐
  if (newVal === 0 && oldVal === 1) {
    audioManager.restoreHomeMusic();
  }
});

// 在 Phase 1 中切换专题时，切换对应的专题音乐
watch(currentTheme, (newVal, oldVal) => {
  if (phase.value === 1 && newVal !== oldVal) {
    const themeMusic = themes.value[newVal]?.music;
    if (themeMusic && themeMusic.url) {
      audioManager.setThemeMusic(themeMusic, {
        fadeOutDuration: 400,
        fadeInDuration: 600,
        autoPlay: true,
      });
    }
  }
});

const performSwitch = () => {
  if (isSwitching.value) return;
  if (displayTheme.value === currentTheme.value) return;
  isSwitching.value = true;
  setTimeout(() => {
    displayTheme.value = currentTheme.value;
    setTimeout(() => {
      isSwitching.value = false;
    }, 60);
  }, 250);
};

const normalizeDelta = (delta) => {
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
};

const getAngle = (cx, cy, x, y) => (Math.atan2(y - cy, x - cx) * 180) / Math.PI;

const startDrag = (e) => {
  if (phase.value >= 1) return;
  isDragging.value = true;
  clickStartTime.value = Date.now();
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  const rect = sceneRef.value.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  startAngle.value = getAngle(cx, cy, x, y);
  lastRotation.value = rotation.value;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchmove", onDrag, { passive: false });
  document.addEventListener("touchend", endDrag);
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  e.preventDefault();
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  const rect = sceneRef.value.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const curAngle = getAngle(cx, cy, x, y);
  const delta = normalizeDelta(curAngle - startAngle.value);
  rotation.value = lastRotation.value + delta;
  updateCurrentTheme();
};

const endDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", endDrag);
  snapToNearest();
  if (currentTheme.value !== displayTheme.value) {
    performSwitch();
  }
};

// 用于跟踪已经预加载过的主题，避免重复加载
const preloadedThemes = new Set();

const updateCurrentTheme = () => {
  const norm = ((rotation.value % 360) + 360) % 360;
  let best = 0;
  let bestDist = Infinity;
  themes.value.forEach((t, i) => {
    let d = Math.abs(norm - t.angle);
    if (d > 180) d = 360 - d;
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  if (currentTheme.value !== best) {
    currentTheme.value = best;
    emit("themeChange", { index: best, theme: themes.value[best] });

    // 预加载相邻主题的资源
    const preloadAdjacentThemes = async () => {
      const themeCount = themes.value.length;
      const adjacentIndices = [
        (best - 1 + themeCount) % themeCount,
        (best + 1) % themeCount,
      ];

      for (const idx of adjacentIndices) {
        if (preloadedThemes.has(idx)) continue;

        const theme = themes.value[idx];
        try {
          const resources = [];
          if (theme.bgImage) resources.push(preloadImage(theme.bgImage));
          if (theme.coverImage) resources.push(preloadImage(theme.coverImage));
          if (theme.image) resources.push(preloadImage(theme.image));
          if (theme.music && theme.music.url)
            resources.push(preloadAudio(theme.music.url));

          await Promise.allSettled(resources);
          preloadedThemes.add(idx);
          console.log(`[LightMonologue] 主题 ${idx} 预加载完成`);
        } catch (error) {
          console.warn(`[LightMonologue] 主题 ${idx} 预加载失败:`, error);
        }
      }
    };

    preloadAdjacentThemes();
  }
};

const snapToNearest = () => {
  const target = themes.value[currentTheme.value].angle;
  const cur = rotation.value;
  rotation.value = target + Math.round((cur - target) / 360) * 360;
};

const rotateTo = (angle) => {
  const cur = ((rotation.value % 360) + 360) % 360;
  let diff = angle - cur;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  rotation.value += diff;
  updateCurrentTheme();
};

const nextTrack = () => {
  rotateTo(themes.value[(currentTheme.value + 1) % themes.value.length].angle);
  performSwitch();
};

const prevTrack = () => {
  rotateTo(
    themes.value[
      (currentTheme.value + themes.value.length - 1) % themes.value.length
    ].angle,
  );
  performSwitch();
};

const handleRecordClick = () => {
  const dragDuration = Date.now() - clickStartTime.value;
  if (dragDuration > 200 || Math.abs(rotation.value - lastRotation.value) > 5)
    return;
  if (phase.value >= 1 && currentThemeData.value.url) {
    navigateTo(currentThemeData.value.url);
    return;
  }
  phase.value = 1;
};

// 预加载图片函数
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};

// 预加载音频函数
const preloadAudio = (src) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.oncanplaythrough = resolve;
    audio.onerror = reject;
    audio.src = src;
    // 即使没有完全加载完成，也在一定时间后resolve，避免阻塞
    setTimeout(resolve, 2000);
  });
};

const navigateTo = async (url) => {
  if (phase.value >= 2) return;
  emit("navigate", {
    index: currentTheme.value,
    theme: currentThemeData.value,
    url,
  });
  if (props.autoNavigate && url) {
    console.log("[LightMonologue] 准备跳转到:", url);

    // 保存主题和音乐状态到 sessionStorage
    sessionStorage.setItem("themeMusicActive", "true");
    sessionStorage.setItem("currentThemeIndex", currentTheme.value.toString());
    const themeMusic = currentThemeData.value.music;
    if (themeMusic) {
      sessionStorage.setItem("currentThemeMusic", JSON.stringify(themeMusic));
    }

    // 确保 audioManager 已经设置好主题音乐
    if (themeMusic && themeMusic.url) {
      audioManager.setThemeMusic(themeMusic, {
        fadeOutDuration: 500,
        fadeInDuration: 800,
        autoPlay: true,
      });
    }

    // 直接跳转，预加载统一由目标页面 PagePreloader 处理
    console.log("[LightMonologue] 跳转:", url);
    try {
      await router.push(url);
    } catch (err) {
      console.error("[LightMonologue] 跳转失败:", err);
    }
  }
};

const handleKeydown = (e) => {
  if (phase.value >= 2) return;
  if (e.key === "Enter") {
    e.preventDefault();
    if (phase.value < 1) {
      phase.value = 1;
    } else if (phase.value === 1) {
      if (currentThemeData.value.url) {
        navigateTo(currentThemeData.value.url);
      }
    }
  }
  if (e.key === "Escape") {
    e.preventDefault();
    if (phase.value > 0) phase.value = 0;
  }
  if (phase.value >= 1) {
    if (e.key === "ArrowLeft") prevTrack();
    if (e.key === "ArrowRight") nextTrack();
  }
};

/* 【修复】滚轮事件增加 requestAnimationFrame 节流，防止快速滚动时数值爆炸 */
const handleWheel = (e) => {
  if (phase.value !== 0) return;
  e.preventDefault();
  e.stopPropagation();

  if (wheelRaf) return;
  wheelRaf = requestAnimationFrame(() => {
    rotation.value += e.deltaY * 0.15;
    updateCurrentTheme();
    wheelRaf = null;
  });

  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    snapToNearest();
    if (currentTheme.value !== displayTheme.value) {
      performSwitch();
    }
  }, 300);
};

defineExpose({
  reset: () => {
    phase.value = 0;
    rotation.value = 0;
    currentTheme.value = 0;
    displayTheme.value = 0;
  },
  focusStage: () => {
    stageRef.value?.focus();
  },
  getCurrentTheme: () => currentThemeData.value,
});

onMounted(() => {
  if (props.autoFocus) {
    stageRef.value?.focus();
  }
  updateCurrentTheme();
});

onUnmounted(() => {
  clearTimeout(wheelTimeout);
  if (wheelRaf) cancelAnimationFrame(wheelRaf);
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", endDrag);
  // 【安全措施】手动清理可能残留的全局遮罩
  const globalMasks = document.querySelectorAll(".global-white-mask");
  globalMasks.forEach((mask) => {
    mask.remove();
  });
  // 也清理可能存在的 white-fade 元素
  const fadeElements = document.querySelectorAll(
    ".white-fade-leave-active, .white-fade-enter-active",
  );
  fadeElements.forEach((el) => {
    el.remove();
  });
  // 清理预加载遮罩
  const preloadMasks = document.querySelectorAll(".preloader-overlay");
  preloadMasks.forEach((mask) => {
    mask.remove();
  });
});
</script>

<style scoped>
.matsuo-stage {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 480px;
  overflow: hidden;
  outline: none;
  border-radius: inherit;
  box-sizing: border-box;
  isolation: isolate;
}

/* ========================
   【修复】背景层：规范 z-index，phase=1时显示
   ======================== */
.bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0;
  transition:
    opacity 0.8s ease,
    background 0.8s ease;
}
.bg-layer.is-visible {
  opacity: 1;
}

/* ========================
   【修复】装饰背景图：z-index 改为整数 1
   ======================== */
.bg-image-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.bg-image-layer.is-visible {
  opacity: 1;
}

/* ========================
   【修复】白色剪切层：z-index 改为整数 2
   ======================== */
.white-mask {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
  transform: translateX(-100%);
  transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.white-left-block {
  position: absolute;
  left: 0;
  top: 0;
  width: 45%;
  height: 100%;
  background: white;
  z-index: 1;
}
.white-curve {
  position: absolute;
  top: 0;
  left: 45%;
  width: 100%;
  height: 100%;
  background: white;
  clip-path: circle(50% at 0% 50%);
  z-index: 2;
}
.white-mask.is-entering {
  transform: translateX(-45%);
}
.white-mask.is-exiting {
  transform: translateX(0);
}
.sticker-wrapper {
  position: absolute;
  top: 50%;
  left: 22%;
  transform: translate(-50%, -50%);
  z-index: 3;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.4s;
}
.sticker-wrapper.show {
  opacity: 1;
}
.sticker-wrapper.hide {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
  transition: all 1s cubic-bezier(0.23, 1, 0.32, 1);
}
.sticker {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);
  transition:
    transform 0.6s ease,
    box-shadow 0.6s ease;
}
.sticker-emoji {
  font-size: 64px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}
.center-stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.record-combo {
  position: relative;
  width: 420px;
  height: 420px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  touch-action: none;
}
.record-combo:active {
  cursor: grabbing;
}

/* 【修复】硬编码位移改为视口相对单位，防止在小屏幕上直接飞出可视区 */
.record-combo.is-shifted {
  transform: translateX(-50vw);
}
.record-combo.is-exiting {
  transform: translateX(-120vw) !important;
  opacity: 0;
  transition: all 1s cubic-bezier(0.23, 1, 0.32, 1);
}
.cover-block {
  position: absolute;
  top: 50%;
  left: 47%;
  width: 320px;
  height: 320px;
  z-index: 8;
  transform: translate(-50%, -50%) translateX(-30px);
  background: #f05757;
  border-radius: 2px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  transition:
    transform 0.8s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.25s ease;
}
.cover-block.is-shifted {
  transform: translate(-50%, -50%) translateX(-80px);
}
.cover-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #595959, #373737);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover-art {
  width: 260px;
  height: 260px;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
.cover-art-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-block.is-swallowing {
  transform: translate(-50%, -50%) translateX(-30px) scale(1.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

/* 【修复】硬编码位移改为视口相对单位 */
.cover-block.is-swallowing.is-shifted {
  transform: translate(-50%, -50%) translateX(-50vw) scale(1.1);
}
.vinyl-disc {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  z-index: 5;
  border-radius: 50%;
  will-change: transform, opacity;
  transform: translate(-50%, -50%) translateX(40px);
  transition:
    transform 0.8s cubic-bezier(0.23, 1, 0.32, 1),
    filter 0.3s ease;
}

/* 【修复】硬编码位移改为视口相对单位 */
.vinyl-disc.is-locked {
  filter: brightness(0.8);
  transform: translate(-50%, -50%) translateX(-30vw);
}
.vinyl-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}
.control-sector {
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  width: 160px;
  height: 240px;
  z-index: 9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.sector-arrows {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  pointer-events: none;
}
.arrow {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
  animation: arrowPulse 1.5s ease infinite;
}
@keyframes arrowPulse {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.8;
  }
}
.text-intro {
  position: absolute;
  left: 55%;
  top: 50%;
  transform: translateY(-50%) translateX(20px);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.3s;
  z-index: 7;
  pointer-events: none;
  background: rgba(218, 218, 218, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 32px;
  border-radius: 12px;
}
.text-intro.is-visible {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
  pointer-events: auto;
}
.text-intro.is-fading {
  opacity: 0 !important;
  transform: translateY(-50%) translateX(40px) !important;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.1s;
}
.intro-title {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 14px;
  letter-spacing: 3px;
  text-shadow:
    0 2px 20px rgba(0, 0, 0, 0.8),
    0 0 30px rgba(255, 255, 255, 0.1);
  line-height: 1.3;
}
.intro-desc {
  font-size: 15px;
  color: #e8e8e8;
  letter-spacing: 1.5px;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.6);
  margin-bottom: 28px;
  line-height: 1.6;
  font-weight: 400;
}
.navigate-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 50px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  text-decoration: none;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
}
.navigate-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateX(4px);
}
.btn-arrow {
  transition: transform 0.3s ease;
}
.navigate-btn:hover .btn-arrow {
  transform: translateX(4px);
}
.bottom-bar {
  position: absolute;
  bottom: 20%;
  left: 38%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 10;
  padding-bottom: 24px;
}
.bottom-bar.is-fading {
  opacity: 0 !important;
  transition: opacity 0.5s ease;
}
.phase-hint {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  letter-spacing: 3px;
  animation: pulse 2s ease infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

/* 全局白幕 */
.global-white-mask {
  position: fixed;
  inset: 0;
  background: #ffffff;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
}
.white-fade-enter-active {
  transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.white-fade-leave-active {
  transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.white-fade-enter-from,
.white-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .record-combo {
    width: 340px;
    height: 340px;
  }
  .record-combo.is-shifted {
    transform: translateX(-80px);
  }
  .record-combo.is-exiting {
    transform: translateX(-150vw) !important;
  }
  .cover-block {
    width: 260px;
    height: 260px;
    transform: translate(-50%, -50%) translateX(-30px);
  }
  .cover-block.is-swallowing {
    transform: translate(-50%, -50%) translateX(-30px) scale(1.1);
  }
  .vinyl-disc {
    width: 240px;
    height: 240px;
  }
  .control-sector {
    width: 120px;
    height: 200px;
    right: -20px;
  }
  .text-intro {
    left: 50%;
  }
  .intro-title {
    font-size: 22px;
  }
  .sticker {
    width: 90px;
    height: 90px;
  }
  .sticker-emoji {
    font-size: 48px;
  }
  .sticker-wrapper {
    left: 18%;
  }
}
</style>
