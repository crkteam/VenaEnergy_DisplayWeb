<template>
  <div
    class="pointer-events-auto absolute left-[1.9%] w-[84.5%] h-[26.8%] rounded-[1.5vh] bg-gradient-to-b from-[#9FBFD3]/30 to-[#94A1BF]/30 backdrop-blur-[0.25vh] p-[1vh]"
    :style="{ bottom: `${bottom}%` }"
  >
    <!-- 控制選項 -->
    <div class="flex items-center gap-[2vh] mb-[1vh] text-white text-[1.4vh]">
      <!-- 時間刻度切換 -->
      <div
        class="flex items-center gap-[0.5vh] bg-white/10 rounded-[0.5vh] px-[1vh] py-[0.5vh]"
      >
        <button
          @click="timeScale = 'day'"
          :class="[
            'px-[1vh] py-[0.3vh] rounded-[0.3vh] transition-colors',
            timeScale === 'day'
              ? 'bg-[#5BC4D4] text-white'
              : 'text-white/60 hover:text-white',
          ]"
        >
          日
        </button>
        <button
          @click="timeScale = 'year'"
          :class="[
            'px-[1vh] py-[0.3vh] rounded-[0.3vh] transition-colors',
            timeScale === 'year'
              ? 'bg-[#5BC4D4] text-white'
              : 'text-white/60 hover:text-white',
          ]"
        >
          年
        </button>
      </div>

      <!-- 數據開關 -->
      <div class="flex items-center gap-[1.5vh]">
        <label
          class="flex items-center gap-[0.5vh] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <input
            type="checkbox"
            v-model="dataVisibility.todayGeneration"
            class="w-[1.5vh] h-[1.5vh] accent-[#5BC4D4]"
          />
          <span>今日發電量</span>
        </label>

        <label
          class="flex items-center gap-[0.5vh] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <input
            type="checkbox"
            v-model="dataVisibility.newPvGeneration"
            class="w-[1.5vh] h-[1.5vh] accent-[#90CAE1]"
          />
          <span>new pv 發電量</span>
        </label>

        <label
          class="flex items-center gap-[0.5vh] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <input
            type="checkbox"
            v-model="dataVisibility.pvGeneration"
            class="w-[1.5vh] h-[1.5vh] accent-[#B8DBE8]"
          />
          <span>pv 發電量</span>
        </label>

        <label
          class="flex items-center gap-[0.5vh] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <input
            type="checkbox"
            v-model="dataVisibility.storageGeneration"
            class="w-[1.5vh] h-[1.5vh] accent-[#E8C4B8]"
          />
          <span>儲能發電量</span>
        </label>
      </div>
    </div>

    <!-- 圖表 -->
    <div class="h-[calc(100%-4vh)]">
      <BarChart :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar as BarChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { defineProps, ref, computed } from "vue";

defineProps<{
  bottom: number;
}>();

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 時間刻度
const timeScale = ref<"day" | "year">("day");

// 數據顯示開關
const dataVisibility = ref({
  todayGeneration: true,
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

// 計算圖表數據
const chartData = computed(() => {
  const currentData = timeScale.value === "day" ? dayData : yearData;
  const datasets = [];

  if (dataVisibility.value.newPvGeneration) {
    datasets.push({
      label: "new pv 發電量",
      data: currentData.newPvGeneration,
      backgroundColor: "#90CAE1",
      borderRadius:
        datasets.length ===
        Object.values(dataVisibility.value).filter(Boolean).length - 1
          ? { topLeft: 4, topRight: 4 }
          : { topLeft: 0, topRight: 0 },
      borderSkipped: false,
    });
  }

  if (dataVisibility.value.pvGeneration) {
    datasets.push({
      label: "pv 發電量",
      data: currentData.pvGeneration,
      backgroundColor: "#B8DBE8",
      borderRadius:
        datasets.length ===
        Object.values(dataVisibility.value).filter(Boolean).length - 1
          ? { topLeft: 4, topRight: 4 }
          : { topLeft: 0, topRight: 0 },
      borderSkipped: false,
    });
  }

  if (dataVisibility.value.storageGeneration) {
    datasets.push({
      label: "儲能發電量",
      data: currentData.storageGeneration,
      backgroundColor: "#E8C4B8",
      borderRadius: { topLeft: 4, topRight: 4 },
      borderSkipped: false,
    });
  }

  return {
    labels: currentData.labels,
    datasets,
  };
});

// 將 chartOptions 改為 computed，讓它能動態更新
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        color: "#FFFFFF",
        font: {
          size: 10,
        },
      },
      border: {
        display: false,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      max: timeScale.value === "day" ? 100 : 3000,
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
        drawBorder: false,
      },
      ticks: {
        color: "#FFFFFF",
        stepSize: timeScale.value === "day" ? 20 : 500,
        font: {
          size: 10,
        },
        callback: function (value: number) {
          return value + " kwh";
        },
      },
      border: {
        display: false,
      },
    },
  },
}));
</script>
