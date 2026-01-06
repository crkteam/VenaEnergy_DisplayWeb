<template>
  <div
    class="absolute w-[18%] h-[7.1%] hover:ring-2 hover:ring-[#60D4E5] hover:bg-[#ffffff] hover:drop-shadow-[0_0_5vh_rgba(1,187,214,0.2)] bg-[#ffffff]/65 transition-all pointer-events-auto backdrop-blur-[0.25vh] rounded-[1.5vh] flex flex-row items-center justify-between ps-[1%] pe-[1%]"
    :style="{ left: `${left}%`, top: `${top}%` }"
  >
    <div class="flex flex-row items-center gap-[0.85vh]">
      <img
        :src="require(`@/assets/svg/icon-type-${type}.svg`)"
        class="h-[2vh] w-auto"
        alt=""
      />
      <div class="text-black/65 text-[1.6vh]">{{ title }}</div>
    </div>
    <div class="flex flex-row items-center gap-[0.5vh]">
      <div class="font-bold text-[2.15vh] text-black/80">287</div>
      <div class="text-[1.35vh] text-black/40">(kW)</div>
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
