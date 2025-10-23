<template>
  <div
    class="absolute w-[14.3%] h-[7.1%] hover:h-[13.1%] hover:bg-[#ffffff] transition-all pointer-events-auto bg-[#ffffff]/65 backdrop-blur-[0.25vh] rounded-[1.5vh] flex flex-col justify-center gap-[10%] p-[1%] group"
    :style="{ left: `${left}%`, top: `${top}%` }"
  >
    <div
      class="hidden group-hover:flex transition-all flex-row items-center gap-[0.65vh]"
    >
      <div class="font-bold text-[2.25vh] text-black/65">287</div>
      <div class="text-[1.35vh] text-black/40">(kW)</div>
    </div>
    <div class="flex flex-row items-center gap-[0.8vh]">
      <img
        :src="require(`@/assets/svg/icon-type-${type}.svg`)"
        class="h-[2.5vh] w-auto"
        alt=""
      />
      <div class="text-black/40 text-[1.5vh]">{{ title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  left: number;
  top: number;
  title: string;
  type: number;
}>();
</script>
