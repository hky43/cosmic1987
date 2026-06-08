<template>
  <div class="navigation_container">
    <!-- 顶部左侧图片容器 -->
    <div class="navigation_logo">
      <img
        :src="asset('images/decorations/未完成.png')"
        alt="Logo"
        class="navigation_logo_img"
      />
    </div>
    <!-- 章节导航区域 -->
    <div class="navigation_navbar">
      <!-- 向左箭头（PREV）- 如果不是第一页则显示 -->
      <div
        v-if="currentPage > 1"
        class="navigation_arrow navigation_arrow_prev"
        @click="goToPrev"
      >
        <div />
        <p class="_font_1">PREV</p>
      </div>

      <!-- 章节列表 -->
      <div class="navigation_chapters">
        <div
          class="navigation_chapters_chapter"
          v-for="n in totalPages"
          :key="n"
          :class="{ active: n === currentPage }"
          @click="goToChapter(n)"
        >
          <p class="_font_1">Ch.0{{ n }}</p>
          <div />
        </div>
      </div>

      <!-- 向右箭头（NEXT）- 如果不是最后一页则显示 -->
      <div
        v-if="currentPage < totalPages"
        class="navigation_arrow navigation_arrow_next"
        @click="goToNext"
      >
        <p class="_font_1">NEXT</p>
        <div />
      </div>
    </div>

    <!-- 阅读模式按钮占位 -->
    <div class="navigation_readmode" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { asset } from "@/utils/asset";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    default: 7,
  },
});

const emit = defineEmits(["navigate"]);

function goToPrev() {
  if (props.currentPage > 1) {
    emit("navigate", props.currentPage - 1);
  }
}

function goToNext() {
  if (props.currentPage < props.totalPages) {
    emit("navigate", props.currentPage + 1);
  }
}

function goToChapter(chapterNum) {
  if (chapterNum !== props.currentPage) {
    emit("navigate", chapterNum);
  }
}
</script>

<style scoped>
.navigation_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  margin-right: calc(var(--scale) * 2rem);
  padding-top: calc(var(--scale) * 1.5rem);
  position: relative;
}

/* 顶部左侧图片容器 */
.navigation_logo {
  position: absolute;
  left: calc(var(--scale) * -36rem); /* 向左定位到页面左侧 */
  width: calc(var(--scale) * 7rem); /* 增加宽度 */
  height: calc(var(--scale) * 7rem); /* 增加高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: calc(var(--scale) * 0.3rem);
  overflow: hidden;
  z-index: 101;
}

.navigation_logo_img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.navigation_navbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: calc(var(--scale) * 1rem);
}

.navigation_arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s ease;
  flex-shrink: 0;
}

.navigation_arrow:hover {
  opacity: 0.7;
}

.navigation_arrow div {
  background-color: var(--color_white);
  width: calc(var(--scale) * 0.8rem * 0.866);
  height: calc(var(--scale) * 0.8rem);
}

.navigation_arrow_prev div {
  margin-right: calc(var(--scale) * 0.3rem);
  clip-path: polygon(100% 0, 100% 100%, 0 50%);
}

.navigation_arrow_next div {
  margin-left: calc(var(--scale) * 0.3rem);
  clip-path: polygon(0 0, 0 100%, 100% 50%);
}

.navigation_arrow p {
  color: var(--color_white);
  font-family: "Press Start 2P", Consolas, Monaco, monospace;
  font-size: calc(var(--scale) * 0.45rem);
  letter-spacing: calc(var(--scale) * 0.05rem);
}

.navigation_chapters {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  width: 100%;
  max-width: calc(var(--scale) * 23rem);
  overflow-x: auto;
  padding: calc(var(--scale) * 0.5rem) calc(var(--scale) * 1rem);
  scrollbar-width: thin;
  scrollbar-color: var(--color_theme) transparent;
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent,
    #000 20%,
    #000 80%,
    transparent
  );
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 20%,
    #000 80%,
    transparent
  );
}

.navigation_chapters::-webkit-scrollbar {
  height: 4px;
}

.navigation_chapters::-webkit-scrollbar-track {
  background: transparent;
}

.navigation_chapters::-webkit-scrollbar-thumb {
  background-color: var(--color_theme);
  border-radius: 2px;
}

.navigation_chapters_chapter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: calc(var(--scale) * 2rem); /* 改为右侧间距 */
  cursor: pointer;
  transition: opacity 0.3s ease;
  width: calc(var(--scale) * 4rem);
}

.navigation_chapters_chapter:last-child {
  margin-right: 0;
}

.navigation_chapters_chapter:hover {
  opacity: 0.7;
}

.navigation_chapters_chapter.active p {
  color: var(--color_theme);
}

.navigation_chapters_chapter.active div {
  background-color: var(--color_theme);
}

.navigation_chapters_chapter p {
  color: var(--color_white);
  margin: 0;
  font-size: calc(var(--scale) * 0.6rem);
  font-family: "Press Start 2P", Consolas, Monaco, "Courier New", monospace;
  letter-spacing: calc(var(--scale) * 0.08rem);
  text-shadow: 0 0 calc(var(--scale) * 0.15rem) currentColor;
  line-height: 2;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  font-smooth: never;
  -webkit-font-smoothing: none;
}

.navigation_chapters_chapter div {
  width: calc(var(--scale) * 0.15rem);
  height: calc(var(--scale) * 2rem);
  background-color: var(--color_white);
  margin-top: calc(var(--scale) * 0.3rem);
  align-self: center;
}

.navigation_readmode {
  width: calc(var(--scale) * 3rem);
  height: calc(var(--scale) * 3rem);
  margin-top: auto;
  margin-bottom: calc(var(--scale) * 2rem);
}
</style>
