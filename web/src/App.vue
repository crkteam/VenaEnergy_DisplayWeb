<template>
  <div class="relative w-full h-full overflow-hidden">
    <BottomLayer
      ref="bottomLayerRef"
      class="absolute top-0 left-0 w-full h-full z-0"
      :bottom-color-data="bottomColorData"
      @areaClick="(type: string) => type === 'unlock' ? handleUnlockCamera() : handleLockCamera(type)"
    />
    <TopLayer
      class="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      :camera-locked-type="cameraLockedType"
      :weather="weather"
      :power="power"
      :chart="chart"
      @unlock-camera="handleUnlockCamera"
      @lock-camera="handleLockCamera"
      @toggle-fullscreen="handleToggleFullscreen"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BottomLayer from "@/component/bottom-layer/BottomLayer.vue";
export default defineComponent({ name: "App", components: { BottomLayer } });
</script>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import TopLayer from "@/component/top-layer/TopLayer.vue";
import type { WeatherData } from "@/types/weather";
import { useCamera } from "@/composables/useCamera";
import { useAnimation } from "@/composables/useAnimation";
import { PowerData } from "@/types/power";
import { ChartData } from "@/types/chart";
import { BottomColorData } from "@/types/bottom";
import {
  AnimationGroupType,
  AnimationState,
} from "@/component/bottom-layer/object-creator";

// =========================================
//   填入資料區
// =========================================

/**
 * 天氣資料
 * @see WeatherData 各欄位說明
 */
const weather = ref<WeatherData>({
  date: "2025.06.15",
  day: "(日)",
  location: "桃園場",
  temp: 30,
  condition: "01d",
});

/**
 * 電力資料
 * @see PowerData 各欄位說明
 */
const power = ref<PowerData>({
  mainData: {
    pvToday: 1,
    storeToday: 2,
    storeTotal: 3,
    pvTotal: 4,
  },
  gridValue: 10,
  gridData: {
    pvToday: 0,
    storeToday: 0,
    storeTotal: 0,
    pvTotal: 0,
  },
  pv1Value: 20,
  pv1Data: {
    pvToday: 0,
    storeToday: 0,
    storeTotal: 0,
    pvTotal: 0,
  },
  pv2Value: 30,
  pv2Data: {
    pvToday: 0,
    storeToday: 0,
    storeTotal: 0,
    pvTotal: 0,
  },
  essValue: 40,
  essData: {
    pvToday: 0,
    storeToday: 0,
    storeTotal: 0,
    pvTotal: 0,
  },
});

/**
 * 圖表資料
 * @see ChartData 各欄位說明
 */
const chart = ref<ChartData>({
  monthPvData: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ],
  monthStoreData: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ],
  monthNewPvData: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ],
  yearPvData: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  yearStoreData: [
    100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200,
  ],
  yearNewPvData: [
    100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200,
  ],
});

/**
 * 場景顏色資料
 * @see BottomColorData 各欄位說明
 */
const bottomColorData = ref<BottomColorData>({
  bgColor: 0xdff3e8,
  floorColor: 0xe4ded2,
  gridPrimaryColor: 0x8ecdb0,
  gridSecondaryColor: 0xb8e8d0,
  blockFloorColor: 0xb9b3a5,
  solar1Color: 0xafb1bd,
  solar2Color: 0x3a3e59,
  electricColor: 0x8d8d8d,
  container1Color: 0x45714d,
  container2Color: 0xededed,
  bigTransformerColor: 0x496648,
  bigBatteryColor: 0xaca592,
  ammeterColor: 0xffffff,
  smallBatteryColor: 0xd5deef,
  smallTransformerColor: 0x2f544c,
  arrowColor: 0xdcaa24,
});

/**
 * 動畫初始狀態
 * @see AnimationGroupType 各組說明
 * - A: 電網區塊
 * - B: PV1 區塊
 * - C: PV2 區塊
 * - D: ESS 區塊
 * - X: 其他
 * 0 = 關閉，1 = 開啟
 */
const animationInitialStates: Partial<
  Record<AnimationGroupType, AnimationState>
> = {
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  X: 0,
};

const handleToggleFullscreen = () => {
  const el = document.getElementById("ve-app");
  if (!el) return;

  if (!document.fullscreenElement) {
    el.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
// =========================================

const bottomLayerRef = ref<InstanceType<typeof BottomLayer> | null>(null);
const { cameraLockedType, handleLockCamera, handleUnlockCamera } =
  useCamera(bottomLayerRef);
const { handleKeyDown } = useAnimation(bottomLayerRef, animationInitialStates);

onMounted(() => window.addEventListener("keydown", handleKeyDown));
onBeforeUnmount(() => window.removeEventListener("keydown", handleKeyDown));
</script>

<style>
#ve-app {
  height: 100%;
  aspect-ratio: 1240/758;
}
</style>
