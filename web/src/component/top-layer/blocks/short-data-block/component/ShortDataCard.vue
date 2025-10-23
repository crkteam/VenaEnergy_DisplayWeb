<template>
  <div class="p-[0.5vh] flex flex-col justify-between">
    <div class="flex items-center gap-[0.5vh]">
      <span class="text-[1.85vh] font-bold tracking-wide text-c-black/65">{{
        value.toString()
      }}</span>
      <span class="text-[1.15vh] text-c-black/60">(MWp)</span>
    </div>
    <div class="flex items-center gap-[1vh]">
      <img src="@/assets/svg/light.svg" class="w-[1.35vh] h-auto" alt="" />
      <div class="text-[1.5vh] text-c-black/40">{{ title }}</div>
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
