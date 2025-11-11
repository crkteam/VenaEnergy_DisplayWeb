<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Bottom -->
    <BottomLayer
      class="absolute top-0 left-0 w-full h-full z-0"
      @lock-camera="handleLockCamera"
      @unlock-camera="handleUnlockCamera"
    />
    <!-- Top -->
    <TopLayer
      class="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      :camera-locked-type="cameraLockedType"
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

const handleLockCamera = (areaType: string) => {
  cameraLockedType.value = areaType;
  console.log(`UI 隱藏 - 鎖定到 ${areaType}`);
};

const handleUnlockCamera = () => {
  cameraLockedType.value = "";
  console.log("UI 顯示 - 相機解鎖");
};
</script>

<style>
#ve-app {
  height: 100%;
  aspect-ratio: 1240/758;
}
</style>
