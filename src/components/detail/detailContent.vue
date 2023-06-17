<template>
  <div class="my-2">
    <span class="block text-2xl font-bold p-2 rounded">
      {{ props.detailInfo.title }}
    </span>
    <div>
      <div class="flex items-center">
        <span class="text-2xl text-primary mx-2">
          <i class="fa-solid fa-circle-user"></i>
        </span>
        <p class="font-bold text-lg">{{ props.detailInfo.name }}</p>
      </div>
      <p v-if="route.params.category == 'post'" class="text-sm mx-2">
        發布於日期:<span class="m-1 p-1">{{ props.detailInfo.postDate }}</span>
      </p>
      <p v-else class="text-sm mx-2">
        發布於日期:<span class="m-1 p-1">{{ props.detailInfo.startDate }}</span>
      </p>
    </div>
    <div
      v-html="props.detailInfo.content"
      class="tiptapStyle m-1 bg-white shadow-lg rounded p-8"
    ></div>
    <div
      v-if="route.params.category == 'ad'"
      class="w-1/2 bg-white shadow-lg rounded p-4 my-4 mx-auto"
    >
      <span>廣告圖片</span>
      <img
        v-if="props.detailInfo.photo"
        :src="`data:image;base64,${props.detailInfo.photo}`"
        class="w-full"
      />
      <span v-else>無</span>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import { useStore } from "../../store/store";
const Store = useStore();
const route = useRoute();
const props = defineProps(["detailInfo"]);
</script>
