<template>
  <div class="flex flex-row justify-between">
    <div class="flex flex-col justify-around">
      <div class="flex flex-row items-center gap-[1vh]">
        <img
          :src="require(`@/assets/svg/icon-type-1.svg`)"
          class="h-[3vh] w-auto"
          alt=""
        />
        <div class="text-black/40 text-[1.6vh]">PV</div>
      </div>
      <div class="font-bold text-black/65 text-[2vh]">xx PV</div>
    </div>
    <img :src="require(`@/assets/png/Test.png`)" class="h-full w-auto" alt="" />
  </div>
</template>

<script setup lang="ts"></script>
