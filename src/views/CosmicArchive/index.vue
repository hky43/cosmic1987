<
<template>
  <PagePreloader title="宇宙档案">
    <div class="cosmic-wall">
      <!-- 画布 -->
      <canvas
        ref="canvasRef"
        :class="['wall-canvas', { 'is-grabbing': isDragging }]"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @contextmenu.prevent
      ></canvas>

      <!-- 
      Focus 模式下的文字介绍层 
      只有在 phase === 'active' 时才挂载到 DOM
    -->
      <Transition name="info-rise">
        <div v-if="showInfo" class="focus-info" @click.stop>
          <div class="info-meta">
            <span class="meta-id"
              >NO. {{ String(focusTarget.id + 1).padStart(2, "0") }}</span
            >
            <span class="meta-line"></span>
            <span class="meta-tag">COSMIC ARCHIVE</span>
          </div>
          <h2 class="info-title">{{ focusTarget.title }}</h2>
          <p class="info-desc">{{ focusTarget.desc }}</p>
          <div class="info-hint">点击画面任意处返回星图</div>
        </div>
      </Transition>

      <!-- Grid 模式下的操作提示 -->
      <div v-if="mode === 'grid'" class="controls-hint">
        <span class="hint-block"><kbd>单击</kbd> 查看档案</span>
        <span class="hint-separator">·</span>
        <span class="hint-block"
          ><kbd>长按左键</kbd> 或 <kbd>中键</kbd> 拖拽星图</span
        >
      </div>

      <!-- 操作按钮组 -->
      <div class="action-buttons">
        <button class="standby-btn" @click="enterStandby" aria-label="待机模式">
          ○ STANDBY
        </button>
        <BackToHomeButton />
      </div>

      <!-- 待机页面 -->
      <Transition name="standby-fade">
        <div v-if="isStandby" class="standby-overlay" @click="exitStandby">
          <div class="standby-content" @click.stop>
            <div class="standby-glow"></div>
            <div class="standby-ring"></div>
            <div class="standby-pulse"></div>
            <div class="standby-text">
              <span class="standby-label">SYSTEM STANDBY</span>
              <span class="standby-status">Awaiting Command...</span>
              <span class="standby-hint">按 ESC 或点击按钮返回</span>
            </div>
            <button class="standby-exit-btn" @click="exitStandby">
              ▶ EXIT STANDBY
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </PagePreloader>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  computed,
  inject,
} from "vue";
import PagePreloader from "../../components/PagePreloader.vue";
import BackToHomeButton from "../../components/BackToHomeButton.vue";
import { audioManager } from "../../utils/audioManager";
import { asset } from "../../utils/asset";

defineOptions({ name: "CosmicArchivePage" });

const setPageReady = inject("setPageReady", () => {});

/* =========================================
   0. 配置项
   ========================================= */
const CONFIG = {
  imgTotal: 12, // 档案卡片总数 (4列 × 3行 = 12)
  rowMax: 4, // 横向列数
  lineMax: 3, // 纵向行数
  imgWidth: 350, // 卡片宽
  imgHeight: 500, // 卡片高
  imgMargin: 120, // 卡片间距
  imgRadius: 12, // 卡片圆角半径
  longPressDelay: 300, // 长按判定阈值 (ms)
  moveThreshold: 6, // 点击/拖拽判定像素阈值
  friction: 0.95, // 惯性摩擦系数 (越接近1滑行越远，0.95=丝滑)
  stopThreshold: 0.3, // 速度低于此值停止物理运算
  focusSpeed: 0.03, // 聚焦动画进度增量 (约1秒完成)
};

/* =========================================
   图片路径与元数据（40张图片）
   ========================================= */
const IMAGE_DATA = [
  {
    name: "101-KSC-77P-232~large.jpg",
    title: "阿波罗17号",
    desc: "1972年阿波罗17号任务拍摄的月球表面影像，人类最后一次登月任务的珍贵记录。",
  },
  {
    name: "1902年《科学：儿童读本》插图_1_古老商店_来自小红书网页版.jpg",
    title: "星际幻想",
    desc: "1902年科学读物中的太空插画，展现了早期人类对宇宙的浪漫想象。",
  },
  {
    name: "▫️NO.28 LAB ｜我是一颗流星_1_NO.28 LAB_来自小红书网页版.jpg",
    title: "流星之梦",
    desc: "流星划过夜空的绝美瞬间，承载着人类对宇宙的无限遐想。",
  },
  {
    name: "🪐画过的科幻片海报大合集_2_映画之夏_来自小红书网页版.jpg",
    title: "科幻海报合集",
    desc: "经典科幻电影海报的艺术集锦，视觉美学与科幻想象力的完美融合。",
  },
  {
    name: "🛰️ 第一颗人造卫星纪念海报_1_trance_来自小红书网页版.jpg",
    title: "斯普特尼克",
    desc: "人类第一颗人造卫星纪念海报，开启太空时代的历史性时刻。",
  },
  {
    name: "暗淡蓝点_旅行者1号的回眸_1_张岱樾_来自小红书网页版.jpg",
    title: "暗淡蓝点",
    desc: "旅行者1号从64亿公里外回望地球，我们的家园只是宇宙中的一粒微尘。",
  },
  {
    name: "复古未来主义CD_2_美学仓库_来自小红书网页版.jpg",
    title: "复古未来",
    desc: "复古未来主义风格的视觉设计，融合怀旧与科幻美学的独特魅力。",
  },
  {
    name: "海伯利安的陨落_1_鲑骨三千_来自小红书网页版.jpg",
    title: "海伯利安",
    desc: "科幻经典《海伯利安》的视觉诠释，时空迷宫中的诗意陨落。",
  },
  {
    name: "航天类插画分享_1_好设计分享_来自小红书网页版.jpg",
    title: "航天之梦",
    desc: "人类探索宇宙的梦想蓝图，火箭与星辰的浪漫对话。",
  },
  {
    name: "诺兰《星际穿越》54幅收录–2_3_小红薯18911007_来自小红书网页版.jpg",
    title: "星际穿越",
    desc: "诺兰经典科幻电影《星际穿越》的概念艺术，黑洞与五维空间的视觉奇观。",
  },
  {
    name: "拼贴作品《Weightlessness 失重》系列_1_Polaris Dust_来自小红书网页版.jpg",
    title: "失重时刻",
    desc: "失重状态下的视觉探索，漂浮于星海之间的诗意瞬间。",
  },
  {
    name: "审美积累｜Stuart创造的【未来主义神域】_1_Boucher设计工作站_来自小红书网页版 - 副本.jpg",
    title: "未来主义神域",
    desc: "Stuart创造的未来主义视觉艺术，超越时空的美学探索。",
  },
  {
    name: "时间或许是只对人起作用的概念_1_三水今天营业了吗。_来自小红书网页版.jpg",
    title: "时间幻象",
    desc: "时间作为人类感知的维度，在宇宙尺度下的哲学思考。",
  },
  {
    name: "苏联的太空时代_1_盐铁官营专卖_来自小红书网页版.jpg",
    title: "苏联太空",
    desc: "苏联太空竞赛时期的视觉遗产，红色星球的雄心壮志。",
  },
  {
    name: "苏联太空竞赛海报(1973)_1_Iurius Borenevus_来自小红书网页版.jpg",
    title: "太空竞赛",
    desc: "1973年苏联太空竞赛宣传海报，冷战时期的航天热情。",
  },
  {
    name: "苏联宣传海报【苏联-航天之国】🚀_1_🍒成熟时_来自小红书网页版.jpg",
    title: "航天之国",
    desc: "苏联航天宣传艺术，展现苏维埃时代的太空梦想。",
  },
  {
    name: "太空×美学 _ 收集关于宇宙🪐的美丽碎片_1_Kosmos Intelligence_来自小红书网页版.jpg",
    title: "宇宙美学",
    desc: "宇宙之美的视觉碎片，星空与星云的诗意收集。",
  },
  {
    name: "太空×美学 _ 前苏联航天海报设计美学🛰️_1_Kosmos Intelligence_来自小红书网页版.jpg",
    title: "苏联航天美学",
    desc: "前苏联航天海报的独特设计美学，复古与科幻的完美结合。",
  },
  {
    name: "太空×美学 _ 前苏联航天海报设计美学🛰️_4_Kosmos Intelligence_来自小红书网页版.jpg",
    title: "航天设计美学",
    desc: "前苏联航天视觉设计的美学探索，红色时代的太空梦想。",
  },
  {
    name: "原创海报｜致敬库布里克《2001太空漫游》_1_Leeykon_来自小红书网页版.jpg",
    title: "2001漫游",
    desc: "致敬库布里克经典《2001太空漫游》的原创视觉作品。",
  },
  {
    name: "重返未来 2.7 1987宇宙组曲 官方壁纸全收集_1_外星人_来自小红书网页版 (1).jpg",
    title: "重返未来",
    desc: "1987年宇宙组曲视觉设计，复古电子美学与太空幻想的融合。",
  },
  {
    name: "无限延伸  _艺术家Frank Moth_1_泉音_来自小红书网页版.jpg",
    title: "无限延伸",
    desc: "艺术家Frank Moth的超现实作品，探索宇宙无限延伸的边界。",
  },
  {
    name: "无限延伸  _艺术家Frank Moth_4_泉音_来自小红书网页版.jpg",
    title: "宇宙延伸",
    desc: "Frank Moth的太空主题艺术，展现宇宙无限可能的视觉表达。",
  },
  {
    name: "远旅高清壁纸_1_thirty-seven🍀_来自小红书网页版.png",
    title: "远旅",
    desc: "深空旅行的视觉想象，穿越星际的孤独与壮丽。",
  },
  {
    name: "永别了旅行者一号，此刻距离我们250亿公里_1_宇宙观察者_来自小红书网页版.jpg",
    title: "旅行者一号",
    desc: "旅行者一号已飞离太阳系，成为人类最远的星际使者。",
  },
  {
    name: "一封延续1977年的宇宙来信_1_xiaoè小鳄日记_来自小红书网页版.jpg",
    title: "宇宙来信",
    desc: "1977年旅行者号携带的地球问候，穿越星际的文明信使。",
  },
  {
    name: "追求永恒定格的星河浪漫_1_Zeaoke Cinema RAW_来自小红书网页版.jpg",
    title: "星河浪漫",
    desc: "星空摄影的极致浪漫，捕捉宇宙永恒瞬间的视觉艺术。",
  },
  {
    name: "Artemis × 复古未来_2_Newton_来自小红书网页版.jpg",
    title: "阿尔忒弥斯",
    desc: "阿尔忒弥斯计划的复古未来主义视觉设计，重返月球的新篇章。",
  },
  {
    name: "𝐑𝐄𝐂𝐎𝐍𝐂𝐈𝐋𝐈𝐀𝐓𝐈𝐎𝐍_1_潮间带_T_来自小红书网页版.jpg",
    title: "宇宙和解",
    desc: "宇宙与人类的和解，在无垠星空中寻找存在的意义。",
  },
  {
    name: "ARC-1977-A77-0851~medium.jpg",
    title: "档案77-0851",
    desc: "1977年太空档案馆藏，旅行者号发射之年的珍贵影像。",
  },
  {
    name: "ARC-1979-A79-7028~orig.jpg",
    title: "档案79-7028",
    desc: "1979年星际档案记录，土星探测的历史性时刻。",
  },
  {
    name: "ARC-1979-A79-7072~orig.jpg",
    title: "档案79-7072",
    desc: "木星大红斑的近距离观测记录，气态巨行星的风暴之眼。",
  },
  {
    name: "ARC-1979-A79-7086~medium.jpg",
    title: "档案79-7086",
    desc: "外太阳系探测任务的珍贵影像档案。",
  },
  {
    name: "ARC-1979-A79-7100~orig.jpg",
    title: "档案79-7100",
    desc: "星际探测器传回的深空影像，探索未知边界。",
  },
  {
    name: "ARC-1981-A86-7007~large.jpg",
    title: "档案81-7007",
    desc: "1981年航天飞机首飞的历史性影像记录。",
  },
  {
    name: "ARC-1986-A86-7023~medium.jpg",
    title: "档案86-7023",
    desc: "挑战者号任务时期的珍贵档案影像。",
  },
  {
    name: "pia17035.jpg",
    title: "火星影像",
    desc: "火星表面的高清影像，红色星球的地质特征探索。",
  },
  {
    name: "PIA21739~orig.jpg",
    title: "土星之环",
    desc: "卡西尼号拍摄的土星环高清影像，太阳系最壮美的奇观。",
  },
  {
    name: "PIA21746~orig.jpg",
    title: "土卫六",
    desc: "土卫六泰坦的神秘表面，拥有甲烷湖泊的奇异世界。",
  },
  {
    name: "Quicker_20260404_094337.png",
    title: "星云幻象",
    desc: "深空星云的艺术化呈现，宇宙尘埃与星光的交织。",
  },
];

/* =========================================
   1. 响应式状态（供模板使用）
   ========================================= */
const canvasRef = ref(null);
const mode = ref("grid"); // 'grid' | 'focus'
const focusPhase = ref("idle"); // 'idle' | 'entering' | 'active' | 'exiting'
const focusProgress = ref(0); // 0 ~ 1，控制聚焦/退出动画
const focusTarget = ref(null); // 当前聚焦的档案对象
const isDragging = ref(false); // 控制光标样式
const isStandby = ref(false); // 是否处于待机模式

// 文字介绍是否显示（进入 active 阶段后延迟一点出现更有仪式感）
const showInfo = computed(() => focusPhase.value === "active");

/* =========================================
   2. 内部运行状态（不暴露给模板，避免响应式损耗）
   ========================================= */
let ctx = null; // Canvas 2D 上下文
let imgList = []; // 所有档案卡片数据
let totalWidth = 0; // 理论网格总宽（用于边界循环）
let totalHeight = 0; // 理论网格总高
let snapshotPositions = null; // 进入 Focus 时所有卡片的坐标快照 [{x,y}, ...]

// --- 物理惯性状态 ---
let velocityX = 0; // 当前横向速度 (像素/帧)
let velocityY = 0; // 当前纵向速度
let isPhysicsActive = false; // 是否正在惯性滑行

// --- 鼠标交互状态机 ---
const mouse = {
  isDown: false,
  isDragging: false,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  startTime: 0,
  timer: null,
};

// --- 动画循环 ---
let rafId = null;

/* =========================================
   3. 图片加载器（支持裁剪/填充统一尺寸）
   ========================================= */
function loadImageWithCover(id) {
  return new Promise((resolve) => {
    const imageData = IMAGE_DATA[id % IMAGE_DATA.length];
    const img = new Image();

    // 【新增】必须在 src 赋值前设置，允许跨域图片进入 Canvas
    img.crossOrigin = "anonymous";

    // 【新增】COS 基础地址，末尾强制补斜杠（防止 .env 漏写）
    const assetBase =
      (import.meta.env.VITE_ASSET_BASE || "").replace(/\/$/, "") + "/";

    img.onload = () => {
      // 创建目标尺寸的画布
      const canvas = document.createElement("canvas");
      canvas.width = CONFIG.imgWidth;
      canvas.height = CONFIG.imgHeight;
      const ctx = canvas.getContext("2d");

      // 背景：深空黑（处理透明图片）
      ctx.fillStyle = "#141414";
      ctx.fillRect(0, 0, CONFIG.imgWidth, CONFIG.imgHeight);

      // 计算裁剪/填充参数（cover模式）
      const imgRatio = img.width / img.height;
      const targetRatio = CONFIG.imgWidth / CONFIG.imgHeight;

      // 计算源图像的裁剪区域（sx, sy, sWidth, sHeight）
      let sx, sy, sWidth, sHeight;

      if (imgRatio > targetRatio) {
        // 图片更宽，裁剪左右两侧，保留中间部分
        sHeight = img.height;
        sWidth = img.height * targetRatio;
        sx = (img.width - sWidth) / 2;
        sy = 0;
      } else {
        // 图片更高，裁剪上下两侧，保留中间部分
        sWidth = img.width;
        sHeight = img.width / targetRatio;
        sx = 0;
        sy = (img.height - sHeight) / 2;
      }

      // 使用9参数drawImage进行居中裁剪并缩放到目标尺寸
      // drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(
        img,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        CONFIG.imgWidth,
        CONFIG.imgHeight,
      );

      // 添加边框：暗金细线
      ctx.strokeStyle = "rgba(200, 180, 140, 0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, CONFIG.imgWidth - 1, CONFIG.imgHeight - 1);

      // 顶部装饰条
      ctx.fillStyle = "rgba(200, 180, 140, 0.08)";
      ctx.fillRect(20, 20, CONFIG.imgWidth - 40, 2);

      // 底部装饰条
      ctx.fillRect(20, CONFIG.imgHeight - 22, CONFIG.imgWidth - 40, 2);

      // 模拟轻微胶片噪点
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.02})`;
        ctx.fillRect(
          Math.random() * CONFIG.imgWidth,
          Math.random() * CONFIG.imgHeight,
          1,
          1,
        );
      }

      const resultImg = new Image();
      resultImg.onload = () => resolve({ img: resultImg, imageData });
      resultImg.src = canvas.toDataURL("image/png");
    };

    img.onerror = () => {
      // 如果加载失败，生成占位图
      console.warn(`Failed to load image: ${imageData.name}`);
      generatePlaceholder(id).then((placeholder) => {
        resolve({ img: placeholder, imageData });
      });
    };

    // 【修改】从 COS 加载图片，使用 asset 函数
    // asset() 内部已通过 encodePathSegments 处理编码，无需再 encodeURIComponent
    img.src = asset(`Cosmicswave/${imageData.name}`);
  });
}

/* =========================================
   3.1 占位卡片生成器（备用）
   ========================================= */
function generatePlaceholder(id) {
  return new Promise((resolve) => {
    const c = document.createElement("canvas");
    c.width = CONFIG.imgWidth;
    c.height = CONFIG.imgHeight;
    const o = c.getContext("2d");

    // 背景：深空黑
    o.fillStyle = "#141414";
    o.fillRect(0, 0, CONFIG.imgWidth, CONFIG.imgHeight);

    // 边框：暗金细线
    o.strokeStyle = "rgba(200, 180, 140, 0.25)";
    o.lineWidth = 1;
    o.strokeRect(0.5, 0.5, CONFIG.imgWidth - 1, CONFIG.imgHeight - 1);

    // 顶部装饰条
    o.fillStyle = "rgba(200, 180, 140, 0.08)";
    o.fillRect(20, 20, CONFIG.imgWidth - 40, 2);

    // 中央大号幽灵编号
    o.fillStyle = "rgba(255, 255, 255, 0.05)";
    o.font = 'bold 160px "Courier New", monospace';
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.fillText(
      String(id + 1).padStart(2, "0"),
      CONFIG.imgWidth / 2,
      CONFIG.imgHeight / 2 - 20,
    );

    // 中央标题
    o.fillStyle = "rgba(255, 255, 255, 0.80)";
    o.font = 'bold 18px "Courier New", monospace';
    o.fillText(
      `ARCHIVE ${id + 1}`,
      CONFIG.imgWidth / 2,
      CONFIG.imgHeight / 2 + 60,
    );

    // 底部状态
    o.fillStyle = "rgba(200, 180, 140, 0.45)";
    o.font = '12px "Courier New", monospace';
    o.fillText(
      "AWAITING VISUAL DATA",
      CONFIG.imgWidth / 2,
      CONFIG.imgHeight - 40,
    );

    // 模拟胶片噪点
    for (let i = 0; i < 400; i++) {
      o.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
      o.fillRect(
        Math.random() * CONFIG.imgWidth,
        Math.random() * CONFIG.imgHeight,
        1,
        1,
      );
    }

    const img = new Image();
    img.onload = () => resolve(img);
    img.src = c.toDataURL("image/png");
  });
}

/* =========================================
   4. 初始化
   ========================================= */
function init() {
  const canvas = canvasRef.value;
  ctx = canvas.getContext("2d", { alpha: false });

  // 计算理论总尺寸，用于无限循环边界判定
  totalWidth =
    CONFIG.rowMax * (CONFIG.imgWidth + CONFIG.imgMargin) - CONFIG.imgMargin;
  totalHeight =
    CONFIG.lineMax * (CONFIG.imgHeight + CONFIG.imgMargin) - CONFIG.imgMargin;

  resize();
  createImageData();

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", onKeyDown);

  // 启动统一动画循环
  startLoop();
}

function resize() {
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  draw(); // 尺寸变化立即重绘，避免白屏
}

/* =========================================
   5. 创建档案数据（加载真实图片并统一尺寸）
   ========================================= */
async function createImageData() {
  imgList = new Array(CONFIG.imgTotal).fill(null);

  // 从40张图片中随机选择28张，确保每次加载都不同
  const allIndices = Array.from({ length: IMAGE_DATA.length }, (_, i) => i);
  shuffleArray(allIndices);
  // 只取前28个随机索引
  const selectedIndices = allIndices.slice(0, CONFIG.imgTotal);

  // 计算网格居中偏移
  const canvas = canvasRef.value;
  const offsetX =
    (canvas.width -
      (CONFIG.rowMax * (CONFIG.imgWidth + CONFIG.imgMargin) -
        CONFIG.imgMargin)) /
    2;
  const offsetY =
    (canvas.height -
      (CONFIG.lineMax * (CONFIG.imgHeight + CONFIG.imgMargin) -
        CONFIG.imgMargin)) /
    2;

  for (let i = 0; i < CONFIG.imgTotal; i++) {
    const originalIndex = selectedIndices[i]; // 使用随机选择的索引
    const colIndex = i % CONFIG.rowMax;
    const lineIndex = Math.floor(i / CONFIG.rowMax);
    const x = offsetX + colIndex * (CONFIG.imgWidth + CONFIG.imgMargin);
    const y = offsetY + lineIndex * (CONFIG.imgHeight + CONFIG.imgMargin);

    // 加载真实图片（支持裁剪/填充统一尺寸）
    const { img, imageData } = await loadImageWithCover(originalIndex);

    imgList[i] = {
      img,
      x,
      y, // 当前画布坐标（实时变化）
      originX: x, // 初始网格坐标（仅参考）
      originY: y,
      id: i,
      title: imageData.title || `星际档案 ${i + 1}`,
      desc:
        imageData.desc ||
        `这是来自宇宙舞曲第 ${i + 1} 号深空探测器的视觉回传数据。`,
    };

    // 单张就绪立即绘制，减少白屏等待
    if (mode.value === "grid") {
      ctx.drawImage(img, x, y, CONFIG.imgWidth, CONFIG.imgHeight);
    }

    // 全部就绪后统一绘制一次，修正层级
    if (imgList.every((item) => item !== null)) {
      draw();
      onImagesLoaded();
    }
  }
}

/* =========================================
   5.1 Fisher-Yates 洗牌算法
   ========================================= */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* =========================================
   6. 坐标更新（只做数学运算，不绘制）
   ========================================= */
function updatePositions(dx, dy) {
  const canvas = canvasRef.value;
  const canvasW = canvas.width;
  const canvasH = canvas.height;

  for (const item of imgList) {
    if (!item) continue;
    item.x += dx;
    item.y += dy;

    // 只有在星图浏览模式下才做无限边界循环
    // Focus 模式下禁用循环，保证聚焦动画位置稳定
    if (mode.value === "grid") {
      // 【修复】使用画布边界判断，图片完全出屏幕后才循环，避免提前消失
      // 右边界：图片左边缘超出画布右边缘
      if (item.x > canvasW) {
        item.x -= totalWidth + CONFIG.imgMargin;
      }
      // 左边界：图片右边缘超出画布左边缘
      if (item.x + CONFIG.imgWidth < 0) {
        item.x += totalWidth + CONFIG.imgMargin;
      }
      // 下边界：图片上边缘超出画布下边缘
      if (item.y > canvasH) {
        item.y -= totalHeight + CONFIG.imgMargin;
      }
      // 上边界：图片下边缘超出画布上边缘
      if (item.y + CONFIG.imgHeight < 0) {
        item.y += totalHeight + CONFIG.imgMargin;
      }
    }
  }
}

/* =========================================
   7. 统一绘制入口（唯一渲染函数）
   ========================================= */
function draw() {
  const canvas = canvasRef.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (mode.value === "grid") {
    // 星图模式：正常绘制所有卡片
    for (const item of imgList) {
      if (!item) continue;
      drawImageWithRoundedCorner(
        item.img,
        item.x,
        item.y,
        CONFIG.imgWidth,
        CONFIG.imgHeight,
        CONFIG.imgRadius,
      );
    }
    // 绘制拖拽标识（置于图片之上）
    drawDragIndicator();
    return;
  }

  // ===== Focus 模式绘制 =====
  const progress = focusProgress.value;
  // easeOutCubic：开始快结尾慢，营造"精准着陆"感
  const ease = 1 - Math.pow(1 - progress, 3);

  const canvasW = canvas.width;
  const canvasH = canvas.height;
  const centerX = canvasW / 2 - CONFIG.imgWidth / 2;
  const centerY = canvasH / 2 - CONFIG.imgHeight / 2;

  const target = focusTarget.value;
  const snap = snapshotPositions[target.id];
  // panX/Y：为了让目标卡片到达画布中心，整个星图需要平移的距离
  const panX = centerX - snap.x;
  const panY = centerY - snap.y;

  if (focusPhase.value === "entering") {
    // 进入动画：其他卡片淡出，目标卡片滑向中心
    const otherAlpha = Math.max(0, 1 - ease * 1.8); // 其他卡片消失得更快
    ctx.globalAlpha = otherAlpha;

    for (const item of imgList) {
      if (!item || item.id === target.id) continue;
      const s = snapshotPositions[item.id];
      // 所有卡片作为一个整体刚性平移，保持相对间距
      const x = s.x + panX * ease;
      const y = s.y + panY * ease;
      drawImageWithRoundedCorner(
        item.img,
        x,
        y,
        CONFIG.imgWidth,
        CONFIG.imgHeight,
        CONFIG.imgRadius,
      );
    }

    ctx.globalAlpha = 1; // 重置透明度

    // 目标卡片：始终不透明，滑向中心
    const tx = snap.x + panX * ease;
    const ty = snap.y + panY * ease;
    drawImageWithRoundedCorner(
      target.img,
      tx,
      ty,
      CONFIG.imgWidth,
      CONFIG.imgHeight,
      CONFIG.imgRadius,
    );
  } else if (focusPhase.value === "active") {
    // 完全聚焦：只画目标卡片在正中央，其他完全消失
    drawImageWithRoundedCorner(
      target.img,
      centerX,
      centerY,
      CONFIG.imgWidth,
      CONFIG.imgHeight,
      CONFIG.imgRadius,
    );
  } else if (focusPhase.value === "exiting") {
    // 退出动画：反向播放。从中心位置回到快照位置
    const otherAlpha = ease; // 其他卡片从0淡入到1
    ctx.globalAlpha = otherAlpha;

    for (const item of imgList) {
      if (!item || item.id === target.id) continue;
      const s = snapshotPositions[item.id];
      // 1-ease：从平移状态回到原始状态
      const x = s.x + panX * (1 - ease);
      const y = s.y + panY * (1 - ease);
      drawImageWithRoundedCorner(
        item.img,
        x,
        y,
        CONFIG.imgWidth,
        CONFIG.imgHeight,
        CONFIG.imgRadius,
      );
    }

    ctx.globalAlpha = 1;

    // 目标卡片从中心退回原位
    const tx = snap.x + panX * (1 - ease);
    const ty = snap.y + panY * (1 - ease);
    drawImageWithRoundedCorner(
      target.img,
      tx,
      ty,
      CONFIG.imgWidth,
      CONFIG.imgHeight,
      CONFIG.imgRadius,
    );
  }
}

/* =========================================
   7.1 绘制带圆角的图片
   ========================================= */
function drawImageWithRoundedCorner(img, x, y, width, height, radius) {
  ctx.save();
  // 创建圆角路径
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.clip();
  // 绘制图片
  ctx.drawImage(img, x, y, width, height);
  ctx.restore();
}

/* =========================================
   7.2 绘制拖拽标识 - 四角 DRAG 文字
   ========================================= */
let dragIndicatorProgress = 0; // 0-1，控制拖拽标识的滑入滑出
let isShowingDragIndicator = false;

function drawDragIndicator() {
  const canvas = canvasRef.value;
  const w = canvas.width;
  const h = canvas.height;

  // 更新拖拽标识进度
  if (mouse.isDragging && mode.value === "grid") {
    isShowingDragIndicator = true;
    dragIndicatorProgress = Math.min(1, dragIndicatorProgress + 0.15);
  } else if (isPhysicsActive && mode.value === "grid") {
    // 画布还在惯性滑行，保持拖拽标识显示
    isShowingDragIndicator = true;
    dragIndicatorProgress = Math.min(1, dragIndicatorProgress + 0.05);
  } else {
    dragIndicatorProgress = Math.max(0, dragIndicatorProgress - 0.12);
    if (dragIndicatorProgress <= 0) {
      isShowingDragIndicator = false;
      return;
    }
  }

  // 计算拖拽方向向量
  const dx = mouse.lastX - mouse.startX;
  const dy = mouse.lastY - mouse.startY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  ctx.save();

  const centerX = w / 2;
  const centerY = h / 2;

  // ===== 绘制中心圆形背景填充 =====
  const circleRadius = 60;

  // 绘制圆形背景（实心填充）
  ctx.globalAlpha = dragIndicatorProgress * 0.35;
  ctx.fillStyle = "#c8b48c"; // 金色背景
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.fill();

  // 绘制圆形边框（实线，更粗更亮）
  ctx.globalAlpha = dragIndicatorProgress * 0.9;
  ctx.strokeStyle = "#c8b48c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 如果有拖拽移动，绘制方向箭头
  if (distance > 5) {
    const nx = dx / distance;
    const ny = dy / distance;

    // 绘制方向箭头（更粗更明显）
    ctx.globalAlpha = dragIndicatorProgress * 0.95;
    ctx.strokeStyle = "#ffffff"; // 白色箭头更清晰
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    // 主箭头线
    ctx.beginPath();
    ctx.moveTo(centerX - nx * 35, centerY - ny * 35);
    ctx.lineTo(centerX + nx * 35, centerY + ny * 35);
    ctx.stroke();

    // 箭头头部
    const arrowLen = 15;
    const perpX = -ny;
    const perpY = nx;

    ctx.beginPath();
    ctx.moveTo(centerX + nx * 35, centerY + ny * 35);
    ctx.lineTo(
      centerX + nx * (35 - arrowLen) + perpX * arrowLen * 0.8,
      centerY + ny * (35 - arrowLen) + perpY * arrowLen * 0.8,
    );
    ctx.moveTo(centerX + nx * 35, centerY + ny * 35);
    ctx.lineTo(
      centerX + nx * (35 - arrowLen) - perpX * arrowLen * 0.8,
      centerY + ny * (35 - arrowLen) - perpY * arrowLen * 0.8,
    );
    ctx.stroke();

    // 绘制反向箭头（提示可以往回拖）
    ctx.globalAlpha = dragIndicatorProgress * 0.5;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - nx * 25, centerY - ny * 25);
    ctx.stroke();
  }

  ctx.restore();
}

/* =========================================
   8. 统一动画循环（物理惯性 + Focus 动画）
   ========================================= */
function startLoop() {
  if (rafId) return;
  tick();
}

function stopLoop() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function tick() {
  rafId = requestAnimationFrame(tick);
  let needsDraw = false;

  // --- 分支1：星图浏览模式（处理物理惯性）---
  if (mode.value === "grid") {
    if (
      isPhysicsActive &&
      (Math.abs(velocityX) > CONFIG.stopThreshold ||
        Math.abs(velocityY) > CONFIG.stopThreshold)
    ) {
      updatePositions(velocityX, velocityY);
      velocityX *= CONFIG.friction;
      velocityY *= CONFIG.friction;
      needsDraw = true;
    } else {
      isPhysicsActive = false;
      velocityX = 0;
      velocityY = 0;
    }

    // 检查拖拽标识动画是否需要更新
    if (updateDragIndicatorAnimation()) {
      needsDraw = true;
    }
  }

  // --- 分支2：聚焦模式（处理进入/退出过渡动画）---
  else if (mode.value === "focus") {
    if (focusPhase.value === "entering" || focusPhase.value === "exiting") {
      focusProgress.value += CONFIG.focusSpeed;
      if (focusProgress.value >= 1) {
        focusProgress.value = 1;
        if (focusPhase.value === "entering") {
          focusPhase.value = "active"; // 进入稳定态，文字介绍此时浮现
        } else if (focusPhase.value === "exiting") {
          // 退出完成，彻底切回星图
          mode.value = "grid";
          focusPhase.value = "idle";
          focusTarget.value = null;
          snapshotPositions = null;
          focusProgress.value = 0;
        }
      }
      needsDraw = true;
    }
  }

  if (needsDraw) draw();
}

/* =========================================
   9. 鼠标事件处理
   ========================================= */
function getCanvasCoords(e) {
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  // 将鼠标屏幕坐标转换为 Canvas 内部像素坐标
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

function onMouseDown(e) {
  // 如果正在聚焦动画中（非 stable），忽略输入，防止打断
  if (mode.value === "focus" && focusPhase.value !== "active") return;
  // 如果已经处于 focus active，点击任意处触发退出，不进入拖拽
  if (mode.value === "focus" && focusPhase.value === "active") return;

  // 只响应左键(0)和中键(1)
  if (e.button !== 0 && e.button !== 1) return;

  const { x, y } = getCanvasCoords(e);

  mouse.isDown = true;
  mouse.isDragging = false;
  mouse.startX = x;
  mouse.startY = y;
  mouse.lastX = x;
  mouse.lastY = y;
  mouse.startTime = Date.now();

  // 停止之前的物理惯性，准备新的拖拽
  isPhysicsActive = false;
  velocityX = 0;
  velocityY = 0;

  // 中键：直接进入拖拽模式
  if (e.button === 1) {
    mouse.isDragging = true;
    isDragging.value = true;
    e.preventDefault();
    return;
  }

  // 左键：启动长按定时器，超时后转为拖拽
  mouse.timer = setTimeout(() => {
    mouse.isDragging = true;
    isDragging.value = true;
  }, CONFIG.longPressDelay);
}

function onMouseMove(e) {
  if (!mouse.isDown) return;
  // focus active 状态下不处理移动（已锁定）
  if (mode.value === "focus") return;

  const { x, y } = getCanvasCoords(e);

  // 如果移动距离超过阈值，提前判定为拖拽（取消单击）
  const dist = Math.hypot(x - mouse.startX, y - mouse.startY);
  if (!mouse.isDragging && dist > CONFIG.moveThreshold) {
    clearTimeout(mouse.timer);
    mouse.isDragging = true;
    isDragging.value = true;
  }

  if (mouse.isDragging) {
    const dx = x - mouse.lastX;
    const dy = y - mouse.lastY;
    mouse.lastX = x;
    mouse.lastY = y;

    // 实时更新坐标并绘制
    updatePositions(dx, dy);
    draw();

    // 记录瞬时速度（用于松开后惯性滑行）
    // 这里直接取每帧位移，rAF 约 16ms，无需额外除以时间
    velocityX = dx;
    velocityY = dy;
  }
}

function onMouseUp(e) {
  clearTimeout(mouse.timer);

  const { x, y } = getCanvasCoords(e);

  // === 情况A：当前处于 Focus 稳定态，点击任意处退出 ===
  if (mode.value === "focus" && focusPhase.value === "active") {
    exitFocus();
    resetMouse();
    return;
  }

  // === 情况B：当前是拖拽模式，只结束拖拽，不触发点击 ===
  if (mouse.isDragging) {
    // 如果还有速度，启动物理惯性滑行
    if (Math.abs(velocityX) > 0.5 || Math.abs(velocityY) > 0.5) {
      isPhysicsActive = true;
    }
    resetMouse();
    return;
  }

  // === 情况C：判定为"单击"（左键、时间短、位移小）===
  const duration = Date.now() - mouse.startTime;
  const dist = Math.hypot(x - mouse.startX, y - mouse.startY);

  if (
    e.button === 0 &&
    duration < CONFIG.longPressDelay + 80 &&
    dist < CONFIG.moveThreshold
  ) {
    checkImage(x, y);
  }

  resetMouse();
}

function resetMouse() {
  mouse.isDown = false;
  mouse.isDragging = false;
  isDragging.value = false;
}

// 在 tick 中保持拖拽标识的动画
function updateDragIndicatorAnimation() {
  if (isShowingDragIndicator || dragIndicatorProgress > 0) {
    if (!mouse.isDragging && mode.value === "grid") {
      dragIndicatorProgress = Math.max(0, dragIndicatorProgress - 0.08);
      if (dragIndicatorProgress <= 0) {
        isShowingDragIndicator = false;
      }
      return true; // 需要重绘
    }
  }
  return false;
}

/* =========================================
   10. 聚焦模式控制
   ========================================= */
function enterFocus(targetItem) {
  // 1. 保存当前所有卡片的坐标快照（深拷贝）
  snapshotPositions = imgList.map((item) =>
    item ? { x: item.x, y: item.y } : null,
  );

  // 2. 设置状态，启动进入动画
  focusTarget.value = targetItem;
  mode.value = "focus";
  focusPhase.value = "entering";
  focusProgress.value = 0;

  // 3. 停止物理
  isPhysicsActive = false;
  velocityX = 0;
  velocityY = 0;
}

function exitFocus() {
  if (mode.value !== "focus" || focusPhase.value !== "active") return;
  // 启动退出动画
  focusPhase.value = "exiting";
  focusProgress.value = 0;
}

/* =========================================
   11. 图片命中检测
   ========================================= */
function checkImage(x, y) {
  // 从后往前遍历，优先检测视觉上层（后绘制）的卡片
  for (let i = imgList.length - 1; i >= 0; i--) {
    const item = imgList[i];
    if (!item) continue;

    if (
      x >= item.x &&
      x < item.x + CONFIG.imgWidth &&
      y >= item.y &&
      y < item.y + CONFIG.imgHeight
    ) {
      enterFocus(item);
      return;
    }
  }
}

function onKeyDown(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (isStandby.value) {
      exitStandby();
    } else if (mode.value === "focus" && focusPhase.value === "active") {
      exitFocus();
    }
  }
}

/* =========================================
   待机模式控制
   ========================================= */
function enterStandby() {
  isStandby.value = true;
}

function exitStandby() {
  isStandby.value = false;
}

/* =========================================
   12. 生命周期
   ========================================= */
onMounted(async () => {
  try {
    // 主题音乐模式：不需要从 sessionStorage 恢复，主题音乐会保持播放
    console.log("[CosmicArchive Page] 主题音乐模式，音乐由 audioManager 管理");

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
          console.warn("[CosmicArchive] 移除全屏遮罩:", el.className || tag);
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

    // 2. 初始化
    init();
  } catch (error) {
    console.error("Cosmicswave page initialization failed:", error);
  }
});

/**
 * 所有图片加载完成后调用
 */
function onImagesLoaded() {
  console.log("[Cosmicswave] 所有图片加载完成");
  setPageReady();
}

onDeactivated(() => {
  console.log("[CosmicArchive] 组件被缓存（离开），暂停动画");
  stopLoop();
});

onActivated(() => {
  console.log("[CosmicArchive] 组件被激活（返回），恢复动画");
  startLoop();
});

onUnmounted(() => {
  stopLoop();
  window.removeEventListener("resize", resize);
  window.removeEventListener("keydown", onKeyDown);
  clearTimeout(mouse.timer);

  /* 【新增】组件卸载时，手动清理所有残留遮罩 */
  console.log("[CosmicArchive] 组件卸载，清理遮罩");
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
/* =========================================
   画布与容器
   ========================================= */
.cosmic-wall {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #0a0a0a;
  overflow: hidden;
  font-family: "Courier New", Courier, monospace;
}

/* 加载遮罩 */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: #0a0a0f;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: opacity 0.3s ease;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* 黑胶唱片 */
.loading-disc {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #111;
  position: relative;
  animation: spin 2s linear infinite;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.disc-grooves {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: repeating-radial-gradient(
    circle at center,
    transparent 0,
    transparent 2px,
    rgba(255, 255, 255, 0.06) 3px,
    transparent 4px
  );
}

.disc-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
}

.disc-hole {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-title {
  font-size: 11px;
  letter-spacing: 5px;
  color: #666;
  text-transform: uppercase;
  margin: 0;
}

.loading-text {
  color: #ccc;
  font-size: 14px;
  letter-spacing: 3px;
  margin: 0;
}

.loading-track {
  width: 160px;
  height: 2px;
  background: #222;
  border-radius: 1px;
  overflow: hidden;
  margin-top: 8px;
}

.loading-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #fff);
  border-radius: 1px;
  animation: loadingProgress 2s ease-in-out infinite;
}

@keyframes loadingProgress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

.wall-canvas {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.wall-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: default;
}

.wall-canvas.is-grabbing {
  cursor: default;
}

/* =========================================
   Focus 模式文字介绍层
   ========================================= */
.focus-info {
  position: absolute;
  left: 50%;
  bottom: 5vh; /* 位于画面偏下方，不遮挡中央图片 */
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  color: #e0e0e0;
  pointer-events: none; /* 不阻挡点击穿透到画布（退出用） */
  width: 90%;
  max-width: 560px;
}

.info-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 14px;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.meta-id {
  color: #c8b48c; /* 暗金色 */
  font-weight: bold;
}

.meta-line {
  display: block;
  width: 24px;
  height: 1px;
  background: rgba(200, 180, 140, 0.4);
}

.meta-tag {
  color: #666;
}

.info-title {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 14px;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 0 40px rgba(200, 180, 140, 0.25);
}

.info-desc {
  font-size: 13px;
  line-height: 1.9;
  margin: 0 auto 20px;
  color: #999;
  max-width: 480px;
}

.info-hint {
  font-size: 10px;
  letter-spacing: 2px;
  color: #444;
  text-transform: uppercase;
  margin-top: 8px;
}

/* =========================================
   底部操作提示（仅星图模式显示）
   ========================================= */
.controls-hint {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  color: rgba(255, 255, 255, 0.25);
  font-size: 11px;
  letter-spacing: 1px;
  pointer-events: none;
  user-select: none;
}

.hint-block {
  display: flex;
  align-items: center;
  gap: 6px;
}

kbd {
  display: inline-block;
  padding: 3px 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  font-family: inherit;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.hint-separator {
  opacity: 0.3;
}

/* =========================================
   过渡动画
   ========================================= */
.info-rise-enter-active {
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.info-rise-leave-active {
  transition: all 0.4s ease;
}

.info-rise-enter-from,
.info-rise-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(30px);
}

/* =========================================
   操作按钮组
   ========================================= */
.action-buttons {
  position: fixed;
  bottom: 28px;
  right: 180px;
  display: flex;
  gap: 12px;
  z-index: 20;
}

.standby-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.standby-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.standby-btn:active {
  transform: translateY(0);
}

/* =========================================
   待机页面
   ========================================= */
.standby-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.standby-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: default;
  overflow: hidden;
}

.standby-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(200, 180, 140, 0.1) 0%,
    rgba(200, 180, 140, 0.03) 40%,
    transparent 70%
  );
  animation: standbyGlow 4s ease-in-out infinite;
}

.standby-ring {
  position: absolute;
  width: 400px;
  height: 400px;
  border: 1px solid rgba(200, 180, 140, 0.15);
  border-radius: 50%;
  animation: standbyRing 3s linear infinite;
}

.standby-pulse {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid rgba(200, 180, 140, 0.2);
  border-radius: 50%;
  animation: standbyPulse 2s ease-in-out infinite;
}

.standby-text {
  position: relative;
  z-index: 10;
  text-align: center;
  color: #e0e0e0;
}

.standby-label {
  display: block;
  font-size: 14px;
  letter-spacing: 8px;
  text-transform: uppercase;
  color: #c8b48c;
  font-weight: 600;
  margin-bottom: 16px;
}

.standby-status {
  display: block;
  font-size: 12px;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 24px;
}

.standby-hint {
  display: block;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 40px;
}

.standby-exit-btn {
  position: relative;
  z-index: 10;
  padding: 12px 32px;
  background: transparent;
  border: 1px solid rgba(200, 180, 140, 0.4);
  border-radius: 30px;
  color: #c8b48c;
  font-size: 12px;
  font-family: "Courier New", monospace;
  letter-spacing: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.standby-exit-btn:hover {
  background: rgba(200, 180, 140, 0.15);
  border-color: #c8b48c;
}

@keyframes standbyGlow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

@keyframes standbyRing {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes standbyPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
    border-width: 1px;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
    border-width: 2px;
  }
}

/* =========================================
   待机页面过渡动画
   ========================================= */
.standby-fade-enter-active {
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.standby-fade-leave-active {
  transition: all 0.5s ease;
}

.standby-fade-enter-from,
.standby-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.standby-fade-enter-from .standby-content,
.standby-fade-leave-to .standby-content {
  transform: scale(0.9);
}

.standby-fade-enter-active .standby-content,
.standby-fade-leave-active .standby-content {
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
