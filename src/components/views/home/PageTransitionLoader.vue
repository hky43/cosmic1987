<template>
  <div v-if="visible" class="transition-loader" :style="loaderStyle">
    <div class="loader-stage">
      <div class="loader-disc" :class="{ 'is-loaded': preloadReady }">
        <div class="disc-grooves"></div>
        <div class="disc-label"><span class="disc-hole"></span></div>
      </div>
      <p class="loader-title">WARP DRIVE ENGAGED</p>
      <p class="loader-target">{{ targetTitle || "星际航道" }}</p>
      <div class="loader-track">
        <div
          class="loader-fill"
          :style="{ transform: `scaleX(${progress / 100})` }"
        ></div>
      </div>
      <p class="loader-percent">{{ Math.floor(progress) }}%</p>
      <p v-if="progress >= 100 && !isRedirecting" class="loader-hint">
        {{ statusText }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { audioManager } from "../../../utils/audioManager";
import { asset } from "../../../utils/asset";

const route = useRoute();
const router = useRouter();

const progress = ref(0);
const visible = ref(true);
const isRedirecting = ref(false);
const preloadReady = ref(false);
const statusText = ref("正在准备...");

const targetTitle = ref(route.query.title || "");
const redirectUrl = ref(route.query.redirect || "/");
const scrollY = ref(route.query.scrollY || "0");

const MIN_ANIMATION_MS = 800;

const PAGE_PRELOAD_CONFIG = {
  "/": {
    importFn: () => import("../../../views/Home/HomePage.vue"),
    images: [
      "images/travel/sputnik.jpg",
      "images/decorations/image.png",
      "images/decorations/Decoration2.jpg",
    ],
  },
  "/travel-1": {
    importFn: () => import("../../../views/Travel/index.vue"),
    images: ["images/travel/travel-2.png", "images/travel/travel-3.png"],
  },
  "/about-2-main": {
    importFn: () => import("../../../views/About/index.vue"),
    images: ["images/icons/图标1.png"],
    models: [asset("旅行者1号fbx模型/3d66.com_27450833.fbx")],
  },
  "/cosmic-wave-3": {
    importFn: () => import("../../../views/CosmicArchive/index.vue"),
    images: [],
  },
  "/future-4": {
    importFn: () => import("../../../views/Future/index.vue"),
    images: ["images/decorations/未完成.png"],
  },
};

const resolveConfig = (path) => {
  if (PAGE_PRELOAD_CONFIG[path]) return PAGE_PRELOAD_CONFIG[path];
  const basePath = path.split("?")[0];
  if (PAGE_PRELOAD_CONFIG[basePath]) return PAGE_PRELOAD_CONFIG[basePath];
  return null;
};

const preloadImage = (src) => {
  return new Promise((resolve) => {
    if (!src) return resolve();
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      console.warn("[TransitionLoader] 图片预加载失败:", src);
      resolve();
    };
    img.src = src;
  });
};

const preloadModel = async (url) => {
  if (!url) return;
  try {
    console.log("[TransitionLoader] 预加载模型:", url);
    const response = await fetch(url, { cache: "force-cache" });
    if (response.ok) {
      const blob = await response.blob();
      console.log(
        `[TransitionLoader] 模型预加载完成: ${(blob.size / 1024 / 1024).toFixed(1)}MB`,
      );
    }
  } catch (err) {
    console.warn("[TransitionLoader] 模型预加载失败:", url, err);
  }
};

const preloadImages = async (imagePaths) => {
  if (!imagePaths || imagePaths.length === 0) return;
  const urls = imagePaths.map((p) => asset(p));
  console.log("[TransitionLoader] 预加载图片:", urls);
  await Promise.all(urls.map((url) => preloadImage(url)));
};

const preloadTarget = async (path) => {
  const config = resolveConfig(path);
  if (!config) {
    console.log("[TransitionLoader] 无预加载配置，视为已就绪");
    preloadReady.value = true;
    statusText.value = "准备就绪";
    return;
  }

  statusText.value = "正在加载页面组件...";
  try {
    const componentPromise = config.importFn().then(() => {
      console.log("[TransitionLoader] 组件模块加载完成:", path);
    });
    const imagesPromise = preloadImages(config.images);
    const modelsPromise = config.models
      ? Promise.all(config.models.map((url) => preloadModel(url)))
      : Promise.resolve();

    await Promise.all([componentPromise, imagesPromise, modelsPromise]);

    preloadReady.value = true;
    statusText.value = "全部资源就绪";
    console.log("[TransitionLoader] 全部预加载完成:", path);
  } catch (err) {
    console.error("[TransitionLoader] 预加载失败:", err);
    preloadReady.value = true;
    statusText.value = "正在校准航线...";
  }
};

/* 【修复】移除行间样式中的 !important（无效语法），改用 CSS 类控制全屏白底 */
/* 【修复】pointerEvents 随 visible 动态切换，防止 opacity:0 时仍阻挡底层点击 */
const loaderStyle = computed(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#ffffff",
  zIndex: 99999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: visible.value ? 1 : 0,
  transition: "opacity 0.5s ease-out",
  pointerEvents: visible.value ? "auto" : "none",
  mixBlendMode: "normal",
}));

const setWhiteBackground = () => {
  if (typeof document !== "undefined" && document.body) {
    document.body.classList.add("transition-loader-active");
    document.body.style.overflow = "hidden";
  }
};

const restoreBodyStyle = () => {
  if (typeof document !== "undefined" && document.body) {
    document.body.classList.remove("transition-loader-active");
    document.body.style.overflow = "";
  }
};

/* 【修复】使用拼接好的 url 进行跳转，而不是直接 push redirectUrl.value（会丢失查询参数） */
const doRedirect = () => {
  if (isRedirecting.value) return;
  isRedirecting.value = true;

  try {
    const targetPath = redirectUrl.value || "/";
    const query = {};

    if (scrollY.value && scrollY.value !== "0") {
      query.scrollY = scrollY.value;
    }
    query.skipAnimation = "true";

    console.log("[TransitionLoader] SPA 导航到:", targetPath, query);

    sessionStorage.setItem("themeMusicActive", "true");
    sessionStorage.setItem("currentThemeIndex", "0");
    sessionStorage.setItem(
      "currentThemeMusic",
      JSON.stringify({
        id: "travel-theme",
        title: "星际旅行主题",
        url: "/music/The 1999 - 为了什么.mp3",
      }),
    );

    restoreBodyStyle();
    visible.value = false;

    setTimeout(() => {
      console.log("[TransitionLoader] 执行 SPA 页面跳转");
      router.push({ path: targetPath, query });
    }, 150);
  } catch (err) {
    console.error("[TransitionLoader] 跳转逻辑异常:", err);
    restoreBodyStyle();
    router.push(redirectUrl.value || "/");
  }
};

onMounted(() => {
  console.log("[TransitionLoader] 加载器启动");
  console.log("[TransitionLoader] 参数 - redirect:", redirectUrl.value);
  console.log("[TransitionLoader] 参数 - title:", targetTitle.value);
  console.log("[TransitionLoader] 参数 - scrollY:", scrollY.value);

  setWhiteBackground();

  if (typeof window !== "undefined" && window.__nativeScreen?.hide) {
    window.__nativeScreen.hide();
  }

  const startTime = performance.now();
  let animationCompleted = false;
  let animationFrameId = null;

  const attemptRedirect = () => {
    if (isRedirecting.value) return;
    if (preloadReady.value && animationCompleted) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      setTimeout(doRedirect, 100);
    }
  };

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const timeProgress = Math.min(100, (elapsed / MIN_ANIMATION_MS) * 100);

    if (preloadReady.value && elapsed < MIN_ANIMATION_MS) {
      progress.value = Math.min(timeProgress + (100 - timeProgress) * 0.7, 95);
    } else if (preloadReady.value) {
      progress.value = Math.min(progress.value + 5, 100);
    } else {
      progress.value = Math.min(timeProgress * 0.5, 90);
    }

    if (progress.value >= 100) {
      progress.value = 100;
      animationCompleted = true;
      attemptRedirect();
    } else if (elapsed >= MIN_ANIMATION_MS && preloadReady.value) {
      progress.value = 100;
      animationCompleted = true;
      attemptRedirect();
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  preloadTarget(redirectUrl.value);

  const preloadWatcher = setInterval(() => {
    if (preloadReady.value && !animationCompleted) {
      statusText.value = "准备跳转...";
    }
    if (isRedirecting.value) {
      clearInterval(preloadWatcher);
    }
  }, 200);

  setTimeout(() => {
    if (!isRedirecting.value) {
      console.warn("[TransitionLoader] 超时保护：强制跳转");
      clearInterval(preloadWatcher);
      doRedirect();
    }
  }, 5000);
});
</script>

<style scoped>
.loader-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loader-disc {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #111;
  position: relative;
  animation: spin 2s linear infinite;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition:
    box-shadow 0.4s ease,
    background 0.4s ease;
}

.loader-disc.is-loaded {
  box-shadow: 0 10px 40px rgba(212, 175, 55, 0.35);
}

.disc-grooves {
  position: absolute;
  inset: 8px;
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

.disc-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
}

.disc-hole {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loader-title {
  font-size: 12px;
  letter-spacing: 6px;
  color: #999;
  text-transform: uppercase;
  margin: 0;
}

.loader-target {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 4px;
  color: #111;
  margin: 0;
}

.loader-track {
  width: 200px;
  height: 2px;
  background: #eee;
  border-radius: 1px;
  overflow: hidden;
  margin-top: 4px;
}

.loader-fill {
  width: 100%;
  height: 100%;
  background: #111;
  border-radius: 1px;
  transform-origin: left;
  transition: transform 0.1s ease-out;
}

.loader-percent {
  font-size: 11px;
  letter-spacing: 2px;
  color: #aaa;
  margin: 0;
}

.loader-hint {
  font-size: 11px;
  letter-spacing: 2px;
  color: #ccc;
  margin: 0;
  animation: pulse 1.5s ease infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

/* 【修复】通过全局类强制设置 body 白底，避免行间样式 !important 无效问题 */
:global(body.transition-loader-active) {
  background: #ffffff !important;
  background-color: #ffffff !important;
}
</style>
