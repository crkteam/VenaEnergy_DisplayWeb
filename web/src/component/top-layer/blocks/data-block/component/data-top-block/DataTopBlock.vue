<template>
  <div class="flex flex-row justify-between">
    <div class="flex flex-col justify-around">
      <div class="flex flex-row items-center gap-[1vh]">
        <img :src="areaSVG()" class="h-[3vh] w-auto" alt="" />
        <div class="text-black/40 text-[1.6vh]">{{ convertTypeToName() }}</div>
      </div>
      <div class="font-bold text-black/65 text-[2vh]">
        xx {{ convertTypeToName() }}
      </div>
    </div>
    <img :src="areaBigSVG()" class="h-full w-auto" alt="" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  areaType: string;
}>();

const areaSVG = () => {
  return require(`@/assets/svg/icon-type-${convertType()}.svg`);
};

const areaBigSVG = () => {
  return require(`@/assets/svg/big-icon-type-${convertType()}.svg`);
};

const convertType = () => {
  let type = props.areaType;
  if (type === "A") {
    return "2";
  } else if (type === "D") {
    return "3";
  }

  return "1";
};

const convertTypeToName = () => {
  let type = props.areaType;
  if (type === "A") {
    return "GRID";
  } else if (type === "D") {
    return "ESS";
  }

  return "PV";
};
</script>
