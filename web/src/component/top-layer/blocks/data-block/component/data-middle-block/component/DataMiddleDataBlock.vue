<template>
  <div
    class="bg-white/65 rounded-[1.5vh] flex flex-col justify-between p-[2vh]"
  >
    <div class="text-black/80 text-[1.35vh]">{{ title }}</div>
    <div class="flex flex-row items-center justify-end gap-[0.75vh]">
      <div class="font-bold text-black/65 text-[2.25vh]">{{ value }}</div>
      <div class="text-black/40 text-[1.2vh]">MWp</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  title: string;
  value: number;
}>();
</script>
