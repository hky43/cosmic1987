<template>
  <Teleport to="body">
    <div v-if="visible" class="floating-square-container">
      <!-- 绳子固定点 -->
      <div class="rope-anchor" :style="anchorStyle"></div>
      <!-- 绳子 -->
      <svg class="rope-line" :style="ropeContainerStyle">
        <line
          :x1="0"
          :y1="0"
          :x2="squareX + SQUARE_SIZE / 2 - anchorX"
          :y2="squareY - anchorY"
          class="rope"
        />
      </svg>
      <!-- 方块 -->
      <div
        class="floating-square"
        :class="{ 'is-locked': isDragDisabled }"
        :style="squareStyle"
        @mousedown="handleDragStart"
        @touchstart.prevent="handleDragStart"
      ></div>
    </div>

    <!-- 全屏白色背景层 -->
    <WhiteOverlay v-model="showWhiteOverlay" />
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import WhiteOverlay from "./WhiteOverlay.vue";

const router = useRouter();
let redirectTimer = null;

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  startPosition: {
    type: Object,
    default: () => ({ x: 0, y: 0 }),
  },
  anchorPosition: {
    type: Object,
    default: () => ({ x: 0, y: 0 }),
  },
  ropeLength: {
    type: Number,
    default: 0,
  },
  maxRopeLength: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["close", "show-overlay"]);

const SQUARE_SIZE = 80;
const GRAVITY = 0.05; // 减小重力，下落更慢
const FRICTION = 0.85; // 减小摩擦力，减速更快（摆动更少）
const SPRING_STIFFNESS = 0.008; // 减小弹簧刚度，拉力更弱
const THRESHOLD_TIME = 10000; // 10秒阈值
const OVERLAP_THRESHOLD = 0.5; // 超过最大绳长的1/2

const squareX = ref(0);
const squareY = ref(0);
const isDragging = ref(false);
let dragStartX = 0;
let dragStartY = 0;
let squareStartX = 0;
let squareStartY = 0;
let gravityRafId = null;

const anchorX = ref(0);
const anchorY = ref(0);
const currentRopeLength = ref(0);
const velocityX = ref(0);
const velocityY = ref(0);

// 新增变量
const isDragDisabled = ref(false);
const isReturning = ref(false);
const showWhiteOverlay = ref(false);
const hasShownOverlay = ref(false);
const isFadingOut = ref(false);
let thresholdTimer = null;
let isOverThreshold = ref(false);

// 导航按钮配置
const navButtons = [
  { path: "/test", icon: "01" },
  { path: "/test1", icon: "02" },
  { path: "/test2", icon: "03" },
];
const activeButton = ref(-1);

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      initPosition();
    } else {
      resetState();
    }
  },
);

const initPosition = () => {
  const defaultRopeLength = window.innerHeight / 8;

  if (props.ropeLength > 0) {
    currentRopeLength.value = props.ropeLength;
  } else {
    currentRopeLength.value = defaultRopeLength;
  }

  if (props.anchorPosition.x > 0 && props.anchorPosition.y > 0) {
    anchorX.value = props.anchorPosition.x;
    anchorY.value = props.anchorPosition.y;
  } else {
    anchorX.value = window.innerWidth - SQUARE_SIZE / 2 - 20;
    anchorY.value = -20;
  }

  const initX = anchorX.value - SQUARE_SIZE / 2;

  if (props.startPosition.x > 0 || props.startPosition.y > 0) {
    squareX.value = props.startPosition.x;
    squareY.value = props.startPosition.y;
  } else {
    squareX.value = initX;
    squareY.value = -SQUARE_SIZE - 50;
  }

  velocityX.value = 0;
  velocityY.value = 2;
  isDragging.value = false;
  isDragDisabled.value = false;
  isReturning.value = false;
  showWhiteOverlay.value = false;
  hasShownOverlay.value = false;
  isOverThreshold.value = false;

  if (thresholdTimer) {
    clearTimeout(thresholdTimer);
    thresholdTimer = null;
  }

  applyGravity();
};

const resetState = () => {
  isDragDisabled.value = false;
  isReturning.value = false;
  showWhiteOverlay.value = false;
  hasShownOverlay.value = false;
  isOverThreshold.value = false;

  if (thresholdTimer) {
    clearTimeout(thresholdTimer);
    thresholdTimer = null;
  }
};

const handleDragStart = (event) => {
  if (isDragDisabled.value || isReturning.value) return;
  startDrag(event);
};

const startDrag = (event) => {
  isDragging.value = true;
  const clientX = event.clientX || event.touches?.[0]?.clientX || 0;
  const clientY = event.clientY || event.touches?.[0]?.clientY || 0;
  dragStartX = clientX;
  dragStartY = clientY;
  squareStartX = squareX.value;
  squareStartY = squareY.value;
  velocityX.value = 0;
  velocityY.value = 0;

  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchmove", onDrag);
  window.addEventListener("touchend", endDrag);
};

const onDrag = (event) => {
  if (!isDragging.value || isDragDisabled.value) return;

  const clientX = event.clientX || event.touches?.[0]?.clientX || 0;
  const clientY = event.clientY || event.touches?.[0]?.clientY || 0;

  let newX = squareStartX + (clientX - dragStartX);
  let newY = squareStartY + (clientY - dragStartY);

  const dx = newX + SQUARE_SIZE / 2 - anchorX.value;
  const dy = newY - anchorY.value;
  const currentDistance = Math.sqrt(dx * dx + dy * dy);

  currentRopeLength.value = currentDistance;

  const screenMinX = 0;
  const screenMaxX = window.innerWidth - SQUARE_SIZE;
  const screenMinY = 0;
  const screenMaxY = window.innerHeight - SQUARE_SIZE;

  newX = Math.max(screenMinX, Math.min(screenMaxX, newX));
  newY = Math.max(screenMinY, Math.min(screenMaxY, newY));

  squareX.value = newX;
  squareY.value = newY;

  checkRopeThreshold(currentRopeLength.value);
};

const checkRopeThreshold = (currentLen) => {
  const defaultRopeLength =
    props.ropeLength > 0 ? props.ropeLength : window.innerHeight / 5;
  const threshold = defaultRopeLength * 2;

  if (currentLen >= threshold) {
    if (!isOverThreshold.value) {
      isOverThreshold.value = true;
      startThresholdTimer();
    }
  } else {
    if (isOverThreshold.value) {
      isOverThreshold.value = false;
      stopThresholdTimer();
    }
  }
};

const startThresholdTimer = () => {
  if (thresholdTimer) {
    clearTimeout(thresholdTimer);
  }

  thresholdTimer = setTimeout(() => {
    triggerReturnToOrigin();
  }, THRESHOLD_TIME);
};

const stopThresholdTimer = () => {
  if (thresholdTimer) {
    clearTimeout(thresholdTimer);
    thresholdTimer = null;
  }
};

const triggerReturnToOrigin = () => {
  if (isDragging.value) {
    endDrag();
  }

  isDragDisabled.value = true;
  isReturning.value = true;
  isOverThreshold.value = false;

  stopThresholdTimer();
  returnToOrigin();
};

const returnToOrigin = () => {
  const targetX = anchorX.value - SQUARE_SIZE / 2;
  const targetY =
    anchorY.value +
    (props.ropeLength > 0 ? props.ropeLength : window.innerHeight / 8);

  const dx = targetX - squareX.value;
  const dy = targetY - squareY.value;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 0.5) {
    squareX.value = targetX;
    squareY.value = targetY;
    currentRopeLength.value =
      props.ropeLength > 0 ? props.ropeLength : window.innerHeight / 8;
    velocityX.value = 0;
    velocityY.value = 0;

    isReturning.value = false;

    if (!hasShownOverlay.value) {
      triggerWhiteOverlay();
    }

    return;
  }

  // 【正常速度返回】10秒后强制返回使用正常速度
  const speed = 0.02; // 正常加速度
  const friction = 0.85; // 摩擦力

  velocityX.value = velocityX.value * friction + dx * speed;
  velocityY.value = velocityY.value * friction + dy * speed;

  squareX.value += velocityX.value;
  squareY.value += velocityY.value;

  requestAnimationFrame(returnToOrigin);
};

const triggerWhiteOverlay = () => {
  hasShownOverlay.value = true;

  setTimeout(() => {
    showWhiteOverlay.value = true;
    emit("show-overlay");
  }, 300);
};

const resetAllState = () => {
  // 重置所有状态
  showWhiteOverlay.value = false;
  isFadingOut.value = false;
  activeButton.value = -1;
  hasShownOverlay.value = false;
  isDragDisabled.value = false;
  isReturning.value = false;
  isOverThreshold.value = false;
  velocityX.value = 0;
  velocityY.value = 0;

  // 清除所有定时器
  if (thresholdTimer) {
    clearTimeout(thresholdTimer);
    thresholdTimer = null;
  }
  if (gravityRafId) {
    cancelAnimationFrame(gravityRafId);
    gravityRafId = null;
  }
};

// 监听路由变化，重置所有状态
router.afterEach((to) => {
  // 如果是从 Test 页面返回，检查是否需要显示白色背景层
  const fromOverlay = sessionStorage.getItem("fromWhiteOverlay") === "true";

  if (to.path === "/" && fromOverlay) {
    // 从白色背景层进入的，返回后显示白色背景层
    sessionStorage.removeItem("fromWhiteOverlay");
    // 延迟显示白色背景层，确保页面已渲染
    setTimeout(() => {
      showWhiteOverlay.value = true;
      hasShownOverlay.value = true;
    }, 100);
  } else {
    resetAllState();
  }
});

const cancelRedirect = () => {
  if (redirectTimer) {
    clearTimeout(redirectTimer);
    redirectTimer = null;
  }
};

onUnmounted(() => {
  cancelRedirect();
});

const endDrag = () => {
  isDragging.value = false;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", endDrag);
  window.removeEventListener("touchmove", onDrag);
  window.removeEventListener("touchend", endDrag);

  if (!isDragDisabled.value && !isReturning.value) {
    applyGravity();
  }
};

const applyGravity = () => {
  if (isDragging.value || isDragDisabled.value || isReturning.value) return;

  const currentRopeLen =
    props.ropeLength > 0 ? props.ropeLength : window.innerHeight / 8;
  const currentMaxLen =
    props.maxRopeLength > 0 ? props.maxRopeLength : window.innerHeight / 2;

  const update = () => {
    if (isDragging.value || isDragDisabled.value || isReturning.value) return;

    const targetX = anchorX.value - SQUARE_SIZE / 2;
    const targetY = anchorY.value + currentRopeLen;

    const dx = squareX.value + SQUARE_SIZE / 2 - anchorX.value;
    const dy = squareY.value - anchorY.value;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);

    const dxToTarget = targetX - squareX.value;
    const dyToTarget = targetY - squareY.value;
    const distToTarget = Math.sqrt(
      dxToTarget * dxToTarget + dyToTarget * dyToTarget,
    );

    if (currentDistance > currentRopeLen) {
      const stretch = currentDistance - currentRopeLen;
      const pullStrength = stretch * SPRING_STIFFNESS * 2;
      velocityX.value -= (dx / currentDistance) * pullStrength;
      velocityY.value -= (dy / currentDistance) * pullStrength;
    }

    velocityY.value += GRAVITY;
    velocityX.value *= FRICTION;
    velocityY.value *= FRICTION;

    squareX.value += velocityX.value;
    squareY.value += velocityY.value;

    const newDistance = Math.sqrt(
      Math.pow(squareX.value + SQUARE_SIZE / 2 - anchorX.value, 2) +
        Math.pow(squareY.value - anchorY.value, 2),
    );
    currentRopeLength.value = Math.max(
      currentRopeLen,
      Math.min(newDistance, currentMaxLen),
    );

    checkRopeThreshold(currentRopeLength.value);

    const screenMinX = 0;
    const screenMaxX = window.innerWidth - SQUARE_SIZE;
    const screenMinY = 0;
    const screenMaxY = window.innerHeight - SQUARE_SIZE;

    if (squareX.value < screenMinX) {
      squareX.value = screenMinX;
      velocityX.value = 0;
    } else if (squareX.value > screenMaxX) {
      squareX.value = screenMaxX;
      velocityX.value = 0;
    }

    const maxAllowedY = Math.min(
      anchorY.value + currentRopeLength.value,
      screenMaxY,
    );
    if (squareY.value > maxAllowedY) {
      squareY.value = maxAllowedY;
      velocityY.value *= 0.3;
    }
    if (squareY.value < screenMinY) {
      squareY.value = screenMinY;
      velocityY.value = 0;
    }

    const speed = Math.sqrt(
      velocityX.value * velocityX.value + velocityY.value * velocityY.value,
    );

    // 当距离终点较近时，直接"吸附"到位，避免缓慢爬行
    if (distToTarget < 15) {
      // 接近终点时快速吸附
      squareX.value = targetX;
      squareY.value = targetY;
      currentRopeLength.value = currentRopeLen;
      velocityX.value = 0;
      velocityY.value = 0;
      return;
    }

    // 原有的停止条件（作为后备）
    if (speed < 0.01 && distToTarget < 2) {
      squareX.value = targetX;
      squareY.value = targetY;
      currentRopeLength.value = currentRopeLen;
      velocityX.value = 0;
      velocityY.value = 0;
      return;
    }

    gravityRafId = requestAnimationFrame(update);
  };

  if (gravityRafId) {
    cancelAnimationFrame(gravityRafId);
  }
  gravityRafId = requestAnimationFrame(update);
};

const getDefaultRopeLength = () => {
  return props.ropeLength > 0 ? props.ropeLength : window.innerHeight / 8;
};

const getMaxRopeLength = () => {
  return props.maxRopeLength > 0 ? props.maxRopeLength : window.innerHeight / 2;
};

const squareStyle = computed(() => ({
  left: `${squareX.value}px`,
  top: `${squareY.value}px`,
  width: `${SQUARE_SIZE}px`,
  height: `${SQUARE_SIZE}px`,
}));

const anchorStyle = computed(() => ({
  left: `${anchorX.value - 6}px`,
  top: `${anchorY.value - 6}px`,
  width: "12px",
  height: "12px",
}));

const ropeContainerStyle = computed(() => ({
  left: `${anchorX.value}px`,
  top: `${anchorY.value}px`,
  width: `${Math.abs(squareX.value + SQUARE_SIZE / 2 - anchorX.value) + 20}px`,
  height: `${Math.abs(squareY.value - anchorY.value) + 20}px`,
}));
</script>

<style scoped>
.floating-square.is-locked {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
