<template>
  <div
    class="pointer-events-auto absolute flex flex-col justify-between p-[1vh] left-[1.9%] h-[27.7%] rounded-[1.5vh] bg-white/65 backdrop-blur-[0.25vh] transition-all duration-300"
    :style="{
      bottom: `${isExpanded ? 0 : -20.5}%`,
      width: `${isExpanded ? 84.5 : 13.5}%`,
    }"
  >
    <!-- 收起按鈕 -->
    <button
      v-if="isExpanded"
      @click="$emit('toggle')"
      class="absolute top-[1vh] right-[1vh] w-[3vh] h-[3vh] bg-primary-1 rounded-[0.5vh] flex items-center justify-center text-white transition-colors z-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-[1.5vh] h-[1.5vh]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- 展開按鈕 (在底部邊緣) -->
    <button
      v-if="!isExpanded"
      @click="$emit('toggle')"
      class="absolute top-[1vh] right-[1vh] w-[3vh] h-[3vh] bg-primary-1 rounded-[0.5vh] flex items-center justify-center text-white transition-colors z-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-[1.5vh] h-[1.5vh]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>

    <!-- 控制選項 -->
    <div class="flex flex-row justify-between h-[20%]">
      <!-- 左邊 -->
      <div class="flex flex-row justify-between items-center gap-[0.8vh]">
        <!-- 時間刻度切換 -->
        <div
          v-if="isExpanded"
          class="flex items-center h-[85%] w-[7vh] bg-white rounded-[0.5vh]"
        >
          <button
            @click="timeScale = 'day'"
            :class="[
              'rounded-s-[0.5vh] h-[100%] w-[50%] text-[1.5vh] transition-colors',
              timeScale === 'day'
                ? 'bg-primary-1 text-white'
                : 'text-black/40 ',
            ]"
          >
            日
          </button>
          <button
            @click="timeScale = 'year'"
            :class="[
              'rounded-e-[0.5vh] h-[100%] w-[50%] text-[1.5vh] transition-colors',
              timeScale === 'year'
                ? 'bg-primary-1 text-white'
                : 'text-black/40 ',
            ]"
          >
            年
          </button>
        </div>
        <div class="text-[1.5vh] text-black/40 font-bold">今日發電資訊</div>
        <div v-if="isExpanded" class="text-[1.5vh] text-black/40 font-bold">
          |
        </div>
        <!-- 數據開關 -->
        <div v-if="isExpanded" class="flex items-center gap-[2vh]">
          <EyeToggle
            title="new pv 發電量"
            color="#C3851C"
            v-model="dataVisibility.newPvGeneration"
          />
          <EyeToggle
            title="pv 發電量"
            color="#DCAA24"
            v-model="dataVisibility.pvGeneration"
          />
          <EyeToggle
            title="儲能發電量"
            color="#E5C741"
            v-model="dataVisibility.storageGeneration"
          />
        </div>
      </div>
    </div>

    <!-- 圖表 -->
    <div v-if="isExpanded" class="h-[75%]">
      <v-chart :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";
import EyeToggle from "@/component/top-layer/blocks/chart-block/component/EyeToggle.vue";

defineProps<{
  bottom: number;
  isExpanded: boolean;
}>();

defineEmits<{
  toggle: [];
}>();

// 時間刻度
const timeScale = ref<"day" | "year">("day");

// 數據顯示開關
const dataVisibility = ref({
  newPvGeneration: true,
  pvGeneration: true,
  storageGeneration: true,
});

// 日刻度數據
const dayData = {
  labels: [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
  ],
  newPvGeneration: [
    25, 35, 20, 15, 40, 30, 20, 25, 15, 20, 25, 30, 25, 25, 20, 25, 25, 30, 30,
    35, 30, 35,
  ],
  pvGeneration: [
    15, 25, 15, 15, 25, 25, 15, 15, 15, 15, 15, 25, 25, 15, 15, 15, 20, 20, 25,
    25, 25, 25,
  ],
  storageGeneration: [
    10, 15, 10, 10, 15, 15, 10, 10, 10, 10, 10, 15, 15, 10, 10, 10, 15, 15, 15,
    15, 15, 15,
  ],
};

// 年刻度數據
const yearData = {
  labels: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  newPvGeneration: [550, 620, 680, 720, 800, 850, 900, 880, 820, 750, 650, 580],
  pvGeneration: [350, 420, 480, 520, 600, 650, 700, 680, 620, 550, 450, 380],
  storageGeneration: [
    250, 320, 380, 420, 500, 550, 600, 580, 520, 450, 350, 280,
  ],
};

// 計算圖表配置
const chartOption = computed(() => {
  const currentData = timeScale.value === "day" ? dayData : yearData;
  const series = [];

  if (dataVisibility.value.newPvGeneration) {
    series.push({
      name: "new pv 發電量",
      type: "bar",
      stack: "total",
      data: currentData.newPvGeneration,
      itemStyle: {
        color: "#C3851C",
        borderRadius: 0,
      },
      barWidth: "50%",
    });
  }

  if (dataVisibility.value.pvGeneration) {
    series.push({
      name: "pv 發電量",
      type: "bar",
      stack: "total",
      data: currentData.pvGeneration,
      itemStyle: {
        color: "#DCAA24",
        borderRadius: 0,
      },
      barWidth: "50%",
    });
  }

  if (dataVisibility.value.storageGeneration) {
    series.push({
      name: "儲能發電量",
      type: "bar",
      stack: "total",
      data: currentData.storageGeneration,
      itemStyle: {
        color: "#E5C741",
        borderRadius: 0,
      },
      barWidth: "50%",
    });
  }

  return {
    grid: {
      left: "0%",
      right: "0%",
      top: "0%",
      bottom: "0%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: currentData.labels,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "rgba(17,24,39,0.4)",
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      max: timeScale.value === "day" ? 100 : 3000,
      splitLine: {
        lineStyle: {
          color: "rgba(17,24,39,0.4)",
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "rgba(17,24,39,0.4)",
        fontSize: 10,
        formatter: (value: number) => value + " kwh",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      textStyle: {
        color: "#FFFFFF",
      },
    },
    series: series,
  };
});
</script>
