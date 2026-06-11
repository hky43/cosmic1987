<template>
  <!-- 全局路由过渡加载动画 -->
  <Teleport to="body">
    <Transition name="route-loader-fade">
      <div v-if="showRouteLoader" class="route-loader-overlay">
        <div class="route-loader-disc">
          <div class="route-loader-grooves"></div>
          <div class="route-loader-label">
            <div class="route-loader-hole"></div>
          </div>
        </div>
        <p class="route-loader-title">WARP DRIVE ENGAGED</p>
      </div>
    </Transition>
  </Teleport>

  <!-- keep-alive 缓存首页，避免返回时 3D 模型/COS 资源重新加载 -->
  <router-view v-slot="{ Component }">
    <keep-alive include="HomePage,FuturePage,AboutPage,CosmicArchivePage">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import audioManager from "./utils/audioManager";

const showMainLayout = ref(true);
const showRouteLoader = ref(false);
const router = useRouter();
const route = useRoute();
let isInitialized = false;
let routeLoaderTimer = null;
const MIN_LOADER_DURATION = 700;

const startRouteLoader = () => {
  if (routeLoaderTimer) clearTimeout(routeLoaderTimer);
  routeLoaderTimer = null;
  showRouteLoader.value = true;
};

const endRouteLoader = () => {
  if (routeLoaderTimer) return;
  routeLoaderTimer = setTimeout(() => {
    showRouteLoader.value = false;
    routeLoaderTimer = null;
  }, MIN_LOADER_DURATION);
};

watch(
  () => route.path,
  () => {
    if (!isInitialized) {
      isInitialized = true;
      return;
    }
    endRouteLoader();
  },
);

// 监听布局变化事件
const handleLayoutChange = (event) => {
  showMainLayout.value = event.detail.showMainLayout;
};

/* 【新增】强力清理函数：移除所有可能的残留全屏遮罩 */
const forceCleanOverlays = () => {
  console.log("[App] 强制清理残留遮罩");

  // 1. 清理已知类名的遮罩元素（不含 .loading-screen，它是 Vue 管理的组件，不应外部删除）
  const knownSelectors = [
    ".global-white-mask",
    ".transition-mask",
    ".page-loader",
    ".white-fade-enter-active",
    ".white-fade-leave-active",
    ".white-fade-enter-from",
    ".white-fade-leave-to",
  ];
  knownSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      console.log("[App] 移除遮罩:", selector, el);
      el.remove();
    });
  });

  // 2. 暴力扫描 body 下所有全屏固定定位的高 z-index 元素
  document.querySelectorAll("body > *").forEach((el) => {
    // 跳过 script、style、meta 等标签
    const tag = el.tagName.toLowerCase();
    if (["script", "style", "meta", "link", "noscript"].includes(tag)) return;

    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    // 判断条件：固定定位 + 全屏尺寸 + 高 z-index + 纯色背景
    const isFixed = style.position === "fixed" || style.position === "absolute";
    const isFullScreen =
      rect.width >= window.innerWidth * 0.9 &&
      rect.height >= window.innerHeight * 0.9;
    const isHighZIndex =
      parseInt(style.zIndex) > 100 ||
      style.zIndex === "9999" ||
      style.zIndex === "99999";
    // 【修复】精确匹配纯白/纯黑不透明遮罩，避免误删正常页面元素
    // 旧逻辑中 style.background !== "none" 几乎总是 true（background 是完整简写字符串）
    // 导致任何有背景色的元素都被标记为 blockingBg，引发 Vue DOM 同步错误
    const isBlockingBg =
      style.backgroundColor === "rgb(255, 255, 255)" ||
      style.backgroundColor === "rgb(0, 0, 0)" ||
      style.backgroundColor === "#ffffff" ||
      style.backgroundColor === "#000000" ||
      (style.backgroundColor.includes("255, 255, 255") &&
        style.backgroundColor.includes(", 1)")) ||
      (style.backgroundColor.includes("0, 0, 0") &&
        style.backgroundColor.includes(", 1)"));

    if (isFixed && isFullScreen && isHighZIndex && isBlockingBg) {
      console.warn(
        "[App] 发现并移除未知全屏遮罩:",
        el.className || tag,
        style.zIndex,
        rect,
      );
      el.remove();
    }
  });

  // 3. 重置 body 和 html 被强制修改的样式
  document.body.style.background = "";
  document.body.style.overflow = "";
  document.body.style.height = "";
  document.body.style.minHeight = "";
  document.documentElement.style.background = "";
  document.documentElement.style.overflow = "";
};

/* 【新增】路由切换时立即强制清理 */
watch(
  () => route.path,
  async (newPath, oldPath) => {
    if (newPath === oldPath) return;

    console.log("[App] 路由切换:", oldPath, "->", newPath);

    // 立即执行清理（不等待动画帧）
    const cleanup = () => {
      // HomePage 需要自己管理 height/overflow，不要覆盖
      if (newPath !== "/") {
        document.body.style.height = "100%";
        document.body.style.overflow = "auto";
        document.body.style.minHeight = "";
        document.body.style.position = "";
      }
      document.body.style.background = "";
      document.documentElement.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.background = "";

      // 2. 移除所有遮罩（不含 .loading-screen，它是 Vue 管理的组件）
      const selectors = [
        ".preloader-overlay",
        ".global-white-mask",
        ".transition-loader-active",
        "#native-white-screen.is-active",
        ".transition-mask",
        ".white-fade-enter-active",
        ".white-fade-leave-active",
        ".white-fade-enter-from",
        ".white-fade-leave-to",
        ".fade-overlay",
      ];
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          // 排除 document.body / documentElement，防止误伤整页
          if (el === document.body || el === document.documentElement) return;
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.classList.remove("is-active");
          if (!el.id?.includes("native-white")) {
            setTimeout(() => el.remove(), 300);
          }
        });
      });
    };

    // 立即执行一次
    cleanup();
    // 等 Vue 渲染完再执行一次（确保上一个组件彻底卸载）
    nextTick(cleanup);
    setTimeout(cleanup, 100);
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener("layout-change", handleLayoutChange);

  // 初始化时获取当前状态
  if (window.__APP_STATE__?.showMainLayout) {
    showMainLayout.value = window.__APP_STATE__.showMainLayout.value;
  }

  // 【新增】初始化音频管理器
  audioManager.init();

  // 【新增】初始化当前路由的音频
  audioManager.switchToPath(route.path);

  // 路由守卫 - 显示加载动画 + 清理遮罩 + 切换音频
  const unsubscribeRouter = router.beforeEach((to, from, next) => {
    console.log("[App] 路由变化:", from.path, "->", to.path);
    // 初始页面加载时不显示 WARP DRIVE（此时由 HomePageLoading 负责加载动画）
    if (!isInitialized) {
      isInitialized = true;
      next();
      return;
    }
    // 后续页面切换：显示路由加载动画
    startRouteLoader();
    // 清理遮罩
    forceCleanOverlays();
    // 切换音频到目标页面
    audioManager.switchToPath(to.path);
    // 直接允许跳转
    next();
  });

  // 【新增】在 beforeunload 时保存最后状态
  const handleBeforeUnload = () => {
    audioManager.saveGroupState();
  };
  window.addEventListener("beforeunload", handleBeforeUnload);

  // 保存清理函数，在 onUnmounted 中调用
  window.__AUDIO_CLEANUP__ = () => {
    unsubscribeRouter();
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
});

onUnmounted(() => {
  window.removeEventListener("layout-change", handleLayoutChange);

  // 【新增】清理音频管理器
  if (window.__AUDIO_CLEANUP__) {
    window.__AUDIO_CLEANUP__();
  }
  audioManager.destroy();
});
</script>

<style>
/* ════════════════════════════════════════════════════════════
   全局基础样式（从 App.vue 移到这里统一管理）
   ════════════════════════════════════════════════════════════ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

/* 文字不可选中 + 隐藏光标（仅非输入元素） */
body {
  user-select: none;
  -webkit-user-select: none;
  caret-color: transparent;
}

/* 输入框恢复正常 */
input,
textarea,
[contenteditable="true"] {
  user-select: text;
  -webkit-user-select: text;
  caret-color: auto;
}

/* 路由过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ════════════════════════════════════════════════════════════
   全局路由加载动画（与 PagePreloader 同风格）
   ════════════════════════════════════════════════════════════ */
.route-loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.route-loader-disc {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #111;
  position: relative;
  animation: route-disc-spin 1.2s linear infinite;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.route-loader-grooves {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: repeating-radial-gradient(
    circle at center,
    transparent 0,
    transparent 2px,
    rgba(255, 255, 255, 0.06) 3px,
    transparent 4px
  );
}

.route-loader-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
}

.route-loader-hole {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
}

@keyframes route-disc-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.route-loader-title {
  font-size: 12px;
  letter-spacing: 6px;
  color: #999;
  text-transform: uppercase;
  margin: 0;
}

.route-loader-fade-enter-active {
  transition: opacity 0.15s ease;
}
.route-loader-fade-leave-active {
  transition: opacity 0.3s ease;
}
.route-loader-fade-enter-from,
.route-loader-fade-leave-to {
  opacity: 0;
}
</style>
