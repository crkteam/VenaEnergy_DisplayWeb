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
import { ref, onMounted, onBeforeUnmount } from "vue";

const cameraLockedType = ref("");
const bottomLayerRef = ref<InstanceType<typeof BottomLayer> | null>(null);

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

// 鍵盤事件處理
const handleKeyDown = (event: KeyboardEvent) => {
  // 數字鍵 0-9
  if (event.key >= "0" && event.key <= "9") {
    const state = parseInt(event.key);
    console.log(`切換動畫狀態: ${state}`);

    if (bottomLayerRef.value) {
      bottomLayerRef.value.playArrowAnimation(state, {
        staggerDelay: 428,
      });
    }
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
