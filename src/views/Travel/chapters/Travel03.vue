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
          <span class="timestamp">1961.04.11 — 1961.04.12</span>
          <div class="header-line"></div>
        </div>
      </header>

      <!-- HERO -->
      <section class="hero-section">
        <div class="hero-left">
          <div class="the-label" style="font-size: clamp(32px, 5vw, 56px)">
            发射准备
          </div>
          <div class="file-title">
            <span class="file-red-box"></span>
            <span class="file-text">档案编号</span>
            <span class="file-number">003</span>
          </div>
          <div class="top-secret-badge" style="margin: 16px 0 20px">
            绝密文件
          </div>
          <div class="meta-block">
            <div class="meta-item">
              <span class="meta-label">任务</span>
              ><span class="meta-value">东方一号（Восток-1）</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">日期</span>
              ><span class="meta-value">1961年4月11-12日</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">发射场：</span
              ><span class="meta-value">拜科努尔航天发射场</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">发射台：</span
              ><span class="meta-value">1 号发射阵地（加加林起点）</span>
            </div>
          </div>
        </div>

        <!-- 真实火箭图片 -->
        <div class="hero-right">
          <div
            class="photo-frame"
            style="
              margin-bottom: 8px;
              transform: rotate(1deg);
              max-width: 300px;
            "
          >
            <img :src="asset('travel/travel 3-1.png')" alt="东方一号火箭发射" />
          </div>
          <div class="caption">东方一号火箭 / 拜科努尔发射场 (1961.04.12)</div>
        </div>
      </section>

      <div class="divider-red"></div>

      <!-- 双栏正文 -->
      <section class="document-body" style="margin-top: 30px">
        <div class="body-left">
          <h3 class="marker-highlight">任务参数</h3>
          <div class="divider-red" style="width: 40%"></div>

          <!-- 任务信息卡片列表（单列） -->
          <div class="info-cards-container">
            <div class="info-card">
              <div class="card-content">
                <div class="card-label">运载火箭</div>
                <div class="card-value">R-7 弹道导弹 (8K72K)</div>
              </div>
            </div>
            <div class="info-card">
              <div class="card-content">
                <div class="card-label">起飞质量</div>
                <div class="card-value">4,725 kg</div>
              </div>
            </div>
            <div class="info-card">
              <div class="card-content">
                <div class="card-label">轨道高度</div>
                <div class="card-value">181 ~ 327 km</div>
              </div>
            </div>
            <div class="info-card">
              <div class="card-content">
                <div class="card-label">任务时长</div>
                <div class="card-value">108 分钟</div>
              </div>
            </div>
            <div class="info-card">
              <div class="card-content">
                <div class="card-label">着陆地点</div>
                <div class="card-value">萨拉托夫州 · 恩格斯区</div>
              </div>
            </div>
            <div class="info-card">
              <div class="card-content">
                <div class="card-label">飞行轨道</div>
                <div class="card-value">倾角 64.9° · 近地轨道</div>
              </div>
            </div>
          </div>

          <h3 class="marker-highlight">发射前时间线</h3>
          <div class="divider-red" style="width: 40%"></div>

          <div class="timeline">
            <div
              v-for="(ev, i) in countdownEvents"
              :key="i"
              class="timeline-item"
              :style="{ animationDelay: i * 0.15 + 's' }"
            >
              <div class="timeline-time">T-{{ ev.time }}</div>
              <p style="font-size: 12px; line-height: 1.7">{{ ev.desc }}</p>
            </div>
          </div>

          <h3 class="marker-highlight" style="margin-top: 28px">SK-1 宇航服</h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            <strong>SK-1宇航服</strong>是苏联专为东方计划设计的舱内宇航服。
            其亮橙色的外观便于着陆回收时的目视发现。
            该宇航服可在座舱失压时提供生命保障，但不支持舱外活动。
          </p>

          <div class="archive-card">
            <div class="card-title">SK-1 技术规格</div>
            <div class="meta-block">
              <div class="meta-item">
                <span class="meta-label">类型</span>
                ><span class="meta-value">舱内活动</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">颜色</span>
                ><span class="meta-value">亮橙色</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">生命保障</span>
                ><span class="meta-value">仅座舱失压</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">舱外能力</span>
                ><span class="meta-value">无</span>
              </div>
            </div>
          </div>

          <!-- 宇航服照片 -->
          <div
            class="photo-frame"
            style="margin: 20px 0; max-width: 280px; transform: rotate(-1deg)"
          >
            <img :src="asset('travel/travel 3-2.png')" alt="SK-1宇航服" />
          </div>
          <div class="caption">加加林身着SK-1宇航服 / 发射前准备</div>
        </div>

        <div class="body-right">
          <!-- 拜科努尔照片 -->
          <div
            class="photo-frame"
            style="margin-bottom: 8px; transform: rotate(1deg)"
          >
            <img :src="asset('travel/travel 3-3.jpg')" alt="拜科努尔发射场" />
          </div>
          <div class="caption" style="margin-bottom: 20px">
            拜科努尔航天发射场 / 1号发射阵地 / 1960年代
          </div>

          <h3 class="marker-highlight">东方号飞船</h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            东方一号飞船由<strong>直径2.3米的球形返回舱</strong>
            >和圆柱形设备舱组成，总重量<strong>4.7吨</strong>。
            返回舱内部空间极为狭小，加加林被固定在弹射座椅上，几乎无法移动。
          </p>

          <p class="body-text">
            由于着陆技术尚未成熟，东方号飞船的返回程序设计要求宇航员在距地面约 7
            公里的高度弹射出舱，
            然后使用个人降落伞着陆——这一设计后来被国际航空联合会（FAI）确认为航天飞行纪录的一部分。
          </p>

          <!-- 返回舱照片 -->
          <div
            class="photo-frame"
            style="margin: 16px 0; max-width: 260px; transform: rotate(-1deg)"
          >
            <img :src="asset('travel/travel 3-4.png')" alt="东方一号返回舱" />
          </div>
          <div class="caption" style="margin-bottom: 16px">
            东方一号返回舱 / 博物馆展品
          </div>

          <div class="archive-card" style="border-color: #d12e26">
            <div class="card-title">关键设计特征</div>
            <p class="body-text" style="font-size: 12px; margin-bottom: 8px">
              <strong>自动化控制：</strong
              >飞船主要由自动系统控制，加加林仅在紧急情况下拥有人工操控权。
            </p>
            <p class="body-text" style="font-size: 12px; margin-bottom: 8px">
              <strong>弹射系统：</strong>在距地面约7
              公里高度，宇航员弹射出舱，单独使用降落伞着陆。
            </p>
            <p class="body-text" style="font-size: 12px">
              <strong>秘密密码：</strong>
              >为防止宇航员在压力下做出非理性决策，控制系统配备了需要输入密码才能启用的机制——
              据说发射前地勤人员已在座舱内放置了开启密码的信封。
            </p>
          </div>

          <div class="quote-block">
            <p style="font-size: 13px; font-style: italic; color: #a31c15">
              "在点火前的最后时刻，加加林表现出了令人钦佩的冷静，甚至还在等待期间要求播放音乐。
              莫斯科时间上午9点07分，R-7运载火箭的引擎点火。
            </p>
          </div>
        </div>
      </section>

      <!-- 底部 -->
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
          >
          <span class="tag-item">#拜科努尔</span>
          <span class="tag-item">#东方一号</span>
          <span class="tag-item">#发射倒计时</span>
          <span class="tag-item">#SK-1</span>
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
            本档案共5篇 · 第3篇 · 发射准备
          </div>
          <div class="official-stamp">
            <span>档案局</span>
            <span style="font-size: 10px; margin-top: 2px">1961年4月12日</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
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
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

const watermarks = [
  {
    text: "\u0411\u0410\u0419\u041A\u041E\u041D\u0423\u0420",
    top: "8%",
    left: "-5%",
    rotate: "14deg",
    fontSize: "105px",
    opacity: 0.06,
  },
  {
    text: "\u0417\u0410\u041F\u0423\u0421\u041A",
    top: "35%",
    left: "58%",
    rotate: "-10deg",
    fontSize: "100px",
    opacity: 0.05,
  },
  {
    text: "\u0412\u041E\u0421\u0422\u041E\u041A",
    top: "65%",
    left: "8%",
    rotate: "7deg",
    fontSize: "95px",
    opacity: 0.04,
  },
  {
    text: "\u041A\u041E\u0421\u041C\u041E\u0421",
    top: "88%",
    left: "48%",
    rotate: "-12deg",
    fontSize: "110px",
    opacity: 0.05,
  },
];

const countdownEvents = [
  {
    time: "01:30",
    desc: "加加林登上前往发射台的巴士，沿途受到技术人员的欢呼。",
  },
  { time: "00:40", desc: "抵达发射塔。加加林走上台阶，进入飞船舱内。" },
  { time: "00:20", desc: "进入东方一号球形座舱。舱门密封。" },
  {
    time: "00:10",
    desc: '最终系统检查。科罗廖夫通过无线电问："感觉如何？"加加林答："很好！"',
  },
  { time: "00:02", desc: "自动序列启动。勤务塔架撤离。" },
  { time: "00:00", desc: '点火！R-7引擎轰鸣。Поехали!"（出发！）' },
];
</script>

<style scoped>
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

/* HERO */
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

/* 发射动画 */
.hero-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.launch-display {
  width: 100%;
  max-width: 340px;
  margin-top: -40px;
}
.launch-svg {
  width: 100%;
  height: auto;
  background: rgba(209, 196, 176, 0.2);
  border: 3px solid #0a0a0a;
}

/* 倒计时条 */
.countdown-bar {
  background: #0a0a0a;
  padding: 16px 20px;
  margin: 20px 0;
}
.countdown-label {
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: 14px;
  color: #e8dcca;
  letter-spacing: 0.2em;
  margin-bottom: 8px;
}
.countdown-track {
  width: 100%;
  height: 6px;
  background: rgba(232, 220, 202, 0.2);
  overflow: hidden;
}
.countdown-fill {
  height: 100%;
  background: #d12e26;
  animation: countdown-progress 12s linear infinite;
}
@keyframes countdown-progress {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

.divider-red {
  height: 4px;
  background: #d12e26;
  margin-bottom: 20px;
  width: 60%;
}

/* 正文 */
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

/* 时间�?*/
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

/* 卡片 */
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

/* 照片 */
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

/* 引用 */
.quote-block {
  background: rgba(209, 46, 38, 0.08);
  border-left: 6px solid #d12e26;
  padding: 16px 20px;
  margin: 20px 0;
}

/* 标签 */
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

/* 官方印章 */
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

/* 信息卡片容器（单列布局） */
.info-cards-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 30px;
  max-width: 400px;
}

.info-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(10, 10, 10, 0.85);
  border: 1px solid #d12e26;
  padding: 12px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.info-card:hover {
  background: rgba(10, 10, 10, 0.95);
  border-color: #fff;
  box-shadow: 0 0 12px rgba(209, 46, 38, 0.3);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-label {
  font-size: 12px;
  color: #888;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.card-value {
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  text-align: right;
}

/* 图片说明 */
.image-caption {
  font-size: 11px;
  color: #888;
  text-align: center;
  margin-top: 8px;
  letter-spacing: 0.08em;
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
