<template>
  <div class="my-2">
    <span class="block text-2xl font-bold p-2 rounded">
      {{ Store().detailinfo.title }}
    </span>
    <div>
      <div class="flex items-center">
        <span class="text-2xl text-primary mx-2">
          <i class="fa-solid fa-circle-user"></i>
        </span>
        <p class="font-bold text-lg">{{ Store().detailinfo.name }}</p>
      </div>
      <p v-if="route.params.category == 'post'" class="text-sm mx-2">
        發布於日期:<span class="m-1 p-1">{{
          Store().dateReform(Store().timeReform(Store().detailinfo.postDate)[0])
        }}</span
        ><span
          >時間:{{ Store().timeReform(Store().detailinfo.postDate)[1] }}</span
        >
      </p>
      <p v-else class="text-sm mx-2">
        發布於日期:<span class="m-1 p-1">{{
          Store().dateReform(
            Store().timeReform(Store().detailinfo.startDate)[0]
          )
        }}</span>
      </p>
    </div>
    <div
      v-html="Store().detailinfo.content"
      class="m-1 bg-white shadow-lg rounded p-8"
    ></div>
    <div
      v-if="route.params.category == 'ad'"
      class="w-1/2 bg-white shadow-lg rounded p-4 my-4 mx-auto"
    >
      <span>廣告圖片</span>
      <img
        v-if="Store().detailinfo.photo"
        :src="`data:image;base64,${Store().detailinfo.photo}`"
        class="w-full"
      />
      <span v-else>無</span>
    </div>
  </div>
</template>
<script setup>
import { Store } from "../../store/store";
import { useRoute } from "vue-router";
const route = useRoute();
</script>
