<template>
  <BottomLayer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BottomLayer from "@/component/bottomLayer/BottomLayer.vue";

export default defineComponent({
  name: "App",
  components: { BottomLayer },
});
</script>

<style>
#ve-app {
  width: 100%;
  height: 100%;
}
</style>
