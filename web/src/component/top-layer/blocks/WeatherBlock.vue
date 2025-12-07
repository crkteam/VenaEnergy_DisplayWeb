<template>
  <div
    class="absolute p-[1.5%] top-[3%] left-[1.6%] w-[24%] h-[20%] backdrop-blur-sm rounded-xl flex flex-row justify-between"
    :class="backgroundClass"
  >
    <!-- 左邊 -->
    <div class="flex flex-col justify-between">
      <!-- 日期 -->
      <div>
        <div
          class="text-[1.3vh] leading-relaxed tracking-wider font-bold"
          :class="textClass"
        >
          {{ weather.date }} {{ weather.day }}
        </div>
        <div class="text-[1.5vh] leading-relaxed font-bold" :class="textClass">
          {{ weather.location }}
        </div>
      </div>
      <!-- 溫度 -->
      <span class="text-[2.75vh] tracking-wider font-bold" :class="textClass"
        >{{ weather.temp }}°C</span
      >
    </div>

    <!-- 天氣圖標 -->
    <img :src="weatherIcon" :alt="weather.condition" class="w-auto h-[87.5%]" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const weather = ref({
  date: "2025.01.01",
  day: "(一)",
  location: "桃園場",
  temp: 27,
  condition: "50d",
});
//01晴天 02少雲 03烏雲 10下雨 11打雷下雨 50強風
// d白天 n晚上
const weatherIcon = computed(() => {
  const iconMap: Record<string, string> = {
    "01d": new URL("@/assets/svg/weather/clear-sky.svg", import.meta.url).href,
    "01n": new URL("@/assets/svg/weather/clear-sky-night.svg", import.meta.url)
      .href,
    "02d": new URL("@/assets/svg/weather/few-clouds.svg", import.meta.url).href,
    "02n": new URL("@/assets/svg/weather/few-clouds-night.svg", import.meta.url)
      .href,
    "03d": new URL("@/assets/svg/weather/broken-clouds.svg", import.meta.url)
      .href,
    "03n": new URL("@/assets/svg/weather/broken-clouds.svg", import.meta.url)
      .href,
    "10d": new URL("@/assets/svg/weather/rain.svg", import.meta.url).href,
    "10n": new URL("@/assets/svg/weather/rain.svg", import.meta.url).href,
    "11d": new URL("@/assets/svg/weather/thunderstorm.svg", import.meta.url)
      .href,
    "11n": new URL("@/assets/svg/weather/thunderstorm.svg", import.meta.url)
      .href,
    "50d": new URL("@/assets/svg/weather/mist.svg", import.meta.url).href,
    "50n": new URL("@/assets/svg/weather/mist.svg", import.meta.url).href,
  };

  return iconMap[weather.value.condition] || iconMap["01d"];
});

const isNight = computed(() => weather.value.condition.endsWith("n"));

// 根據白天/夜晚切換背景
const backgroundClass = computed(() => {
  return isNight.value
    ? "bg-gradient-to-r from-[#536976] to-[#292E49]"
    : "bg-gray-50";
});

// 根據白天/夜晚切換文字顏色
const textClass = computed(() => {
  return isNight.value ? "text-white" : "text-black/80";
});
</script>
