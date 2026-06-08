<!-- src/components/GridBackground.vue -->
<template>
  <div class="grid-background" ref="gridRef">
    <!-- 静态网格线 -->
    <div class="grid-lines"></div>

    <!-- 发光方格层 -->
    <div class="glow-layer">
      <div
        v-for="(cell, index) in glowingCells"
        :key="index"
        class="glow-cell"
        :style="{
          left: cell.x + 'px',
          top: cell.y + 'px',
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const gridRef = ref(null);
const GRID_SIZE = 30; // 缩小方格大小为20px
const GLOW_RADIUS = 1; // 发光范围（周围格子数量）
const glowingCells = ref([]);
let animationFrameId = null;
let timers = [];

const handleMouseMove = (e) => {
  const x = e.clientX;
  const y = e.clientY;

  // 计算鼠标所在的方格坐标
  const gridX = Math.floor(x / GRID_SIZE) * GRID_SIZE;
  const gridY = Math.floor(y / GRID_SIZE) * GRID_SIZE;

  // 添加发光方格及其周围的格子
  for (let dx = -GLOW_RADIUS; dx <= GLOW_RADIUS; dx++) {
    for (let dy = -GLOW_RADIUS; dy <= GLOW_RADIUS; dy++) {
      const cellX = gridX + dx * GRID_SIZE;
      const cellY = gridY + dy * GRID_SIZE;

      // 检查是否已经存在相同位置的方格
      const exists = glowingCells.value.some(
        (cell) => cell.x === cellX && cell.y === cellY,
      );
      if (exists) continue;

      // 添加新的发光方格
      const newCell = {
        x: cellX,
        y: cellY,
      };
      glowingCells.value.push(newCell);

      // 0.1秒后直接移除
      const timer = setTimeout(() => {
        const index = glowingCells.value.indexOf(newCell);
        if (index > -1) {
          glowingCells.value.splice(index, 1);
        }
      }, 100);
      timers.push(timer);
    }
  }
};

const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  timers.forEach((timer) => clearTimeout(timer));
};

onMounted(() => {
  // 使用 document 级别监听，确保能捕获整个页面的鼠标移动
  document.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleMouseMove);
  cleanup();
});
</script>

<style scoped>
.grid-background {
  position: fixed;
  inset: 0;
  pointer-events: auto;
  z-index: 0;
  background-color: transparent;
  cursor: default;
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 30px 30px;
  background-position: 0 0;
}

.glow-layer {
  position: absolute;
  inset: 0;
}

.glow-cell {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 0.5px solid rgba(214, 12, 12, 0.466);
  box-sizing: border-box;
  pointer-events: none;
}
</style>
