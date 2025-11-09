<template>
  <div class="relative">
    <WeatherBlock />
    <ShortDataBlock />
    <TitleBlock :left="7.5" :top="30" title="GRID" :type="2" />
    <TitleBlock :left="5" :top="70" title="PV" :type="1" />
    <TitleBlock :left="35" :top="82" title="ESS" :type="3" />
    <TitleBlock :left="70" :top="60" title="PV" :type="1" />
  </div>
</template>
<script setup lang="ts">
import WeatherBlock from "@/component/top-layer/blocks/WeatherBlock.vue";
import ShortDataBlock from "@/component/top-layer/blocks/short-data-block/ShortDataBlock.vue";
import TitleBlock from "@/component/top-layer/blocks/title-block/TitleBlock.vue";
</script>
