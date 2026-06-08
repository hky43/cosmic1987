<template>
  <div class="records-page">
    <GridBackground />
    <section class="information">
      <div class="information_top">
        <span class="information_top_title _font_3">木星相遇·震撼发现</span>
        <span
          class="information_top_code _font_2"
          style="color: var(--color_theme)"
          >VOYAGER-004</span
        >
      </div>

      <div class="information_middle">
        <div class="information_middle_image">
          <img
            :src="asset('Aboutpage/about 5-1.jpg')"
            alt="旅行者一号拍摄的木星大红斑特写"
            class="main-image"
          />
        </div>

        <div class="information_middle_content">
          <div class="information_middle_content_instrution _font_1_5">
            <p>
              1979年1月6日，旅行者一号正式进入木星观测阶段。3月5日抵达距木星中心约349,000公里的最近点。这场科学盛宴彻底改变了人类认知：首次在地球以外目睹<strong
                style="color: var(--color_theme)"
                >活火山喷发</strong
              >（木卫一艾奥洛基火山羽流高达160公里），发现<strong
                style="color: var(--color_theme)"
                >木星环系统</strong
              >和两颗新卫星，证实木卫二冰层下可能存在全球性液态海洋。<strong
                style="color: var(--color_theme)"
                >同期</strong
              >旅行者2号也抵达木星，形成"双机编队"从不同角度覆盖木星系统。这场壮游为后续的伽利略号、朱诺号任务铺平了道路。
            </p>
          </div>
          <div class="information_middle_content_data _font_2">
            <p>最近距离 <span>349,000 KM</span></p>
            <p>观测期 <span>1979.01 — 03</span></p>
            <p>发现 <span>活火山 / 木星环</span></p>
            <p>编号 <span>NO.004</span></p>
          </div>
          <div class="information_middle_content_arrow" />
        </div>
      </div>

      <div class="information_code _font_1">
        // 木星探测档案 · 1979 年的震撼发现
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
            >🌍 危机之年 · 地球动荡与宇宙秩序</strong
          >：<strong style="color: var(--color_theme)">1979年</strong
          >，伊朗人质危机爆发，52名美国人被扣押444天；苏联入侵阿富汗，美国发起谷物禁运；英国撒切尔夫人当选首相；索尼Walkman上市，改变人类音乐消费方式。这一年被称为"危机之年"——地球上冷战升级，而旅行者一号却在木星系统中发现了一个充满活力的微观太阳系。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🔥 艾奥火山 · 地球之外的活火</strong
          >：探测器最重大的发现，是木卫一艾奥（Io）上的活火山活动。<strong
            style="color: var(--color_theme)"
            >1979年3月8日，导航工程师琳达·莫拉比托在检查图像时，注意到边缘有一个奇怪的"蘑菇状"突起。起初她以为是胶片瑕疵，但对比其他图像后发现，这是一个高达160公里的火山喷发羽流——洛基火山正在活跃喷发。</strong
          >这是人类首次在地球以外看到活火山，推翻了"太阳系中只有地球具有地质活动"的传统认知。艾奥表面色彩斑斓，被科学家们比作"奶酪番茄披萨"——二氧化硫霜呈现白色，熔融硫呈现黄色和橙色，硫化钠呈现黑色。这种极端环境（表面温度-180℃到火山口1300℃）下的化学分馏，创造了太阳系中最奇特的地貌之一。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >⚡ 等离子体环 · 火山与磁场的共舞</strong
          >：艾奥的火山喷发释放出大量物质，在木星强大的磁场作用下形成了一个环绕木星的<strong
            style="color: var(--color_theme)"
            >等离子体环</strong
          >，成为木星磁层中物质的主要来源。探测器还意外发现了两颗新卫星——忒拜和墨提斯，并证实了此前未知的<strong
            style="color: var(--color_theme)"
            >木星环系统</strong
          >的存在。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🌀 大红斑 · 肆虐数百年的风暴之眼</strong
          >：木星大红斑的特写图像传回地球——这个直径约1.6万公里的反气旋风暴，内部存在复杂的湍流涡旋和小型风暴，旋转周期约6天，风速超过400公里/小时。<strong
            style="color: var(--color_theme)"
            >相比之下，地球上最强的飓风直径不超过1000公里，持续时间通常不超过两周。</strong
          >这个巨大的风暴已在木星大气层中肆虐了数百年，比整个地球还要大。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🌊 欧罗巴 · 冰层下的海洋预言</strong
          >：木卫二欧罗巴的表面呈现出复杂的线状结构，暗示其下方可能存在活跃的地质过程。<strong
            style="color: var(--color_theme)"
            >科学家约翰·卡萨尼在当时的新闻发布会上大胆推测："这些条纹可能是冰层裂缝，下方或许存在液态水。"这个预言在1995年伽利略号的探测中得到证实——欧罗巴冰层下隐藏着全球性液态海洋，储水量可能超过地球所有海洋总和，使其成为寻找地外生命的热门目标。</strong
          >
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🛰️ 双机编队 · 旅行者二号的协同</strong
          >：<strong style="color: var(--color_theme)">同期</strong
          >，旅行者2号抵达木星，两艘探测器形成"双机编队"，从不同角度覆盖木星系统。2号发现了木卫三（盖尼米得）表面的沟槽地形，以及木卫四（卡利斯托）上太阳系最古老的撞击坑。木卫三盖尼米得和木卫四卡利斯托也传回了大量数据，它们的表面布满了撞击坑和古老的地质痕迹。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >📖 改写教科书 · 从模糊圆盘到微观太阳系</strong
          >：这次历史性的飞掠，让木星不再是望远镜中那个带着条纹的模糊圆盘，而是一个拥有复杂卫星系统、剧烈活动和大尺度磁场的微观太阳系。旅行者一号的数据为后续的伽利略号、朱诺号任务铺平了道路。
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
const currentPage = ref(5);

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
    sessionStorage.setItem("skipAiming", "true");
    router.push("/about-2-main");
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  updateCurrentPage();
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
/* 样式与原模板完全一致，保持功能和视觉不变 */
.records-page {
  --color_black: #000013;
  --color_white: #f3f3f3;
  --color_theme: #d60c0c;
  --color_red: #d60c0c;
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
