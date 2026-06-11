<template>
  <div class="archive-root">
    <!-- 纸质背景 -->
    <div class="archive-bg"></div>
    <!-- 俄文水印 -->
    <div class="bg-watermark" aria-hidden="true">
      <span
        v-for="(w, i) in watermarks"
        :key="i"
        class="watermark-text"
        :style="w"
        >{{ w.text }}</span
      >
    </div>

    <div class="archive-body">
      <!-- 顶部 -->
      <header class="archive-header">
        <div class="header-left" @click="handleBack">
          <span class="red-triangle">&#9654;</span>
          <span class="typewriter-text">退出档案</span>
        </div>
        <div class="header-right">
          <span class="timestamp">1961.04.12 — 1967.12</span>
          <div class="header-line"></div>
        </div>
      </header>

      <!-- HERO 区域：聚焦返回与后续生涯 -->
      <section class="hero-section">
        <div class="hero-left">
          <div class="the-label" style="font-size: clamp(32px, 5vw, 56px)">
            归航与荣光
          </div>
          <div class="file-title">
            <span class="file-red-box"></span>
            <span class="file-text">卷宗编号</span>
            <span class="file-number">GAG-004</span>
          </div>
          <div class="top-secret-badge" style="margin: 16px 0 20px">
            解密·英雄轨迹
          </div>
          <div class="meta-block">
            <div class="meta-item">
              <span class="meta-label">着陆时间</span>
              <span class="meta-value">1961.04.12 07:55 UTC</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">着陆点</span>
              <span class="meta-value">萨拉托夫州·恩格斯区</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">后续衔职</span>
              <span class="meta-value">宇航员队长 / 训练中心副主任</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">最高荣誉</span>
              <span class="meta-value">苏联英雄 (1961.04.14)</span>
            </div>
          </div>
        </div>

        <!-- SVG 降落伞动画（象征返回着陆） -->
        <div class="hero-right">
          <div class="launch-display">
            <svg viewBox="0 0 300 200" class="launch-svg">
              <!-- 天空背景 -->
              <rect
                width="300"
                height="200"
                fill="#e8dcca"
                stroke="#0a0a0a"
                stroke-width="2"
              />
              <!-- 降落伞 -->
              <path
                d="M140,30 Q150,10 160,30"
                stroke="#0a0a0a"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M140,30 Q150,10 160,30 Q170,30 170,50 Q150,70 130,50 Q130,30 140,30Z"
                fill="#d12e26"
                stroke="#0a0a0a"
                stroke-width="1.5"
                opacity="0.9"
              />
              <!-- 伞绳 -->
              <line
                x1="140"
                y1="30"
                x2="150"
                y2="90"
                stroke="#0a0a0a"
                stroke-width="1.5"
              />
              <line
                x1="160"
                y1="30"
                x2="150"
                y2="90"
                stroke="#0a0a0a"
                stroke-width="1.5"
              />
              <!-- 加加林（简笔） -->
              <circle
                cx="150"
                cy="100"
                r="8"
                fill="#f2c94c"
                stroke="#0a0a0a"
                stroke-width="1.5"
              />
              <rect
                x="146"
                y="108"
                width="8"
                height="15"
                fill="#d12e26"
                stroke="#0a0a0a"
                stroke-width="1"
              />
              <line
                x1="146"
                y1="115"
                x2="140"
                y2="125"
                stroke="#0a0a0a"
                stroke-width="1.5"
              />
              <line
                x1="154"
                y1="115"
                x2="160"
                y2="125"
                stroke="#0a0a0a"
                stroke-width="1.5"
              />
              <!-- 地面 -->
              <rect
                x="0"
                y="170"
                width="300"
                height="30"
                fill="#c9b8a0"
                stroke="#0a0a0a"
                stroke-width="2"
              />
              <!-- 小花草 -->
              <circle cx="60" cy="168" r="2" fill="#a31c15" />
              <circle cx="240" cy="165" r="2" fill="#a31c15" />
              <!-- 动画：缓慢下降 -->
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;0,15;0,0"
                dur="3s"
                repeatCount="indefinite"
              />
            </svg>
          </div>
        </div>
      </section>

      <div class="divider-red"></div>

      <!-- 任务进度条（象征返回过程） -->
      <div class="countdown-bar">
        <div class="countdown-label">返回事件进程</div>
        <div class="countdown-track">
          <div class="countdown-fill"></div>
        </div>
      </div>

      <!-- 双栏正文：返回过程 + 后续生涯 -->
      <section class="document-body" style="margin-top: 30px">
        <div class="body-left">
          <h3 class="marker-highlight">再入·着陆·归来</h3>
          <div class="divider-red" style="width: 40%"></div>

          <div class="timeline">
            <div
              v-for="(ev, i) in reentryEvents"
              :key="i"
              class="timeline-item"
              :style="{ animationDelay: i * 0.15 + 's' }"
            >
              <div class="timeline-time">{{ ev.time }}</div>
              <p style="font-size: 12px; line-height: 1.7">{{ ev.desc }}</p>
            </div>
          </div>

          <h3 class="marker-highlight" style="margin-top: 28px">
            英雄归来·最初时刻
          </h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            着陆后，加加林身穿橙色宇航服被当地农民发现。他立即通过电话向莫斯科报告：“任务完成，我平安着陆。”
            随后他被送往萨拉托夫州军用机场，再转至拜科努尔附近的基地。4月14日，他在莫斯科伏努科沃机场受到赫鲁晓夫、科罗廖夫及数百万民众的盛大欢迎，<strong>“苏联英雄”</strong>称号同日授予。
          </p>

          <div class="archive-card">
            <div class="card-title">首次记者会（1961.04.15）</div>
            <p class="body-text" style="font-size: 12px">
              加加林在莫斯科新闻发布会上说：“地球很小，必须珍惜它。”
              他的谦逊和微笑迅速传遍全球，成为冷战时期罕见的超越意识形态的偶像。
            </p>
          </div>

          <!-- 着陆照片占位 -->
          <div
            class="photo-frame"
            style="margin: 20px 0; max-width: 280px; transform: rotate(-1deg)"
          >
            <img :src="asset('travel/travel 4-1.jpg')" alt="返回舱着陆照片" />
          </div>
          <div class="caption">东方一号返回舱着陆现场（彩色复原）</div>
        </div>

        <div class="body-right">
          <!-- 加加林后续照片（莫斯科红场） -->
          <div
            class="photo-frame"
            style="margin-bottom: 8px; transform: rotate(1deg)"
          >
            <img :src="asset('travel/travel 4-2.jpg')" alt="加加林在莫斯科" />
          </div>
          <div class="caption" style="margin-bottom: 20px">
            加加林在莫斯科红场两侧人山人海 / 1961年4月
          </div>

          <h3 class="marker-highlight">全球巡访·友谊大使</h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            1961年至1963年，加加林以<strong>“和平大使”</strong>身份访问了超过30个国家，包括捷克斯洛伐克、保加利亚、芬兰、英国、法国、古巴、巴西、加拿大、日本等。所到之处万人空巷，他坚持用英语或当地语言问候，拒绝保镖陪同，与普通市民握手合影。
          </p>

          <div class="quote-block">
            <p style="font-size: 13px; font-style: italic; color: #a31c15">
              “加加林的微笑比任何政治宣传都更有效。” —— 西方媒体评价
            </p>
          </div>

          <h3 class="marker-highlight">晋升·训练·再上蓝天</h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            1962年，加加林当选为苏联最高苏维埃代表；1963年，他被任命为<strong>宇航员训练中心副主任</strong>，并进入茹科夫斯基空军工程学院深造（1968年毕业）。他同时继续执行飞行任务，驾驶米格-15、米格-21及教练机，总飞行时数超过1100小时。
          </p>

          <p class="body-text">
            1965年，他被授予<strong>上校军衔</strong>，并参与新一代联盟号飞船的试验工作。1966年科罗廖夫去世后，加加林负责监督联盟号飞行员的训练。他多次请求重返太空，但出于政治与安全考虑未被批准。
          </p>

          <div class="archive-card" style="border-color: #d12e26">
            <div class="card-title">加加林后续职务与活动</div>
            <div class="meta-block">
              <div class="meta-item">
                <span class="meta-label">1962–1968</span>
                <span class="meta-value">最高苏维埃代表</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">1963–1968</span>
                <span class="meta-value">宇航员训练中心副主任</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">1961–1968</span>
                <span class="meta-value">访问30余国，荣誉公民数十城</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">1965</span>
                <span class="meta-value">晋升空军上校</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">1968</span>
                <span class="meta-value">毕业于茹科夫斯基空军工程学院</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 底部标签与印章 -->
      <section class="tag-section">
        <div
          style="
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 24px;
          "
        >
          <span
            style="
              font-family: &quot;Oswald&quot;, sans-serif;
              font-size: 14px;
              color: #a31c15;
              letter-spacing: 0.1em;
            "
            >标签</span
          >
          <span class="tag-item">#归来</span>
          <span class="tag-item">#英雄</span>
          <span class="tag-item">#全球巡访</span>
          <span class="tag-item">#宇航员训练</span>
          <span class="tag-item">#苏联英雄</span>
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          "
        >
          <div
            style="
              font-family: &quot;Courier New&quot;, monospace;
              font-size: 11px;
              color: #888;
            "
          >
            本档案共5篇 · 第4篇 · 归航与后续生涯（至1968年初）
          </div>
          <div class="official-stamp">
            <span>档案局</span>
            <span style="font-size: 10px; margin-top: 2px">1968年1月</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { audioManager } from "../../../utils/audioManager";
import { asset } from "@/utils/asset";

const router = useRouter();

const handleBack = () => {
  router.push("/travel-1");
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    router.push("/travel-1");
  }
};

onMounted(() => {
  audioManager.ensureGroup("travel");
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// 水印（俄文 归航/英雄/加加林）
const watermarks = [
  {
    text: "ВОЗВРАЩЕНИЕ",
    top: "8%",
    left: "-5%",
    rotate: "14deg",
    fontSize: "105px",
    opacity: 0.06,
  },
  {
    text: "ГЕРОЙ",
    top: "35%",
    left: "58%",
    rotate: "-10deg",
    fontSize: "100px",
    opacity: 0.05,
  },
  {
    text: "ГАГАРИН",
    top: "65%",
    left: "8%",
    rotate: "7deg",
    fontSize: "95px",
    opacity: 0.04,
  },
  {
    text: "МИССИЯ ВЫПОЛНЕНА",
    top: "88%",
    left: "48%",
    rotate: "-12deg",
    fontSize: "110px",
    opacity: 0.05,
  },
];

// 返回事件时间线 (从制动到着陆)
const reentryEvents = [
  { time: "T+78’", desc: "制动发动机点火，飞船减速。" },
  {
    time: "T+80’",
    desc: "仪器舱与返回舱分离。电缆未及时脱开，两舱剧烈晃动后成功分离。",
  },
  { time: "T+85’", desc: "进入大气层，黑障区通讯中断持续约6分钟。" },
  {
    time: "T+90’",
    desc: "最大过载8-9G。外壳因摩擦燃烧，透过舷窗可见橘红色火焰。",
  },
  { time: "T+105’", desc: "弹射系统启动。加加林在7km高度弹射出舱。" },
  { time: "T+106’", desc: "个人降落伞打开。返回舱也单独降落。" },
  { time: "T+108’", desc: "加加林着陆于萨拉托夫州恩格斯区的一块农田。" },
  {
    time: "着陆后",
    desc: "被当地农民目睹并协助。加加林立即电话报告任务成功。",
  },
];
</script>

<style scoped>
/* 样式与原模板完全一致，仅保留所有细节 */
.archive-root {
  position: relative;
  min-height: 100vh;
  background: #e8dcca;
  overflow-x: hidden;
}
.archive-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-color: #e8dcca;
  background-image:
    linear-gradient(#d1c4b0 1px, transparent 1px),
    linear-gradient(90deg, #d1c4b0 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}
.archive-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
  pointer-events: none;
  mix-blend-mode: multiply;
}
.bg-watermark {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}
.watermark-text {
  position: absolute;
  font-family: "Rubik Mono One", "Arial Black", sans-serif;
  font-weight: 700;
  color: #0a0a0a;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  user-select: none;
}
.archive-body {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 40px 40px;
  font-family: "Special Elite", "Courier New", "SimSun", monospace;
  color: #1f1f1f;
}
.archive-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.header-left:hover {
  opacity: 0.7;
}
.red-triangle {
  color: #d12e26;
  font-size: 18px;
}
.typewriter-text {
  font-size: 14px;
  letter-spacing: 0.08em;
}
.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
  margin-left: 40px;
}
.timestamp {
  font-family: "Courier New", monospace;
  font-size: 13px;
  color: #0a0a0a;
  letter-spacing: 0.15em;
  margin-bottom: 8px;
}
.header-line {
  width: 100%;
  height: 2px;
  background: #0a0a0a;
}
.hero-section {
  display: grid;
  grid-template-columns: 55% 45%;
  gap: 30px;
  margin-bottom: 20px;
}
.the-label {
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 700;
  color: #d12e26;
  line-height: 0.9;
}
.file-title {
  position: relative;
  display: inline-block;
  margin: 10px 0;
}
.file-red-box {
  position: absolute;
  top: -8px;
  left: -12px;
  width: 55%;
  height: 100%;
  background: #d12e26;
  z-index: 0;
}
.file-text {
  position: relative;
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 700;
  color: #e8dcca;
  z-index: 1;
}
.file-number {
  position: relative;
  display: block;
  font-family: "Oswald", sans-serif;
  font-size: clamp(48px, 7vw, 88px);
  font-weight: 700;
  color: #0a0a0a;
  line-height: 0.9;
  z-index: 1;
}
.top-secret-badge {
  display: inline-block;
  background: #f2c94c;
  border: 3px solid #0a0a0a;
  padding: 6px 16px;
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.2em;
}
.meta-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.meta-item {
  display: flex;
  gap: 12px;
  font-size: 13px;
}
.meta-label {
  color: #a31c15;
  font-weight: bold;
  letter-spacing: 0.1em;
  min-width: 70px;
}
.meta-value {
  color: #0a0a0a;
  letter-spacing: 0.05em;
  border-bottom: 1px dashed #d1c4b0;
  flex: 1;
}
.hero-right {
  display: flex;
  align-items: center;
  justify-content: center;
}
.launch-display {
  width: 100%;
  max-width: 340px;
}
.launch-svg {
  width: 100%;
  height: auto;
  background: rgba(209, 196, 176, 0.2);
  border: 3px solid #0a0a0a;
}
.divider-red {
  height: 4px;
  background: #d12e26;
  margin-bottom: 20px;
  width: 60%;
}
.document-body {
  display: grid;
  grid-template-columns: 45% 55%;
  gap: 40px;
}
.body-left {
  border-right: 2px solid #0a0a0a;
  padding-right: 30px;
}
.body-right {
  padding-left: 10px;
}
.body-text {
  font-size: 13px;
  line-height: 1.8;
  margin-bottom: 14px;
}
.marker-highlight {
  display: inline;
  background: linear-gradient(120deg, #0a0a0a 0%, #0a0a0a 100%);
  background-repeat: no-repeat;
  background-size: 100% 45%;
  background-position: 0 70%;
  color: #e8dcca;
  padding: 4px 10px;
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: 16px;
  letter-spacing: 0.1em;
}
.timeline {
  position: relative;
  padding-left: 30px;
}
.timeline::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #d12e26;
}
.timeline-item {
  position: relative;
  margin-bottom: 20px;
  padding-left: 20px;
  animation: fade-in-up 0.5s ease forwards;
  opacity: 0;
}
.timeline-item::before {
  content: "";
  position: absolute;
  left: -28px;
  top: 4px;
  width: 14px;
  height: 14px;
  background: #d12e26;
  border: 3px solid #e8dcca;
  border-radius: 50%;
}
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.timeline-time {
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #d12e26;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}
.archive-card {
  background: rgba(209, 196, 176, 0.3);
  border: 2px solid #0a0a0a;
  padding: 20px;
  position: relative;
  margin: 16px 0;
}
.card-title {
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #d12e26;
  margin-bottom: 12px;
}
.photo-frame {
  border: 4px solid #0a0a0a;
  overflow: hidden;
  background: #c9b8a0;
  box-shadow: 6px 6px 0 rgba(10, 10, 10, 0.2);
}
.photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: contrast(1.1) sepia(0.2);
}
.caption {
  font-size: 11px;
  color: #888;
  letter-spacing: 0.1em;
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
}
.quote-block {
  background: rgba(209, 46, 38, 0.08);
  border-left: 6px solid #d12e26;
  padding: 16px 20px;
  margin: 20px 0;
}
.tag-section {
  padding: 30px 0;
  margin-top: 30px;
  border-top: 2px solid #0a0a0a;
}
.tag-item {
  font-family: "Courier New", monospace;
  font-size: 12px;
  background: #0a0a0a;
  color: #e8dcca;
  padding: 4px 10px;
  letter-spacing: 0.08em;
}
.official-stamp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid #d12e26;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  color: #d12e26;
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-weight: 700;
  font-size: 11px;
  text-align: center;
  line-height: 1.3;
  letter-spacing: 0.05em;
  transform: rotate(-12deg);
  opacity: 0.8;
}
@media (max-width: 768px) {
  .archive-body {
    padding: 20px;
  }
  .hero-section {
    grid-template-columns: 1fr;
  }
  .document-body {
    grid-template-columns: 1fr;
  }
  .body-left {
    border-right: none;
    border-bottom: 2px solid #0a0a0a;
    padding-right: 0;
    padding-bottom: 20px;
  }
  .header-right {
    margin-left: 20px;
  }
}
</style>
