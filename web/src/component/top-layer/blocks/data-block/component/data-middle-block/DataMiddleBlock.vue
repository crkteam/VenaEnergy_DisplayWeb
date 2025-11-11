<script setup lang="ts">
import DataMiddleDataBlock from "@/component/top-layer/blocks/data-block/component/data-middle-block/component/DataMiddleDataBlock.vue";
</script>

<template>
  <div class="flex flex-col justify-between gap-[1vh]">
    <div class="font-bold text-black/80 text-[1.35vh]">詳細資訊</div>
    <div class="h-full grid grid-cols-2 grid-rows-2 gap-[1vh]">
      <DataMiddleDataBlock />
      <DataMiddleDataBlock />
      <DataMiddleDataBlock />
      <DataMiddleDataBlock />
    </div>
  </div>
</template>
