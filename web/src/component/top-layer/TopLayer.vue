<template>
  <div class="relative">
    <WeatherBlock />
    <ShortDataBlock />
    <TitleBlock :left="5" :top="43" title="PV" :type="1" />
    <TitleBlock :left="35" :top="76" title="ESS" :type="2" />
    <TitleBlock :left="63" :top="37" title="new-PV" :type="1" />
    <TitleBlock :left="43.7" :top="17.1" title="GRID" :type="3" />
    <!--  -20 2.5  -->
    <ChartBlock :bottom="-20" />
  </div>
</template>
<script setup lang="ts">
import WeatherBlock from "@/component/top-layer/blocks/WeatherBlock.vue";
import ShortDataBlock from "@/component/top-layer/blocks/short-data-block/ShortDataBlock.vue";
import TitleBlock from "@/component/top-layer/blocks/title-block/TitleBlock.vue";
import ChartBlock from "@/component/top-layer/blocks/chart-block/ChartBlock.vue";
</script>
