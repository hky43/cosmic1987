<
<template>
  <PagePreloader
    title="星际旅行"
    :images="['images/travel/travel-2.png', 'images/travel/travel-3.png']"
  >
    <div ref="scrollContainer" class="travel-page" @wheel="handleWheel">
      <div
        ref="scrollTrack"
        class="scroll-track"
        :class="{ 'is-visible': imagesReady }"
        :style="trackStyle"
      >
        <img
          ref="bgImg"
          :src="currentBg"
          class="track-bg"
          alt="travel background"
          @load="onImageLoad"
          @error="onImageError"
          draggable="false"
        />

        <ArkMapNodes
          :nodes="mapNodes"
          :track-width="fixedTrackWidth"
          @node-click="handleNodeClick"
        />
      </div>

      <BackToHomeButton />
    </div>
  </PagePreloader>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, inject } from "vue";
import { useRouter } from "vue-router";
import PagePreloader from "../../components/PagePreloader.vue";
import ArkMapNodes from "../../components/views/travel/ArkMapNodes.vue";
import BackToHomeButton from "../../components/BackToHomeButton.vue";
import { audioManager } from "../../utils/audioManager";
import { asset } from "../../utils/asset";

defineOptions({ name: "TravelPage" });

const router = useRouter();
const setPageReady = inject("setPageReady", () => {});

const imagesReady = ref(false);

const bgList = [
  asset("images/travel/travel-2.png"),
  asset("images/travel/travel-3.png"),
];
const bgIndex = ref(0);
const currentBg = computed(() => bgList[bgIndex.value] || "");

const imageInfos = ref(new Map());

const fixedTrackWidth = ref(window.innerWidth * 5);

const calculateFixedTrackWidth = () => {
  let maxWidth = 0;
  imageInfos.value.forEach((info) => {
    if (info.naturalHeight > 0) {
      const scale = window.innerHeight / info.naturalHeight;
      const scaledWidth = info.naturalWidth * scale;
      if (scaledWidth > maxWidth) maxWidth = scaledWidth;
    }
  });
  if (maxWidth > 0) fixedTrackWidth.value = maxWidth;
};

// 【新增】计算样式，避免模板字符串语法错误
const trackStyle = computed(() => ({
  transform: `translateX(-${scrollPosition.value}px)`,
  width: `${fixedTrackWidth.value}px`,
}));

let bgTimer = null;
const startBgSwitch = () => {
  bgTimer = setInterval(() => {
    bgIndex.value = (bgIndex.value + 1) % bgList.length;
  }, 800);
};

const scrollTrack = ref(null);
const bgImg = ref(null);
const scrollPosition = ref(0);

let targetScroll = 0;
let currentScroll = 0;
let isAnimating = false;
let animationFrame = null;

const onImageLoad = () => {
  console.log("[Travel] 背景图加载成功");
  if (
    bgImg.value &&
    bgImg.value.naturalWidth > 0 &&
    imageInfos.value.size === 0
  ) {
    const scale = window.innerHeight / bgImg.value.naturalHeight;
    fixedTrackWidth.value = Math.max(
      fixedTrackWidth.value,
      bgImg.value.naturalWidth * scale,
    );
  }
  imagesReady.value = true;
};

const onImageError = () => {
  console.error("[Travel] 背景图加载失败，强制显示");
  imagesReady.value = true;
};

const handleWheel = (e) => {
  e.preventDefault();
  const sensitivity = 1.2;
  const scrollAmount = e.deltaY * sensitivity;
  const maxScroll = Math.max(0, fixedTrackWidth.value - window.innerWidth);
  targetScroll = Math.max(0, Math.min(targetScroll + scrollAmount, maxScroll));
  if (!isAnimating) {
    isAnimating = true;
    animateScroll();
  }
};

const animateScroll = () => {
  const diff = targetScroll - currentScroll;
  if (Math.abs(diff) < 0.5) {
    currentScroll = targetScroll;
    scrollPosition.value = currentScroll;
    isAnimating = false;
    return;
  }
  currentScroll += diff * 0.1;
  scrollPosition.value = currentScroll;
  animationFrame = requestAnimationFrame(animateScroll);
};

const mapNodes = ref([
  {
    id: "node1",
    type: "Chapter 1",
    title: "启程",
    x: 28,
    y: 36,
    color: "#c41e3a",
    pagePath: "/travel/01",
  },
  {
    id: "node2",
    type: "Chapter 2",
    title: "探索",
    x: 45,
    y: 55,
    color: "#ff6b6b",
    pagePath: "/travel/02",
  },
  {
    id: "node3",
    type: "Chapter 3",
    title: "发现",
    x: 65,
    y: 40,
    color: "#4ecdc4",
    pagePath: "/travel/03",
  },
  {
    id: "node4",
    type: "Chapter 4",
    title: "挑战",
    x: 78,
    y: 55,
    color: "#ffe66d",
    pagePath: "/travel/04",
  },
  {
    id: "node5",
    type: "Chapter 5",
    title: "归来",
    x: 96,
    y: 40,
    color: "#a855f7",
    pagePath: "/travel/05",
  },
]);

const handleNodeClick = (node) => {
  console.log("选中节点:", node.id, node.title);
  if (node.pagePath) router.push(node.pagePath);
};

onMounted(async () => {
  try {
    // 声明当前页面属于 'travel' 音频组
    audioManager.ensureGroup("travel");
    console.log("[Travel Page] 主题音乐模式，音乐由 audioManager 管理");

    /* ========== 强制重置 body（防止 HomePage 残留） ========== */
    document.body.style.height = "100%";
    document.body.style.overflow = "auto";
    document.documentElement.style.height = "100%";

    /* ========== 清理 App 路由加载残留（仅清理已知 CSS class，不暴力扫描 body） ========== */
    const killOverlays = () => {
      document
        .querySelectorAll(
          ".global-white-mask, .transition-mask, .page-loader, .white-fade-enter-active, .white-fade-leave-active, .white-fade-enter-from, .white-fade-leave-to",
        )
        .forEach((el) => {
          el.style.display = "none";
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
        });

      document.body.style.background = "";
      document.body.style.overflow = "";
      document.documentElement.style.background = "";
      document.documentElement.style.overflow = "";
    };

    // 仅在挂载时清理一次（HomePage Teleport 元素已由 isPageActive 守卫自动隐藏）
    // 移除 body > div 暴力扫描（getComputedStyle + getBoundingClientRect 导致强制同步重排，引发滚动卡顿）
    killOverlays();
    setTimeout(killOverlays, 100);

    // 图片已由 PagePreloader 预加载到缓存，直接读取尺寸
    const measureImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          imageInfos.value.set(src, {
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          });
          resolve();
        };
        img.onerror = () => resolve();
        img.src = src;
      });
    await Promise.all(bgList.map(measureImage));
    calculateFixedTrackWidth();
    imagesReady.value = true;
    setPageReady();

    nextTick(() => {
      const img = bgImg.value;
      if (img) {
        console.log(
          "[Travel] nextTick 检查 img:",
          "complete=",
          img.complete,
          "naturalWidth=",
          img.naturalWidth,
        );
        if (img.complete) {
          img.naturalWidth > 0 ? onImageLoad() : onImageError();
        }
      }
    });

    setTimeout(() => {
      if (!imagesReady.value) {
        console.warn("[Travel] 1秒兜底：强制显示");
        imagesReady.value = true;
      }
    }, 1000);

    startBgSwitch();
    window.addEventListener("resize", calculateFixedTrackWidth);
  } catch (error) {
    console.error("Travel page initialization failed:", error);
    imagesReady.value = true;
  }
});

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (bgTimer) clearInterval(bgTimer);
  window.removeEventListener("resize", calculateFixedTrackWidth);

  // 【新增】组件卸载时清理残留遮罩
  console.log("[Travel] 组件卸载，清理遮罩");
  const knownSelectors = [
    ".global-white-mask",
    ".transition-mask",
    ".page-loader",
    ".white-fade-enter-active",
    ".white-fade-leave-active",
    ".white-fade-enter-from",
    ".white-fade-leave-to",
    ".loading-screen",
  ];
  knownSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.remove());
  });
});
</script>

<style scoped>
.travel-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #0a0a0a;
  z-index: 1;
}

.scroll-track {
  position: relative;
  height: 100vh;
  will-change: transform;
  opacity: 0;
  transition: opacity 0.6s ease;
}
.scroll-track.is-visible {
  opacity: 1;
}

.track-bg {
  display: block;
  height: 100vh;
  width: auto;
  pointer-events: none;
  user-select: none;
  backface-visibility: hidden;
}
</style>
