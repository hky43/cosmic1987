<template>
  <div class="records-page">
    <GridBackground />
    <section class="information">
      <div class="information_top">
        <span class="information_top_title _font_3">蓄力·整装待发</span>
        <span
          class="information_top_code _font_2"
          style="color: var(--color_theme)"
          >VOYAGER-002</span
        >
      </div>

      <div class="information_middle">
        <div class="information_middle_image">
          <img
            :src="asset('Aboutpage/about 2-1.jpg')"
            alt="旅行者一号在JPL洁净间总装"
            class="main-image"
          />
        </div>

        <div class="information_middle_content">
          <div class="information_middle_content_instrution _font_1_5">
            <p>
              旅行者一号的发射并非一蹴而就。从1965年发现行星排列，到1972年计划获批，再到1977年夏的最后一刻，数千名工程师为一个共同目标集结：抓住1977年的发射窗口。在JPL第179号洁净间内，两艘探测器经历超过1000小时的连续测试。卡尔·萨根领衔的金唱片委员会刻录了115张图像与90分钟音乐。三台钚-238核电池注入心脏，深空网络升级至64米巨耳。超过5000人的项目团队将心血凝结成一颗奔向星海的金属心。
            </p>
          </div>
          <div class="information_middle_content_data _font_1_5">
            <p>项目启动 <span>1972年</span></p>
            <p>探测器建造 <span>1975 — 1977</span></p>
            <p>金唱片完成 <span>1977年春夏</span></p>
            <p>运抵发射场 <span>1977.7</span></p>
            <p>发射窗口 <span>1977.8.20 — 9.5</span></p>
            <p>参与人数 <span>＞5000人</span></p>
          </div>
          <div class="information_middle_content_arrow" />
        </div>
      </div>

      <div class="information_code _font_1">
        // 发射前档案 · 数千人铸就的星际方舟
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
            >📅 倒计时开始 · 从发现到立项</strong
          >：1965年弗兰德罗发现行星排列，催生"行星大旅行计划"，1971年因预算取消。不屈的JPL团队提出简化版"水手木星-土星计划"，于<strong
            style="color: var(--color_theme)"
            >1972年获正式批准</strong
          >。<strong style="color: var(--color_theme)">1975年</strong
          >，越南战争结束，美国经历战后最严重的经济衰退，通胀率超过9%，NASA预算被国会连续削减。但深空探测的齿轮已经开始转动。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🏭 建造 · 在洁净间中诞生的奇迹</strong
          >：1975年起，加州帕萨迪纳JPL第179号洁净间内开始组装探测器。环境苛刻到近乎偏执：每立方英尺空气中大于0.5微米的颗粒不得超过10万个，温度恒定在20±2℃，湿度45%±5%。工程师们穿着"兔子服"工作，每次进出都要经过空气淋浴。十面体镁合金总线、直径3.7米的抛物面天线——<strong
            style="color: var(--color_theme)"
            >天线精度要求达到毫米级</strong
          >，如果放大到足球场大小，表面起伏不能超过一粒沙子。热真空测试模拟外太阳系极寒，振动台重现火箭发射的剧烈抖动。每个子系统都经历了超过<strong
            style="color: var(--color_theme)"
            >1000小时的连续测试</strong
          >。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >💿 文明的使者 · 金唱片的故事</strong
          >：1976年秋，卡尔·萨根领衔的委员会接到特殊任务：为旅行者打造"地球名片"。<strong
            style="color: var(--color_theme)"
            >萨根曾与科幻作家亚瑟·克拉克深夜长谈</strong
          >，克拉克建议收录人类DNA序列，但因技术限制未能实现。最终，一张12英寸镀金铜唱片刻录了115张图像、55种语言问候、地球自然之声和90分钟音乐——包括巴赫、贝多芬、查克·贝里以及中国古琴曲《流水》（管平湖演奏，时长7分37秒，是唱片中最长的单首曲目）。铝制唱片套蚀刻了播放示意图和地球在银河系中的位置。萨根后来说："它更像一首关于我们自己的诗。"
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🛢️ 心脏 · 钚-238核电池的注入</strong
          >：旅行者无法使用太阳能板（外太阳系阳光仅地球的1/25），<strong
            style="color: var(--color_theme)"
            >三台放射性同位素热电发生器（RTG）</strong
          >成为它的心脏。每个RTG装有约4.5公斤钚-238氧化物，通过热电偶将衰变热转化为电力。<strong
            style="color: var(--color_theme)"
            >组装在严格安保下进行</strong
          >，每块电池封装在多层金属壳中，即使遭遇发射事故坠入海洋，也能保证放射性物质不泄漏。1977年夏季安装到位，发射时总功率470瓦——足以驱动一个小型冰箱，但在外太阳系极寒中，大部分电力还要用于仪器保温。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🔭 深空网络的进化 · 听清天外之声</strong
          >：为了接收从数亿公里外传回的微弱信号，NASA升级了<strong
            style="color: var(--color_theme)"
            >深空网络（DSN）</strong
          >：在加州、西班牙和澳大利亚三大通信站安装了直径64米（后升级至70米）的抛物面天线。即便旅行者发射功率仅23瓦，这些巨耳仍能在数十亿公里外清晰捕获信号。1977年夏季，DSN完成了任务前的最后校准，确保通信链路万无一失。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🚀 泰坦火箭的最后准备</strong
          >：在卡纳维拉尔角第41号发射台，<strong
            style="color: var(--color_theme)"
            >泰坦IIIE-半人马座运载火箭</strong
          >进行了长达数月的吊装、测试和燃料加注。芯级直径3.05米，捆绑两枚固体助推器，上面级是液氢液氧推进的半人马座。1977年7月，探测器运抵发射场进行星箭对接。8月20日，二号率先升空；半个月后，一号被推上更快的转移轨道。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >👥 团队 · 数千人的共同心跳</strong
          >：在那个计算机还依靠打孔卡的时代，JPL项目团队超过<strong
            style="color: var(--color_theme)"
            >5000人</strong
          >。项目科学家埃德·斯通从1972年项目启动就担任此职，直到2022年退休——<strong
            style="color: var(--color_theme)"
            >整整50年</strong
          >。他把一生献给了旅行者。而所有人的心血与远见，最终凝结成一颗奔向星海的金属心。
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
const currentPage = ref(2);

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
  audioManager.ensureGroup("about");
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
  --grid_size: calc(var(--scale) * 5rem);
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
