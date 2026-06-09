<template>
  <PagePreloader
    title="太阳系边界"
    :images="['images/icons/图标1.png']"
    :models="[asset('旅行者1号fbx模型/3d66.com_27450833.fbx')]"
  >
    <div class="cosmic-game">
      <!-- Three.js Canvas -->
      <canvas ref="canvasRef" class="bg-canvas"></canvas>

      <!-- Inspect 模式数据面板（左侧覆盖层） -->
      <div class="inspect-panel" :class="{ show: inspectMode }">
        <div class="panel-content">
          <div class="panel-header">
            <div class="badge-group">
              <span class="badge nasa">NASA</span>
              <span class="badge mission">深空任务</span>
            </div>
            <div class="live-badge">
              <span class="pulse-dot"></span>
              <span>实时</span>
            </div>
          </div>
          <div class="deco-line"></div>
          <div class="panel-title">
            <h1>旅行者一号</h1>
            <p>星际探测器</p>
          </div>
          <div class="data-block">
            <div class="data-row">
              <span class="data-num">{{ distanceKm.toLocaleString() }}</span>
              <span class="data-unit">公里</span>
              <span class="data-label">距离地球</span>
            </div>
            <div class="data-row">
              <span class="data-num">{{ distanceAu }}</span>
              <span class="data-unit">天文单位</span>
              <span class="data-label">ASTRONOMICAL UNITS</span>
            </div>
            <div class="data-row">
              <span class="data-num">17.00</span>
              <span class="data-unit">公里/秒</span>
              <span class="data-label">速度</span>
            </div>
          </div>
          <div class="desc-block">
            <p>
              人类制造的最遥远物体。1977年9月5日发射，目前正在穿越太阳系外的星际空间，继续探索未知领域。
            </p>
          </div>
          <div class="status-block">
            <div class="status-row">
              <span class="s-key">信号状态</span>
              <span class="s-val highlight">
                <span class="blink-dot"></span>
                已接收
              </span>
            </div>
            <div class="status-row">
              <span class="s-key">任务状态</span>
              <span class="s-val">穿越星际空间</span>
            </div>
            <div class="status-row">
              <span class="s-key">下次更新</span>
              <span class="s-val">{{ nextUpdateTime }}</span>
            </div>
          </div>
          <div class="panel-footer">
            <span class="ft-label">JPL 控制中心</span>
            <span class="ft-time">{{ currentTime }}</span>
            <span class="ft-hint">拖拽旋转 · 滚轮缩放</span>
          </div>
        </div>
      </div>

      <button
        v-show="inspectMode"
        class="global-back-btn"
        @click="exitInspectMode"
      >
        <span class="arrow">←</span>
        <span>{{
          inspectFrom === "detail" ? "BACK TO DETAIL" : "BACK TO SHOWCASE"
        }}</span>
      </button>

      <!-- 游戏 UI 容器：inspect 模式时整体淡出 -->
      <div class="game-ui" :class="{ hidden: inspectMode }">
        <WaveBackground
          class="wave-background"
          :class="{ hidden: phase !== 'aiming' }"
        />

        <!-- 主题艺术字 - 在发射阶段和关卡展示阶段显示 -->
        <div
          class="launch-title"
          :class="{
            'phase-aiming': phase === 'aiming',
            'phase-showcase': phase === 'showcase',
          }"
          v-show="phase === 'aiming' || phase === 'showcase'"
        >
          <span class="title-main">VOYAGER</span>
          <span class="title-sub">DEEP SPACE PROBE</span>
        </div>

        <div
          class="enter-hint"
          :class="{ exit: phase !== 'aiming' }"
          v-show="phase === 'aiming'"
        >
          <p>DRAG TO LAUNCH</p>
          <p class="sub">按住并向下拖动发射航天器</p>
        </div>

        <div
          class="showcase-ui"
          v-show="['transition', 'showcase', 'detail'].includes(phase)"
        >
          <div
            class="levels-grid"
            :class="{ show: phase === 'showcase' }"
            v-show="phase === 'showcase'"
          >
            <button
              v-for="lv in levels"
              :key="lv.id"
              class="level-btn"
              :class="{
                active: currentLevelId === lv.id,
                special: lv.special,
                'inspect-card': lv.isInspectButton,
              }"
              @click="enterDetail(lv)"
            >
              <template v-if="lv.showIcon">
                <!-- 航天器图标 -->
                <img
                  class="lv-icon"
                  :src="asset('images/icons/图标1.png')"
                  alt="航天器图标"
                  width="50"
                  height="42"
                />
              </template>
              <span v-else class="lv-num">{{
                String(lv.id).padStart(2, "0")
              }}</span>
              <span class="lv-name">{{ lv.name }}</span>
            </button>
          </div>

          <!-- ============================================ -->
          <!-- 【修改】Detail 面板 — 新增 ENTER MISSION 按钮  -->
          <!-- ============================================ -->
          <div
            class="detail-panel"
            v-show="phase === 'detail'"
            :class="{ show: detailShow }"
          >
            <div class="detail-inner" v-if="currentLevel">
              <div class="detail-top">
                <span class="detail-num">{{
                  String(currentLevel.id).padStart(2, "0")
                }}</span>
                <div class="live-badge small">
                  <span class="pulse-dot"></span>
                  <span>直播中</span>
                </div>
              </div>
              <div class="deco-line"></div>
              <h2 class="detail-name">{{ currentLevel.name }}</h2>
              <p class="detail-desc">{{ currentLevel.desc }}</p>

              <!-- 按钮组 -->
              <div class="detail-actions">
                <button
                  v-if="!currentLevel.noMissionPage"
                  class="action-btn highlight"
                  @click="goToMissionPage"
                >
                  <span>进入任务</span>
                </button>
                <button class="action-btn" @click="nextLevel">
                  <span>下一个</span>
                </button>
                <button class="action-btn secondary" @click="backToGrid">
                  <span>返回</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="break-text" :class="{ show: showTransitionText }">
          <span>BREAK_LIMIT</span>
        </div>
      </div>

      <BackToHomeButton />

      <!-- 淡入黑色背景覆盖层 -->
      <div class="fade-overlay" :class="{ show: showFadeOverlay }"></div>
    </div>
  </PagePreloader>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  inject,
  onActivated,
  onDeactivated,
} from "vue";
import { audioManager } from "../../utils/audioManager";
import PagePreloader from "../../components/PagePreloader.vue";
import * as THREE from "three";
import Matter from "matter-js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useRouter, useRoute } from "vue-router"; // 【新增】引入路由
import WaveBackground from "../../components/views/about/WaveBackground.vue";
import BackToHomeButton from "../../components/BackToHomeButton.vue";
import { asset } from "@/utils/asset";

defineOptions({ name: "AboutPage" });

const router = useRouter();
const route = useRoute();
const setPageReady = inject("setPageReady", () => {}); // 【新增】创建 router 实例

const WIDTH = 900;
const WORLD_H = 6000;
const SLING_X = WIDTH / 2;
const SLING_Y = 5000;
const ANCHOR_Y = SLING_Y - 40;
const BOX_START_Y = ANCHOR_Y - 30;
const BOUNDARY_Y = 800;
const CUBE_SIZE = 44;
const MAX_DRAG_RATIO = 0.4;

const CAM_Z_AIM = 2600;
const CAM_Z_SHOW = 400;
const FOV_AIM = 22;
const FOV_SHOW = 55;

const PHYSICS_STEP = 1000 / 60;
const LINE_COLOR = 0x000000;
const LINE_OPACITY = 0.85;

const canvasRef = ref(null);
const phase = ref("aiming");
const isDragging = ref(false);
const currentLevelId = ref(null);
const currentLevel = ref(null);
const detailShow = ref(false);
const cubeReady = ref(false);
const inspectMode = ref(false);
const inspectFrom = ref("showcase");
const showTransitionText = ref(false);
const showFadeOverlay = ref(false);

const currentTime = ref("");
const nextUpdateTime = ref("00:00:00");
const baseDistanceKm = 23_835_000_000;
const distanceKm = ref(baseDistanceKm);
const distanceAu = computed(() =>
  (distanceKm.value / 149_597_870.7).toFixed(4),
);

const levels = [
  {
    id: 1,
    name: "发射台",
    desc: "一切从这里开始...",
    cleared: true,
    rot: { x: 0.2, y: 0.3, z: 0 },
  },
  {
    id: 2,
    name: "近地轨道",
    desc: "突破大气层的束缚...",
    cleared: true,
    rot: { x: 0.5, y: 1.8, z: 0.2 },
  },
  {
    id: 3,
    name: "月球背面",
    desc: "人类未曾涉足的阴影之地...",
    cleared: true, // 长亮状态
    rot: { x: 0.8, y: 3.2, z: -0.3 },
  },
  {
    id: 4,
    name: "小行星带",
    desc: "在碎石风暴中穿行...",
    cleared: false,
    rot: { x: 1.2, y: 4.5, z: 0.4 },
  },
  {
    id: 5,
    name: "木星风暴",
    desc: "大红斑前的最后一跃...",
    cleared: false,
    rot: { x: 1.6, y: 5.8, z: -0.2 },
  },
  {
    id: 6,
    name: "土星环",
    desc: "穿越冰与尘的华尔兹...",
    cleared: false,
    rot: { x: 2.0, y: 7.0, z: 0.5 },
  },
  {
    id: 7,
    name: "深空信号",
    desc: "旅行者1号孤独的回响...",
    cleared: false,
    rot: { x: 2.4, y: 8.3, z: -0.4 },
  },
  {
    id: 8,
    name: "检查飞船",
    desc: "详细检查航天器...",
    cleared: false,
    rot: { x: 2.8, y: 9.6, z: 0.3 },
    special: true,
    isInspectButton: true,
    showIcon: true,
    noMissionPage: true,
  },
];

let engine, world, boxBody;
let scene, camera, renderer, raycaster;
let cube, hitMesh, triggerZone;
let spacecraft = null;
let spacecraftInner = null;
let spacecraftBaseScale = 1;
let stars = null;
let trailParticles;
let rafId;
let isPageActive = true;
let lastTime = 0;
let physicsAccumulator = 0;
let controls = null;

const _color = new THREE.Color();
const _vec2 = new THREE.Vector2();
const _target = new THREE.Vector3();
const _tempVec = new THREE.Vector3();

let targetCam = { x: SLING_X, y: 0, z: CAM_Z_AIM };
let currentCam = { x: SLING_X, y: 0, z: CAM_Z_AIM };
let currentFov = FOV_AIM;
let targetFov = FOV_AIM;
let fovDirty = false;

let targetRot = { x: 0, y: 0, z: 0 };
let currentRot = { x: 0, y: 0, z: 0 };

let transitionTime = 0;
const TRANSITION_DURATION = 2800;

let dragStartY = 0;
let dragOffsetY = 0;
let maxDragPx = 240;

let lastBgGray = -1;
let lastTriggerOpacity = -1;
let wasDragging = false;

let preInspectState = null;

// 优化相关变量
const FIXED_DELTA = 16.67; // 固定时间步长（约60fps）
let lastTrailUpdate = 0; // 拖尾粒子上次更新时间
let phaseSwitchBuffer = 0; // 状态切换缓冲帧数
let shouldSkipAiming = false; // 是否跳过发射阶段

const toThreeY = (my) => SLING_Y - my;
function easeSmooth(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function updateTimeData() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const next = new Date(now.getTime() + 5 * 60 * 1000);
  nextUpdateTime.value = next.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

let resizeTimeout;
function debouncedResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(onResize, 100);
}

let isPageVisible = true;
function handleVisibilityChange() {
  isPageVisible = !document.hidden;
  if (!isPageVisible) {
    if (engine) engine.timing.isFixed = false;
  } else {
    lastTime = performance.now();
    physicsAccumulator = 0;
    if (engine) engine.timing.isFixed = true;
  }
}

function initScene() {
  const canvas = canvasRef.value;
  const W = window.innerWidth;
  const H = window.innerHeight;

  maxDragPx = Math.min(H * MAX_DRAG_RATIO, 350);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(FOV_AIM, W / H, 0.1, 50000);
  camera.position.set(SLING_X, 0, CAM_Z_AIM);
  _target.set(SLING_X, 0, 0);
  camera.lookAt(_target);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setSize(W, H, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  if (THREE.SRGBColorSpace !== undefined)
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  // 根据是否跳过发射阶段设置初始背景色
  if (shouldSkipAiming) {
    renderer.setClearColor(new THREE.Color(0, 0, 0)); // 纯黑色
    lastBgGray = 0; // 同步设置，避免渲染循环覆盖
  } else {
    renderer.setClearColor(new THREE.Color(1, 1, 1));
    lastBgGray = 1; // 同步设置
  }
  raycaster = new THREE.Raycaster();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(500, 1000, 500);
  scene.add(dirLight);

  const starGeo = new THREE.BufferGeometry();
  const starCount = 6000;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const dist = Math.random() * 20000 + 5000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = dist * Math.cos(phi);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xe0e6ed,
    size: 2.5,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    depthWrite: false,
  });
  stars = new THREE.Points(starGeo, starMat);
  stars.position.set(0, 0, 0);
  scene.add(stars);

  const triggerGeo = new THREE.PlaneGeometry(260, 100);
  const triggerMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  triggerZone = new THREE.Mesh(triggerGeo, triggerMat);
  triggerZone.position.set(SLING_X, toThreeY(SLING_Y - 60), 5);
  scene.add(triggerZone);

  const cubeGeo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
  const cubeEdges = new THREE.EdgesGeometry(cubeGeo);
  const cubeMat = new THREE.LineBasicMaterial({
    color: LINE_COLOR,
    transparent: true,
    opacity: 0,
    linewidth: 1,
  });
  cube = new THREE.LineSegments(cubeEdges, cubeMat);
  cube.position.set(SLING_X, toThreeY(BOX_START_Y), 0);
  cube.scale.setScalar(0.8);
  cube.visible = true;
  scene.add(cube);

  const coreGeo = new THREE.BoxGeometry(
    CUBE_SIZE * 0.3,
    CUBE_SIZE * 0.3,
    CUBE_SIZE * 0.3,
  );
  const coreEdges = new THREE.EdgesGeometry(coreGeo);
  const coreMat = new THREE.LineBasicMaterial({
    color: LINE_COLOR,
    transparent: true,
    opacity: 0.35,
  });
  cube.add(new THREE.LineSegments(coreEdges, coreMat));

  const hitGeo = new THREE.BoxGeometry(
    CUBE_SIZE * 3,
    CUBE_SIZE * 3,
    CUBE_SIZE * 3,
  );
  const hitMat = new THREE.MeshBasicMaterial({
    visible: true,
    transparent: true,
    opacity: 0,
  });
  hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.position.copy(cube.position);
  scene.add(hitMesh);

  spacecraft = new THREE.Group();
  spacecraft.visible = false;
  scene.add(spacecraft);

  const loader = new FBXLoader();
  loader.load(
    asset("旅行者1号fbx模型/3d66.com_27450833.fbx"),
    (fbx) => {
      spacecraftInner = fbx;
      const box = new THREE.Box3().setFromObject(fbx);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = CUBE_SIZE * 3.5;
      spacecraftBaseScale = targetSize / maxDim;
      fbx.scale.setScalar(spacecraftBaseScale);
      fbx.position.sub(center.clone().multiplyScalar(spacecraftBaseScale));
      fbx.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry && !child.geometry.hasAttribute("normal")) {
            if (typeof child.geometry.computeVertexNormals === "function") {
              child.geometry.computeVertexNormals();
            }
          }
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((m) => {
            if (!m) return;
            m.side = THREE.DoubleSide;
            m.transparent = false;
            m.opacity = 1;
            m.depthWrite = true;
            m.needsUpdate = true;
          });
        }
      });
      spacecraft.add(fbx);
      cubeReady.value = true;
      console.log("[FBX] 模型加载成功");
      setPageReady();
    },
    undefined,
    (error) => {
      console.error("FBX 模型加载失败:", error);
      cubeReady.value = true;
      setPageReady();
    },
  );

  const trailGeo = new THREE.BufferGeometry();
  const trailCount = 80;
  const trailPositions = new Float32Array(trailCount * 3);
  trailGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(trailPositions, 3),
  );
  const trailMat = new THREE.PointsMaterial({
    color: LINE_COLOR,
    size: 3,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  });
  trailParticles = new THREE.Points(trailGeo, trailMat);
  trailParticles.visible = false;
  scene.add(trailParticles);

  engine = Matter.Engine.create();
  world = engine.world;
  engine.gravity.y = 0.5;
  engine.enableSleeping = true;

  boxBody = Matter.Bodies.rectangle(
    SLING_X,
    BOX_START_Y,
    CUBE_SIZE * 1.05,
    CUBE_SIZE * 1.05,
    {
      density: 0.003,
      frictionAir: 0.005,
      restitution: 0.3,
      chamfer: { radius: 8 },
    },
  );
  const wallL = Matter.Bodies.rectangle(-30, WORLD_H / 2, 60, WORLD_H + 400, {
    isStatic: true,
  });
  const wallR = Matter.Bodies.rectangle(
    WIDTH + 30,
    WORLD_H / 2,
    60,
    WORLD_H + 400,
    { isStatic: true },
  );
  const ceiling = Matter.Bodies.rectangle(WIDTH / 2, -100, WIDTH * 2, 60, {
    isStatic: true,
  });
  const floor = Matter.Bodies.rectangle(
    WIDTH / 2,
    WORLD_H + 100,
    WIDTH * 2,
    80,
    { isStatic: true },
  );
  Matter.Composite.add(world, [boxBody, wallL, wallR, ceiling, floor]);

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("resize", debouncedResize);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enabled = false;
  controls.minDistance = 80;
  controls.maxDistance = 600;
  controls.enablePan = false;

  resetShot();
  lastTime = performance.now();
  rafId = requestAnimationFrame(animate);
}

function getPointerNDC(e) {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
    y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
  };
}

function onPointerDown(e) {
  if (inspectMode.value) return;
  if (!cubeReady.value) return;
  const ndc = getPointerNDC(e);
  _vec2.set(ndc.x, ndc.y);
  raycaster.setFromCamera(_vec2, camera);
  const triggerIntersects = raycaster.intersectObject(triggerZone);
  if (triggerIntersects.length > 0) {
    if (phase.value !== "aiming") resetShot();
    isDragging.value = true;
    wasDragging = true;
    dragStartY = e.clientY;
    dragOffsetY = 0;
    canvasRef.value?.classList.add("dragging");
    if (e.cancelable) e.preventDefault();
    return;
  }
  if (phase.value !== "aiming") return;
  const intersects = raycaster.intersectObject(hitMesh);
  if (intersects.length > 0) {
    isDragging.value = true;
    wasDragging = true;
    dragStartY = e.clientY;
    dragOffsetY = 0;
    canvasRef.value?.classList.add("dragging");
    if (e.cancelable) e.preventDefault();
  }
}

function onPointerMove(e) {
  if (!isDragging.value) return;
  const cy = e.clientY;
  dragOffsetY = Math.min(Math.max(0, cy - dragStartY), maxDragPx);
  const pullY = dragOffsetY;
  Matter.Body.setPosition(boxBody, { x: SLING_X, y: ANCHOR_Y + pullY * 0.6 });
  Matter.Body.setVelocity(boxBody, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(boxBody, 0);
  if (e.cancelable) e.preventDefault();
}

function onPointerUp() {
  if (!isDragging.value) return;
  isDragging.value = false;
  wasDragging = false;
  canvasRef.value?.classList.remove("dragging");
  const pullY = dragOffsetY;
  if (pullY < 20) {
    resetShot();
    return;
  }
  const power = pullY / maxDragPx;
  const launchSpeed = 20 + power * 40;
  Matter.Body.setPosition(boxBody, { x: SLING_X, y: ANCHOR_Y + pullY * 0.6 });
  Matter.Body.setVelocity(boxBody, { x: 0, y: -launchSpeed });
  Matter.Body.setAngularVelocity(boxBody, (Math.random() - 0.5) * 0.08);
  phase.value = "flying";
}

function beginTransition() {
  phase.value = "transition";
  transitionTime = 0;
  phaseSwitchBuffer = 2; // 状态切换缓冲2帧
  Matter.Body.setVelocity(boxBody, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(boxBody, 0);
  const angle = boxBody.angle || 0;
  currentRot = { x: 0, y: 0, z: angle };
  targetRot = { x: 0, y: 0, z: angle };
  targetFov = FOV_SHOW;
  fovDirty = true;
  trailParticles.visible = true;
  lastTrailUpdate = 0; // 重置拖尾更新计时
}

// 快速过渡函数 - 用于ESC跳过发射阶段时的平滑过渡
function startQuickTransition() {
  phase.value = "transition";
  transitionTime = 0;
  phaseSwitchBuffer = 2; // 状态切换缓冲2帧
  Matter.Body.setVelocity(boxBody, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(boxBody, 0);

  // 设置初始状态，直接从发射位置开始过渡
  const boxX = boxBody.position.x || SLING_X;
  const boxY = boxBody.position.y || BOX_START_Y;
  const angle = boxBody.angle || 0;

  currentRot = { x: 0, y: 0, z: angle };
  targetRot = { x: 0.3, y: 0.5, z: angle + 0.8 };
  targetFov = FOV_SHOW;
  fovDirty = true;
  trailParticles.visible = true;
  lastTrailUpdate = 0; // 重置拖尾更新计时

  // 显示过渡文字
  showTransitionText.value = true;

  // 设置相机目标位置
  const threeY = toThreeY(boxY);
  targetCam.x = boxX;
  targetCam.y = threeY - 60;
  targetCam.z = CAM_Z_SHOW;
  currentCam.x = camera.position.x;
  currentCam.y = camera.position.y;
  currentCam.z = camera.position.z;
}

function enterShowcase() {
  showTransitionText.value = false;
  phase.value = "showcase";
  currentFov = FOV_SHOW;
  camera.fov = currentFov;
  fovDirty = true;

  const boxX = boxBody.position.x;
  const threeY = toThreeY(boxBody.position.y);

  targetCam.x = boxX;
  targetCam.y = threeY - 60;
  targetCam.z = CAM_Z_SHOW;
  currentCam.x = targetCam.x;
  currentCam.y = targetCam.y;
  currentCam.z = targetCam.z;

  currentRot = { x: 0.3, y: 0.5, z: currentRot.z + 0.8 };
  targetRot = { ...currentRot };

  trailParticles.visible = false;
  cube.visible = false;

  if (spacecraft) {
    spacecraft.visible = true;
    spacecraft.scale.setScalar(1);
    spacecraft.position.set(boxX, threeY, 0);
    spacecraft.rotation.set(currentRot.x, currentRot.y, currentRot.z);
  }
}

function enterDetail(lv) {
  // 如果是特殊检查按钮，进入检查模式
  if (lv.isInspectButton) {
    enterInspectMode("showcase");
    return;
  }

  currentLevelId.value = lv.id;
  currentLevel.value = lv;
  targetRot = { ...lv.rot };
  phase.value = "detail";
  detailShow.value = false;
  setTimeout(() => {
    detailShow.value = true;
  }, 50);
}

function nextLevel() {
  let idx = levels.findIndex((l) => l.id === currentLevelId.value);
  idx = (idx + 1) % levels.length;
  const lv = levels[idx];
  currentLevelId.value = lv.id;
  currentLevel.value = lv;
  targetRot = { ...lv.rot };
}

function backToGrid() {
  detailShow.value = false;
  phase.value = "showcase";
  currentLevelId.value = null;
  currentLevel.value = null;
  targetRot = { x: 0.3, y: 0.5, z: currentRot.z };
  const actualY = toThreeY(boxBody.position.y);
  const centerX = boxBody.position.x;
  if (spacecraft) {
    spacecraft.position.set(centerX, actualY, 0);
    spacecraft.scale.setScalar(1);
  }
  if (cube) cube.visible = false;
  targetCam.x = centerX;
  targetCam.y = actualY - 60;
  targetCam.z = CAM_Z_SHOW;
}

/* ================================
   【新增】跳转到关卡对应的子页面
   ================================ */
function goToMissionPage() {
  if (!currentLevel.value) return;
  const id = String(currentLevel.value.id).padStart(2, "0");
  router.push(`/about/${id}`);
}

function enterInspectMode(from) {
  if (!spacecraft || !controls) return;
  inspectFrom.value = from;
  preInspectState = {
    phase: phase.value,
    targetCam: { ...targetCam },
    targetRot: { ...targetRot },
    detailShow: detailShow.value,
    spacecraftScale: spacecraft.scale.x,
  };
  inspectMode.value = true;
  controls.enabled = true;
  controls.target.copy(spacecraft.position);
  const offset = new THREE.Vector3().subVectors(
    camera.position,
    spacecraft.position,
  );
  const dist = offset.length();
  if (dist < 100 || dist > 500) {
    const defaultOffset = new THREE.Vector3(150, 100, 300);
    camera.position.copy(spacecraft.position).add(defaultOffset);
  }
  controls.update();
  currentCam.x = camera.position.x;
  currentCam.y = camera.position.y;
  currentCam.z = camera.position.z;
  targetCam.x = camera.position.x;
  targetCam.y = camera.position.y;
  targetCam.z = camera.position.z;
}

function exitInspectMode() {
  if (!controls) return;
  inspectMode.value = false;
  controls.enabled = false;
  if (preInspectState) {
    targetCam.x = preInspectState.targetCam.x;
    targetCam.y = preInspectState.targetCam.y;
    targetCam.z = preInspectState.targetCam.z;
    targetRot.x = preInspectState.targetRot.x;
    targetRot.y = preInspectState.targetRot.y;
    targetRot.z = preInspectState.targetRot.z;
    detailShow.value = preInspectState.detailShow;
    currentCam.x = camera.position.x;
    currentCam.y = camera.position.y;
    currentCam.z = camera.position.z;
    preInspectState = null;
  }
}

function resetShot() {
  if (!boxBody || !world) return;
  inspectMode.value = false;
  inspectFrom.value = "showcase";
  showTransitionText.value = false;
  showFadeOverlay.value = false;
  preInspectState = null;
  if (controls) controls.enabled = false;
  isDragging.value = false;
  wasDragging = false;
  dragOffsetY = 0;
  detailShow.value = false;

  // 如果需要跳过发射阶段，直接进入展示模式
  if (shouldSkipAiming) {
    phase.value = "showcase";
    // 设置展示模式的初始状态
    Matter.Body.setPosition(boxBody, { x: SLING_X, y: BOUNDARY_Y - 50 });
    Matter.Body.setVelocity(boxBody, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(boxBody, 0);

    // 设置展示模式的相机和旋转
    currentRot = { x: 0.3, y: 0.5, z: 0.8 };
    targetRot = { ...currentRot };
    targetFov = FOV_SHOW;
    currentFov = FOV_SHOW;
    fovDirty = true;

    const boxX = SLING_X;
    const boxY = BOUNDARY_Y - 50;
    const threeY = toThreeY(boxY);
    targetCam = { x: boxX, y: threeY - 60, z: CAM_Z_SHOW };
    currentCam = { ...targetCam };

    // 隐藏立方体，显示航天器
    if (cube) cube.visible = false;
    if (spacecraft) {
      spacecraft.visible = true;
      spacecraft.scale.setScalar(1);
      spacecraft.position.set(boxX, threeY, 0);
      spacecraft.rotation.set(currentRot.x, currentRot.y, currentRot.z);
    }
    if (trailParticles) trailParticles.visible = false;

    // 设置黑色背景
    renderer.setClearColor(new THREE.Color(0, 0, 0)); // 纯黑色
    lastBgGray = 0; // 标记为展示模式背景，避免 animate 中被覆盖
    return;
  }

  // 默认：进入发射阶段
  phase.value = "aiming";
  Matter.Body.setPosition(boxBody, { x: SLING_X, y: BOX_START_Y });
  Matter.Body.setVelocity(boxBody, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(boxBody, 0);
  Matter.Body.setAngle(boxBody, 0);
  targetCam = { x: SLING_X, y: 0, z: CAM_Z_AIM };
  currentCam = { x: SLING_X, y: 0, z: CAM_Z_AIM };
  targetRot = { x: 0, y: 0, z: 0 };
  targetFov = FOV_AIM;
  currentFov = FOV_AIM;
  fovDirty = true;
  if (cube) {
    cube.position.set(SLING_X, toThreeY(BOX_START_Y), 0);
    cube.rotation.set(0, 0, 0);
    cube.material.opacity = LINE_OPACITY;
    cube.scale.setScalar(1);
    cube.visible = true;
  }
  if (hitMesh) hitMesh.position.copy(cube.position);
  if (spacecraft) {
    spacecraft.visible = false;
    spacecraft.position.set(SLING_X, toThreeY(BOX_START_Y), 0);
    spacecraft.rotation.set(0, 0, 0);
    spacecraft.scale.setScalar(1);
  }
  currentRot = { x: 0, y: 0, z: 0 };
  if (trailParticles) trailParticles.visible = false;
  if (trailParticles) {
    const pos = trailParticles.geometry.attributes.position.array;
    for (let i = 0; i < pos.length; i++) pos[i] = 0;
    trailParticles.geometry.attributes.position.needsUpdate = true;
  }
  lastBgGray = -1;
  lastTriggerOpacity = -1;
  if (renderer) renderer.setClearColor(new THREE.Color(1, 1, 1));
}

function animate(time) {
  if (!isPageActive) return;
  rafId = requestAnimationFrame(animate);
  if (!isPageVisible) return;

  // 使用固定时间步长减少帧率波动影响
  const delta = Math.min(time - lastTime, 50);
  lastTime = time;
  const tNorm = delta / FIXED_DELTA; // 标准化时间增量

  const currentPhase = phase.value;

  // 状态切换缓冲：跳过状态切换后几帧的复杂计算
  if (phaseSwitchBuffer > 0) {
    phaseSwitchBuffer--;
  }

  if (currentPhase === "flying") {
    physicsAccumulator += delta;
    while (physicsAccumulator >= PHYSICS_STEP) {
      Matter.Engine.update(engine, PHYSICS_STEP);
      physicsAccumulator -= PHYSICS_STEP;
    }
  } else {
    physicsAccumulator = 0;
  }

  let bgGray;
  if (currentPhase === "aiming") {
    bgGray = 1;
  } else if (currentPhase === "flying") {
    const flyProgress = Math.max(
      0,
      Math.min(1, (SLING_Y - boxBody.position.y) / (SLING_Y - BOUNDARY_Y)),
    );
    bgGray = 1 - flyProgress;
  } else {
    bgGray = 0;
  }
  if (bgGray !== lastBgGray) {
    if (bgGray === 0) {
      // 展示/详情模式：使用纯黑色背景
      renderer.setClearColor(new THREE.Color(0, 0, 0));
    } else {
      // 发射/飞行阶段：使用灰度渐变
      _color.setScalar(bgGray);
      renderer.setClearColor(_color);
    }
    lastBgGray = bgGray;
  }

  const triggerOpacity = 0;
  if (triggerOpacity !== lastTriggerOpacity) {
    triggerZone.material.opacity = triggerOpacity;
    lastTriggerOpacity = triggerOpacity;
  }

  const alpha =
    currentPhase === "flying" ? physicsAccumulator / PHYSICS_STEP : 0;
  const boxX = boxBody.position.x + boxBody.velocity.x * alpha;
  const boxY = boxBody.position.y + boxBody.velocity.y * alpha;
  const threeY = toThreeY(boxY);
  const boxAngle = boxBody.angle + boxBody.angularVelocity * alpha;
  const boxVelY = boxBody.velocity.y;

  if (currentPhase === "aiming") {
    if (isDragging.value) {
      const pullY = Math.min(dragOffsetY, maxDragPx);
      const visualY = toThreeY(ANCHOR_Y) - pullY;
      cube.position.set(SLING_X, visualY, 0);
      hitMesh.position.copy(cube.position);
      cube.rotation.y = pullY * 0.012;
      cube.rotation.x = pullY * 0.008;
      Matter.Body.setPosition(boxBody, { x: SLING_X, y: ANCHOR_Y + pullY });
      Matter.Body.setVelocity(boxBody, { x: 0, y: 0 });
      targetCam.y = visualY - 180;
      targetCam.x = SLING_X;
      targetCam.z = CAM_Z_AIM;
    } else {
      Matter.Body.setPosition(boxBody, { x: SLING_X, y: BOX_START_Y });
      Matter.Body.setVelocity(boxBody, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(boxBody, 0);
      Matter.Body.setAngle(boxBody, 0);
      cube.position.set(SLING_X, toThreeY(BOX_START_Y), 0);
      cube.rotation.set(0, 0, 0);
      hitMesh.position.copy(cube.position);
      targetCam.y = toThreeY(BOX_START_Y);
      targetCam.x = SLING_X;
      targetCam.z = CAM_Z_AIM;
    }
    if (!cube.visible) cube.visible = true;
    if (spacecraft) spacecraft.visible = false;
  } else if (currentPhase === "flying") {
    cube.position.set(boxX, threeY, 0);
    cube.rotation.z = boxAngle;
    hitMesh.position.copy(cube.position);
    targetCam.y = threeY - 180;
    targetCam.x = SLING_X + (boxX - SLING_X) * 0.3;
    targetCam.z = CAM_Z_AIM;
    if (boxBody.position.y > SLING_Y - 80 && boxVelY > 0.5) {
      resetShot();
      return;
    }
    if (boxBody.position.y < BOUNDARY_Y) beginTransition();
    if (!cube.visible) cube.visible = true;
    if (spacecraft) spacecraft.visible = false;
  } else if (currentPhase === "transition") {
    transitionTime += delta;
    let t = Math.min(transitionTime / TRANSITION_DURATION, 1);
    t = easeSmooth(t);

    // 使用目标旋转进行插值
    const rotX = currentRot.x + (targetRot.x - currentRot.x) * t;
    const rotY = currentRot.y + (targetRot.y - currentRot.y) * t;
    const rotZ = currentRot.z + (targetRot.z - currentRot.z) * t;

    // ========== 过渡阶段第一部分：快速黑屏遮挡（0% - 20%时间）==========
    if (t <= 0.2) {
      // 立方体快速消失
      cube.position.set(boxX, threeY, 0);
      cube.rotation.set(rotX, rotY, rotZ);
      cube.material.opacity = LINE_OPACITY * Math.max(0, 1 - t * 6);
      if (t > 0.15) cube.visible = false;

      // 背景快速变黑（遮挡画面）
      const bgProgress = t / 0.2;
      _color.setScalar(1 - bgProgress);
      renderer.setClearColor(_color);
      lastBgGray = 1 - bgProgress;

      // 文字开始淡入
      if (t > 0.1) {
        showTransitionText.value = true;
      }
    } else {
      cube.visible = false;
    }

    // ========== 过渡阶段第二部分：黑屏保持 + 文字显示 + 航天器渐显（20% - 60%时间）==========
    if (t > 0.2 && t <= 0.6) {
      // 保持黑屏状态
      if (lastBgGray !== 0) {
        _color.setScalar(0);
        renderer.setClearColor(_color);
        lastBgGray = 0;
      }

      // 文字保持显示
      showTransitionText.value = true;

      // 航天器在黑屏遮挡下逐渐显现
      if (spacecraft) {
        spacecraft.visible = true;
        spacecraft.position.set(boxX, threeY, 0);
        spacecraft.rotation.set(rotX, rotY, rotZ);

        // 从20%开始到60%完成（40%的时间范围内完成缩放）
        const scaleT = Math.max(0, Math.min(1, (t - 0.2) / 0.4));
        const s = 0.1 + 0.9 * easeSmooth(scaleT);
        spacecraft.scale.setScalar(s);
      }
    }

    // ========== 过渡阶段第三部分：背景渐亮 + 文字淡出 + 航天器完成显现（60% - 100%时间）==========
    if (t > 0.6) {
      // 背景从黑色渐亮到深空色
      const fadeT = (t - 0.6) / 0.4;
      const bgAlpha = fadeT * 0.05;
      _color.setRGB(bgAlpha, bgAlpha, bgAlpha * 1.2);
      renderer.setClearColor(_color);
      lastBgGray = -1;

      // 文字逐渐淡出
      if (t > 0.8) {
        showTransitionText.value = false;
      }

      // 航天器完成缩放并稳定
      if (spacecraft) {
        spacecraft.visible = true;
        spacecraft.position.set(boxX, threeY, 0);
        spacecraft.rotation.set(rotX, rotY, rotZ);

        // 最终缩放完成
        const finalT = Math.max(0, Math.min(1, (t - 0.6) / 0.2));
        const s = 0.95 + 0.05 * easeSmooth(finalT);
        spacecraft.scale.setScalar(s);
      }
    }

    // 相机平滑移动（全程）
    const targetCamX = boxX;
    const targetCamY = threeY - 60;
    const targetCamZ = CAM_Z_SHOW;

    // 分段相机速度：前期慢，后期快
    let camSpeed;
    if (t < 0.3) camSpeed = 0.03;
    else if (t < 0.7) camSpeed = 0.06;
    else camSpeed = 0.1;

    currentCam.x += (targetCamX - currentCam.x) * camSpeed;
    currentCam.y += (targetCamY - currentCam.y) * camSpeed;
    currentCam.z += (targetCamZ - currentCam.z) * camSpeed;

    // FOV平滑调整 - 增大阈值减少更新频率
    const newFov = currentFov + (targetFov - currentFov) * 0.03;
    if (Math.abs(newFov - currentFov) > 0.2) {
      currentFov = newFov;
      camera.fov = currentFov;
      fovDirty = true;
    }

    // 拖尾粒子效果 - 减少更新频率（每50ms更新一次）
    if (time - lastTrailUpdate > 50) {
      const trailPos = trailParticles.geometry.attributes.position.array;
      const idx = Math.floor(t * 79) * 3;
      trailPos[idx] = boxX + (Math.random() - 0.5) * 20;
      trailPos[idx + 1] = threeY + (Math.random() - 0.5) * 20;
      trailPos[idx + 2] = (Math.random() - 0.5) * 20;
      trailParticles.geometry.attributes.position.needsUpdate = true;
      lastTrailUpdate = time;
    }

    // 过渡完成
    if (transitionTime >= TRANSITION_DURATION) {
      phase.value = "showcase";
      showTransitionText.value = false;
      currentFov = FOV_SHOW;
      camera.fov = currentFov;
      fovDirty = true;
      targetCam.x = boxX;
      targetCam.y = threeY - 60;
      targetCam.z = CAM_Z_SHOW;
      currentCam.x = targetCam.x;
      currentCam.y = targetCam.y;
      currentCam.z = targetCam.z;
      currentRot = { x: 0.3, y: 0.5, z: targetRot.z };
      targetRot = { ...currentRot };
      trailParticles.visible = false;
      cube.visible = false;
      if (spacecraft) {
        spacecraft.visible = true;
        spacecraft.scale.setScalar(1);
      }
      // 确保背景是深空色
      _color.setRGB(0.05, 0.05, 0.06);
      renderer.setClearColor(_color);
    }
  } else if (currentPhase === "showcase") {
    const actualY = threeY;
    const targetX = boxX;
    if (cube.visible) cube.visible = false;
    if (spacecraft) {
      if (!spacecraft.visible) spacecraft.visible = true;
      spacecraft.position.x += (targetX - spacecraft.position.x) * 0.08;
      spacecraft.position.y = actualY;
      spacecraft.position.z = 0;
      const showcaseScale = 1;
      const newScale =
        spacecraft.scale.x + (showcaseScale - spacecraft.scale.x) * 0.08;
      spacecraft.scale.setScalar(newScale);
      currentRot.x += (targetRot.x - currentRot.x) * 0.06;
      currentRot.y += (targetRot.y - currentRot.y) * 0.06;
      currentRot.z += (targetRot.z - currentRot.z) * 0.06;
      spacecraft.rotation.set(currentRot.x, currentRot.y, currentRot.z);
    }
    // 使用RAF时间参数替代Date.now()，性能更好
    const breathZ = CAM_Z_SHOW + Math.sin(time * 0.001) * 25;
    const breathY = actualY - 60 + Math.sin(time * 0.0013) * 10;
    targetCam.x = boxX;
    targetCam.y = breathY;
    targetCam.z = breathZ;
  } else if (currentPhase === "detail") {
    const actualY = threeY;
    const detailX = SLING_X - 220;
    if (cube.visible) cube.visible = false;
    if (spacecraft) {
      if (!spacecraft.visible) spacecraft.visible = true;
      spacecraft.position.x += (detailX - spacecraft.position.x) * 0.06;
      spacecraft.position.y = actualY;
      spacecraft.position.z = 0;
      const detailScale = 1.6;
      const newScale =
        spacecraft.scale.x + (detailScale - spacecraft.scale.x) * 0.06;
      spacecraft.scale.setScalar(newScale);
      currentRot.x += (targetRot.x - currentRot.x) * 0.06;
      currentRot.y += (targetRot.y - currentRot.y) * 0.06;
      currentRot.z += (targetRot.z - currentRot.z) * 0.06;
      spacecraft.rotation.set(currentRot.x, currentRot.y, currentRot.z);
    }
    targetCam.x = detailX;
    targetCam.y = actualY - 40;
    targetCam.z = CAM_Z_SHOW - 120;
  }

  if (stars) {
    if (inspectMode.value) {
      stars.rotation.y += 0.00005;
    } else if (spacecraft && spacecraft.visible) {
      stars.rotation.y = spacecraft.rotation.y * 0.15 + stars.rotation.y * 0.98;
      stars.rotation.x = spacecraft.rotation.x * 0.05 + stars.rotation.x * 0.99;
    }
  }

  if (inspectMode.value && controls) {
    controls.update();
    currentCam.x = camera.position.x;
    currentCam.y = camera.position.y;
    currentCam.z = camera.position.z;
  } else {
    if (currentPhase !== "transition") {
      currentCam.x += (targetCam.x - currentCam.x) * 0.12;
      currentCam.y += (targetCam.y - currentCam.y) * 0.12;
      currentCam.z += (targetCam.z - currentCam.z) * 0.12;
    }
    camera.position.set(currentCam.x, currentCam.y, currentCam.z);
    if (fovDirty) {
      camera.updateProjectionMatrix();
      fovDirty = false;
    }
    const lookTargetY =
      currentPhase === "aiming" || currentPhase === "flying"
        ? currentCam.y + 180
        : spacecraft
          ? spacecraft.position.y
          : cube.position.y;
    const lookTargetX =
      currentPhase === "detail"
        ? spacecraft
          ? spacecraft.position.x
          : SLING_X
        : SLING_X;
    const currentLookY = cube.userData.lookY || lookTargetY;
    const newLookY = currentLookY + (lookTargetY - currentLookY) * 0.2;
    cube.userData.lookY = newLookY;
    _target.set(lookTargetX, newLookY, 0);
    camera.lookAt(_target);
  }

  renderer.render(scene, camera);
}

function onResize() {
  const W = window.innerWidth;
  const H = window.innerHeight;
  if (camera) {
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }
  if (renderer) renderer.setSize(W, H, false);
  maxDragPx = Math.min(H * MAX_DRAG_RATIO, 350);
}

function disposeScene() {
  if (!scene) return;
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
    }
  });
  if (renderer) {
    renderer.dispose();
    const gl = renderer.getContext();
    const loseExt = gl?.getExtension("WEBGL_lose_context");
    if (loseExt) loseExt.loseContext();
  }
}

let timeInterval = null;
let distInterval = null;

// ESC键返回逻辑 - 当前页面优先处理
function handleKeyDown(e) {
  if (e.key === "Escape") {
    // 阻止事件继续传播和默认行为
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // 检查模式：按ESC返回关卡界面
    if (inspectMode.value) {
      exitInspectMode();
      return;
    }

    // 发射阶段（aiming）：按ESC直接跳过到达展示模式
    if (phase.value === "aiming") {
      enterShowcaseDirectly();
    }
    // 飞行阶段（flying）：按ESC直接跳过到达展示模式
    else if (phase.value === "flying") {
      enterShowcaseDirectly();
    }
    // 过渡阶段（transition）：按ESC跳过过渡直接进入展示模式
    else if (phase.value === "transition") {
      enterShowcase();
    }
    // 展示模式（showcase）：按ESC返回home主页（使用loading过渡）
    else if (phase.value === "showcase") {
      goToHomeWithLoading();
    }
    // 详情模式（detail）：按ESC返回展示模式
    else if (phase.value === "detail") {
      backToGrid();
    }
  }
}

/**
 * 直接进入展示模式（跳过发射阶段的快捷方式）
 * 使用平滑过渡动画，让用户体验更流畅
 */
function enterShowcaseDirectly() {
  // 立即停止物理模拟
  if (boxBody) {
    Matter.Body.setVelocity(boxBody, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(boxBody, 0);
    // 将物体移动到展示位置
    Matter.Body.setPosition(boxBody, { x: SLING_X, y: BOUNDARY_Y - 50 });
  }

  // 立即进入transition阶段，但使用更短的过渡时间
  phase.value = "transition";
  transitionTime = TRANSITION_DURATION * 0.3; // 从30%开始，快速完成
  phaseSwitchBuffer = 2;

  // 设置初始状态
  const boxX = SLING_X;
  const boxY = BOUNDARY_Y - 50;
  const threeY = toThreeY(boxY);

  currentRot = { x: 0.15, y: 0.25, z: 0.4 };
  targetRot = { x: 0.3, y: 0.5, z: 0.8 };
  targetFov = FOV_SHOW;
  fovDirty = true;

  // 显示过渡文字
  showTransitionText.value = true;

  // 设置相机目标位置
  targetCam.x = boxX;
  targetCam.y = threeY - 60;
  targetCam.z = CAM_Z_SHOW;
  currentCam.x = camera.position.x;
  currentCam.y = camera.position.y;
  currentCam.z = camera.position.z;

  // 立即设置背景为深空色
  _color.setRGB(0.02, 0.02, 0.03);
  renderer.setClearColor(_color);
  lastBgGray = -1;
}

// 返回首页
function goToHomeWithLoading() {
  showFadeOverlay.value = true;
  setTimeout(() => {
    localStorage.setItem("homeScrollPosition", String(window.scrollY));
    router.push("/");
  }, 500);
}

onMounted(async () => {
  try {
    // 主题音乐模式：不需要从 sessionStorage 恢复，主题音乐会保持播放
    console.log("[About Page] 主题音乐模式，音乐由 audioManager 管理");

    /* ========== 【新增】暴力清理残留遮罩 ========== */
    const killOverlays = () => {
      document
        .querySelectorAll(
          ".global-white-mask, .transition-mask, .page-loader, .white-fade-enter-active, .white-fade-leave-active, .white-fade-enter-from, .white-fade-leave-to, .loading-screen",
        )
        .forEach((el) => el.remove());

      document.querySelectorAll("body > *").forEach((el) => {
        const tag = el.tagName.toLowerCase();
        if (["script", "style", "meta", "link", "noscript"].includes(tag))
          return;

        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const isFixed =
          style.position === "fixed" || style.position === "absolute";
        const isFullScreen =
          rect.width >= window.innerWidth * 0.9 &&
          rect.height >= window.innerHeight * 0.9;
        const isHighZIndex =
          parseInt(style.zIndex) > 100 ||
          style.zIndex === "9999" ||
          style.zIndex === "99999";

        if (isFixed && isFullScreen && isHighZIndex) {
          console.warn("[About] 移除全屏遮罩:", el.className || tag);
          el.remove();
        }
      });

      document.body.style.background = "";
      document.body.style.overflow = "";
      document.documentElement.style.background = "";
      document.documentElement.style.overflow = "";
    };

    killOverlays();
    [50, 100, 300, 500, 1000].forEach((d) => setTimeout(killOverlays, d));

    // 2. 在初始化之前就检查是否需要跳过发射阶段
    const skipAiming = sessionStorage.getItem("skipAiming");
    const mode = /** @type {string|undefined} */ (route.query.mode);

    // 设置跳过标志
    shouldSkipAiming = skipAiming === "true" || mode === "showcase";
    if (shouldSkipAiming) {
      sessionStorage.removeItem("skipAiming");
    }

    initScene();

    updateTimeData();
    timeInterval = setInterval(updateTimeData, 1000);
    distInterval = setInterval(() => {
      distanceKm.value += 17;
    }, 1000);
    // 添加ESC键监听
    window.addEventListener("keydown", handleKeyDown);

    // 如果需要跳过发射阶段，轮询等待 FBX 模型加载完成后再进入展示模式
    if (shouldSkipAiming) {
      const waitForModelReady = () => {
        if (cubeReady.value) {
          console.log("[About] FBX 模型就绪，进入展示模式");
          enterShowcaseFromSubpage();
        } else {
          setTimeout(waitForModelReady, 150);
        }
      };
      waitForModelReady();
    }
  } catch (error) {
    console.error("About page initialization failed:", error);
  }
});

// 从子页面返回时进入展示模式的特殊处理
function enterShowcaseFromSubpage() {
  // 确保所有状态正确初始化
  phase.value = "showcase";
  showTransitionText.value = false;
  showFadeOverlay.value = false;

  // 设置相机位置和状态
  currentFov = FOV_SHOW;
  camera.fov = currentFov;
  camera.updateProjectionMatrix();

  // 设置航天器状态
  const boxX = boxBody.position.x || SLING_X;
  const boxY = boxBody.position.y || BOX_START_Y;
  const threeY = toThreeY(boxY);

  targetCam.x = boxX;
  targetCam.y = threeY - 60;
  targetCam.z = CAM_Z_SHOW;
  currentCam.x = targetCam.x;
  currentCam.y = targetCam.y;
  currentCam.z = targetCam.z;

  // 设置旋转
  currentRot = { x: 0.3, y: 0.5, z: 0.8 };
  targetRot = { ...currentRot };

  // 设置航天器可见并缩放至正常大小
  if (spacecraft) {
    spacecraft.visible = true;
    spacecraft.scale.setScalar(1);
    spacecraft.position.set(boxX, threeY, 0);
    spacecraft.rotation.set(currentRot.x, currentRot.y, currentRot.z);
  }

  // 隐藏立方体和拖尾粒子
  if (cube) cube.visible = false;
  if (trailParticles) trailParticles.visible = false;

  // 设置黑色背景
  renderer.setClearColor(new THREE.Color(0, 0, 0)); // 纯黑色
  lastBgGray = 0; // 同步更新，避免渲染循环覆盖
}

onDeactivated(() => {
  console.log("[About] 组件被缓存（离开），暂停渲染");
  isPageActive = false;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
});

onActivated(() => {
  console.log("[About] 组件被激活（返回），恢复渲染");
  isPageActive = true;
  if (!rafId) {
    rafId = requestAnimationFrame(animate);
  }
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  clearTimeout(resizeTimeout);
  if (timeInterval) clearInterval(timeInterval);
  if (distInterval) clearInterval(distInterval);
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
  }
  window.removeEventListener("resize", debouncedResize);
  window.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  if (engine) Matter.Engine.clear(engine);
  if (controls) {
    controls.dispose();
    controls = null;
  }
  disposeScene();

  /* 【新增】组件卸载时，手动清理所有残留遮罩 */
  console.log("[About] 组件卸载，清理遮罩");
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
.cosmic-game {
  --space-black: #050508;
  --panel-bg: rgba(8, 10, 18, 0.9);
  --panel-border: rgba(0, 255, 200, 0.18);
  --text-primary: #f0f4f8;
  --text-secondary: #a0b8d0;
  --text-dim: #7a90a8;
  --accent-cyan: #00ffff;
  --accent-green: #ffffff;
  --accent-blue: #8ac4ff;
  --font-mono: "Courier New", "SF Mono", "Consolas", monospace;
  --font-sans:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --transition-smooth: cubic-bezier(0.22, 1, 0.36, 1);

  position: relative;
  width: 100%;
  height: 100vh;
  font-family: var(--font-mono);
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  background: var(--space-black);
}

.loading-text {
  color: #00ffc8;
  font-size: 14px;
  letter-spacing: 3px;
}

.bg-canvas.is-visible {
  opacity: 1;
}

.bg-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  opacity: 1;
  height: 100%;
  display: block;
  cursor: grab;
  z-index: 1;
  touch-action: none;
}
.bg-canvas.dragging,
.bg-canvas:active {
  cursor: ns-resize;
}

.game-ui {
  position: absolute;
  inset: 0;
  z-index: 10;
  opacity: 1;
  transition: opacity 0.6s ease;
  pointer-events: none;
}
.game-ui.hidden {
  opacity: 0;
  pointer-events: none;
}
.game-ui > * {
  pointer-events: auto;
}

.inspect-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 420px;
  height: 100%;
  z-index: 50;
  box-sizing: border-box;
  background: var(--panel-bg);
  backdrop-filter: blur(24px) saturate(1.2);
  -webkit-backdrop-filter: blur(24px) saturate(1.2);
  border-right: 1px solid var(--panel-border);
  opacity: 0;
  transform: translateX(-60px);
  transition: all 0.7s var(--transition-smooth);
  pointer-events: none;
}
.inspect-panel.show {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}
.panel-content {
  height: 100%;
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.badge-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
.badge {
  font-size: 9px;
  letter-spacing: 2px;
  padding: 4px 10px;
  border-radius: 2px;
}
.badge.nasa {
  background: linear-gradient(135deg, #003366, #0066aa);
  color: #fff;
  font-weight: bold;
}
.badge.mission {
  color: var(--accent-blue);
  border: 1px solid rgba(106, 176, 255, 0.25);
}

.deco-line {
  height: 1px;
  background: linear-gradient(90deg, var(--accent-cyan), transparent);
  opacity: 0.4;
  margin: 16px 0;
}

.panel-title {
  margin-top: 8px;
}
.panel-title h1 {
  font-size: 44px;
  font-weight: 300;
  margin: 0 0 10px 0;
  letter-spacing: 8px;
  line-height: 1;
  color: var(--text-primary);
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.08);
}
.panel-title p {
  font-size: 12px;
  letter-spacing: 7px;
  margin: 0;
  color: var(--accent-blue);
}

.data-block {
  margin: 8px 0;
}
.data-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
  line-height: 1.5;
}
.data-num {
  color: var(--accent-cyan);
  font-size: 18px;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
  min-width: 140px;
}
.data-unit {
  color: var(--accent-blue);
  font-size: 10px;
  letter-spacing: 1px;
}
.data-label {
  color: var(--text-dim);
  font-size: 11px;
  letter-spacing: 1.5px;
}

.desc-block {
  margin: 8px 0;
}
.desc-block p {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.75;
  margin: 0;
  font-family: var(--font-sans);
  opacity: 0.95;
}

.status-block {
  margin: 8px 0;
}
.status-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}
.s-key {
  color: var(--text-dim);
  font-size: 11px;
  letter-spacing: 2px;
  min-width: 80px;
}
.s-val {
  color: var(--text-primary);
  font-size: 12px;
  letter-spacing: 1.5px;
}
.s-val.highlight {
  color: var(--accent-green);
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}
.blink-dot {
  width: 6px;
  height: 6px;
  background: var(--accent-green);
  border-radius: 50%;
  animation: blink 1.2s infinite;
}

.panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(100, 150, 200, 0.15);
}
.ft-label {
  color: var(--text-secondary);
  font-size: 10px;
  letter-spacing: 2px;
}
.ft-time {
  color: var(--accent-cyan);
  font-size: 13px;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
}
.ft-hint {
  color: var(--text-dim);
  font-size: 9px;
  letter-spacing: 1px;
  opacity: 0.6;
}

.global-back-btn {
  position: absolute;
  top: 28px;
  right: 28px;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 22px;
  background: rgba(8, 10, 18, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 2px;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  animation: fadeInDown 0.5s ease 0.3s both;
}
.global-back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 0 20px rgba(0, 255, 200, 0.08);
}

.wave-background {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  z-index: 2;
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.wave-background.hidden {
  opacity: 0;
}

.enter-hint {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
  z-index: 1001;
  animation: hintPulse 2.5s ease-in-out infinite;
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.enter-hint.exit {
  opacity: 0;
  transform: translateX(-50%) translateY(15px);
}
.enter-hint p {
  margin: 0;
  font-family: var(--font-mono);
  letter-spacing: 6px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 16px;
}
.enter-hint .sub {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
  letter-spacing: 3px;
  margin-top: 10px;
  font-family: var(--font-sans);
}

/* 主题艺术字 */
.launch-title {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
  z-index: 1000;
  opacity: 1;
  transition: opacity 0.1s ease;
}
.launch-title.exit {
  opacity: 0;
}
.title-main {
  display: block;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  letter-spacing: 0.15em;
  font-family: "Oswald", "Impact", sans-serif;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.title-sub {
  display: block;
  font-size: clamp(0.875rem, 2.5vw, 1.25rem);
  letter-spacing: 0.3em;
  font-family: var(--font-mono);
  font-weight: 300;
}

/* 发射阶段 - 黑色文字 */
.launch-title.phase-aiming .title-main {
  color: #000000;
  text-shadow:
    0 1px 0 #000000,
    0 2px 0 #000000;
}
.launch-title.phase-aiming .title-sub {
  color: #333333;
  opacity: 0.9;
}

/* 展示阶段 - 白色文字 */
.launch-title.phase-showcase .title-main {
  color: #ffffff;
  text-shadow:
    0 1px 0 #ffffff,
    0 2px 0 #ffffff;
}
.launch-title.phase-showcase .title-sub {
  color: #ffffff;
  opacity: 0.8;
}

.break-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.8s ease;
}
.break-text.show {
  opacity: 1;
}
.break-text span {
  color: #ffffff;
  font-size: 32px;
  letter-spacing: 14px;
  font-weight: 300;
  text-shadow: 0 0 40px rgba(0, 255, 255, 0.15);
  animation: breakPulse 2s ease-in-out infinite;
}

.showcase-ui {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}
.showcase-ui > * {
  pointer-events: auto;
}

.levels-grid {
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%) translateY(30px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 12px;
  padding: 0 20px;
  opacity: 0;
  transition: all 0.7s var(--transition-smooth) 0.4s;
  max-width: 720px;
  width: 100%;
}
.levels-grid.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.level-btn {
  width: 140px;
  padding: 18px 0;
  background: rgba(8, 10, 18, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(12px);
  border-radius: 6px;
}
.level-btn:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
}
.level-btn.active {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}
.level-btn.special {
  border-color: rgba(255, 165, 0, 0.4);
  background: rgba(255, 165, 0, 0.06);
}

/* ========== 航天器图标按钮 - 独立样式（与其他按钮尺寸统一） ========== */
.level-btn.special.inspect-card {
  /* 保持与其他按钮相同的尺寸和位置 */
  width: 140px;
  padding: 18px 0;
  border: 1px solid rgba(106, 176, 255, 0.35);
  background: linear-gradient(
    135deg,
    rgba(106, 176, 255, 0.08) 0%,
    rgba(8, 10, 18, 0.8) 100%
  );
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  grid-column: auto; /* 确保不跨列，按正常网格排列 */
}

.level-btn.special.inspect-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(106, 176, 255, 0.15) 50%,
    transparent 100%
  );
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.level-btn.special.inspect-card .lv-icon {
  width: 44px;
  height: 38px;
  filter: drop-shadow(0 0 10px rgba(106, 176, 255, 0.6));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.level-btn.special.inspect-card .lv-name {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #6ab0ff;
  text-shadow: 0 0 15px rgba(106, 176, 255, 0.5);
}

.level-btn.special.inspect-card:hover {
  border-color: rgba(106, 176, 255, 0.75);
  background: linear-gradient(
    135deg,
    rgba(106, 176, 255, 0.15) 0%,
    rgba(8, 10, 18, 0.85) 100%
  );
  box-shadow:
    0 0 25px rgba(106, 176, 255, 0.25),
    inset 0 0 25px rgba(106, 176, 255, 0.05);
  transform: translateY(-4px);
}

.level-btn.special.inspect-card:hover .lv-icon {
  filter: drop-shadow(0 0 18px rgba(106, 176, 255, 0.8));
  animation: float 2s ease-in-out infinite;
}

.level-btn.special.inspect-card:active {
  transform: translateY(0);
}
.level-btn.glowing {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 0 15px rgba(255, 255, 255, 0.2),
    0 0 30px rgba(255, 255, 255, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.05);
  animation: glowPulse 2s ease-in-out infinite;
}
@keyframes glowPulse {
  0%,
  100% {
    box-shadow:
      0 0 15px rgba(255, 255, 255, 0.2),
      0 0 30px rgba(255, 255, 255, 0.1),
      inset 0 0 20px rgba(255, 255, 255, 0.05);
  }
  50% {
    box-shadow:
      0 0 25px rgba(255, 255, 255, 0.3),
      0 0 50px rgba(255, 255, 255, 0.15),
      inset 0 0 30px rgba(255, 255, 255, 0.08);
  }
}
.level-btn.special .lv-num {
  color: #ffaa00;
}

/* INSPECT 特殊按钮 - 4*1比例 */
.level-btn.inspect-card {
  grid-column: span 4;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  border-color: rgba(106, 176, 255, 0.35);
  background: rgba(106, 176, 255, 0.05);
}
.level-btn.inspect-card:hover {
  border-color: rgba(106, 176, 255, 0.65);
  background: rgba(106, 176, 255, 0.1);
  box-shadow: 0 0 30px rgba(106, 176, 255, 0.2);
}
.inspect-icon {
  font-size: 16px;
  color: var(--accent-blue);
  font-weight: 300;
  letter-spacing: 0;
}
.inspect-title {
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--text-primary);
  font-weight: 500;
}

.lv-num {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}
.lv-name {
  font-size: 10px;
  letter-spacing: 2px;
  opacity: 0.7;
  text-transform: uppercase;
}
.lv-badge {
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 9px;
  color: #ffaa00;
  opacity: 0.9;
  letter-spacing: 1.5px;
  font-weight: 700;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 28px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.action-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.06),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}
.action-btn:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}
.action-btn:hover::before {
  transform: translateX(100%);
}
.action-btn.secondary {
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}
.action-btn.secondary:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--text-primary);
}

/* 【新增】高亮按钮样式 */
.action-btn.highlight {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.06);
}
.action-btn.highlight:hover {
  border-color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}

.inspect-main {
  position: absolute;
  bottom: 170px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
.inspect-main .btn-line {
  display: block;
  width: 24px;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  transition:
    width 0.3s ease,
    background 0.3s ease;
}
.inspect-main:hover .btn-line {
  width: 40px;
  background: rgba(0, 255, 200, 0.5);
}

.detail-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 380px;
  height: 100%;
  z-index: 10;
  pointer-events: auto;
  display: flex;
  align-items: center;
  padding: 40px;
  transform: translateX(100%);
  transition: transform 0.7s var(--transition-smooth);
}
.detail-panel.show {
  transform: translateX(0);
}
.detail-inner {
  width: 100%;
  background: var(--panel-bg);
  backdrop-filter: blur(24px) saturate(1.2);
  -webkit-backdrop-filter: blur(24px) saturate(1.2);
  border: 1px solid var(--panel-border);
  padding: 36px;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.5);
}

.detail-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.detail-num {
  color: rgba(255, 255, 255, 0.15);
  font-size: 56px;
  font-weight: bold;
  line-height: 1;
  letter-spacing: 2px;
}

.detail-name {
  color: var(--text-primary);
  font-size: 22px;
  margin: 8px 0 0 0;
  letter-spacing: 4px;
  font-weight: 400;
}

.detail-desc {
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.8;
  margin: 20px 0 28px;
  font-family: var(--font-sans);
}

.detail-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.detail-actions .action-btn {
  flex: 1;
  padding: 10px 0;
  font-size: 10px;
  min-width: 70px;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--text-primary);
  box-shadow: 0 0 10px var(--text-primary);
  animation: pulse 2s infinite;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 2px;
}
.live-badge.small {
  font-size: 10px;
}

@keyframes hintPulse {
  0%,
  100% {
    opacity: 0.5;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-6px);
  }
}
@keyframes breakPulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.85);
  }
}
@keyframes blink {
  0%,
  45% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0.15;
  }
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .inspect-panel {
    width: 340px;
  }
  .panel-content {
    padding: 28px;
  }
  .panel-title h1 {
    font-size: 36px;
  }
  .detail-panel {
    width: 320px;
    padding: 28px;
  }
}

@media (max-width: 768px) {
  .inspect-panel {
    width: 100%;
    background: rgba(5, 5, 10, 0.95);
    border-right: none;
  }
  .panel-content {
    padding: 24px;
  }
  .panel-title h1 {
    font-size: 30px;
  }
  .data-num {
    font-size: 16px;
    min-width: 120px;
  }
  .levels-grid {
    grid-template-columns: repeat(2, 1fr);
    bottom: 20px;
  }
  .level-btn {
    width: 110px;
    padding: 12px 0;
  }
  .detail-panel {
    width: 100vw;
    padding: 20px;
  }
  .inspect-main {
    bottom: 150px;
    padding: 10px 20px;
    font-size: 10px;
  }
  .break-text span {
    font-size: 22px;
    letter-spacing: 8px;
  }
  .detail-actions .action-btn {
    min-width: 60px;
  }
}

/* 淡入黑色背景覆盖层 */
.fade-overlay {
  position: fixed;
  inset: 0;
  background: #000000;
  opacity: 0;
  pointer-events: none;
  z-index: 9999;
  transition: opacity 0.5s ease;
}
.fade-overlay.show {
  opacity: 1;
}
</style>
