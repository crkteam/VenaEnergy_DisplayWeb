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

<template>
  <div
    class="absolute top-[2.5vh] left-[2.5vh] w-[32vh] h-[17.5vh] bg-[#fafafa50] backdrop-blur-sm border border-white/30 rounded-xl p-[2vh] flex flex-row justify-between"
  >
    <!-- 左邊 -->
    <div class="flex flex-col justify-between">
      <!-- 日期 -->
      <div>
        <div class="text-[1.5vh] text-c-black/80">
          {{ weather.date }} {{ weather.day }}
        </div>
        <div class="text-[1.5vh] text-c-black/80">{{ weather.location }}</div>
      </div>
      <!-- 溫度 -->
      <div>
        <span class="text-[4.5vh] font-bold text-c-black/80">{{
          weather.temp
        }}</span>
        <span class="text-[2.5vh] text-c-black/80">°C</span>
      </div>
    </div>

    <!-- 太陽圖標 -->
    <img src="@/assets/svg/sun.svg" alt="sun" class="w-[14.5vh] h-auto" />
  </div>
</template>
