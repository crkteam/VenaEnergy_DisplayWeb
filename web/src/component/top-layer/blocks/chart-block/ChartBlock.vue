<template>
  <div
    class="pointer-events-auto absolute flex flex-col justify-between p-[1vh] left-[1.9%] w-[84.5%] h-[27.7%] rounded-[1.5vh] bg-white/65 backdrop-blur-[0.25vh]"
    :style="{ bottom: `${bottom}%` }"
  >
    <!-- 控制選項 -->
    <div class="flex flex-row justify-between h-[20%]">
      <!-- 左邊 -->
      <div class="flex flex-row justify-between items-center gap-[0.8vh]">
        <!-- 時間刻度切換 -->
        <div class="flex items-center h-[85%] w-[7vh] bg-white rounded-[0.5vh]">
          <button
            @click="timeScale = 'day'"
            :class="[
              'rounded-s-[0.5vh] h-[100%] w-[50%] text-[1.5vh] transition-colors',
              timeScale === 'day'
                ? 'bg-sea-blue-500 text-sky-blue-100'
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
                ? 'bg-sea-blue-500 text-sky-blue-100'
                : 'text-black/40 ',
            ]"
          >
            年
          </button>
        </div>
        <div class="text-[1.5vh] text-black/40 font-bold">今日發電資訊</div>
        <div class="text-[1.5vh] text-black/40 font-bold">|</div>
        <!-- 數據開關 -->
        <div class="flex items-center gap-[2vh]">
          <EyeToggle
            title="new pv 發電量"
            color="#C0EEF5"
            v-model="dataVisibility.newPvGeneration"
          />
          <EyeToggle
            title="pv 發電量"
            color="#80DDEB"
            v-model="dataVisibility.pvGeneration"
          />
          <EyeToggle
            title="儲能發電量"
            color="#21C3DB"
            v-model="dataVisibility.storageGeneration"
          />
        </div>
      </div>
    </div>

    <!-- 圖表 -->
    <div class="h-[75%]">
      <v-chart :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from "vue";
import EyeToggle from "@/component/top-layer/blocks/chart-block/component/EyeToggle.vue";

defineProps<{
  bottom: number;
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
        color: "#C0EEF5",
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
        color: "#80DDEB",
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
        color: "#21C3DB",
        borderRadius: 0,
      },
      barWidth: "50%",
    });
  }

  // 設定最後一個系列的圓角
  if (series.length > 0) {
    series[series.length - 1].itemStyle.borderRadius = [3, 3, 0, 0] as any;
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
