<
<template>
  <!-- 
    Wrapper：负责 fixed 定位与承载进度条
    pointer-events: none 让点击穿透到页面，内部 side-nav 单独开启交互 
  -->
  <div class="side-nav-wrapper">
    <!-- 
      进度条：位于 side-nav 外部，不受容器 mix-blend-mode 影响
      80% 透明度白色，始终为半透明白色填充 
    -->
    <div class="nav-fill" :style="{ '--progress': scrollProgress + '%' }"></div>

    <aside
      class="side-nav"
      :class="{
        'is-wide': isWide,
        'menu-open': showMenu,
        'nav-disabled': showProgressPage,
      }"
    >
      <!-- 时钟按钮：固定最左 -->
      <button
        class="nav-btn-progress"
        :class="{
          'is-detached': isDetached,
          'is-active': showProgressPage,
        }"
        @click="handleBtnClick"
        :title="showProgressPage ? '关闭进度' : '查看进度'"
      >
        <svg
          class="icon-clock"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="16" cy="16" r="14" />
          <circle cx="16" cy="16" r="10" stroke-width="0.5" opacity="0.6" />
          <circle cx="16" cy="16" r="7" stroke-width="0.5" opacity="0.4" />
          <circle cx="16" cy="16" r="4.5" stroke-width="0.8" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>

      <!-- 顶部标题 -->
      <div class="nav-header">
        <span class="nav-title">LMI呈现ELIMAR</span>
      </div>

      <!-- 宽屏：章节导航 -->
      <nav class="nav-chapters" v-if="isWide">
        <a
          v-for="(item, index) in chapters"
          :key="index"
          href="#"
          class="chapter-item"
          :class="{ active: activeIndex === index }"
          @click.prevent="handleNavigate(index)"
        >
          <span class="chapter-num">{{ item.num }}</span>
          <span class="chapter-label">{{ item.label }}</span>
        </a>
      </nav>

      <!-- 窄屏：当前区域名字 -->
      <div class="nav-current" v-if="!isWide">
        <span class="current-num">{{ chapters[activeIndex]?.num }}</span>
        <span class="current-label">{{ chapters[activeIndex]?.label }}</span>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  chapters: { type: Array, required: true },
  activeIndex: { type: Number, default: 0 },
  topSectionInfo: {
    type: Object,
    default: () => ({ top: 0, height: 0 }),
  },
  currentY: { type: Number, default: 0 },
  showProgressPage: { type: Boolean, default: false },
});

const emit = defineEmits(["navigate", "progress-click"]);

const isWide = ref(true);
const showMenu = ref(false);
const scrollProgress = ref(0);

let mediaQuery = null;

const handleMediaChange = (e) => {
  isWide.value = e.matches;
  if (e.matches) showMenu.value = false;
};

const updateScrollProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) {
    scrollProgress.value = 0;
    return;
  }
  scrollProgress.value = Math.min(
    100,
    Math.max(0, (scrollTop / docHeight) * 100),
  );
};

const chapterProgress = computed(() => {
  const total = props.chapters.length;
  if (total === 0) return 0;
  return ((props.activeIndex + 1) / total) * 100;
});

const isDetached = computed(() => {
  const { top, height } = props.topSectionInfo;
  if (!height) return false;
  const threshold = top + height - 100;
  return props.currentY > threshold;
});

const handleBtnClick = () => {
  emit("progress-click");
};

const handleNavigate = (index) => {
  if (props.showProgressPage) return;
  emit("navigate", index);
};

onMounted(() => {
  mediaQuery = window.matchMedia("(min-width: 1024px)");
  isWide.value = mediaQuery.matches;
  mediaQuery.addEventListener("change", handleMediaChange);

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();
});

onUnmounted(() => {
  if (mediaQuery) mediaQuery.removeEventListener("change", handleMediaChange);
  window.removeEventListener("scroll", updateScrollProgress);
  window.removeEventListener("resize", updateScrollProgress);
});
</script>

<style scoped>
/* ========================================================
   外层 Wrapper：固定定位，承载进度条与导航栏
   ======================================================== */
.side-nav-wrapper {
  position: fixed;
  z-index: 200;
  user-select: none;
  pointer-events: none; /* 点击穿透，由内部 side-nav 接管交互 */
}

/* 
  进度条：80% 透明度白色，不参与任何 mix-blend-mode
  作为独立层存在，始终为半透明白色 
*/
.nav-fill {
  position: absolute;
  background: rgba(255, 255, 255, 0.9); /* 【标注】90% 透明度白色，不反色 */
  pointer-events: none;
  z-index: 0;
}

/* ========================================================
   侧边栏容器：容器级 mix-blend-mode: difference
   内部所有白字/白边统一与页面背景反色，彼此不再互相混合
   ======================================================== */
.side-nav {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  mix-blend-mode: difference; /* 【核心】容器级反色：黑底白字 / 白底黑字 */
  color: #ffffff;
  pointer-events: auto;
}

/* 右侧全局边框：白色，由容器 difference 统一反色 */
.side-nav::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: #ffffff;
  z-index: 10;
  pointer-events: none;
}

/* ========================================================
   宽屏：左侧固定竖栏（>= 1024px）
   ======================================================== */
@media (min-width: 1024px) {
  .side-nav-wrapper {
    left: 0;
    top: 0;
    width: 40px;
    height: 100vh;
  }

  /* 进度条：从顶部向下填充，右侧留出 1px 给边框 */
  .nav-fill {
    top: 0;
    left: 0;
    right: 1px;
    height: var(--progress);
    width: auto;
    transition: height 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .side-nav {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  /* 顶部标题区域 */
  .nav-header {
    flex-shrink: 0;
    padding: 12px 0 10px;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    letter-spacing: 2px;
    position: relative;
    z-index: 2;
  }

  /* 标题：纯白色，由容器 difference 自动反色 */
  .nav-title {
    font-size: 11px;
    font-weight: 500;
    color: #ffffff;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    display: inline-block;
  }

  /* 
    章节导航：占据剩余空间，按钮从底部向上排列
    padding: 0 确保 05 按钮贴紧栏底，无空隙 
  */
  .nav-chapters {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    z-index: 2;
    padding: 0; /* 05 贴底：无底部 padding */
  }

  /* 
    章节按钮：竖排，增高高度
    min-height: 44px（【增高】章节按钮默认高度）
    active 时标签向下展开 
  */
  .chapter-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 30px;
    padding: 6px 2px;
    text-decoration: none;
    background-color: transparent;
    cursor: pointer;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    color: #ffffff;
    position: relative;
    z-index: 2;
    transition:
      opacity 0.25s ease,
      min-height 0.35s ease;
  }

  .chapter-item.active {
    min-height: 90px; /* 【增高】active 时按钮整体高度 */
  }

  /* 按钮底部横线：纯白色，由容器 difference 统一反色 */
  .chapter-item::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 1px;
    height: 1px;
    background: #ffffff;
    pointer-events: none;
  }

  /* 
    01 按钮顶部横线：纯白色，由容器 difference 统一反色
    与其他按钮的底线风格一致 
  */
  .chapter-item:first-child::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 1px;
    height: 1px;
    background: #ffffff;
    pointer-events: none;
  }

  /* 最后一个按钮（05）底部无线，自然贴紧栏底 */
  .chapter-item:last-child::after {
    display: none;
  }

  .chapter-item:hover:not(.active) {
    opacity: 0.6;
  }

  /* 
    Active 状态背景块：#cccccc（中灰）
    - 黑底 → 容器 difference 反色为深灰(#333)，与白字形成对比
    - 白底 → 容器 difference 反色为浅灰(#ccc)，与黑字形成对比
    - 避免使用纯白，否则反色后与文字融为一体 
  */
  .chapter-item.active::before {
    content: "";
    position: absolute;
    inset: 0;
    right: 1px;
    z-index: -1; /* 按钮内部最底层，不遮挡编号和标签 */
    pointer-events: none;
  }

  /* 章节编号：纯白色，由容器 difference 自动反色 */
  .chapter-num {
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
    font-family: "Courier New", monospace;
    color: #ffffff;
    display: inline-block;
  }

  /* 
    章节标签：默认收起，active 时展开
    纯白色，由容器 difference 自动反色
    active 时 max-height: 140px（【增高】后的展开高度）
  */
  .chapter-label {
    font-size: 10px;
    font-weight: 400;
    margin-top: 4px;
    line-height: 1.5;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transform: translateY(-12px);
    transition:
      opacity 0.35s ease,
      max-height 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
      transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: #ffffff;
    display: inline-block;
  }

  /* 【增高】active 展开后的最大高度 */
  .chapter-item.active .chapter-label {
    opacity: 1;
    max-height: 220px;
    transform: translateY(0);
  }

  /* 时钟按钮：白色边框/图标，由容器 difference 自动反色 */
  .nav-btn-progress {
    order: -1;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    margin-top: 14px;
    margin-bottom: 6px;
    border: 1px solid #ffffff;
    border-radius: 50%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #ffffff;
    transition: border-width 0.2s ease;
    padding: 0;
    position: relative;
    z-index: 2;
    animation: discSpin 10s linear infinite;
  }

  .nav-btn-progress:hover {
    border-width: 2px;
  }

  .nav-btn-progress.is-active,
  .nav-btn-progress:active,
  .nav-btn-progress.is-detached {
    border-width: 2px;
    background: transparent;
  }

  .nav-btn-progress .icon-clock {
    display: block;
    width: 16px;
    height: 16px;
  }

  .nav-btn-progress::before {
    display: none;
  }

  .nav-current {
    display: none;
  }
}

@keyframes discSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ========================================================
   窄屏：顶部固定横栏（<= 1023px）
   ======================================================== */
@media (max-width: 1023px) {
  .side-nav-wrapper {
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
  }

  /* 水平进度条：贴紧底部边框，3px 高 */
  .nav-fill {
    bottom: 0;
    left: 0;
    height: 3px;
    width: var(--progress);
    transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .side-nav {
    flex-direction: row;
    padding: 0 16px;
    justify-content: flex-start;
    align-items: center;
  }

  /* 底部边框伪元素：纯白色，由容器 difference 统一反色 */
  .side-nav::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: #ffffff;
    z-index: 1;
    pointer-events: none;
  }

  .nav-chapters {
    display: none;
  }

  .nav-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  /* 标题：纯白色，由容器 difference 自动反色 */
  .nav-title {
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    white-space: nowrap;
    letter-spacing: 1px;
  }

  /* 当前区域：纯白色，由容器 difference 自动反色 */
  .nav-current {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    margin-right: 0;
    font-size: 14px;
    color: #ffffff;
    position: relative;
    z-index: 2;
  }

  .current-num {
    font-family: "Courier New", monospace;
    font-weight: 500;
    opacity: 0.7;
  }

  .current-label {
    font-weight: 400;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  }

  /* 窄屏按钮：白色边框/图标，由容器 difference 自动反色 */
  .nav-btn-progress {
    order: -1;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    margin: 0 12px 0 0;
    border: 1px solid #ffffff;
    border-radius: 50%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #ffffff;
    transition: border-width 0.2s ease;
    padding: 0;
    position: relative;
    z-index: 2;
    animation: discSpin 10s linear infinite;
  }

  .nav-btn-progress::before {
    display: none !important;
    content: none;
  }

  .nav-btn-progress .icon-clock {
    display: block;
    width: 16px;
    height: 16px;
  }

  .nav-btn-progress:hover {
    border-width: 2px;
  }

  .nav-btn-progress.is-active,
  .nav-btn-progress:active,
  .nav-btn-progress.is-detached {
    border-width: 2px;
    background: transparent;
  }
}

/* ========================================================
   进度页激活时：禁用章节导航（保留时钟按钮）
   ======================================================== */
.side-nav.nav-disabled .nav-chapters {
  pointer-events: none;
  opacity: 0.3;
}

.side-nav.nav-disabled .nav-current {
  pointer-events: none;
  opacity: 0.3;
}
</style>
