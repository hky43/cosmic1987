<template>
  <div class="archive-root">
    <!-- 纸质背景与网格 -->
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
      <!-- 顶部导航 -->
      <header class="archive-header">
        <div class="header-left" @click="handleBack">
          <span class="red-triangle">&#9654;</span>
          <span class="typewriter-text">退出档案</span>
        </div>
        <div class="header-right">
          <span class="timestamp">1934.03.09 — 1961.04.12</span>
          <div class="header-line"></div>
        </div>
      </header>

      <!-- HERO 区域 -->
      <section class="hero-section">
        <div class="hero-left">
          <div class="the-label">苏联英雄 · 人类群星</div>
          <div class="file-title">
            <span class="file-red-box"></span>
            <span class="file-text">档案编号</span>
            <span class="file-number">001/ГАГАРИН</span>
          </div>
          <div class="top-secret-badge">
            <span>绝密 · 个人传记</span>
          </div>
          <div class="meta-block">
            <div class="meta-item">
              <span class="meta-label">主题</span>
              <span class="meta-value">尤里·加加林 · 早期生平与选拔</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">时期</span>
              <span class="meta-value">1934 — 1961 年 (东方1号前)</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">密级</span>
              <span class="meta-value">最高苏维埃核定</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">来源</span>
              <span class="meta-value">星际事务总局 / 第零科</span>
            </div>
          </div>
        </div>
      </section>

      <div class="divider-red"></div>

      <!-- 正文双栏 -->
      <section class="document-body">
        <div class="body-left">
          <h3 class="marker-highlight">克鲁希诺的童年 · 星火之源</h3>
          <div class="divider-red" style="width: 40%"></div>

          <div class="archive-card">
            <div class="card-title">出身与家庭背景</div>
            <p class="body-text">
              <strong>1934 年 3 月 9 日</strong>
              ，尤里·阿列克谢耶维奇·加加林出生于莫斯科西部的克鲁希诺村。父母都是集体农庄庄员：父亲阿列克谢·伊万诺维奇是木匠，母亲安娜·季莫费耶芙娜是勤劳的农妇。尤里是四个孩子中的第三个，童年正值苏联战火年代。
            </p>
            <p class="body-text">
              1941
              年纳粹德国入侵后，加加林一家经历了被占领的苦难，木屋被德军征用。年幼的尤里目睹了战争残酷，但也在心底埋下了对天空和技术的渴望。战后，他进入柳别尔齐职业学校学习铸造，并同时在工人夜校进修，展现出顽强而聪明的天性。
            </p>
          </div>

          <!-- 少年加加林照片占位 -->
          <div
            class="photo-frame"
            style="margin: 20px 0; max-width: 320px; transform: rotate(-1deg)"
          >
            <img
              :src="asset('travel/travel 1-1.png')"
              style="filter: sepia(0.2) contrast(1.1)"
            />
          </div>
          <div class="caption">
            尤里·加加林 / 航空学校时期肖像（1955年前后）
          </div>

          <h3 class="marker-highlight" style="margin-top: 30px">
            从飞行员到宇航员预备
          </h3>
          <div class="divider-red" style="width: 40%"></div>

          <div class="archive-card">
            <div class="card-title">天空的召唤：航空生涯开端</div>
            <p class="body-text">
              <strong>1955 年</strong
              >，加加林以优异表现进入奥伦堡航空学校，学习驾驶米格-15喷气战斗机。在航校期间他不仅飞行技术拔尖，还结识了未来的妻子瓦莲京娜。1957年10月，就在斯普特尼克1号发射当月，加加林从航校毕业，成为北方舰队航空兵部队的歼击机飞行员，军衔中尉。
            </p>
            <p class="body-text">
              <strong>1959 年</strong
              >，当苏联秘密启动第一支宇航员分队选拔时，加加林凭借卓越的身体素质、冷静的性格和坚定的共产主义信念递交了申请。在3000多名候选人中，他脱颖而出进入莫斯科郊外的“星城”训练中心，成为首批20名宇航员候选人之一。
            </p>
          </div>

          <!-- 打字机效果：早期人生里程碑 -->
          <div
            style="
              margin-top: 24px;
              font-family: &quot;Courier New&quot;, monospace;
              font-size: 12px;
            "
          >
            <div
              class="typewriter-cursor"
              style="
                color: #a31c15;
                letter-spacing: 0.15em;
                margin-bottom: 8px;
                font-weight: bold;
              "
            >
              [加加林·前期生命节点]
            </div>
            <div
              v-for="(m, i) in gagarinMilestones"
              :key="i"
              style="margin-bottom: 6px; opacity: 0.8"
            >
              <span style="color: #d12e26; font-weight: bold"
                >[{{ m.date }}]</span
              >
              <span style="margin-left: 8px"
                >{{ m.name }} / {{ m.result }}</span
              >
            </div>
          </div>
        </div>

        <div class="body-right">
          <!-- 加加林航天员训练照 -->
          <div
            class="photo-frame"
            style="
              max-width: 500px;
              margin-bottom: 8px;
              transform: rotate(2deg);
            "
          >
            <img :src="asset('travel/travel 1-2.png')" />
          </div>
          <div class="caption" style="margin-bottom: 30px">
            尤里·加加林 / 东方计划专用宇航服测试 (1960)
          </div>

          <h3 class="marker-highlight">航天员选拔与秘密训练</h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            <strong>1960 年 3 月</strong
            >，加加林正式成为苏联宇航员中队的一员。训练内容包括极端环境舱、离心机、失重飞行以及大量的理论课程。加加林凭借冷静的头脑、超凡的学习能力和谦逊的个性，很快成为训练中的领袖。他与格尔曼·季托夫成为最终入选东方1号任务的两名主要候选人。
          </p>

          <p class="body-text">
            在为期一年的密集训练中，加加林表现出对飞船手动控制系统的卓越直觉，对<strong
              >东方号飞船（Vostok 3KA）</strong
            >的操作规程倒背如流。任务前专家组内部认为，加加林的笑容、镇定以及“纯粹俄罗斯出身”的人格特质，使他成为首位进入太空的理想人选。
          </p>

          <div class="quote-block">
            <p style="font-size: 14px; font-style: italic; color: #a31c15">
              “他有着灿烂的笑容和钢铁般的意志。加加林在各项训练中从未表现出恐慌，即使在热真空舱模拟故障时也是如此。”
              —— 训练师评价
            </p>
          </div>

          <h3 class="marker-highlight" style="margin-top: 24px">
            事件前线：东方1号倒计时
          </h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            <strong>1961 年 4 月上旬</strong
            >，尤里·加加林与备选宇航员格尔曼·季托夫、格里戈里·涅柳博夫抵达拜科努尔航天发射场。R-7
            火箭与东方号飞船在发射台上完成最后总装。4月10日的国家委员会会议上，科罗廖夫宣布加加林为首飞宇航员，季托夫为备份。加加林在日记中写道：“任务可能是第一次，也可能是最后一次。但我坚信火箭和同志。”
          </p>

          <p class="body-text">
            发射前最后几夜，加加林保持极度规律的作息，配合医学生物监测。他检查宇航服、熟悉飞船相机，并在4月11日写下致全世界的告别信（以防发生意外）。发射前数小时，他与科罗廖夫握手，说了一句：“Поехали!”（我们出发！）
          </p>

          <div class="archive-card" style="border-color: #d12e26">
            <div class="card-title">东方1号 · 前期档案摘要</div>
            <div class="meta-block">
              <div class="meta-item">
                <span class="meta-label">飞船代号</span>
                <span class="meta-value">东方3KA-3</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">发射窗口</span>
                <span class="meta-value">1961.04.12 06:07 UTC</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">运载火箭</span>
                <span class="meta-value">R-7 八一号 (8K72K)</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">起飞质量</span>
                <span class="meta-value">4725 kg</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">任务呼号</span>
                <span class="meta-value">Кедр (雪松)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 底部标签 -->
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
          <span class="tag-item">#加加林</span>
          <span class="tag-item">#东方计划</span>
          <span class="tag-item">#首位人类</span>
          <span class="tag-item">#太空竞赛</span>
          <span class="tag-item">#星城训练</span>
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
            本档案共 4 页 · 加加林前期生平专卷 · 东方1号发射前夜
          </div>
          <div class="official-stamp">
            <span>苏联航天总局</span>
            <span style="font-size: 10px; margin-top: 2px"
              >见证·1961.04.12</span
            >
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
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

const watermarks = [
  {
    text: "\u0414\u041E\u041A\u0423\u041C\u0415\u041D\u0422",
    top: "8%",
    left: "-5%",
    rotate: "15deg",
    fontSize: "120px",
    opacity: 0.06,
  },
  {
    text: "\u0421\u041F\u0423\u0422\u041D\u0418\u041A",
    top: "38%",
    left: "55%",
    rotate: "-10deg",
    fontSize: "100px",
    opacity: 0.05,
  },
  {
    text: "\u0421\u0415\u041A\u0420\u0415\u0422\u041D\u041E",
    top: "68%",
    left: "5%",
    rotate: "8deg",
    fontSize: "90px",
    opacity: 0.04,
  },
  {
    text: "\u041A\u041E\u0421\u041C\u041E\u0421",
    top: "88%",
    left: "45%",
    rotate: "-15deg",
    fontSize: "110px",
    opacity: 0.05,
  },
];

const missions = [
  { date: "1957.10.04", name: "斯普特尼克1号", result: "成功" },
  { date: "1957.11.03", name: "斯普特尼克2号 / 莱卡", result: "部分成功" },
  { date: "1960.08.19", name: "卫星飞船 2号", result: "成功" },
  { date: "1961.03.09", name: "卫星飞船 4号", result: "成功" },
  { date: "1961.03.25", name: "卫星飞船 5号", result: "成功" },
];
</script>

<style scoped>
/* ========== 根容�?========== */
.archive-root {
  position: relative;
  min-height: 100vh;
  background: #e8dcca;
  overflow-x: hidden;
}

/* ========== 纸质背景 ========== */
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

/* ========== 俄文水印 ========== */
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

/* ========== 主体内容 ========== */
.archive-body {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 40px 40px;
  font-family: "Special Elite", "Courier New", "SimSun", monospace;
  color: #1f1f1f;
}

/* ========== 顶部导航 ========== */
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

/* ========== HERO 区域 ========== */
.hero-section {
  display: grid;
  grid-template-columns: 55% 45%;
  gap: 30px;
  margin-bottom: 20px;
}
.the-label {
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 700;
  color: #d12e26;
  line-height: 0.9;
  letter-spacing: -0.02em;
  text-transform: uppercase;
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
  width: 60%;
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
  font-size: clamp(56px, 8vw, 96px);
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
  margin: 16px 0 24px;
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

/* ========== 元数�?========== */
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

/* ========== 雷达 ========== */
.hero-right {
  display: flex;
  align-items: center;
  justify-content: center;
}
.radar-display {
  position: relative;
  width: 100%;
  max-width: 300px;
}
.radar-svg {
  width: 100%;
  height: auto;
  background: rgba(209, 196, 176, 0.3);
  border: 3px solid #0a0a0a;
  border-radius: 50%;
}
.radar-label {
  text-align: center;
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: #d12e26;
  margin-top: 8px;
}

/* ========== 分割�?========== */
.divider-red {
  height: 4px;
  background: #d12e26;
  margin-bottom: 20px;
  width: 60%;
}

/* ========== 文档正文 ========== */
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

/* ========== 标题高亮 ========== */
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

/* ========== 正文文字 ========== */
.body-text {
  font-size: 13px;
  line-height: 1.8;
  margin-bottom: 14px;
}

/* ========== 档案卡片 ========== */
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

/* ========== 照片�?========== */
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

/* ========== 引用�?========== */
.quote-block {
  background: rgba(209, 46, 38, 0.08);
  border-left: 6px solid #d12e26;
  padding: 16px 20px;
  margin: 20px 0;
}

/* ========== 打字机光�?========== */
.typewriter-cursor::after {
  content: "|";
  animation: blink 1s infinite;
  color: #d12e26;
  font-weight: 700;
}
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* ========== 标签========== */
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

/* ========== 官方印章 ========== */
.official-stamp {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3px solid #d12e26;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  justify-content: center;
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

/* ========== 响应�?========== */
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
