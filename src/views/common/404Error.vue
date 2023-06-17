<template>
  <div class="flex flex-col justify-center items-center">
    <div class="text-5xl font-bold">OOPS!</div>
    <p class="border-t-2 border-secondaryDark pt-2">
      {{ commonStore.apiErrorMsg }}
    </p>
    <p class="">糟糕!發生了點問題，請稍後在試</p>
    <span class="text-[50px] md:text-[150px] text-cancel">
      <i class="fa-solid fa-circle-exclamation"></i>
    </span>
  </div>
</template>
<script setup>
import { useCommonStore } from "../../store/commonStore";
const commonStore = useCommonStore();
</script>
