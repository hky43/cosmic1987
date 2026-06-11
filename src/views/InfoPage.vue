<template>
  <div class="info-page" :class="{ 'is-hidden': !showInfoPage }">
    <div class="info-container">
      <header class="info-header">
        <h1 class="info-title">COSMIC 1987</h1>
        <p class="info-subtitle">PROJECT OVERVIEW</p>
        <div class="info-divider"></div>
      </header>

      <section class="info-section">
        <h2 class="section-title">项目简介</h2>
        <p class="section-text">
          <strong>COSMIC 1987</strong> 是一个融合<strong
            >音乐、3D 视觉与交互体验</strong
          >的沉浸式前端项目， 灵感来源于<strong>旅行者号金唱片</strong>与 1987
          年那束载入人类天文史册的超新星光芒。
        </p>
        <p class="section-text">
          项目以<strong>滚动叙事</strong>为核心，带你漫游宇宙探索的四个篇章：从人类起源到星辰大海，
          从历史档案到未来想象，每一帧都在讲述人类对宇宙永恒的好奇。
        </p>
      </section>

      <section class="info-section">
        <h2 class="section-title">项目架构</h2>
        <div class="section-text">
          <ul class="info-list">
            <li>
              <strong>框架层</strong>：Vue 3 Composition API +
              <a href="https://router.vuejs.org/" target="_blank" rel="noopener"
                >Vue Router</a
              >
              + keep-alive 缓存
            </li>
            <li>
              <strong>3D 渲染</strong>：<a
                href="https://threejs.org/"
                target="_blank"
                rel="noopener"
                >Three.js</a
              >
              +
              <a
                href="https://www.babylonjs.com/"
                target="_blank"
                rel="noopener"
                >Babylon.js</a
              >
              双引擎混合渲染
            </li>
            <li>
              <strong>物理引擎</strong>：<a
                href="http://brm.io/matter-js/"
                target="_blank"
                rel="noopener"
                >Matter.js</a
              >
              2D 物理模拟 + Ammo.js 物理碰撞
            </li>
            <li>
              <strong>音频系统</strong>：<a
                href="https://github.com/goldfire/howler.js"
                target="_blank"
                rel="noopener"
                >Howler.js</a
              >
              全局音频管理 + 页面专属音乐组
            </li>
            <li><strong>页面结构</strong>：多章节路由 + 滚动驱动分镜叙事</li>
            <li>
              <strong>构建工具</strong>：<a
                href="https://vitejs.dev/"
                target="_blank"
                rel="noopener"
                >Vite</a
              >
              极速热更新
            </li>
          </ul>
        </div>
      </section>

      <section class="info-section">
        <h2 class="section-title">主要功能模块</h2>
        <div class="section-text">
          <div class="feature-grid">
            <div class="feature-card">
              <h3 class="feature-title">🏠 首页 / Home</h3>
              <p class="feature-desc">
                动态波纹网格 + 预加载开场动画 + 沉浸式滚动导航
              </p>
            </div>
            <div class="feature-card">
              <h3 class="feature-title">🚀 起源 / About</h3>
              <p class="feature-desc">
                从原子到生命，立方体发射到航天器展示，分阶段 3D 叙事
              </p>
            </div>
            <div class="feature-card">
              <h3 class="feature-title">🌌 航行 / Travel</h3>
              <p class="feature-desc">
                旅行者号航行轨迹，星际方舟互动地图，逐帧分镜
              </p>
            </div>
            <div class="feature-card">
              <h3 class="feature-title">📚 星图 / Cosmic Archive</h3>
              <p class="feature-desc">
                全画布星图绘制，星座连线交互，档案式阅读体验
              </p>
            </div>
            <div class="feature-card">
              <h3 class="feature-title">🔮 未来 / Future</h3>
              <p class="feature-desc">
                3D 交互场景，游戏化设计，探索未来无限可能
              </p>
            </div>
            <div class="feature-card">
              <h3 class="feature-title">📊 进度 / UserProgress</h3>
              <p class="feature-desc">
                用户阅读进度追踪，侧滑面板，进度可视化卡片
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="info-section">
        <h2 class="section-title">技术栈</h2>
        <div class="tech-grid">
          <div class="tech-group">
            <h4 class="group-title">核心框架</h4>
            <div class="tech-list">
              <span class="tech-tag">Vue 3</span>
              <span class="tech-tag">Vite</span>
              <span class="tech-tag">Vue Router</span>
              <span class="tech-tag">Pinia</span>
            </div>
          </div>
          <div class="tech-group">
            <h4 class="group-title">图形引擎</h4>
            <div class="tech-list">
              <span class="tech-tag">Three.js</span>
              <span class="tech-tag">Babylon.js</span>
              <span class="tech-tag">Ammo.js</span>
              <span class="tech-tag">TresJS</span>
            </div>
          </div>
          <div class="tech-group">
            <h4 class="group-title">物理与动画</h4>
            <div class="tech-list">
              <span class="tech-tag">Matter.js</span>
              <span class="tech-tag">GSAP</span>
              <span class="tech-tag">Lenis</span>
              <span class="tech-tag">VueUse Motion</span>
            </div>
          </div>
          <div class="tech-group">
            <h4 class="group-title">音频</h4>
            <div class="tech-list">
              <span class="tech-tag">Howler.js</span>
            </div>
          </div>
        </div>
      </section>

      <section class="info-section">
        <h2 class="section-title">交互设计亮点</h2>
        <div class="section-text">
          <ul class="info-list">
            <li>
              🔹 <strong>滚动驱动叙事</strong> —
              根据滚动位置触发分镜动画，沉浸式阅读体验
            </li>
            <li>
              🔹 <strong>多引擎协作</strong> — Three.js 做精细渲染，Babylon.js
              处理复杂物理场景
            </li>
            <li>
              🔹 <strong>音乐组管理</strong> —
              每个页面独立音乐分组，路由切换自动切换配乐
            </li>
            <li>
              🔹 <strong>资源预加载</strong> —
              关键图片/模型预加载，动画流畅不等待
            </li>
            <li>
              🔹 <strong>状态记忆</strong> — keep-alive + sessionStorage
              记住阅读进度
            </li>
            <li>
              🔹 <strong>性能优化</strong> — 定时器清理，按需渲染，动画帧调度
            </li>
          </ul>
        </div>
      </section>

      <footer class="info-footer">
        <span class="footer-text">DESIGNED & DEVELOPED WITH CURIOSITY</span>
        <div class="footer-year">© 1987 / 2025</div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { watch, onUnmounted } from "vue";

const props = defineProps({
  showInfoPage: { type: Boolean, default: false },
});

const lockBodyScroll = () => {
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
};

watch(
  () => props.showInfoPage,
  (val) => {
    if (val) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  unlockBodyScroll();
});
</script>

<style scoped>
.info-page {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #0a0a12;
  background: linear-gradient(135deg, #0a0a12 0%, #121220 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.info-page.is-hidden {
  transform: translateX(100%);
  pointer-events: none;
}

.info-container {
  width: 100%;
  max-width: 720px;
  padding: 60px 32px 80px;
}

.info-header {
  text-align: center;
  margin-bottom: 56px;
}

.info-title {
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px;
  letter-spacing: 3px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.info-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: #888899;
  margin: 0;
  letter-spacing: 6px;
  text-transform: uppercase;
  font-family: "Courier New", monospace;
}

.info-divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #ffffff 50%,
    transparent 100%
  );
  margin: 28px auto 0;
}

.info-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-family: "Courier New", monospace;
}

.section-text {
  font-size: 15px;
  font-weight: 400;
  color: #ccccdd;
  line-height: 1.8;
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.section-text p {
  margin: 0 0 12px;
}

.section-text p:last-child {
  margin-bottom: 0;
}

.section-text a {
  color: #88aaff;
  text-decoration: none;
  border-bottom: 1px solid rgba(136, 170, 255, 0.4);
  transition: all 0.2s ease;
}

.section-text a:hover {
  color: #aaccff;
  border-bottom-color: #aaccff;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  padding: 6px 0;
  color: #ccccdd;
}

.info-list strong {
  color: #ffffff;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 16px;
  backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

.feature-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 6px;
  letter-spacing: 0.5px;
}

.feature-desc {
  font-size: 13px;
  color: #aab;
  line-height: 1.6;
  margin: 0;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.tech-group {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 14px;
}

.group-title {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 10px;
  letter-spacing: 1px;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #dde;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-family: "Courier New", monospace;
  letter-spacing: 0.5px;
}

.info-footer {
  margin-top: 64px;
  text-align: center;
}

.footer-text {
  display: block;
  font-size: 12px;
  color: #666677;
  letter-spacing: 3px;
  font-family: "Courier New", monospace;
}

.footer-year {
  margin-top: 12px;
  font-size: 14px;
  color: #444455;
  letter-spacing: 2px;
  font-family: "Courier New", monospace;
}
</style>
