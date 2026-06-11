<template>
  <div class="records-page">
    <GridBackground />
    <section class="information">
      <div class="information_top">
        <span class="information_top_title _font_3">星际巡航·巨行星渐近</span>
        <span
          class="information_top_code _font_2"
          style="color: var(--color_theme)"
          >VOYAGER-003</span
        >
      </div>

      <div class="information_middle">
        <div class="information_middle_image">
          <div class="image-header">
            <span class="header-label">IMAGE</span>
            <span class="header-title">Earth & Moon Portrait</span>
          </div>
          <img
            :src="asset('Aboutpage/about 4-1.jpg')"
            alt="旅行者一号拍摄的地球与月球同框照"
            class="main-image"
          />
          <div class="image-caption">
            <span class="caption-icon">📷</span>
            <span class="caption-text">旅行者一号拍摄 · 1977.9.18</span>
          </div>
        </div>

        <div class="information_middle_content">
          <div class="information_middle_content_instrution _font_1_5">
            <p>
              1977年9月5日清晨，泰坦IIIE-半人马座火箭点火升空，尾焰将泻湖照得雪白。升空后约2分钟，液压问题几乎让任务夭折，JPL团队在数秒内切换备用线路化险为夷。发射13天后，探测器在1170万公里外首次捕捉到地球与月球完整同框照——人类第一次从"外面"看见自己的家园。1977年12月19日完成"星际超车"，1978年夏秋安然穿越小行星带。在长达18个月的巡航中，仪器从未停止工作，默默记录着太阳风数据——这些数据后来成为判断探测器何时穿过日球层顶的关键基线。
            </p>
          </div>
          <div class="information_middle_content_data _font_1_5">
            <p>发射日期 <span>1977.9.5</span></p>
            <p>运载火箭 <span>泰坦IIIE-半人马座</span></p>
            <p>地月合影 <span>1977.9.18</span></p>
            <p>超越二号 <span>1977.12.19</span></p>
            <p>穿越小行星带 <span>1978.夏秋</span></p>
            <p>木星初见 <span>1979.1</span></p>
          </div>
          <div class="information_middle_content_arrow" />
        </div>
      </div>

      <div class="information_code _font_1">
        // 奔赴档案 · 从摇篮到星海的序章
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
            >🚀 晨光中的巨人 · 泰坦火箭的使命</strong
          >：1977年9月5日清晨，卡纳维拉尔角第41号发射台上，<strong
            style="color: var(--color_theme)"
            >泰坦IIIE-半人马座运载火箭</strong
          >巍然矗立。芯级直径3.05米，捆绑两枚固体助推器，加上半人马座上面级，总推力超过2400千牛。倒计时归零的瞬间，尾焰将整片泻湖照得雪白——旅行者一号踏上了一条永不回头的星际征途。<strong
            style="color: var(--color_theme)"
            >同年</strong
          >，埃及总统萨达特访问以色列，开启中东和平进程；电影《星球大战》正在影院创造票房神话，太空科幻与现实探测形成奇妙共振。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >⚡ 心跳骤停 · 液压危机与生死数秒</strong
          >：升空后约2分钟，第二级分离阶段，一个<strong
            style="color: var(--color_theme)"
            >细微的液压问题</strong
          >几乎让任务夭折。飞行控制系统反馈信号突然消失。<strong
            style="color: var(--color_theme)"
            >当时首席飞行主管迪克·霍兰德正在喝咖啡，他在3秒内做出判断：切换到备用液压线路</strong
          >。这个决定基于1973年先驱者10号的一次类似故障经验。JPL团队在数秒内果断切换，泰坦火箭重新获得控制。此后半人马座上面级两次精准点火，将探测器送入<strong
            style="color: var(--color_theme)"
            >日心转移轨道</strong
          >，速度达到每秒约17公里。这短暂的"心跳骤停"成为深空应急管理的经典案例。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🌍 告别故乡 · 第一张地月合影</strong
          >：发射仅13天后，1977年9月18日，旅行者一号已在距离地球约<strong
            style="color: var(--color_theme)"
            >1170万公里</strong
          >的深空中。它调转镜头，首次从航天器视角捕捉到<strong
            style="color: var(--color_theme)"
            >地球与月球完整同框</strong
          >的画面。<strong style="color: var(--color_theme)"
            >窄角相机使用vidicon真空管成像，分辨率800×800像素。为了同时捕捉亮度差异巨大的两个天体，工程师采用了中灰滤镜和特殊曝光组合。</strong
          >地球如一弯浅蓝色新月，月球是一个更小的灰白色斑点，两者在绝对虚空中相互依偎。这是人类第一次从"外面"看见自己的家园全貌——比著名的暗淡蓝点早了13年。这张照片标志着"星际视角"的诞生：人类终于走出了摇篮。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🏁 后发先至 · 双子星的星际超车</strong
          >：旅行者二号早于8月20日发射，但一号被注入了一条<strong
            style="color: var(--color_theme)"
            >更快的弹道</strong
          >——其日心速度增量更高，直指木星。1977年12月19日，一号从后侧悄然赶上并完成超越。这场"星际超车"由精密的轨道力学计算写就：一号的飞行轨道更短、速度更快，注定要抢先抵达木星。从此，旅行者一号成为人类派往太阳系外围的"先锋官"。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >☄️ 惊险穿越 · 碎石之海的缝隙</strong
          >：火星与木星之间横亘着一片混乱的<strong
            style="color: var(--color_theme)"
            >小行星带</strong
          >。<strong style="color: var(--color_theme)"
            >它并非科幻电影中密集的碎石场，实际上探测器穿越区域的空间密度极低——相当于在地球表面散布几颗石子后，让一只蚂蚁从中穿过。</strong
          >但高速撞击的微米级尘埃仍可能损坏光学设备。导航团队依据先驱者号数据规划了相对清朗的航线，并为探测器安装了防尘罩。1978年夏秋之交，探测器安然穿过密度最高区域，仅记录到少数几次微尘撞击，机身毫发无损。<strong
            style="color: var(--color_theme)"
            >1978年</strong
          >，意大利红色旅绑架并杀害前总理莫罗；世界上第一个试管婴儿路易丝·布朗在英国诞生。先驱者11号正借助木星引力弹弓转向土星，为旅行者号的土星探测提供关键航线数据。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🔬 看似平凡的巡航 · 科学伏笔千里</strong
          >：在长达18个月前往木星的"平淡"巡航中，旅行者一号的<strong
            style="color: var(--color_theme)"
            >等离子体波、磁力计、宇宙射线探测仪</strong
          >从未停止工作。它们默默记录着从1天文单位到5天文单位之外的太阳风速度、磁场方向、高能粒子通量。这些数据在当时只是例行公事，却在此后三十多年里成为判断探测器何时穿过日球层顶、进入星际空间的<strong
            style="color: var(--color_theme)"
            >关键基线</strong
          >。所谓"伏笔千里"，莫过于此。
        </p>

        <p>
          <strong style="color: var(--color_theme)"
            >🪐 巨行星初现 · 一只眼睛缓缓睁开</strong
          >：<strong style="color: var(--color_theme)">1979年</strong
          >，伊朗伊斯兰革命推翻巴列维王朝，中美正式建交，苏联入侵阿富汗，冷战进入新阶段。地球上政治动荡，而旅行者一号却在4亿公里外为人类带回宇宙秩序的新图景。1979年1月，木星的圆面在镜头中日渐增大。起初只是一个略显橘色的亮斑，随后浮现出浅色云带；再到那<strong
            style="color: var(--color_theme)"
            >著名的大红斑</strong
          >，仿佛一只巨眼在缓缓转动。从模糊光点到五彩斑斓的巨行星，这段"渐近"画面经由深空网络传回地球，让全体人类第一次如此清晰地目睹木星的壮丽。一场将彻底改写太阳系认知的壮游，已经悄然拉开帷幕。
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
const currentPage = ref(4);

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
  audioManager.ensureGroup('about')
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
  border-left: var(--border_m) solid var(--color_white);
  border-right: var(--border_m) solid var(--color_white);
  border-bottom: var(--border_m) solid var(--color_white);
  box-sizing: border-box;
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
.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(var(--scale) * 0.8rem) calc(var(--scale) * 1rem);
  width: 100%;
  border-bottom: var(--border_xs) solid rgba(243, 243, 243, 0.15);
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.4)
  );
}
.header-label {
  font-size: calc(var(--scale) * 0.65rem);
  color: var(--color_theme);
  letter-spacing: calc(var(--scale) * 0.15rem);
  font-weight: 600;
}
.header-title {
  font-size: calc(var(--scale) * 0.65rem);
  color: rgba(243, 243, 243, 0.7);
  letter-spacing: calc(var(--scale) * 0.05rem);
}
.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(var(--scale) * 0.8rem) calc(var(--scale) * 1rem);
  width: 100%;
  border-bottom: var(--border_xs) solid rgba(243, 243, 243, 0.15);
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.4)
  );
}
.header-label {
  font-size: calc(var(--scale) * 0.65rem);
  color: var(--color_theme);
  letter-spacing: calc(var(--scale) * 0.15rem);
  font-weight: 600;
}
.header-title {
  font-size: calc(var(--scale) * 0.65rem);
  color: rgba(243, 243, 243, 0.7);
  letter-spacing: calc(var(--scale) * 0.05rem);
}
.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(var(--scale) * 0.8rem) calc(var(--scale) * 1rem);
  width: 100%;
  border-bottom: var(--border_xs) solid rgba(243, 243, 243, 0.15);
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.4)
  );
}
.header-label {
  font-size: calc(var(--scale) * 0.65rem);
  color: var(--color_theme);
  letter-spacing: calc(var(--scale) * 0.15rem);
  font-weight: 600;
}
.header-title {
  font-size: calc(var(--scale) * 0.65rem);
  color: rgba(243, 243, 243, 0.7);
  letter-spacing: calc(var(--scale) * 0.05rem);
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
  border-left: var(--border_m) solid var(--color_white);
  border-right: var(--border_m) solid var(--color_white);
  border-bottom: var(--border_m) solid var(--color_white);
  box-sizing: border-box;
  padding: calc(var(--scale) * 1rem);
  margin-bottom: calc(var(--scale) * 1.5rem);
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