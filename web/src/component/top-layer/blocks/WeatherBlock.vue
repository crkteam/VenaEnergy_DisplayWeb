<template>
  <div
    class="absolute p-[1.5%] top-[3%] left-[1.6%] w-[24%] h-[20%] bg-gray-50 backdrop-blur-sm rounded-xl flex flex-row justify-between"
  >
    <!-- 左邊 -->
    <div class="flex flex-col justify-between">
      <!-- 日期 -->
      <div>
        <div
          class="text-[1.3vh] leading-relaxed tracking-wider text-black/80 font-bold"
        >
          {{ weather.date }} {{ weather.day }}
        </div>
        <div class="text-[1.5vh] leading-relaxed text-black/80 font-bold">
          {{ weather.location }}
        </div>
      </div>
      <!-- 溫度 -->
      <span class="text-[2.75vh] tracking-wider text-black/80 font-bold"
        >{{ weather.temp }}°C</span
      >
    </div>

    <!-- 太陽圖標 -->
    <img src="@/assets/svg/sun.svg" alt="sun" class="w-auto h-[87.5%]" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const weather = ref({
  date: "2025.01.01",
  day: "(一)",
  location: "桃園場",
  temp: 27,
  condition: "Sunny",
});
</script>
