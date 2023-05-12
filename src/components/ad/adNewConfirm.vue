<template>
  <div
    class="w-full p-2 my-2 md:mb-0 md:mr-2 border-2 border-primaryLight rounded"
  >
    <div class="md:flex">
      <div class="py-2 md:w-6/16 flex flex-col">
        <span>開始日期 : {{ adStore().newAd.startDate }}</span>
        <span>結束日期 : {{ adStore().newAd.endDate }}</span>
        <span>關聯系統 : {{ adStore().newAd.system }}</span>
        <span>超連結 : {{ adStore().newAd.link }}</span>
        <span>放置區域 : {{ adStore().newAd.block }}</span>
      </div>
      <div class="py-2 md:w-10/16 flex flex-col">
        <span class="mx-auto">圖片預覽</span>
        <img
          :src="`data:image;base64,${adStore().newAd.photo}`"
          class="mx-auto md:max-h-60"
        />
      </div>
    </div>
    <div class="flex flex-col">
      <span>標題 :{{ adStore().newAd.title }}</span>
      <div v-html="adStore().newAd.content"></div>
    </div>
  </div>
</template>
<script setup>
import { adStore } from "../../store/store";
</script>
