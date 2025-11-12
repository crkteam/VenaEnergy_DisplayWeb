<template>
  <div class="relative">
    <WeatherBlock />
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isUnlocked">
        <ShortDataBlock />
        <ChartBlock :bottom="0" />
        <!--        <TitleBlock :left="7.5" :top="30" title="GRID" :type="2" />-->
        <!--        <TitleBlock :left="5" :top="70" title="PV" :type="1" />-->
        <!--        <TitleBlock :left="35" :top="82" title="ESS" :type="3" />-->
        <!--        <TitleBlock :left="70" :top="60" title="PV" :type="1" />-->
      </div>
    </Transition>
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <DataBlock v-if="!isUnlocked" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import WeatherBlock from "@/component/top-layer/blocks/WeatherBlock.vue";
import ShortDataBlock from "@/component/top-layer/blocks/short-data-block/ShortDataBlock.vue";
import TitleBlock from "@/component/top-layer/blocks/title-block/TitleBlock.vue";
import DataBlock from "@/component/top-layer/blocks/data-block/DataBlock.vue";
import ChartBlock from "@/component/top-layer/blocks/chart-block/ChartBlock.vue";

const props = defineProps<{
  cameraLockedType: string;
}>();

const isUnlocked = computed(() => props.cameraLockedType === "");
</script>
