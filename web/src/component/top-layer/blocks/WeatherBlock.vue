<template>
  <div
    class="absolute p-[1.25%] top-[3%] left-[1.6%] w-[19.5%] h-[17%] bg-[#fafafa50] backdrop-blur-sm rounded-xl flex flex-row justify-between"
  >
    <!-- 左邊 -->
    <div class="flex flex-col justify-between">
      <!-- 日期 -->
      <div>
        <div class="text-[1.2vh] tracking-wider text-c-black/80">
          {{ weather.date }} {{ weather.day }}
        </div>
        <div class="text-[1.5vh] text-c-black/80">{{ weather.location }}</div>
      </div>
      <!-- 溫度 -->
      <span class="text-[2.5vh] tracking-wider font-bold text-c-black/80"
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
