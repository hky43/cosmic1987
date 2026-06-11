<template>
  <div class="archive-root">
    <!-- 纸质背景 -->
    <div class="archive-bg"></div>
    <!-- 俄文水印（沉重的黑色风格） -->
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
          <span class="timestamp">1967 — 1971 · 黑色年代</span>
          <div class="header-line"></div>
        </div>
      </header>

      <!-- HERO -->
      <section class="hero-section">
        <div class="hero-left">
          <div class="the-label" style="font-size: clamp(32px, 5vw, 52px)">
            星辰之殇
          </div>
          <div class="file-title">
            <span class="file-red-box"></span>
            <span class="file-text">卷宗编号</span>
            <span class="file-number">TR-07</span>
          </div>
          <div
            class="top-secret-badge"
            style="margin: 16px 0 20px; background: #0a0a0a; color: #e8dcca"
          >
            绝密 · 事故调查科
          </div>
          <div class="meta-block">
            <div class="meta-item">
              <span class="meta-label">主题</span>
              <span class="meta-value">苏联载人航天重大事故</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">涉及任务</span>
              <span class="meta-value">联盟1号 · 联盟11号 · 加加林坠机</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">遇难人数</span>
              <span class="meta-value">4 名宇航员 + 1 名教官</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">解密状态</span>
              <span class="meta-value" style="color: #d12e26">部分解密</span>
            </div>
          </div>
        </div>

        <!-- 遇难宇航员纪念牌 -->
        <div class="hero-right">
          <div class="memorial-plaque">
            <div class="plaque-title">† 陨落星辰 †</div>
            <div class="memorial-list">
              <div class="memorial-item">
                <span class="memorial-name">弗拉基米尔·科马罗夫</span>
                <span class="memorial-date">1967.04.24</span>
              </div>
              <div class="memorial-item">
                <span class="memorial-name">尤里·加加林</span>
                <span class="memorial-date">1968.03.27</span>
              </div>
              <div class="memorial-item">
                <span class="memorial-name">多勃罗沃利斯基</span>
                <span class="memorial-date">1971.06.29</span>
              </div>
              <div class="memorial-item">
                <span class="memorial-name">帕察耶夫 · 沃尔科夫</span>
                <span class="memorial-date">1971.06.29</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="divider-red" style="background: #0a0a0a"></div>

      <!-- 引言：太空竞赛的黑暗面 -->
      <div
        class="quote-block"
        style="border-left-color: #0a0a0a; background: #0a0a0a10"
      >
        <p style="font-size: 14px; font-style: italic; color: #a31c15">
          “在荣耀的背面，是一个又一个被掩盖的坟墓。苏联的太空计划在1960年代末期经历了两次毁灭性的打击，而真相被封锁了数十年。”
        </p>
      </div>

      <!-- 双栏正文：悲剧事件 -->
      <section class="document-body" style="margin-top: 30px">
        <div class="body-left">
          <h3 class="marker-highlight">联盟1号 · 弗拉基米尔·科马罗夫</h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            <strong>1967年4月23日</strong
            >，联盟1号飞船搭载弗拉基米尔·科马罗夫上校发射升空。这是苏联新一代飞船的首次载人试飞，计划与联盟2号对接。然而入轨后，飞船即出现严重问题：太阳能帆板一侧未展开，电力不足；姿态控制系统失灵，飞船开始失控翻滚。
          </p>

          <div class="archive-card">
            <div class="card-title">事故真相（解密密件）</div>
            <p class="body-text" style="font-size: 12px">
              地面检测发现，联盟号飞船存在<strong>203处设计缺陷</strong>。科马罗夫生前最后对话录音显示：“我诅咒这个政治任务……他们明知会出事。”
              由于高层急于在十月革命50周年献礼，飞船在未完成测试情况下硬性发射。返回时主伞未打开，备用伞缠绕，返回舱以超过
              40m/s的速度撞地，科马罗夫当场遇难。
            </p>
            <div class="meta-block" style="margin-top: 8px">
              <div class="meta-item">
                <span class="meta-label">遇难时间</span>
                <span class="meta-value">1967.04.24 06:24 UTC</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">死因</span>
                <span class="meta-value">降落伞故障 · 直接撞击</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">遗言</span>
                <span class="meta-value"
                  >(被列为最高机密，1980年代部分流出)</span
                >
              </div>
            </div>
          </div>

          <!-- 科马罗夫照片 -->
          <div
            class="photo-frame"
            style="margin: 16px 0; max-width: 240px; transform: rotate(1deg)"
          >
            <img
              :src="asset('travel/travel 5-1.jpg')"
              alt="弗拉基米尔·科马罗夫"
            />
          </div>
          <div class="caption">弗拉基米尔·科马罗夫 / 联盟1号指令长</div>

          <!-- 科马罗夫返回舱残骸照片 -->
          <div
            class="photo-frame"
            style="margin: 20px 0; max-width: 280px; transform: rotate(-1deg)"
          >
            <img
              :src="asset('travel/travel 5-2.jpg')"
              alt="联盟1号返回舱残骸"
            />
          </div>
          <div class="caption">联盟1号返回舱残骸（撞击现场）</div>

          <h3 class="marker-highlight" style="margin-top: 28px">
            加加林的陨落 · 1968
          </h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            <strong>1968年3月27日</strong
            >，尤里·加加林与飞行教官弗拉基米尔·谢廖金驾驶米格-15UTI教练机从莫斯科附近契卡洛夫斯基机场起飞，执行例行训练。10:30左右，飞机在基尔扎奇镇附近坠毁，两人当场身亡。
          </p>
          <p class="body-text">
            官方最初宣称“在复杂气象条件下进行规避机动时坠毁”，但调查档案后来泄露：<strong>另一架苏-11战斗机违规侵入加加林的空域</strong>，其超音速尾流导致加加林的飞机进入螺旋。当时加加林和谢廖金完全有机会弹射，但据分析他们为了避免战机坠毁在居民区而放弃逃生，坚持操控到最后一刻。
          </p>
          <div class="archive-card" style="border-color: #0a0a0a">
            <div class="card-title">死亡争议</div>
            <p class="body-text" style="font-size: 12px">
              多年来关于加加林死因有至少12种说法：包括克格勃暗杀（因其威望过高）、酒醉飞行、舱盖误操作导致缺氧等。2005年，一份解密文件确认<strong>违规飞行是主因</strong>，但责任者从未被公开处理。加加林的骨灰安葬在克里姆林宫墙下。
            </p>
          </div>
        </div>

        <div class="body-right">
          <!-- 加加林坠机现场纪念碑照片占位 -->
          <div
            class="photo-frame"
            style="margin-bottom: 8px; transform: rotate(1deg)"
          >
            <img
              :src="asset('travel/travel 5-3.jpg')"
              alt="加加林坠机现场纪念碑"
            />
          </div>
          <div class="caption" style="margin-bottom: 20px">
            加加林坠机现场纪念碑（基尔扎奇镇附近）
          </div>

          <h3 class="marker-highlight">联盟11号 · 三位烈士</h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            <strong>1971年6月6日</strong
            >，联盟11号发射，宇航员格奥尔基·多勃罗沃利斯基、维克托·帕察耶夫、弗拉季斯拉夫·沃尔科夫进入礼炮1号空间站，创造了人类首次空间站停留记录（23天）。6月29日返回时，再入大气层前的轨道舱分离爆炸螺栓意外提前引爆，导致返回舱的<strong>通气阀门震开</strong>——舱内空气在30秒内全部泄漏。
          </p>
          <p class="body-text">
            三人的死因是<strong>急性缺氧和体液沸腾</strong>。直到着陆后，搜救人员打开舱盖才发现他们已经死亡，面部的皮肤因低压而发紫。事故调查发现，飞船设计仅能容纳2名宇航员穿着宇航服，但为了搭载3人而拆除了宇航服，且阀门设计存在致命缺陷。
          </p>

          <div class="archive-card" style="border-color: #d12e26">
            <div class="card-title">联盟11号遇难者</div>
            <div class="meta-block">
              <div class="meta-item">
                <span class="meta-label">多勃罗沃利斯基</span>
                <span class="meta-value">中校 · 指令长</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">帕察耶夫</span>
                <span class="meta-value">飞行工程师</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">沃尔科夫</span>
                <span class="meta-value">研究工程师</span>
              </div>
            </div>
            <p class="body-text" style="font-size: 12px; margin-top: 8px">
              三人被追授苏联英雄称号。此后联盟号重新设计为2人座，宇航员必须全程穿着宇航服。
            </p>
          </div>

          <h3 class="marker-highlight" style="margin-top: 24px">
            后续 · 掩盖与反思
          </h3>
          <div class="divider-red" style="width: 40%"></div>

          <p class="body-text">
            苏联政府将三起事故均列为国家机密。科马罗夫的葬礼仅允许家属和少量官员参加；联盟11号死讯直到着陆后12小时才由塔斯社发布。加加林的死亡更是被迅速定性为“训练意外”，严禁媒体讨论政治因素。
          </p>
          <p class="body-text">
            直到戈尔巴乔夫改革时期，部分档案才得以公开。如今每年4月12日（宇航节）和3月27日（加加林忌日），俄罗斯官方都会举行纪念仪式。这些牺牲推动了航天安全标准的革命性提升，今天的联盟号飞船——世界上服役时间最久的载人飞船——正是从这些血泪教训中逐步完善而来。
          </p>
          <div class="quote-block" style="border-left-color: #0a0a0a">
            <p style="font-size: 13px; font-style: italic; color: #a31c15">
              “他们用自己的生命铺平了通往星辰的道路。我们绝不能忘记。”
            </p>
          </div>
        </div>
      </section>

      <!-- 纪念墙 -->
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
            >烈士名录</span
          >
          <span class="tag-item">#科马罗夫</span>
          <span class="tag-item">#加加林</span>
          <span class="tag-item">#多勃罗沃利斯基</span>
          <span class="tag-item">#帕察耶夫</span>
          <span class="tag-item">#沃尔科夫</span>
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
            本档案共7页 · 事故专卷 · 部分内容仍属机密
          </div>
          <div class="official-stamp">
            <span>调查委员会</span>
            <span style="font-size: 10px; margin-top: 2px">1991年解密</span>
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

// 沉重风格的水印
const watermarks = [
  {
    text: "ТРАГЕДИЯ",
    top: "8%",
    left: "-5%",
    rotate: "12deg",
    fontSize: "100px",
    opacity: 0.07,
  },
  {
    text: "СМЕРТЬ",
    top: "40%",
    left: "60%",
    rotate: "-10deg",
    fontSize: "110px",
    opacity: 0.06,
  },
  {
    text: "СЕКРЕТНО",
    top: "70%",
    left: "5%",
    rotate: "8deg",
    fontSize: "95px",
    opacity: 0.05,
  },
  {
    text: "ГАГАРИН",
    top: "88%",
    left: "50%",
    rotate: "-14deg",
    fontSize: "120px",
    opacity: 0.06,
  },
];
</script>

<style scoped>
/* 沿用原档案样式，仅加深暗色调和少量调整 */
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
  grid-template-columns: 50% 50%;
  gap: 30px;
  margin-bottom: 20px;
}
.the-label {
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: clamp(32px, 5vw, 52px);
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
  background: #0a0a0a;
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
  min-width: 90px;
}
.meta-value {
  color: #0a0a0a;
  letter-spacing: 0.05em;
  border-bottom: 1px dashed #d1c4b0;
  flex: 1;
}
.memorial-plaque {
  background: #0a0a0a;
  border: 3px solid #d12e26;
  border-radius: 8px;
  padding: 24px;
  max-width: 280px;
}
.plaque-title {
  font-family: "Oswald", "Microsoft YaHei", sans-serif;
  font-size: 16px;
  color: #d12e26;
  text-align: center;
  letter-spacing: 0.2em;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(209, 46, 38, 0.3);
}
.memorial-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.memorial-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(209, 46, 38, 0.08);
  border-radius: 4px;
  transition: all 0.3s ease;
}
.memorial-item:hover {
  background: rgba(209, 46, 38, 0.15);
}
.memorial-name {
  font-size: 12px;
  color: #e8dcca;
  font-weight: 500;
}
.memorial-date {
  font-size: 11px;
  color: #d12e26;
  font-family: "Courier New", monospace;
}
.divider-red {
  height: 4px;
  background: #d12e26;
  margin-bottom: 20px;
  width: 60%;
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
  .memorial-plaque {
    padding: 16px;
  }
  .memorial-name {
    font-size: 11px;
  }
}
</style>
