<template>
  <PagePreloader title="未来时空" :images="['images/decorations/未完成.png']">
    <div class="scene-wrapper">
      <div ref="canvasContainer" class="canvas-container"></div>

      <div class="crosshair" :class="{ active: canInteract && gameStarted }">
        +
      </div>

      <div class="start-screen" :class="{ hidden: gameStarted }">
        <h1 class="title">COSMIC 1977</h1>
        <p class="subtitle">未来时空之旅</p>
        <p class="enter-hint">按 <span class="key">ENTER</span> 开始探索</p>
      </div>

      <div
        class="interaction-hint"
        :class="{ show: canInteract && gameStarted }"
      >
        <div class="hint-box">
          <p class="hint-text">按 <span class="key">E</span> 播放唱片</p>
          <p class="hint-sub">进入音乐时空</p>
        </div>
      </div>

      <div class="cosmic-title" :class="{ show: showTitle }">
        <img
          :src="asset('images/decorations/未完成.png')"
          class="title-image"
          style="width: 400px; height: auto; max-width: 80vw"
          alt="宇宙组曲"
        />
        <p class="title-sub">后面的区域以后再来探索吧（未完成）</p>
        <p class="title-sub">COSMIC SUITE · 1977</p>
      </div>

      <div
        v-for="(node, i) in pathTextNodes"
        :key="i"
        class="path-text-overlay"
        :class="{ active: node.opacity > 0.1 }"
        :style="node.screenStyle"
      >
        <div class="reveal-container">
          <span
            v-for="(char, j) in node.displayChars"
            :key="j"
            class="reveal-char"
            :class="{ 'is-visible': node.visible[j], 'is-glow': node.glow[j] }"
            >{{ char }}</span
          >
          <span class="cursor-blink">_</span>
        </div>
      </div>

      <div class="controls-help" v-if="gameStarted && !isCutscene">
        <p>W 前进 | S 后退 | 鼠标 视角 | 准星对准按 E</p>
      </div>

      <BackToHomeButton />
    </div>
  </PagePreloader>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
  inject,
} from "vue";
import PagePreloader from "../../components/PagePreloader.vue";
import * as THREE from "three";
import BackToHomeButton from "../../components/BackToHomeButton.vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { audioManager } from "../../utils/audioManager";
import { asset } from "../../utils/asset";

defineOptions({ name: "FuturePage" });

const canvasContainer = ref(null);
const setPageReady = inject("setPageReady", () => {});
const canInteract = ref(false);
const gameStarted = ref(false);
const showTitle = ref(false);

let scene, camera, renderer, mixer;
let rafId = null;
let isPageActive = true;
let player = { x: 0, y: 1.6, z: 8, yaw: 0, pitch: 0 };
const speed = 1.6;
const recordPlayerPos = new THREE.Vector3(0, 0, -8);
const pathForward = new THREE.Vector3(0, 0, -1);

const keys = { w: false, s: false };
let isPointerLocked = false;
let animations = [];
let headBobTime = 0;
let smoothedWalk = 0;
const BOB_Y = 0.012,
  BOB_X = 0.006,
  BOB_ROLL = 0.002;

const TEXT_CONTENTS = [
  "我感谢那些焦头烂额的·灵感枯竭的·不會搁笔的日子。",
  "我的确是渺小的、短暂的存在。始终在向这个世界寻求一个答案。",
  "你会遇上另一些哀愁，并对人说起真实的美丽",
  "在星际的寂静中，每一个音符都是宇宙的心跳。",
];
const textWorldPositions = [
  new THREE.Vector3(),
  new THREE.Vector3(),
  new THREE.Vector3(),
  new THREE.Vector3(), // 桌子后面的文本位置
];
const pathTextNodes = reactive([
  {
    revealed: false,
    displayChars: [],
    visible: [],
    glow: [],
    screenStyle: {},
    opacity: 0,
  },
  {
    revealed: false,
    displayChars: [],
    visible: [],
    glow: [],
    screenStyle: {},
    opacity: 0,
  },
  {
    revealed: false,
    displayChars: [],
    visible: [],
    glow: [],
    screenStyle: {},
    opacity: 0,
  },
  {
    revealed: false,
    displayChars: [],
    visible: [],
    glow: [],
    screenStyle: {},
    opacity: 0,
  },
]);
const charsPool = "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF";

const raycaster = new THREE.Raycaster();
const mouseCenter = new THREE.Vector2(0, 0);
let outlinedMesh = null,
  outlineLines = null;

let vinylMesh = null,
  vinylSpinSpeed = 0;
let tonearmMesh = null,
  tonearmBaseRot = null;
let emptyObj = null,
  emptyBaseRot = null;

let playState = "idle";
let playStartTime = 0;
const CUTSCENE_DELAY = 2.8;
let isCutscene = false;

// 过场触发标记
let cutsceneInit = false;
let cutsceneStartTime = 0;

let initialYaw = 0;
let lastTime = 0;

let cutsceneCamAnim = {
  active: false, // 动画是否进行中
  startTime: 0, // 动画开始时间戳
  duration: 2200, // 【可调】抬头动画持续毫秒数 (2.2秒)
  pitchStart: 0, // 抬头前原来的俯仰角
  pitchTarget: +Math.PI / 2 + 0.02, // 【可调】最终抬头角度
  yawStart: 0, // 抬头前原来的水平角
  yawTarget: 0, // 最终归正的水平角
};

function sanitizeObject3D(obj) {
  if (!obj) return;
  if (obj.children && Array.isArray(obj.children)) {
    obj.children = obj.children.filter((c) => c && c.isObject3D);
    obj.children.forEach(sanitizeObject3D);
  }
}

function init() {
  const container = canvasContainer.value;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050302);
  scene.fog = new THREE.FogExp2(0x050302, 0.03);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  container.appendChild(renderer.domElement);
  createStars();
  loadBlenderScene();

  window.addEventListener("resize", onResize);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("click", lockPointer);
  document.addEventListener("pointerlockchange", onPointerLockChange);
  document.addEventListener("mousemove", onMouseMove);

  lastTime = performance.now();
  animate();
}

function loadBlenderScene() {
  const loader = new GLTFLoader();
  loader.load(
    asset("models/唱片场景.glb"),
    (gltf) => {
      try {
        const model = gltf.scene;
        sanitizeObject3D(model);
        scene.add(model);

        // 恢复 Blender 灯光（增强亮度）
        model.traverse((o) => {
          if (o.isLight) {
            if (
              o.color &&
              o.color.r >= 0.99 &&
              o.color.g >= 0.99 &&
              o.color.b >= 0.99
            )
              o.color.setHex(0xffede1);
            o.intensity = Math.min(o.intensity * 3.0, 50);
            if (o.isSpotLight) {
              o.angle = Math.max(o.angle, Math.PI / 4);
              o.distance = Math.max(o.distance, 25);
              o.penumbra = Math.max(o.penumbra, 0.6);
              o.decay = 1.5;
            }
          }
        });

        // 底部补光（增强）
        const bottomGlow = new THREE.PointLight(0xffaa55, 8, 35, 1.2);
        bottomGlow.position.set(0, -3, -8);
        scene.add(bottomGlow);

        // 地面强制纯黑
        model.traverse((o) => {
          if (!o.isMesh) return;
          const lower = o.name.toLowerCase();
          const worldPos = new THREE.Vector3();
          o.getWorldPosition(worldPos);
          const isGroundByName =
            (lower.includes("平面") ||
              lower.includes("floor") ||
              lower.includes("ground") ||
              lower.includes("地面")) &&
            !lower.includes("table") &&
            !lower.includes("桌子") &&
            !lower.includes("old_table");
          const isLowPlane =
            worldPos.y < 0.3 &&
            o.geometry &&
            (o.geometry.type === "PlaneGeometry" ||
              o.geometry.type === "CircleGeometry");
          if (isGroundByName || isLowPlane) {
            o.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            o.receiveShadow = false;
            o.castShadow = false;
          }
        });

        // 读取 Blender 摄像机
        let camObj = null;
        model.traverse((o) => {
          if (o.isCamera) camObj = o;
        });
        if (camObj) {
          const pos = new THREE.Vector3();
          camObj.getWorldPosition(pos);
          player.x = pos.x;
          player.z = pos.z;
          player.y = Math.min(pos.y, 1.8);
          const quat = new THREE.Quaternion();
          camObj.getWorldQuaternion(quat);
          const euler = new THREE.Euler().setFromQuaternion(quat, "YXZ");
          player.yaw = euler.y;
          player.pitch = euler.x;
          initialYaw = player.yaw;
          pathForward
            .set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw))
            .normalize();
          player.x -= pathForward.x * 6;
          player.z -= pathForward.z * 6;
          updateCameraFromPlayer();
        } else {
          player.y = 1.6;
          player.z = 12;
          initialYaw = 0;
          pathForward.set(0, 0, -1);
          updateCameraFromPlayer();
        }

        // 交互目标
        const keywords = [
          "vinyl",
          "vinly",
          "唱片机",
          "唱机",
          "turntable",
          "record",
          "player",
          "唱盘",
          "platter",
        ];
        let target = null;
        model.traverse((o) => {
          if (target) return;
          if (keywords.some((k) => o.name.toLowerCase().includes(k))) {
            target = o;
            console.log("🎯 交互目标:", o.name);
          }
        });
        if (!target) {
          const box = new THREE.Box3().setFromObject(model);
          recordPlayerPos.copy(box.getCenter(new THREE.Vector3()));
        } else {
          const pos = new THREE.Vector3();
          target.getWorldPosition(pos);
          recordPlayerPos.copy(pos);
        }

        // 空物体 / 唱针
        model.traverse((o) => {
          const lower = o.name.toLowerCase();
          if (
            o.name === "空物体" ||
            lower.includes("empty") ||
            lower.includes("空")
          ) {
            emptyObj = o;
            emptyBaseRot = o.rotation.clone();
            console.log("🎯 空物体:", o.name);
          }
          if (
            ["tonearm", "needle", "唱针", "拾音", "arm", "唱臂"].some((k) =>
              lower.includes(k),
            )
          ) {
            tonearmMesh = o;
            tonearmBaseRot = o.rotation.clone();
            console.log("🎵 唱针:", o.name);
          }
        });

        // 漂浮文字位置
        const startPt = new THREE.Vector3(player.x, 1.6, player.z);
        const endPt = recordPlayerPos.clone();
        endPt.y = 1.6;
        for (let i = 0; i < 3; i++) {
          const t = (i + 1) * 0.25;
          const pos = new THREE.Vector3().lerpVectors(startPt, endPt, t);
          pos.x += i % 2 === 0 ? -4.0 : 4.0;
          textWorldPositions[i].copy(pos);
        }

        // 第4个文本：放在桌子后面（调整位置使其居中显示）
        const tableBackPos = recordPlayerPos.clone();
        tableBackPos.z -= 1.8; // 桌子后面（减少距离，更靠近桌子）
        tableBackPos.y = 1.4; // 降低高度，更贴近桌子上方
        tableBackPos.x = recordPlayerPos.x; // 居中对齐，不偏移x轴
        textWorldPositions[3].copy(tableBackPos);

        // 唱片根治扭曲
        model.traverse((o) => {
          const lower = o.name.toLowerCase();
          if (
            lower.includes("vinyl") ||
            lower.includes("vinly") ||
            lower.includes("唱片") ||
            lower.includes("唱盘")
          ) {
            vinylMesh = o;
            const parent = o.parent;
            if (parent && parent !== scene) {
              const worldPos = new THREE.Vector3(),
                worldQuat = new THREE.Quaternion(),
                worldScale = new THREE.Vector3();
              o.getWorldPosition(worldPos);
              o.getWorldQuaternion(worldQuat);
              o.getWorldScale(worldScale);
              parent.remove(o);
              scene.add(o);
              o.position.copy(worldPos);
              o.quaternion.copy(worldQuat);
              const avg = (worldScale.x + worldScale.y + worldScale.z) / 3;
              o.scale.set(avg, avg, avg);
            }
          }
        });

        // 动画
        console.log("📦 animations:", gltf.animations);
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(scene);
          animations = gltf.animations;
          animations.forEach((clip) => {
            mixer.clipAction(clip).stop();
          });
          console.log(
            "🎬 动画:",
            animations.map((a) => a.name),
          );
        } else {
          console.warn("⚠️ 无动画，使用代码兜底");
        }
        console.log("[Future] GLB 模型加载完成");
        setPageReady();
      } catch (err) {
        console.error("glb 处理失败:", err);
        setPageReady();
      }
    },
    undefined,
    (error) => {
      console.error("glb 加载失败:", error);
      setPageReady();
    },
  );
}

/* ================================
   星空：3000颗 全屏均匀铺满（XYZ对称分布）
================================ */
function createStars() {
  const count = 3000;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // 【全屏均匀铺满】XYZ 均对称随机，无论朝哪看都有星星
    positions[i * 3] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
    phases[i] = Math.random() * Math.PI * 2;
    sizes[i] = Math.random() * 2.0 + 0.3;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
  geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      globalAlpha: { value: 0.9 },
    },
    vertexShader: `
      uniform float time;
      attribute float size;
      attribute float phase;
      varying float vAlpha;
      void main() {
        vAlpha = 0.35 + 0.65 * sin(phase + time * 1.8);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (250.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float globalAlpha;
      varying float vAlpha;
      void main() {
        float r = distance(gl_PointCoord, vec2(0.5));
        if (r > 0.5) discard;
        float glow = 1.0 - (r * 2.0);
        glow = pow(glow, 1.4);
        gl_FragColor = vec4(1.0, 0.95, 0.85, vAlpha * glow * globalAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(geo, mat);
  stars.name = "stars";
  scene.add(stars);
}

function lockPointer() {
  if (!gameStarted.value || isCutscene) return;
  if (!isPointerLocked && canvasContainer.value)
    canvasContainer.value.requestPointerLock();
}
function onPointerLockChange() {
  isPointerLocked = document.pointerLockElement === canvasContainer.value;
  if (isCutscene && isPointerLocked) document.exitPointerLock();
}

function onMouseMove(e) {
  if (!gameStarted.value || !isPointerLocked || isCutscene) return;
  const sensitivity = 0.002;
  player.yaw -= e.movementX * sensitivity;
  let delta = player.yaw - initialYaw;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  const maxDelta = Math.PI * 0.75;
  if (delta > maxDelta) player.yaw = initialYaw + maxDelta;
  if (delta < -maxDelta) player.yaw = initialYaw - maxDelta;

  player.pitch -= e.movementY * sensitivity;
  player.pitch = Math.max(
    -Math.PI / 2.2,
    Math.min(Math.PI / 2.2, player.pitch),
  );
}

function onKeyDown(e) {
  if (isCutscene) return;
  const key = e.key.toLowerCase();
  if (!gameStarted.value && e.key === "Enter") {
    gameStarted.value = true;
    setTimeout(() => canvasContainer.value?.requestPointerLock(), 100);
    return;
  }
  if (keys.hasOwnProperty(key)) keys[key] = true;
  if (key === "e" && canInteract.value) {
    startPlaySequence();
    removeOutline();
  }
}
function onKeyUp(e) {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = false;
}

function startPlaySequence() {
  if (playState !== "idle") return;
  playState = "playing";
  playStartTime = performance.now();
  vinylSpinSpeed = 2.0;
  if (mixer && animations.length > 0) {
    animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      const name = clip.name.toLowerCase();
      const isVinylLoop =
        /旋转|spin|loop|rotate|转动|vinyl|唱片|唱盘|转盘|disk|platter/i.test(
          name,
        );
      const isNeedle = /指针|needle|arm|tonearm|唱针|拾音|head/i.test(name);
      if (isVinylLoop) {
        action.loop = THREE.LoopRepeat;
        action.clampWhenFinished = false;
      } else if (isNeedle) {
        action.loop = THREE.LoopOnce;
        action.clampWhenFinished = true;
      } else {
        action.loop = THREE.LoopOnce;
        action.clampWhenFinished = true;
      }
      action.reset().play();
    });
  }
  console.log("▶️ 播放序列启动");
}

function checkRaycast() {
  if (!gameStarted.value || isCutscene) {
    if (canInteract.value) {
      removeOutline();
      canInteract.value = false;
    }
    return;
  }
  raycaster.setFromCamera(mouseCenter, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  let hit = false,
    hitMesh = null;
  for (let i = 0; i < intersects.length; i++) {
    const obj = intersects[i].object;
    if (!obj.isMesh) continue;
    const name = obj.name.toLowerCase();
    if (
      [
        "vinyl",
        "vinly",
        "唱片",
        "唱机",
        "turntable",
        "player",
        "机体",
        "唱盘",
        "platter",
      ].some((k) => name.includes(k))
    ) {
      if (intersects[i].distance < 5) {
        hit = true;
        hitMesh = obj;
        break;
      }
    }
  }
  if (hit && hitMesh) {
    if (!canInteract.value) addOutline(hitMesh);
    canInteract.value = true;
  } else {
    if (canInteract.value) removeOutline();
    canInteract.value = false;
  }
}

function addOutline(mesh) {
  if (outlinedMesh === mesh) return;
  removeOutline();
  const edges = new THREE.EdgesGeometry(mesh.geometry, 15);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  });
  outlineLines = new THREE.LineSegments(edges, lineMaterial);
  mesh.add(outlineLines);
  outlinedMesh = mesh;
}
function removeOutline() {
  if (!outlinedMesh || !outlineLines) return;
  outlinedMesh.remove(outlineLines);
  outlineLines.geometry.dispose();
  outlineLines.material.dispose();
  outlineLines = null;
  outlinedMesh = null;
}

function updatePathText() {
  const playerPos = new THREE.Vector3(player.x, player.y, player.z);
  pathTextNodes.forEach((node, i) => {
    const worldPos = textWorldPositions[i];
    const dist = playerPos.distanceTo(worldPos);
    if (dist < 8 && !node.revealed) {
      node.revealed = true;
      startTextReveal(i);
    }
    const screenPos = worldPos.clone().project(camera);
    if (
      screenPos.z > 1 ||
      Math.abs(screenPos.x) > 1.2 ||
      Math.abs(screenPos.y) > 1.2
    ) {
      node.opacity = 0;
      node.screenStyle = { opacity: 0 };
      return;
    }
    const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
    const scale = Math.max(0.5, Math.min(1.1, 8 / (dist + 1)));
    const opacity = dist < 18 ? Math.max(0.15, 1 - dist / 22) : 0;
    node.opacity = opacity;
    node.screenStyle = {
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
    };
  });
}

function startTextReveal(index) {
  const node = pathTextNodes[index];
  const targetText = TEXT_CONTENTS[index];
  const len = targetText.length;
  node.displayChars = Array.from(
    { length: len },
    () => charsPool[Math.floor(Math.random() * charsPool.length)],
  );
  node.visible = new Array(len).fill(false);
  node.glow = new Array(len).fill(false);
  for (let i = 0; i < len; i++) {
    const char = targetText[i];
    const scrambleInterval = setInterval(() => {
      if (!node.visible[i])
        node.displayChars[i] =
          charsPool[Math.floor(Math.random() * charsPool.length)];
    }, 50);
    setTimeout(
      () => {
        clearInterval(scrambleInterval);
        node.displayChars[i] = char;
        node.visible[i] = true;
        setTimeout(() => (node.glow[i] = true), 80);
        setTimeout(() => (node.glow[i] = false), 500);
      },
      400 + i * 60 + Math.random() * 150,
    );
  }
}

/* ================================
   主循环
================================ */
function animate() {
  if (!isPageActive) return;
  rafId = requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  if (mixer) mixer.update(dt);

  // 星空动画
  const stars = scene.getObjectByName("stars");
  if (stars) {
    stars.material.uniforms.time.value = now * 0.001;
    stars.rotation.y += 0.00012;
  }

  if (playState === "playing") {
    const elapsed = (now - playStartTime) / 1000;
    if (vinylMesh && vinylSpinSpeed > 0)
      vinylMesh.rotation.y += vinylSpinSpeed * dt;

    if (emptyObj && emptyBaseRot) {
      const targetY = emptyBaseRot.y - 0.55;
      emptyObj.rotation.y += (targetY - emptyObj.rotation.y) * 0.035;
    } else if (tonearmMesh && tonearmBaseRot) {
      const targetY = tonearmBaseRot.y - 0.55;
      tonearmMesh.rotation.y += (targetY - tonearmMesh.rotation.y) * 0.035;
    }

    if (elapsed > CUTSCENE_DELAY) {
      playState = "cutscene";
      isCutscene = true;
      cutsceneInit = false;
      cutsceneStartTime = now;
      if (document.pointerLockElement) document.exitPointerLock();
      console.log("🎬 进入特写");
    }
  } else if (playState === "cutscene") {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 【修改】过场初始化：不再直接改角度，而是"启动抬头动画"
    // 这段只执行一次（由 cutsceneInit 控制）
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (!cutsceneInit) {
      cutsceneInit = true;

      // === 启动相机抬头动画 ===
      cutsceneCamAnim.active = true;
      cutsceneCamAnim.startTime = now;
      // duration: 抬头过程持续多久，单位毫秒。越大抬头越慢，越有"凝望感"
      cutsceneCamAnim.duration = 2200;

      // 记录当前真实角度作为"起点"
      cutsceneCamAnim.pitchStart = player.pitch;
      cutsceneCamAnim.yawStart = player.yaw;

      // 记录目标角度
      // pitchTarget: 最终抬头角度。当前是 -89°（几乎垂直向上）
      // 如要改为向上看，建议换成 Math.PI / 2 - 0.02
      cutsceneCamAnim.pitchTarget = +Math.PI / 2 + 0.02;
      cutsceneCamAnim.yawTarget = initialYaw;

      // 释放鼠标锁定（原来就有的逻辑，保留）
      if (document.pointerLockElement) document.exitPointerLock();
      console.log("🎬 过场抬头动画启动");
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 【新增】每帧执行抬头插值（带缓动，模拟真实颈部惯性）
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (cutsceneCamAnim.active) {
      const elapsed = now - cutsceneCamAnim.startTime;
      // t: 动画进度 0.0 ~ 1.0
      let t = Math.min(elapsed / cutsceneCamAnim.duration, 1);

      // === 缓动函数：ease-out cubic ===
      // 效果：启动时稍慢（惯性），中间加速，接近目标时逐渐减速至停止
      // 给人"缓缓抬头仰望星空"的诗意停顿感
      const ease = 1 - Math.pow(1 - t, 3);

      // 实时插值更新角度
      player.pitch =
        cutsceneCamAnim.pitchStart +
        (cutsceneCamAnim.pitchTarget - cutsceneCamAnim.pitchStart) * ease;
      player.yaw =
        cutsceneCamAnim.yawStart +
        (cutsceneCamAnim.yawTarget - cutsceneCamAnim.yawStart) * ease;

      // 动画完成后关闭标记，防止重复计算
      if (t >= 1) cutsceneCamAnim.active = false;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 以下保持原有逻辑不变
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // 星空缓慢渐隐（保留）
    const stars = scene.getObjectByName("stars");
    if (stars) {
      stars.material.uniforms.globalAlpha.value +=
        (0 - stars.material.uniforms.globalAlpha.value) * 0.04;
    }

    // 1.5 秒后标题浮现
    if (!showTitle.value && now - cutsceneStartTime > 1500) {
      showTitle.value = true;
      console.log("✨ 标题浮现");
    }

    // 唱片与唱针持续运动（保留）
    if (vinylMesh && vinylSpinSpeed > 0)
      vinylMesh.rotation.y += vinylSpinSpeed * dt;
    if (emptyObj && emptyBaseRot) {
      const targetY = emptyBaseRot.y - 0.55;
      emptyObj.rotation.y += (targetY - emptyObj.rotation.y) * 0.035;
    } else if (tonearmMesh && tonearmBaseRot) {
      const targetY = tonearmBaseRot.y - 0.55;
      tonearmMesh.rotation.y += (targetY - tonearmMesh.rotation.y) * 0.035;
    }
  }

  checkRaycast();

  // 移动
  let moveInput = 0;
  if (gameStarted.value && !isCutscene) {
    if (keys.w) moveInput += 1;
    if (keys.s) moveInput -= 1;
  }
  const playerPos = new THREE.Vector3(player.x, player.y, player.z);
  const distToTarget = playerPos.distanceTo(recordPlayerPos);
  if (distToTarget < 0.9 && moveInput > 0) moveInput = 0;

  player.x += pathForward.x * speed * moveInput * dt;
  player.z += pathForward.z * speed * moveInput * dt;

  const backBound = 35;
  const proj = player.x * pathForward.x + player.z * pathForward.z;
  if (proj > backBound) {
    player.x -= pathForward.x * (proj - backBound);
    player.z -= pathForward.z * (proj - backBound);
  }

  // 行走晃动
  const velLen = Math.abs(moveInput * speed);
  const rawWalk = Math.min(velLen / speed, 1);
  smoothedWalk += (rawWalk - smoothedWalk) * 0.12;
  if (smoothedWalk > 0.01) headBobTime += dt * 5;
  const bobY = Math.sin(headBobTime * 2) * BOB_Y * smoothedWalk;
  const bobX = Math.cos(headBobTime * 2) * BOB_X * smoothedWalk;
  const roll = Math.sin(headBobTime) * BOB_ROLL * smoothedWalk;

  camera.position.x = player.x + bobX;
  camera.position.y = player.y + bobY;
  camera.position.z = player.z;
  camera.rotation.order = "YXZ";
  camera.rotation.y = player.yaw;
  camera.rotation.x = player.pitch;
  camera.rotation.z = roll;

  updatePathText();
  renderer.render(scene, camera);
}

function updateCameraFromPlayer() {
  camera.position.set(player.x, player.y, player.z);
  camera.rotation.order = "YXZ";
  camera.rotation.y = player.yaw;
  camera.rotation.x = player.pitch;
}
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

onMounted(() => {
  try {
    // 主题音乐模式：不需要从 sessionStorage 恢复，主题音乐会保持播放
    console.log("[Future Page] 主题音乐模式，音乐由 audioManager 管理");

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
          console.warn("[Future] 移除全屏遮罩:", el.className || tag);
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

    init();
  } catch (error) {
    console.error("Future page initialization failed:", error);
  }
});
onDeactivated(() => {
  console.log("[Future] 组件被缓存（离开），暂停渲染");
  isPageActive = false;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
});

onActivated(() => {
  console.log("[Future] 组件被激活（返回），恢复渲染");
  isPageActive = true;
  if (!rafId) {
    rafId = requestAnimationFrame(animate);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
  document.removeEventListener("keydown", onKeyDown);
  document.removeEventListener("keyup", onKeyUp);
  document.removeEventListener("click", lockPointer);
  document.removeEventListener("pointerlockchange", onPointerLockChange);
  document.removeEventListener("mousemove", onMouseMove);
  removeOutline();
  if (mixer) mixer.stopAllAction();
  if (renderer) renderer.dispose();

  /* 【新增】组件卸载时，手动清理所有残留遮罩 */
  console.log("[Future] 组件卸载，清理遮罩");
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
.scene-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  position: relative;
}

/* 加载遮罩 */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: opacity 0.5s ease;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 237, 225, 0.2);
  border-top-color: #ffede1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #ffede1;
  font-size: 14px;
  letter-spacing: 3px;
}

.canvas-container {
  opacity: 1;
}
.scene-wrapper::after {
  content: "";
  position: fixed;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(20, 10, 5, 0.5) 100%
  );
  pointer-events: none;
  z-index: 5;
  mix-blend-mode: multiply;
}
.scene-wrapper::before {
  content: "";
  position: fixed;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 6;
}
.canvas-container {
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.cosmic-title {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: opacity 3s cubic-bezier(0.22, 1, 0.36, 1);
}
.cosmic-title.show {
  opacity: 1;
}
.title-main {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 200;
  color: #ffd700;
  letter-spacing: 20px;
  margin: 0 0 16px 0;
  text-shadow:
    0 0 40px rgba(255, 215, 0, 0.6),
    0 0 80px rgba(255, 180, 60, 0.4),
    0 0 140px rgba(255, 140, 40, 0.2);
  animation: titleBreath 4s ease-in-out infinite;
}
.title-sub {
  font-size: clamp(0.8rem, 1.5vw, 1.1rem);
  color: rgba(255, 237, 225, 0.7);
  letter-spacing: 8px;
  margin: 0;
  font-weight: 300;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}
@keyframes titleBreath {
  0%,
  100% {
    opacity: 1;
    text-shadow:
      0 0 40px rgba(255, 215, 0, 0.6),
      0 0 80px rgba(255, 180, 60, 0.4);
  }
  50% {
    opacity: 0.85;
    text-shadow:
      0 0 60px rgba(255, 215, 0, 0.8),
      0 0 120px rgba(255, 180, 60, 0.5),
      0 0 200px rgba(255, 140, 40, 0.3);
  }
}

.crosshair {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.35);
  font-size: 24px;
  font-weight: 300;
  pointer-events: none;
  user-select: none;
  z-index: 10;
  transition: all 0.2s ease;
}
.crosshair.active {
  color: #fff;
  font-weight: 700;
  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.8),
    0 0 20px rgba(255, 237, 225, 0.6);
  transform: translate(-50%, -50%) scale(1.2);
}

.start-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 50;
  pointer-events: none;
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}
.start-screen.hidden {
  opacity: 0;
  transform: translate(-50%, -60%);
  pointer-events: none;
}
.title {
  font-size: 4rem;
  font-weight: 200;
  color: #ffd700;
  letter-spacing: 12px;
  margin: 0 0 20px 0;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  animation: titleGlow 3s ease-in-out infinite;
}
@keyframes titleGlow {
  0%,
  100% {
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  }
  50% {
    text-shadow:
      0 0 50px rgba(255, 215, 0, 0.8),
      0 0 80px rgba(255, 215, 0, 0.4);
  }
}
.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 8px;
  margin: 0 0 40px 0;
  font-weight: 300;
}
.enter-hint {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
  margin: 0;
}
.key {
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid rgba(255, 215, 0, 0.6);
  border-radius: 4px;
  margin: 0 6px;
  font-weight: bold;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.interaction-hint {
  position: fixed;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
  transition: all 0.4s ease;
  pointer-events: none;
  z-index: 20;
}
.interaction-hint.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.hint-box {
  background: rgba(20, 10, 5, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.4);
  padding: 16px 32px;
  border-radius: 8px;
  text-align: center;
  backdrop-filter: blur(8px);
}
.hint-text {
  color: #ffd700;
  font-size: 18px;
  margin: 0 0 4px 0;
  letter-spacing: 2px;
}
.hint-sub {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin: 0;
  letter-spacing: 4px;
}

.controls-help {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  letter-spacing: 1px;
  pointer-events: none;
  user-select: none;
  z-index: 10;
}

.path-text-overlay {
  position: absolute;
  pointer-events: none;
  z-index: 30;
  opacity: 0;
  transition: opacity 0.4s ease;
  will-change: transform, left, top;
}
.path-text-overlay.active {
  opacity: 1;
}
.reveal-container {
  font-family: "Courier New", "Noto Sans SC", monospace;
  font-size: clamp(0.6rem, 1.2vw, 0.9rem);
  color: #ffede1;
  letter-spacing: 0.05em;
  line-height: 1.6;
  white-space: nowrap;
  text-shadow:
    0 0 6px rgba(255, 237, 225, 0.9),
    0 0 18px rgba(255, 200, 100, 0.7),
    0 0 36px rgba(255, 160, 60, 0.5),
    0 0 72px rgba(200, 100, 30, 0.3);
}
.reveal-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(10px) scale(0.9);
  filter: blur(2px);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 0.6em;
}
.reveal-char.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}
.reveal-char.is-glow {
  color: #fff;
  text-shadow:
    0 0 12px rgba(255, 255, 255, 1),
    0 0 30px rgba(255, 237, 225, 0.9),
    0 0 60px rgba(255, 215, 0, 0.6);
  transform: scale(1.15);
}
.cursor-blink {
  display: inline-block;
  color: #ffede1;
  animation: blink 1s step-end infinite;
  margin-left: 0.15em;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
