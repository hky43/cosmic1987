<template>
  <div class="model-container" ref="containerRef">
    <!-- 预加载层 -->
    <div v-if="isPreloading" class="preload-overlay">
      <div class="preload-box">
        <p class="preload-title">正在加载资源</p>
        <div class="preload-track">
          <div
            class="preload-fill"
            :style="{ width: preloadProgress + '%' }"
          ></div>
        </div>
        <p class="preload-num">{{ preloadProgress }}%</p>
      </div>
    </div>

    <template v-if="!showWhiteOverlay">
      <!-- 文字标注 -->
      <div class="annotation" :style="annotationStyle()">
        <h2>いよわ"胃弱P"</h2>
        <p>春卷饭的PV制作室STUDIO Gohan 成员之一</p>
        <p class="subtitle">
          以"胃弱"为名的自嘲式命名<br />活泼中带点诡谲的曲风<br />对我来说<br />自从听了胃弱和r906，其他的都寡淡无味
        </p>
      </div>

      <!-- 白屏过渡层 -->
      <div class="white-screen" :style="whiteScreenStyle()"></div>

      <!-- 初始图片容器（阶段2） -->
      <div class="image-container" :style="imageContainerStyle()">
        <!-- 【优化①】缓存 asset 结果，避免每次渲染重复调用 -->
        <img class="center-image" :src="stage2ImageSrc" alt="Stage 2 Image" />
      </div>

      <!-- 图片浏览容器（阶段3） -->
      <div class="gallery-container phase3" :style="galleryContainerStyle()">
        <div class="gallery-content" :style="galleryContentStyle()">
          <img
            class="gallery-image"
            :src="currentImageSrc"
            :alt="`Image ${currentImageIndex + 1}`"
            :class="{
              'fade-out': isImageFadingOut,
              'fade-in': isImageFadingIn,
              visible: isImageVisible,
            }"
          />
        </div>
        <div
          class="song-title"
          :class="{
            'fade-out': isImageFadingOut,
            'fade-in': isImageFadingIn,
            visible: isImageVisible,
          }"
          :style="songTitleStyle()"
        >
          <p
            class="japanese"
            :class="{ scroll: currentSongName.japanese.length > 20 }"
          >
            {{ currentSongName.japanese }}
          </p>
          <p
            class="chinese"
            :class="{ scroll: currentSongName.chinese.length > 20 }"
          >
            {{ currentSongName.chinese }}
          </p>
        </div>
      </div>

      <!-- 图片浏览容器（阶段4） -->
      <div class="gallery-container phase4" :style="phase4ContainerStyle()">
        <!-- 【优化①】缓存 asset 结果 -->
        <img class="center-image" :src="stage4ImageSrc" alt="Stage 2 Image" />
        <div class="song-list">
          <a
            href="https://www.bilibili.com/video/BV1yo4y1L7SG/"
            target="_blank"
            class="song-item"
            >1. バベル(巴别塔)</a
          >
          <a
            href="https://www.bilibili.com/video/BV1S4411L7Rk/"
            target="_blank"
            class="song-item"
            >2. わたしは禁忌(我是禁忌)</a
          >
          <a
            href="https://www.bilibili.com/video/BV1iE411Y7bf/"
            target="_blank"
            class="song-item"
            >3. IMAWANOKIWA(弥留之际)</a
          >
          <a
            href="https://www.bilibili.com/video/BV1MQ4y1a7JY/"
            target="_blank"
            class="song-item"
            >4. きゅうくらりん(心跳不止)</a
          >
          <a
            href="https://www.bilibili.com/video/BV1Ny4y1b7rs/"
            target="_blank"
            class="song-item"
            >5. たぶん終わり(大概结束了)</a
          >
          <a
            href="https://www.bilibili.com/video/BV1ft411d7dS/"
            target="_blank"
            class="song-item"
            >6. マーシーキリング(安乐死)</a
          >
          <a
            href="https://www.bilibili.com/video/BV1t24y1x7Me/"
            target="_blank"
            class="song-item"
            >7. 水死体にもどらないで(不要变回溺水死亡的尸体)</a
          >
          <a
            href="https://www.bilibili.com/video/BV1qt411E7gX/"
            target="_blank"
            class="song-item"
            >8. うわがき(覆盖)</a
          >
          <a
            href="https://www.bilibili.com/video/BV1yb411c7eE/"
            target="_blank"
            class="song-item"
            >9. 知らない香り(不知名的香气)</a
          >
          <a
            href="https://www.bilibili.com/video/BV18t411o7qV/"
            target="_blank"
            class="song-item"
            >10. ラストジャーニー(最终的旅行)</a
          >
          <a
            href="https://www.bilibili.com/video/BV1sb411i7aK/"
            target="_blank"
            class="song-item"
            >11. 1000年生きてる(存活千年)</a
          >
          <a
            href="https://www.bilibili.com/video/BV1Ut411o7dW/"
            target="_blank"
            class="song-item"
            >12. 一千光年</a
          >
        </div>
      </div>

      <!-- 阶段3-1 歌词面板 -->
      <div class="lyrics-panel" :style="lyricsPanelStyle()">
        <div class="lyrics-header">
          <button class="reset-btn" @click="resetAudio">重置</button>
          <p class="lyrics-title">{{ currentSongName.japanese }}</p>
          <p class="lyrics-artist">{{ currentSongName.chinese }}</p>
        </div>
        <div class="lyrics-content" ref="lyricsContentRef">
          <div
            v-for="(line, index) in parsedLyrics"
            :key="index"
            class="lyrics-line"
            :class="{
              active: index === currentLyricIndex,
              passed: index < currentLyricIndex,
            }"
            @click="seekToLyric(line.time)"
          >
            <span class="lyric-japanese">{{ line.japanese }}</span>
            <span v-if="line.chinese" class="lyric-chinese">{{
              line.chinese
            }}</span>
          </div>
        </div>
        <div class="exit-hint">
          <span>按 ESC 退出歌词模式</span>
        </div>
      </div>
    </template>

    <WhiteOverlay v-model="showWhiteOverlay" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import WhiteOverlay from "../../components/views/home/WhiteOverlay.vue";
import { asset } from "@/utils/asset";

const containerRef = ref(null);
const lyricsContentRef = ref(null);
const showWhiteOverlay = ref(false);

const isPreloading = ref(true);
const preloadProgress = ref(0);

// ==================== 新增：预加载进度计数器 ====================
const totalAssets = ref(0);
const loadedAssets = ref(0);

// 辅助：更新进度（0~100）
const updateProgress = () => {
  loadedAssets.value++;
  const total = totalAssets.value || 1;
  preloadProgress.value = Math.min(
    100,
    Math.round((loadedAssets.value / total) * 100),
  );
};

// 阶段状态
const currentPhase = ref(0);

// UI动画状态
const annotationOpacity = ref(0);
const annotationX = ref(100);
const whiteScreenOpacity = ref(0);
const imageContainerOpacity = ref(0);
const galleryContainerOpacity = ref(0);
const phase4ContainerOpacity = ref(0);

// 图片浏览相关状态
const currentImageIndex = ref(0);
const isTransitioning = ref(false);
const mouseStartX = ref(0);
const mouseDeltaX = ref(0);
const imageOffsetX = ref(0);
const songTitleOpacity = ref(1);
const lyricsPanelOpacity = ref(0);

// 图片切换动画状态
const isImageFadingOut = ref(false);
const isImageFadingIn = ref(false);
const isImageVisible = ref(false);

// 动画配置
const animationConfig = {
  fadeOutDuration: 1000,
  fadeInDuration: 1000,
  defaultSwitchDelay: 1500,
  enterPhase3Delay: 1500,
};

const imageDelays = [
  1500, 1500, 1500, 1500, 3500, 2500, 700, 1500, 1500, 2000, 5000, 2500,
];

// 缓存模板中硬编码图片的 asset 结果
const stage2ImageSrc = asset("CD贴图/test2-1.png");
const stage4ImageSrc = asset("CD贴图/test2-2.jpg");

// 路径配置
const imagePaths = [
  asset("CD贴图/胃弱/01.jpg"),
  asset("CD贴图/胃弱/02.png"),
  asset("CD贴图/胃弱/03.png"),
  asset("CD贴图/胃弱/04.jpg"),
  asset("CD贴图/胃弱/05.jpg"),
  asset("CD贴图/胃弱/06.png"),
  asset("CD贴图/胃弱/07.png"),
  asset("CD贴图/胃弱/08.jpg"),
  asset("CD贴图/胃弱/09.png"),
  asset("CD贴图/胃弱/10.png"),
  asset("CD贴图/胃弱/11.jpg"),
  asset("CD贴图/胃弱/12.jpg"),
];

const audioPaths = [
  asset("CD贴图/胃弱/01.mp3"),
  asset("CD贴图/胃弱/02.mp3"),
  asset("CD贴图/胃弱/03.mp3"),
  asset("CD贴图/胃弱/04.mp3"),
  asset("CD贴图/胃弱/05.mp3"),
  asset("CD贴图/胃弱/06.mp3"),
  asset("CD贴图/胃弱/07.mp3"),
  asset("CD贴图/胃弱/08.mp3"),
  asset("CD贴图/胃弱/09.mp3"),
  asset("CD贴图/胃弱/10.mp3"),
  asset("CD贴图/胃弱/11.mp3"),
  asset("CD贴图/胃弱/12.mp3"),
];

const audioStartPositions = [58, 54, 47, 46, 47, 47, 65, 10, 61, 70, 47, 123];

const lrcPaths = [
  asset("CD贴图/歌词/01.lrc"),
  asset("CD贴图/歌词/02.lrc"),
  asset("CD贴图/歌词/03.lrc"),
  asset("CD贴图/歌词/04.lrc"),
  asset("CD贴图/歌词/05.lrc"),
  asset("CD贴图/歌词/06.lrc"),
  asset("CD贴图/歌词/07.lrc"),
  asset("CD贴图/歌词/08.lrc"),
  asset("CD贴图/歌词/09.lrc"),
  asset("CD贴图/歌词/10.lrc"),
  asset("CD贴图/歌词/11.lrc"),
  asset("CD贴图/歌词/12.lrc"),
];

const songNames = [
  {
    japanese: "バベル(巴别塔)",
    chinese: "重音テト",
    url: "https://www.bilibili.com/video/BV1yo4y1L7SG/?spm_id_from=333.337.search-card.all.click",
  },
  {
    japanese: "わたしは禁忌(我是禁忌)",
    chinese: "初音ミク、v flower",
    url: "https://www.bilibili.com/video/BV1S4411L7Rk/?spm_id_from=333.337.search-card.all.click",
  },
  {
    japanese: "IMAWANOKIWA(弥留之际)",
    chinese: "初音ミク",
    url: "https://www.bilibili.com/video/BV1iE411Y7bf/?spm_id_from=333.337.search-card.all.click",
  },
  {
    japanese: "きゅうくらりん(心跳不止)",
    chinese: "可不",
    url: "https://www.bilibili.com/video/BV1MQ4y1a7JY/?spm_id_from=333.337.search-card.all.click",
  },
  {
    japanese: "たぶん終わり(大概结束了)",
    chinese: "初音ミク、v flower",
    url: "https://www.bilibili.com/video/BV1Ny4y1b7rs/?spm_id_from=333.337.search-card.all.click",
  },
  {
    japanese: "マーシーキリング(安乐死)",
    chinese: "初音ミク、v flower",
    url: "https://www.bilibili.com/video/BV1ft411d7dS/?spm_id_from=333.337.search-card.all.click",
  },
  {
    japanese: "水死体にもどらないで(不要变回溺水死亡的尸体)",
    chinese: "初音ミク、v flower",
    url: "https://www.bilibili.com/video/BV1Lt411i7G8/?spm_id_from=333.337.search-card.all.click",
  },
  {
    japanese: "うわがき(覆盖)",
    chinese: "初音ミク、花隈千冬",
    url: "https://www.bilibili.com/video/BV1BhWzebEXa/?spm_id_from=333.337.search-card.all.click",
  },
  {
    japanese: "知らない香り(不知名的香气)",
    chinese: "初音ミク",
    url: "https://www.bilibili.com/video/BV1k3G5zsE5G/?spm_id_from=333.337.search-card.all.click",
  },
  {
    japanese: "ラストジャーニー(最终的旅行)",
    chinese: "初音ミク、v flower",
    url: "https://www.bilibili.com/video/BV1Lb411K7An/?spm_id_from=333.337.search-card.all.click&vd_source=5b1565b07775afef80cb4a6e629b8817",
  },
  {
    japanese: "1000年生きてる(存活千年)",
    chinese: "初音ミク",
    url: "https://www.bilibili.com/video/BV1Ua4y1W7rV/?spm_id_from=333.337.search-card.all.click&vd_source=5b1565b07775afef80cb4a6e629b8817",
  },
  {
    japanese: "一千光年",
    chinese:
      "初音ミク、v_flower、歌愛ユキ、GUMI、可不、星界、足立レイ、裏命、花隈千冬、VY1、SOLARIA",
    url: "https://www.bilibili.com/video/BV1t24y1x7Me/?spm_id_from=333.337.search-card.all.click&vd_source=5b1565b07775afef80cb4a6e629b8817",
  },
];

// 音频相关状态
let currentAudio = null;
const isAudioPlaying = ref(false);
const hasPlayedAudio = ref(false);
const firstPlayFlags = ref(Array(audioPaths.length).fill(true));

// 歌词相关状态
const parsedLyrics = ref([]);
const currentLyricIndex = ref(-1);
const currentTime = ref(0);
const duration = ref(0);
let lyricsUpdateId = null;
let currentLrcPath = "";
const lyricsCache = ref({});
let lastScrollLyricIndex = -1;

// 计算属性
const currentImageSrc = computed(
  () => imagePaths[currentImageIndex.value] || imagePaths[0],
);
const currentSongName = computed(
  () => songNames[currentImageIndex.value] || songNames[0],
);

// 样式计算
const annotationStyle = () => ({
  opacity: annotationOpacity.value,
  transform: `translateX(${annotationX.value}px)`,
});

const whiteScreenStyle = () => ({ opacity: whiteScreenOpacity.value });
const imageContainerStyle = () => ({ opacity: imageContainerOpacity.value });
const galleryContainerStyle = () => ({
  opacity: galleryContainerOpacity.value,
});
const galleryContentStyle = () => ({
  transform: `translateX(${imageOffsetX.value}px)`,
});

const songTitleStyle = () => {
  if (isImageFadingOut.value || isImageFadingIn.value) return {};
  if (!isImageVisible.value) return { opacity: 0 };
  return { opacity: songTitleOpacity.value, transition: "opacity 0.8s ease" };
};

const phase4ContainerStyle = () => ({
  opacity: phase4ContainerOpacity.value,
  pointerEvents: phase4ContainerOpacity.value > 0 ? "auto" : "none",
});

const lyricsPanelStyle = () => ({ opacity: lyricsPanelOpacity.value });

// ==================== 预加载：图片（真正等待 load） ====================
const preloadAllImages = async () => {
  const allImages = [...imagePaths, stage2ImageSrc, stage4ImageSrc];
  const promises = allImages.map((src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        updateProgress();
        resolve();
      };
      img.onerror = () => {
        updateProgress();
        console.warn(`图片预加载失败: ${src}`);
        resolve();
      };
      img.src = src;
    });
  });
  return Promise.all(promises);
};

// ==================== 预加载：音频（真正等待 canplaythrough） ====================
const preloadAllAudio = async () => {
  const promises = audioPaths.map((src) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = "auto";
      // 超时保护：10秒还没加载完也算完成，避免卡死
      const timeout = setTimeout(() => {
        updateProgress();
        resolve();
      }, 10000);
      audio.addEventListener(
        "canplaythrough",
        () => {
          clearTimeout(timeout);
          updateProgress();
          resolve();
        },
        { once: true },
      );
      audio.addEventListener(
        "error",
        () => {
          clearTimeout(timeout);
          updateProgress();
          console.warn(`音频预加载失败: ${src}`);
          resolve();
        },
        { once: true },
      );
      audio.src = src;
      audio.load();
    });
  });
  return Promise.all(promises);
};

// ==================== 预加载：歌词（真正等待 fetch 完成） ====================
const preloadAllLyrics = async () => {
  const promises = lrcPaths.map((path) => {
    return new Promise((resolve) => {
      if (lyricsCache.value[path]) {
        updateProgress();
        resolve();
        return;
      }
      fetch(path)
        .then((response) => {
          if (!response.ok) {
            updateProgress();
            console.warn(`预加载歌词失败: ${path}`);
            resolve();
            return;
          }
          return response.text();
        })
        .then((text) => {
          if (text) lyricsCache.value[path] = parseLRC(text);
          updateProgress();
          resolve();
        })
        .catch((error) => {
          updateProgress();
          console.error(`预加载歌词失败: ${path}`, error);
          resolve();
        });
    });
  });
  return Promise.all(promises);
};

// ==================== 预加载：3D 模型（GLTF 真正加载完成） ====================
let modelLoaded = false;
const preloadModel = () => {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      asset("models/CD.glb"),
      (gltf) => {
        model = gltf.scene;
        const DEFAULT_ROT_X = -0.6;
        const DEFAULT_ROT_Y = 0.4;
        const DEFAULT_ROT_Z = 0.3;
        model.position.set(0, 0, 0);
        model.rotation.set(DEFAULT_ROT_X, DEFAULT_ROT_Y, DEFAULT_ROT_Z);
        originalModelRotation.set(DEFAULT_ROT_X, DEFAULT_ROT_Y, DEFAULT_ROT_Z);
        targetModelRotation.set(DEFAULT_ROT_X, DEFAULT_ROT_Y, DEFAULT_ROT_Z);
        scene.add(model);
        model.traverse((child) => {
          if (child.isMesh) {
            const originalMat = child.material;
            const materialConfig = {
              color: originalMat.color || 0xffffff,
              metalness: 0.0,
              roughness: 0.3,
              side: THREE.DoubleSide,
            };
            if (originalMat.map) materialConfig.map = originalMat.map;
            child.material = new THREE.MeshStandardMaterial(materialConfig);
          }
        });
        modelLoaded = true;
        updateProgress();
        resolve();
      },
      undefined, // onProgress
      (error) => {
        console.error("模型加载失败:", error);
        updateProgress(); // 即使失败也继续，避免卡死
        resolve();
      },
    );
  });
};

// 音频控制函数
const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    isAudioPlaying.value = false;
  }
  if (window.audioManager) {
    window.audioManager.pause();
  }
};

const stopRendering = () => {
  if (renderer) {
    renderer.dispose();
  }
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
};

const fadeOutAudio = (callback) => {
  if (!currentAudio) {
    if (callback) callback();
    return;
  }
  const fadeStep = 0.1;
  const fadeInterval = 50;

  const fade = () => {
    if (currentAudio.volume > fadeStep) {
      currentAudio.volume = Math.max(0, currentAudio.volume - fadeStep);
      setTimeout(fade, fadeInterval);
    } else {
      currentAudio.volume = 0;
      if (callback) callback();
    }
  };
  fade();
};

const fadeInAudio = () => {
  if (!currentAudio) return;
  const targetVolume = 0.5;
  const fadeStep = 0.05;
  const fadeInterval = 15;
  const fade = () => {
    if (currentAudio.volume < targetVolume) {
      currentAudio.volume = Math.min(
        targetVolume,
        currentAudio.volume + fadeStep,
      );
      setTimeout(fade, fadeInterval);
    }
  };
  fade();
};

const playAudio = (index) => {
  if (index < 0 || index >= audioPaths.length) return;
  const targetFileName = audioPaths[index].split("/").pop();
  if (currentAudio && currentAudio.src.includes(targetFileName)) return;

  const startPosition = audioStartPositions[index] || 0;
  const isFirstPlay = firstPlayFlags.value[index];

  currentAudio = new Audio(audioPaths[index]);
  currentAudio.loop = true;
  currentAudio.volume = 0;

  currentAudio.addEventListener("timeupdate", () => {
    if (
      currentAudio.duration > 0 &&
      currentAudio.currentTime > currentAudio.duration - 1
    ) {
      firstPlayFlags.value[index] = true;
    }
  });

  currentAudio.addEventListener("loadeddata", () => {
    if (isFirstPlay && startPosition > 0) {
      currentAudio.currentTime = startPosition;
    } else {
      currentAudio.currentTime = 0;
    }

    currentAudio
      .play()
      .then(() => {
        isAudioPlaying.value = true;
        firstPlayFlags.value[index] = false;
        fadeInAudio();
      })
      .catch((error) => {
        console.error("音频播放失败:", error);
        currentAudio = null;
      });
  });

  currentAudio.addEventListener("error", (e) => {
    console.error(`音频加载失败: ${audioPaths[index]}`, e);
    currentAudio = null;
  });

  currentAudio.load();
};

const switchToAudio = (index) => {
  if (!currentAudio) {
    firstPlayFlags.value[index] = true;
    playAudio(index);
    return;
  }
  fadeOutAudio(() => {
    currentAudio.pause();
    currentAudio = null;
    isAudioPlaying.value = false;
    firstPlayFlags.value[index] = true;
    playAudio(index);
  });
};

const resetAudio = () => {
  if (!currentAudio) return;
  fadeOutAudio(() => {
    currentAudio.currentTime = 0;
    currentLyricIndex.value = -1;
    currentTime.value = 0;
    if (lyricsContentRef.value) {
      lyricsContentRef.value.scrollTo({ top: 0, behavior: "smooth" });
    }
    currentAudio
      .play()
      .then(() => {
        isAudioPlaying.value = true;
        fadeInAudio();
        syncLyrics();
      })
      .catch((error) => {
        console.error("重置播放失败:", error);
      });
  });
};

// 歌词解析器
const parseLRC = (text) => {
  const lines = text.split("\n");
  const lyrics = [];
  let offset = 0;
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    const offsetMatch = trimmedLine.match(/\[offset:(\-?\d+)\]/i);
    if (offsetMatch) {
      offset = parseInt(offsetMatch[1]) / 1000;
      continue;
    }
    const match = trimmedLine.match(/\[(\d+):(\d+)(?:\.(\d{1,3}))?\](.+)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const milliseconds = match[3] ? parseInt(match[3]) : 0;
      const fullText = match[4].trim();
      const separatorIndex = fullText.indexOf("|");
      let japanese = fullText;
      let chinese = "";
      if (separatorIndex !== -1) {
        japanese = fullText.substring(0, separatorIndex).trim();
        chinese = fullText.substring(separatorIndex + 1).trim();
      }
      if (japanese) {
        lyrics.push({
          time: minutes * 60 + seconds + milliseconds / 1000 + offset,
          japanese,
          chinese,
        });
      }
    }
  }
  lyrics.sort((a, b) => a.time - b.time);
  const uniqueLyrics = [];
  for (let i = 0; i < lyrics.length; i++) {
    const current = lyrics[i];
    const prev = uniqueLyrics[uniqueLyrics.length - 1];
    if (
      !prev ||
      !(Math.abs(prev.time - current.time) < 0.01 && prev.text === current.text)
    ) {
      uniqueLyrics.push(current);
    }
  }
  return uniqueLyrics;
};

const loadLRC = async (index) => {
  if (index < 0 || index >= lrcPaths.length) {
    parsedLyrics.value = [];
    return;
  }
  const path = lrcPaths[index];
  if (currentLrcPath === path && parsedLyrics.value.length > 0) return;
  if (lyricsCache.value[path]) {
    parsedLyrics.value = lyricsCache.value[path];
    currentLrcPath = path;
    currentLyricIndex.value = -1;
    return;
  }
  try {
    const response = await fetch(path);
    if (!response.ok) {
      parsedLyrics.value = [];
      return;
    }
    const text = await response.text();
    const lyrics = parseLRC(text);
    lyricsCache.value[path] = lyrics;
    parsedLyrics.value = lyrics;
    currentLrcPath = path;
    currentLyricIndex.value = -1;
  } catch (error) {
    parsedLyrics.value = [];
  }
};

const preloadLyrics = async (index) => {
  if (index < 0 || index >= lrcPaths.length) return;
  const path = lrcPaths[index];
  if (lyricsCache.value[path]) return;
  try {
    const response = await fetch(path);
    if (!response.ok) return;
    const text = await response.text();
    lyricsCache.value[path] = parseLRC(text);
  } catch (error) {
    console.error(`预加载歌词失败: ${path}`, error);
  }
};

let lastLyricUpdate = 0;
const LYRIC_UPDATE_INTERVAL = 100;

const updateLyrics = () => {
  if (!currentAudio || parsedLyrics.value.length === 0) return;
  const now = performance.now();
  if (now - lastLyricUpdate < LYRIC_UPDATE_INTERVAL) return;
  lastLyricUpdate = now;
  try {
    currentTime.value = currentAudio.currentTime;
    duration.value = currentAudio.duration || 0;
    const lyrics = parsedLyrics.value;
    let newIndex = -1;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime.value >= lyrics[i].time - 0.1) {
        newIndex = i;
        break;
      }
    }
    if (newIndex !== currentLyricIndex.value) {
      currentLyricIndex.value = newIndex;
      requestAnimationFrame(scrollToCurrentLyric);
    }
  } catch (error) {
    console.warn("更新歌词出错:", error);
  }
};

const syncLyrics = () => {
  if (!currentAudio || parsedLyrics.value.length === 0) return;
  currentTime.value = currentAudio.currentTime;
  duration.value = currentAudio.duration || 0;
  const lyrics = parsedLyrics.value;
  let newIndex = -1;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime.value >= lyrics[i].time - 0.1) {
      newIndex = i;
      break;
    }
  }
  currentLyricIndex.value = newIndex;
  setTimeout(() => {
    if (currentPhase.value === 31) {
      scrollToCurrentLyric();
    }
  }, 50);
};

const scrollToCurrentLyric = () => {
  if (!lyricsContentRef.value || currentLyricIndex.value < 0) return;
  if (currentLyricIndex.value === lastScrollLyricIndex) return;
  lastScrollLyricIndex = currentLyricIndex.value;

  const container = lyricsContentRef.value;
  const activeLine = container.children[currentLyricIndex.value];
  if (!activeLine) return;

  const containerHeight = container.clientHeight;
  const lineHeight = activeLine.clientHeight;
  const lineTop = activeLine.offsetTop;
  const scrollTarget = lineTop - containerHeight / 2 + lineHeight / 2;

  requestAnimationFrame(() => {
    container.scrollTo({ top: scrollTarget, behavior: "smooth" });
  });
};

const startLyricsUpdate = () => {
  stopLyricsUpdate();
  const updateLoop = () => {
    if (currentPhase.value !== 31 || !currentAudio || currentAudio.paused) {
      lyricsUpdateId = null;
      return;
    }
    updateLyrics();
    lyricsUpdateId = requestAnimationFrame(updateLoop);
  };
  updateLoop();
};

const stopLyricsUpdate = () => {
  if (lyricsUpdateId) {
    cancelAnimationFrame(lyricsUpdateId);
    lyricsUpdateId = null;
  }
};

// 图片切换
let fadeTimeout = null;

const switchImage = (direction) => {
  if (isTransitioning.value) return;
  if (currentPhase.value === 31) return;
  if (fadeTimeout) {
    clearTimeout(fadeTimeout);
    fadeTimeout = null;
  }

  isTransitioning.value = true;
  isImageFadingOut.value = true;
  isImageVisible.value = false;

  fadeTimeout = setTimeout(() => {
    isImageFadingOut.value = false;
    if (direction === "next") {
      currentImageIndex.value =
        (currentImageIndex.value + 1) % imagePaths.length;
    } else {
      currentImageIndex.value =
        (currentImageIndex.value - 1 + imagePaths.length) % imagePaths.length;
    }

    requestAnimationFrame(() => {
      switchToAudio(currentImageIndex.value);
      preloadLyrics(currentImageIndex.value);
    });

    const currentDelay =
      imageDelays[currentImageIndex.value] ||
      animationConfig.defaultSwitchDelay;

    fadeTimeout = setTimeout(() => {
      isImageFadingIn.value = true;
      fadeTimeout = setTimeout(() => {
        isImageFadingIn.value = false;
        isImageVisible.value = true;
        isTransitioning.value = false;
        fadeTimeout = null;
      }, animationConfig.fadeInDuration);
    }, currentDelay);
  }, animationConfig.fadeOutDuration);
};

const nextImage = () => switchImage("next");
const prevImage = () => switchImage("prev");

// Three.js 渲染
let scene, camera, renderer, model;
let animationId = null;
let targetModelRotation = new THREE.Euler(0, 0, 0);
let originalModelRotation = new THREE.Euler(0, 0, 0);
let isSpinning = false;
let spinProgress = 0;

const init = () => {
  const container = containerRef.value;
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 2.5);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(3, 2, 3);
  scene.add(directionalLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-2, 1, -2);
  scene.add(fillLight);

  // 键盘事件
  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      if (currentPhase.value === 0) {
        currentPhase.value = 1;
        targetModelRotation.set(0, 0, 0);
      } else if (currentPhase.value === 1) {
        currentPhase.value = 2;
        isSpinning = true;
        spinProgress = 0;
      } else if (currentPhase.value === 2) {
        currentPhase.value = 3;
        switchToAudio(currentImageIndex.value);
        preloadLyrics(currentImageIndex.value);
        isImageFadingIn.value = false;
        isImageVisible.value = false;
        setTimeout(() => {
          isImageFadingIn.value = true;
          setTimeout(() => {
            isImageFadingIn.value = false;
            isImageVisible.value = true;
          }, animationConfig.fadeInDuration);
        }, animationConfig.enterPhase3Delay);
      } else if (currentPhase.value === 3) {
        currentPhase.value = 4;
      }
    } else if (event.key === "Escape") {
      if (currentPhase.value === 4) {
        stopAudio();
        hasPlayedAudio.value = false;
        firstPlayFlags.value = Array(audioPaths.length).fill(true);
        currentPhase.value = 2;
        currentImageIndex.value = 0;
      } else if (currentPhase.value === 31) {
        lyricsPanelOpacity.value = 0;
        lastScrollLyricIndex = -1;
        setTimeout(() => {
          currentPhase.value = 3;
          imageOffsetX.value = 0;
          songTitleOpacity.value = 1;
          stopLyricsUpdate();
        }, 300);
      } else if (currentPhase.value === 3) {
        stopAudio();
        hasPlayedAudio.value = false;
        firstPlayFlags.value = Array(audioPaths.length).fill(true);
        currentPhase.value = 2;
        currentImageIndex.value = 0;
      } else if (currentPhase.value === 2) {
        currentPhase.value = 0;
        targetModelRotation.copy(originalModelRotation);
      } else if (currentPhase.value === 1) {
        currentPhase.value = 0;
        targetModelRotation.copy(originalModelRotation);
      } else if (currentPhase.value === 0) {
        stopAudio();
        const fromOverlay =
          sessionStorage.getItem("fromWhiteOverlay") === "true";
        if (fromOverlay) {
          sessionStorage.removeItem("fromWhiteOverlay");
          showWhiteOverlay.value = true;
        } else {
          showWhiteOverlay.value = true;
        }
        stopRendering();
      }
    }
  };
  window.addEventListener("keydown", onKeyDown);

  // 鼠标事件
  const isMouseDown = ref(false);
  let lastClickTime = 0;
  const DOUBLE_CLICK_DELAY = 300;
  const SWIPE_THRESHOLD = 150;

  const onMouseDown = (event) => {
    if (event.button === 0) {
      isMouseDown.value = true;
      mouseStartX.value = event.clientX;
      mouseDeltaX.value = 0;
    }
  };

  const onMouseMove = (event) => {
    if (!isMouseDown.value || isTransitioning.value || currentPhase.value !== 3)
      return;
    mouseDeltaX.value = event.clientX - mouseStartX.value;
    if (mouseDeltaX.value > SWIPE_THRESHOLD) {
      prevImage();
      isMouseDown.value = false;
      mouseDeltaX.value = 0;
    } else if (mouseDeltaX.value < -SWIPE_THRESHOLD) {
      nextImage();
      isMouseDown.value = false;
      mouseDeltaX.value = 0;
    }
  };

  const onMouseUp = () => {
    const delta = mouseDeltaX.value;
    isMouseDown.value = false;
    mouseDeltaX.value = 0;
    if (
      currentPhase.value === 3 &&
      !isTransitioning.value &&
      Math.abs(delta) < 10
    ) {
      const now = Date.now();
      if (now - lastClickTime < DOUBLE_CLICK_DELAY) {
        isTransitioning.value = true;
        const path = lrcPaths[currentImageIndex.value];
        const cachedLyrics = lyricsCache.value[path];
        if (cachedLyrics) {
          parsedLyrics.value = cachedLyrics;
          currentLrcPath = path;
        } else {
          loadLRC(currentImageIndex.value);
        }
        requestAnimationFrame(() => {
          currentPhase.value = 31;
          imageOffsetX.value = -300;
          songTitleOpacity.value = 0;
        });
        requestAnimationFrame(() => {
          lyricsPanelOpacity.value = 1;
        });
        setTimeout(() => {
          if (currentPhase.value === 31) {
            currentLyricIndex.value = -1;
            lastScrollLyricIndex = -1;
            syncLyrics();
            startLyricsUpdate();
          }
        }, 300);
        setTimeout(() => {
          isTransitioning.value = false;
        }, 500);
      }
      lastClickTime = now;
    }
  };

  container.addEventListener("mousedown", onMouseDown);
  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseup", onMouseUp);
  container.addEventListener("mouseleave", onMouseUp);

  const handleResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", handleResize);

  const updateUI = () => {
    const lerpFactor = 0.03;

    const lerpTo = (current, target, factor, threshold = 0.001) => {
      const next = current + (target - current) * factor;
      return Math.abs(next - target) < threshold ? target : next;
    };

    if (currentPhase.value === 1) {
      annotationOpacity.value = lerpTo(annotationOpacity.value, 1, lerpFactor);
      annotationX.value = lerpTo(annotationX.value, 0, lerpFactor, 0.1);
      whiteScreenOpacity.value = 0;
      imageContainerOpacity.value = 0;
      galleryContainerOpacity.value = 0;
    } else if (currentPhase.value === 2) {
      annotationOpacity.value = lerpTo(annotationOpacity.value, 0, lerpFactor);
      annotationX.value = lerpTo(annotationX.value, 100, lerpFactor, 0.1);
      whiteScreenOpacity.value = lerpTo(
        whiteScreenOpacity.value,
        1,
        lerpFactor,
      );
      imageContainerOpacity.value = lerpTo(
        imageContainerOpacity.value,
        1,
        lerpFactor,
      );
      galleryContainerOpacity.value = 0;
      phase4ContainerOpacity.value = 0;

      if (isSpinning && model) {
        spinProgress += 0.01;
        if (spinProgress >= 1) {
          spinProgress = 1;
          isSpinning = false;
          targetModelRotation.y = 0;
        } else {
          const spinAngle = spinProgress * 3 * Math.PI * 2;
          targetModelRotation.y = -spinAngle;
        }
      }
    } else if (currentPhase.value === 3) {
      imageContainerOpacity.value = lerpTo(
        imageContainerOpacity.value,
        0,
        lerpFactor,
      );
      galleryContainerOpacity.value = lerpTo(
        galleryContainerOpacity.value,
        1,
        lerpFactor,
      );
      phase4ContainerOpacity.value = 0;
      imageOffsetX.value = 0;
      songTitleOpacity.value = 1;
    } else if (currentPhase.value === 31) {
      imageContainerOpacity.value = 0;
      galleryContainerOpacity.value = 1;
      phase4ContainerOpacity.value = 0;
      if (currentAudio && !currentAudio.paused) {
        startLyricsUpdate();
      }
    } else if (currentPhase.value === 4) {
      imageContainerOpacity.value = 0;
      galleryContainerOpacity.value = lerpTo(
        galleryContainerOpacity.value,
        0,
        lerpFactor,
      );
      phase4ContainerOpacity.value = lerpTo(
        phase4ContainerOpacity.value,
        1,
        lerpFactor,
      );
    } else {
      annotationOpacity.value = lerpTo(annotationOpacity.value, 0, lerpFactor);
      annotationX.value = lerpTo(annotationX.value, 100, lerpFactor, 0.1);
      whiteScreenOpacity.value = lerpTo(
        whiteScreenOpacity.value,
        0,
        lerpFactor,
      );
      imageContainerOpacity.value = lerpTo(
        imageContainerOpacity.value,
        0,
        lerpFactor,
      );
      galleryContainerOpacity.value = lerpTo(
        galleryContainerOpacity.value,
        0,
        lerpFactor,
      );
      phase4ContainerOpacity.value = lerpTo(
        phase4ContainerOpacity.value,
        0,
        lerpFactor,
      );
    }
  };

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    if (showWhiteOverlay.value || currentPhase.value === 31) {
      return;
    }

    if (model) {
      const lerpFactor = 0.05;
      model.rotation.x +=
        (targetModelRotation.x - model.rotation.x) * lerpFactor;
      model.rotation.y +=
        (targetModelRotation.y - model.rotation.y) * lerpFactor;
      model.rotation.z +=
        (targetModelRotation.z - model.rotation.z) * lerpFactor;
    }

    updateUI();
    renderer.render(scene, camera);
  };
  animate();

  container._cleanup = () => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("keydown", onKeyDown);
    container.removeEventListener("mousedown", onMouseDown);
    container.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseup", onMouseUp);
    container.removeEventListener("mouseleave", onMouseUp);
    cancelAnimationFrame(animationId);
    stopLyricsUpdate();
    stopAudio();
    renderer?.dispose();
    if (model) {
      model.traverse((o) => {
        if (o.isMesh) {
          o.geometry?.dispose();
          o.material?.dispose();
        }
      });
    }
    if (renderer.domElement?.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };
};

// ==================== 关键：onMounted 统一预加载调度 ====================
onMounted(async () => {
  // 1. 先初始化 Three.js 场景（不加载模型）
  init();

  // 2. 计算总资源数，用于进度条
  // 图片数 + 音频数 + 歌词数 + 模型1个
  totalAssets.value =
    imagePaths.length + 2 + audioPaths.length + lrcPaths.length + 1;

  // 3. 并行加载所有资源，全部完成后才关闭预加载层
  try {
    await Promise.all([
      preloadAllImages(), // 14张图（12张+2张stage）
      preloadAllAudio(), // 12首音频
      preloadAllLyrics(), // 12个歌词
      preloadModel(), // 1个GLTF模型
    ]);
  } catch (e) {
    console.error("预加载过程出错:", e);
  }

  // 4. 全部完成后，稍微延迟让用户看到100%再消失
  preloadProgress.value = 100;
  setTimeout(() => {
    isPreloading.value = false;
  }, 400);
});

onUnmounted(() => {
  containerRef.value?._cleanup?.();
});
</script>

<style scoped>
.model-container {
  width: 100vw;
  height: 100vh;
  background: #f0f0f0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

/* 【新增】预加载层样式 */
.preload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.6s ease;
  pointer-events: none; /* 加载完成后如果因过渡延迟残留，不阻挡交互 */
}

.preload-box {
  text-align: center;
  color: #333;
}

.preload-title {
  font-size: 1.1rem;
  margin-bottom: 24px;
  letter-spacing: 0.15em;
  font-weight: 500;
}

.preload-track {
  width: 180px;
  height: 2px;
  background: #e5e5e5;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 1px;
}

.preload-fill {
  height: 100%;
  background: #333;
  transition: width 0.3s ease;
  border-radius: 1px;
}

.preload-num {
  font-size: 0.85rem;
  color: #999;
  margin-top: 16px;
  letter-spacing: 0.05em;
}

.annotation {
  position: absolute;
  right: 100px;
  top: 50%;
  transform: translateY(-50%);
  text-align: right;
  color: #333;
  transition: none;
}

.annotation h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.annotation p {
  font-size: 1.2rem;
  margin: 0.2rem 0;
}

.annotation .subtitle {
  font-size: 1rem;
  color: #666;
}

.white-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  z-index: 10;
  transition: none;
}

.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  transition: none;
}

.center-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.gallery-container.phase3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  transition: none;
}

.gallery-content {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.8s ease;
  will-change: transform;
}

.gallery-image {
  width: 300px;
  height: 300px;
  object-fit: contain;
  opacity: 0;
  will-change: opacity;
}

.song-title {
  position: absolute;
  bottom: 200px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  opacity: 0;
  width: 80%;
  max-width: 500px;
  overflow: hidden;
  transition: opacity 1s ease;
}

.song-title .japanese {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  white-space: nowrap;
}

.song-title .japanese.scroll {
  display: inline-block;
  animation: marquee-left 20s linear 2s infinite;
}

.song-title .chinese {
  font-size: 1.2rem;
  color: #666;
  margin: 0.5rem 0 0 0;
  white-space: nowrap;
}

.song-title .chinese.scroll {
  display: inline-block;
  animation: marquee-left 20s linear 2s infinite;
}

@keyframes marquee-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% + 500px));
  }
}

.gallery-image.fade-out,
.song-title.fade-out {
  opacity: 0;
  transition: opacity 1s ease;
}

.gallery-image.fade-in,
.song-title.fade-in {
  opacity: 1;
  transition: opacity 1.5s ease;
}

.gallery-image.visible,
.song-title.visible {
  opacity: 1;
}

.gallery-container.phase4 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  z-index: 60;
  transition: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 100px;
}

.gallery-container.phase4 .center-image {
  max-width: 50%;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
}

.gallery-container.phase4 .song-list {
  display: flex;
  flex-direction: column;
  padding-left: 40px;
  overflow-y: auto;
  max-height: 70vh;
  flex-shrink: 0;
}

.gallery-container.phase4 .song-item {
  padding: 10px 16px;
  margin-bottom: 4px;
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  letter-spacing: 0.04em;
  line-height: 1.5;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.gallery-container.phase4 .song-item:hover {
  background-color: #f0f0f0;
  transform: translateX(5px);
  color: #000;
}

.lyrics-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 55%;
  height: 100%;
  background: transparent;
  z-index: 50;
  display: flex;
  flex-direction: column;
  padding: 40px 30px;
  box-sizing: border-box;
  transition: opacity 0.5s ease;
  opacity: 0;
}

.lyrics-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.reset-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px 16px;
  font-size: 0.9rem;
  border: none;
  background: #eee;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #ddd;
  color: #333;
}

.reset-btn:active {
  transform: scale(0.98);
}

.lyrics-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 10px 0;
}

.lyrics-artist {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.lyrics-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.lyrics-content::-webkit-scrollbar {
  width: 4px;
}

.lyrics-content::-webkit-scrollbar-track {
  background: transparent;
}

.lyrics-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.lyrics-line {
  text-align: center;
  padding: 12px 0;
  color: #999;
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lyric-japanese {
  font-size: 1.3rem;
  line-height: 1.5;
}

.lyric-chinese {
  font-size: 0.95rem;
  line-height: 1.4;
  opacity: 0.7;
  margin-top: 4px;
}

.lyrics-line:hover {
  color: #666;
}

.lyrics-line:hover .lyric-chinese {
  opacity: 0.9;
}

.lyrics-line.passed {
  color: #bbb;
}

.lyrics-line.passed .lyric-japanese {
  font-size: 1.1rem;
}

.lyrics-line.passed .lyric-chinese {
  font-size: 0.85rem;
}

.lyrics-line.active {
  color: #333;
}

.lyrics-line.active .lyric-japanese {
  font-size: 1.6rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.lyrics-line.active .lyric-chinese {
  font-size: 1.1rem;
  opacity: 0.85;
}

.exit-hint {
  text-align: center;
  padding: 15px 0;
  color: #999;
  font-size: 0.9rem;
  border-top: 1px solid #eee;
}
</style>
