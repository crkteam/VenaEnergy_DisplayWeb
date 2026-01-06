<template>
  <div class="relative">
    <WeatherBlock />
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isUnlocked">
        <ShortDataBlock />
        <TitleBlock
          :left="18"
          :top="30"
          title="GRID"
          :type="2"
          @click="handleTitleClick('A')"
        />
        <TitleBlock
          :left="5"
          :top="70"
          title="PV"
          :type="1"
          @click="handleTitleClick('B')"
        />
        <TitleBlock
          :left="72.5"
          :top="50"
          title="PV"
          :type="1"
          @click="handleTitleClick('C')"
        />
        <TitleBlock
          :left="40"
          :top="82"
          title="ESS"
          :type="3"
          @click="handleTitleClick('D')"
        />
        <ChartBlock @toggle="toggleChart" :isExpanded="isChartExpanded" />
      </div>
    </Transition>
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="!isUnlocked">
        <DataBlock :area-type="props.cameraLockedType" />
        <!-- 返回按鈕 -->
        <div
          @click="handleBackClick"
          class="pointer-events-auto absolute flex flex-row gap-[0.7vh] items-center justify-center bg-sea-blue-50 border-sea-blue-700 border-[0.25vh] rounded-[0.5vh] w-[7.5%] h-[5.2%] left-[2%] bottom-[1.6%] cursor-pointer hover:bg-sea-blue-100 transition-colors"
        >
          <svg
            class="w-[0.8vh] h-[1.5vh]"
            viewBox="0 0 8 15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.09737 0.182989C6.3414 -0.0610425 6.73707 -0.0609501 6.98116 0.182989C7.22524 0.427067 7.22524 0.8227 6.98116 1.06678L1.54781 6.50013C1.15051 6.89759 1.15069 7.55152 1.54781 7.9491L6.98116 13.3825C7.22519 13.6265 7.22511 14.0222 6.98116 14.2662C6.73708 14.5103 6.34145 14.5103 6.09737 14.2662L0.66402 8.83289C-0.22125 7.94716 -0.221429 6.50196 0.66402 5.61634L6.09737 0.182989Z"
              fill="#00548A"
            />
          </svg>
          <div class="text-[1.35vh] font-semibold text-primary-1">返回</div>
        </div>
      </div>
    </Transition>
    <!-- 全螢幕按鈕 -->
    <div
      class="pointer-events-auto absolute flex flex-row gap-[0.7vh] items-center justify-center bg-transparent border-primary-1 border-[0.25vh] rounded-[0.5vh] w-[11%] h-[5.2%] right-[1.3%] bottom-[1.6%] cursor-pointer hover:bg-sea-blue-700/10 transition-colors"
    >
      <svg
        class="w-[1.5vh] h-[1.5vh]"
        viewBox="0 0 15 15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.25 2.29167C1.25 1.71637 1.71637 1.25 2.29167 1.25H3.95833C4.30351 1.25 4.58333 0.970175 4.58333 0.625C4.58333 0.279825 4.30351 0 3.95833 0H2.29167C1.02602 0 0 1.02602 0 2.29167V3.95833C0 4.30351 0.279825 4.58333 0.625 4.58333C0.970175 4.58333 1.25 4.30351 1.25 3.95833V2.29167ZM1.25 12.7083C1.25 13.2837 1.71637 13.75 2.29167 13.75H3.95833C4.30351 13.75 4.58333 14.0298 4.58333 14.375C4.58333 14.7202 4.30351 15 3.95833 15H2.29167C1.02602 15 0 13.974 0 12.7083V11.0417C0 10.6965 0.279825 10.4167 0.625 10.4167C0.970175 10.4167 1.25 10.6965 1.25 11.0417V12.7083ZM12.7083 1.25C13.2837 1.25 13.75 1.71637 13.75 2.29167V3.95833C13.75 4.30351 14.0298 4.58333 14.375 4.58333C14.7202 4.58333 15 4.30351 15 3.95833V2.29167C15 1.02602 13.974 0 12.7083 0H11.0417C10.6965 0 10.4167 0.279825 10.4167 0.625C10.4167 0.970175 10.6965 1.25 11.0417 1.25H12.7083ZM13.75 12.7083C13.75 13.2837 13.2837 13.75 12.7083 13.75H11.0417C10.6965 13.75 10.4167 14.0298 10.4167 14.375C10.4167 14.7202 10.6965 15 11.0417 15H12.7083C13.974 15 15 13.974 15 12.7083V11.0417C15 10.6965 14.7202 10.4167 14.375 10.4167C14.0298 10.4167 13.75 10.6965 13.75 11.0417V12.7083Z"
          fill="#00548A"
        />
      </svg>
      <div class="text-[1.35vh] font-semibold text-primary-1">開啟全螢幕</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from "vue";
import WeatherBlock from "@/component/top-layer/blocks/WeatherBlock.vue";
import ShortDataBlock from "@/component/top-layer/blocks/short-data-block/ShortDataBlock.vue";
import TitleBlock from "@/component/top-layer/blocks/title-block/TitleBlock.vue";
import DataBlock from "@/component/top-layer/blocks/data-block/DataBlock.vue";
import ChartBlock from "@/component/top-layer/blocks/chart-block/ChartBlock.vue";

const props = defineProps<{
  cameraLockedType: string;
}>();

const emit = defineEmits<{
  unlockCamera: [];
  lockCamera: [areaType: string];
}>();

const isUnlocked = computed(() => props.cameraLockedType === "");

// 圖表展開狀態
const isChartExpanded = ref(false);

const toggleChart = () => {
  isChartExpanded.value = !isChartExpanded.value;
};

// TitleBlock 點擊處理
const handleTitleClick = (areaType: string) => {
  emit("lockCamera", areaType);
};

// 返回按鈕點擊處理
const handleBackClick = () => {
  emit("unlockCamera");
};
</script>
