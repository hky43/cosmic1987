<
<template>
  <div
    class="user-progress-page"
    :class="{ 'slide-in-from-right': showProgressPage }"
    :style="cssVars"
  >
    <!-- TiltCard 组件 - 3D唱片交互系统 -->
    <div class="tilt-card-container">
      <!-- 背景封面图 -->
      <div
        class="ambient-cover"
        :style="{
          backgroundImage: `url(${currentTrack.cover})`,
          opacity: isCircleFocused ? contentOpacity * 0.45 : 0,
        }"
      />

      <!-- 左侧导航 -->
      <div
        v-if="isCircleFocused"
        class="side-nav"
        :style="{ opacity: contentOpacity }"
      >
        <button class="chevron up" @click="prevTrack" aria-label="上一首">
          <svg viewBox="0 0 24 24"><path d="M12 4l-8 8h16z" /></svg>
        </button>
        <div class="track-title-block">
          <h2 class="nav-track-name">{{ currentTrack.title }}</h2>
          <div class="guide-line-horiz" />
        </div>
        <button class="chevron down" @click="nextTrack" aria-label="下一首">
          <svg viewBox="0 0 24 24"><path d="M12 20l8-8H4z" /></svg>
        </button>
      </div>

      <!-- 3D 舞台 — v-if 控制：隐藏时彻底销毁以释放GPU/CPU资源 -->
      <div v-if="shouldRenderHeavyContent" class="stage" :style="stageStyle">
        <div class="tilt-layer" :style="tiltStyle">
          <!-- 翻转层 -->
          <div class="flip-layer" :style="flipStyle">
            <!-- 正面 -->
            <div class="sleeve face-front" ref="cardRef">
              <div class="sleeve-inner">
                <!-- 顶部装饰 -->
                <div class="sleeve-top-decoration">
                  <div class="corner-accent top-left"></div>
                  <div class="corner-accent top-right"></div>
                </div>

                <!-- 头部标题 -->
                <div class="sleeve-header">
                  <div class="header-ornament">
                    <span class="ornament-line left"></span>
                    <span class="ornament-dot"></span>
                    <span class="ornament-line right"></span>
                  </div>
                  <h1 class="sleeve-title">COSMIC 1987</h1>
                  <p class="sleeve-sub">The Voyager Golden Record</p>
                  <div class="header-divider"></div>
                </div>

                <!-- 中间图片区域 -->
                <div class="sleeve-center">
                  <div class="cover-image-wrapper">
                    <div class="cover-image-frame">
                      <img
                        :src="asset('images/decorations/Decoration3.png')"
                        alt="Cosmic Decoration"
                        class="cover-image"
                      />
                    </div>
                    <div class="cover-glow"></div>
                  </div>
                </div>

                <!-- 底部信息 -->
                <div class="sleeve-footer">
                  <div class="footer-line" />
                  <ul class="footer-list">
                    <li><span class="list-dot">•</span>Sounds of Earth</li>
                    <li>
                      <span class="list-dot">•</span>Greetings from the people
                      of Earth
                    </li>
                    <li><span class="list-dot">•</span>Music of the spheres</li>
                  </ul>
                  <div class="footer-actions">
                    <button
                      class="action-btn"
                      :class="{ active: isFlipped }"
                      @click.stop="toggleFlip"
                    >
                      <span class="btn-icon">↺</span>
                      {{ isFlipped ? "返回正面" : "翻转背面" }}
                    </button>
                    <button
                      class="action-btn"
                      :class="{ active: isCircleFocused }"
                      @click.stop="toggleCircle"
                    >
                      <span class="btn-icon">◎</span>
                      {{ isCircleFocused ? "收起唱片" : "查看唱片" }}
                    </button>
                  </div>
                  <!-- 音乐选择器 -->
                  <div v-if="isCircleFocused" class="music-selector">
                    <span class="music-label">选择音乐:</span>
                    <div class="music-buttons">
                      <button
                        v-for="(track, index) in musicTracks"
                        :key="index"
                        class="music-btn"
                        :class="{ active: currentMusicIndex === index }"
                        @click.stop="selectTrack(index)"
                      >
                        {{ track.title }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 底部装饰 -->
                <div class="sleeve-bottom-decoration">
                  <div class="corner-accent bottom-left"></div>
                  <div class="corner-accent bottom-right"></div>
                </div>
              </div>
            </div>

            <!-- 背面 -->
            <div class="sleeve face-back">
              <div class="back-content">
                <div class="back-header">
                  <h2>唱片信息</h2>
                  <span class="back-subtitle">Voyager Golden Record</span>
                </div>
                <p class="back-description">听就完事了</p>
                <div class="audio-controls">
                  <div class="audio-title">音频控制</div>
                  <div class="play-control">
                    <button
                      class="play-btn"
                      :class="{ playing: isPlaying }"
                      @click.stop="toggleAudio"
                    >
                      <span>{{ isPlaying ? "⏸" : "▶" }}</span>
                    </button>
                    <span class="play-status">
                      {{ isPlaying ? "播放中" : "已暂停" }}
                    </span>
                  </div>
                  <div class="volume-control-wrapper">
                    <span class="volume-label">音量</span>
                    <div class="volume-slider-container">
                      <span class="volume-icon">🔊</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        :value="volumePercent"
                        @input="updateVolume"
                        class="volume-slider"
                      />
                      <span class="volume-value">{{ volumePercent }}%</span>
                    </div>
                  </div>
                </div>
                <div class="current-track-info">
                  <span class="track-label">当前曲目</span>
                  <span class="track-name">
                    {{ musicTracks[currentMusicIndex]?.title || "未选择" }}
                  </span>
                </div>
                <button class="btn-return" @click.stop="toggleFlip">
                  返回正面
                </button>
              </div>
            </div>
          </div>

          <!-- 黑胶唱片组 -->
          <div
            v-show="showProgressPage"
            class="vinyl-group"
            :class="{ 'events-active': isCircleFocused }"
            :style="vinylGroupStyle"
          >
            <div
              class="vinyl-disc"
              :class="{ 'is-snapping': isSnapping }"
              :style="vinylDiscStyle"
              @pointerdown="onPointerDown"
            >
              <div class="vinyl-grooves" />
              <div class="vinyl-shine" />
              <div v-if="isCircleFocused" class="guide-ring" />
              <div class="vinyl-label" :style="labelStyle">
                <!-- 音频可视化：只在非特写模式下显示 -->
                <div class="audio-visualizer" v-show="!isCircleFocused">
                  <div class="visualizer-ring outer">
                    <div
                      v-for="i in 12"
                      :key="`outer-${i}`"
                      class="ring-segment"
                      :class="{ active: isPlaying }"
                      :style="{
                        transform: `rotate(${i * 30}deg) translateY(-32px)`,
                        animationDelay: `${i * 0.08}s`,
                      }"
                    />
                  </div>
                  <div class="visualizer-ring inner">
                    <div
                      v-for="i in 8"
                      :key="`inner-${i}`"
                      class="ring-segment small"
                      :class="{ active: isPlaying }"
                      :style="{
                        transform: `rotate(${i * 45}deg) translateY(-22px)`,
                        animationDelay: `${i * 0.1}s`,
                      }"
                    />
                  </div>
                  <div class="center-waveform">
                    <div
                      v-for="i in 5"
                      :key="`wave-${i}`"
                      class="center-bar"
                      :class="{ active: isPlaying }"
                      :style="{ animationDelay: `${i * 0.1}s` }"
                    />
                  </div>
                </div>
                <!-- 特写模式显示封面 -->
                <div
                  v-show="isCircleFocused"
                  class="label-cover"
                  :style="{
                    backgroundImage: `url(${currentTrack.cover})`,
                    opacity: contentOpacity,
                  }"
                />
              </div>
            </div>
            <div v-if="isCircleFocused" class="dot-ring" :style="dotRingStyle">
              <div
                v-for="(track, i) in tracks"
                :key="i"
                class="track-dot"
                :class="{ active: i === currentTrackIndex }"
                :style="getTrackDotStyle(i)"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="isCircleFocused" class="hint-bar">
        <span>拖拽旋转 或 W/S 切换</span>
        <span>按 ESC 退出特写</span>
        <span>{{ isPlaying ? "▶ 播放中" : "⏸ 已暂停" }}</span>
      </div>
      <!-- 占位：组件暂停时保留布局空间，避免页面跳动 -->
      <div v-else class="stage-placeholder" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import {
  audioManager,
  zone03Track,
  defaultMusicTracks,
} from "../utils/audioManager";
import { asset } from "../utils/asset";
import "./UserProgressPage.css";

// ==================== Props & Emits ====================
const props = defineProps({
  showProgressPage: { type: Boolean, default: false },
});

const emit = defineEmits(["music-change"]);

// ==================== 音乐数据 ====================
// 使用统一的默认曲目列表
const musicTracks = defaultMusicTracks;

// 唱片显示数据（封面图）
const tracks = [
  {
    title: "深澤秀行 - innocence",
    cover: asset("music/4a3f143e6b45b540837b9e6d87e8a692.jpg"),
  },
  {
    title: "The 1999 - 1987宇宙组曲",
    cover: asset("music/brger40837b9e6d7h21042408b1c7e8.jpg"),
  },
  {
    title: "Compass(指南针)",
    cover: asset("music/ae39785c008c4238e152fd0e4b1bda6.jpg"),
  },
];

// ==================== 音频状态（使用统一音频管理器） ====================
const isPlaying = computed(() => audioManager.isPlaying.value);
const volumePercent = computed(() => audioManager.volumePercent.value);
const currentMusicIndex = ref(0);

// ==================== 3D 参数 ====================
const TILT_INTENSITY = 10;
const PERSPECTIVE = 1000;
const OUTER_MARGIN = 30;
const RESET_DELAY = 2000;
const SLEEVE_SIZE = 700;
const VINYL_SIZE = 600;
const VINYL_Z_BACK = -200;
const VINYL_SLIDE = 870;
const VINYL_Z_FRONT = 2;
const CAMERA_PUSH = 650;
const FOCUS_OFFSET_X = -600;
const FOCUS_OFFSET_Y = 0;
const FLIP_DOWN_SHIFT = 70;
const AMBIENT_OPACITY = 0.45;

// CSS 变量（用于在模板中传递给样式）
const cssVars = {
  "--perspective": `${PERSPECTIVE}px`,
  "--sleeve-size": `${SLEEVE_SIZE}px`,
  "--vinyl-size": `${VINYL_SIZE}px`,
  "--vinyl-z-back": `${VINYL_Z_BACK}px`,
  "--vinyl-slide": `${VINYL_SLIDE}px`,
  "--vinyl-z-front": `${VINYL_Z_FRONT}px`,
  "--camera-push": `${CAMERA_PUSH}px`,
  "--focus-offset-x": `${FOCUS_OFFSET_X}px`,
  "--focus-offset-y": `${FOCUS_OFFSET_Y}px`,
  "--flip-down-shift": `${FLIP_DOWN_SHIFT}px`,
  "--ambient-opacity": AMBIENT_OPACITY,
};

const DOT_BASE_ANGLES = [180, 190, 200];
const DOT_RING_STEP = 10;
const RECORD_ROTATION_STEP = 5;

// ==================== 响应式状态 ====================
const rotateX = ref(0);
const rotateY = ref(0);
const posX = ref(50);
const posY = ref(50);
let lastX = 0.5;
let lastY = 0.5;
let resetTimer = null;

const isFlipped = ref(false);
const isCircleFocused = ref(false);
const rotation = ref(0);
let dragStartAngle = 0;
let dragStartRotation = 0;

const currentTrackIndex = ref(0);
const isDragging = ref(false);
const isSnapping = ref(false);
const contentOpacity = ref(0);
let contentFadeTimeout = null;

// ==================== 计算属性 ====================
const currentTrack = computed(() => tracks[currentTrackIndex.value]);

const stageStyle = computed(() => {
  if (isCircleFocused.value) {
    return {
      transform: `translate(calc(-50% + ${FOCUS_OFFSET_X}px), calc(-50% + ${FOCUS_OFFSET_Y}px)) translateZ(${CAMERA_PUSH}px)`,
      transition: "transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };
  }
  return {
    transform: "translate(-50%, -50%)",
    transition: "transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };
});

const tiltStyle = computed(() => {
  if (isCircleFocused.value) {
    return {
      transform: "rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };
  }
  return {
    "--x": `${posX.value}%`,
    "--y": `${posY.value}%`,
    transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
    transition: "transform 0.1s ease-out",
  };
});

const flipStyle = computed(() => ({
  transform: isFlipped.value
    ? `rotateY(180deg) translateY(${FLIP_DOWN_SHIFT}px)`
    : "rotateY(0deg) translateY(0)",
  transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
}));

const vinylGroupStyle = computed(() => {
  const base = { width: `${VINYL_SIZE}px`, height: `${VINYL_SIZE}px` };
  if (isFlipped.value) {
    return {
      ...base,
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transform: `translateX(0) translateY(${FLIP_DOWN_SHIFT}px) translateZ(${VINYL_Z_BACK}px)`,
      transition: "transform 0s, opacity 0s",
    };
  }
  if (isCircleFocused.value) {
    return {
      ...base,
      zIndex: 3,
      opacity: 1,
      pointerEvents: "auto",
      transform: `translateX(${VINYL_SLIDE}px) translateY(0) translateZ(${VINYL_Z_FRONT}px)`,
      transition:
        "transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease",
    };
  }
  return {
    ...base,
    zIndex: 1,
    opacity: 1,
    pointerEvents: "none",
    transform: `translateX(0) translateY(0) translateZ(${VINYL_Z_BACK}px)`,
    transition:
      "transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease 0.7s",
  };
});

const vinylDiscStyle = computed(() => ({
  width: `${VINYL_SIZE}px`,
  height: `${VINYL_SIZE}px`,
  transform: `rotate(${rotation.value}deg)`,
}));

const dotRingStyle = computed(() => ({
  position: "absolute",
  left: "50%",
  top: "50%",
  width: "1px",
  height: "1px",
  transform: `translate(-50%, -50%) rotate(${-(currentTrackIndex.value * DOT_RING_STEP)}deg)`,
  transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  pointerEvents: "none",
  zIndex: 5,
}));

const labelStyle = computed(() => {
  const base = {
    transform: `translate(-50%, -50%) rotate(${-rotation.value}deg)`,
    transition: isSnapping.value
      ? "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      : "none",
  };
  if (isCircleFocused.value) {
    return {
      ...base,
      width: "28%",
      height: "28%",
      background: "#0a0a0a",
      boxShadow:
        "inset 0 0 30px rgba(0,0,0,0.9), 0 0 0 1.5px rgba(232,224,212,0.15)",
    };
  }
  return base;
});

// ==================== 音频控制函数（使用统一音频管理器） ====================

// 【修复】增加防御性检查，防止 audioManager 内部报错导致页面功能崩溃
function toggleAudio() {
  if (audioManager && typeof audioManager.toggle === "function") {
    audioManager.toggle();
  }
}

function updateVolume(e) {
  const newVolume = parseInt(e.target.value);
  if (audioManager && typeof audioManager.setVolume === "function") {
    audioManager.setVolume(newVolume);
  }
}

function selectTrack(trackIndex) {
  console.log("[UserProgressPage] selectTrack called with index:", trackIndex);
  if (trackIndex === currentMusicIndex.value) return;

  currentTrackIndex.value = trackIndex;
  currentMusicIndex.value = trackIndex;

  if (audioManager && typeof audioManager.switchTrack === "function") {
    console.log(
      "[UserProgressPage] Calling audioManager.switchTrack with track:",
      musicTracks[trackIndex],
    );
    // 确保 audioManager 在 home 组
    audioManager.currentGroup.value = "home";
    audioManager.switchTrack(musicTracks[trackIndex], {
      fadeOutDuration: 300,
      fadeInDuration: 300,
    });
  }
}

defineExpose({});

// ==================== 3D 交互方法 ====================

function getTrackDotStyle(i) {
  const angle = DOT_BASE_ANGLES[i];
  const radius = VINYL_SIZE * 0.185;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;
  const isActive = i === currentTrackIndex.value;

  return {
    width: isActive ? "7px" : "5px",
    height: isActive ? "7px" : "5px",
    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
    opacity: isActive ? 1 : 0.35,
    background: isActive ? "#e8e0d4" : "rgba(232, 224, 212, 0.4)",
    boxShadow: isActive ? "0 0 10px rgba(232, 224, 212, 0.45)" : "none",
  };
}

function switchTrack(newIndex) {
  if (newIndex === currentTrackIndex.value) return;
  contentOpacity.value = 0;

  if (contentFadeTimeout) clearTimeout(contentFadeTimeout);
  contentFadeTimeout = setTimeout(() => {
    currentTrackIndex.value = newIndex;
    currentMusicIndex.value = newIndex;
    nextTick(() => {
      contentOpacity.value = 1;
    });
  }, 400);
}

function nextTrack() {
  console.log("[UserProgressPage] nextTrack called");
  if (!isCircleFocused.value) return;

  const newIndex = (currentTrackIndex.value + 1) % tracks.length;
  rotation.value += RECORD_ROTATION_STEP;
  switchTrack(newIndex);

  // 直接调用 selectTrack 来确保音乐切换
  selectTrack(newIndex);
}

function prevTrack() {
  console.log("[UserProgressPage] prevTrack called");
  if (!isCircleFocused.value) return;

  const newIndex =
    (currentTrackIndex.value - 1 + tracks.length) % tracks.length;
  rotation.value -= RECORD_ROTATION_STEP;
  switchTrack(newIndex);

  // 直接调用 selectTrack 来确保音乐切换
  selectTrack(newIndex);
}

// ==================== 拖拽旋转 ====================

function getAngleFromCenter(e, rect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
}

function onPointerDown(e) {
  if (!isCircleFocused.value) return;
  if (e.button !== 0) return;
  isDragging.value = true;
  isSnapping.value = false;
  const rect = e.currentTarget.getBoundingClientRect();
  dragStartAngle = getAngleFromCenter(e, rect);
  dragStartRotation = rotation.value;
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  e.target.setPointerCapture?.(e.pointerId);
}

function onPointerMove(e) {
  if (!isDragging.value) return;
  // 【修复】防御性检查：避免 querySelector 返回 null 导致后续报错
  const discEl = document.querySelector(".vinyl-disc");
  if (!discEl) return;
  const rect = discEl.getBoundingClientRect();
  const angle = getAngleFromCenter(e, rect);
  let delta = angle - dragStartAngle;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  rotation.value = dragStartRotation + delta;
}

function onPointerUp(e) {
  if (!isDragging.value) return;
  isDragging.value = false;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  e.target.releasePointerCapture?.(e.pointerId);

  const delta = rotation.value - dragStartRotation;
  if (Math.abs(delta) > 45) {
    if (delta > 0) nextTrack();
    else prevTrack();
  }
}

// ==================== 翻转控制 ====================

function toggleFlip() {
  if (isCircleFocused.value) isCircleFocused.value = false;
  isFlipped.value = !isFlipped.value;
  resetMouseTilt();
}

function toggleCircle() {
  if (isFlipped.value) isFlipped.value = false;
  isCircleFocused.value = !isCircleFocused.value;
  // 【修复】首次进入特写时，确保封面与氛围背景淡入可见
  if (isCircleFocused.value) contentOpacity.value = 1;
  resetMouseTilt();
}

function resetMouseTilt() {
  rotateX.value = 0;
  rotateY.value = 0;
  posX.value = 50;
  posY.value = 50;
  lastX = 0.5;
  lastY = 0.5;
  if (resetTimer) {
    clearTimeout(resetTimer);
    resetTimer = null;
  }
}

// ==================== 鼠标倾斜效果 ====================

function onMouseMove(e) {
  if (isCircleFocused.value) return;
  if (!cardRef.value) return;

  // 【修复】防御性检查：确保元素已渲染且可见（避免 display:none 时 getBoundingClientRect 返回 0）
  const rect = cardRef.value.getBoundingClientRect();
  if (!rect || rect.width === 0 || rect.height === 0) return;

  const boundLeft = rect.left - OUTER_MARGIN;
  const boundRight = rect.right + OUTER_MARGIN;
  const boundTop = rect.top - OUTER_MARGIN;
  const boundBottom = rect.bottom + OUTER_MARGIN;
  const mx = e.clientX;
  const my = e.clientY;

  if (
    mx >= rect.left &&
    mx <= rect.right &&
    my >= rect.top &&
    my <= rect.bottom
  ) {
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
    const x = (mx - rect.left) / rect.width;
    const y = (my - rect.top) / rect.height;
    lastX = x;
    lastY = y;
    posX.value = x * 100;
    posY.value = y * 100;
    rotateX.value = (0.5 - y) * TILT_INTENSITY;
    rotateY.value = (x - 0.5) * TILT_INTENSITY;
    return;
  }

  if (
    mx >= boundLeft &&
    mx <= boundRight &&
    my >= boundTop &&
    my <= boundBottom
  ) {
    if (!resetTimer) {
      resetTimer = setTimeout(() => {
        resetMouseTilt();
        resetTimer = null;
      }, RESET_DELAY);
    }
    return;
  }

  if (resetTimer) {
    clearTimeout(resetTimer);
    resetTimer = null;
  }
  resetMouseTilt();
}

// 【修复】增强 ESC 处理：阻止默认行为、阻止冒泡，并兼容 "Esc" 键名
function onKeyDown(e) {
  if (e.key === "Escape" || e.key === "Esc") {
    e.preventDefault();
    e.stopPropagation();

    if (isCircleFocused.value) {
      isCircleFocused.value = false;
    } else if (isFlipped.value) {
      isFlipped.value = false;
    }
    return;
  }
  if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
    prevTrack();
    return;
  }
  if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
    nextTrack();
    return;
  }
}

const cardRef = ref(null);

// ==================== 组件暂停/恢复机制 ====================
// 当 showProgressPage 为 false 时，延迟销毁 3D 舞台以释放 GPU/CPU
// 延迟时间匹配 CSS slide-out 动画时长（0.6s）
const HEAVY_RENDER_DESTROY_DELAY = 650;
const shouldRenderHeavyContent = ref(false);
let heavyRenderTimer = null;

// ==================== 监听 ====================

watch(currentMusicIndex, (newIndex) => {
  emit("music-change", {
    track: musicTracks[newIndex],
    index: newIndex,
    isPlaying: isPlaying.value,
  });
});

// 监听 audioManager 的 currentTrackIndex 变化，同步到本地状态
watch(
  () => audioManager.currentTrackIndex.value,
  (newIndex) => {
    if (newIndex !== currentMusicIndex.value) {
      currentMusicIndex.value = newIndex;
      currentTrackIndex.value = newIndex;
    }
  },
);

watch(
  () => props.showProgressPage,
  (newVal) => {
    // 清除之前的延迟定时器
    if (heavyRenderTimer) {
      clearTimeout(heavyRenderTimer);
      heavyRenderTimer = null;
    }

    if (newVal) {
      // 页面滑入：立即恢复渲染
      shouldRenderHeavyContent.value = true;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      // 注册交互事件监听
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("keydown", onKeyDown);
    } else {
      // 页面滑出：先保持渲染以播放滑出动画，再延迟销毁
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      // 立即移除事件监听，停止响应交互
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKeyDown);
      // 重置交互状态
      if (isCircleFocused.value) isCircleFocused.value = false;
      if (isFlipped.value) isFlipped.value = false;
      resetMouseTilt();
      // 延迟销毁重型 3D 舞台
      heavyRenderTimer = setTimeout(() => {
        shouldRenderHeavyContent.value = false;
        heavyRenderTimer = null;
      }, HEAVY_RENDER_DESTROY_DELAY);
    }
  },
  { immediate: true },
);

// ==================== 生命周期 ====================

onMounted(() => {
  // 声明当前页面属于 'home' 音频组
  audioManager.ensureGroup("home");
  // 注意：mousemove/keydown 事件由 showProgressPage watcher 按需管理，
  // 避免组件隐藏时持续消耗 CPU

  // 使用 nextTick 确保 DOM 完全就绪，并用 try-catch 隔离音频错误
  nextTick(() => {
    try {
      // 确保 audioManager 在 home 组
      audioManager.currentGroup.value = "home";
      // 同步显示当前播放的曲目索引
      currentMusicIndex.value = audioManager.currentTrackIndex.value;
      currentTrackIndex.value = audioManager.currentTrackIndex.value;
    } catch (err) {
      console.warn("[UserProgressPage] 音频同步失败:", err);
    }
  });
});

onUnmounted(() => {
  // 安全移除事件监听（防止 watcher 未清理的情况）
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("keydown", onKeyDown);
  if (resetTimer) clearTimeout(resetTimer);
  if (contentFadeTimeout) clearTimeout(contentFadeTimeout);
  if (heavyRenderTimer) clearTimeout(heavyRenderTimer);
});
</script>

<style scoped>
/* ==================== 场景 ==================== */
.tilt-card-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(15, 15, 25, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  perspective: var(--perspective);
  perspective-origin: 50% 50%;
  overflow: hidden;
}

.ambient-cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 55%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: opacity 0.6s ease;
  pointer-events: none;
  z-index: 0;
  mask-image: linear-gradient(to right, black 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 70%, transparent 100%);
}

/* ==================== 左侧导航 ==================== */
.side-nav {
  position: absolute;
  left: calc(70% - 280px);
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.chevron {
  width: 32px;
  height: 32px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(232, 224, 212, 0.45);
  transition:
    color 0.3s ease,
    transform 0.2s ease;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chevron:hover {
  color: #e8e0d4;
}
.chevron.up:hover {
  transform: translateY(-2px);
}
.chevron.down:hover {
  transform: translateY(2px);
}
.chevron svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.track-title-block {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.nav-track-name {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #e8e0d4;
  font-family: "Georgia", "Times New Roman", serif;
  text-transform: uppercase;
  line-height: 1.2;
  pointer-events: none;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
  transition: opacity 0.4s ease;
}

.guide-line-horiz {
  position: absolute;
  left: 100%;
  top: 50%;
  width: 120px;
  height: 1px;
  background: rgba(232, 224, 212, 0.7);
  transform: translateY(-50%);
  margin-left: 12px;
  box-shadow: 0 0 8px rgba(232, 224, 212, 0.25);
  pointer-events: none;
}

/* ==================== 3D 舞台 ==================== */
.stage {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  width: var(--sleeve-size);
  height: var(--sleeve-size);
  z-index: 1;
}

.tilt-layer {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
  position: relative;
}

.flip-layer {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  z-index: 2;
}

.sleeve {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 3px;
}

.face-front {
  background-color: #c8c4bc;
  box-shadow:
    inset 0 0 60px rgba(139, 125, 107, 0.1),
    0 25px 60px rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transform: translateZ(100px);
}

.sleeve-inner {
  width: calc(100% - 70px);
  height: calc(100% - 70px);
  border: 1px solid rgba(80, 75, 70, 0.25);
  position: relative;
  padding: 30px;
  box-sizing: border-box;
}

.sleeve-header {
  position: absolute;
  top: 30px;
  left: 30px;
}

.sleeve-title {
  margin: 0;
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 4px;
  color: #3a3530;
  font-family: "Georgia", "Times New Roman", serif;
  line-height: 1.2;
}

.sleeve-sub {
  margin: 8px 0 0;
  font-size: 15px;
  color: #5a544d;
  font-style: italic;
  font-family: "Georgia", "Times New Roman", serif;
  letter-spacing: 1px;
}

.sleeve-circle {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  width: 110px;
  height: 110px;
  border: 1px solid rgba(80, 75, 70, 0.35);
  border-radius: 50%;
}

/* ==================== 正面封面装饰元素 ==================== */
.sleeve-top-decoration,
.sleeve-bottom-decoration {
  position: absolute;
  left: 0;
  right: 0;
  height: 40px;
  pointer-events: none;
}

.sleeve-top-decoration {
  top: 0;
}

.sleeve-bottom-decoration {
  bottom: 0;
}

.corner-accent {
  position: absolute;
  width: 25px;
  height: 25px;
  border: 2px solid rgba(80, 75, 70, 0.3);
}

.corner-accent.top-left {
  left: 20px;
  top: 20px;
  border-right: none;
  border-bottom: none;
}

.corner-accent.top-right {
  right: 20px;
  top: 20px;
  border-left: none;
  border-bottom: none;
}

.corner-accent.bottom-left {
  left: 20px;
  bottom: 20px;
  border-right: none;
  border-top: none;
}

.corner-accent.bottom-right {
  right: 20px;
  bottom: 20px;
  border-left: none;
  border-top: none;
}

/* 头部装饰 */
.header-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.ornament-line {
  width: 40px;
  height: 1px;
  background: rgba(80, 75, 70, 0.4);
}

.ornament-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(80, 75, 70, 0.5);
}

.header-divider {
  width: 60%;
  height: 1px;
  margin: 16px auto 0;
  background: linear-gradient(
    to right,
    transparent,
    rgba(80, 75, 70, 0.3),
    transparent
  );
}

/* 中间图片区域 */
.sleeve-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  max-width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
}

.cover-image-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-glow {
  position: absolute;
  inset: -5px;
  border-radius: 6px;
  background: radial-gradient(
    ellipse at center,
    rgba(232, 224, 212, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* 列表样式 */
.list-dot {
  margin-right: 8px;
  color: #7a756d;
}

/* 按钮图标 */
.btn-icon {
  margin-right: 6px;
  font-size: 10px;
}

.sleeve-footer {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
}

.footer-line {
  width: 100%;
  height: 1px;
  background: rgba(80, 75, 70, 0.25);
  margin-bottom: 12px;
}

.footer-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-list li {
  font-size: 13px;
  color: #5a544d;
  line-height: 1.8;
  font-family: "Georgia", "Times New Roman", serif;
}

.footer-actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 20;
}

.action-btn {
  position: relative;
  z-index: 21;
  padding: 6px 16px;
  background: rgba(80, 75, 70, 0.08);
  border: 1px solid rgba(80, 75, 70, 0.4);
  color: #5a544d;
  font-size: 11px;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Georgia", "Times New Roman", serif;
  user-select: none;
  pointer-events: auto;
}

.action-btn:hover {
  background: rgba(80, 75, 70, 0.18);
  border-color: rgba(80, 75, 70, 0.65);
  color: #3a3530;
}

.action-btn.active {
  background: rgba(80, 75, 70, 0.25);
  border-color: rgba(80, 75, 70, 0.8);
  color: #3a3530;
}

.music-selector {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  z-index: 20;
}

.music-label {
  font-size: 11px;
  color: #5a544d;
  letter-spacing: 1px;
  font-family: "Georgia", "Times New Roman", serif;
}

.music-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.music-btn {
  padding: 4px 10px;
  background: rgba(80, 75, 70, 0.08);
  border: 1px solid rgba(80, 75, 70, 0.3);
  color: #5a544d;
  font-size: 10px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Georgia", "Times New Roman", serif;
  border-radius: 2px;
  pointer-events: auto;
  position: relative;
  z-index: 21;
}

.music-btn:hover {
  background: rgba(80, 75, 70, 0.15);
  border-color: rgba(80, 75, 70, 0.5);
}

.music-btn.active {
  background: rgba(80, 75, 70, 0.25);
  border-color: rgba(80, 75, 70, 0.7);
  color: #3a3530;
}

.face-back {
  background-color: #2a2a2a;
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ddd;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
  will-change: transform;
  transform: rotateY(180deg) translateZ(200px);
  pointer-events: auto;
  isolation: isolate;
}
.back-content {
  text-align: center;
  padding: 40px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.back-content h2 {
  margin: 0 0 12px;
  font-size: 24px;
  letter-spacing: 2px;
  font-weight: normal;
  font-family: "Georgia", "Times New Roman", serif;
}

.back-content p {
  margin: 0 0 8px;
  font-size: 14px;
  color: #aaa;
  line-height: 1.6;
}

.audio-controls {
  margin: 20px 0;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 80%;
  max-width: 280px;
}

.audio-title {
  font-size: 12px;
  letter-spacing: 2px;
  color: #888;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.play-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
  color: #ddd;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.play-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.play-btn.playing {
  background: rgba(232, 224, 212, 0.15);
  border-color: rgba(232, 224, 212, 0.5);
  color: #e8e0d4;
}

.play-status {
  font-size: 12px;
  color: #888;
}

.volume-control-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.volume-label {
  font-size: 11px;
  color: #666;
  letter-spacing: 1px;
}

.volume-slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-icon {
  font-size: 14px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #888;
  cursor: pointer;
  transition: background 0.3s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  background: #aaa;
}

.volume-value {
  font-size: 11px;
  color: #666;
  min-width: 30px;
}

.current-track-info {
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track-label {
  font-size: 10px;
  color: #666;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.track-name {
  font-size: 14px;
  color: #e8e0d4;
  font-family: "Georgia", "Times New Roman", serif;
}

.btn-return {
  margin-top: 20px;
  padding: 8px 20px;
  border: 1px solid #666;
  background: transparent;
  color: #ccc;
  cursor: pointer;
  transition: all 0.3s;
  font-family: "Georgia", "Times New Roman", serif;
  pointer-events: auto;
}

.btn-return:hover {
  border-color: #999;
  color: #fff;
}

/* ==================== 黑胶唱片组 ==================== */
.vinyl-group {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: calc(var(--vinyl-size) / -2);
  margin-top: calc(var(--vinyl-size) / -2);
  transform-style: preserve-3d;
  pointer-events: none;
  z-index: 1;
}

.vinyl-group.events-active {
  pointer-events: auto;
}

.vinyl-disc {
  border-radius: 50%;
  position: relative;
  background:
    conic-gradient(
      from 180deg at 50% 50%,
      rgba(255, 255, 255, 0) 0deg,
      rgba(255, 255, 255, 0.05) 30deg,
      rgba(255, 255, 255, 0) 60deg,
      rgba(255, 255, 255, 0) 180deg,
      rgba(255, 255, 255, 0.04) 210deg,
      rgba(255, 255, 255, 0) 240deg
    ),
    repeating-radial-gradient(
      circle at 50% 50%,
      #0a0a0a 0px,
      #0a0a0a 1px,
      #141414 1px,
      #141414 2px
    );
  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.5),
    inset 0 0 25px rgba(0, 0, 0, 0.95);
  overflow: hidden;
  transition: none;
  cursor: grab;
}

.vinyl-disc:active {
  cursor: grabbing;
}

.vinyl-disc.is-snapping {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.guide-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  height: 30%;
  border: 1px solid rgba(232, 224, 212, 0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 4;
  box-shadow:
    0 0 0 1px rgba(232, 224, 212, 0.06),
    0 0 14px rgba(232, 224, 212, 0.1);
}

.vinyl-grooves {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg at 50% 50%,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.025) 25%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.025) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: grooveShine 10s linear infinite;
  pointer-events: none;
}

.vinyl-shine {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 30%,
    rgba(255, 255, 255, 0.04) 45%,
    rgba(255, 255, 255, 0) 60%
  );
  pointer-events: none;
}

@keyframes grooveShine {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.vinyl-label {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 28%;
  height: 28%;
  border-radius: 50%;
  background: #e8e0d4;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  z-index: 3;
  overflow: hidden;
}

/* ===== 音频可视化样式 ===== */
.audio-visualizer {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visualizer-ring {
  position: absolute;
  width: 100%;
  height: 100%;
}

.ring-segment {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 10px;
  background: #5a5249;
  border-radius: 2px;
  transform-origin: center center;
  opacity: 0.4;
  transition: all 0.3s ease;
}

.ring-segment.active {
  animation: segmentPulse 0.8s ease-in-out infinite;
}

.ring-segment.small {
  width: 3px;
  height: 7px;
}

@keyframes segmentPulse {
  0%,
  100% {
    height: 10px;
    opacity: 0.4;
  }
  50% {
    height: 18px;
    opacity: 0.8;
  }
}

.center-waveform {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 50%;
  height: 30%;
}

.center-bar {
  width: 4px;
  height: 100%;
  background: #5a5249;
  border-radius: 2px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.center-bar.active {
  animation: barWave 0.6s ease-in-out infinite;
}

@keyframes barWave {
  0%,
  100% {
    height: 40%;
    opacity: 0.4;
  }
  50% {
    height: 100%;
    opacity: 0.9;
  }
}

.label-cover {
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 1.5px solid rgba(232, 224, 212, 0.35);
  transition: opacity 0.4s ease;
}

.dot-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1px;
  height: 1px;
  pointer-events: none;
  z-index: 5;
}

.track-dot {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  pointer-events: none;
  transition:
    transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    width 0.3s ease,
    height 0.3s ease,
    opacity 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.track-dot.active {
  background: #e8e0d4;
  box-shadow: 0 0 10px rgba(232, 224, 212, 0.45);
}

.hint-bar {
  position: absolute;
  bottom: 40px;
  display: flex;
  gap: 24px;
  color: #666;
  font-size: 13px;
  letter-spacing: 1px;
  user-select: none;
  pointer-events: none;
  z-index: 10;
}

/* ==================== 组件暂停模式 ==================== */
/* 占位元素：保持布局稳定，当 3D 舞台被 v-if 销毁时不引起页面跳动 */
.stage-placeholder {
  width: var(--sleeve-size);
  height: var(--sleeve-size);
  visibility: hidden;
  pointer-events: none;
}
</style>
