<template>
  <!-- 
    节点地图层：绝对定位覆盖在背景图上
    宽度和高度与父级 .scroll-track 完全一致
    因此节点百分比坐标直接对应背景图位置
  -->
  <div class="ark-map-layer" :style="{ width: trackWidth + 'px' }">
    <!-- SVG 连线层和滤镜 -->
    <svg
      class="connection-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <!-- 粗糙边缘滤镜（保留） -->
        <filter id="roughEdge">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <!-- 印刷粗糙滤镜：边缘毛边 + 油墨颗粒 -->
        <filter id="print-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="5"
            seed="3"
            result="edgeNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="edgeNoise"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="roughEdges"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.2"
            numOctaves="3"
            seed="7"
            result="grain"
          />
          <feColorMatrix
            type="matrix"
            in="grain"
            result="grainAlpha"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.35 0"
          />
          <feComposite
            in="grainAlpha"
            in2="roughEdges"
            operator="in"
            result="textGrain"
          />
          <feBlend
            in="textGrain"
            in2="roughEdges"
            mode="multiply"
            result="blended"
          />
          <feColorMatrix
            type="matrix"
            in="blended"
            result="final"
            values="1.05 0 0 0 -0.02
                    0 0.95 0 0 0.01
                    0 0 0.90 0 0.01
                    0 0 0 1 0"
          />
        </filter>
      </defs>
      <line
        v-for="(line, index) in connectionLines"
        :key="'line-' + index"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        class="connection-line"
      />
    </svg>

    <!-- ============================================ -->
    <!-- 【苏联档案风格 · 艺术阴影字标题】 -->
    <!-- 【划分位置】ART-SECTION-START -->
    <!-- ============================================ -->
    <div class="archive-paper">
      <div class="art-container">
        <!-- 【划分位置】ART-TEXT-START -->
        <div class="art-text">
          <span class="line1 animate-word">上升，</span>
          <span class="line2 animate-word-delay">苏联</span>
        </div>
        <!-- 【划分位置】ART-TEXT-END -->

        <!-- 【划分位置】STAMP-START -->
        <!-- 装饰语录：风格与艺术字统一，红字黑边 + 粗砺印刷颗粒 -->
        <div class="russian-stamp animate-final-stamp">1957 · 1961 · 永恒</div>
        <!-- 【划分位置】STAMP-END -->
      </div>
    </div>
    <!-- ============================================ -->
    <!-- 【划分位置】ART-SECTION-END -->
    <!-- 【苏联档案风格 · 艺术阴影字标题】END -->
    <!-- ============================================ -->

    <!-- 节点卡片 -->
    <div
      v-for="node in sortedNodes"
      :key="node.id"
      class="map-node"
      :style="{
        left: node.x + '%',
        top: node.y + '%',
        '--node-color': node.color,
      }"
      @click.stop="handleNodeClick(node)"
    >
      <div class="node-type">{{ node.type }}</div>
      <div class="node-title">{{ node.title }}</div>
      <div class="node-subtitle">{{ node.subtitle }}</div>
      <div class="node-indicator"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

/* ==================== Props ==================== */
const props = defineProps({
  nodes: {
    type: Array,
    default: () => [],
  },
  trackWidth: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["nodeClick"]);
const router = useRouter();

/* ==================== 排序节点 ==================== */
const sortedNodes = computed(() => {
  return [...props.nodes].sort((a, b) => a.x - b.x);
});

/* ==================== 连接线 ==================== */
const connectionLines = computed(() => {
  const lines = [];
  const nodes = sortedNodes.value;

  for (let i = 0; i < nodes.length - 1; i++) {
    const current = nodes[i];
    const next = nodes[i + 1];
    lines.push({
      x1: current.x,
      y1: current.y,
      x2: next.x,
      y2: next.y,
    });
  }
  return lines;
});

/* ==================== 节点点击处理 ==================== */
const handleNodeClick = (node) => {
  // 触发父组件事件
  emit("nodeClick", node);

  // 如果节点配置了页面路径，则跳转到对应页面
  if (node.pagePath) {
    router.push(node.pagePath);
  }
};
</script>

<style scoped>
/* ========== 地图层 ========== */
.ark-map-layer {
  position: absolute; /* 相对于 .scroll-track */
  top: 0;
  left: 0;
  height: 100%; /* = 100vh */
  pointer-events: none; /* 容器不拦截事件 */
  z-index: 10;
}

/* ========== SVG 连线 ========== */
.connection-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.connection-line {
  stroke: #c41e3a;
  stroke-width: 0.5;
  stroke-linecap: round;
  opacity: 0.7;
  filter: drop-shadow(0 0 3px rgba(196, 30, 58, 0.8));
}

@keyframes dashFlow {
  to {
    stroke-dashoffset: -2;
  }
}

/* ========== 节点卡片 ========== */
.map-node {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 170px;
  padding: 0;
  background: rgba(10, 10, 10, 0.9);
  border: 1px solid #c41e3a;
  border-radius: 2px;
  cursor: pointer;
  pointer-events: auto; /* 节点本身可点击 */
  user-select: none;
  touch-action: pan-x pan-y; /* 允许触摸滚动穿透 */
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(8px);
  overflow: hidden;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(196, 30, 58, 0.3);
}

.map-node:hover {
  transform: translate(-50%, -60%) scale(1.05);
  border-color: #fff;
  box-shadow: 0 0 24px rgba(196, 30, 58, 0.4);
}

/* 顶部类型条 */
.node-type {
  background: #c41e3a;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 4px 8px;
  text-transform: uppercase;
}

/* 内容区域 */
.node-title {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 10px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-subtitle {
  color: #888;
  font-size: 11px;
  padding: 0 10px 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 指示器 */
.node-indicator {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-right: 2px solid #c41e3a;
  border-bottom: 2px solid #c41e3a;
  transform: translateY(-50%) rotate(-45deg);
  transition: all 0.3s ease;
}

.map-node:hover .node-indicator {
  transform: translateY(-50%) rotate(45deg);
  border-color: #fff;
}

/* ============================================ */
/* 【苏联档案风格 · 艺术阴影字样式】 */
/* 【划分位置】STYLE-ART-START */
/* ============================================ */

/* ---------- 档案纸张容器 ---------- */
/* 【划分位置】STYLE-PAPER-START */
.archive-paper {
  position: absolute;
  left: 18%;
  top: 45%;
  transform: translate(-50%, -50%);
  z-index: 10;
  opacity: 0;
  animation: archiveFadeIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s forwards;
}
/* 【划分位置】STYLE-PAPER-END */

/* ---------- 艺术字容器 ---------- */
/* 【划分位置】STYLE-CONTAINER-START */
.art-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}
/* 【划分位置】STYLE-CONTAINER-END */

/* ---------- 艺术字主体 ---------- */
/* 【划分位置】STYLE-ART-TEXT-START */
.art-text {
  position: relative;
  text-align: left;
  line-height: 1;
  transform: rotate(-5deg);
  font-family:
    "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
    sans-serif;
  font-weight: 900;
  /* 粗糙印刷滤镜：边缘毛边 + 油墨颗粒 */
  filter: url(#print-rough);
}

.art-text .line1,
.art-text .line2 {
  display: block;
  position: relative;
  color: #b91c1c;
  letter-spacing: 0.05em;
  /* 粗黑边描边，paint-order 确保描边在外、填充在内，避免内部杂线 */
  -webkit-text-stroke: 2.5px #1a0f0a;
  paint-order: stroke fill;
  /* 立体阴影，模拟印刷压痕 */
  text-shadow: 5px 5px 0px rgba(60, 40, 20, 0.4);
}

.art-text .line1 {
  font-size: clamp(3.5rem, 10vw, 7rem);
  margin-bottom: -0.05em;
  padding-left: 0.1em;
}

.art-text .line2 {
  font-size: clamp(5rem, 14vw, 10rem);
}
/* 【划分位置】STYLE-ART-TEXT-END */

/* ---------- 俄文印章装饰 ---------- */
/* 【划分位置】STYLE-STAMP-START */
/* 风格与艺术字统一：红字 + 黑边 + 粗砺印刷颗粒 */
.russian-stamp {
  margin-top: 1rem;
  font-family: "Courier New", monospace;
  font-weight: 900;
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
  color: #b91c1c;
  background: transparent;
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 2px;
  transform: rotate(-2deg);
  /* 与艺术字统一的描边：黑边在外，无内部杂线 */
  -webkit-text-stroke: 1.2px #1a0f0a;
  paint-order: stroke fill;
  /* 立体阴影 */
  text-shadow: 3px 3px 0px rgba(60, 40, 20, 0.4);
  /* 粗砺印刷颗粒滤镜 */
  filter: url(#print-rough);
}
/* 【划分位置】STYLE-STAMP-END */

/* ============================================ */
/* 【艺术字动画效果】 */
/* 【划分位置】ANIMATION-START */
/* ============================================ */

/* ---------- 纸张入场动画 ---------- */
/* 【划分位置】ANIMATION-ARCHIVE-START */
@keyframes archiveFadeIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) translateY(20px);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0);
    filter: blur(0);
  }
}
/* 【划分位置】ANIMATION-ARCHIVE-END */

/* ---------- 文字入场动画 ---------- */
/* 【划分位置】ANIMATION-WORD-SLIDE-START */
@keyframes wordSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-30px) scale(0.8);
    filter: blur(4px);
  }
  60% {
    opacity: 1;
    transform: translateY(5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
/* 【划分位置】ANIMATION-WORD-SLIDE-END */

/* ---------- 印章入场动画 ---------- */
/* 【划分位置】ANIMATION-STAMP-START */
@keyframes stampPopIn {
  0% {
    opacity: 0;
    transform: rotate(-15deg) scale(0.5);
  }
  50% {
    transform: rotate(3deg) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: rotate(-2deg) scale(1);
  }
}
/* 【划分位置】ANIMATION-STAMP-END */

/* ---------- 分隔线动画 ---------- */
/* 【划分位置】ANIMATION-DIVIDER-START */
@keyframes dividerGrow {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    width: 80%;
    opacity: 1;
  }
}
/* 【划分位置】ANIMATION-DIVIDER-END */

/* ---------- 动画类名 ---------- */
/* 【划分位置】ANIMATION-CLASS-START */
.animate-word {
  opacity: 0;
  animation: wordSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s forwards;
}

.animate-word-delay {
  opacity: 0;
  animation: wordSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.6s forwards;
}

.animate-final-stamp {
  opacity: 0;
  animation: stampPopIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 2.1s forwards;
}
/* 【划分位置】ANIMATION-CLASS-END */

/* ---------- 响应式微调 ---------- */
/* 【划分位置】RESPONSIVE-START */
@media (max-width: 640px) {
  .archive-paper {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .archive-paper {
    padding: 1.5rem 2rem;
  }
  .art-container {
    gap: 2rem;
  }
  .russian-stamp {
    font-size: 0.65rem;
    padding: 0.2rem 0.6rem;
  }
}
/* 【划分位置】RESPONSIVE-END */

/* ============================================ */
/* 【划分位置】STYLE-ART-END */
/* 【苏联档案风格 · 艺术阴影字样式】END */
/* ============================================ */
</style>
