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
          <span class="timestamp">1959.12 — 1961.04.12</span>
          <div class="header-line"></div>
        </div>
      </header>

      <!-- HERO 区域 · 训练与任务前线 -->
      <section class="hero-section">
        <div class="hero-left">
          <div class="the-label" style="font-size: clamp(36px, 6vw, 68px)">
            尤里·加加林
          </div>
          <div class="file-title">
            <span class="file-red-box"></span>
            <span class="file-text">训练编号</span>
            <span class="file-number">ST-01</span>
          </div>
          <div class="top-secret-badge" style="margin: 16px 0 20px">
            绝密 · 东方计划训练卷宗
          </div>
          <div class="meta-block">
            <div class="meta-item">
              <span class="meta-label">阶段</span>
              <span class="meta-value">星城集训 / 任务前线 (1959—1961)</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">主考官</span>
              <span class="meta-value">谢尔盖·科罗廖夫</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">同期学员</span>
              <span class="meta-value">季托夫·涅柳博夫·波波维奇</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">最终结果</span>
              <span class="meta-value">东方一号首飞人选</span>
            </div>
          </div>
        </div>

        <!-- 加加林训练照 -->
        <div class="hero-right">
          <div class="portrait-frame">
            <div class="photo-frame portrait-cut">
              <img
                :src="asset('travel/travel 2-2.jpg')"
                alt="加加林SK-1宇航服训练"
              />
            </div>
            <div class="red-circle-overlay"></div>
            <div class="cross-mark cm1">+</div>
            <div class="cross-mark cm2">+</div>
            <div class="cross-mark cm3">+</div>
            <div class="black-label">
              <span class="label-text">训练呼号 КЕДР</span>
            </div>
          </div>
        </div>
      </section>

      <div class="divider-red"></div>

      <!-- 时间线：训练关键节点 -->
      <section style="margin-bottom: 30px">
        <h3 class="section-title">
          <span class="red-square"></span>
          训练里程碑 · 冲向东方号
        </h3>
        <div class="timeline">
          <div
            v-for="(ev, i) in timelineEvents"
            :key="i"
            class="timeline-item"
            :style="{ animationDelay: i * 0.15 + 's' }"
          >
            <div class="timeline-time">{{ ev.year }}</div>
            <p style="font-size: 13px; line-height: 1.7">{{ ev.desc }}</p>
          </div>
        </div>
      </section>

      <div class="divider-red" style="width: 100%"></div>

      <!-- 双栏正文：训练中期 + 任务前线 -->
      <section class="document-body" style="margin-top: 30px">
        <div class="body-left">
          <h3 class="marker-highlight">星城炼狱·训练中期</h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            1960年3月，加加林与其他19名飞行员正式进入<strong
              >莫斯科郊外星城（Zvyozdny Gorodok）</strong
            >展开封闭训练。首阶段包括理论课程：火箭原理、轨道力学、东方号飞船结构。加加林表现出异于常人的学习能力，所有笔试均为优秀。
          </p>

          <p class="body-text">
            <strong>极端环境测试</strong
            >是淘汰率最高的环节。加加林在热真空舱中耐受50°C高温与低压组合，在离心机上承受8G加速度而意识清醒；隔离舱考验心理耐力——他在密闭空间内独处72小时仍保持冷静记录。教官评价：“他的脉搏从未超过正常值。”
          </p>

          <p class="body-text">
            失重训练借助<strong>图-104LL 抛物线飞行飞机</strong
            >实现。每次抛物线提供约25秒失重。加加林在第4次飞行中已能自如饮水、记录仪表。同期还有跳伞训练（为返回舱着陆准备），他完成了46次伞降，远超规定次数。
          </p>

          <!-- 训练照片 -->
          <div
            class="photo-frame"
            style="margin: 16px 0; max-width: 500px; transform: rotate(2deg)"
          >
            <img
              :src="asset('travel/travel 2-1.jpg')"
              :onerror="`this.src = '${asset('travel/travel 2-1.jpg')}'`"
            />
          </div>
          <div class="caption">离心机训练 / 星城档案室 1960</div>

          <div class="quote-block">
            <p style="font-size: 14px; font-style: italic; color: #a31c15">
              “尤里在训练中从不抱怨。即使模拟舱起火警报，他仍按流程操作完才撤离。”
              —— 训练教官马克·加莱
            </p>
          </div>
        </div>

        <div class="body-right">
          <h3 class="marker-highlight">事件前线·东方号倒计时</h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            <strong>1961年1月—3月</strong
            >，加加林与季托夫等人进入最后选拔阶段。综合评定考量技能、心理、政治素养及身体指标（身高<170cm以适应东方号狭小座舱）。加加林因“完美的技术报告撰写能力及稳定情绪”被科罗廖夫圈定为首选。
          </p>

          <div class="archive-card">
            <div class="card-title">东方1号 飞行前关键记录</div>
            <div
              v-for="(mod, i) in preflightModules"
              :key="i"
              style="margin-bottom: 8px; font-size: 12px"
            >
              <span style="color: #d12e26; font-weight: bold"
                >0{{ i + 1 }}.</span
              >
              <span style="margin-left: 8px">{{ mod }}</span>
            </div>
          </div>

          <h3 class="marker-highlight" style="margin-top: 24px">
            发射前夕 · 最后准备
          </h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            <strong>1961年4月10日</strong
            >，拜科努尔发射场。国家委员会正式批准加加林为首飞宇航员。他在日记中写道：“我信任技术，也信任同志们。我会完成这次飞行。”
            当晚他睡眠正常——监控医生记录“无任何焦虑迹象”。
          </p>

          <p class="body-text">
            <strong>4月11日</strong
            >，加加林与科罗廖夫进行私人谈话，科罗廖夫说：“这将是冒险，但我们必须做。”
            加加林回答：“Поехали！”（我们出发！）。次日6:07
            UTC，东方一号升空，世界首位人类进入太空。
          </p>

          <div class="archive-card" style="border-color: #d12e26">
            <div class="card-title">任务参数 · 最终确认</div>
            <div class="meta-block">
              <div class="meta-item">
                <span class="meta-label">发射时间</span>
                <span class="meta-value">1961.04.12 06:07 UTC</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">远地点</span>
                <span class="meta-value">327 km</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">轨道周期</span>
                <span class="meta-value">89.34分钟</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">任务时长</span>
                <span class="meta-value">108分钟</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">着陆地点</span>
                <span class="meta-value">萨拉托夫州 恩格斯区</span>
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
            >档案标签</span
          >
          <span class="tag-item">#星城训练</span>
          <span class="tag-item">#东方计划</span>
          <span class="tag-item">#科罗廖夫</span>
          <span class="tag-item">#首飞倒计时</span>
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
            本档案共3卷 · 训练与任务卷 · 绝密级
          </div>
          <div class="official-stamp">
            <span>苏联航天总局</span>
            <span style="font-size: 10px; margin-top: 2px"
              >1961.04.12 核准</span
            >
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

// 水印 (增强档案感)
const watermarks = [
  {
    text: "КОСМОНАВТ",
    top: "10%",
    left: "-3%",
    rotate: "12deg",
    fontSize: "110px",
    opacity: 0.06,
  },
  {
    text: "ТРЕНИРОВКА",
    top: "40%",
    left: "50%",
    rotate: "-8deg",
    fontSize: "95px",
    opacity: 0.05,
  },
  {
    text: "ВОСТОК-1",
    top: "70%",
    left: "5%",
    rotate: "6deg",
    fontSize: "100px",
    opacity: 0.04,
  },
  {
    text: "ГАГАРИН",
    top: "90%",
    left: "55%",
    rotate: "-14deg",
    fontSize: "120px",
    opacity: 0.05,
  },
  {
    text: "1961",
    top: "55%",
    left: "80%",
    rotate: "25deg",
    fontSize: "80px",
    opacity: 0.04,
  },
];

// 时间线聚焦训练与中期事件
const timelineEvents = [
  {
    year: "1959.12",
    desc: "入选宇航员首批20人名单。开始在莫斯科中央空军科研所体检。",
  },
  {
    year: "1960.03",
    desc: "正式进入星城训练中心。学习东方号飞船基本构造及弹道学。",
  },
  { year: "1960.06", desc: "完成首轮离心机测试（8G无晕厥）。跳伞训练通过。" },
  { year: "1960.08", desc: "热真空舱模拟测试（50°C/低压），历时72小时。" },
  {
    year: "1960.12",
    desc: "缩小候选范围至6人“先锋六人组”。加加林综合排名第一。",
  },
  { year: "1961.03", desc: "东方号模拟器全任务考核，加加林手动控制获得满分。" },
  {
    year: "1961.04.08",
    desc: "国家委员会正式选定加加林为东方一号主飞宇航员。",
  },
  {
    year: "1961.04.12",
    desc: "发射升空，完成人类首次载人轨道飞行。108分钟后安全返回。",
  },
];

// 飞行前关键准备模块
const preflightModules = [
  "东方号3KA飞船手动控制系统模拟 (6次全流程演练)",
  "发射中止与紧急弹射程序 (弹射座椅训练)",
  "通讯与遥测链路测试 (呼号КЕДР启用)",
  "4月10日 发射前最终医学与心理检查",
  "4月11日 科罗廖夫单独任务简报 & 个人遗书备存",
];
</script>

<style scoped>
/* ---------- 基础档案风格保持，仅优化细节排版 ---------- */
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

/* 头部导航等完全保留原设计，仅增强对比 */
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
  grid-template-columns: 50% 50%;
  gap: 30px;
  margin-bottom: 20px;
}
.the-label {
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: clamp(36px, 6vw, 68px);
  font-weight: 700;
  color: #d12e26;
  line-height: 0.9;
  letter-spacing: -0.02em;
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
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 700;
  color: #e8dcca;
  letter-spacing: -0.02em;
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
  letter-spacing: -0.04em;
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

.portrait-frame {
  position: relative;
  max-width: 380px;
}
.portrait-cut {
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
}
.red-circle-overlay {
  position: absolute;
  top: 12%;
  right: 8%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #d12e26;
  opacity: 0.6;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.cross-mark {
  position: absolute;
  font-family: "Oswald", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  pointer-events: none;
  z-index: 5;
}
.cm1 {
  top: 18%;
  right: 15%;
}
.cm2 {
  bottom: 25%;
  left: 8%;
  font-size: 20px;
}
.cm3 {
  top: 55%;
  right: 25%;
  font-size: 16px;
  color: #f2c94c;
}
.black-label {
  background: #0a0a0a;
  padding: 10px 24px;
  margin-top: -2px;
  width: 75%;
  max-width: 280px;
  margin-left: auto;
}
.label-text {
  font-family: "Courier New", monospace;
  font-size: 14px;
  color: #e8dcca;
  letter-spacing: 0.25em;
}

.divider-red {
  height: 4px;
  background: #d12e26;
  margin-bottom: 20px;
  width: 60%;
}
.section-title {
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 20px;
}
.red-square {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: #d12e26;
  margin-right: 8px;
  vertical-align: middle;
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
  margin-bottom: 24px;
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

.document-body {
  display: grid;
  grid-template-columns: 48% 52%;
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
  text-align: justify;
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
  margin-top: 6px;
  text-align: center;
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
}
</style>
