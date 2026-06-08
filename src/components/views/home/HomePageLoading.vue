<template>
  <div
    v-if="visible"
    class="loading-screen"
    :class="{ 'is-fading-out': isFadingOut }"
  >
    <!-- 顶部百分比 -->
    <div class="loading-percent">{{ percentDisplay }}</div>

    <!-- 剪影进度条区域 -->
    <div class="silhouette-box">
      <img
        :src="asset('images/decorations/剪影1.png')"
        class="silhouette-base"
        alt=""
      />

      <img
        :src="asset('images/decorations/剪影1.png')"
        class="silhouette-gray"
        alt=""
      />

      <img
        :src="asset('images/decorations/剪影1.png')"
        class="silhouette-fill"
        :style="silhouetteStyle"
        alt=""
      />
    </div>

    <!-- 金唱片：定位在剪影中心 -->
    <div class="record-wrapper" :class="{ 'is-dropping': isDropping }">
      <img
        :src="asset('images/decorations/金唱片.png')"
        class="golden-record"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { asset } from "@/utils/asset";

const emit = defineEmits(["complete", "prepareComplete"]);

const isNavigatedBack = sessionStorage.getItem("navigatedToHome") === "true";
const visible = ref(!isNavigatedBack);
const progress = ref(0);
const isDropping = ref(false);
const isFadingOut = ref(false);

const percentDisplay = computed(() => {
  return String(Math.floor(progress.value)).padStart(2, "0") + "%";
});

/* ---------- 动态 mask-image ---------- */
const silhouetteStyle = computed(() => {
  const p = progress.value;
  if (p >= 100) {
    return {
      maskImage:
        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)",
      webkitMaskImage:
        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)",
    };
  }
  const solid = Math.max(0, p - 8);
  const gradient = `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${solid}%, rgba(0,0,0,0) ${p}%)`;
  return {
    maskImage: gradient,
    webkitMaskImage: gradient,
  };
});

const startLoading = () => {
  if (isNavigatedBack) {
    console.log("[HomePageLoading] 从其他页面导航回来，跳过加载动画");
    sessionStorage.removeItem("navigatedToHome");
    visible.value = false;
    nextTick(() => {
      emit("complete");
    });
    return;
  }

  const duration = 5000;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const p = Math.min(100, (elapsed / duration) * 100);
    progress.value = p;

    if (p < 100) {
      requestAnimationFrame(tick);
    } else {
      /* ---- 进度达 100%，进入过渡阶段 ---- */
      // 步骤 1：延迟 250ms 后，金唱片下落 + 加载画面开始淡出（同时进行）
      setTimeout(() => {
        isDropping.value = true;
        isFadingOut.value = true;
        // 提前通知 HomePage 开始在背后渲染主页（此时加载画面正在淡出）
        emit("prepareComplete");

        // 步骤 2：淡出完成后（0.8s），完全移除加载画面
        setTimeout(() => {
          visible.value = false;
          localStorage.setItem("hasVisitedHome", "true");
          nextTick(() => {
            emit("complete");
          });
        }, 800);
      }, 250);
    }
  };

  requestAnimationFrame(tick);
};

onMounted(() => {
  startLoading();
});
</script>

<style scoped>
/* style 部分完全未改动，省略展示与原文一致 */
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  will-change: transform;
}

.loading-screen.is-fading-out {
  opacity: 0;
  transition: opacity 0.8s ease;
}

.loading-percent {
  position: absolute;
  top: 7vh;
  left: 50%;
  transform: translateX(-50%);
  font-size: 52px;
  font-weight: 300;
  color: #000000;
  font-family: "Courier New", Courier, monospace;
  letter-spacing: 8px;
  z-index: 20;
}

.silhouette-box {
  position: relative;
  height: 75vh;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.silhouette-base {
  height: 90vh;
  width: auto;
  display: block;
  visibility: hidden;
  pointer-events: none;
}

.silhouette-gray,
.silhouette-fill {
  position: absolute;
  top: 65%;
  left: 53%;
  transform: translate(-50%, -50%);
  height: 90vh;
  width: auto;
  display: block;
  pointer-events: none;
}

.silhouette-gray {
  filter: grayscale(100%) brightness(0.8) opacity(0.05);
  z-index: 1;
}

.silhouette-fill {
  z-index: 2;
  will-change:
    mask-image,
    -webkit-mask-image;
}

.record-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  transform: translate(-50%, -50%);
  transition: transform 0.9s cubic-bezier(0.6, 0, 1, 1);
  will-change: transform;
  pointer-events: none;
}

.record-wrapper.is-dropping {
  transform: translate(-50%, 140vh);
}

.golden-record {
  width: 230px;
  height: 230px;
  object-fit: contain;
  animation: recordSpin 2.5s linear infinite;
  will-change: transform;
  filter: drop-shadow(0 12px 32px rgba(0, 0, 0, 0.25));
}

@keyframes recordSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .loading-percent {
    font-size: 38px;
    letter-spacing: 5px;
    top: 5vh;
  }
  .golden-record {
    width: 150px;
    height: 100px;
  }
  .silhouette-box,
  .silhouette-base,
  .silhouette-gray,
  .silhouette-fill {
    height: 65vh;
  }
}
</style>
