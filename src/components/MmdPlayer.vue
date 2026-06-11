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

        <button
          class="start-btn info-start-btn"
          @click="showCreditsFromStart"
          title="技术说明与借物表"
        >
          <span class="play-icon">ℹ</span>
          <span class="play-text">技术说明</span>
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
        crossorigin="anonymous"
      ></video>
    </div>

    <!-- ========== 淡出覆盖层（动画结束时显示）========== -->
    <div v-if="showFadeOverlay" class="overlay fade-overlay"></div>

    <!-- ========== 结束介绍页面 / 借物表（阶段5）========== -->
    <div
      v-if="phase === 'credits'"
      class="overlay credits-overlay"
      tabindex="0"
      @keydown="handleCreditsKeydown"
      ref="creditsEl"
    >
      <div class="credits-content">
        <div class="credits-header">
          <h1 class="credits-title">妄想天使</h1>
          <p class="credits-subtitle">MMD 技术演示 · 借物表</p>
        </div>

        <!-- 技术栈 -->
        <div class="credits-card">
          <div class="credits-card-head">
            <span class="credits-card-icon">🛠</span>
            <h2>技术实现</h2>
          </div>
          <ul class="credits-list">
            <li>
              <span class="credits-tag">渲染引擎</span>
              <a
                href="https://www.babylonjs.com/"
                target="_blank"
                rel="noopener"
                >Babylon.js 7.x</a
              >
            </li>
            <li>
              <span class="credits-tag">MMD 运行时</span>
              <a
                href="https://github.com/BabylonJS/babylon-mmd"
                target="_blank"
                rel="noopener"
                >babylon-mmd</a
              >
            </li>
            <li>
              <span class="credits-tag">前端框架</span>
              <a href="https://vuejs.org/" target="_blank" rel="noopener"
                >Vue 3 + Vite</a
              >
            </li>
            <li>
              <span class="credits-tag">物理引擎</span>
              <a
                href="https://github.com/kripken/ammo.js/"
                target="_blank"
                rel="noopener"
                >Ammo.js (WASM)</a
              >
            </li>
            <li>
              <span class="credits-tag">动作数据</span>
              <span>VMD (Vocaloid Motion Data)</span>
            </li>
            <li>
              <span class="credits-tag">模型格式</span>
              <span>PMX (Polygon Model eXtended)</span>
            </li>
          </ul>
        </div>

        <!-- 借物表 -->
        <div class="credits-card">
          <div class="credits-card-head">
            <span class="credits-card-icon">📋</span>
            <h2>借物表 / Credits</h2>
          </div>
          <ul class="credits-list">
            <li>
              <span class="credits-tag">模型</span>
              <span>miHoYo/橘子/观海子</span>
            </li>
            <li>
              <span class="credits-tag">动作</span>
              <span>ケイ</span>
            </li>
            <li>
              <span class="credits-tag">镜头</span>
              <span
                >千月其一（<a
                  href="https://www.bilibili.com/video/BV1ueNczmEVj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >BV1ueNczmEVj</a
                >）</span
              >
            </li>
            <li>
              <span class="credits-tag">音频</span>
              <span
                >ReDreaming Angel 复梦天使（<a
                  href="https://www.bilibili.com/video/BV11UBfBMEfQ/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >BV11UBfBMEfQ</a
                >）</span
              >
            </li>
            <li>
              <span class="credits-tag">场景视频</span>
              <span>ReDreaming Angel 复梦天使</span>
            </li>
          </ul>
        </div>

        <!-- 技术文档 -->
        <div class="credits-card">
          <div class="credits-card-head">
            <span class="credits-card-icon">📚</span>
            <h2>相关链接</h2>
          </div>
          <div class="credits-links">
            <a href="https://doc.babylonjs.com/" target="_blank" rel="noopener"
              >Babylon.js 文档</a
            >
            <a
              href="https://github.com/BabylonJS/babylon-mmd"
              target="_blank"
              rel="noopener"
              >babylon-mmd</a
            >
            <a
              href="https://github.com/kripken/ammo.js/"
              target="_blank"
              rel="noopener"
              >Ammo.js(失败)</a
            >
            <a href="https://learnmmd.com/" target="_blank" rel="noopener"
              >Learn MMD</a
            >
          </div>
        </div>

        <!-- 按键提示 -->
        <div class="credits-hint">
          <span class="key-badge">任意键</span>
          <span class="credits-hint-text">按下返回开始界面</span>
        </div>
      </div>
    </div>

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
import {
  ref,
  onMounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
} from "vue";

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
  MirrorTexture,
  Plane,
  Mesh,
  Texture,
} from "@babylonjs/core";

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
  videoBgY: 40,

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

  // ===== 模型本影（自阴影）配置 =====
  selfShadowMapSize: 1024,
  selfShadowMinZ: 0.1,
  selfShadowMaxZ: 15,
  selfShadowBias: 0.005,
  selfShadowDarkness: 0.3,

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
//            ↓                          ↓
//          'error'                   'credits' → 'ready'
const phase = ref("loading");
const isPlaying = ref(false);
const isLooping = ref(false); // 默认关闭循环
const loadProgress = ref(0);
const loadDetail = ref("准备中...");
const loadError = ref("");
const cameraMode = ref("motion");
const videoBgEnabled = ref(true);
const showFadeOverlay = ref(false); // 淡出覆盖层
const creditsEl = ref(null); // 借物表 DOM 引用

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
let selfShadowGenerator = null;
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
    // 开启 MMD 风格描边，增强人物轮廓层次感
    materialBuilder.outlineWidth = 0.5;
    materialBuilder.outlineColor = new Color3(0, 0, 0);
    const pmxLoader = new PmxLoader();
    pmxLoader.materialBuilder = materialBuilder;
    SceneLoader.RegisterPlugin(pmxLoader);
    console.log("✅ PMX Loader 注册完成（已开启描边）");
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

  // ===== 模型本影生成器：近距离高精度 =====
  const selfDirLight = new DirectionalLight(
    "selfDirLight",
    CONFIG.dirLightDirection,
    scene,
  );
  selfDirLight.intensity = CONFIG.dirLightIntensity;
  selfDirLight.diffuse = new Color3(1.0, 0.95, 0.9);
  selfDirLight.specular = new Color3(0.8, 0.8, 0.8);
  selfDirLight.shadowEnabled = true;
  selfDirLight.position = new Vector3(5, 15, 5);

  selfShadowGenerator = new ShadowGenerator(
    CONFIG.selfShadowMapSize,
    selfDirLight,
  );
  selfShadowGenerator.shadowMinZ = CONFIG.selfShadowMinZ;
  selfShadowGenerator.shadowMaxZ = CONFIG.selfShadowMaxZ;
  selfShadowGenerator.bias = CONFIG.selfShadowBias;
  selfShadowGenerator.normalBias = 0.02;
  selfShadowGenerator.darkness = CONFIG.selfShadowDarkness;
  selfShadowGenerator.useBlurExponentialShadowMap = true;
  selfShadowGenerator.blurScale = 2;
  selfShadowGenerator.blurBoxOffset = 1;
  selfShadowGenerator.forceBackFacesOnly = true;
}

// ============================================
// 4. 纯镜面反射地板
// ============================================
function setupGround() {
  groundMesh = MeshBuilder.CreateGround(
    "ground",
    { width: 200, height: 200, subdivisions: 2 },
    scene,
  );
  groundMesh.position.set(0, 0, 0);

  const mirror = new MirrorTexture("mirror", 1024, scene, true);
  mirror.mirrorPlane = new Plane(0, -1, 0, 0);

  const mirrorMat = new StandardMaterial("mirrorMat", scene);
  mirrorMat.diffuseColor = new Color3(0, 0, 0);
  mirrorMat.specularColor = new Color3(0, 0, 0);
  mirrorMat.emissiveColor = new Color3(0, 0, 0);
  mirrorMat.reflectionTexture = mirror;
  mirrorMat.reflectionTexture.level = 1.0;

  groundMesh.material = mirrorMat;
  groundMesh.receiveShadows = true;

  window.__groundMirror = mirror;

  console.log("✅ 镜面反射地板初始化完成");
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

    videoBgMesh.position.set(0, CONFIG.videoBgY, CONFIG.videoBgZ);
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
        crossOrigin: "anonymous",
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

        const loadPromise = SceneLoader.ImportMeshAsync(
          "",
          modelConfig.modelDir,
          modelConfig.modelFile,
          scene,
          (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              loadProgress.value = 10 + i * 25 + Math.round(percent * 0.2);
              loadDetail.value = `正在加载模型 ${i + 1}/${CONFIG.models.length}: ${modelConfig.name} (${percent}%)`;
              console.log(
                `[ModelLoader] 进度: ${e.loaded}/${e.total} (${percent}%)`,
              );
            } else {
              const mb = (e.loaded / 1024 / 1024).toFixed(1);
              loadDetail.value = `正在加载模型 ${i + 1}/${CONFIG.models.length}: ${modelConfig.name} (${mb} MB)`;
              console.log(`[ModelLoader] 已下载: ${mb} MB`);
            }
          },
        );

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
          if (selfShadowGenerator)
            selfShadowGenerator.addShadowCaster(child, true);
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

    if (window.__groundMirror) {
      mmdModels.forEach(({ mesh }) => {
        const allMeshes = mesh.getChildMeshes(true);
        allMeshes.push(mesh);
        allMeshes.forEach((child) => {
          window.__groundMirror.renderList.push(child);
        });
      });
      console.log("✅ 模型已加入镜面反射列表");
    }
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
          mmdRuntime.seekAnimation(0);
          // 动画循环时，视频也跳回开头重播（视频长于动画时也不会继续播放）
          if (videoBgTexture?.video && videoBgEnabled.value) {
            videoBgTexture.video.currentTime = 0;
          }
        } else {
          handleAnimationEnd();
        }
      }
    }
    scene.render();
  });
}

// ============================================
// 动画结束处理（非循环模式）→ 进入借物表页面
// ============================================
async function handleAnimationEnd() {
  if (phase.value !== "playing") return;

  console.log("🎬 动画播放结束，进入借物表页面...");

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

  showFadeOverlay.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  showFadeOverlay.value = false;

  if (videoBgMesh) {
    videoBgMesh.isVisible = false;
  }

  phase.value = "credits";

  await new Promise((resolve) => setTimeout(resolve, 100));
  if (creditsEl.value) {
    creditsEl.value.focus();
  }

  console.log("✅ 已进入借物表页面，等待用户按键...");
}

// ============================================
// 重置到启动界面状态（从借物表返回）
// ============================================
function resetToReadyState() {
  showFadeOverlay.value = false;

  if (videoBgMesh) {
    videoBgMesh.isVisible = false;
  }

  if (mmdRuntime) {
    mmdRuntime.seekAnimation(0);
  }

  if (videoBgTexture && videoBgTexture.video) {
    videoBgTexture.video.currentTime = 0;
  }

  phase.value = "ready";
  console.log("✅ 已返回启动界面");
}

// ============================================
// 借物表页面按键处理
// ============================================
function handleCreditsKeydown(e) {
  if (
    e.key === "Shift" ||
    e.key === "Control" ||
    e.key === "Alt" ||
    e.key === "Meta" ||
    e.key === "CapsLock" ||
    e.key === "NumLock" ||
    e.key === "ScrollLock" ||
    e.key === "Fn"
  ) {
    return;
  }
  e.preventDefault();
  resetToReadyState();
}

// ============================================
// 从启动界面进入借物表
// ============================================
async function showCreditsFromStart() {
  if (phase.value !== "ready") return;

  console.log("📖 从启动界面进入借物表");

  showFadeOverlay.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));

  showFadeOverlay.value = false;
  phase.value = "credits";

  await new Promise((resolve) => setTimeout(resolve, 100));
  if (creditsEl.value) {
    creditsEl.value.focus();
  }
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

  if (videoBgMesh) {
    videoBgMesh.isVisible = true;
  }
  if (videoBgTexture && videoBgTexture.video) {
    videoBgTexture.video.currentTime = 0;
    videoBgTexture.video.play();
  }

  if (mmdRuntime) {
    mmdRuntime.playAnimation();
    isPlaying.value = true;
  }

  if (audioPlayer) {
    audioPlayer.play();
  }

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
  selfShadowGenerator = null;
  dirLight = null;
  groundMesh = null;
  arcCamera = null;
  mmdCamera = null;
  mmdCameraHandle = null;
  audioPlayer = null;
  mmdModels.length = 0;

  if (window.__groundMirror) {
    window.__groundMirror.dispose();
    window.__groundMirror = null;
  }

  initAndLoad();
}

// ============================================
// 13. 总入口
// ============================================
async function initAndLoad() {
  try {
    console.log("🚀 开始初始化...");
    phase.value = "loading";

    initEngine();

    setupLightsWithShadows();
    setupGround();
    setupVideoBackground();
    setupCamera();

    await loadMmdResources();
    startRenderLoop();
    window.addEventListener("resize", handleResize);

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

onActivated(() => {
  console.log("[MmdPlayer] 页面激活，恢复引擎");
  if (engine) {
    engine.resize();
    console.log("[MmdPlayer] 引擎尺寸已修正");
  }
  // 重新启动渲染循环（onDeactivated 时已停止，避免 GPU 空转）
  if (engine && !engine.isRendering) {
    startRenderLoop();
    console.log("[MmdPlayer] 渲染循环已恢复");
  }
  if (mmdRuntime && isPlaying.value) {
    mmdRuntime.playAnimation();
  }
  if (audioPlayer && isPlaying.value) {
    audioPlayer.play();
  }
  if (videoBgTexture?.video && isPlaying.value) {
    videoBgTexture.video.play();
  }
});

onDeactivated(() => {
  console.log("[MmdPlayer] 页面停用，暂停资源");
  // 停止渲染循环，释放 GPU（keep-alive 缓存时不会触发 onBeforeUnmount）
  if (engine) {
    engine.stopRenderLoop();
    console.log("[MmdPlayer] 渲染循环已停止");
  }
  if (mmdRuntime && isPlaying.value) {
    mmdRuntime.pauseAnimation();
  }
  if (audioPlayer) {
    audioPlayer.pause();
  }
  if (videoBgTexture?.video) {
    videoBgTexture.video.pause();
  }
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
  position: relative;
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
  margin: 0 6px;
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 107, 157, 0.5);
}

.start-btn:active {
  transform: translateY(0);
}

.info-start-btn {
  background: linear-gradient(135deg, #6b9fff, #8ec7ff);
  box-shadow: 0 6px 20px rgba(107, 159, 255, 0.4);
}

.info-start-btn:hover {
  box-shadow: 0 10px 30px rgba(107, 159, 255, 0.5);
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

/* ============================================
   结束介绍页面 / 借物表（z-index: 50）
   ============================================ */
.credits-overlay {
  z-index: 50;
  background: rgba(250, 250, 252, 0.97);
  backdrop-filter: blur(20px);
  overflow-y: auto;
  padding: 24px 20px;
  outline: none;
  display: block;
  animation: creditsSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes creditsSlideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.credits-content {
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  color: #2a2a35;
}

.credits-header {
  text-align: center;
  margin-bottom: 20px;
}

.credits-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 4px;
  background: linear-gradient(135deg, #ff6b9d, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.credits-subtitle {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
  letter-spacing: 3px;
  text-transform: uppercase;
}

/* 卡片容器 */
.credits-card {
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  padding: 14px 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.credits-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.05);
}

.credits-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.credits-card-icon {
  font-size: 16px;
  line-height: 1;
}

.credits-card h2 {
  font-size: 14px;
  font-weight: 700;
  color: #303040;
  margin: 0;
  letter-spacing: 0.5px;
}

/* 列表 */
.credits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.credits-list li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 12.5px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.65);
  padding: 1px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.credits-list li:last-child {
  border-bottom: none;
}

.credits-tag {
  display: inline-block;
  min-width: 64px;
  padding: 2px 6px;
  background: rgba(255, 107, 157, 0.08);
  border: 1px solid rgba(255, 107, 157, 0.15);
  border-radius: 5px;
  color: #ff6b9d;
  font-size: 10.5px;
  font-weight: 600;
  text-align: center;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.credits-list a {
  color: #ff6b9d;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 107, 157, 0.25);
  transition: all 0.2s;
  font-weight: 500;
}

.credits-list a:hover {
  border-color: #ff6b9d;
  color: #e05085;
}

/* 链接按钮组 */
.credits-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.credits-links a {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(255, 107, 157, 0.06);
  border: 1px solid rgba(255, 107, 157, 0.18);
  border-radius: 20px;
  color: #ff6b9d;
  font-size: 12.5px;
  text-decoration: none;
  transition: all 0.25s ease;
  font-weight: 500;
}

.credits-links a:hover {
  background: rgba(255, 107, 157, 0.14);
  border-color: rgba(255, 107, 157, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.1);
}

/* 底部按键提示 */
.credits-hint {
  text-align: center;
  margin-top: 18px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: fadeIn 1s ease 0.3s both;
}

.key-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #303040;
  font-family: "Courier New", monospace;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.08);
}

.credits-hint-text {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.4);
  letter-spacing: 1px;
}
</style>
