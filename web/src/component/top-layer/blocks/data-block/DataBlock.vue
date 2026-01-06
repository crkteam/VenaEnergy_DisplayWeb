<template>
  <div
    class="absolute top-[2.5vh] right-[2.5vh] w-[39.5%] h-[89%] p-[1.5vh] bg-white/40 backdrop-blur-[0.25vh] rounded-[1.5vh]"
  >
    <!-- 網格容器 2x2 -->
    <div class="h-full w-full p-[2%] flex flex-col justify-center gap-[4%]">
      <DataTopBlock :area-type="props.areaType" class="h-[14.7%] w-full" />
      <DataMiddleBlock class="h-[50%] w-full" />
      <DataBottomBlock class="h-[24.5%] w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

import DataTopBlock from "@/component/top-layer/blocks/data-block/component/data-top-block/DataTopBlock.vue";
import DataMiddleBlock from "@/component/top-layer/blocks/data-block/component/data-middle-block/DataMiddleBlock.vue";
import DataBottomBlock from "@/component/top-layer/blocks/data-block/component/data-bottom-block/DataBottomBlock.vue";

const props = defineProps<{
  areaType: string;
}>();
</script>
