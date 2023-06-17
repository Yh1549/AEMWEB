<template>
  <div
    v-if="Store.loadingSpinner"
    class="text-center flex justify-center items-center"
  >
    <span class="text-primaryDark text-[100px]">
      <i class="fa-solid fa-spinner fa-spin"></i>
    </span>
    <span class="mx-4 font-bold">
      <slot name="title"></slot>
    </span>
  </div>
</template>
<script setup>
import { useStore } from "../store/store";
const Store = useStore();
</script>
