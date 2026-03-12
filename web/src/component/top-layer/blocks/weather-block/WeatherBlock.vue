<template>
  <div
    class="absolute p-[1.5%] top-[3%] left-[1.6%] w-[24%] h-[20%] backdrop-blur-sm rounded-xl flex flex-row justify-between"
    :class="backgroundClass"
  >
    <div class="flex flex-col justify-between">
      <div>
        <div
          class="text-[1.3vh] leading-relaxed tracking-wider font-bold"
          :class="textClass"
        >
          {{ weather.date }} {{ weather.day }}
        </div>
        <div class="text-[1.5vh] leading-relaxed font-bold" :class="textClass">
          {{ weather.location }}
        </div>
      </div>
      <span class="text-[2.75vh] tracking-wider font-bold" :class="textClass">
        {{ weather.temp }}°C
      </span>
    </div>

    <img :src="weatherIcon" :alt="weather.condition" class="w-auto h-[87.5%]" />
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults, defineProps } from "vue";
import type { WeatherData } from "@/types/weather";
import { defaultWeather } from "@/types/weather";

const props = withDefaults(
  defineProps<{
    weather?: WeatherData;
  }>(),
  {
    weather: () => ({ ...defaultWeather }),
  }
);

const iconMap: Record<string, string> = {
  "01d": new URL("@/assets/svg/weather/clear-sky.svg", import.meta.url).href,
  "01n": new URL("@/assets/svg/weather/clear-sky-night.svg", import.meta.url)
    .href,
  "02d": new URL("@/assets/svg/weather/few-clouds.svg", import.meta.url).href,
  "02n": new URL("@/assets/svg/weather/few-clouds-night.svg", import.meta.url)
    .href,
  "03d": new URL("@/assets/svg/weather/broken-clouds.svg", import.meta.url)
    .href,
  "03n": new URL("@/assets/svg/weather/broken-clouds.svg", import.meta.url)
    .href,
  "10d": new URL("@/assets/svg/weather/rain.svg", import.meta.url).href,
  "10n": new URL("@/assets/svg/weather/rain.svg", import.meta.url).href,
  "11d": new URL("@/assets/svg/weather/thunderstorm.svg", import.meta.url).href,
  "11n": new URL("@/assets/svg/weather/thunderstorm.svg", import.meta.url).href,
  "50d": new URL("@/assets/svg/weather/mist.svg", import.meta.url).href,
  "50n": new URL("@/assets/svg/weather/mist.svg", import.meta.url).href,
};

const weatherIcon = computed(
  () => iconMap[props.weather.condition] ?? iconMap["01d"]
);
const isNight = computed(() => props.weather.condition.endsWith("n"));
const backgroundClass = computed(() =>
  isNight.value ? "bg-gradient-to-r from-[#536976] to-[#292E49]" : "bg-gray-50"
);
const textClass = computed(() =>
  isNight.value ? "text-white" : "text-black/80"
);
</script>
