<template>
  <div class="voyager-detail">
    <!-- ============================================ -->
    <!-- 【改善】返回按钮文案根据来源动态变化            -->
    <!-- ============================================ -->
    <button class="back-btn" @click="handleBack">
      <span class="back-arrow">←</span>
      <span class="back-text">{{ backButtonText }}</span>
    </button>

    <!-- 3D 模型容器（右侧主体区域） -->
    <div class="model-container" ref="modelContainer"></div>

    <!-- 左侧数据面板 -->
    <div class="data-overlay" v-show="modelLoaded">
      <!-- 顶部徽章 -->
      <div class="top-badge">
        <div class="nasa-badge">NASA</div>
        <span class="mission-label">DEEP SPACE MISSION</span>
        <div class="header-right">
          <div class="status-dot online"></div>
          <span class="live-text">LIVE</span>
        </div>
      </div>

      <!-- 主标题 -->
      <div class="title-section">
        <h1 class="main-title">VOYAGER 1</h1>
        <p class="subtitle">INTERSTELLAR PROBE</p>
      </div>

      <!-- 关键数据 -->
      <div class="key-metrics">
        <div class="metric-row">
          <span class="metric-value">{{ distanceKm.toLocaleString() }}</span>
          <span class="metric-unit">km</span>
          <span class="metric-label">from Earth</span>
        </div>
        <div class="metric-row">
          <span class="metric-value">{{ distanceAu }}</span>
          <span class="metric-unit">AU</span>
          <span class="metric-label">astronomical units</span>
        </div>
        <div class="metric-row">
          <span class="metric-value">17.00</span>
          <span class="metric-unit">km/s</span>
          <span class="metric-label">velocity</span>
        </div>
      </div>

      <!-- 描述 -->
      <div class="description-section">
        <p class="desc-text">
          The most distant human-made object. Launched September 5, 1977, now
          traversing interstellar space beyond our solar system. Continuing to
          explore the unknown.
        </p>
      </div>

      <!-- 任务状态 -->
      <div class="mission-status">
        <div class="status-row">
          <span class="status-label">Signal Status:</span>
          <div class="signal-live">
            <span class="blink-dot"></span>
            <span class="signal-text">RECEIVED</span>
          </div>
        </div>
        <div class="status-row">
          <span class="status-label">Mission Status:</span>
          <span class="status-value">TRAVERSING INTERSTELLAR SPACE</span>
        </div>
        <div class="status-row">
          <span class="status-label">Next Update:</span>
          <span class="status-value">{{ nextUpdateTime }}</span>
        </div>
      </div>

      <!-- 底部栏 -->
      <div class="bottom-bar">
        <div class="bottom-left">
          <span class="footer-label">JPL CONTROL CENTER</span>
        </div>
        <div class="bottom-center">
          <span class="footer-time">{{ currentTime }}</span>
        </div>
        <div class="bottom-right">
          <span class="scroll-hint">Scroll for details ↓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// ============================================
// 【改善】接收来源 phase prop
// ============================================
const props = defineProps({
  visible: { type: Boolean, default: false },
  modelLoaded: { type: Boolean, default: false },
  fromPhase: { type: String, default: "showcase" }, // 'showcase' | 'detail'
});

const emit = defineEmits(["back"]);

// 根据来源动态显示返回按钮文案
const backButtonText = computed(() => {
  return props.fromPhase === "detail" ? "BACK TO DETAIL" : "BACK TO SHOWCASE";
});

function handleBack() {
  emit("back");
}

// 模型加载状态
const modelLoaded = ref(true);

// 当前时间
const currentTime = ref("");
const nextUpdateTime = ref("00:00:00");

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const next = new Date(now.getTime() + 5 * 60 * 1000);
  nextUpdateTime.value = next.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

let timeInterval = null;

const baseDistanceKm = 23_835_000_000;
const distanceKm = ref(baseDistanceKm);

const distanceAu = computed(() => {
  return (distanceKm.value / 149_597_870.7).toFixed(4);
});

onMounted(() => {
  setInterval(() => {
    distanceKm.value += 17;
  }, 1000);

  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
/* ==================== 基础布局 ==================== */
.voyager-detail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0f;
  z-index: 100;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 返回按钮 */
.back-btn {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 101;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-family: "Courier New", monospace;
  font-size: 12px;
  letter-spacing: 2px;
  cursor: pointer;
  backdrop-filter: blur(5px);
  pointer-events: auto;
  transition: all 0.3s ease;
}
.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}
.back-arrow {
  font-size: 16px;
  opacity: 0.7;
}
.back-text {
  opacity: 0.8;
}

/* 3D模型容器 */
.model-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* ==================== 左侧数据面板 ==================== */
.data-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 45%;
  height: 100%;
  z-index: 10;
  padding: 40px 50px;
  box-sizing: border-box;

  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.6) 70%,
    transparent 100%
  );

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  font-family: "Courier New", Courier, monospace;
  color: #ffffff;
  pointer-events: none;
  animation: slideIn 0.5s ease 0.2s both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ==================== 顶部徽章 ==================== */
.top-badge {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.nasa-badge {
  background: linear-gradient(135deg, #003366, #0066aa);
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 2px;
}

.mission-label {
  color: #6ab0ff;
  font-size: 10px;
  letter-spacing: 3px;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #00ff88;
  box-shadow: 0 0 12px #00ff88;
  animation: pulse 2s infinite;
}

.live-text {
  color: #00ff88;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 2px;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}

/* ==================== 标题区 ==================== */
.title-section {
  margin-bottom: 25px;
}

.main-title {
  font-size: 48px;
  font-weight: 300;
  margin: 0 0 8px 0;
  letter-spacing: 4px;
  line-height: 1.1;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
}

.subtitle {
  font-size: 13px;
  letter-spacing: 6px;
  margin: 0;
  color: #88aacc;
  font-weight: 400;
}

/* ==================== 关键数据区 ==================== */
.key-metrics {
  margin-bottom: 25px;
}

.metric-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
  line-height: 1.6;
}

.metric-value {
  color: #00ffff;
  font-size: 16px;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

.metric-unit {
  color: #66aadd;
  font-size: 11px;
  text-transform: lowercase;
}

.metric-label {
  color: #88aacc;
  font-size: 11px;
  letter-spacing: 1px;
  margin-left: 4px;
}

/* ==================== 描述文字区 ==================== */
.description-section {
  margin-bottom: 25px;
  max-width: 380px;
}

.desc-text {
  color: #aabbcc;
  font-size: 12px;
  line-height: 1.7;
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ==================== 任务状态区 ==================== */
.mission-status {
  margin-bottom: 30px;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.status-label {
  color: #6688aa;
  font-size: 11px;
  letter-spacing: 1.5px;
  min-width: 110px;
}

.status-value {
  color: #ffffff;
  font-size: 12px;
  letter-spacing: 1px;
}

.signal-live {
  display: flex;
  align-items: center;
  gap: 8px;
}

.blink-dot {
  width: 7px;
  height: 7px;
  background: #00ff88;
  border-radius: 50%;
  animation: blink 1.2s infinite;
}

@keyframes blink {
  0%,
  45% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0.2;
  }
}

.signal-text {
  color: #00ff88;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
}

/* ==================== 底部栏 ==================== */
.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(100, 150, 200, 0.2);
  margin-top: auto;
}

.footer-label {
  color: #557799;
  font-size: 9px;
  letter-spacing: 2px;
}

.footer-time {
  color: #00ffff;
  font-size: 14px;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
}

.scroll-hint {
  color: #557799;
  font-size: 10px;
  letter-spacing: 1px;
  opacity: 0.7;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 1024px) {
  .data-overlay {
    width: 55%;
    padding: 30px;
  }
  .main-title {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .data-overlay {
    width: 100%;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.7) 60%,
      transparent 100%
    );
    padding: 25px;
  }
  .main-title {
    font-size: 32px;
  }
  .description-section {
    max-width: 100%;
  }
}
</style>
