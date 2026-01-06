<template>
  <label
    class="flex items-center gap-[0.75vh] cursor-pointer hover:opacity-80 transition-opacity"
  >
    <span
      class="w-[0.8vh] h-[0.8vh] rounded-full"
      :style="{ backgroundColor: color }"
    ></span>
    <span class="text-[1.5vh] text-black/40">{{ title }}</span>
    <button
      type="button"
      @click="$emit('update:modelValue', !modelValue)"
      class="w-[2vh] h-[2vh] flex items-center justify-center"
    >
      <svg
        v-if="modelValue"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-[1.7vh] h-[1.7vh]"
        color="#026F35"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-[1.7vh] h-[1.7vh] opacity-50"
        color="#026F35"
      >
        <path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        ></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    </button>
  </label>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps<{
  modelValue: boolean;
  title: string;
  color: string;
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>
