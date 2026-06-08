<template>
  <div class="mmd-page">
    <!-- 当白色背景层显示时，隐藏所有内容 -->
    <template v-if="!showWhiteOverlay">
      <!-- MMD 播放器 -->
      <MmdPlayer />
    </template>

    <!-- 白色背景层（按 ESC 返回时显示） -->
    <WhiteOverlay v-model="showWhiteOverlay" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import MmdPlayer from "../../components/MmdPlayer.vue";
import WhiteOverlay from "../../components/views/home/WhiteOverlay.vue";

const showWhiteOverlay = ref(false);

const handleKeydown = (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();

    // 检查是否从白色背景层进入
    const fromOverlay = sessionStorage.getItem("fromWhiteOverlay") === "true";

    if (fromOverlay) {
      // 从白色背景层进入的，显示白色背景层
      sessionStorage.removeItem("fromWhiteOverlay");
      showWhiteOverlay.value = true;
    } else {
      // 直接进入的，也显示白色背景层
      showWhiteOverlay.value = true;
    }

    // 停止音频
    stopAudio();
  }
};

// 停止音频
const stopAudio = () => {
  if (window.audioManager) {
    window.audioManager.pause();
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
.mmd-page {
  width: 100vw;
  height: 100vh;
  background: #0a0a12;
  position: relative;
}
</style>
