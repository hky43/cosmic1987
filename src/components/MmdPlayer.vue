<template>
  <div class="mmd-stage">
    <!-- ========== Canvas 层（最底层）========== -->
    <canvas ref="mmdCanvas" class="mmd-canvas"></canvas>

    <!-- ========== 加载中（阶段1）========== -->
    <div v-if="phase === 'loading'" class="overlay loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在初始化渲染管线...</p>
        <p class="loading-percent">{{ loadProgress }}%</p>
        <p class="loading-detail">{{ loadDetail }}</p>
      </div>
    </div>

    <!-- ========== 加载失败 ========== -->
    <div v-if="phase === 'error'" class="overlay error-overlay">
      <div class="loading-content">
        <div class="error-icon">❌</div>
        <p class="error-text">加载失败</p>
        <p class="error-detail">{{ loadError }}</p>
        <button class="retry-btn" @click="reload">重新加载</button>
      </div>
    </div>

    <!-- ========== 启动界面（阶段2）========== -->
    <div v-if="phase === 'ready'" class="overlay start-overlay">
      <div class="start-content">
        <div class="start-icon">🎵</div>
        <p class="start-text">准备就绪</p>
        <p class="start-detail">模型已加载完成，点击下方按钮开始播放</p>
        <button class="start-btn" @click="startPlayback">
          <span class="play-icon">▶</span>
          <span class="play-text">开始播放</span>
        </button>
      </div>
    </div>

    <!-- ========== 全屏开场视频（阶段3）========== -->
    <div v-if="phase === 'intro'" class="overlay intro-video-overlay">
      <video
        ref="introVideoEl"
        class="intro-video"
        :src="CONFIG.introVideoPath"
        playsinline
        preload="auto"
      ></video>
    </div>

    <!-- ========== 淡出覆盖层（动画结束时显示）========== -->
    <div v-if="showFadeOverlay" class="overlay fade-overlay"></div>

    <!-- ========== 控制栏（阶段4 显示）========== -->
    <div
      v-if="phase === 'playing' || phase === 'paused'"
      class="controls-container"
    >
      <button class="ctrl-btn" @click="togglePlay">
        {{ isPlaying ? "⏸" : "▶" }}
      </button>
      <button
        class="ctrl-btn"
        :class="{ active: isLooping }"
        @click="toggleLoop"
      >
        🔄
      </button>
      <button
        class="ctrl-btn camera-btn"
        :class="{ active: cameraMode === 'free' }"
        @click="switchCameraMode('free')"
      >
        🎥
      </button>
      <button
        class="ctrl-btn camera-btn"
        :class="{ active: cameraMode === 'motion' }"
        @click="switchCameraMode('motion')"
      >
        📹
      </button>
      <button
        class="ctrl-btn"
        :class="{ active: videoBgEnabled }"
        @click="toggleVideoBg"
        title="切换视频背景"
      >
        🎬
      </button>
    </div>

    <!-- ========== 操作提示 ========== -->
    <div v-if="phase === 'playing' || phase === 'paused'" class="hint">
      🖱 左键旋转 | 右键平移 | 滚轮缩放
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// ============================================
// 全量导入 babylon-mmd（防止 Tree-shaking）
// ============================================
import "babylon-mmd";

import {
  Engine,
  Scene,
  Vector3,
  Color3,
  Color4,
  DirectionalLight,
  HemisphericLight,
  ArcRotateCamera,
  SceneLoader,
  MeshBuilder,
  StandardMaterial,
  ShadowGenerator,
  VideoTexture,
  Mesh,
  Texture,
} from "@babylonjs/core";
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";
import "@babylonjs/core/Physics/physicsEngineComponent";

import "babylon-mmd/esm/Loader/pmxLoader";
import { PmxLoader } from "babylon-mmd/esm/Loader/pmxLoader";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";
import { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
import {
  VmdLoader,
  MmdRuntime,
  StreamAudioPlayer,
  MmdCamera,
} from "babylon-mmd";

import { asset } from "@/utils/asset";

// ============================================
// 配置
// ============================================
const CONFIG = {
  // ===== 开场视频配置（全屏播放）=====
  introVideoPath: asset("test1/stages/Angel_chinatsu1.mp4"),

  // ===== 背景视频配置（模型背后）=====
  bgVideoPath: asset("test1/stages/Angel_chinatsu.mp4"),

  // ===== 模型配置 =====
  models: [
    {
      id: "model1",
      name: "千夏",
      modelDir: asset("test1/models/千夏/"),
      modelFile: "千夏.pmx",
      motionPath: asset("test1/motions/ReDreaming Angel_chinatsu_L.vmd"),
    },
    {
      id: "model2",
      name: "爱芮",
      modelDir: asset("test1/models/爱芮/"),
      modelFile: "爱芮.pmx",
      motionPath: asset("test1/motions/ReDreaming Angel_chinatsu_C.vmd"),
    },
    {
      id: "model3",
      name: "南宫羽",
      modelDir: asset("test1/models/南宫羽/"),
      modelFile: "南宫羽.pmx",
      motionPath: asset("test1/motions/ReDreaming Angel_chinatsu_R.vmd"),
    },
  ],
  cameraMotionPath: asset("test1/camera/ReDreaming Angel 三人camera.vmd"),

  // ===== 视频背景平面配置 =====
  videoBgWidth: 85,
  videoBgHeight: 50,
  videoBgZ: 100,

  // ===== 场景配置 =====
  bgColor: new Color4(1, 1, 1, 1),
  ambientColor: new Color3(0.15, 0.15, 0.15),
  dirLightDirection: new Vector3(-0.5, -1, -0.5),
  dirLightIntensity: 3.5,
  hemiLightIntensity: 0.25,
  shadowMapSize: 2048,
  shadowMinZ: 0.5,
  shadowMaxZ: 50,
  shadowBias: 0.001,
  cameraAlpha: -Math.PI / 2,
  cameraBeta: Math.PI / 2.6,
  cameraRadius: 35,
  cameraMinRadius: 8,
  cameraMaxRadius: 100,
  cameraTarget: new Vector3(0, 9, 0),
};

// ============================================
// 状态机（使用单一 phase 替代多个布尔值）
// ============================================
// 'loading' → 'ready' → 'intro' → 'playing' | 'paused'
//            ↓
//          'error'
const phase = ref("loading");
const isPlaying = ref(false);
const isLooping = ref(false); // 默认关闭循环
const loadProgress = ref(0);
const loadDetail = ref("准备中...");
const loadError = ref("");
const cameraMode = ref("motion");
const videoBgEnabled = ref(true);
const showFadeOverlay = ref(false); // 淡出覆盖层

// ============================================
// DOM 引用
// ============================================
const mmdCanvas = ref(null);
const introVideoEl = ref(null);

// ============================================
// 核心对象
// ============================================
let engine = null;
let scene = null;
let mmdRuntime = null;
let renderLoop = null;
let shadowGenerator = null;
let dirLight = null;
let groundMesh = null;
let arcCamera = null;
let mmdCamera = null;
let mmdCameraHandle = null;
let audioPlayer = null;
const mmdModels = [];

let videoBgMesh = null;
let videoBgTexture = null;
let videoBgMaterial = null;

// ============================================
// 1. 引擎初始化
// ============================================
function initEngine() {
  engine = new Engine(mmdCanvas.value, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true,
    adaptToDeviceRatio: true,
  });
  scene = new Scene(engine);
  scene.clearColor = CONFIG.bgColor;
  scene.ambientColor = CONFIG.ambientColor;
  window.__scene = scene;
  window.__engine = engine;
}

// ============================================
// 2. 注册 PMX Loader
// ============================================
function ensurePmxLoaderRegistered() {
  if (!SceneLoader.IsPluginForExtensionAvailable(".pmx")) {
    const materialBuilder = new MmdStandardMaterialBuilder();
    // 【先注释掉】materialBuilder.afterBuild 回调可能导致某些材质加载问题
    // materialBuilder.afterBuild = (material, context) => {
    //   material.receiveShadows = true;
    //   material.ambientColor = new Color3(0.1, 0.1, 0.1);
    // };
    const pmxLoader = new PmxLoader();
    pmxLoader.materialBuilder = materialBuilder;
    SceneLoader.RegisterPlugin(pmxLoader);
    console.log("✅ PMX Loader 注册完成");
  }
}

// ============================================
// 3. 灯光 + 阴影
// ============================================
function setupLightsWithShadows() {
  const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
  hemi.intensity = CONFIG.hemiLightIntensity;
  hemi.diffuse = new Color3(0.5, 0.5, 0.6);
  hemi.groundColor = new Color3(0.05, 0.05, 0.08);

  dirLight = new DirectionalLight("dir", CONFIG.dirLightDirection, scene);
  dirLight.intensity = CONFIG.dirLightIntensity;
  dirLight.diffuse = new Color3(1.0, 0.95, 0.9);
  dirLight.specular = new Color3(0.8, 0.8, 0.8);
  dirLight.shadowEnabled = true;
  dirLight.position = new Vector3(10, 20, 10);

  shadowGenerator = new ShadowGenerator(CONFIG.shadowMapSize, dirLight);
  shadowGenerator.shadowMinZ = CONFIG.shadowMinZ;
  shadowGenerator.shadowMaxZ = CONFIG.shadowMaxZ;
  shadowGenerator.bias = CONFIG.shadowBias;
  shadowGenerator.normalBias = 0.02;
  shadowGenerator.darkness = 0.5;
  shadowGenerator.usePoissonSampling = true;
}

// ============================================
// 4. 地面
// ============================================
function setupGround() {
  groundMesh = MeshBuilder.CreateGround(
    "ground",
    { width: 200, height: 200, subdivisions: 2 },
    scene,
  );
  groundMesh.position.set(0, 0, 0);
  groundMesh.receiveShadows = true;
  const mat = new StandardMaterial("groundMaterial", scene);
  mat.diffuseColor = new Color3(0.88, 0.88, 0.9);
  mat.specularColor = new Color3(0.02, 0.02, 0.02);
  mat.specularPower = 10;
  mat.ambientColor = new Color3(0.12, 0.12, 0.12);
  groundMesh.material = mat;
  groundMesh.freezeWorldMatrix();
  mat.freeze();
}

// ============================================
// 5. 视频背景平面（初始隐藏）
// ============================================
function setupVideoBackground() {
  try {
    videoBgMesh = MeshBuilder.CreatePlane(
      "videoBg",
      {
        width: CONFIG.videoBgWidth,
        height: CONFIG.videoBgHeight,
        sideOrientation: Mesh.DOUBLESIDE,
      },
      scene,
    );

    videoBgMesh.position.set(0, CONFIG.videoBgHeight / 2 - 2, CONFIG.videoBgZ);
    videoBgMesh.rotation.y = Math.PI;
    videoBgMesh.scaling.x = -1; // 水平翻转视频画面

    videoBgTexture = new VideoTexture(
      "videoBgTexture",
      [CONFIG.bgVideoPath],
      scene,
      false,
      false,
      Texture.TRILINEAR_SAMPLINGMODE,
      {
        autoPlay: false,
        loop: true,
        muted: true,
      },
    );

    videoBgMaterial = new StandardMaterial("videoBgMaterial", scene);
    videoBgMaterial.diffuseTexture = videoBgTexture;
    videoBgMaterial.emissiveColor = new Color3(1, 1, 1);
    videoBgMaterial.backFaceCulling = false;
    videoBgMesh.material = videoBgMaterial;
    videoBgMesh.receiveShadows = false;
    videoBgMesh.isVisible = false; // 开场结束前隐藏

    console.log("🎬 视频背景平面初始化完成");
  } catch (err) {
    console.warn("⚠️ 视频背景初始化失败:", err.message);
  }
}

// ============================================
// 6. 相机
// ============================================
function setupCamera() {
  arcCamera = new ArcRotateCamera(
    "arcCam",
    CONFIG.cameraAlpha,
    CONFIG.cameraBeta,
    CONFIG.cameraRadius,
    CONFIG.cameraTarget,
    scene,
  );
  arcCamera.attachControl(mmdCanvas.value, true);
  arcCamera.lowerRadiusLimit = CONFIG.cameraMinRadius;
  arcCamera.upperRadiusLimit = CONFIG.cameraMaxRadius;
  arcCamera.lowerBetaLimit = 0.1;
  arcCamera.upperBetaLimit = Math.PI / 2 + 0.3;
  arcCamera.inertia = 0.8;
  arcCamera.wheelPrecision = 40;
  arcCamera.panningInertia = 0.7;
  arcCamera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");

  mmdCamera = new MmdCamera("mmdCamera", new Vector3(0, 10, 0), scene);
  scene.activeCamera = mmdCamera;
}

// ============================================
// 7. 加载 MMD 资源
// ============================================
async function loadMmdResources() {
  try {
    ensurePmxLoaderRegistered();

    console.log("🔧 创建 MmdRuntime...");
    // 如果 scene 已经启用物理引擎，MmdRuntime 会自动复用
    mmdRuntime = new MmdRuntime(scene);
    mmdRuntime.register(scene);
    console.log("✅ MmdRuntime 创建成功");

    const audio = new StreamAudioPlayer(scene);
    audio.source = asset("test1/audio/妄想天使.wav");
    audio.autoPlay = false;
    audio.volume = 0.7;
    audio.loop = true;

    audio.onLoaded = () => console.log("✅ 音频加载成功");
    audio.onError = (err) => console.error("❌ 音频加载失败:", err);

    mmdRuntime.setAudioPlayer(audio);
    audioPlayer = audio;

    const vmd = new VmdLoader(scene);

    for (let i = 0; i < CONFIG.models.length; i++) {
      const modelConfig = CONFIG.models[i];
      loadProgress.value = 10 + i * 25;
      loadDetail.value = `正在加载模型 ${i + 1}/${CONFIG.models.length}: ${modelConfig.name}...`;

      try {
        console.log(
          `[ModelLoader] ⏳ 开始加载模型: ${modelConfig.modelDir}${modelConfig.modelFile}`,
        );
        const startTime = Date.now();

        // 【关键修复】添加超时机制，防止无限卡住
        const loadPromise = SceneLoader.ImportMeshAsync(
          "",
          modelConfig.modelDir,
          modelConfig.modelFile,
          scene,
          (e) => {
            // 【修复】即使 lengthComputable 为 false，也更新进度
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              loadProgress.value = 10 + i * 25 + Math.round(percent * 0.2);
              loadDetail.value = `正在加载模型 ${i + 1}/${CONFIG.models.length}: ${modelConfig.name} (${percent}%)`;
              console.log(
                `[ModelLoader] 进度: ${e.loaded}/${e.total} (${percent}%)`,
              );
            } else {
              // 未知大小时，显示已下载字节数
              const mb = (e.loaded / 1024 / 1024).toFixed(1);
              loadDetail.value = `正在加载模型 ${i + 1}/${CONFIG.models.length}: ${modelConfig.name} (${mb} MB)`;
              console.log(`[ModelLoader] 已下载: ${mb} MB`);
            }
          },
        );

        // 30秒超时
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () =>
              reject(new Error(`模型 ${modelConfig.name} 加载超时（30秒）`)),
            30000,
          );
        });

        const result = await Promise.race([loadPromise, timeoutPromise]);

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(
          `[ModelLoader] ✅ 模型 ${modelConfig.name} 加载完成，耗时 ${elapsed} 秒`,
        );

        const mesh = result.meshes[0];
        if (!mesh)
          throw new Error(`模型 ${modelConfig.name} 加载失败: mesh 为空`);
        console.log(
          `[ModelLoader] 模型 ${modelConfig.name} 获取到 mesh:`,
          mesh?.name,
        );

        const allMeshes = mesh.getChildMeshes(true);
        allMeshes.push(mesh);
        allMeshes.forEach((child) => {
          child.receiveShadows = true;
          if (shadowGenerator) shadowGenerator.addShadowCaster(child, false);
        });

        const mmdModel = mmdRuntime.createMmdModel(mesh);
        const motion = await vmd.loadAsync(
          `motion_${i}`,
          modelConfig.motionPath,
        );
        const animHandle = mmdModel.createRuntimeAnimation(motion);
        mmdModel.setRuntimeAnimation(animHandle);

        mmdModels.push({ config: modelConfig, model: mmdModel, mesh: mesh });
      } catch (modelErr) {
        console.error(`❌ 模型 ${modelConfig.name} 加载失败:`, modelErr);
        continue;
      }
    }

    if (mmdModels.length === 0) throw new Error("所有模型加载失败");

    if (CONFIG.cameraMotionPath) {
      try {
        const cameraMotion = await vmd.loadAsync(
          "camera_motion",
          CONFIG.cameraMotionPath,
        );
        mmdCameraHandle = mmdCamera.createRuntimeAnimation(cameraMotion);
        mmdCamera.setRuntimeAnimation(mmdCameraHandle);
        mmdRuntime.addAnimatable(mmdCamera);
      } catch (err) {
        console.warn("⚠️ 镜头配布加载失败:", err);
      }
    }

    loadProgress.value = 100;
    loadDetail.value = "加载完成";

    window.__mmdRuntime = mmdRuntime;
    window.__mmdModels = mmdModels;
  } catch (err) {
    console.error("❌ 加载失败:", err);
    throw err;
  }
}

// ============================================
// 8. 渲染循环
// ============================================
function startRenderLoop() {
  renderLoop = engine.runRenderLoop(() => {
    if (mmdRuntime && isPlaying.value && phase.value === "playing") {
      const currentTime = mmdRuntime.currentFrameTime || 0;
      const duration = mmdRuntime.animationFrameTimeDuration || 0;
      if (duration > 0 && currentTime >= duration - 0.1) {
        if (isLooping.value) {
          // 循环模式：重新开始
          mmdRuntime.seekAnimation(0);
        } else {
          // 非循环模式：淡出返回启动界面
          handleAnimationEnd();
        }
      }
    }
    scene.render();
  });
}

// ============================================
// 动画结束处理（非循环模式）
// ============================================
async function handleAnimationEnd() {
  if (phase.value !== "playing") return;

  console.log("🎬 动画播放结束，开始淡出...");

  // 停止动画和音频
  isPlaying.value = false;
  if (mmdRuntime) {
    mmdRuntime.pauseAnimation();
  }
  if (audioPlayer) {
    audioPlayer.pause();
  }
  if (videoBgTexture && videoBgTexture.video) {
    videoBgTexture.video.pause();
  }

  // 显示淡出层
  showFadeOverlay.value = true;

  // 等待淡出动画完成（1秒）
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 重置状态回到启动界面
  resetToReadyState();
}

// ============================================
// 重置到启动界面状态
// ============================================
function resetToReadyState() {
  // 隐藏淡出层
  showFadeOverlay.value = false;

  // 隐藏视频背景
  if (videoBgMesh) {
    videoBgMesh.isVisible = false;
  }

  // 重置动画到开头
  if (mmdRuntime) {
    mmdRuntime.seekAnimation(0);
  }

  // 重置背景视频
  if (videoBgTexture && videoBgTexture.video) {
    videoBgTexture.video.currentTime = 0;
  }

  // 切换到启动界面阶段
  phase.value = "ready";
  console.log("✅ 已返回启动界面");
}

function handleResize() {
  engine?.resize();
}

// ============================================
// 9. 启动播放流程
// ============================================
async function startPlayback() {
  if (phase.value !== "ready") return;

  console.log("▶️ 用户点击开始，进入开场视频阶段");
  phase.value = "intro";

  // 等待 DOM 更新后再操作视频元素
  await new Promise((resolve) => setTimeout(resolve, 50));

  const videoEl = introVideoEl.value;
  if (!videoEl) {
    console.warn("⚠️ 开场视频元素未找到，跳过开场");
    await enterPlayingPhase();
    return;
  }

  try {
    await videoEl.play();
    console.log("🎬 开场视频播放中...");

    // 监听视频自然结束事件，播放完毕后再切换
    videoEl.addEventListener(
      "ended",
      async () => {
        await enterPlayingPhase();
      },
      { once: true },
    );
  } catch (err) {
    console.warn("⚠️ 开场视频播放失败:", err);
    await enterPlayingPhase();
  }
}

// ============================================
// 10. 进入正式播放阶段（硬切）
// ============================================
async function enterPlayingPhase() {
  console.log("🎬 硬切到模型场景");

  // 停止开场视频并保持在最后一帧，防止闪回第一帧
  const videoEl = introVideoEl.value;
  if (videoEl) {
    videoEl.pause();
    const duration = videoEl.duration;
    if (duration && !isNaN(duration) && isFinite(duration)) {
      try {
        videoEl.currentTime = duration;
      } catch (e) {
        console.warn("⚠️ 无法设置视频 currentTime:", e);
      }
    }
  }

  // 显示 Babylon 视频背景
  if (videoBgMesh) {
    videoBgMesh.isVisible = true;
  }
  if (videoBgTexture && videoBgTexture.video) {
    videoBgTexture.video.currentTime = 0;
    videoBgTexture.video.play();
  }

  // 启动 MMD 动画
  if (mmdRuntime) {
    mmdRuntime.playAnimation();
    isPlaying.value = true;
  }

  // 启动音频
  if (audioPlayer) {
    audioPlayer.play();
  }

  // 切换到播放阶段
  phase.value = "playing";

  console.log("✅ 模型动画已开始，视频背景已激活");
}

// ============================================
// 11. 控制函数
// ============================================
function togglePlay() {
  if (!mmdRuntime) return;
  if (isPlaying.value) {
    mmdRuntime.pauseAnimation();
    phase.value = "paused";
  } else {
    mmdRuntime.playAnimation();
    phase.value = "playing";
  }
  isPlaying.value = !isPlaying.value;

  if (videoBgTexture && videoBgTexture.video) {
    if (isPlaying.value) {
      videoBgTexture.video.play();
    } else {
      videoBgTexture.video.pause();
    }
  }
}

function toggleLoop() {
  isLooping.value = !isLooping.value;
  console.log("🔄 循环模式:", isLooping.value ? "开启" : "关闭");
}

function toggleVideoBg() {
  videoBgEnabled.value = !videoBgEnabled.value;
  if (videoBgMesh) {
    videoBgMesh.isVisible = videoBgEnabled.value;
  }
  console.log("🎬 视频背景:", videoBgEnabled.value ? "显示" : "隐藏");
}

function switchCameraMode(mode) {
  if (mode === cameraMode.value) return;
  cameraMode.value = mode;
  if (mode === "free") {
    scene.activeCamera = arcCamera;
    arcCamera.attachControl(mmdCanvas.value, true);
  } else if (mode === "motion") {
    scene.activeCamera = mmdCamera;
  }
}

// ============================================
// 12. 重新加载
// ============================================
function reload() {
  phase.value = "loading";
  loadProgress.value = 0;
  loadDetail.value = "准备中...";
  loadError.value = "";
  isPlaying.value = false;

  // 清理资源
  if (videoBgTexture) {
    try {
      videoBgTexture.dispose();
    } catch (e) {}
    videoBgTexture = null;
  }
  if (videoBgMesh) {
    try {
      videoBgMesh.dispose();
    } catch (e) {}
    videoBgMesh = null;
  }
  if (renderLoop && engine) {
    engine.stopRenderLoop(renderLoop);
    renderLoop = null;
  }
  if (mmdRuntime) {
    try {
      mmdRuntime.dispose();
    } catch (e) {}
    mmdRuntime = null;
  }
  if (scene) {
    try {
      scene.dispose();
    } catch (e) {}
    scene = null;
  }
  if (engine) {
    try {
      engine.dispose();
    } catch (e) {}
    engine = null;
  }

  shadowGenerator = null;
  dirLight = null;
  groundMesh = null;
  arcCamera = null;
  mmdCamera = null;
  mmdCameraHandle = null;
  audioPlayer = null;
  mmdModels.length = 0;

  initAndLoad();
}

// ============================================
// 【修复】动态加载 Ammo.js（探测 WASM 文件名 + 缓存实例）
// ============================================
async function loadAmmo() {
  return new Promise(async (resolve, reject) => {
    // 如果已经初始化过，直接复用实例
    if (window.__ammoInstance) {
      resolve(window.__ammoInstance);
      return;
    }

    // 探测 public/ammo/ 目录下实际存在的 WASM 文件名
    const possibleNames = ["ammo.wasm.wasm", "ammo.wasm"];
    let wasmFileName = null;
    for (const name of possibleNames) {
      try {
        const resp = await fetch(`/ammo/${name}`, { method: "HEAD" });
        if (resp.status === 200) {
          wasmFileName = name;
          break;
        }
      } catch (e) {
        // fetch 失败继续尝试下一个
      }
    }

    if (!wasmFileName) {
      reject(
        new Error(
          "WASM 文件未找到，请确认 public/ammo/ 目录下存在 ammo.wasm 或 ammo.wasm.wasm",
        ),
      );
      return;
    }

    console.log(`[Ammo] 检测到 WASM 文件: ${wasmFileName}`);

    // 在加载 JS 胶水代码前，先配置 Module.locateFile
    window.Module = window.Module || {};
    window.Module.locateFile = (file) => {
      if (file.endsWith(".wasm")) {
        return `/ammo/${wasmFileName}`;
      }
      return `/ammo/${file}`;
    };

    // 动态创建 script 标签加载胶水代码
    const script = document.createElement("script");
    script.src = "/ammo/ammo.wasm.js";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      console.log("[Ammo] JS 胶水代码加载完成，等待 WASM 初始化...");

      // 轮询检查 window.Ammo 是否可用
      let attempts = 0;
      const maxAttempts = 200; // 10秒超时

      const checkInterval = setInterval(() => {
        attempts++;
        if (typeof window.Ammo === "function") {
          clearInterval(checkInterval);
          // 调用 Ammo() 初始化 WASM，返回 Promise
          window
            .Ammo()
            .then((instance) => {
              window.__ammoInstance = instance;
              console.log("[Ammo] WASM 实例化成功");
              resolve(instance);
            })
            .catch((wasmErr) => {
              reject(new Error(`WASM 实例化失败: ${wasmErr.message}`));
            });
          return;
        }

        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(
            new Error(
              "Ammo.js 加载超时（10秒），window.Ammo 未定义，请检查 /ammo/ammo.wasm.js 是否有效",
            ),
          );
        }
      }, 50);
    };

    script.onerror = () => {
      reject(
        new Error(
          "Ammo.js 脚本加载失败，请确认 public/ammo/ammo.wasm.js 文件存在且未损坏",
        ),
      );
    };

    document.head.appendChild(script);
  });
}

// ============================================
// 13. 总入口
// ============================================
async function initAndLoad() {
  try {
    console.log("🚀 开始初始化...");
    phase.value = "loading";

    // ========== 1. 创建引擎和场景 ==========
    initEngine();

    // ========== 2. 动态加载并初始化 Ammo.js（核心步骤）==========
    // 【测试选项】设置为 true 可跳过物理引擎，快速测试模型加载
    const SKIP_PHYSICS = false;

    if (!SKIP_PHYSICS) {
      try {
        loadDetail.value = "正在加载物理引擎...";
        const ammoInstance = await loadAmmo();
        const ammoPlugin = new AmmoJSPlugin(true, ammoInstance);
        scene.enablePhysics(new Vector3(0, -9.81, 0), ammoPlugin);
        console.log("✅ Babylon 物理引擎已启用");
      } catch (err) {
        console.error("❌ Ammo 物理初始化失败:", err);
        console.warn(
          "⚠️ 将以无物理模式继续运行，模型能显示但头发/裙子不会飘动",
        );
      }
    } else {
      console.log("⚠️ 已跳过物理引擎加载（测试模式）");
    }

    setupLightsWithShadows();
    setupGround();
    setupVideoBackground();
    setupCamera();

    await loadMmdResources();
    startRenderLoop();
    window.addEventListener("resize", handleResize);

    // 所有资源就绪，切换到启动界面
    phase.value = "ready";
    console.log("✅ 初始化完成，等待用户点击开始");
  } catch (err) {
    console.error("❌ 初始化失败:", err);
    loadError.value = err.message || "初始化失败";
    phase.value = "error";
  }
}

onMounted(() => {
  initAndLoad();
});

onBeforeUnmount(() => {
  if (videoBgTexture) {
    try {
      videoBgTexture.dispose();
    } catch (e) {}
  }
  if (videoBgMesh) {
    try {
      videoBgMesh.dispose();
    } catch (e) {}
  }
  if (renderLoop && engine) engine.stopRenderLoop(renderLoop);
  if (mmdRuntime) {
    try {
      mmdRuntime.dispose();
    } catch (e) {}
  }
  if (scene) {
    try {
      scene.dispose();
    } catch (e) {}
  }
  if (engine) {
    try {
      engine.dispose();
    } catch (e) {}
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
/* ============================================
   舞台容器
   ============================================ */
.mmd-stage {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
}

/* ============================================
   Canvas（最底层，z-index: 0）
   ============================================ */
.mmd-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  outline: none;
  display: block;
}

/* ============================================
   通用覆盖层（绝对定位，填满容器）
   ============================================ */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ============================================
   加载中（z-index: 10）
   ============================================ */
.loading-overlay {
  z-index: 10;
  background: rgba(255, 255, 255, 0.96);
}

.loading-content {
  text-align: center;
  color: #303040;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
  border: 3px solid rgba(0, 0, 0, 0.08);
  border-top-color: #ff6b9d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 16px;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.loading-percent {
  font-size: 32px;
  font-weight: bold;
  color: #ff6b9d;
  font-family: "Courier New", monospace;
  margin-bottom: 4px;
}

.loading-detail {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
  letter-spacing: 1px;
}

/* ============================================
   错误提示（z-index: 10）
   ============================================ */
.error-overlay {
  z-index: 10;
  background: rgba(255, 245, 245, 0.96);
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-text {
  font-size: 20px;
  font-weight: bold;
  color: #ff4444;
  margin-bottom: 8px;
}

.error-detail {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.55);
  margin-bottom: 20px;
  max-width: 400px;
  word-break: break-all;
}

.retry-btn {
  padding: 10px 30px;
  background: rgba(255, 107, 157, 0.2);
  border: 1px solid rgba(255, 107, 157, 0.5);
  border-radius: 8px;
  color: #ff6b9d;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: rgba(255, 107, 157, 0.4);
}

/* ============================================
   启动界面（z-index: 20）
   ============================================ */
.start-overlay {
  z-index: 20;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.start-content {
  text-align: center;
  color: #303040;
  padding: 40px 60px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.start-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.start-text {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #303040;
}

.start-detail {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 28px;
}

.start-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 48px;
  background: linear-gradient(135deg, #ff6b9d, #ff8ec7);
  border: none;
  border-radius: 50px;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 107, 157, 0.5);
}

.start-btn:active {
  transform: translateY(0);
}

.play-icon {
  font-size: 24px;
}

.play-text {
  letter-spacing: 2px;
}

/* ============================================
   开场视频（z-index: 30，最顶层）
   ============================================ */
.intro-video-overlay {
  z-index: 30;
  background: #000;
}

.intro-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ============================================
   控制栏（z-index: 40）
   ============================================ */
.controls-container {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(240, 240, 250, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(15px);
  z-index: 40;
}

.ctrl-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.ctrl-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, 0.25);
}

.ctrl-btn.active {
  background: rgba(100, 200, 255, 0.25);
  border-color: rgba(100, 200, 255, 0.5);
  color: #64c8ff;
}

/* ============================================
   操作提示（z-index: 40）
   ============================================ */
.hint {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 18px;
  background: rgba(240, 240, 250, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.35);
  font-size: 12px;
  backdrop-filter: blur(10px);
  z-index: 40;
}

/* ============================================
   淡出覆盖层
   ============================================ */
.fade-overlay {
  position: absolute;
  inset: 0;
  background: #ffffff;
  z-index: 100;
  animation: fadeIn 1s ease-out forwards;
  pointer-events: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
