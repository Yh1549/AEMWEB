<template>
  <div class="w-full border-2 border-primaryLight">
    <div class="flex flex-wrap">
      <div class="w-full md:w-1/4 p-2 border-r-2 border-primaryLight">
        <span class="block font-bold text-lg">基本資料</span>
        <div class="flex flex-col items-center justify-center">
          <span class="text-primaryDark text-[100px]">
            <i class="fa-solid fa-circle-user"></i>
          </span>
          <span class="w-11/16 font-bold mx-auto text-center text-lg">
            <slot name="userName"><span>無</span></slot></span
          >
        </div>
      </div>
      <div class="w-full md:w-3/4">
        <userInfoRow></userInfoRow>
      </div>
    </div>
  </div>
</template>
<script setup>
import userInfoRow from "./userInfoRow.vue";
</script>
