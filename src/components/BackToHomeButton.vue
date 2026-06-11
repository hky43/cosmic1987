<template>
  <button class="back-to-home-btn" @click="handleClick">
    <span class="btn-icon">←</span>
    <span class="btn-text">HOME</span>
  </button>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { audioManager } from "../utils/audioManager";

const router = useRouter();
const route = useRoute();

const handleClick = () => {
  // 清除所有主题相关的标记
  sessionStorage.removeItem("themeMusicActive");
  sessionStorage.removeItem("currentThemeMusic");
  sessionStorage.removeItem("currentThemeIndex");

  // 【修复】清除首页跳过加载标记，确保返回首页时显示加载动画
  sessionStorage.removeItem("navigatedToHome");

  // 先恢复主题音乐模式（如果有的话）
  audioManager.restoreHomeMusic();

  // 确保切到首页音乐组并播放（补齐 restoreHomeMusic 在非主题模式下的空窗）
  audioManager.switchToPath("/");

  router.push("/");
};

const handleKeydown = (e) => {
  if (e.key === "Escape") {
    // 检查当前是否在About页面或其子页面
    const isAboutPage =
      route.path.startsWith("/about-2") || route.path.startsWith("/about/");

    // 仅在非About页面时响应ESC键返回首页
    // About页面的ESC键由其内部逻辑处理（阶段切换）
    if (!isAboutPage) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      handleClick();
    }
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.back-to-home-btn {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
}

.back-to-home-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.back-to-home-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  text-transform: uppercase;
}
</style>
