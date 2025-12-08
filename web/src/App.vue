<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Bottom -->
    <BottomLayer
      ref="bottomLayerRef"
      class="absolute top-0 left-0 w-full h-full z-0"
    />
    <!-- Top -->
    <TopLayer
      class="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      :camera-locked-type="cameraLockedType"
      @unlock-camera="handleUnlockCamera"
      @lock-camera="handleLockCamera"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BottomLayer from "@/component/bottom-layer/BottomLayer.vue";
import TopLayer from "@/component/top-layer/TopLayer.vue";

export default defineComponent({
  name: "App",
  components: { TopLayer, BottomLayer },
});
</script>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import {
  AnimationGroupType,
  AnimationState,
} from "@/component/bottom-layer/object-creator";

const cameraLockedType = ref("");
const bottomLayerRef = ref<InstanceType<typeof BottomLayer> | null>(null);

// 數字鍵對應的動畫組
const keyToGroup: Record<string, AnimationGroupType> = {
  "0": "A",
  "1": "B",
  "2": "C",
  "3": "D",
  "4": "X",
};

// 追蹤各組的當前狀態
const animationStates = reactive<Record<AnimationGroupType, AnimationState>>({
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  X: 0,
});

// 是否處於暫停狀態
const isPaused = ref(false);

const handleLockCamera = (areaType: string) => {
  cameraLockedType.value = areaType;
  console.log(`UI 隱藏 - 鎖定到 ${areaType}`);

  if (bottomLayerRef.value) {
    bottomLayerRef.value.lockCameraToArea(areaType);
  }
};

const handleUnlockCamera = () => {
  cameraLockedType.value = "";
  console.log("UI 顯示 - 相機解鎖");

  if (bottomLayerRef.value) {
    bottomLayerRef.value.unlockCamera();
  }
};

// 切換動畫狀態 (0 → 1 → 0 → 1...)
const toggleAnimationState = (group: AnimationGroupType) => {
  // 如果處於暫停狀態，不允許切換
  if (isPaused.value) {
    console.log("動畫已暫停，請先按 S 繼續播放");
    return;
  }

  const currentState = animationStates[group];

  // 計算下一個狀態：0 → 1, 1 → 0
  let nextState: AnimationState;
  if (currentState === 0) {
    nextState = 1;
  } else {
    nextState = 0;
  }

  // 更新本地狀態
  animationStates[group] = nextState;

  // 呼叫 BottomLayer 設定動畫
  if (bottomLayerRef.value) {
    bottomLayerRef.value.setAnimationState(group, nextState);
  }

  console.log(`動畫組 ${group}: ${currentState} → ${nextState}`);
};

// 切換暫停/繼續
const togglePause = () => {
  if (isPaused.value) {
    // 從暫停恢復播放
    resumeAllAnimations();
  } else {
    // 暫停所有動畫
    pauseAllAnimations();
  }
};

// 暫停所有動畫
const pauseAllAnimations = () => {
  isPaused.value = true;

  if (bottomLayerRef.value) {
    bottomLayerRef.value.setAllAnimationStates("stop");
  }

  console.log("所有動畫已暫停");
};

// 恢復所有動畫（從暫停處繼續播放）
const resumeAllAnimations = () => {
  isPaused.value = false;

  // 使用 resumeAllAnimations 從暫停處繼續
  if (bottomLayerRef.value) {
    bottomLayerRef.value.resumeAllAnimations();
  }

  console.log("所有動畫已恢復");
};

// 鍵盤事件處理
const handleKeyDown = (event: KeyboardEvent) => {
  // S 鍵切換暫停/繼續
  if (event.key.toLowerCase() === "s") {
    togglePause();
    return;
  }

  // 數字鍵 0-4 切換對應動畫組
  if (event.key in keyToGroup) {
    const group = keyToGroup[event.key];
    toggleAnimationState(group);
    return;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style>
#ve-app {
  height: 100%;
  aspect-ratio: 1240/758;
}
</style>
