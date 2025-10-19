<template>
  <div class="relative w-full h-full">
    <!--  Top  -->
    <TopLayer class="absolute top-0 left-0 z-10" />
    <!--  Bottom  -->
    <BottomLayer class="absolute top-0 left-0 z-0" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BottomLayer from "@/component/bottom-layer/BottomLayer.vue";
import TopLayer from "@/component/top-layer/TopLayer.vue";

export default defineComponent({
  name: "App",
  components: { TopLayer, BottomLayer },
});
</script>

<style>
#ve-app {
  width: 100%;
  height: 100%;
}
</style>
