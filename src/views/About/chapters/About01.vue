<template>
  <div class="records-page">
    <GridBackground />
    <section class="information">
      <div class="information_top">
        <span class="information_top_title _font_3">启程·缘起</span>
        <span
          class="information_top_code _font_2"
          style="color: var(--color_theme)"
          >VOYAGER-001</span
        >
      </div>

      <div class="information_middle">
        <div class="information_middle_image">
          <img
            :src="asset('Aboutpage/about 1-1.jpg')"
            alt="泰坦IIIE-半人马座火箭搭载旅行者一号发射升空"
            class="main-image"
          />
        </div>

        <div class="information_middle_content">
          <div class="information_middle_content_instrution _font_1_5">
            <p>
              1965年，加州理工博士生<strong style="color: var(--color_theme)"
                >加里·弗兰德罗</strong
              >发现：1970年代末四颗巨行星将排列成<strong
                style="color: var(--color_theme)"
                >176年一遇的几何构型</strong
              >。利用"引力弹弓"，连续飞越四大行星仅需12年。这一发现催生了"行星大旅行计划"，却因预算竞争于1971年被迫取消。JPL团队提出简化版"水手木星-土星计划"，1972年获批，最终孕育了改变历史的旅行者号。
            </p>
          </div>
          <div class="information_middle_content_data _font_1_5">
            <p>发现行星排列 <span>1965年</span></p>
            <p>大旅行计划 <span>1969 — 1971</span></p>
            <p>水手计划转型 <span>1972年</span></p>
            <p>更名旅行者 <span>1977年3月</span></p>
            <p>发射日期 <span>1977.9.5</span></p>
            <p>预算 <span>3.6亿美元</span></p>
          </div>
          <div class="information_middle_content_arrow" />
        </div>
      </div>

      <div class="information_code _font_1">
        // 176年一次的宇宙邀约 · 人类勇气与远见的序章
      </div>
    </section>

    <section class="chapter">
      <div class="chapter_decor" />
      <div class="chapter_title">
        <p class="_font_4">诞生档案</p>
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
            >🔭 天赐良机 · 打孔卡上的宇宙密码</strong
          >：1965年，JPL实习生加里·弗兰德罗在IBM
          7094计算机的打孔卡上运行轨道模拟时，注意到一个异常的能量增益曲线——四颗巨行星的引力可以像接力棒一样依次传递。这种排列每<strong
            style="color: var(--color_theme)"
            >176年</strong
          >才出现一次，错过将再等近两个世纪。<strong
            style="color: var(--color_theme)"
            >同年</strong
          >，美国民权运动在塞尔玛达到高潮，越南战争升级，苏联宇航员列昂诺夫完成人类首次太空行走。冷战在地球和近地轨道上角力，深空探测显得奢侈而遥远。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >⚡ 引力弹弓 · 借用行星之力</strong
          >：探测器飞掠行星时，可借用行星引力获得加速度，改变轨道、节省燃料。利用176年一遇的排列，一次发射就能依次飞越木星、土星、天王星、海王星——常规需要30年的航程被压缩至<strong
            style="color: var(--color_theme)"
            >12年</strong
          >。这个发现被迅速上报，NASA高层在1966年的内部备忘录中称之为"世纪窗口"。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >📜 大旅行计划的兴衰 · 从雄心到幻灭</strong
          >：1969年，NASA提出"行星大旅行计划"，发射4个探测器，总预算高达<strong
            style="color: var(--color_theme)"
            >10亿美元</strong
          >。然而阿波罗登月耗尽近40%预算，航天飞机项目抢占资源，该计划于<strong
            style="color: var(--color_theme)"
            >1971年被取消</strong
          >。<strong style="color: var(--color_theme)">同期</strong
          >，先驱者10号正朝木星进发验证航线安全性；水手计划系列已飞掠金星与火星，积累了宝贵的轨道力学经验。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🚀 水手计划的转型 · 不屈的简化版</strong
          >：JPL团队迅速提出简化版<strong style="color: var(--color_theme)"
            >"水手木星-土星计划"</strong
          >——仅专注探测木星和土星，但保留扩展可能性。预算压缩至<strong
            style="color: var(--color_theme)"
            >3.6亿美元</strong
          >，于1972年获正式批准。<strong style="color: var(--color_theme)"
            >同年</strong
          >，美苏签署《反弹道导弹条约》，冷战太空竞赛从"登月较量"转向长期探测布局。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🏷️ 命名与双子星 · 从水手到旅行者</strong
          >：原计划命名为"水手11号"和"水手12号"，NASA最终在<strong
            style="color: var(--color_theme)"
            >1977年3月</strong
          >将其更名为"旅行者1号"和"旅行者2号"。<strong
            style="color: var(--color_theme)"
            >同年</strong
          >，苹果电脑公司成立，电影《星球大战》上映，太空科幻热潮席卷全球，间接提升了公众对真实太空探索的关注度。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >⏱️ 发射时刻 · 后发先至的传奇</strong
          >：<strong style="color: var(--color_theme)">1977年9月5日</strong
          >，旅行者1号在卡纳维拉尔角由泰坦IIIE-半人马座火箭发射升空。它的"妹妹"旅行者2号<strong
            style="color: var(--color_theme)"
            >早于半个月前（8月20日）</strong
          >先行出发。就在2号发射前两天，NASA还发射了高能天文台1号，开启X射线天文学新时代。1号凭借更快的弹道后发先至，成为人类派往外太阳系的先锋。它回望地球拍摄的<strong
            style="color: var(--color_theme)"
            >"暗淡蓝点"</strong
          >——地球只是一个悬浮在阳光中的微尘，承载着我们所有的爱与希望。
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
const currentPage = ref(1);

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
._font_1_5 {
  font-size: calc(var(--scale) * 1.1rem);
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
  border-bottom: var(--border_m) solid var(--border-color);
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
  background-color: var(--border-color);
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}
.information_middle_content_instrution p {
  color: var(--text-color);
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
  color: var(--text-color);
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
  background: var(--text-color);
}
.chapter_decor::after {
  content: "";
  position: absolute;
  left: calc(var(--scale) * 0.7rem);
  top: 50%;
  transform: translateY(-50%);
  width: calc(var(--scale) * 4rem);
  height: var(--border_xs);
  background: var(--text-color);
}
.chapter_title {
  display: flex;
  align-items: center;
  color: var(--color_theme);
  margin-bottom: calc(var(--scale) * 4rem);
  position: relative;
  padding-bottom: calc(var(--scale) * 1.5rem);
  border-bottom: var(--border_s) solid rgba(255, 255, 255, 0.1);
  width: 100%;
}
.chapter_title p {
  color: var(--text-color);
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
  color: rgba(255, 255, 255, 0.3);
}
.chapter_section {
  color: var(--text-color);
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
  right: var(--margin_x);
  top: -50px;
  right: 100px;
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
