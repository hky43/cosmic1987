<template>
  <div class="records-page">
    <GridBackground />
    <section class="information">
      <div class="information_top">
        <span class="information_top_title _font_3">土星探测·艰难抉择</span>
        <span
          class="information_top_code _font_2"
          style="color: var(--color_theme)"
          >VOYAGER-005</span
        >
      </div>

      <div class="information_middle">
        <div class="information_middle_image">
          <img
            :src="asset('Aboutpage/about 6-1.jpg')"
            alt="旅行者一号拍摄的土星及其环系统"
            class="main-image"
          />
        </div>

        <div class="information_middle_content">
          <div class="information_middle_content_instrution _font_1_5">
            <p>
              1980年8月22日，旅行者一号进入土星观测阶段。11月12日抵达距土星中心约126,000公里的最近点。为了近距离探测土卫六泰坦，任务团队做出影响深远的决定：让探测器偏转出黄道面，<strong
                style="color: var(--color_theme)"
                >失去继续前往天王星和海王星的机会</strong
              >。这一牺牲换来了泰坦大气层的重大发现——氮气为主、含有甲烷和复杂碳氢化合物的浓密橙色雾霭，直接催生了后来的卡西尼-惠更斯任务。土星环的复杂性也远超想象：数千条细密密环带、神秘的"轮辐"状暗纹、F环与牧羊犬卫星。
            </p>
          </div>
          <div class="information_middle_content_data _font_1_5">
            <p>最近距离 <span>126,000 KM</span></p>
            <p>观测期 <span>1980.08 — 11</span></p>
            <p>发现 <span>泰坦大气 / F环</span></p>
            <p>编号 <span>NO.005</span></p>
          </div>
          <div class="information_middle_content_arrow" />
        </div>
      </div>

      <div class="information_code _font_1">
        // 土星探测档案 · 1980 年的艰难抉择
      </div>
    </section>

    <section class="chapter">
      <div class="chapter_decor" />
      <div class="chapter_title">
        <p class="_font_4">探索档案</p>
        <svg viewBox="0 0 100 10" preserveAspectRatio="none">
          <line
            x1="0"
            y1="5"
            x2="85"
            y2="5"
            stroke="rgba(243,243,243,0.15)"
            stroke-width="1"
          />
          <circle cx="95" cy="5" r="3" fill="rgba(243,243,243,0.3)" />
        </svg>
      </div>
      <div class="chapter_section _font_3">
        <p>
          <strong style="color: var(--color_theme)"
            >🌍 地球上的剧变 · 里根时代的前奏</strong
          >：<strong style="color: var(--color_theme)">1980年</strong
          >，罗纳德·里根击败卡特当选美国总统，承诺"让美国再次伟大"；伊拉克入侵伊朗，两伊战争爆发；波兰团结工会成立，东欧剧变的前奏正在酝酿。<strong
            style="color: var(--color_theme)"
            >同期</strong
          >，先驱者11号已抵达土星，成为首个飞掠土星的探测器，为旅行者号提供了关键航线数据。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🎯 艰难抉择 · 泰坦还是天王星？</strong
          >：旅行者一号在土星系统的首要科学目标，是土星最大的卫星——<strong
            style="color: var(--color_theme)"
            >土卫六泰坦（Titan）</strong
          >。泰坦是太阳系中唯一拥有浓密大气层的卫星，其科学价值极高。为了近距离探测泰坦，任务团队做出了影响深远的决定：让探测器偏转出黄道面。<strong
            style="color: var(--color_theme)"
            >1980年8月的JPL任务控制室，科学家们进行了长达72小时的激烈辩论。选项A：近距离飞掠泰坦，获取大气层数据，但失去天王星和海王星的机会；选项B：保持黄道面轨道，跳过泰坦详细探测，继续外行星之旅。最终，项目科学家埃德·斯通一锤定音："泰坦的科学价值独一无二，我们不知道什么时候还能有机会近距离探测它。"</strong
          >这意味着，旅行者一号将就此失去利用引力弹弓继续前往天王星和海王星的机会。这是一个艰难的取舍，但最终，科学目标优先。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🌫️ 泰坦的秘密 · 橙色雾霭下的世界</strong
          >：这个决定的回报是巨大的。<strong style="color: var(--color_theme)"
            >旅行者一号的无线电掩星实验（让探测器飞到泰坦背后，观察地球信号如何被大气层弯曲和衰减）显示，泰坦大气层主要由氮气组成（与地球相似），并含有甲烷和复杂的碳氢化合物，形成了标志性的浓密橙色雾霭。这些有机物在紫外线照射下可能形成"托林"——一种类似早期地球原始汤的前生命化学物质。</strong
          >这一重大发现使泰坦成为未来探测任务的最高优先级目标，最终直接催生了卡西尼-惠更斯任务——一个专门为研究泰坦而设计的探测器。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >💫 环的复杂性 · 从简单到精密</strong
          >：在土星本身，旅行者一号揭示了这个光环系统的惊人复杂性。它并非几个简单的环带，而是由<strong
            style="color: var(--color_theme)"
            >数千条细密的环带</strong
          >组成。探测器发现了神秘的"轮辐"状暗纹——<strong
            style="color: var(--color_theme)"
            >这些径向条纹出现和消失的时间尺度仅数小时，暗示着电磁力或静电悬浮微粒的作用，直到2004年卡西尼号抵达后才被部分解释：微小的尘埃颗粒在土星磁场中带上静电，悬浮在环平面上方，形成瞬时的阴影图案。</strong
          >探测器还发现了被称为"辫子"的复杂结构，以及F环——一个由两颗"牧羊犬卫星"（普罗米修斯和潘多拉）引力约束的狭窄而明亮的环，还有此前未知的五颗小卫星。这些发现极大地丰富了我们对行星环动力学机制的理解。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🛰️ 备份策略 · 旅行者二号的接力</strong
          >：<strong style="color: var(--color_theme)">1981年</strong
          >，里根就职，提出"星球大战"导弹防御计划；哥伦比亚号航天飞机首次发射成功，开启可重复使用航天器时代；埃及总统萨达特遇刺身亡。NASA资源进一步向近地轨道倾斜，深空探测预算持续受压。<strong
            style="color: var(--color_theme)"
            >同期</strong
          >，旅行者2号抵达土星，继续补充探测，并承担了后续天王星和海王星的任务——这是NASA的"备份策略"：两艘探测器设计相同，轨迹互补，确保即使一艘失败，另一艘仍能完成部分目标。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🌌 告别太阳系 · 向北偏转的永恒轨迹</strong
          >：完成了对土星的探测后，旅行者一号的飞行轨迹已被不可逆转地改变。<strong
            style="color: var(--color_theme)"
            >1980年11月14日，最后一次近距离飞掠泰坦后，它以每秒约10公里的速度向北偏离黄道面，倾角约35度。</strong
          >它再也无法借助引力弹弓访问天王星和海王星，但获得了足够的速度（约17公里/秒）最终逃离太阳系。这个"告别"是设计中的牺牲——为了科学，放弃更多的行星，换取永恒的星际之旅。它开始沿着一条逃离太阳系的轨道，向上飞去，开启其作为人类星际使者的全新篇章。
        </p>
      </div>
    </section>

    <nav class="navigation">
      <div class="navigation_line">
        <svg height="100%" width="2">
          <path d="M1,0 L1,100%" stroke="var(--color_white)" stroke-width="1" />
        </svg>
      </div>
      <NavigationBar :currentPage="currentPage" @navigate="handleNavigate" />
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NavigationBar from "../../../components/NavigationBar.vue";
import GridBackground from "../../../components/GridBackground.vue";
import { useRouter, useRoute } from "vue-router";
import { asset } from "@/utils/asset";

const router = useRouter();
const route = useRoute();

// 从URL中解析当前页码
const currentPage = ref(6);

function updateCurrentPage() {
  const pageNum = parseInt(route.params.id);
  if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 8) {
    currentPage.value = pageNum;
  }
}

function handleNavigate(pageNum) {
  if (pageNum >= 1 && pageNum <= 8 && pageNum !== currentPage.value) {
    const pageStr = pageNum < 10 ? `0${pageNum}` : pageNum.toString();
    router.push(`/about/${pageStr}`);
  }
}
function handleKeyDown(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // 设置标记，告诉主页面跳过发射阶段
    sessionStorage.setItem("skipAiming", "true");
    // 导航到航天器关卡界面
    router.push("/about-2-main");
  }
}

onMounted(() => {
  audioManager.ensureGroup("about");
  window.addEventListener("keydown", handleKeyDown);
  updateCurrentPage();
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.records-page {
  --color_black: #000013;
  --color_white: #f3f3f3;
  --color_theme: #d60c0c;
  --scale: 1;
  --margin_x: calc(var(--scale) * 3rem);
  --margin_y: calc(var(--scale) * 3rem);
  --border_xs: calc(var(--scale) * 0.05rem);
  --border_s: calc(var(--scale) * 0.1rem);
  --border_m: calc(var(--scale) * 0.15rem);
  --border_l: calc(var(--scale) * 0.2rem);
  --border_xl: calc(var(--scale) * 0.3rem);
  --line_height_1: calc(var(--scale) * 1rem);
  --line_height_2: calc(var(--scale) * 1.5rem);
  --line_height_4: calc(var(--scale) * 2rem);
  --content_width: calc(var(--scale) * 65rem);
  --content_y: calc(var(--scale) * 10rem);
  --grid_size: calc(var(--scale) * 1rem);
  font-size: 2vmin;
  background-color: var(--color_black);
  color: var(--color_white);
  font-family: "VT323", "Source Code Pro", "Courier New", monospace;
  letter-spacing: 0.05em;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: calc(var(--scale) * 10rem);
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
}
._font_1 {
  font-size: calc(var(--scale) * 1rem);
}
._font_2 {
  font-size: calc(var(--scale) * 1.3rem);
}
._font_3 {
  font-size: calc(var(--scale) * 1.6rem);
}
._font_4 {
  font-size: calc(var(--scale) * 1.9rem);
}
._font_5 {
  font-size: calc(var(--scale) * 2.2rem);
}
::-webkit-scrollbar {
  display: none;
}

.information {
  width: var(--content_width);
  margin-top: var(--content_y);
  margin-bottom: calc(var(--scale) * 6rem);
  display: flex;
  flex-direction: column;
  position: relative;
}
.information_top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: var(--border_m) solid var(--color_white);
  box-sizing: border-box;
  height: calc(var(--scale) * 1.8rem);
  padding: 0 calc(var(--scale) * 1rem);
  width: 100%;
}
.information_top_title {
  color: var(--color_white);
}
.information_middle {
  display: flex;
  border-bottom: var(--border_m) solid var(--color_white);
  border-left: var(--border_m) solid var(--color_white);
  border-right: var(--border_m) solid var(--color_white);
  box-sizing: border-box;
  margin-bottom: calc(var(--scale) * 1.5rem);
  width: 100%;
}
.information_middle_image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0.1;
  width: calc(var(--scale) * 18rem * 16 / 9);
  min-height: calc(var(--scale) * 24rem);
  border-right: var(--border_m) solid var(--color_white);
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background: #000000;
}
.main-image {
  max-width: 100%;
  max-height: calc(var(--scale) * 20rem);
  object-fit: contain;
  filter: contrast(1.15) saturate(1.1);
  transition: transform 0.6s ease;
}
.main-image:hover {
  transform: scale(1.02);
}
.image-caption {
  display: flex;
  align-items: center;
  gap: calc(var(--scale) * 0.5rem);
  padding: calc(var(--scale) * 0.6rem) calc(var(--scale) * 1rem);
  width: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.8)
  );
  border-top: var(--border_xs) solid rgba(243, 243, 243, 0.1);
  box-sizing: border-box;
}
.caption-icon {
  font-size: calc(var(--scale) * 0.8rem);
  opacity: 0.7;
}
.caption-text {
  color: rgba(243, 243, 243, 0.7);
  font-size: calc(var(--scale) * 0.7rem);
  letter-spacing: calc(var(--scale) * 0.05rem);
  text-transform: uppercase;
}
.information_middle_content {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  width: 100%;
}
.information_middle_content_instrution {
  border-bottom: var(--border_m) solid var(--color_white);
  box-sizing: border-box;
  padding: calc(var(--scale) * 1.5rem);
  flex: 1;
  position: relative;
}
.information_middle_content_instrution::after {
  content: "";
  position: absolute;
  bottom: calc((var(--scale) * -1.5rem - var(--border_m)) / 2);
  left: 0;
  width: calc(var(--scale) * 1.5rem * 0.866);
  height: calc(var(--scale) * 1.5rem);
  background-color: var(--color_white);
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}
.information_middle_content_instrution p {
  color: var(--color_white);
  line-height: var(--line_height_1);
}
.information_middle_content_data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: calc(var(--scale) * 1.5rem);
  width: 100%;
}
.information_middle_content_data p {
  color: var(--color_white);
  text-transform: uppercase;
  margin-bottom: calc(var(--scale) * 1rem);
  line-height: var(--line_height_1);
}
.information_middle_content_data p:last-of-type {
  margin-bottom: 0;
}
.information_middle_content_data p span {
  color: var(--color_theme);
}
.information_middle_content_arrow {
  position: absolute;
  bottom: calc(var(--scale) * 1.5rem);
  right: calc(var(--scale) * 1.5rem);
  width: calc(var(--scale) * 2rem);
  height: calc(var(--scale) * 1rem);
  background-color: var(--color_white);
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}
.information_code {
  color: var(--color_white);
  line-height: var(--line_height_1);
}

.chapter {
  width: var(--content_width);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: var(--content_y);
  position: relative;
  padding-left: calc(var(--scale) * 8rem);
}
.chapter::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--border_xs);
  background: var(--color_red);
}
.chapter::after {
  content: "";
  position: absolute;
  left: 0;
  top: calc(var(--scale) * 0.5rem);
  width: calc(var(--scale) * 2rem);
  height: var(--border_xs);
  background: var(--color_white);
}
.chapter_decor {
  position: absolute;
  left: calc(var(--scale) * 2rem);
  top: calc(var(--scale) * 0.35rem);
  width: calc(var(--scale) * 6rem);
  height: calc(var(--scale) * 0.5rem);
}
.chapter_decor::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: calc(var(--scale) * 0.35rem);
  height: calc(var(--scale) * 0.35rem);
  border-radius: 50%;
  background: var(--color_white);
}
.chapter_decor::after {
  content: "";
  position: absolute;
  left: calc(var(--scale) * 0.7rem);
  top: 50%;
  transform: translateY(-50%);
  width: calc(var(--scale) * 4rem);
  height: var(--border_xs);
  background: var(--color_white);
}
.chapter_title {
  display: flex;
  align-items: center;
  color: var(--color_theme);
  margin-bottom: calc(var(--scale) * 4rem);
  position: relative;
  padding-bottom: calc(var(--scale) * 1.5rem);
  border-bottom: var(--border_s) solid rgba(243, 243, 243, 0.1);
  width: 100%;
}
.chapter_title p {
  color: var(--color_white);
  font-weight: 600;
  letter-spacing: calc(var(--scale) * 0.2rem);
  text-transform: uppercase;
}
.chapter_title svg {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: calc(var(--scale) * 8rem);
  height: auto;
  color: rgba(243, 243, 243, 0.3);
}
.chapter_section {
  color: var(--color_white);
  line-height: calc(var(--scale) * 2.8rem);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--scale) * 2.5rem);
}
.chapter_section p {
  text-align: justify;
  text-indent: calc(var(--scale) * 3rem);
  opacity: 0.95;
  letter-spacing: calc(var(--scale) * 0.02rem);
}
.chapter_section strong {
  font-weight: 600;
}

.navigation {
  position: fixed;
  right: 100px;
  top: -50px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 100;
  pointer-events: none;
  width: calc(100% - 150px);
  max-width: 800px;
}
.navigation > * {
  pointer-events: auto;
}
.navigation_line {
  position: absolute;
  bottom: 0;
  height: 100%;
  width: auto;
  -webkit-mask-image: linear-gradient(0deg, #000 60%, transparent);
  mask-image: linear-gradient(0deg, #000 60%, transparent);
}
.navigation_container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  box-sizing: border-box;
  height: 100%;
  margin-right: calc(var(--scale) * 0.8rem);
  padding-top: calc(var(--scale) * 5rem);
  position: relative;
}
.navigation_arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.navigation_arrow_prev {
  margin-bottom: calc(var(--scale) * 3rem);
}
.navigation_arrow div {
  background-color: var(--color_white);
  width: calc(var(--scale) * 0.8rem);
  height: calc(var(--scale) * 0.8rem * 0.866);
}
.navigation_arrow_prev div {
  margin-bottom: calc(var(--scale) * 0.5rem);
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
.navigation_arrow_next div {
  margin-top: calc(var(--scale) * 0.5rem);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}
.navigation_arrow p {
  color: var(--color_white);
}
.navigation_chapters {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  margin: calc(var(--scale) * 1.5rem) 0;
  max-height: 20vh;
  overflow-y: auto;
  padding: calc(var(--scale) * 1rem) 0;
  -webkit-mask-image: linear-gradient(
    0deg,
    transparent,
    #000 15%,
    #000 85%,
    transparent
  );
  mask-image: linear-gradient(
    0deg,
    transparent,
    #000 15%,
    #000 85%,
    transparent
  );
}
.navigation_chapters_chapter {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: calc(var(--scale) * 1.5rem);
}
.navigation_chapters_chapter p {
  color: var(--color_white);
  margin-right: calc(var(--scale) * 0.5rem);
  white-space: nowrap;
}
.navigation_chapters_chapter div {
  background-color: var(--color_theme);
  height: var(--border_xs);
  width: calc(var(--scale) * 0.8rem);
}
.navigation_readmode {
  position: absolute;
  bottom: 15vh;
  width: calc(var(--scale) * 1.5rem);
  height: calc(var(--scale) * 1.5rem);
  cursor: pointer;
  border: var(--border_s) solid var(--color_white);
  border-radius: 50%;
  box-sizing: border-box;
}

@media screen and (max-aspect-ratio: 1/1) {
  .records-page {
    --margin_x: calc(var(--scale) * 1rem);
    --margin_y: calc(var(--scale) * 2rem);
    --content_width: 70vw;
    font-size: 1.7vmax;
  }
  .information_middle {
    flex-direction: column;
  }
  .information_middle_image {
    border-right: none;
    border-bottom: var(--border_m) solid var(--color_white);
    width: 100%;
    height: calc(var(--scale) * 65vw * 9 / 16);
  }
  .information_middle_content {
    height: calc(var(--scale) * 15rem);
  }
  .navigation {
    height: 70vh;
  }
}
@media screen and (max-aspect-ratio: 3/2) {
  .records-page {
    font-size: 1.8vmin;
  }
}
@media screen and (max-aspect-ratio: 1/2) {
  .records-page {
    font-size: 1.2vmax;
  }
}
</style>
