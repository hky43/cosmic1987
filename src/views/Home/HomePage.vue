<template>
  <!-- 首页加载动画：加载期间始终在 DOM 中（z-index: 9999 浮在最上层） -->
  <HomePageLoading
    v-if="showHomeLoading"
    @prepare-complete="onHomeLoadingPrepare"
    @complete="onHomeLoadingComplete"
  />

  <!-- cosmic-container：首次进入时与加载画面共存，从背后淡入 -->
  <div
    v-if="!showHomeLoading || isEntering"
    class="cosmic-container"
    :class="{ 'is-entering': isEntering }"
  >
    <!-- 侧边导航 -->
    <SideNav
      :chapters="chapters"
      :active-index="activeSection"
      :top-section-info="topSectionInfo"
      :current-y="currentY"
      :show-progress-page="showProgressPage"
      @navigate="jumpToSection"
      @progress-click="toggleProgress"
    />

    <div
      class="main-page"
      ref="mainPageRef"
      :class="{ 'is-hidden': showProgressPage }"
    >
      <div
        class="top-visual"
        ref="topVisualRef"
        :class="{ 'is-leaving': isTopLeaving, 'is-hidden': !showZone01 }"
      >
        <div class="editorial-page" :class="{ 'is-revealed': modelDropping }">
          <!-- 波纹网格背景层 -->
          <WavyGrid
            :xGap="5"
            :yGap="18"
            stroke="rgba(255,255,255,0.25)"
            :strokeWidth="0.5"
            bg="transparent"
            :rippleAmplitude="30"
            :rippleWidth="200"
            :rippleSpeed="30"
            :paused="!showZone01"
            style="position: absolute; inset: 0; z-index: 0"
          />

          <!-- 主视觉区 -->
          <div class="hero" style="position: relative; z-index: 1">
            <!-- 底层 -->
            <div class="layer-back">
              <h1 class="title-cursive">
                <span
                  v-for="(char, i) in 'Cosmic'"
                  :key="'c' + i"
                  class="char"
                  :style="{ animationDelay: 1.15 + i * 0.05 + 's' }"
                  >{{ char }}</span
                >
              </h1>
            </div>

            <!-- 中层：模型舞台 -->
            <div class="model-stage" :class="{ 'is-dropping': modelDropping }">
              <div class="center-badge">
                <span class="badge-line"></span>
                <span class="badge-text"> 宇宙 舞曲 1987 </span>
                <span class="badge-line"></span>
              </div>
              <div class="model-placeholder">
                <Helmet3D
                  :active="modelDropping"
                  :model-path="asset('models/头盔.glb')"
                />
              </div>
            </div>

            <!-- 顶层 -->
            <h1 class="title-bottom">
              <span
                v-for="(char, i) in '1987'"
                :key="'d' + i"
                class="char"
                :style="{ animationDelay: 1.65 + i * 0.05 + 's' }"
                >{{ char }}</span
              >
            </h1>
            <p class="description" :style="{ animationDelay: '2.1s' }">
              On October 4, 1987, a metal sphere<br />
              weighing 83.6 kg became humanity's<br />
              first step into the cosmos.
            </p>
          </div>
        </div>
      </div>

      <!-- 闪光条 -->
      <div class="flash-bar" ref="flashBarRef">
        <div class="flash-glow"></div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- 【滚动内容区】 -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      <div class="scroll-content" ref="scrollContentRef">
        <div class="line-bottom"></div>

        <!-- 顶部占位区 -->
        <div
          class="top-spacer section-marker"
          data-index="0"
          :ref="(el) => setSectionRef(el, 0)"
        ></div>

        <!-- 着陆条 -->
        <div
          class="landing-strip section-marker"
          :ref="(el) => setSectionRef(el, 1)"
        ></div>

        <!-- ═══════════════════════════════════════════════════════════ -->
        <!-- 【区域 2】斯普特尼克时刻 -->
        <!-- ═══════════════════════════════════════════════════════════ -->
        <section
          class="hero-section section-marker dark-theme"
          data-index="1"
          :ref="(el) => setSectionRef(el, 2)"
        >
          <!-- Zone 1: 目录页 -->
          <div class="zone1-content">
            <nav class="zone1-topnav scroll-animate" data-animate="fade-down">
              <div class="topnav-left">
                <a href="#" class="topnav-link">序章</a>
                <a href="#" class="topnav-link">太空竞赛</a>
                <a href="#" class="topnav-link is-active">斯普特尼克</a>
                <a href="#" class="topnav-link">东方计划</a>
                <a href="#" class="topnav-link">登月时代</a>
              </div>
              <div class="topnav-right">
                <span class="topnav-report">Work in Progress Report</span>
                <span class="topnav-brand">Sputnik</span>
                <span class="topnav-page">02</span>
              </div>
            </nav>

            <div class="zone1-grid">
              <div class="zone1-left">
                <div
                  class="toc-section scroll-animate"
                  data-animate="stagger-up"
                >
                  <ul class="toc-list">
                    <li>
                      <span class="toc-text">历史背景</span
                      ><span class="toc-page">50</span>
                    </li>
                    <li>
                      <span class="toc-text is-link">卫星设计参数</span
                      ><span class="toc-page">51</span>
                    </li>
                    <li>
                      <span class="toc-text">拜科努尔发射</span
                      ><span class="toc-page">54</span>
                    </li>
                    <li>
                      <span class="toc-text">信号与轨道</span
                      ><span class="toc-page">56</span>
                    </li>
                    <li>
                      <span class="toc-text">全球反响</span
                      ><span class="toc-page">58</span>
                    </li>
                    <li>
                      <span class="toc-text">太空竞赛开端</span
                      ><span class="toc-page">65</span>
                    </li>
                    <li>
                      <span class="toc-text is-link">科学遗产</span
                      ><span class="toc-page">69</span>
                    </li>
                    <li>
                      <span class="toc-text">后续任务</span
                      ><span class="toc-page">76</span>
                    </li>
                    <li>
                      <span class="toc-text">纪念日</span
                      ><span class="toc-page">77</span>
                    </li>
                    <li>
                      <span class="toc-text">参考文献</span
                      ><span class="toc-page">84</span>
                    </li>
                    <li>
                      <span class="toc-text">致谢</span
                      ><span class="toc-page">90</span>
                    </li>
                  </ul>
                </div>
                <div class="mega-number scroll-animate" data-animate="scale-in">
                  02
                </div>
              </div>

              <div class="zone1-right">
                <h2
                  class="zone1-title scroll-animate"
                  data-animate="slide-right"
                >
                  Sputnik
                </h2>
                <figure
                  class="zone1-feature-image scroll-animate"
                  data-animate="fade-up"
                >
                  <img
                    :src="asset('images/travel/sputnik.jpg')"
                    alt="斯普特尼克一号卫星"
                  />
                  <figcaption>
                    <strong>斯普特尼克一号</strong> —
                    人类历史上第一颗人造地球卫星<br />
                    1957年10月4日由苏联自拜科努尔航天发射场成功发射<br />
                    直径58cm，重83.6kg，以96.2分钟周期绕地球运行
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>

          <!-- Zone 2: 引言区 -->
          <div
            class="zone2-editorial"
            :style="{
              backgroundImage: `url(${asset('images/decorations/image.png')})`,
            }"
          >
            <div class="zone2-overlay"></div>
            <div class="zone2-dot-texture"></div>

            <div class="zone2-quote-left">
              <p
                class="zone2-quote-label scroll-animate"
                data-animate="fade-in"
              >
                第二区
              </p>
              <p
                class="zone2-quote-title scroll-animate"
                data-animate="slide-up"
              >
                也是终章，也是黎明
              </p>
              <div
                class="zone2-quote-line scroll-animate"
                data-animate="grow-height"
              ></div>
            </div>

            <div class="zone2-text-editorial">
              <p class="zone2-paragraph scroll-animate" data-animate="fade-up">
                1957年，南极冰原上腾起了人类最后的探索之火。<br />
                来自十二个国家的科考队员穿越风暴与冰裂隙，<<br />
                携带着测绘仪器在地球最后的空白大陆上钉下了精确的坐标。
              </p>
              <p
                class="zone2-paragraph highlight scroll-animate"
                data-animate="fade-up"
              >
                南极洲——<<br />
                <span class="zone2-emphasis"
                  >人类地理大发现的最后一个句号。</span
                >
              </p>
              <p class="zone2-paragraph scroll-animate" data-animate="fade-up">
                那个寂静的清晨，当无线电波从冰盖深处传回基地、<<br />
                被世界各地的地图绘制者标注为"已到达"时，<<br />
                人类终于知道：地球上再没有未知的角落，<<br />
                地理大发现的时代，在这一年终结。
              </p>
            </div>

            <div class="zone2-meta">
              <p
                class="zone2-meta-item scroll-animate"
                data-animate="fade-left"
              >
                <span class="meta-label">征服日期</span>
                <span class="meta-value">1911.12.14</span>
              </p>
              <p
                class="zone2-meta-item scroll-animate"
                data-animate="fade-left"
              >
                <span class="meta-label">首位抵达</span>
                <span class="meta-value">罗尔德·阿蒙森</span>
              </p>
              <p
                class="zone2-meta-item scroll-animate"
                data-animate="fade-left"
              >
                <span class="meta-label">探险历时</span>
                <span class="meta-value">57 天</span>
              </p>
              <p
                class="zone2-meta-item scroll-animate"
                data-animate="fade-left"
              >
                <span class="meta-label">极点海拔</span>
                <span class="meta-value">2,835 m</span>
              </p>
            </div>

            <div
              class="zone2-bottom-quote scroll-animate"
              data-animate="fade-up"
            >
              <p class="zone2-bottom-text">
                "南极不仅填满了地图，它终结了一个时代。"
              </p>
            </div>
          </div>

          <!-- Zone 3: 视频滚动层 -->
          <div class="zone3-video" ref="zone3VideoRef">
            <div v-show="isZone3Visible" class="zone3-sticky-wrapper">
              <div class="video-layer">
                <ScrollFramePlayer
                  @progress-update="onZone2Progress"
                  @visibility-update="onZone2Visibility"
                />
              </div>

              <Teleport to="body">
                <div
                  class="narrative-layer-teleported"
                  :class="{ 'is-hidden': !isZone3FullyVisible }"
                >
                  <!-- idx 0: 标题句 -->
                  <div
                    class="narrative-block"
                    :style="{ opacity: textOpacities[0] }"
                  >
                    <p class="narrative-text">也正是在同一年</p>
                  </div>

                  <!-- idx 1 -->
                  <div
                    class="narrative-block"
                    :style="{ opacity: textOpacities[1] }"
                  >
                    <p class="narrative-text">
                      也正是在同一年<br />
                      一颗名叫"斯普特尼克一号"的金属球体，<<br />
                      用一声冰冷的"哔哔"声，撕开了长夜
                    </p>
                  </div>

                  <!-- idx 2 -->
                  <div
                    class="narrative-block"
                    :style="{ opacity: textOpacities[2] }"
                  >
                    <p class="narrative-text">
                      斯普特尼克的事迹消息传遍世界。<br />
                      每当收音机里聊到太空时，足以让所有人停下了呼吸。
                    </p>
                    <p class="narrative-text">
                      那是人类第一次意识到，<<br />
                      天空不再是界限，宇宙不再是比喻。
                    </p>
                  </div>

                  <!-- idx 3 -->
                  <div
                    class="narrative-block"
                    :style="{ opacity: textOpacities[3] }"
                  >
                    <p class="narrative-text">
                      狂热、兴奋、梦想、恐惧，<<br />
                      所有的情绪都指向同一个方向：
                    </p>
                    <p class="narrative-text">向上，离开，去往群星之间。</p>
                  </div>

                  <!-- idx 4: finale -->
                  <div
                    class="narrative-block finale"
                    :style="{ opacity: textOpacities[4] }"
                  >
                    <p class="narrative-text closing">这，是太空的时代。</p>
                  </div>
                </div>
              </Teleport>
            </div>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════ -->
        <!-- 【区域 3】功能区 ← Zone 03 音频控制绑定到这个区域 -->
        <!-- ═══════════════════════════════════════════════════════════ -->
        <section
          class="feature-section section-marker orange-theme"
          data-index="2"
          :ref="(el) => setSectionRef(el, 3)"
          ref="zone03Ref"
        >
          <div class="feature-outer-wrapper">
            <FeatureIndex />
          </div>
        </section>

        <!-- 【区域 4】招募区 -->
        <section
          class="transition-section section-marker blue-theme"
          data-index="3"
          :ref="(el) => setSectionRef(el, 4)"
        >
          <button class="fullscreen-btn" @click="openPokemonCardFullscreen">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M7 15l5-5 5 5M7 9l5 5 5-5" />
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>
          <div class="recruit-header">
            <h2 class="recruit-title">
              卡牌收藏<br />
              <span class="title-light">Starts with You</span>
            </h2>
          </div>
          <div class="recruit-hero">
            <PokemonCard />
          </div>
        </section>

        <!-- ==================== 【区域 5】页脚 ==================== -->
        <
        <footer
          class="footer-section section-marker white-theme"
          data-index="4"
          :ref="(el) => setSectionRef(el, 5)"
        >
          <!-- 【行动号召区】太空旅程结语 -->
          <section class="footer-cta">
            <div class="cta-bg">
              <div class="cta-bg-placeholder"></div>
              <!-- 【新增】星空噪点纹理叠加 -->
              <div class="cta-overlay"></div>
              <div class="cta-stars"></div>
            </div>
            <div class="cta-content">
              <h2 class="cta-title">
                万物都由原子构成，太行如砺，<br />
                黄河如带，等是尘埃。
              </h2>
              <p class="cta-desc">
                1957 年，斯普特尼克划破长空，南极探险画上句号。<br />
                地理大发现的时代结束了，太空时代才刚刚开始。
              </p>
              <div class="cta-button-group">
                <a href="#" class="cta-button" @click.prevent="scrollToTop">
                  重返顶部
                  <span class="arrow">↑</span>
                </a>
                <button class="cta-button-circle" @click="dropSquare">
                  <span class="circle-icon">⬜</span>
                </button>
              </div>
            </div>
          </section>

          <!-- 【联系信息区】虚构太空机构风格 -->
          <section class="footer-contact">
            <div class="contact-left">
              <p class="address">
                东经 37°37′ 北纬 55°45′<<br />
                莫斯科, 苏联拜科努尔航天发射场
              </p>
              <p class="phone">SIGNAL: 1957-OCT-04</p>
            </div>
            <div class="contact-right">
              <p class="touch-label">建立通讯</p>
              <a href="mailto:signal@cosmic1977.space" class="email"
                >signal@cosmic1977.space</a
              >
            </div>
          </section>

          <!-- 【链接导航区】 -->
          <section class="footer-links">
            <div class="links-left">
              <a
                v-for="item in socials"
                :key="item"
                href="#"
                class="link-item"
                >{{ item }}</a
              >
            </div>
            <div class="links-right">
              <a v-for="item in navs" :key="item" href="#" class="link-item">{{
                item
              }}</a>
            </div>
          </section>

          <!-- 【巨型装饰文字】项目代号 -->
          <div class="footer-big-text">
            <span>cosmic 1987</span>
          </div>

          <!-- 【版权信息区】 -->
          <section class="footer-bottom">
            <p class="copyright">@2026 COSMIC1987. 保留所有权利</p>
            <div class="legal-links">
              <a href="#">隐私政策</a>
              <a href="#">使用条款</a>
              <a href="#">Cookie 设置</a>
            </div>
            <!-- 底部居中 Logo -->
            <div class="footer-logo-container">
              <div class="footer-logo">
                <img
                  :src="asset('images/decorations/Decoration2.jpg')"
                  alt="Footer Logo"
                />
              </div>
            </div>
          </section>
        </footer>
      </div>
    </div>

    <!-- 弹窗 -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-wide-bar" @click.stop>
          <p>{{ modalMessage }}</p>
          <span class="close-hint">点击空白处关闭</span>
        </div>
      </div>

      <!-- 卡牌全屏弹窗 -->
      <Transition name="fullscreen">
        <div
          v-if="showPokemonFullscreen"
          class="pokemon-fullscreen-overlay"
          @click="closePokemonCardFullscreen"
        >
          <button
            class="fullscreen-close-btn"
            @click="closePokemonCardFullscreen"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div class="pokemon-fullscreen-content" @click.stop>
            <PokemonCard />
          </div>
          <span class="fullscreen-hint">按 ESC 键关闭</span>
        </div>
      </Transition>
    </Teleport>

    <!-- 可拖动的悬浮正方形（吊饰效果） -->
    <FloatingSquare :visible="showFloatingSquare" />

    <!-- 进度页 -->
    <UserProgressPage
      :class="{ 'is-hidden': !showProgressPage }"
      :show-progress-page="showProgressPage"
    />
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  watch,
  nextTick,
  onErrorCaptured,
} from "vue";
import { useRouter } from "vue-router";
import audioManager from "../../utils/audioManager";
import { asset } from "../../utils/asset";
import UserProgressPage from "../UserProgressPage.vue";
import SideNav from "../../components/views/home/SideNavigation.vue";
import FeatureIndex from "../../components/views/home/LightMonologue.vue";
import WavyGrid from "../../components/views/home/WavyGrid.vue";

import ScrollFramePlayer from "../../components/views/home/ScrollFramePlayer.vue";
import PokemonCard from "../../components/views/home/PokemonCard.vue";
import Helmet3D from "../../components/views/home/ModelViewer.vue";
import FloatingSquare from "../../components/views/home/FloatingSquare.vue";
import HomePageLoading from "../../components/views/home/HomePageLoading.vue";
import "./HomePage.css";

defineOptions({ name: "HomePage" });

const router = useRouter();

/* ════════════════════════════════════════════════════════════
   第 1 层：所有 ref / reactive / let 声明
   ════════════════════════════════════════════════════════════ */

// 使用 localStorage 持久化动画状态，确保动画只播放一次
const hasPlayedIntroAnimation =
  localStorage.getItem("hasPlayedIntroAnimation") === "true";
// modelDropping 初始为 false，等待加载动画完成后再触发下落
// 如果初始为 true，CSS 动画会在加载画面背后偷偷播完，用户看不到
const modelDropping = ref(false);
const isTopLeaving = ref(false);
const isFeatureLocked = ref(false);
const isZone3Visible = ref(false);

// 01 区域显隐控制（v-show 方案）
const showZone01 = ref(true);
let zone01HideTimer = null;

const mainPageRef = ref(null);
const scrollContentRef = ref(null);
const flashBarRef = ref(null);
const topVisualRef = ref(null);
const zone3VideoRef = ref(null);
const zone03Ref = ref(null);

const showProgressPage = ref(false);
const showHomeLoading = ref(false);
const isEntering = ref(false);
const showModal = ref(false);
const modalMessage = ref("提示信息");
const topSectionInfo = ref({ top: 0, height: 0 });
const showPokemonFullscreen = ref(false);

// 悬浮正方形相关变量（吊饰效果）
const showFloatingSquare = ref(false);

const chapters = ref([
  { num: "01/", label: "序章" },
  { num: "02/", label: "斯普特尼克" },
  { num: "03/", label: "播放" },
  { num: "04/", label: "星际致敬" },
  { num: "05/", label: "小小的页脚" },
]);

const activeSection = ref(0);
const sectionRefs = ref([]);

const targetY = ref(0);
const currentY = ref(0);
const damping = 0.04;
let rafId = null;
let lastY = 0;
let velocity = 0;
let removeGuard = null;

// 【新增】滚动吸附相关变量
let scrollEndTimer = null;
const SCROLL_END_DELAY = 600;

const zone2Progress = ref(0);

const overallProgress = ref(65);
const completedTasks = ref(42);
const pendingTasks = ref(23);
const socials = ["FACEBOOK", "INSTAGRAM", "X", "YOUTUBE"];
const navs = [
  "HOME",
  "ABOUT US",
  "PROPERTIES",
  "AGENTS",
  "PROJECTS",
  "CONTACT US",
];

/* ════════════════════════════════════════════════════════════
   第 2 层：computed
   ════════════════════════════════════════════════════════════ */

const isZone3FullyVisible = computed(() => {
  if (!isZone3Visible.value) return false;
  return zone2Progress.value >= 0 && zone2Progress.value <= 0.98;
});

// 手动解锁标记 - 用于跳转时临时解锁区域2限制
const zone2ManualUnlock = ref(false);

// 区域2锁定状态：当手动解锁或进度 >= 0.99 时解锁
const isZone2Locked = computed(() => {
  // 如果手动解锁了，直接返回 false
  if (zone2ManualUnlock.value) return false;
  // 否则根据进度判断
  return zone2Progress.value < 0.99;
});

const NARRATIVE_TIMINGS = [
  [-0.05, 0.0, 0.12, 0.18], // 【idx 0】负数开始，进入 Zone 3 瞬间即完全显示
  [0.15, 0.25, 0.35, 0.42], // 【idx 1】相应提前，避免重叠
  [0.4, 0.5, 0.6, 0.7], // 【idx 2】
  [0.68, 0.73, 0.81, 0.85], // 【idx 3】
  [0.84, 0.9, 0.94, 1.0], // 【idx 4】
];

const textOpacities = computed(() => {
  const p = zone2Progress.value;
  const opacities = [0, 0, 0, 0, 0, 0, 0];

  NARRATIVE_TIMINGS.forEach((timing, i) => {
    if (timing.length === 2) {
      const [start, end] = timing;
      if (p >= start && p <= end) {
        opacities[i] = (p - start) / Math.max(0.001, end - start);
      } else if (p > end) {
        opacities[i] = 1;
      }
    } else {
      const [fadeInStart, fullyVisible, fadeOutStart, fadeOutEnd] = timing;
      if (p >= fadeInStart && p < fullyVisible) {
        opacities[i] =
          (p - fadeInStart) / Math.max(0.001, fullyVisible - fadeInStart);
      } else if (p >= fullyVisible && p < fadeOutStart) {
        opacities[i] = 1;
      } else if (p >= fadeOutStart && p < fadeOutEnd) {
        opacities[i] =
          1 - (p - fadeOutStart) / Math.max(0.001, fadeOutEnd - fadeOutStart);
      }
    }
  });

  return opacities;
});

/* ════════════════════════════════════════════════════════════
   第 3 层：普通函数 / 方法
   ════════════════════════════════════════════════════════════ */

const setSectionRef = (el, index) => {
  if (el) sectionRefs.value[index] = el;
};

const toggleProgress = () => {
  showProgressPage.value = !showProgressPage.value;
};

// 【新增】加载画面开始淡出时提前准备：在背后渲染主页并触发淡入
const onHomeLoadingPrepare = () => {
  console.log("[HomePage] 加载画面开始淡出，提前渲染主页");
  // 同一帧内：标记动画 + 显示主页，确保 cosmic-container 初次渲染即带 is-entering
  isEntering.value = true;
  showHomeLoading.value = false;
  showZone01.value = true;
  modelDropping.value = true;
  // 标记已访问过首页
  localStorage.setItem("hasPlayedIntroAnimation", "true");

  nextTick(() => {
    updateTopSectionInfo();
    if (mainPageRef.value) {
      mainPageRef.value.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      rafId = requestAnimationFrame(smoothScroll);
    }
    observeAnimations();
    console.log("[HomePage] 主页提前渲染完成，正在交叉淡入");
  });
};

// 首页加载动画淡出完成回调（此时主页已完全可见）
const onHomeLoadingComplete = () => {
  console.log("[HomePage] 加载画面淡出完成，主页已完全接管");
};

const closeModal = () => {
  showModal.value = false;
};

const openPokemonCardFullscreen = () => {
  showPokemonFullscreen.value = true;
  document.body.style.overflow = "hidden";
};

const closePokemonCardFullscreen = () => {
  showPokemonFullscreen.value = false;
  document.body.style.overflow = "";
};

const handleKeydown = (e) => {
  if (e.key === "Escape" && showPokemonFullscreen.value) {
    closePokemonCardFullscreen();
  }
};

// 掉落悬浮正方形（吊饰效果）
const dropSquare = () => {
  if (showFloatingSquare.value) return;
  showFloatingSquare.value = true;
};

const releaseFeatureSection = () => {
  isFeatureLocked.value = !isFeatureLocked.value;
};

// 【新增】区域3位置检测与矫正
const correctZone3Position = () => {
  if (!zone03Ref.value || !isFeatureLocked.value) return;

  // 检测区域3是否完整展示
  const isFullyVisible = checkZone3FullyVisible();

  if (!isFullyVisible) {
    // 需要矫正位置
    const zone3 = zone03Ref.value;
    const zone3Top = zone3.offsetTop;
    const zone3Height = zone3.offsetHeight;
    const viewportHeight = window.innerHeight;

    // 计算目标滚动位置，使区域3完整展示
    const targetScrollY = zone3Top - (viewportHeight - zone3Height) / 2;

    // 平滑矫正到目标位置
    targetY.value = Math.max(0, targetScrollY);
    console.log("[HomePage] 矫正区域3位置:", targetScrollY);
  }
};

// 【新增】检查区域3是否完整可见（函数版，与 computed 版区分）
const checkZone3FullyVisible = () => {
  if (!zone03Ref.value) return false;
  const rect = zone03Ref.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  return rect.top <= 0 && rect.bottom >= viewportHeight;
};

const resizeBody = () => {
  if (scrollContentRef.value) {
    const h = scrollContentRef.value.offsetHeight;
    document.body.style.height = `${h}px`;
    console.log("[HomePage] body height set to:", h);
  } else {
    // 兜底：如果 scrollContentRef 还没准备好，设置一个足够大的高度保证可滚动
    document.body.style.height = "500vh";
    console.warn("[HomePage] scrollContentRef 未就绪，使用兜底高度 500vh");
  }
};

const onWindowScroll = () => {
  let newTarget = window.scrollY;

  if (isZone2Locked.value && sectionRefs.value[2]) {
    const zone2 = sectionRefs.value[2];
    const zone2Bottom = zone2.offsetTop + zone2.offsetHeight;
    const maxY = zone2Bottom - window.innerHeight;

    if (newTarget > maxY) {
      window.scrollTo(0, maxY);
      newTarget = maxY;
    }
  }

  targetY.value = newTarget;

  // 【新增】滚动吸附：当滚动停止后自动矫正区域3/4位置
  scheduleZone34Snap();
};

// 【新增】调度区域3/4自动吸附
const scheduleZone34Snap = () => {
  if (scrollEndTimer) {
    clearTimeout(scrollEndTimer);
  }

  scrollEndTimer = setTimeout(() => {
    checkZone34Snap();
  }, SCROLL_END_DELAY);
};

// 【新增】区域3/4自动吸附：检测两个区域各占视口多少，自动归位占比大的
const checkZone34Snap = () => {
  const zone3 = document.querySelector('[data-index="2"]');
  const zone4 = document.querySelector('[data-index="3"]');
  if (!zone3 || !zone4) return;

  const rect3 = zone3.getBoundingClientRect();
  const rect4 = zone4.getBoundingClientRect();
  const vh = window.innerHeight;

  // 计算各区域在视口中的可见高度
  const visible3 = Math.min(rect3.bottom, vh) - Math.max(rect3.top, 0);
  const visible4 = Math.min(rect4.bottom, vh) - Math.max(rect4.top, 0);

  // 两个区域都不在视口内，无需吸附
  if (visible3 <= 0 && visible4 <= 0) return;

  // 只有其中一个可见，吸附到那个
  if (visible3 <= 0) {
    snapToZone(4);
    return;
  }
  if (visible4 <= 0) {
    snapToZone(3);
    return;
  }

  // 两者都可见：占比大的赢
  if (visible3 >= visible4) {
    snapToZone(3);
  } else {
    snapToZone(4);
  }
};

// 【新增】吸附到指定区域（3 或 4），使其对齐视口顶部
const snapToZone = (zoneNumber) => {
  const selector = `[data-index="${zoneNumber - 1}"]`;
  const section = document.querySelector(selector);
  if (!section) return;

  const targetY_Px = section.offsetTop;
  const currentY_Px = window.scrollY;
  const diff = Math.abs(targetY_Px - currentY_Px);

  if (diff <= 5) return;

  targetY.value = Math.max(0, targetY_Px);
};

const updateActiveSection = (scrollY, viewportHeight) => {
  if (!sectionRefs.value.length) return;

  const viewportTop = scrollY;
  const viewportBottom = scrollY + viewportHeight;

  let bestIndex = 0;
  let maxOverlap = 0;

  sectionRefs.value.forEach((el) => {
    if (!el || el.dataset.index === undefined) return;

    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const elIndex = parseInt(el.dataset.index);
    if (isNaN(elIndex)) return;

    const overlapTop = Math.max(elTop, viewportTop);
    const overlapBottom = Math.min(elBottom, viewportBottom);
    const overlap = Math.max(0, overlapBottom - overlapTop);

    if (overlap > maxOverlap) {
      maxOverlap = overlap;
      bestIndex = elIndex;
    }
  });

  activeSection.value = bestIndex;
};

const onZone2Progress = (p) => {
  // 可在这里接收 ScrollFramePlayer 的进度
  // console.log('Zone2 video progress:', p);
};

const onZone2Visibility = (v) => {
  // 可在这里接收可见性变化
};

const updateByScroll = (scrollY) => {
  const viewportHeight = window.innerHeight;
  const topSpacer = sectionRefs.value[0];

  if (
    topSpacer &&
    mainPageRef.value &&
    topVisualRef.value &&
    flashBarRef.value
  ) {
    const topTop = topSpacer.offsetTop;
    const topHeight = topSpacer.offsetHeight;

    const topScrollRange = Math.max(1, topHeight);
    const progress = Math.max(
      0,
      Math.min(1, (scrollY - topTop) / topScrollRange),
    );

    const flashStart = 0.78;
    if (progress >= flashStart) {
      const flashProgress = Math.min(
        1,
        (progress - flashStart) / (1 - flashStart),
      );

      const topPx = (1 - flashProgress) * viewportHeight;
      flashBarRef.value.style.top = `${topPx}px`;

      let opacity = 0;
      if (flashProgress < 0.1) {
        opacity = flashProgress / 0.1;
      } else if (flashProgress > 0.85) {
        opacity = Math.max(0, 1 - (flashProgress - 0.85) / 0.15);
      } else {
        opacity = 1;
      }
      flashBarRef.value.style.opacity = opacity;

      const clipBottom = Math.min(100, flashProgress * 100);
      topVisualRef.value.style.clipPath = `inset(0 0 ${clipBottom}% 0)`;
      isTopLeaving.value = flashProgress > 0.95;
    } else {
      flashBarRef.value.style.top = "100vh";
      flashBarRef.value.style.opacity = "0";
      topVisualRef.value.style.clipPath = "inset(0 0 0 0)";
      isTopLeaving.value = false;
    }
  }

  if (zone3VideoRef.value) {
    const rect = zone3VideoRef.value.getBoundingClientRect();
    const z3Top = rect.top + scrollY;
    const z3Height = zone3VideoRef.value.offsetHeight;
    const z3Bottom = z3Top + z3Height;

    // 检测 Zone 3 进入事件：首次进入时清除手动解锁，恢复进度计算
    const wasZone3Visible = isZone3Visible.value;
    isZone3Visible.value = scrollY >= z3Top && scrollY < z3Bottom;

    if (!wasZone3Visible && isZone3Visible.value && zone2ManualUnlock.value) {
      zone2ManualUnlock.value = false;
    }

    // 【修复】只有在未手动解锁的情况下才更新进度
    if (isZone3Visible.value && !zone2ManualUnlock.value) {
      const scrollableDistance = z3Height - viewportHeight;
      if (scrollableDistance > 0) {
        const currentScroll = scrollY - z3Top;
        zone2Progress.value = Math.max(
          0,
          Math.min(1, currentScroll / scrollableDistance),
        );
      } else {
        zone2Progress.value = 1;
      }
    }
  }

  updateActiveSection(scrollY, viewportHeight);
};

const smoothScroll = () => {
  const diff = targetY.value - currentY.value;
  let nextY = currentY.value + diff * damping;

  if (isZone2Locked.value && sectionRefs.value[2]) {
    const zone2 = sectionRefs.value[2];
    const maxY = zone2.offsetTop + zone2.offsetHeight - window.innerHeight;
    if (nextY > maxY) {
      nextY = maxY;
      targetY.value = maxY;
    }
  }

  if (isFeatureLocked.value && sectionRefs.value[3]) {
    const featureSection = sectionRefs.value[3];
    const outerBoxTop = featureSection.offsetTop;
    const outerHeight = featureSection.offsetHeight;
    const outerBoxBottom = outerBoxTop + outerHeight;
    const viewportHeight = window.innerHeight;

    const innerBoxTop =
      outerBoxTop + Math.max(0, (outerHeight - viewportHeight) / 2);
    const innerBoxBottom = innerBoxTop + viewportHeight;

    const clampedTarget = Math.max(
      outerBoxTop,
      Math.min(outerBoxBottom, targetY.value),
    );
    const clampedDiff = clampedTarget - currentY.value;
    nextY = currentY.value + clampedDiff * damping;

    if (nextY < innerBoxTop || nextY > innerBoxBottom) {
      nextY = currentY.value + clampedDiff * damping * 0.3;
    }

    nextY = Math.max(outerBoxTop, Math.min(outerBoxBottom, nextY));
  }

  if (Math.abs(diff) < 100) {
    nextY += diff * 0.02;
  }

  currentY.value = nextY;

  if (scrollContentRef.value) {
    scrollContentRef.value.style.transform = `translateY(${-currentY.value}px)`;
  }
  updateByScroll(currentY.value);

  // 【修复】移除重复的跳转检测，避免循环触发
  // if (Math.abs(diff) < 5) {
  //   checkZone3Jump();
  // }

  rafId = requestAnimationFrame(smoothScroll);
};

// 【核心修改】跳回顶部时恢复所有状态
const scrollToTop = () => {
  // 1. 恢复 showZone01 显示
  if (zone01HideTimer) {
    clearTimeout(zone01HideTimer);
    zone01HideTimer = null;
  }
  if (!showZone01.value) {
    showZone01.value = true;
  }

  // 2. 解锁所有区域限制
  zone2ManualUnlock.value = true;
  isFeatureLocked.value = false;

  // 3. 重置进度
  zone2Progress.value = 1;

  // 4. 【关键】使用 syncScrollPosition 同步所有滚动状态
  syncScrollPosition(0);
};

const jumpToSection = (index) => {
  // 跳回01区时恢复显示
  if (index === 0) {
    if (zone01HideTimer) {
      clearTimeout(zone01HideTimer);
      zone01HideTimer = null;
    }
    if (!showZone01.value) {
      showZone01.value = true;
    }
    // 解锁所有区域限制
    zone2ManualUnlock.value = true;
    isFeatureLocked.value = false;
    // 重置进度，避免再次进入锁定状态
    zone2Progress.value = 1;
  }

  const target = sectionRefs.value.find(
    (el) => el && el.dataset.index === String(index),
  );
  if (!target) return;

  // 跳转到区域2（斯普特尼克）时解锁区域2限制
  if (index === 1) {
    zone2ManualUnlock.value = true;
  }

  // 跳转到区域3（播放区）时解锁限制
  if (index === 2) {
    zone2ManualUnlock.value = true;
    isFeatureLocked.value = false;
    // Zone 3 为 100vh，直接对齐到顶部
    const zone3 = zone03Ref.value;
    if (zone3) {
      syncScrollPosition(zone3.offsetTop);
      return;
    }
  }

  // 跳转到区域4或5时解锁所有限制
  if (index >= 3) {
    zone2ManualUnlock.value = true;
    isFeatureLocked.value = false;
    // 设置进度为1，表示已经完成区域2
    zone2Progress.value = 1;
  }

  // 【关键修复】强制同步更新所有滚动状态
  syncScrollPosition(target.offsetTop);
};

/**
 * 【新增】同步滚动位置到所有系统
 * 确保页面、进度条、内部状态都同步更新
 */
const syncScrollPosition = (position) => {
  // 1. 更新内部状态
  targetY.value = position;
  currentY.value = position;

  // 2. 强制更新 window.scrollY（触发进度条更新）
  window.scrollTo({ top: position, behavior: "instant" });

  // 3. 强制更新页面显示
  if (scrollContentRef.value) {
    scrollContentRef.value.style.transform = `translateY(${-position}px)`;
  }

  // 4. 强制更新区域状态
  updateByScroll(position);

  console.log("[HomePage] 同步滚动位置:", position);
};

const updateTopSectionInfo = () => {
  const topSpacer = sectionRefs.value[0];
  if (topSpacer) {
    topSectionInfo.value = {
      top: topSpacer.offsetTop,
      height: topSpacer.offsetHeight,
    };
  }
  resizeBody();
};

const handleWheel = (event) => {
  // 移除 isLoading 检查，因为没有加载动画了
};

const observeAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  document.querySelectorAll(".scroll-animate").forEach((el) => {
    observer.observe(el);
  });
};

// ==================== 音频控制函数 ====================

/**
 * 切换播放/暂停
 */
function toggleAudio() {
  audioManager.toggle();
}

/**
 * 选择音乐曲目（主界面 3 首）
 * @param {number} trackIndex - 曲目索引（0-2）
 */
function selectTrack(trackIndex) {
  audioManager.switchTrackByIndex(trackIndex);
}

/**
 * 暂停音乐
 */
function pauseAudio() {
  audioManager.pause();
}

/**
 * 播放音乐
 */
function playAudio() {
  audioManager.play();
}

/* ════════════════════════════════════════════════════════════
   第 4 层：watch
   ════════════════════════════════════════════════════════════ */

// 01 区域离开视口后延迟隐藏（只控制 showZone01，不动 modelDropping）
watch(isTopLeaving, (leaving) => {
  if (leaving && showZone01.value && !zone01HideTimer) {
    zone01HideTimer = setTimeout(() => {
      showZone01.value = false;
      // 【删除】不再把 modelDropping 设为 false，保持 true
      zone01HideTimer = null;
    }, 1200);
  } else if (!leaving && !showZone01.value) {
    // 【新增】滚动回顶部时自动恢复01区域显示
    if (zone01HideTimer) {
      clearTimeout(zone01HideTimer);
      zone01HideTimer = null;
    }
    showZone01.value = true;
  }
});

// 返回序章时恢复显示（只控制 showZone01，不动 modelDropping）
watch(activeSection, (idx) => {
  if (idx === 0 && !showZone01.value) {
    if (zone01HideTimer) {
      clearTimeout(zone01HideTimer);
      zone01HideTimer = null;
    }
    showZone01.value = true;
    // 【删除】不再重复设置 modelDropping，它已经是 true 了
  }
});

/* ════════════════════════════════════════════════════════════
   第 5 层：生命周期
   ════════════════════════════════════════════════════════════ */

// 【新增】捕获子组件错误，防止白屏/黑屏时看不到报错
onErrorCaptured((err, instance, info) => {
  console.error("[HomePage Error]", err, info, instance);
  return false; // 阻止错误继续向上传播
});

onMounted(() => {
  // 【新增】路由离开守卫：记录离开首页时的滚动位置
  removeGuard = router.beforeEach((to, from) => {
    if (from.path === "/" && to.path !== "/") {
      console.log("[HomePage] 离开首页，记录滚动位置:", window.scrollY);
      localStorage.setItem("homeScrollPosition", window.scrollY.toString());
      // 标记已导航到首页，下次返回时跳过加载动画
      sessionStorage.setItem("navigatedToHome", "true");
    }
  });

  window.addEventListener("resize", updateTopSectionInfo);
  window.addEventListener("scroll", onWindowScroll, { passive: true });
  window.addEventListener("keydown", handleKeydown);

  // 如果显示加载动画，这些初始化放到 onHomeLoadingComplete
  // 因为此时 cosmic-container 还不存在，mainPageRef 为 null
  if (!showHomeLoading.value) {
    updateTopSectionInfo();
    if (mainPageRef.value) {
      mainPageRef.value.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      rafId = requestAnimationFrame(smoothScroll);
    }
    observeAnimations();
  }

  // 【新增】检查是否需要跳过进入动画（从其他页面返回）
  const hasNavigatedBefore =
    sessionStorage.getItem("navigatedToHome") === "true";
  const skipAnimation =
    router.currentRoute.value.query.skipAnimation === "true" ||
    hasNavigatedBefore;
  // 【修改】优先从 localStorage 获取保存的位置
  const savedScrollY =
    parseInt(router.currentRoute.value.query.scrollY) ||
    parseInt(localStorage.getItem("homeScrollPosition")) ||
    0;

  if (skipAnimation) {
    console.log("[HomePage] 从其他页面返回，跳过进入动画和加载动画");
    // 从其他页面返回时，不显示加载动画
    showHomeLoading.value = false;

    // 【关键修复】解锁所有区域限制，防止滚动被锁定
    zone2ManualUnlock.value = true;
    isFeatureLocked.value = false;

    // 【关键修复】确保 body 高度被正确设置，否则无法滚动
    nextTick(() => {
      updateTopSectionInfo();
      resizeBody();
      // 确保滚动初始化完成
      if (mainPageRef.value) {
        mainPageRef.value.addEventListener("wheel", handleWheel, {
          passive: false,
        });
        rafId = requestAnimationFrame(smoothScroll);
      }
      observeAnimations();
      console.log("[HomePage] 从其他页面返回，滚动初始化完成");

      // 滚动初始化完成后，再恢复滚动位置
      if (savedScrollY > 0) {
        console.log("[HomePage] 恢复滚动位置:", savedScrollY);
        // 使用 requestAnimationFrame 确保 DOM 更新完成
        const restoreScroll = () => {
          syncScrollPosition(savedScrollY);
          console.log("[HomePage] 滚动位置已恢复:", savedScrollY);

          // 根据滚动位置更新 showZone01 状态
          if (topVisualRef.value) {
            const topVisualHeight = topVisualRef.value.offsetHeight;
            if (savedScrollY > topVisualHeight * 0.5) {
              console.log("[HomePage] 滚动位置已离开顶部，隐藏 01 区域");
              showZone01.value = false;
            } else {
              console.log("[HomePage] 滚动位置在顶部区域内，显示 01 区域");
              showZone01.value = true;
            }
          }
        };
        requestAnimationFrame(() => {
          setTimeout(restoreScroll, 100);
        });
      } else {
        console.log("[HomePage] 没有保存的滚动位置，显示 01 区域");
        showZone01.value = true;
        localStorage.removeItem("homeScrollPosition");
        syncScrollPosition(0);
      }
    });

    // 【修改】从其他页面返回时，modelDropping 已经是 true（通过 localStorage 持久化）
    // 无需再次设置，避免触发动画
    console.log(
      "[HomePage] modelDropping 已通过 localStorage 持久化:",
      modelDropping.value,
    );

    // 清除 URL 参数，避免刷新后仍然跳过动画
    router.replace({ query: {} });
  } else {
    // 首次进入/刷新：显示加载动画
    console.log("[HomePage] 首次进入，显示加载动画");
    showHomeLoading.value = true;
    // 加载动画期间隐藏主内容
    showZone01.value = false;
  }

  // ==================== 【新增】用户进度监听 ====================

  // 监听完成任务数变化，更新进度
  watch(
    completedTasks,
    (newVal, oldVal) => {
      if (newVal > oldVal) {
        // 完成新任务时的反馈效果
        console.log("[HomePage] 完成新任务:", newVal);
      }
    },
    { immediate: false },
  );
});

// keep-alive: 离开首页时暂停耗性能操作
onDeactivated(() => {
  console.log("[HomePage] 组件被缓存（离开首页），暂停动画/事件");
  // 暂停滚动平滑动画
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  // 移除键盘监听，避免与其他页面冲突
  window.removeEventListener("keydown", handleKeydown);
});

// keep-alive: 回到首页时恢复操作
onActivated(() => {
  console.log("[HomePage] 组件被激活（回到首页），恢复动画/事件");
  // 恢复滚动平滑动画
  if (!rafId && mainPageRef.value) {
    rafId = requestAnimationFrame(smoothScroll);
  }
  // 恢复键盘监听
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  // 【新增】移除路由守卫
  if (removeGuard) {
    removeGuard();
    removeGuard = null;
  }

  window.removeEventListener("scroll", onWindowScroll);
  window.removeEventListener("resize", updateTopSectionInfo);
  window.removeEventListener("keydown", handleKeydown);

  if (mainPageRef.value) {
    mainPageRef.value.removeEventListener("wheel", handleWheel);
  }

  if (zone01HideTimer) clearTimeout(zone01HideTimer);
  // 【新增】清理滚动吸附定时器
  if (scrollEndTimer) clearTimeout(scrollEndTimer);

  cancelAnimationFrame(rafId);

  // 【新增】组件卸载时清理所有可能的残留遮罩
  console.log("[HomePage] 组件卸载，清理遮罩");
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

  // 【关键】恢复被污染的全局样式
  document.body.style.height = "";
  document.body.style.overflow = "";
  document.body.style.background = "";
  document.body.style.minHeight = "";

  // 移除可能添加的 class
  document.body.classList.remove("homepage-active", "no-scroll");

  console.log("[HomePage] 卸载完成，全局样式已清理");
});
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════
   字体导入
   ════════════════════════════════════════════════════════════ */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=Playfair+Display:ital,wght@1,900&family=Noto+Serif+SC:wght@400;600;700;900&family=Oswald:wght@400;500;600;700&display=swap");

:global(html),
:global(body) {
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
:global(::-webkit-scrollbar) {
  width: 0;
  height: 0;
  display: none;
}

/* ════════════════════════════════════════════════════════════
   main-page 显隐控制（使用 opacity/visibility 避免 CSS 动画重置）
   ════════════════════════════════════════════════════════════ */
.main-page {
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

.main-page.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  inset: 0;
}

/* UserProgressPage 显隐控制（使用 opacity/visibility 避免滑入动画失效） */
:deep(.user-progress-page.is-hidden) {
  transform: translateX(100%);
  pointer-events: none;
}

/* ════════════════════════════════════════════════════════════
   【01】序章
   ════════════════════════════════════════════════════════════ */

.top-visual {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  z-index: 10;
  background: #0a0a0a;
  will-change: clip-path;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 【关键】给容器本身加 transition，用于 is-hidden 淡入淡出 */
  transition:
    opacity 0.8s ease,
    visibility 0.8s ease;
}

/* 【核心修复】用 opacity + visibility 替代 v-show 的 display:none
   这样元素始终存在于 DOM，CSS animation 不会被浏览器重置 */
.top-visual.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* is-leaving 保留作为滚动离开时的过渡标记，但不再负责最终隐藏 */
.top-visual.is-leaving {
  opacity: 0;
  pointer-events: none;
}

.editorial-page {
  min-height: 100vh;
  width: 100%;
  background: #0a0a0a;
  color: #ffffff;
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;
  position: relative;
  -webkit-font-smoothing: antialiased;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* is-revealed 一旦挂上，终身不摘。因为父级不再被 display:none，
   这些 animation 只会播放一次，永远不会重播 */
.editorial-page.is-revealed {
  transform: scale(1);
  opacity: 1;
}

.hero {
  position: relative;
  height: 88vh;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.layer-back {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.blue-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32vw;
  height: 32vw;
  max-width: 440px;
  max-height: 440px;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  box-shadow:
    0 0 60px rgba(255, 255, 255, 0.06),
    0 0 120px rgba(255, 255, 255, 0.03),
    inset 0 0 40px rgba(255, 255, 255, 0.04);
}

.title-cursive {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%) rotate(-8deg);
  font-family: "Playfair Display", serif;
  font-style: italic;
  font-weight: 900;
  font-size: clamp(160px, 48vw, 400px);
  letter-spacing: -0.02em;
  line-height: 0.85;
  color: rgba(255, 255, 255, 0.88);
  margin: 0;
  white-space: nowrap;
  z-index: 1;
  pointer-events: none;
  text-shadow:
    0 0 80px rgba(255, 255, 255, 0.08),
    0 4px 30px rgba(0, 0, 0, 0.5);
}

.title-cursive .char {
  display: inline-block;
  opacity: 0;
  transform: translateY(110%) rotate(-5deg);
}

/* 因为父级不再被 display:none，这些动画终身只播一次 */
.editorial-page.is-revealed .title-cursive .char {
  animation: charRevealCursive 0.9s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

/* ════════════════════════════════════════════════════════════
   模型舞台：头盔 + 徽章 整体下落动画
   ════════════════════════════════════════════════════════════ */

/* 模型舞台 */
.model-stage {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.model-stage.is-dropping {
  animation: stageHelmetDrop 1.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
}

@keyframes stageHelmetDrop {
  0% {
    opacity: 0;
    transform: translate(-50%, -160vh) scale(0.85);
  }
  55% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.03);
  }
  80% {
    transform: translate(-50%, -50%) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 徽章 */
.center-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: scale(0.8);
}

.editorial-page.is-revealed .center-badge {
  animation: badgeReveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 1.3s forwards;
}

/* 模型容器：只负责尺寸，不额外做动画（动画由父级 .model-stage 统一驱动） */
.model-placeholder {
  width: 40%;
  height: 40%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.center-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: scale(0.8);
}

.editorial-page.is-revealed .center-badge {
  animation: badgeReveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 1.3s forwards;
}

.badge-line {
  width: 24px;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
}

.badge-text {
  font-size: clamp(10px, 1.2vw, 14px);
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #ffffff;
  text-transform: uppercase;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  padding: 6px 16px;
  white-space: nowrap;
}

.model-placeholder {
  width: 500px;
  height: 500px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 底部标题 */
.title-bottom {
  position: absolute;
  left: 50%;
  bottom: 10vh;
  transform: translateX(-50%);
  font-family: "Oswald", sans-serif;
  font-size: clamp(60px, 12vw, 160px);
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 0.85;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
}

.title-bottom .char {
  display: inline-block;
  opacity: 0;
  transform: translateY(80px);
}

.editorial-page.is-revealed .title-bottom .char {
  animation: charReveal 0.9s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

.category-line {
  position: absolute;
  font-size: clamp(9px, 1vw, 12px);
  font-weight: 600;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  white-space: nowrap;
  margin: 0;
  opacity: 0;
}

.editorial-page.is-revealed .category-line {
  animation: fadeUp 0.9s ease 2.3s forwards;
}

/* 描述文字 */
.description {
  position: absolute;
  right: 0;
  top: 0;
  width: 240px;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  font-family: Georgia, "Times New Roman", serif;
  opacity: 0;
  transform: translateY(20px);
}

.editorial-page.is-revealed .description {
  animation: fadeUp 0.9s ease forwards;
}

/* Keyframes */
@keyframes fadeDown {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes circlePop {
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes charReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes charRevealCursive {
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes badgeReveal {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes fadeSlideLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes fadeSlideRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ════════════════════════════════════════════════════════════
   闪光条
   ════════════════════════════════════════════════════════════ */
/* 闪光条 */
.flash-bar {
  position: fixed;
  left: 0;
  width: 100%;
  height: 3px;
  top: 100vh;
  background: #e8e8e8;
  box-shadow:
    0 0 30px 10px rgba(255, 255, 255, 0.7),
    0 0 80px 30px rgba(200, 210, 255, 0.25),
    0 0 140px 60px rgba(180, 195, 255, 0.1);
  filter: blur(1px);
  opacity: 0;
  pointer-events: none;
  z-index: 999;
  will-change: top, opacity;
}

.flash-glow {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 400px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 20%,
    rgba(220, 230, 255, 0.18) 50%,
    rgba(255, 255, 255, 0.08) 80%,
    transparent 100%
  );
  filter: blur(80px);
  pointer-events: none;
}

/* ════════════════════════════════════════════════════════════
   滚动占位区
   ════════════════════════════════════════════════════════════ */
.top-spacer {
  height: 200vh;
  background: transparent;
  pointer-events: none;
  position: relative;
}

.landing-strip {
  height: 150px;
  pointer-events: none;
}

.dark-theme {
  background: #000000 !important;
  color: #f0f0f0 !important;
}

/* ════════════════════════════════════════════════════════════
   【区域2】斯普特尼克时刻
   ════════════════════════════════════════════════════════════ */
.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Zone 1: 目录页 */
.zone1-content {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: #010101;
  overflow: hidden;
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
}

.zone1-topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 40px 0;
  position: relative;
  z-index: 10;
}

.topnav-left {
  display: flex;
  align-items: center;
  gap: 28px;
}

.topnav-link {
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  text-transform: uppercase;
  padding-bottom: 4px;
  border-bottom: 1px solid transparent;
  transition: all 0.25s ease;
  cursor: pointer;
}

.topnav-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

.topnav-link.is-active {
  color: #ffffff;
  border-bottom-color: #1a1a1a;
  font-weight: 700;
}

.topnav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.topnav-report {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
}

.topnav-brand {
  font-family: "Oswald", sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #ffffff;
  text-transform: uppercase;
}

.topnav-page {
  font-family: "Oswald", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.05em;
}

.zone1-grid {
  display: grid;
  grid-template-columns: 38% 62%;
  min-height: calc(100vh - 50px);
  position: relative;
  padding: 0 40px 40px;
}

.zone1-left {
  position: relative;
  padding: 24px 0 0 0;
  display: flex;
  flex-direction: column;
}

.toc-section {
  position: relative;
  z-index: 5;
  margin-bottom: 20px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 260px;
}

.toc-list li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: clamp(10px, 0.85vw, 13px);
  line-height: 1.7;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 5px;
  padding-right: 8px;
}

.toc-list li .toc-text.is-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toc-list li .toc-text.is-link:hover {
  color: #ffffff;
  text-decoration-color: rgba(255, 255, 255, 0.8);
}

.toc-page {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 12px;
  letter-spacing: 0.02em;
}

.mega-number {
  font-family: "Oswald", sans-serif;
  font-size: clamp(280px, 36vw, 520px);
  font-weight: 700;
  line-height: 0.72;
  color: rgba(26, 26, 26, 0.88);
  letter-spacing: -0.03em;
  user-select: none;
  z-index: 1;
  pointer-events: none;
  position: absolute;
  bottom: -20px;
  left: -20px;
}

.zone1-right {
  padding: 4vh 0 0 20px;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.zone1-title {
  font-family: "Playfair Display", "Noto Serif SC", "Songti SC", serif;
  font-size: clamp(42px, 5vw, 72px);
  font-weight: 700;
  margin: 0 0 36px 0;
  letter-spacing: -0.01em;
  line-height: 1;
  color: rgba(205, 205, 205, 0.75);
  text-transform: uppercase;
}

.zone1-feature-image {
  margin: 0;
  width: 85%;
  max-width: 720px;
  align-self: center;
  position: relative;
}

.zone1-feature-image img {
  width: 100%;
  height: auto;
  display: block;
  filter: grayscale(30%) contrast(1.08) brightness(0.95);
}

.zone1-feature-image figcaption {
  margin-top: 16px;
  font-size: clamp(9px, 0.8vw, 12px);
  line-height: 1.7;
  color: rgba(205, 205, 205, 0.75);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-align: left;
}

.zone1-feature-image figcaption strong {
  font-weight: 700;
  color: rgba(205, 205, 205, 0.75);
}

/* 滚动动画系统 */
.scroll-animate {
  opacity: 0;
  will-change: transform, opacity;
}

.scroll-animate.is-visible {
  opacity: 1;
  transform: none;
}

[data-animate="fade-down"] {
  transform: translateY(-30px);
  transition:
    opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1),
    transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

[data-animate="fade-up"] {
  transform: translateY(40px);
  transition:
    opacity 0.9s cubic-bezier(0.19, 1, 0.22, 1),
    transform 0.9s cubic-bezier(0.19, 1, 0.22, 1);
}

[data-animate="slide-right"] {
  transform: translateX(60px);
  opacity: 0;
  transition:
    opacity 1s cubic-bezier(0.19, 1, 0.22, 1),
    transform 1s cubic-bezier(0.19, 1, 0.22, 1);
}

[data-animate="slide-up"] {
  transform: translateY(60px);
  transition:
    opacity 1s cubic-bezier(0.19, 1, 0.22, 1),
    transform 1s cubic-bezier(0.19, 1, 0.22, 1);
}

[data-animate="fade-left"] {
  transform: translateX(-30px);
  transition:
    opacity 0.7s cubic-bezier(0.19, 1, 0.22, 1),
    transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);
}

[data-animate="scale-in"] {
  transform: scale(0.85);
  transition:
    opacity 1.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-animate="grow-height"] {
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1) 0.3s;
}
[data-animate="grow-height"].is-visible {
  transform: scaleY(1);
}

[data-animate="fade-in"] {
  transition: opacity 0.8s ease;
}

[data-animate="stagger-up"] .toc-list li {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s cubic-bezier(0.19, 1, 0.22, 1),
    transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}

[data-animate="stagger-up"].is-visible .toc-list li:nth-child(1) {
  transition-delay: 0.05s;
}
[data-animate="stagger-up"].is-visible .toc-list li:nth-child(2) {
  transition-delay: 0.1s;
}
[data-animate="stagger-up"].is-visible .toc-list li:nth-child(3) {
  transition-delay: 0.15s;
}
[data-animate="stagger-up"].is-visible .toc-list li:nth-child(4) {
  transition-delay: 0.2s;
}
[data-animate="stagger-up"].is-visible .toc-list li:nth-child(5) {
  transition-delay: 0.25s;
}
[data-animate="stagger-up"].is-visible .toc-list li:nth-child(6) {
  transition-delay: 0.3s;
}
[data-animate="stagger-up"].is-visible .toc-list li:nth-child(7) {
  transition-delay: 0.35s;
}
[data-animate="stagger-up"].is-visible .toc-list li:nth-child(8) {
  transition-delay: 0.4s;
}
[data-animate="stagger-up"].is-visible .toc-list li:nth-child(9) {
  transition-delay: 0.45s;
}
[data-animate="stagger-up"].is-visible .toc-list li:nth-child(10) {
  transition-delay: 0.5s;
}
[data-animate="stagger-up"].is-visible .toc-list li:nth-child(11) {
  transition-delay: 0.55s;
}

[data-animate="stagger-up"].is-visible .toc-list li {
  opacity: 1;
  transform: translateY(0);
}

/* Zone 2 内部 stagger */
.zone2-text-editorial .scroll-animate {
  transition-delay: 0s;
}
.zone2-text-editorial .scroll-animate.is-visible:nth-child(1) {
  transition-delay: 0.1s;
}
.zone2-text-editorial .scroll-animate.is-visible:nth-child(2) {
  transition-delay: 0.25s;
}
.zone2-text-editorial .scroll-animate.is-visible:nth-child(3) {
  transition-delay: 0.4s;
}

.zone2-meta .scroll-animate {
  transition-delay: 0s;
}
.zone2-meta .scroll-animate.is-visible:nth-child(1) {
  transition-delay: 0.1s;
}
.zone2-meta .scroll-animate.is-visible:nth-child(2) {
  transition-delay: 0.2s;
}
.zone2-meta .scroll-animate.is-visible:nth-child(3) {
  transition-delay: 0.3s;
}
.zone2-meta .scroll-animate.is-visible:nth-child(4) {
  transition-delay: 0.4s;
}

.zone2-bottom-quote.scroll-animate {
  transition-delay: 0.3s;
}

/* Zone 2: 引言区 */
.zone2-editorial {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: grid;
  grid-template-columns: 180px 1fr 220px;
  grid-template-rows: 1fr auto;
  gap: 0;
  overflow: hidden;
  font-family:
    "Noto Serif SC", "Source Han Serif SC", "STSong", "SimSun", serif;
}

.zone2-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(5, 8, 18, 0.92) 0%,
    rgba(10, 14, 28, 0.88) 50%,
    rgba(8, 12, 22, 0.94) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.zone2-dot-texture {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.06) 0%,
    transparent 2px
  );
  background-size: 32px 32px;
  opacity: 0.4;
  z-index: 2;
  pointer-events: none;
  animation: zone2DotFloat 20s ease-in-out infinite;
}

@keyframes zone2DotFloat {
  0%,
  100% {
    transform: translate(0, 0);
    opacity: 0.3;
  }
  50% {
    transform: translate(-10px, -6px);
    opacity: 0.5;
  }
}

.zone2-quote-left {
  position: relative;
  z-index: 3;
  padding: 48px 24px 48px 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.zone2-quote-label {
  font-family: "Inter", sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  margin: 0 0 12px 0;
}

.zone2-quote-title {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(18px, 2vw, 28px);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
  margin: 0 0 24px 0;
  letter-spacing: 0.08em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.zone2-quote-line {
  width: 1px;
  height: 80px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent);
}

.zone2-text-editorial {
  position: relative;
  z-index: 3;
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.zone2-paragraph {
  font-family:
    "Noto Serif SC", "Source Han Serif SC", "STSong", "SimSun", serif;
  font-size: clamp(15px, 1.6vw, 22px);
  line-height: 2.2;
  color: rgba(255, 255, 255, 0.78);
  margin: 0 0 2em 0;
  letter-spacing: 0.06em;
  font-weight: 400;
  max-width: 640px;
}

.zone2-paragraph:last-child {
  margin-bottom: 0;
}

.zone2-paragraph.highlight {
  font-size: clamp(18px, 2vw, 26px);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
  letter-spacing: 0.08em;
  padding-left: 24px;
  border-left: 2px solid rgba(255, 255, 255, 0.25);
}

.zone2-emphasis {
  font-size: 1.15em;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.12em;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.15);
}

.zone2-meta {
  position: relative;
  z-index: 3;
  padding: 48px 48px 48px 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.zone2-meta-item {
  margin: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.zone2-meta-item:last-child {
  margin-bottom: 0;
}

.meta-label {
  font-family: "Inter", sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
}

.meta-value {
  font-family: "Inter", "Noto Serif SC", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.04em;
}

.zone2-bottom-quote {
  grid-column: 1 / -1;
  position: relative;
  z-index: 3;
  padding: 36px 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
  text-align: center;
}

.zone2-bottom-text {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(16px, 1.8vw, 24px);
  font-weight: 600;
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.06em;
  line-height: 1.8;
  margin: 0 0 8px 0;
}

/* Zone 3: 视频层 */
.zone3-video {
  width: 100%;
  height: 1800vh;
  position: relative;
  background: #000000;
}

.zone3-sticky-wrapper {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.video-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.narrative-layer-teleported {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.5s ease-out;
}

.narrative-layer-teleported.is-hidden {
  opacity: 0;
  pointer-events: none;
}

.narrative-layer-teleported .narrative-block {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 860px;
  width: 100%;
  padding: 0 60px;
  text-align: center;
}

.narrative-layer-teleported .narrative-text {
  font-family:
    "Noto Serif SC", "Source Han Serif SC", "STSong", "FangSong", "SimSun",
    serif;
  font-size: clamp(18px, 2.2vw, 30px);
  line-height: 2.2;
  color: rgba(255, 255, 255, 0.96);
  text-shadow:
    0 2px 20px rgba(0, 0, 0, 0.85),
    0 0 40px rgba(0, 0, 0, 0.5),
    0 0 80px rgba(0, 0, 0, 0.3);
  margin: 0 0 1.2em 0;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.narrative-layer-teleported .narrative-text:last-child {
  margin-bottom: 0;
}

.narrative-layer-teleported .narrative-block.finale .narrative-text {
  font-size: clamp(26px, 3.2vw, 44px);
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #ffffff;
  text-shadow:
    0 4px 30px rgba(0, 0, 0, 0.95),
    0 0 60px rgba(0, 0, 0, 0.6),
    0 0 120px rgba(255, 255, 255, 0.08);
}

.white-theme {
  background: #ffffff !important;
  color: #1a1a1a !important;
}

/* 【03】功能区 */
.feature-section.orange-theme {
  position: relative;
  height: 100vh;
  background: linear-gradient(
    135deg,
    #000000 10%,
    #0a0a0a 50%,
    #000000 90%
  ) !important;
  color: #ffffff !important;
  overflow: hidden;
}

.feature-outer-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.feature-section.orange-theme::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 60%
  );
  animation: featureFloat 20s ease-in-out infinite;
  pointer-events: none;
}

@keyframes featureFloat {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(30px, -30px) rotate(180deg);
  }
}

/* 【04】招募区 */
.transition-section.blue-theme {
  position: relative;
  height: 100vh;
  background: #0c0c0c !important;
  color: #ffffff !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.recruit-header {
  padding: 48px 80px 0;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.recruit-title {
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 400;
  line-height: 1.1;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.02em;
}

.recruit-title .title-light {
  color: rgba(255, 255, 255, 0.45);
  font-weight: 300;
}

.recruit-hero {
  position: relative;
  padding: 40px 80px;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 0;
  overflow: hidden;
}

/* 【05】页脚 */
.footer-section.white-theme {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 10;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.footer-cta {
  position: relative;
  width: 100%;
  min-height: 280px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.cta-bg-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%);
  position: relative;
}

.cta-bg-placeholder::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 40%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(196, 30, 30, 0.06),
    transparent
  );
  filter: blur(40px);
}

.cta-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 60%,
    #ffffff 100%
  );
  z-index: 1;
}

.cta-content {
  position: relative;
  z-index: 2;
  padding: 30px 20px;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: clamp(24px, 3.5vw, 40px);
  font-weight: 600;
  line-height: 1.15;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
  color: #1a1a1a;
}

.cta-desc {
  font-size: clamp(13px, 1.3vw, 15px);
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.6);
  margin: 0 0 24px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #c41e1e;
  color: #fff;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.cta-button:hover {
  background: #a31818;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(196, 30, 30, 0.3);
}

.arrow {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow {
  transform: translateX(4px);
}

.cta-button-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.cta-button-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #c41e1e;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
}

.cta-button-circle:hover {
  background: #a31818;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(196, 30, 30, 0.3);
}

/* 悬浮正方形样式 */
.floating-square {
  position: fixed;
  z-index: 9999;
  background: linear-gradient(135deg, #c41e1e, #ff6b6b);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(196, 30, 30, 0.4);
  cursor: grab;
  user-select: none;
  touch-action: none;
  transition: box-shadow 0.2s ease;
}

.floating-square:active {
  cursor: grabbing;
  box-shadow: 0 15px 50px rgba(196, 30, 30, 0.6);
}

.circle-icon {
  transition: transform 0.3s ease;
}

.cta-button-circle:hover .circle-icon {
  transform: scale(1.1);
}

.footer-contact {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px 60px 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  flex-wrap: wrap;
  gap: 20px;
  flex-shrink: 0;
}

.contact-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.7);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.phone {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
  margin: 0;
  letter-spacing: 0.05em;
}

.contact-right {
  text-align: right;
}

.touch-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin: 0 0 6px 0;
  letter-spacing: 0.1em;
}

.email {
  font-size: clamp(16px, 2.2vw, 24px);
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: opacity 0.3s ease;
}

.email:hover {
  opacity: 0.6;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
  gap: 16px;
  flex-shrink: 0;
}

.links-left,
.links-right {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.link-item {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  text-decoration: none;
  letter-spacing: 0.08em;
  transition: color 0.3s ease;
  position: relative;
}

.link-item::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: #1a1a1a;
  transition: width 0.3s ease;
}

.link-item:hover {
  color: #1a1a1a;
}

.footer-big-text {
  width: 100%;
  text-align: center;
  margin: 5px 0 0;
  overflow: hidden;
  line-height: 0.75;
  user-select: none;
  pointer-events: none;
  flex-shrink: 0;
}

.footer-big-text span {
  display: block;
  font-size: clamp(60px, 12vw, 180px);
  font-weight: 700;
  color: rgba(0, 0, 0, 0.03);
  letter-spacing: -0.04em;
  white-space: nowrap;
  transform: translateY(15%);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 80px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
  gap: 16px;
}

.copyright {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
  margin: 0;
  letter-spacing: 0.08em;
}

.legal-links {
  display: flex;
  gap: 24px;
}

.legal-links a {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
  text-decoration: none;
  letter-spacing: 0.08em;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: rgba(0, 0, 0, 0.7);
}

/* 底部 Logo 容器 */
.footer-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0 40px;
  width: 100%;
  flex-shrink: 0;
}

.footer-logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-logo img {
  max-width: 200px;
  max-height: 180px;
  object-fit: contain;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-wide-bar {
  width: 120vw;
  height: 100px;
  background: linear-gradient(90deg, #ff4444 0%, #d62828 50%, #ff4444 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  box-shadow: 0 0 60px rgba(255, 68, 68, 0.5);
  animation: slideExpand 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-wide-bar p {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.close-hint {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-style: italic;
}

@keyframes slideExpand {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 120vw;
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.7);
  }
}

/* 全屏按钮 */
.fullscreen-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 50;
}

.fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.fullscreen-btn svg {
  width: 20px;
  height: 20px;
}

/* 卡牌全屏弹窗 */
.pokemon-fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.pokemon-fullscreen-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.pokemon-fullscreen-content :deep(.slider) {
  width: 100%;
  max-width: 1200px;
  transform: scale(1.2);
}

/* 全屏过渡动画 */
.fullscreen-enter-active,
.fullscreen-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fullscreen-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fullscreen-enter-from .pokemon-fullscreen-content {
  transform: scale(0.8);
}

.fullscreen-enter-from .fullscreen-close-btn {
  opacity: 0;
  transform: scale(0.5) rotate(-180deg);
}

.fullscreen-enter-from .fullscreen-hint {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.fullscreen-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.fullscreen-leave-to .pokemon-fullscreen-content {
  transform: scale(1.1);
}

.fullscreen-leave-to .fullscreen-close-btn {
  opacity: 0;
  transform: scale(0.5) rotate(180deg);
}

.fullscreen-leave-to .fullscreen-hint {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.fullscreen-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2001;
}

.fullscreen-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg);
}

.fullscreen-close-btn svg {
  width: 24px;
  height: 24px;
}

.fullscreen-hint {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* 路由过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 1024px) {
  .zone1-grid {
    grid-template-columns: 42% 58%;
    padding: 0 24px 32px;
  }
  .zone1-topnav {
    padding: 14px 24px 0;
  }
  .topnav-left {
    gap: 16px;
  }
  .topnav-link {
    font-size: 9px;
  }
  .zone1-right {
    padding: 2vh 0 0 12px;
  }
  .mega-number {
    font-size: clamp(200px, 30vw, 380px);
  }
  .zone2-editorial {
    grid-template-columns: 140px 1fr 180px;
  }
  .zone2-text-editorial {
    padding: 40px 40px;
  }
  .zone2-quote-left {
    padding: 36px 16px 36px 24px;
  }
  .zone2-meta {
    padding: 36px 24px 36px 20px;
  }
}

@media (max-width: 768px) {
  .hero {
    height: 75vh;
  }
  .blue-circle {
    width: 65vw;
    height: 65vw;
  }
  .title-cursive {
    font-size: clamp(60px, 18vw, 140px);
    top: 42%;
  }
  .model-placeholder {
    width: 200px;
    height: 200px;
  }
  .center-badge {
    gap: 8px;
  }
  .badge-text {
    font-size: 9px;
    padding: 4px 10px;
  }
  .badge-line {
    width: 16px;
  }
  .title-bottom {
    font-size: clamp(36px, 10vw, 80px);
    bottom: 12vh;
  }
  .category-line {
    font-size: 8px;
    bottom: 6vh;
  }
  .description {
    right: 4vw;
    top: 18vh;
    width: 160px;
    font-size: 12px;
  }

  .zone1-grid {
    grid-template-columns: 1fr;
    padding: 0 20px 32px;
  }
  .zone1-left {
    padding: 16px 0 0 0;
  }
  .mega-number {
    font-size: clamp(200px, 55vw, 380px);
    position: relative;
    bottom: auto;
    left: -10px;
    margin-top: -40px;
  }
  .zone1-right {
    padding: 0;
    margin-top: -60px;
  }
  .zone1-title {
    margin-bottom: 24px;
  }
  .zone1-feature-image {
    width: 100%;
  }
  .zone1-topnav {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 20px 0;
  }
  .topnav-left {
    flex-wrap: wrap;
    gap: 12px;
  }
  .topnav-right {
    width: 100%;
    justify-content: space-between;
  }

  .zone2-editorial {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
  }
  .zone2-quote-left {
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 24px 24px 16px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .zone2-quote-title {
    writing-mode: horizontal-tb;
    margin-bottom: 0;
    font-size: 18px;
  }
  .zone2-quote-line {
    width: 40px;
    height: 1px;
  }
  .zone2-text-editorial {
    padding: 32px 24px;
  }
  .zone2-meta {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
    padding: 20px 24px;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .zone2-meta-item {
    margin-bottom: 0;
  }
  .zone2-bottom-quote {
    padding: 24px;
  }

  .narrative-layer-teleported .narrative-block {
    padding: 0 24px;
    max-width: 100%;
  }
  .narrative-layer-teleported .narrative-text {
    font-size: clamp(15px, 4vw, 20px);
    line-height: 2;
    letter-spacing: 0.06em;
  }
  .narrative-layer-teleported .narrative-block.finale .narrative-text {
    font-size: clamp(20px, 5vw, 28px);
  }

  .recruit-header,
  .recruit-hero {
    padding-left: 24px;
    padding-right: 24px;
  }
  .footer-contact,
  .footer-links,
  .footer-bottom {
    padding-left: 24px;
    padding-right: 24px;
  }
  .footer-contact {
    flex-direction: column;
    gap: 30px;
  }
  .contact-right {
    text-align: left;
  }
  .footer-links {
    flex-direction: column;
    align-items: flex-start;
  }
  .links-left,
  .links-right {
    gap: 16px;
  }
  .footer-bottom {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  .cta-title br {
    display: none;
  }
  .modal-wide-bar {
    width: 140vw;
    height: 80px;
  }
  .modal-wide-bar p {
    font-size: 18px;
  }
}
</style>
