<
<template>
  <div class="scene-container" ref="containerRef">
    <!-- 【新增】模型预加载层：COS 大模型下载时显示进度 -->
    <div v-if="isPreloading" class="preload-overlay">
      <div class="preload-box">
        <p class="preload-title">正在加载模型</p>
        <div class="preload-track">
          <div
            class="preload-fill"
            :style="{ width: preloadProgress + '%' }"
          ></div>
        </div>
        <p class="preload-num">{{ preloadProgress }}%</p>
      </div>
    </div>

    <!-- 当白色背景层显示时，隐藏所有内容 -->
    <template v-if="!showWhiteOverlay">
      <canvas ref="canvasRef"></canvas>

      <!-- 左侧菜单 -->
      <div class="left-menu" :class="{ hidden: hideMenus }">
        <!-- 模式切换 -->
        <div class="menu-section">
          <div class="menu-title">模式选择</div>
          <div class="menu-items">
            <button
              class="menu-btn"
              :class="{ active: currentMode === 'model' }"
              @click="switchMode('model')"
            >
              🎨 3D 模型
            </button>
            <button
              class="menu-btn"
              :class="{ active: currentMode === 'cloth' }"
              @click="switchMode('cloth')"
            >
              🧵 布料模拟
            </button>
          </div>
        </div>

        <!-- 滤镜面板 -->
        <div class="menu-section" v-show="currentMode === 'model'">
          <div class="menu-title">滤镜效果</div>
          <div class="menu-items">
            <button
              v-for="f in filters"
              :key="f.id"
              class="menu-btn filter-btn"
              :class="{ active: isFilterEnabled && currentFilter === f.id }"
              @click="toggleFilter(f.id)"
            >
              <span class="filter-dot"></span>
              <span class="filter-label">{{ f.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 布料模拟组件 -->
      <div class="cloth-container" v-show="currentMode === 'cloth'">
        <ClothSimulation
          @fullscreen-change="handleFullscreenChange"
          @show-mode-menu="showModeMenu"
        />
      </div>
    </template>

    <!-- 白色背景层（按 ESC 返回时显示） -->
    <WhiteOverlay v-model="showWhiteOverlay" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js"; // 【新增】雕像描边
import { OutputPass } from "three/addons/postprocessing/OutputPass.js"; // gamma 校正
import ClothSimulation from "../../components/ClothSimulation.vue";
import WhiteOverlay from "../../components/views/home/WhiteOverlay.vue";
import { asset } from "@/utils/asset";
import audioManager from "../../utils/audioManager";

const router = useRouter();
const showWhiteOverlay = ref(false);

const containerRef = ref(null);
const canvasRef = ref(null);

// 【新增】预加载状态
const isPreloading = ref(true);
const preloadProgress = ref(0);

// 模式切换
const currentMode = ref("model");
const hideMenus = ref(false);

// 处理全屏模式变化
function handleFullscreenChange(value) {
  hideMenus.value = value;
}

// 显示所有菜单
function showModeMenu() {
  hideMenus.value = false;
}

let scene, camera, renderer;
let composer, renderPassBase;
let halftonePass, woodcutPass, pixelatePass;
let asciiPass;
let outlinePass; // 【新增】雕像描边 Pass
let outputPass; // gamma 校正 Pass

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationY = 0;
let rotationX = 0;
let cameraDistance = 5;

// 【修改】滤镜名称全部改为中文，并新增"雕像描边"
const filters = [
  { id: "halftone", label: "半调网点" },
  { id: "woodcut", label: "木刻版画" },
  { id: "pixelate", label: "像素化" },
  { id: "ascii", label: "ASCII字符" },
  { id: "outline", label: "雕像描边" }, // 【新增】
];
const currentFilter = ref("halftone");
const isFilterEnabled = ref(false); // 【修改】默认关闭滤镜

const switchMode = (mode) => {
  currentMode.value = mode;
};

const MODEL_SCALE = 3;
const CAMERA_DISTANCE_FACTOR = 2;
const CAMERA_HEIGHT_FACTOR = 0.6;
const MIN_CAMERA_DISTANCE = 1.5;
const MAX_CAMERA_DISTANCE = 25;

// ========== 公共 GLSL 工具函数 ==========
const ShaderCommon = `
  float getLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  float posterize(float v, float n) {
    return clamp(floor(v * n) / (n - 1.0), 0.0, 1.0);
  }

  float levels(float v, float black, float white, float contrast) {
    float mapped = (v - black) / (white - black);
    mapped = clamp(mapped, 0.0, 1.0);
    mapped = mapped + (mapped - 0.5) * (contrast - 1.0) * (1.0 - abs(mapped - 0.5) * 2.0);
    return clamp(mapped, 0.0, 1.0);
  }

  float remapDark(float v) {
    return v * 0.82 + 0.18;
  }

  vec2 rotate(vec2 p, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }
`;

// ========== 【修改】ASCII 字符纹理生成：更大更清晰 ==========
const createAsciiTexture = () => {
  // 从亮到暗排列：空格(最亮/留白) → @(最暗/最密)
  const chars = " .,:;/i1tfLCG08@%";
  const charW = 50;
  const charH = 50;
  const canvas = document.createElement("canvas");
  canvas.width = chars.length * charW;
  canvas.height = charH;
  const ctx = canvas.getContext("2d");

  // 黑底白字（供 shader 反色使用）
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = `bold ${charH - 6}px "Courier New", monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], i * charW + charW / 2, charH / 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  return { texture: tex, charCount: chars.length };
};

// ========== 【重写】ASCII 码滤镜：白底黑字 + 背景保护 ==========
const AsciiShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    charSize: { value: 12.0 }, // 字符块大小
    charTexture: { value: null }, // 字符图集
    charCount: { value: 15.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float charSize;
    uniform sampler2D charTexture;
    uniform float charCount;
    varying vec2 vUv;

    float getLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

    void main() {
      vec2 pixel = vUv * resolution;
      vec2 block = floor(pixel / charSize);
      vec2 offset = fract(pixel / charSize);

      // 采样块中心亮度
      vec2 centerUV = (block + 0.5) * charSize / resolution;
      vec3 c = texture2D(tDiffuse, centerUV).rgb;
      float lum = getLum(c);

      // 【关键】背景保护：接近原背景色(#dddddd 亮度~0.87)直接留白
      if (lum > 0.88) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        return;
      }

      // 亮度→字符索引：亮部用稀疏字符(索引小)，暗部用密集字符(索引大)
      // lum 0.0(黑) → idx = charCount-1 (@)
      // lum 0.88(浅灰) → idx = 0 (空格)
      float idx = floor((1.0 - lum / 0.88) * (charCount - 1.0));
      idx = clamp(idx, 0.0, charCount - 1.0);

      // 在字符图集中定位
      vec2 charUV = vec2((idx + offset.x) / charCount, offset.y);
      float charVal = texture2D(charTexture, charUV).r;

      // 【关键】反色：黑字白底
      float finalVal = 1.0 - charVal;

      // 增强对比度，让字更锐利、底更干净
      finalVal = smoothstep(0.2, 0.8, finalVal);

      gl_FragColor = vec4(vec3(finalVal), 1.0);
    }
  `,
};

// ========== 半调网点（保持原样） ==========
const HalftoneShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    dotSize: { value: 6.0 },
    angle: { value: 0.785398 },
    blackThreshold: { value: 0.12 },
    whiteThreshold: { value: 0.88 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float dotSize;
    uniform float angle;
    uniform float blackThreshold;
    uniform float whiteThreshold;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

      if (gray > whiteThreshold) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
        return;
      }
      if (gray < blackThreshold) {
        gl_FragColor = vec4(vec3(0.18), 1.0);
        return;
      }

      vec2 pixel = vUv * resolution;
      float s = sin(angle);
      float c = cos(angle);
      vec2 rotated = vec2(
        c * pixel.x - s * pixel.y,
        s * pixel.x + c * pixel.y
      );

      vec2 grid = fract(rotated / dotSize);
      float dist = distance(grid, vec2(0.5));

      float t = (gray - blackThreshold) / (whiteThreshold - blackThreshold);
      float radius = (1.0 - t) * 0.48;
      float halftone = step(radius, dist);

      float finalGray = mix(0.18, 1.0, halftone);
      gl_FragColor = vec4(vec3(finalGray), 1.0);
    }
  `,
};

// ========== 木刻 Shader（保持原样） ==========
const WoodcutShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    levelCount: { value: 5.0 },
    edgeThreshold: { value: 0.35 },
    blackPoint: { value: 0.18 },
    whitePoint: { value: 0.75 },
    contrast: { value: 1.15 },
    lineColor: { value: 0.15 },
    grainScale: { value: 4.0 },
    grainStrength: { value: 0.08 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float levelCount;
    uniform float edgeThreshold;
    uniform float blackPoint;
    uniform float whitePoint;
    uniform float contrast;
    uniform float lineColor;
    uniform float grainScale;
    uniform float grainStrength;
    varying vec2 vUv;

    ${ShaderCommon}

    void main() {
      vec2 texel = 1.0 / resolution;
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float lum = getLum(c);

      if (lum > whitePoint) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
        return;
      }
      if (lum < blackPoint) {
        gl_FragColor = vec4(vec3(0.18), 1.0);
        return;
      }

      float mapped = levels(lum, blackPoint, whitePoint, contrast);
      float posterized = posterize(mapped, levelCount);

      float edge = 0.0;
      if (mapped < 0.65) {
        float tl = getLum(texture2D(tDiffuse, vUv + vec2(-texel.x, -texel.y)).rgb);
        float tc = getLum(texture2D(tDiffuse, vUv + vec2( 0.0,    -texel.y)).rgb);
        float tr = getLum(texture2D(tDiffuse, vUv + vec2( texel.x, -texel.y)).rgb);
        float cl = getLum(texture2D(tDiffuse, vUv + vec2(-texel.x,  0.0)).rgb);
        float cr = getLum(texture2D(tDiffuse, vUv + vec2( texel.x,  0.0)).rgb);
        float bl = getLum(texture2D(tDiffuse, vUv + vec2(-texel.x,  texel.y)).rgb);
        float bc = getLum(texture2D(tDiffuse, vUv + vec2( 0.0,     texel.y)).rgb);
        float br = getLum(texture2D(tDiffuse, vUv + vec2( texel.x,  texel.y)).rgb);

        float gx = -tl + tr - 2.0*cl + 2.0*cr - bl + br;
        float gy = -tl - 2.0*tc - tr + bl + 2.0*bc + br;
        edge = sqrt(gx*gx + gy*gy);
      }

      if (edge > edgeThreshold) {
        gl_FragColor = vec4(vec3(lineColor), 1.0);
        return;
      }

      vec2 pixel = vUv * resolution;
      float grainAngle = mix(0.0, 0.785, posterized);
      vec2 rotPixel = rotate(pixel, grainAngle);
      float grain = sin(rotPixel.x * grainScale) * 0.5 + 0.5;
      float grain2 = sin(rotPixel.y * grainScale * 2.5 + rotPixel.x * 0.5) * 0.5 + 0.5;
      grain = grain * 0.7 + grain2 * 0.3;
      float grainMod = 1.0 - grain * grainStrength;

      float levelSize = 1.0 / (levelCount - 1.0);
      float inLevelPos = fract(mapped / levelSize);
      float detailMod = 1.0 - inLevelPos * 0.06;

      float baseGray = remapDark(posterized);
      float finalGray = baseGray * grainMod * detailMod;

      gl_FragColor = vec4(vec3(finalGray), 1.0);
    }
  `,
};

// ========== 像素化 Shader（保持原样） ==========
const PixelateShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    pixelSize: { value: 6.0 },
    levelCount: { value: 8.0 },
    blackPoint: { value: 0.18 },
    whitePoint: { value: 0.78 },
    contrast: { value: 1.1 },
    innerGrad: { value: 0.2 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float pixelSize;
    uniform float levelCount;
    uniform float blackPoint;
    uniform float whitePoint;
    uniform float contrast;
    uniform float innerGrad;
    varying vec2 vUv;

    ${ShaderCommon}

    void main() {
      vec2 pixel = vUv * resolution;
      vec2 block = floor(pixel / pixelSize) * pixelSize;
      vec2 blockCenter = block + pixelSize * 0.5;
      vec2 blockUV = blockCenter / resolution;

      vec3 c = texture2D(tDiffuse, blockUV).rgb;
      float lum = getLum(c);

      if (lum > whitePoint) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
        return;
      }
      if (lum < blackPoint) {
        gl_FragColor = vec4(vec3(0.18), 1.0);
        return;
      }

      float mapped = levels(lum, blackPoint, whitePoint, contrast);
      float posterized = posterize(mapped, levelCount);

      vec2 inBlock = (pixel - block) / pixelSize;
      vec2 fromCenter = inBlock - 0.5;
      float distFromCenter = length(fromCenter) * 2.0;
      float vignette = 1.0 - distFromCenter * innerGrad * 0.2;

      float levelSize = 1.0 / (levelCount - 1.0);
      float inLevelPos = fract(mapped / levelSize);
      float detailBoost = 1.0 - (inLevelPos - 0.5) * 0.08;

      float baseGray = remapDark(posterized);
      float finalGray = baseGray * vignette * detailBoost;

      gl_FragColor = vec4(vec3(finalGray), 1.0);
    }
  `,
};

const initScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  composer = new EffectComposer(renderer);
  renderPassBase = new RenderPass(scene, camera);
  composer.addPass(renderPassBase);

  halftonePass = new ShaderPass(HalftoneShader);
  halftonePass.enabled = false;
  composer.addPass(halftonePass);

  woodcutPass = new ShaderPass(WoodcutShader);
  woodcutPass.enabled = false;
  composer.addPass(woodcutPass);

  pixelatePass = new ShaderPass(PixelateShader);
  pixelatePass.enabled = false;
  composer.addPass(pixelatePass);

  // ASCII Pass 初始化
  const { texture: asciiTexture, charCount } = createAsciiTexture();
  asciiPass = new ShaderPass(AsciiShader);
  asciiPass.uniforms.charTexture.value = asciiTexture;
  asciiPass.uniforms.charCount.value = charCount;
  asciiPass.enabled = false;
  composer.addPass(asciiPass);

  // 【新增】雕像描边 Pass：纯描边，不叠加任何后处理
  outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera,
  );
  // 加宽描边参数
  outlinePass.edgeStrength = 20.0; // 描边强度
  outlinePass.edgeGlow = 0.0; // 0 = 关闭发光晕染
  outlinePass.edgeThickness = 10; // ← 加宽：从 1.0 改为 2.5
  outlinePass.pulsePeriod = 0; // 关闭呼吸动画
  outlinePass.visibleEdgeColor.set(0xff0000); // 可见轮廓橙黑色
  outlinePass.hiddenEdgeColor.set(0xffffff); // 轮廓黑色
  outlinePass.enabled = false;
  composer.addPass(outlinePass);

  outputPass = new OutputPass();
  composer.addPass(outputPass);

  updateFilterState();

  // 滚轮缩放
  containerRef.value.addEventListener("wheel", onWheel, { passive: false });

  // 灯光系统（保持原样）
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight.position.set(8, 15, 8);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  const fillLight1 = new THREE.PointLight(0xffffff, 2);
  fillLight1.position.set(-6, 5, 4);
  scene.add(fillLight1);

  const fillLight2 = new THREE.PointLight(0xffffff, 1.5);
  fillLight2.position.set(4, 3, -6);
  scene.add(fillLight2);

  const bottomLight = new THREE.PointLight(0xffffff, 1);
  bottomLight.position.set(0, -1, 0);
  scene.add(bottomLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 2);
  rimLight.position.set(-5, 8, -8);
  scene.add(rimLight);

  // 模型加载（保持原样）
  const loader = new GLTFLoader();
  loader.load(
    asset("models/sculpture.glb"),
    (gltf) => {
      const model = gltf.scene;

      model.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.DoubleSide;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scaleFactor = MODEL_SCALE / maxDim;
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);

      const scaledBox = new THREE.Box3().setFromObject(model);
      const scaledSize = scaledBox.getSize(new THREE.Vector3());

      const center = scaledBox.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -scaledBox.min.y, -center.z);

      const baseWidth = Math.max(scaledSize.x, scaledSize.z) * 0.8;
      const baseHeight = 2.6;

      const baseGeometry = new THREE.BoxGeometry(
        baseWidth,
        baseHeight,
        baseWidth,
      );

      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        roughness: 0.4,
        metalness: 0.1,
        envMapIntensity: 1.0,
      });

      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -scaledBox.min.y - 4;
      base.castShadow = true;
      base.receiveShadow = true;

      baseGeometry.computeVertexNormals();
      const positions = baseGeometry.attributes.position;
      const colors = new Float32Array(positions.count * 3);

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const noise =
          Math.sin(x * 2) * Math.cos(z * 2) * 0.3 +
          Math.sin(x * 4 + y * 2) * 0.15 +
          Math.sin(z * 3) * 0.1;

        const gray = 0.9 + noise * 0.15;
        colors[i * 3] = gray;
        colors[i * 3 + 1] = gray;
        colors[i * 3 + 2] = gray;
      }

      baseGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      baseMaterial.vertexColors = true;

      scene.add(base);

      cameraDistance = scaledSize.y * CAMERA_DISTANCE_FACTOR;
      const cameraHeight = scaledSize.y * CAMERA_HEIGHT_FACTOR;

      camera.position.set(0, cameraHeight, cameraDistance);
      camera.lookAt(0, scaledSize.y * 0.5, 0);

      scene.add(model);

      // 【新增】将雕像模型设为描边目标（底座 base 不在其中，因此不会被描边）
      if (outlinePass) {
        outlinePass.selectedObjects = [model];
      }

      // 【新增】模型加载完成，关闭预加载层
      isPreloading.value = false;

      render();
    },
    (xhr) => {
      // 【新增】利用 GLTFLoader 原生进度更新预加载层
      if (xhr.total > 0) {
        preloadProgress.value = Math.round((xhr.loaded / xhr.total) * 100);
      } else {
        // 服务器未返回 Content-Length 时，按已下载 MB 模拟进度（上限 95%）
        const mb = xhr.loaded / 1024 / 1024;
        preloadProgress.value = Math.min(95, Math.round(mb * 10));
      }
    },
    (error) => {
      console.error("模型加载失败:", error);
      isPreloading.value = false;
    },
  );

  containerRef.value.addEventListener("pointerdown", onPointerDown);
  containerRef.value.addEventListener("pointerup", onPointerUp);
  containerRef.value.addEventListener("pointermove", onPointerMove);
  window.addEventListener("resize", onWindowResize);
};

const updateFilterState = () => {
  if (
    !halftonePass ||
    !woodcutPass ||
    !pixelatePass ||
    !asciiPass ||
    !outlinePass
  )
    return;
  halftonePass.enabled =
    isFilterEnabled.value && currentFilter.value === "halftone";
  woodcutPass.enabled =
    isFilterEnabled.value && currentFilter.value === "woodcut";
  pixelatePass.enabled =
    isFilterEnabled.value && currentFilter.value === "pixelate";
  asciiPass.enabled = isFilterEnabled.value && currentFilter.value === "ascii";
  // 【新增】雕像描边开关
  outlinePass.enabled =
    isFilterEnabled.value && currentFilter.value === "outline";
};

const render = () => {
  if (isFilterEnabled.value) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
};

const updateCamera = () => {
  const x = Math.sin(rotationY) * cameraDistance;
  const z = Math.cos(rotationY) * cameraDistance;

  const baseHeight = 2;
  const heightOffset = Math.sin(rotationX) * 1.5;
  const y = Math.max(1, Math.min(4, baseHeight + heightOffset));

  camera.position.set(x, y, z);
  camera.lookAt(0, 1.5, 0);
  render();
};

const onPointerDown = (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
};

const onPointerUp = () => {
  isDragging = false;
};

const onPointerMove = (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - previousMousePosition.x;
  const deltaY = e.clientY - previousMousePosition.y;

  rotationY -= deltaX * 0.005;
  // 【修改】修正上下拖动方向：鼠标向下拖动，相机向上看（模型顶部向用户转来）
  rotationX += deltaY * 0.005;
  rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationX));

  previousMousePosition = { x: e.clientX, y: e.clientY };
  updateCamera();
};

// 滚轮缩放
const onWheel = (e) => {
  e.preventDefault();
  cameraDistance += e.deltaY * 0.01;
  cameraDistance = Math.max(
    MIN_CAMERA_DISTANCE,
    Math.min(MAX_CAMERA_DISTANCE, cameraDistance),
  );
  updateCamera();
};

const onWindowResize = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);

  composer.setSize(w, h);
  const res = new THREE.Vector2(w, h);
  if (halftonePass) halftonePass.uniforms.resolution.value.copy(res);
  if (woodcutPass) woodcutPass.uniforms.resolution.value.copy(res);
  if (pixelatePass) pixelatePass.uniforms.resolution.value.copy(res);
  if (asciiPass) asciiPass.uniforms.resolution.value.copy(res);
  // 【新增】同步更新描边 Pass 分辨率
  if (outlinePass) outlinePass.resolution.set(w, h);

  render();
};

const toggleFilter = (id) => {
  if (currentFilter.value === id && isFilterEnabled.value) {
    isFilterEnabled.value = false;
  } else {
    currentFilter.value = id;
    isFilterEnabled.value = true;
  }
  updateFilterState();
  render();
};

const handleKeydown = (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();

    // 检查是否从白色背景层进入
    const fromOverlay = sessionStorage.getItem("fromWhiteOverlay") === "true";

    if (fromOverlay) {
      // 从白色背景层进入的，显示白色背景层
      sessionStorage.removeItem("fromWhiteOverlay");
      showWhiteOverlay.value = true;
    } else {
      // 直接进入的，也显示白色背景层
      showWhiteOverlay.value = true;
    }

    // 停止 Three.js 渲染循环和音频
    stopRendering();
  }
};

// 停止渲染和音频
const stopRendering = () => {
  // 停止 Three.js 渲染
  if (renderer) {
    renderer.dispose();
  }
  if (composer) {
    composer.dispose();
  }

  // 【新增】释放描边 Pass
  if (outlinePass) {
    outlinePass.dispose();
  }

  // 停止所有音频
  if (window.audioManager) {
    window.audioManager.pause();
  }

  // 移除所有事件监听
  window.removeEventListener("resize", onWindowResize);
  if (containerRef.value) {
    containerRef.value.removeEventListener("pointerdown", onPointerDown);
    containerRef.value.removeEventListener("pointerup", onPointerUp);
    containerRef.value.removeEventListener("pointermove", onPointerMove);
    containerRef.value.removeEventListener("wheel", onWheel);
  }
};

onMounted(() => {
  // 声明 test 组：阻止 audioManager 播放任何全局音乐
  audioManager.ensureGroup("test");

  // 添加键盘事件监听
  window.addEventListener("keydown", handleKeydown);

  setTimeout(() => {
    if (containerRef.value && canvasRef.value) {
      initScene();
    } else {
      console.error("容器或画布元素未找到");
      if (containerRef.value) {
        containerRef.value.innerHTML =
          '<div style="color: white; text-align: center; padding-top: 200px;">加载失败，请刷新页面重试</div>';
      }
    }
  }, 100);
});

onUnmounted(() => {
  // 移除键盘事件监听
  window.removeEventListener("keydown", handleKeydown);

  window.removeEventListener("resize", onWindowResize);
  if (containerRef.value) {
    containerRef.value.removeEventListener("pointerdown", onPointerDown);
    containerRef.value.removeEventListener("pointerup", onPointerUp);
    containerRef.value.removeEventListener("pointermove", onPointerMove);
    containerRef.value.removeEventListener("wheel", onWheel);
  }
  if (renderer) renderer.dispose();
  if (composer) composer.dispose();
  // 【新增】释放描边 Pass
  if (outlinePass) outlinePass.dispose();
});
</script>

<style scoped>
.scene-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #1a1a2e;
  cursor: grab;
}

.scene-container:active {
  cursor: grabbing;
}

canvas {
  display: block;
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
  transition: opacity 0.5s ease;
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
  width: 200px;
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
  transition: width 0.2s ease;
  border-radius: 1px;
}

.preload-num {
  font-size: 0.85rem;
  color: #999;
  margin-top: 16px;
  letter-spacing: 0.05em;
}

/* 左侧菜单 */
.left-menu {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
}
.left-menu.hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-20px);
}

.menu-section {
  background: rgba(20, 20, 40, 0.9);
  border-radius: 10px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.menu-title {
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.menu-items {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.menu-btn.active {
  background: rgba(100, 100, 150, 0.8);
  color: #fff;
  box-shadow: 0 0 12px rgba(100, 150, 255, 0.3);
}

/* 滤镜按钮样式 */
.menu-btn.filter-btn {
  font-family: "Courier New", monospace;
  letter-spacing: 1.5px;
}

.filter-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #555;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  flex-shrink: 0;
}

.filter-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 700;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.menu-btn.filter-btn.active {
  background: rgba(60, 60, 100, 0.9);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.6),
    0 0 16px rgba(255, 255, 255, 0.25);
}

.menu-btn.filter-btn.active .filter-dot {
  background: #fff;
  box-shadow: 0 0 10px 3px rgba(255, 255, 255, 0.6);
}

.menu-btn.filter-btn.active .filter-label {
  color: #fff;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

/* 布料模拟容器 */
.cloth-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
}
</style>
