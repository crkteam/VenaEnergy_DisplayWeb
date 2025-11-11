<template>
  <div class="flex flex-col justify-between gap-[1vh]">
    <div class="font-bold text-black/80 text-[1.35vh]">現場照片</div>

    <!-- 照片輪播區 -->
    <div class="relative w-full">
      <!-- 左箭頭 -->
      <button
        @click="prev"
        class="absolute pointer-events-auto left-0 top-1/2 -translate-y-1/2 z-10 w-[3vh] h-[3vh] rounded-full bg-white/90 flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md"
      >
        <svg
          class="w-[1.5vh] h-[1.5vh] text-sky-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <!-- 照片容器 -->
      <div class="overflow-hidden mx-[3.5vh]">
        <div
          class="flex transition-transform duration-500 ease-out gap-[1vh]"
          :style="{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }"
        >
          <div
            v-for="(photo, index) in photos"
            :key="index"
            class="flex-shrink-0 rounded-[0.75vh] overflow-hidden cursor-pointer hover:ring-2 hover:ring-sky-blue-500 transition-all"
            :style="{
              width: `calc((100% - ${
                (visibleCount - 1) * 1
              }vh) / ${visibleCount})`,
            }"
            @click="selectPhoto(index)"
          >
            <img
              :src="photo"
              :alt="`照片 ${index + 1}`"
              class="w-full h-[8vh] object-cover"
            />
          </div>
        </div>
      </div>

      <!-- 右箭頭 -->
      <button
        @click="next"
        class="absolute pointer-events-auto right-0 top-1/2 -translate-y-1/2 z-10 w-[3vh] h-[3vh] rounded-full bg-white/90 flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md"
      >
        <svg
          class="w-[1.5vh] h-[1.5vh] text-sky-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 照片數據 - 替換成你的實際圖片路徑
const photos = ref([
  require("@/assets/png/Test.png"),
  require("@/assets/png/Test.png"),
  require("@/assets/png/Test.png"),
  require("@/assets/png/Test.png"),
  require("@/assets/png/Test.png"),
  require("@/assets/png/Test.png"),
]);

const currentIndex = ref(0);
const visibleCount = 3; // 同時顯示3張照片

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const next = () => {
  if (currentIndex.value < photos.value.length - visibleCount) {
    currentIndex.value++;
  }
};

const selectPhoto = (index: number) => {
  console.log("選擇了照片:", index);
  // 這裡可以添加放大顯示照片的邏輯
};
</script>
