<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Bottom -->
    <BottomLayer class="absolute top-0 left-0 w-full h-full z-0" />
    <!-- Top -->
    <TopLayer
      class="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
    />
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
  height: 100%;
  aspect-ratio: 1240/782;
}
</style>
