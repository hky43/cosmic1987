<template>
  <div
    class="helmet-dropper"
    :class="{ 'is-dropping': dropping }"
    ref="wrapRef"
  >
    <div class="canvas-box" ref="canvasRef"></div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  watch,
} from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { asset } from "@/utils/asset";

const props = defineProps({
  modelPath: { type: String, default: asset("models/头盔.glb") },
  active: { type: Boolean, default: true },
});

const isPageActive = ref(true);

const wrapRef = ref(null);
const canvasRef = ref(null);
const dropping = ref(false);

let scene, camera, renderer, model;
let raf = null;
let lockTimer = null;
let hasInited = false;
let hasDropped = false;
let loopFn = null;
let isDomVisible = true;
let visibilityObserver = null;
let onResizeHandler = null;

/* ===================== 鼠标跟随旋转相关变量 ===================== */
let targetRotationX = 0; // 目标 X 轴旋转（俯仰）
let targetRotationY = 0; // 目标 Y 轴旋转（偏航）
let currentRotationX = 0; // 当前 X 轴旋转（平滑插值）
let currentRotationY = 0; // 当前 Y 轴旋转

// 基础旋转幅度（最大90度）
const BASE_ROTATION_RANGE_X = Math.PI / 2; // 90度
const BASE_ROTATION_RANGE_Y = Math.PI / 2; // 90度
const LERP_FACTOR = 0.08; // 平滑插值系数

/* ===================== 触发下落动画（终身仅一次）==================== */
function triggerDropOnce() {
  if (hasDropped) {
    console.log("[Helmet3D] 已触发过下落，跳过重复调用");
    return;
  }
  hasDropped = true;
  console.log("[Helmet3D] 触发模型下落动画");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dropping.value = true;
      lockTimer = setTimeout(() => {
        const el = wrapRef.value;
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.animation = "none";
        }
      }, 950);
    });
  });
}

/* ===================== 监听 active prop 作为兜底 ===================== */
watch(
  () => props.active,
  (newVal) => {
    if (newVal && hasInited && model && !hasDropped) {
      console.log("[Helmet3D] active 变为 true，模型已就绪，触发下落");
      triggerDropOnce();
    }
  },
);

/* ===================== 根据距离计算动态旋转幅度 ===================== */
function getDynamicRotationRange() {
  if (!model || !camera || !wrapRef.value) {
    return { rangeX: BASE_ROTATION_RANGE_X, rangeY: BASE_ROTATION_RANGE_Y };
  }

  const modelPos = new THREE.Vector3();
  model.getWorldPosition(modelPos);
  modelPos.project(camera);

  const rect = wrapRef.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const screenX = (modelPos.x * 0.5 + 0.5) * rect.width + rect.left;
  const screenY = (-modelPos.y * 0.5 + 0.5) * rect.height + rect.top;
  const distanceToCenter = Math.sqrt(
    Math.pow(screenX - centerX, 2) + Math.pow(screenY - centerY, 2),
  );

  const maxDistance =
    Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;

  const distanceRatio = Math.min(distanceToCenter / maxDistance, 1);
  const factor = 1 - distanceRatio * 0.85;

  return {
    rangeX: BASE_ROTATION_RANGE_X * factor,
    rangeY: BASE_ROTATION_RANGE_Y * factor,
  };
}

/* ===================== 鼠标跟随旋转：修正左右方向 ===================== */
function onMouseMove(event) {
  if (!wrapRef.value || !model) return;

  const rect = wrapRef.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // 鼠标相对于容器中心的归一化位置 (-1 ~ +1)
  const normX = (event.clientX - centerX) / (rect.width / 2);
  const normY = (event.clientY - centerY) / (rect.height / 2);

  const clampedX = Math.max(-1, Math.min(1, normX));
  const clampedY = Math.max(-1, Math.min(1, normY));

  const { rangeX, rangeY } = getDynamicRotationRange();

  /*
   * 修正后映射（与 X 轴符号规律一致）：
   * 鼠标在右侧 (clampedX > 0) → 模型向右看 → rotation.y 为正
   * 鼠标在上方 (clampedY < 0) → 模型抬头    → rotation.x 为负
   *
   * 注意：Three.js 中 rotation.y 正方向为逆时针（从上方看），
   * 但实际视觉效果需以用户测试反馈为准。
   */
  targetRotationY = clampedX * rangeY; // 鼠标右 → 模型右转
  targetRotationX = clampedY * rangeX; // 鼠标上 → 模型抬头（Y轴向下为正，故取反）
}

/* ===================== Three.js 初始化（带零尺寸保护）==================== */
function tryInit() {
  const box = canvasRef.value;
  if (!box || hasInited) return;

  const w = box.clientWidth;
  const h = box.clientHeight;

  if (w === 0 || h === 0) {
    const resizeObs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && !hasInited) {
          resizeObs.disconnect();
          init();
          break;
        }
      }
    });
    resizeObs.observe(box);
    return;
  }

  init();
}

function init() {
  const box = canvasRef.value;
  const w = box.clientWidth;
  const h = box.clientHeight;
  if (w === 0 || h === 0) return;

  hasInited = true;
  console.log("[Helmet3D] Three.js 初始化开始，尺寸:", w, "x", h);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 0.3, 4);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  box.appendChild(renderer.domElement);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  scene.environment = pmremGenerator.fromScene(roomEnv).texture;
  roomEnv.dispose();

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const key = new THREE.DirectionalLight(0xfff0e0, 2.0);
  key.position.set(4, 6, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xddeeff, 0.5);
  fill.position.set(-4, 2, 4);
  scene.add(fill);
  const rim = new THREE.SpotLight(0xffffff, 3.0);
  rim.position.set(0, 4, -4);
  rim.lookAt(0, 0, 0);
  scene.add(rim);

  window.addEventListener("mousemove", onMouseMove);

  new GLTFLoader().load(
    props.modelPath,
    (gltf) => {
      model = gltf.scene;
      const bbox = new THREE.Box3().setFromObject(model);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.8 / maxDim;
      model.scale.setScalar(scale);
      model.position.sub(center.clone().multiplyScalar(scale));
      model.position.y += 0.1;

      model.traverse((child) => {
        if (child.isMesh) {
          const oldMat = child.material;
          child.material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.0,
            roughness: 0.05,
            transmission: 1.0,
            thickness: 1.2,
            ior: 1.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            side: THREE.DoubleSide,
            transparent: true,
            envMapIntensity: 1.0,
          });
          if (oldMat) {
            const mats = Array.isArray(oldMat) ? oldMat : [oldMat];
            mats.forEach((m) => m?.dispose());
          }
        }
      });

      scene.add(model);
      console.log("[Helmet3D] 模型加载成功");
      triggerDropOnce();
    },
    (xhr) => {
      if (xhr.lengthComputable) {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        if (percent % 25 === 0) {
          console.log(`[Helmet3D] 模型加载进度: ${percent}%`);
        }
      }
    },
    (err) => {
      console.error("[Helmet3D] 模型加载失败:", err);
      const placeholder = document.createElement("div");
      placeholder.style.cssText =
        "width:100%;height:100%;background:rgba(255,255,255,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);font-size:13px;letter-spacing:0.1em;";
      placeholder.textContent = "3D 模型加载失败，请检查控制台";
      box.appendChild(placeholder);
    },
  );

  const onResize = () => {
    if (!wrapRef.value || !renderer || !camera) return;
    const nw = wrapRef.value.clientWidth;
    const nh = wrapRef.value.clientHeight;
    if (nw === 0 || nh === 0) return;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  };
  onResizeHandler = onResize;
  window.addEventListener("resize", onResizeHandler);

  isDomVisible = true;
  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isDomVisible = entry.isIntersecting;
    },
    { threshold: 0.1 },
  );
  visibilityObserver.observe(wrapRef.value);

  loopFn = () => {
    if (!isPageActive.value) return;
    raf = requestAnimationFrame(loopFn);
    if (isDomVisible) {
      if (model) {
        currentRotationX += (targetRotationX - currentRotationX) * LERP_FACTOR;
        currentRotationY += (targetRotationY - currentRotationY) * LERP_FACTOR;
        model.rotation.x = currentRotationX;
        model.rotation.y = currentRotationY;
      }
      renderer.render(scene, camera);
    }
  };
  loopFn();

  box._cleanup = () => {
    clearTimeout(lockTimer);
    window.removeEventListener("resize", onResizeHandler);
    window.removeEventListener("mousemove", onMouseMove);
    cancelAnimationFrame(raf);
    visibilityObserver?.disconnect();
    renderer?.dispose();
    pmremGenerator?.dispose();
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
}

onMounted(() => {
  tryInit();
});

onDeactivated(() => {
  isPageActive.value = false;
  if (raf) {
    cancelAnimationFrame(raf);
    raf = null;
  }
});

onActivated(() => {
  isPageActive.value = true;
  if (hasInited && loopFn && !raf) {
    loopFn();
  }
});

onUnmounted(() => {
  canvasRef.value?._cleanup?.();
});
</script>

<style scoped>
.helmet-dropper {
  width: 100%;
  height: 100%;
  opacity: 0;
}

.helmet-dropper.is-dropping {
  animation: helmetDrop 0.9s cubic-bezier(0.1, 0, 0.3, 1) forwards;
}

@keyframes helmetDrop {
  0% {
    transform: translateY(-120vh);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  90% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.9, 0, 1, 1);
  }
  95% {
    transform: translateY(4px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.canvas-box {
  width: 100%;
  height: 100%;
}

.canvas-box :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
  outline: none;
  pointer-events: auto;
}
</style>
