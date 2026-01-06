<template>
  <div class="p-[0.5vh] flex flex-col justify-between">
    <div class="flex items-center gap-[0.5vh]">
      <span class="text-[1.85vh] font-bold tracking-wide text-black/65">{{
        value.toString()
      }}</span>
      <span class="text-[1.2vh] text-black/40">(MWp)</span>
    </div>
    <div class="flex items-center gap-[1vh]">
      <img
        :src="require(`@/assets/svg/icon-type-4.svg`)"
        class="h-auto w-[1.35vh]"
        alt=""
      />
      <div class="text-[1.4vh] text-black/40">{{ title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  value: number;
  title: string;
}>();
</script>
