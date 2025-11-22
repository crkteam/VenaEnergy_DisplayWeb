<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Bottom -->
    <BottomLayer
      ref="bottomLayerRef"
      class="absolute top-0 left-0 w-full h-full z-0"
      @lock-camera="handleLockCamera"
      @unlock-camera="handleUnlockCamera"
    />
    <!-- Top -->
    <TopLayer
      class="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      :camera-locked-type="cameraLockedType"
      @unlock-camera="handleUnlockCamera"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BottomLayer from "@/component/bottom-layer/BottomLayer.vue";
import TopLayer from "@/component/top-layer/TopLayer.vue";

export default defineComponent({
  name: "App",
  components: { TopLayer, BottomLayer },
});
</script>

<script lang="ts" setup>
const cameraLockedType = ref("");
const bottomLayerRef = ref<InstanceType<typeof BottomLayer> | null>(null);

const handleLockCamera = (areaType: string) => {
  cameraLockedType.value = areaType;
  console.log(`UI 隱藏 - 鎖定到 ${areaType}`);
};

const handleUnlockCamera = () => {
  cameraLockedType.value = "";
  console.log("UI 顯示 - 相機解鎖");

  // 同時呼叫 BottomLayer 的 unlockCamera
  if (bottomLayerRef.value) {
    bottomLayerRef.value.unlockCamera();
  }
};
</script>

<style>
#ve-app {
  height: 100%;
  aspect-ratio: 1240/758;
}
</style>
