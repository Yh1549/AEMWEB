<template>
  <div
    v-for="row in infoObj"
    class="flex flex-wrap border-b-2 border-primaryLight last:border-b-0"
  >
    <div
      v-for="item in row"
      class="w-full md:w-1/4 h-20 p-2 flex flex-col justify-center"
    >
      <span class="text-sm">{{ item.title }} :</span>
      <p class="font-bold">
        {{ item.value ?? "無" }}
      </p>
    </div>
  </div>
</template>
<script setup>
import { inject } from "vue";
const infoObj = inject("infoObj");
</script>
