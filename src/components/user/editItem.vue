<template>
  <div
    class="flex group border-2 border-primaryLight mb-4"
    :class="
      Store().getSvcAuth('UpdateUser')
        ? 'cursor-pointer'
        : 'pointer-events-none'
    "
  >
    <span class="w-full md:w-4/16 font-bold border-r-2 p-4 border-primaryLight"
      ><slot name="title"></slot
    ></span>
    <span
      class="w-full md:w-10/16 p-4 font-bold text-center md:text-start group-hover:bg-gray-200"
    >
      <slot name="content"></slot>
    </span>
    <span
      class="w-2/16 py-4 text-center text-primaryDark text-lg group-hover:text-secondaryDark group-hover:bg-gray-200"
      ><i
        class="fa-solid fa-circle-chevron-right group-hover:animate-bounce"
      ></i
    ></span>
  </div>
</template>
<script setup>
import { Store } from "../../store/store";
</script>
