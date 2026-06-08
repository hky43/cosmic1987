<template>
  <div class="records-page">
    <GridBackground />
    <section class="information">
      <div class="information_top">
        <span class="information_top_title _font_3">终章·永恒之旅</span>
        <span
          class="information_top_code _font_2"
          style="color: var(--color_theme)"
          >VOYAGER-006</span
        >
      </div>

      <div class="information_middle">
        <div class="information_middle_image">
          <img
            :src="asset('Aboutpage/about 7-1.jpg')"
            alt="旅行者一号拍摄的暗淡蓝点——地球在64亿公里外只是一个悬浮在阳光中的微尘"
            class="main-image"
          />
        </div>

        <div class="information_middle_content">
          <div class="information_middle_content_instrution _font_1_5">
            <p>
              每一段伟大的旅程都有终点。对于旅行者一号来说，它的终点不是坠毁或撞击，而是一场漫长而优雅的告别。能量来自三台RTG，1977年发射时总功率470瓦，到2026年已降至约240瓦。从1990年代起，工程师们开始了残酷的"能源预算管理"——2007年关等离子体加热器，2017年停紫外线光谱仪，2019年数据磁带记录仪休眠。目前仅剩四个子系统在工作。尽管发射功率仅23瓦，信号仍能从245亿公里外传回地球，单程延时超22.5小时。预计2025-2026年最后一个科学仪器关闭，约2030年连最基本通信也将中止，进入永恒的"静默巡航"。
            </p>
          </div>
          <div class="information_middle_content_data _font_1_5">
            <p>发射功率 <span>23 瓦</span></p>
            <p>当前距离 <span>约 245 亿公里</span></p>
            <p>信号延时 <span>＞22.5 小时</span></p>
            <p>进入星际空间 <span>2012年</span></p>
            <p>预计静默 <span>约 2030 年</span></p>
            <p>漂流速度 <span>约 17 公里/秒</span></p>
          </div>
          <div class="information_middle_content_arrow" />
        </div>
      </div>

      <div class="information_code _font_1">
        // 终章档案 · 一场漫长而优雅的告别
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
            >⏳ 能源的衰减 · 一场缓慢的告别</strong
          >：它的能量来自三台放射性同位素热电发生器（RTG），内装钚-238，半衰期87.7年。1977年发射时，总功率470瓦。随着钚的衰变和热电偶的老化，电力以每年约4瓦的速度下降。到2026年，可用电力已降至约240瓦，仅相当于一个老式白炽灯泡。为了延长探测器的寿命，NASA的工程师们从1990年代起开始了残酷而精密的<strong
            style="color: var(--color_theme)"
            >"能源预算管理"</strong
          >。他们制定了详细的"关机时间表"，优先保证对星际介质研究最关键的仪器存活。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >📉 关机的时刻表 · 一个个子系统的熄灭</strong
          >：2007年，等离子体子系统的加热器被关闭；2017年，紫外线光谱仪停止工作；2019年，最后的数据磁带记录仪进入休眠。目前，仅剩下宇宙射线子系统、低能带电粒子仪、磁力计和等离子体波子系统在工作。根据预测，到<strong
            style="color: var(--color_theme)"
            >2025至2026年间</strong
          >，最后一个科学仪器也将因电力不足而关闭。之后，探测器会停止科学数据回传，但或许还会发射简单的载波信号。大约在<strong
            style="color: var(--color_theme)"
            >2030年</strong
          >，连最基本的通信都将中止，旅行者一号将进入永恒的"静默巡航"。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >📡 最微弱的耳语 · 跨越245亿公里的信号</strong
          >：尽管发射功率仅23瓦，但借助直径3.7米的高增益天线，旅行者一号的信号仍能从<strong
            style="color: var(--color_theme)"
            >245亿公里</strong
          >之外传回地球。信号抵达时已衰减至10^-16瓦以下，如同宇宙中最微弱的耳语。单程信号延时已超过<strong
            style="color: var(--color_theme)"
            >22.5小时</strong
          >——当你发出一条指令，近一天后才能收到回应。深空网络的工程师们仍在坚守，用直径70米的天线捕捉这来自星际边缘的微弱心跳。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🔵 暗淡蓝点 · 1990年最动人的回眸</strong
          >：<strong style="color: var(--color_theme)">1990年</strong
          >，旅行者一号在距离地球64亿公里处拍摄<strong
            style="color: var(--color_theme)"
            >"暗淡蓝点"</strong
          >，此时海湾战争爆发，苏联解体前夕，地球正处于冷战终结的剧变中。照片中，地球只是一个0.12像素的淡蓝色光点，悬浮在阳光散射的一道光带中。卡尔·萨根在《暗淡蓝点》中写道："那是我们的家园，我们的全部……所有你爱的、认识的、听说过的每一个人，都住在这粒悬浮在阳光中的微尘上。"拍摄完成后几分钟，NASA关闭了旅行者一号的相机——为了节省电力，也因为它在有生之年不会再近距离飞越任何天体。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🌌 进入星际空间 · 人类的第一双脚印</strong
          >：<strong style="color: var(--color_theme)">2012年</strong
          >，旅行者一号进入星际空间，成为首个跨入星际介质的人造物体。<strong
            style="color: var(--color_theme)"
            >同年</strong
          >，欧洲核子研究中心宣布发现希格斯玻色子；伦敦奥运会举办；中国神舟九号实现首次载人交会对接。人类在微观粒子和近地空间取得突破，而旅行者一号已在星际介质中孤独前行。<strong
            style="color: var(--color_theme)"
            >2018年</strong
          >，旅行者2号也进入星际空间，两艘探测器在星际介质中形成人类最远的"双哨站"。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >👨‍🚀 白发工程师 · 从青年到暮年的守望</strong
          >：当那一天到来，控制室里的工程师们一定会百感交集。许多人从青年时代就参与这个任务，如今已白发苍苍。项目科学家曾动情地说："它会死，但它活得比任何人都精彩。"旅行者一号的数据催生了数千篇科学论文。而在卡尔·萨根的《暗淡蓝点》中，它更成为了人类境况的永恒隐喻。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🌠 永恒漂流 · 数十亿年的星际信使</strong
          >：即便电力耗尽，旅行者一号的旅程也不会结束。它将继续以约<strong
            style="color: var(--color_theme)"
            >17公里/秒</strong
          >的速度，在银河系中静静漂流数十亿年。它身上的金唱片——115张图像、55种语言问候、自然之声和90分钟的音乐——将在真空中完好保存。它如同远古的陶罐，是人类写给宇宙的最后一封情书。<strong
            style="color: var(--color_theme)"
            >也许在无比遥远的未来，某个外星文明会发现它，了解到在银河系一个不起眼的角落，曾经有一个叫做地球的蓝色星球，上面的人类曾经仰望星空，并将这个梦想寄往了无垠的宇宙。</strong
          >
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🔭 2025-2026 · 另一个时代的告别</strong
          >：最后一个科学仪器即将关闭。<strong style="color: var(--color_theme)"
            >与此同时</strong
          >，人工智能已深刻改变人类社会，韦伯太空望远镜正在观测宇宙最深处。旅行者一号的告别，不是结束，而是另一种开始——它将成为人类存在过的最遥远证明，在虚空中漂流，直到时间的尽头。
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
const currentPage = ref(7);

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
  background: var(--color_theme);
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
