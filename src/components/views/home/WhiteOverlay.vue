<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="white-overlay"
        :class="{ 'fade-out': isFadingOut }"
      >
        <div class="button-container">
          <button
            v-for="(btn, index) in navButtons"
            :key="index"
            class="nav-button"
            :class="{ 'nav-button-active': activeButton === index }"
            @click="navigateTo(btn.path, index)"
          >
            <span class="button-icon">{{ btn.icon }}</span>
          </button>
        </div>
        <div class="button-hint">SELECT A ZONE</div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "navigate"]);

// 导航按钮配置
const navButtons = [
  { path: "/test", icon: "01" },
  { path: "/test1", icon: "02" },
  { path: "/test2", icon: "03" },
];
const activeButton = ref(-1);
const isFadingOut = ref(false);

const navigateTo = (path, index) => {
  if (isFadingOut.value) return;

  activeButton.value = index;
  isFadingOut.value = true;

  // 设置从白色背景层进入的标志
  sessionStorage.setItem("fromWhiteOverlay", "true");

  setTimeout(() => {
    emit("update:modelValue", false);
    isFadingOut.value = false;
    activeButton.value = -1;

    router.push({
      path: path,
      query: { fromOverlay: "true" },
    });
  }, 400);
};

// 暴露方法给父组件
const show = () => {
  isFadingOut.value = false;
  activeButton.value = -1;
  emit("update:modelValue", true);
};

const hide = () => {
  isFadingOut.value = true;
  setTimeout(() => {
    emit("update:modelValue", false);
    isFadingOut.value = false;
    activeButton.value = -1;
  }, 400);
};

defineExpose({
  show,
  hide,
});
</script>

<style scoped>
.white-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: overlayDrop 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.white-overlay.fade-out {
  opacity: 0;
}

@keyframes overlayDrop {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.button-container {
  display: flex;
  gap: 40px;
}

.nav-button {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #cccccc;
  border: 3px solid #999999;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.nav-button:hover {
  background: #e0e0e0;
  border-color: #666666;
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
}

.nav-button:active,
.nav-button-active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  transform: scale(0.98);
}

.button-icon {
  font-family: "Courier New", monospace;
  font-size: 24px;
  font-weight: bold;
  color: #666666;
  transition: color 0.3s ease;
}

.nav-button:hover .button-icon,
.nav-button-active .button-icon {
  color: #ffffff;
}

.button-hint {
  margin-top: 40px;
  font-family: "Courier New", monospace;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  animation: hintPulse 2s ease-in-out infinite;
}

@keyframes hintPulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
