<template>
  <div class="flex flex-col justify-between gap-[1vh]">
    <div class="font-bold text-black/80 text-[1.35vh]">詳細資訊</div>
    <div class="h-full grid grid-cols-2 grid-rows-2 gap-[1vh]">
      <DataMiddleDataBlock title="PV今日發電量" :value="powerDetail.pvToday" />
      <DataMiddleDataBlock title="儲能發電量" :value="powerDetail.storeToday" />
      <DataMiddleDataBlock
        title="儲能總放電量"
        :value="powerDetail.storeTotal"
      />
      <DataMiddleDataBlock title="PV總發電量" :value="powerDetail.pvTotal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DataMiddleDataBlock from "@/component/top-layer/blocks/data-block/component/data-middle-block/component/DataMiddleDataBlock.vue";
import { defineProps } from "vue";
import { PowerDetailData } from "@/types/power";

defineProps<{
  powerDetail: PowerDetailData;
}>();
</script>
