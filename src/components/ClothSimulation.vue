<template>
  <div class="cloth-simulation">
    <!-- 背景层 -->
    <div class="bg-layer">
      <div class="bg-base" :style="{ backgroundColor: visibleBaseColor }"></div>
      <div
        class="bg-image"
        :style="bgImageStyle"
        v-show="!useSolidBackground && backgroundImageUrl"
      ></div>
    </div>

    <!-- 模板选择弹窗 -->
    <div
      v-if="showTemplateModal"
      class="modal-overlay"
      @click.self="showTemplateModal = false"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3>选择预设模板</h3>
          <button class="close-btn" @click="showTemplateModal = false">
            ×
          </button>
        </div>
        <div class="modal-body">
          <div class="template-grid">
            <div
              v-for="template in presetTemplates"
              :key="template.id"
              class="template-item"
              @click="selectTemplate(template)"
            >
              <div
                class="template-thumbnail"
                :style="{ backgroundColor: template.color }"
              >
                <span class="template-icon">{{ template.icon }}</span>
              </div>
              <span class="template-name">{{ template.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 赞助图片 -->
    <img
      v-if="sponsorVisible && sponsorImageExists"
      class="sponsor-img"
      :src="sponsorImageSrc"
      alt="sponsor"
      @error="handleSponsorImageError"
    />

    <!-- 画布容器 -->
    <div ref="canvasContainer" class="canvas-container"></div>

    <!-- 控制面板 -->
    <div
      class="controls"
      :class="{
        collapsed: panelCollapsed,
        'fullscreen-hidden': isFullscreenMode && panelCollapsed,
      }"
    >
      <div class="panel-header" @click="panelCollapsed = !panelCollapsed">
        <span class="panel-title">⚙️ 物理模拟控制台</span>
        <span class="panel-toggle">{{ panelCollapsed ? "▶" : "▼" }}</span>
      </div>

      <div class="panel-body" v-show="!panelCollapsed">
        <!-- 物理模拟参数 -->
        <div class="section">
          <div class="section-title">🍃 物理模拟参数</div>

          <div class="ctrl">
            <label
              >风的速度
              <span class="val">{{
                simParams.windSpeed.toFixed(1)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="simParams.windSpeed"
              min="0"
              max="30"
              step="0.1"
            />
          </div>

          <div class="ctrl">
            <label
              >风的方向
              <span class="val">{{ simParams.windDirection }}°</span></label
            >
            <input
              type="range"
              v-model.number="simParams.windDirection"
              min="0"
              max="360"
              step="1"
            />
          </div>

          <div class="ctrl">
            <label
              >风力随机强度
              <span class="val">{{
                simParams.windRandomness.toFixed(2)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="simParams.windRandomness"
              min="0"
              max="10"
              step="0.1"
            />
          </div>

          <div class="ctrl">
            <label
              >重力
              <span class="val">{{ simParams.gravity.toFixed(1) }}</span></label
            >
            <input
              type="range"
              v-model.number="simParams.gravity"
              min="0"
              max="50"
              step="0.1"
            />
          </div>

          <div class="ctrl">
            <label
              >小票长度
              <span class="val">{{
                simParams.receiptLength.toFixed(1)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="simParams.receiptLength"
              min="3"
              max="12"
              step="0.1"
              @input="rebuildCloth"
            />
          </div>

          <div class="ctrl">
            <label
              >宽度
              <span class="val">{{
                simParams.receiptWidth.toFixed(1)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="simParams.receiptWidth"
              min="1"
              max="20"
              step="0.1"
              @input="rebuildCloth"
            />
          </div>

          <div class="ctrl">
            <label
              >画布 X 轴位置
              <span class="val">{{
                simParams.canvasOffsetX.toFixed(1)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="simParams.canvasOffsetX"
              min="-8"
              max="8"
              step="0.1"
              @input="rebuildCloth"
            />
          </div>

          <div class="ctrl">
            <label
              >画布 Y 轴位置
              <span class="val">{{
                simParams.canvasOffsetY.toFixed(1)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="simParams.canvasOffsetY"
              min="-8"
              max="8"
              step="0.1"
              @input="rebuildCloth"
            />
          </div>

          <div class="ctrl">
            <label
              >画布前后深度
              <span class="val">{{
                simParams.canvasDepth.toFixed(1)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="simParams.canvasDepth"
              min="-1"
              max="6"
              step="0.1"
              @input="rebuildCloth"
            />
          </div>

          <div class="ctrl">
            <label
              >拖拽力度
              <span class="val">{{
                simParams.dragStrength.toFixed(2)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="simParams.dragStrength"
              min="0.05"
              max="10"
              step="0.01"
            />
          </div>

          <div class="ctrl">
            <label
              >柔软度
              <span class="val">{{
                simParams.softness.toFixed(3)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="simParams.softness"
              min="0"
              max="1"
              step="0.001"
              @input="rebuildCloth"
            />
          </div>

          <div class="ctrl">
            <label>网格密度</label>
            <select v-model="gridSelection" @change="rebuildCloth">
              <option value="1">20 × 40（低）</option>
              <option value="2">30 × 60（中）</option>
              <option value="3">40 × 80（高）</option>
              <option value="4">50 × 100（极高）</option>
            </select>
          </div>

          <div class="ctrl">
            <label>导入图片替换画布</label>
            <input type="file" accept="image/*" @change="handleReceiptImage" />
            <span class="file-label">{{ receiptImageLabel }}</span>
          </div>

          <div class="ctrl">
            <label>选择预设模板</label>
            <button class="template-btn" @click="showTemplateModal = true">
              📋 选择模板
            </button>
          </div>

          <div class="ctrl">
            <label>全屏展示</label>
            <button class="fullscreen-btn" @click="toggleFullscreenMode">
              {{ isFullscreenMode ? "🗖️ 退出全屏" : "⛶ 全屏展示" }}
            </button>
          </div>

          <div class="ctrl">
            <label>背景色</label>
            <input type="color" v-model="bgColor" @input="applyBackground" />
          </div>
        </div>

        <!-- 灯光与背景 -->
        <div class="section">
          <div class="section-title">💡 灯光与背景</div>

          <div class="ctrl">
            <label
              >整体亮度
              <span class="val">{{ lightIntensity.toFixed(2) }}</span></label
            >
            <input
              type="range"
              v-model.number="lightIntensity"
              min="0"
              max="2"
              step="0.1"
              @input="applyLighting"
            />
          </div>

          <div class="ctrl">
            <label>灯光色</label>
            <input type="color" v-model="lightColor" @input="applyLighting" />
          </div>

          <div class="ctrl toggle">
            <label>
              <input
                type="checkbox"
                v-model="useSolidBackground"
                @change="applyBackground"
              />
              纯色背景
            </label>
            <span>{{ useSolidBackground ? "开启" : "背景图" }}</span>
          </div>

          <div class="ctrl" v-show="!useSolidBackground">
            <label>更换背景图</label>
            <input type="file" accept="image/*" @change="handleBgImage" />
            <span class="file-label">{{ bgImageLabel }}</span>
          </div>

          <div class="ctrl" v-show="!useSolidBackground">
            <label
              >背景图缩放
              <span class="val">{{ bgImageScale.toFixed(2) }}</span></label
            >
            <input
              type="range"
              v-model.number="bgImageScale"
              min="0.2"
              max="3"
              step="0.05"
              @input="applyBackground"
            />
          </div>

          <div class="ctrl" v-show="!useSolidBackground">
            <label
              >背景亮度
              <span class="val">{{ bgBrightness.toFixed(3) }}</span></label
            >
            <input
              type="range"
              v-model.number="bgBrightness"
              min="0"
              max="1"
              step="0.01"
              @input="applyBackground"
            />
          </div>

          <div class="ctrl" v-show="!useSolidBackground">
            <label
              >背景垂直位置
              <span class="val">{{ bgPositionY.toFixed(3) }}</span></label
            >
            <input
              type="range"
              v-model.number="bgPositionY"
              min="0"
              max="1"
              step="0.001"
              @input="applyBackground"
            />
          </div>
        </div>

        <!-- 阴影效果 -->
        <div class="section">
          <div class="section-title">🥓 阴影效果设置</div>

          <div class="ctrl">
            <label
              >阴影透明度
              <span class="val">{{
                shadowParams.opacity.toFixed(2)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="shadowParams.opacity"
              min="0"
              max="1"
              step="0.01"
              @input="updateShadow"
            />
          </div>

          <div class="ctrl">
            <label
              >阴影模糊大小
              <span class="val">{{ shadowParams.blur.toFixed(2) }}</span></label
            >
            <input
              type="range"
              v-model.number="shadowParams.blur"
              min="0.2"
              max="3"
              step="0.01"
              @input="applyShadowBlur"
            />
          </div>

          <div class="ctrl">
            <label
              >阴影整体大小
              <span class="val">{{ shadowParams.size.toFixed(2) }}</span></label
            >
            <input
              type="range"
              v-model.number="shadowParams.size"
              min="0"
              max="3"
              step="0.01"
              @input="updateShadow"
            />
          </div>

          <div class="ctrl">
            <label
              >阴影垂直位置
              <span class="val">{{
                shadowParams.offsetY.toFixed(1)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="shadowParams.offsetY"
              min="-2"
              max="10"
              step="0.1"
              @input="applyShadowOffset"
            />
          </div>

          <div class="ctrl">
            <label
              >阴影水平位置
              <span class="val">{{
                shadowParams.offsetX.toFixed(1)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="shadowParams.offsetX"
              min="-12"
              max="12"
              step="0.1"
              @input="applyShadowOffset"
            />
          </div>

          <div class="ctrl">
            <label
              >阴影深度距离
              <span class="val">{{
                shadowParams.zPosition.toFixed(1)
              }}</span></label
            >
            <input
              type="range"
              v-model.number="shadowParams.zPosition"
              min="-6"
              max="0"
              step="0.1"
              @input="updateShadow"
            />
          </div>

          <div class="ctrl">
            <label>阴影颜色</label>
            <input
              type="color"
              v-model="shadowParams.colorHex"
              @input="updateShadow"
            />
          </div>
        </div>

        <!-- 显示开关 -->
        <div class="section">
          <div class="section-title">👁️ 显示选项</div>
          <div class="ctrl toggle">
            <label>
              <input type="checkbox" v-model="sponsorVisible" />
              显示赞助信息
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜单触发按钮（全屏模式下显示） -->
    <div v-if="showMenuTrigger" class="menu-trigger" @click="showMenu">☰</div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  defineEmits,
} from "vue";
import * as THREE from "three";

const emit = defineEmits(["fullscreen-change", "show-mode-menu"]);

// ==================== 响应式状态 ====================
const canvasContainer = ref(null);
const receiptArt = ref(null);
const panelCollapsed = ref(false);

// 物理参数
const simParams = reactive({
  windSpeed: 9,
  windDirection: 0,
  windRandomness: 0.5,
  gravity: 50,
  receiptLength: 8,
  receiptWidth: 4.5,
  canvasOffsetX: 0,
  canvasOffsetY: 0,
  canvasDepth: 1.2,
  dragStrength: 1.0,
  softness: 1.0,
});

// 阴影参数
const shadowParams = reactive({
  opacity: 0.28,
  blur: 1.0,
  size: 1.0,
  offsetX: 0.0,
  offsetY: 2.0,
  zPosition: -2.5,
  colorHex: "#000000",
});

// 背景与灯光
const bgColor = ref("#f0ede8");
const lightColor = ref("#ffffff");
const lightIntensity = ref(1.0);
const useSolidBackground = ref(true);
const bgImageScale = ref(1);
const bgBrightness = ref(1);
const bgPositionY = ref(1);
const sponsorVisible = ref(false);
const gridSelection = ref("1");

// 赞助图片相关
const sponsorImageExists = ref(false);
const sponsorImageSrc = ref("/sponsor.png");

// 模板选择弹窗
const showTemplateModal = ref(false);

// 预设模板列表
const presetTemplates = ref([
  { id: "white", name: "白色布料", icon: "⬜", color: "#fdf8f0" },
  { id: "cream", name: "奶油色", icon: "🥛", color: "#FFFDD0" },
  { id: "beige", name: "米色", icon: "🟫", color: "#F5F5DC" },
  { id: "light-gray", name: "浅灰色", icon: "⬜", color: "#D3D3D3" },
  { id: "pink", name: "粉色", icon: "💗", color: "#FFE4E1" },
  { id: "blue", name: "浅蓝色", icon: "💙", color: "#E0F4FF" },
  { id: "green", name: "浅绿色", icon: "💚", color: "#E8F5E9" },
  { id: "yellow", name: "浅黄色", icon: "💛", color: "#FFF9C4" },
  { id: "purple", name: "淡紫色", icon: "💜", color: "#F3E5F5" },
  { id: "clear", name: "清空图片", icon: "🗑️", color: "#ffffff" },
]);

// 全屏展示模式
const isFullscreenMode = ref(false);
const showMenuTrigger = ref(false);

// 切换全屏模式
function toggleFullscreenMode() {
  isFullscreenMode.value = !isFullscreenMode.value;
  if (isFullscreenMode.value) {
    // 进入全屏模式时，自动折叠控制面板
    panelCollapsed.value = true;
  }
  // 触发事件通知父组件
  emit("fullscreen-change", isFullscreenMode.value);
}

// 显示菜单触发按钮
function showMenu() {
  panelCollapsed.value = false;
  showMenuTrigger.value = false;
  // 通知父组件显示模式选择菜单（不退出全屏）
  emit("show-mode-menu");
}

// 鼠标移动监听（全屏模式）
function handleFullscreenMouseMove(e) {
  if (isFullscreenMode.value) {
    showMenuTrigger.value = e.clientX < 60;
  }
}

// 点击外部区域隐藏菜单
function handleClickOutside(e) {
  if (
    isFullscreenMode.value &&
    !e.target.closest(".controls") &&
    !e.target.closest(".menu-trigger")
  ) {
    panelCollapsed.value = true;
  }
}

// 选择模板
function selectTemplate(template) {
  showTemplateModal.value = false;

  if (template.id === "clear") {
    // 清空图片，恢复白色布料
    if (receiptObjectUrl.value) {
      URL.revokeObjectURL(receiptObjectUrl.value);
      receiptObjectUrl.value = null;
    }
    receiptArt.value = null;
    receiptImageLabel.value = "使用当前图片";
    rebuildCloth();
    return;
  }

  // 创建纯色画布作为模板
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = template.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 创建图片URL
  if (receiptObjectUrl.value) {
    URL.revokeObjectURL(receiptObjectUrl.value);
  }
  receiptObjectUrl.value = canvas.toDataURL("image/png");

  // 更新图片元素
  if (!receiptArt.value) {
    receiptArt.value = document.createElement("img");
    receiptArt.value.crossOrigin = "anonymous";
    receiptArt.value.style.display = "none";
  }

  receiptArt.value.src = receiptObjectUrl.value;
  receiptImageLabel.value = template.name;
  receiptArt.value.onload = () => rebuildCloth();
}

// 图片相关
const receiptImageLabel = ref("使用当前图片");
const bgImageLabel = ref("未选择背景图");
const backgroundImageUrl = ref("");
const receiptObjectUrl = ref(null);
const bgObjectUrl = ref(null);

// 计算属性：可见背景色
const visibleBaseColor = computed(() => {
  if (!useSolidBackground.value && backgroundImageUrl.value) {
    return multiplyHexColor(bgColor.value, bgBrightness.value);
  }
  return bgColor.value;
});

const bgImageStyle = computed(() => ({
  backgroundImage: backgroundImageUrl.value
    ? `url("${backgroundImageUrl.value}")`
    : "none",
  backgroundSize: `${(bgImageScale.value * 100).toFixed(1)}% auto`,
  backgroundPosition: `center ${(bgPositionY.value * 100).toFixed(1)}%`,
  filter: `brightness(${bgBrightness.value.toFixed(3)})`,
  opacity: backgroundImageUrl.value ? 1 : 0,
}));

// ==================== Three.js 核心变量 ====================
let renderer = null;
let scene = null;
let camera = null;
let ambLight = null;
let dirLight = null;
let fillLight = null;
let receiptMesh = null;
let shadowReceiver = null;
let particles = [];
let constraints = [];
let animationId = null;
let lastTime = 0;
let windPhase = 0;

// 常量
const SUBSTEPS = 8;
const ITERATIONS = 6;
const DRAG = 0.985;
const STIFFNESS = 0.92;
const SELF_COLLISION_STIFFNESS = 0.9;
const SELF_COLLISION_PASSES = 1;
const BASE_AMBIENT_INTENSITY = 0.7;
const BASE_DIRECTIONAL_INTENSITY = 0.9;
const BASE_FILL_INTENSITY = 0.3;
const BASE_SHADOW_RADIUS = 6;
const MIN_LIGHT_ENERGY = 0.42;
const BASE_SHADOW_SCALE_X = 4.5;
const BASE_SHADOW_SCALE_Y = 6.5;
const FIXED_LIGHT_POS = new THREE.Vector3(5, 12, 9);
const FIXED_LIGHT_TARGET = new THREE.Vector3(0, -2, -3);

let clothCols = 20;
let clothRows = 40;
let segmentWidth = 0;
let segmentHeight = 0;
let selfCollisionRadius = 0.12;
let clothPhysics = getClothPhysicsProfile(1);

const selfCollisionHash = new Map();
const hashNeighbors = [];
const HASH_OFFSET = 512;
const HASH_Y_MULT = 2048;
const HASH_X_MULT = HASH_Y_MULT * HASH_Y_MULT;
for (let x = -1; x <= 1; x++)
  for (let y = -1; y <= 1; y++)
    for (let z = -1; z <= 1; z++) hashNeighbors.push([x, y, z]);

// 拖拽状态
let mouseDown = false;
let dragParticle = null;
const dragPlane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const dragTarget = new THREE.Vector3();

// ==================== 工具函数 ====================
function normalizeHexColor(v) {
  const t = (v || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(t) ? t.toLowerCase() : null;
}

function clampNumber(value, min, max, fallback) {
  const parsed = parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function multiplyHexColor(hex, multiplier) {
  const normalizedHex = normalizeHexColor(hex) || "#f0ede8";
  const safeMultiplier = clampNumber(multiplier, 0, 1, 1);
  const channels = normalizedHex.match(/[0-9a-f]{2}/gi) || ["f0", "ed", "e8"];
  return `#${channels
    .map((channel) => {
      const scaled = Math.round(parseInt(channel, 16) * safeMultiplier);
      return Math.max(0, Math.min(255, scaled)).toString(16).padStart(2, "0");
    })
    .join("")}`;
}

function getGridConfig(value) {
  switch (String(value ?? "1")) {
    case "2":
      return { cols: 30, rows: 60 };
    case "3":
      return { cols: 40, rows: 80 };
    case "4":
      return { cols: 50, rows: 100 };
    default:
      return { cols: 20, rows: 40 };
  }
}

function normalizeSoftnessValue(softness) {
  const parsed = parseFloat(softness);
  if (!Number.isFinite(parsed)) return 1;
  if (parsed <= 1) return clampNumber(parsed, 0, 1, 1);
  if (parsed <= 100) return clampNumber(parsed / 100, 0, 1, 1);
  return 1;
}

function getClothPhysicsProfile(softness) {
  const s = normalizeSoftnessValue(softness);
  return {
    normalizedSoftness: s,
    stretchStiffness: THREE.MathUtils.lerp(0.985, 0.18, Math.pow(s, 1.15)),
    shearStiffness: THREE.MathUtils.lerp(0.92, 0.08, Math.pow(s, 1.05)),
    bendStiffness: THREE.MathUtils.lerp(0.78, 0.015, Math.pow(s, 0.85)),
    velocityDamping: THREE.MathUtils.lerp(DRAG - 0.01, 0.996, Math.pow(s, 0.7)),
  };
}

function getPerceptualLightEnergy(requestedIntensity) {
  const clampedIntensity = THREE.MathUtils.clamp(requestedIntensity, 0, 2);
  return clampedIntensity <= 1
    ? MIN_LIGHT_ENERGY +
        (1 - MIN_LIGHT_ENERGY) * Math.pow(clampedIntensity, 0.65)
    : 1 + Math.pow(clampedIntensity - 1, 0.85);
}

// ==================== 粒子与约束类 ====================
class Particle {
  constructor(x, y, z, row, col, index) {
    this.pos = new THREE.Vector3(x, y, z);
    this.prev = new THREE.Vector3(x, y, z);
    this.acc = new THREE.Vector3();
    this.pinned = false;
    this.mass = 1;
    this.row = row;
    this.col = col;
    this.index = index;
  }
  integrate(dt) {
    if (this.pinned) return;
    const vel = this.pos.clone().sub(this.prev);
    vel.multiplyScalar(clothPhysics?.velocityDamping || DRAG);
    const noise = (Math.random() - 0.5) * 0.0002;
    this.prev.copy(this.pos);
    this.pos
      .add(vel)
      .add(this.acc.clone().multiplyScalar(dt * dt))
      .addScalar(noise);
    this.acc.set(0, 0, 0);
  }
  applyForce(f) {
    this.acc.add(f.clone().divideScalar(this.mass));
  }
}

class Constraint {
  constructor(a, b, restLen, stiff) {
    this.a = a;
    this.b = b;
    this.rest = restLen !== undefined ? restLen : a.pos.distanceTo(b.pos);
    this.stiff = stiff !== undefined ? stiff : 1.0;
  }
  resolve() {
    if (this.a.pinned && this.b.pinned) return;
    const delta = this.b.pos.clone().sub(this.a.pos);
    const dist = delta.length();
    if (dist < 1e-8) return;
    const diff = ((dist - this.rest) / dist) * this.stiff;
    const move = delta.multiplyScalar(diff * 0.5);
    if (!this.a.pinned) this.a.pos.add(move);
    if (!this.b.pinned) this.b.pos.sub(move);
  }
}

// ==================== 初始化 Three.js ====================
function initThree() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);
  canvasContainer.value.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf0ede8, 30, 60);
  scene.background = null;

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.set(0, 2, 14);
  camera.lookAt(0, -1, 0);

  // 灯光
  ambLight = new THREE.AmbientLight(0xfff8f0, 0.7);
  scene.add(ambLight);

  dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(4096, 4096);
  dirLight.shadow.bias = -0.0003;
  dirLight.shadow.normalBias = 0.015;
  dirLight.shadow.radius = 6;
  dirLight.position.copy(FIXED_LIGHT_POS);
  dirLight.target.position.copy(FIXED_LIGHT_TARGET);
  scene.add(dirLight);
  scene.add(dirLight.target);

  fillLight = new THREE.DirectionalLight(0xfff0e0, 0.3);
  fillLight.position.set(-5, 3, 5);
  scene.add(fillLight);

  // 事件监听
  window.addEventListener("resize", onWindowResize);
  renderer.domElement.addEventListener("mousedown", onMouseDown);
  renderer.domElement.addEventListener("mousemove", onMouseMove);
  renderer.domElement.addEventListener("mouseup", onMouseUp);
  renderer.domElement.addEventListener("mouseleave", onMouseUp);
  renderer.domElement.addEventListener("touchstart", onTouchStart, {
    passive: true,
  });
  renderer.domElement.addEventListener("touchmove", onTouchMove, {
    passive: true,
  });
  renderer.domElement.addEventListener("touchend", onMouseUp);
}

// ==================== 布料构建 ====================
function buildCloth(receiptLength, receiptWidth) {
  clearShadowReceiver();
  if (receiptMesh) {
    scene.remove(receiptMesh);
    if (receiptMesh.material?.map) receiptMesh.material.map.dispose();
    if (receiptMesh.material) receiptMesh.material.dispose();
    receiptMesh.geometry.dispose();
    receiptMesh = null;
  }

  particles = [];
  constraints = [];

  const config = getGridConfig(gridSelection.value);
  clothCols = config.cols;
  clothRows = config.rows;

  const segW = receiptWidth / (clothCols - 1);
  const segH = receiptLength / (clothRows - 1);
  segmentWidth = segW;
  segmentHeight = segH;
  selfCollisionRadius = Math.min(segW, segH) * 1.05;
  clothPhysics = getClothPhysicsProfile(simParams.softness);

  const startX = -receiptWidth / 2 + simParams.canvasOffsetX;
  const startY = 4 + simParams.canvasOffsetY;
  const startZ = simParams.canvasDepth;

  for (let r = 0; r < clothRows; r++) {
    for (let c = 0; c < clothCols; c++) {
      const p = new Particle(
        startX + c * segW,
        startY - r * segH,
        startZ,
        r,
        c,
        r * clothCols + c,
      );
      if (r === 0) p.pinned = true;
      particles.push(p);
    }
  }

  const get = (r, c) => particles[r * clothCols + c];
  const primaryStiffness = clothPhysics.stretchStiffness;
  const diagonalStiffness = clothPhysics.shearStiffness;
  const bendStiffness = clothPhysics.bendStiffness;

  for (let r = 0; r < clothRows; r++) {
    for (let c = 0; c < clothCols; c++) {
      if (c < clothCols - 1)
        constraints.push(
          new Constraint(
            get(r, c),
            get(r, c + 1),
            segW,
            r === 0 ? 1 : primaryStiffness,
          ),
        );
      if (r < clothRows - 1)
        constraints.push(
          new Constraint(get(r, c), get(r + 1, c), segH, primaryStiffness),
        );
      if (r < clothRows - 1 && c < clothCols - 1) {
        const d = Math.sqrt(segW * segW + segH * segH);
        constraints.push(
          new Constraint(get(r, c), get(r + 1, c + 1), d, diagonalStiffness),
        );
        constraints.push(
          new Constraint(get(r, c + 1), get(r + 1, c), d, diagonalStiffness),
        );
      }
      if (r < clothRows - 2)
        constraints.push(
          new Constraint(get(r, c), get(r + 2, c), segH * 2, bendStiffness),
        );
      if (c < clothCols - 2)
        constraints.push(
          new Constraint(
            get(r, c),
            get(r, c + 2),
            segW * 2,
            r === 0 ? 1 : bendStiffness,
          ),
        );
    }
  }

  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(clothCols * clothRows * 3);
  const normals = new Float32Array(clothCols * clothRows * 3);
  const uvs = new Float32Array(clothCols * clothRows * 2);
  const indices = [];

  for (let r = 0; r < clothRows; r++)
    for (let c = 0; c < clothCols; c++) {
      const i = r * clothCols + c;
      uvs[i * 2] = c / (clothCols - 1);
      uvs[i * 2 + 1] = 1 - r / (clothRows - 1);
    }

  for (let r = 0; r < clothRows - 1; r++) {
    for (let c = 0; c < clothCols - 1; c++) {
      const a = r * clothCols + c;
      const b = r * clothCols + c + 1;
      const d = (r + 1) * clothCols + c;
      const e = (r + 1) * clothCols + c + 1;
      indices.push(a, e, b, a, d, e);
    }
  }

  geo.setIndex(indices);
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

  const placeholderMat = buildReceiptMeshMaterial(null);
  placeholderMat.color = new THREE.Color(0xfdf8f0);
  placeholderMat.side = THREE.DoubleSide;

  receiptMesh = new THREE.Mesh(geo, placeholderMat);
  receiptMesh.castShadow = true;
  receiptMesh.receiveShadow = false;
  scene.add(receiptMesh);

  attachTextureToMesh(geo, receiptLength, receiptWidth);

  // 灯光永久固定
  dirLight.position.copy(FIXED_LIGHT_POS);
  dirLight.target.position.copy(FIXED_LIGHT_TARGET);
  dirLight.target.updateMatrixWorld();

  buildShadowReceiver(receiptWidth, receiptLength);
}

// ==================== 材质与纹理 ====================
function buildReceiptMeshMaterial(texture) {
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.78,
    metalness: 0.0,
    emissive: 0xffffff,
    emissiveIntensity: 0,
  });

  mat.side = THREE.DoubleSide;
  mat.transparent = texture ? hasAlpha(texture.image) : false;
  mat.alphaTest = 0.01;
  mat.fog = true;

  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace("void main() {", `void main() { bool isFront = gl_FrontFacing;`)
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
        if (!isFront) {
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.88, 0.84, 0.76), 0.55);
          gl_FragColor.a = 1.0;
        }`,
      );
  };

  mat.needsUpdate = true;
  return mat;
}

function hasAlpha(img) {
  try {
    const src = img?.src || img?.currentSrc || "";
    return /\.png$/i.test(src);
  } catch (e) {
    return false;
  }
}

function buildReceiptTextureSource(receiptLength, receiptWidth) {
  const img = receiptArt.value;

  // 默认创建白色布料纹理
  const targetWidth = 512;
  const targetHeight = Math.max(
    1,
    Math.round(targetWidth * (receiptLength / receiptWidth)),
  );

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");

  // 白色布料背景
  ctx.fillStyle = "#fdf8f0";
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // 如果有图片，绘制图片
  if (img) {
    const sourceWidth = img.naturalWidth;
    const sourceHeight = img.naturalHeight;
    if (sourceWidth && sourceHeight) {
      const scaledImageHeight = Math.round(
        targetWidth * (sourceHeight / sourceWidth),
      );
      ctx.drawImage(img, 0, 0, targetWidth, scaledImageHeight);
    }
  }

  return canvas;
}

function attachTextureToMesh(geo, receiptLength, receiptWidth) {
  if (!receiptMesh || receiptMesh.geometry !== geo) return;

  const img = receiptArt.value;

  const doAttach = () => {
    if (receiptMesh.material) {
      if (receiptMesh.material.map) receiptMesh.material.map.dispose();
      receiptMesh.material.dispose();
    }

    const textureSource = buildReceiptTextureSource(
      receiptLength,
      receiptWidth,
    );
    if (!textureSource) return;

    const tex = new THREE.Texture(textureSource);
    tex.encoding = THREE.sRGBEncoding;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;

    receiptMesh.material = buildReceiptMeshMaterial(tex);
  };

  // 如果有图片且已加载完成，直接执行
  if (img && img.complete && img.naturalWidth > 0) {
    doAttach();
  } else {
    // 没有图片或图片未加载，直接创建白色布料
    doAttach();
    // 如果有图片，设置加载回调
    if (img) {
      img.onload = doAttach;
    }
  }
}

// ==================== 阴影系统 ====================
function clearShadowReceiver() {
  if (!shadowReceiver) return;
  scene.remove(shadowReceiver);
  shadowReceiver.geometry.dispose();
  shadowReceiver.material.dispose();
  shadowReceiver = null;
}

function applyShadowBlur() {
  if (!dirLight) return;
  dirLight.shadow.radius = BASE_SHADOW_RADIUS * shadowParams.blur;
  dirLight.shadow.needsUpdate = true;
}

function buildShadowReceiver(receiptWidth, receiptLength) {
  clearShadowReceiver();

  const scaledShadowWidth = Math.max(
    receiptWidth * BASE_SHADOW_SCALE_X * shadowParams.size,
    receiptLength * 0.9 * shadowParams.size,
  );
  const scaledShadowHeight =
    receiptLength * BASE_SHADOW_SCALE_Y * shadowParams.size;
  const extraShadowPadX = Math.max(
    4,
    receiptWidth * 0.75,
    shadowParams.blur * 3 + shadowParams.size * 2,
  );
  const extraShadowPadY = Math.max(
    5,
    receiptLength * 0.9,
    shadowParams.blur * 4 + shadowParams.size * 3,
  );
  const rW = scaledShadowWidth + extraShadowPadX * 2;
  const rH = scaledShadowHeight + extraShadowPadY * 2;

  const receiptBottomY = 4 + simParams.canvasOffsetY - receiptLength;
  const cy = receiptBottomY - 1.0 + shadowParams.offsetY;

  const shadowMat = new THREE.ShadowMaterial({
    color: new THREE.Color(shadowParams.colorHex),
    opacity: shadowParams.opacity,
  });
  shadowMat.userData = { shadowOffset: { value: new THREE.Vector2(0, 0) } };
  shadowMat.onBeforeCompile = (shader) => {
    shader.uniforms.shadowOffset = shadowMat.userData.shadowOffset;
    shader.vertexShader =
      "uniform vec2 shadowOffset;\n" +
      shader.vertexShader.replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nworldPosition.xy -= shadowOffset;",
      );
  };

  shadowReceiver = new THREE.Mesh(new THREE.PlaneGeometry(rW, rH), shadowMat);
  shadowReceiver.receiveShadow = true;
  shadowReceiver.position.set(
    simParams.canvasOffsetX + shadowParams.offsetX,
    cy,
    shadowParams.zPosition,
  );
  shadowReceiver.renderOrder = -20;
  scene.add(shadowReceiver);

  // 更新阴影相机范围
  const sc = dirLight.shadow.camera;
  sc.left = -rW * 1.5;
  sc.right = rW * 1.5;
  sc.top = rH * 1.6;
  sc.bottom = -rH * 1.4;
  sc.near = 0.5;
  sc.far = 50;
  sc.updateProjectionMatrix();
}

function applyShadowOffset() {
  if (!shadowReceiver) return;
  const uniform = shadowReceiver.material?.userData?.shadowOffset;
  if (!uniform) return;
  uniform.value.set(shadowParams.offsetX, shadowParams.offsetY);
}

function updateShadow() {
  if (shadowReceiver)
    buildShadowReceiver(simParams.receiptWidth, simParams.receiptLength);
}

// ==================== 物理模拟 ====================
const gravVec = new THREE.Vector3();
const windForce = new THREE.Vector3();
const windLateral = new THREE.Vector3();
const windTurbulence = new THREE.Vector3();

function simulate(dt) {
  windPhase += dt * 0.7;
  const windAngle = THREE.MathUtils.degToRad(simParams.windDirection);
  const gustStrength = simParams.windRandomness;
  const gustScale = 1 + 0.3 * gustStrength * Math.sin(windPhase * 1.3);
  const crossWindScale = 0.18 * gustStrength * Math.sin(windPhase * 0.8 + 1.5);

  windForce.set(Math.cos(windAngle), 0, Math.sin(windAngle));
  if (windForce.lengthSq() > 0) windForce.normalize();
  windLateral.set(-windForce.z, 0, windForce.x);
  windTurbulence.set(
    (Math.random() - 0.5) * simParams.windSpeed * 0.14 * gustStrength,
    0,
    (Math.random() - 0.5) * simParams.windSpeed * 0.08 * gustStrength,
  );

  windForce.multiplyScalar(simParams.windSpeed * gustScale);
  windLateral.multiplyScalar(simParams.windSpeed * crossWindScale);
  windForce.add(windLateral);
  windForce.add(windTurbulence);

  gravVec.set(windForce.x * 0.5, -simParams.gravity, windForce.z * 0.3);

  const subDt = dt / SUBSTEPS;
  for (let s = 0; s < SUBSTEPS; s++) {
    applyDragConstraint(0.8);

    for (const p of particles) {
      if (p.pinned) continue;
      const wj =
        (Math.random() - 0.5) * simParams.windSpeed * 0.1 * gustStrength;
      p.applyForce(new THREE.Vector3(windForce.x + wj, gravVec.y, windForce.z));
      p.integrate(subDt);
    }

    for (let it = 0; it < ITERATIONS; it++)
      for (const c of constraints) c.resolve();

    for (let pass = 0; pass < SELF_COLLISION_PASSES; pass++) {
      applyDragConstraint(0.35);
      solveSelfCollisions();
      for (const c of constraints) c.resolve();
    }

    enforceTopEdge();

    for (const p of particles) {
      if (!p.pinned) {
        if (p.pos.y < -10) {
          p.pos.y = -10;
          p.prev.y = -10;
        }
        if (p.pos.z < shadowParams.zPosition + 0.3) {
          p.pos.z = shadowParams.zPosition + 0.3;
          p.prev.z = p.pos.z;
        }
      }
    }
  }
}

function enforceTopEdge() {
  const p0 = particles[0];
  const startX = p0.pos.x;
  const endX = particles[clothCols - 1].pos.x;
  const w = endX - startX;
  const y = p0.pos.y;
  const z = p0.pos.z;
  for (let c = 0; c < clothCols; c++) {
    const p = particles[c];
    const t = c / (clothCols - 1);
    p.pos.set(startX + t * w, y, z);
    p.prev.copy(p.pos);
  }
}

function updateGeometry() {
  if (!receiptMesh) return;
  const arr = receiptMesh.geometry.attributes.position.array;
  for (let i = 0; i < particles.length; i++) {
    arr[i * 3] = particles[i].pos.x;
    arr[i * 3 + 1] = particles[i].pos.y;
    arr[i * 3 + 2] = particles[i].pos.z;
  }
  receiptMesh.geometry.attributes.position.needsUpdate = true;
  receiptMesh.geometry.computeVertexNormals();
}

// 自碰撞
function areNearbyOnSheet(a, b) {
  const dr = Math.abs(a.row - b.row),
    dc = Math.abs(a.col - b.col);
  return (dr <= 1 && dc <= 1) || (dr === 0 && dc <= 2) || (dc === 0 && dr <= 2);
}

function hashCell(hx, hy, hz) {
  return (
    (hx + HASH_OFFSET) * HASH_X_MULT +
    (hy + HASH_OFFSET) * HASH_Y_MULT +
    (hz + HASH_OFFSET)
  );
}

function buildHash() {
  selfCollisionHash.clear();
  const cs = selfCollisionRadius;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const key = hashCell(
      Math.floor(p.pos.x / cs),
      Math.floor(p.pos.y / cs),
      Math.floor(p.pos.z / cs),
    );
    let b = selfCollisionHash.get(key) || [];
    b.push(i);
    selfCollisionHash.set(key, b);
  }
}

function separatePair(a, b, minD) {
  let dx = b.pos.x - a.pos.x,
    dy = b.pos.y - a.pos.y,
    dz = b.pos.z - a.pos.z;
  const dSq = dx * dx + dy * dy + dz * dz;
  if (dSq >= minD * minD) return;
  let dist = Math.sqrt(dSq) || 1;
  const invA = a.pinned ? 0 : 1,
    invB = b.pinned ? 0 : 1,
    invS = invA + invB;
  if (!invS) return;
  const sc = ((minD - dist) * SELF_COLLISION_STIFFNESS) / dist;
  dx *= sc;
  dy *= sc;
  dz *= sc;
  if (invA) {
    const sh = invA / invS;
    a.pos.x -= dx * sh;
    a.pos.y -= dy * sh;
    a.pos.z -= dz * sh;
  }
  if (invB) {
    const sh = invB / invS;
    b.pos.x += dx * sh;
    b.pos.y += dy * sh;
    b.pos.z += dz * sh;
  }
}

function solveSelfCollisions() {
  buildHash();
  const cs = selfCollisionRadius;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const hx = Math.floor(p.pos.x / cs),
      hy = Math.floor(p.pos.y / cs),
      hz = Math.floor(p.pos.z / cs);
    for (const [ox, oy, oz] of hashNeighbors) {
      const bkt = selfCollisionHash.get(hashCell(hx + ox, hy + oy, hz + oz));
      if (!bkt) continue;
      for (const j of bkt) {
        if (j <= i) continue;
        const other = particles[j];
        if (areNearbyOnSheet(p, other)) continue;
        separatePair(p, other, selfCollisionRadius);
      }
    }
  }
}

// ==================== 拖拽交互 ====================
function getParticleAt(mx, my) {
  mouse.set(
    (mx / window.innerWidth) * 2 - 1,
    -(my / window.innerHeight) * 2 + 1,
  );
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(receiptMesh);
  if (!hits.length) return null;
  const hit = hits[0].point;
  let best = null,
    bestD = Infinity;
  for (const p of particles) {
    if (p.pinned) continue;
    const d = p.pos.distanceTo(hit);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  const pickRadius = Math.max(1.5, Math.max(segmentWidth, segmentHeight) * 2.5);
  return bestD < pickRadius ? best : null;
}

function updateMouseWorld(mx, my) {
  mouse.set(
    (mx / window.innerWidth) * 2 - 1,
    -(my / window.innerHeight) * 2 + 1,
  );
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(dragPlane, dragTarget);
}

function onMouseDown(e) {
  if (e.button !== 0) return;
  const p = getParticleAt(e.clientX, e.clientY);
  if (!p) return;
  mouseDown = true;
  dragParticle = p;
  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir);
  dragPlane.setFromNormalAndCoplanarPoint(camDir.negate(), p.pos);
  updateMouseWorld(e.clientX, e.clientY);
}

function onMouseMove(e) {
  if (!mouseDown || !dragParticle) return;
  updateMouseWorld(e.clientX, e.clientY);
}

function onMouseUp() {
  mouseDown = false;
  dragParticle = null;
}

function onTouchStart(e) {
  const t = e.touches[0];
  const p = getParticleAt(t.clientX, t.clientY);
  if (!p) return;
  mouseDown = true;
  dragParticle = p;
  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir);
  dragPlane.setFromNormalAndCoplanarPoint(camDir.negate(), p.pos);
  updateMouseWorld(t.clientX, t.clientY);
}

function onTouchMove(e) {
  if (!mouseDown || !dragParticle) return;
  updateMouseWorld(e.touches[0].clientX, e.touches[0].clientY);
}

function applyDragConstraint(scale = 1) {
  if (!mouseDown || !dragParticle || dragParticle.pinned) return;
  const dx = dragTarget.x - dragParticle.pos.x;
  const dy = dragTarget.y - dragParticle.pos.y;
  const dz = dragTarget.z - dragParticle.pos.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist < 1e-6) {
    dragParticle.prev.copy(dragParticle.pos);
    return;
  }

  const base = Math.max(segmentWidth, segmentHeight);
  const resp = Math.pow(simParams.dragStrength, 2.2);
  const maxStep = base * (0.03 + resp * 2.8) * scale;
  const step = Math.min(dist, maxStep);
  const inv = step / dist;
  dragParticle.pos.x += dx * inv;
  dragParticle.pos.y += dy * inv;
  dragParticle.pos.z += dz * inv;
  dragParticle.prev.lerp(dragParticle.pos, 0.08 + resp * 0.92);
}

// ==================== 文件处理 ====================
function handleReceiptImage(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (receiptObjectUrl.value) URL.revokeObjectURL(receiptObjectUrl.value);
  receiptObjectUrl.value = URL.createObjectURL(file);

  // 创建或更新图片元素
  if (!receiptArt.value) {
    receiptArt.value = document.createElement("img");
    receiptArt.value.crossOrigin = "anonymous";
    receiptArt.value.style.display = "none";
  }

  receiptArt.value.src = receiptObjectUrl.value;
  receiptImageLabel.value = file.name;
  receiptArt.value.onload = () => rebuildCloth();
}

function handleBgImage(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (bgObjectUrl.value) URL.revokeObjectURL(bgObjectUrl.value);
  bgObjectUrl.value = URL.createObjectURL(file);
  backgroundImageUrl.value = bgObjectUrl.value;
  bgImageLabel.value = file.name;
  useSolidBackground.value = false;
}

// ==================== 灯光与背景应用 ====================
function applyLighting() {
  const hex = lightColor.value;
  const col = new THREE.Color(hex);
  const intensity = getPerceptualLightEnergy(lightIntensity.value);

  ambLight.color.copy(col);
  dirLight.color.copy(col);
  fillLight.color.copy(col);
  ambLight.intensity = BASE_AMBIENT_INTENSITY * intensity;
  dirLight.intensity = BASE_DIRECTIONAL_INTENSITY * intensity;
  fillLight.intensity = BASE_FILL_INTENSITY * intensity;
}

function applyBackground() {
  const hex = bgColor.value;
  const color = new THREE.Color(visibleBaseColor.value);
  if (scene?.fog) scene.fog.color.copy(color);
  applyShadowBlur();
}

function rebuildCloth() {
  nextTick(() => {
    buildCloth(simParams.receiptLength, simParams.receiptWidth);
  });
}

// 检查赞助图片是否存在
function checkSponsorImageExists() {
  const img = new Image();
  img.onload = () => {
    sponsorImageExists.value = true;
  };
  img.onerror = () => {
    sponsorImageExists.value = false;
  };
  img.src = sponsorImageSrc.value;
}

// 赞助图片加载失败处理
function handleSponsorImageError() {
  sponsorImageExists.value = false;
}

// ==================== 动画循环 ====================
function animate() {
  animationId = requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;
  simulate(dt);
  updateGeometry();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ==================== 生命周期 ====================
onMounted(() => {
  initThree();
  applyLighting();
  applyBackground();
  applyShadowBlur();
  buildCloth(simParams.receiptLength, simParams.receiptWidth);
  checkSponsorImageExists();
  lastTime = performance.now();
  animate();

  // 添加全屏模式相关事件监听
  window.addEventListener("mousemove", handleFullscreenMouseMove);
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("mousemove", handleFullscreenMouseMove);
  window.removeEventListener("click", handleClickOutside);
  if (receiptObjectUrl.value) URL.revokeObjectURL(receiptObjectUrl.value);
  if (bgObjectUrl.value) URL.revokeObjectURL(bgObjectUrl.value);
  renderer?.dispose();
});

// 监听参数变化自动重建布料
watch(
  () => [simParams.receiptLength, simParams.receiptWidth],
  () => {
    // 已由 @input 事件触发 rebuildCloth
  },
  { deep: true },
);
</script>

<style scoped>
.cloth-simulation {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: v-bind(visibleBaseColor);
}

/* 背景层 */
.bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}
.bg-base,
.bg-image {
  position: absolute;
  inset: 0;
}
.bg-image {
  background-repeat: no-repeat;
  will-change: background-position, background-size, filter;
}

/* 赞助图片 */
.sponsor-img {
  position: fixed;
  top: 48%;
  left: 50%;
  width: min(80vw, 80vh);
  max-width: 80vw;
  max-height: 80vh;
  transform: translate(-50%, -50%);
  object-fit: contain;
  z-index: 5;
  pointer-events: none;
  user-select: none;
}

/* 画布 */
.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}
.canvas-container canvas {
  display: block;
}

/* 控制面板 */
.controls {
  position: fixed;
  top: 16px;
  left: 16px;
  bottom: 16px;
  width: 280px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 1000;
  user-select: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.controls.collapsed {
  bottom: auto;
  max-height: 48px;
}
.controls.fullscreen-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-100%);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);
}
.panel-title {
  font-size: 15px;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.6px;
}
.panel-toggle {
  font-size: 12px;
  color: #666;
}

.panel-body {
  padding: 14px;
  overflow-y: scroll;
  flex: 1;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
.panel-body::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.panel-body::-webkit-scrollbar-track {
  background: transparent;
}
.panel-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
panel-body::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
.panel-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

/* 菜单触发按钮 */
.menu-trigger {
  position: fixed;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  width: 36px;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 18px;
  color: #4a90d9;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
.menu-trigger:hover {
  background: rgba(255, 255, 255, 1);
  width: 44px;
}

.canvas-container {
}

/* 分组 */
.section {
  margin-bottom: 20px;
}
.section-title {
  width: 100%;
  padding: 10px 0 8px;
  font-size: 15px;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.6px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 14px;
  text-align: center;
}

/* 控制项 */
.ctrl {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin-bottom: 14px;
  width: 100%;
}
.ctrl label {
  font-size: 12.5px;
  color: #555;
  font-weight: 600;
  letter-spacing: 0.4px;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
}
.ctrl .val {
  font-size: 13px;
  color: #222;
  font-weight: 700;
}
.ctrl input[type="range"] {
  width: 100%;
  accent-color: #444;
  cursor: pointer;
  height: 5px;
  border-radius: 999px;
}
.ctrl input[type="color"] {
  width: 100%;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 2px;
  cursor: pointer;
}
.ctrl input[type="file"] {
  width: 100%;
  font-size: 13px;
  color: #222;
}
.ctrl select {
  width: 100%;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  color: #222;
  background: rgba(255, 255, 255, 0.98);
  outline: none;
  cursor: pointer;
}
.ctrl .file-label {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
.ctrl.toggle {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.ctrl.toggle label {
  width: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.ctrl.toggle input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #444;
  cursor: pointer;
}

/* 模板按钮 */
.template-btn {
  padding: 8px 16px;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}
.template-btn:hover {
  background: #3a7bc8;
  transform: translateY(-2px);
}

/* 弹窗遮罩 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

/* 弹窗内容 */
.modal-content {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #eee;
  color: #666;
}

.modal-body {
  padding: 24px;
}

/* 模板网格 */
.template-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.template-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-item:hover {
  border-color: #4a90d9;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(74, 144, 217, 0.2);
}

.template-item.selected {
  border-color: #4a90d9;
  background: rgba(74, 144, 217, 0.1);
}

.template-thumbnail {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
}

.template-icon {
  font-size: 24px;
}

.template-name {
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>
