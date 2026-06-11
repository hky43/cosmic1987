<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-icon">404</div>
      <h1 class="not-found-title">页面未找到</h1>
      <p class="not-found-desc">您访问的页面不存在</p>
      <button class="not-found-btn" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { audioManager } from "../utils/audioManager";

const router = useRouter();

onMounted(() => {
  // 404 页面属于 home 组（点击返回首页时会重新触发）
  // 这里先切回 home 防止播放其他页音乐
  audioManager.ensureGroup("home");
});

function goHome() {
  router.push("/");
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.not-found-content {
  text-align: center;
  padding: 40px 60px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.not-found-icon {
  font-size: 72px;
  font-weight: bold;
  color: #ff6b9d;
  margin-bottom: 16px;
}

.not-found-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 12px;
}

.not-found-desc {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
}

.not-found-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #ff6b9d, #ff8ec7);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.not-found-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}
</style>
