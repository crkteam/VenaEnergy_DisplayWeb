<template>
  <div
    class="absolute top-[2.5vh] right-[2.5vh] w-[30%] h-[25%] p-[1.5vh] bg-gradient-to-b from-[#9FBFD3]/30 to-[#94A1BF]/30 rounded-[1.5vh]"
  >
    <!-- 網格容器 2x2 -->
    <div class="grid grid-cols-2 grid-rows-2 gap-[1.5vh] h-full">
      <ShortDataCard value="287" title="PV今日發電量" />
      <ShortDataCard value="287" title="儲能今日放電量" />
      <ShortDataCard value="287" title="儲能總放電量" />
      <ShortDataCard value="287" title="PV總發電量" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ShortDataCard from "@/component/top-layer/blocks/short-data-block/component/ShortDataCard.vue";
</script>
