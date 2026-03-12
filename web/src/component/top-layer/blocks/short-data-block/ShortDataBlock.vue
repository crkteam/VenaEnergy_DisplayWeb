<template>
  <div
    class="absolute top-[2.5vh] right-[2.5vh] w-[30%] h-[25%] p-[1.5vh] bg-white/65 rounded-[1.5vh]"
  >
    <!-- 網格容器 2x2 -->
    <div class="grid grid-cols-2 grid-rows-2 gap-[1.5vh] h-full">
      <ShortDataCard :value="power.pvToday" title="PV今日發電量" />
      <ShortDataCard :value="power.storeToday" title="儲能今日放電量" />
      <ShortDataCard :value="power.storeTotal" title="儲能總放電量" />
      <ShortDataCard :value="power.pvTotal" title="PV總發電量" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ShortDataCard from "@/component/top-layer/blocks/short-data-block/component/ShortDataCard.vue";
import { defineProps } from "vue";
import { PowerDetailData } from "@/types/power";

defineProps<{
  power: PowerDetailData;
}>();
</script>
