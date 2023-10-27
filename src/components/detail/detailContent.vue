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
        <span class="mr-1 p-1">上線日期：{{ props.detailInfo.startDate }}</span
        >/<span class="m-1 p-1">下線日期：{{ props.detailInfo.endDate }}</span>
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
      <div class="flex justify-between">
        <span>廣告圖片</span>
        <button
          v-if="props.detailInfo.status == 'online'"
          class="rounded bg-primaryLight p-2 mb-2 text-sm md:btnClick hover:bg-secondaryLight"
          @click="copyImgUrl"
        >
          複製網址
        </button>
      </div>
      <img
        v-if="props.detailInfo.photo"
        :src="`data:image;base64,${props.detailInfo.photo}`"
        class="w-full"
      />
      <p v-else class="text-center">無</p>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const props = defineProps(["detailInfo"]);
const copyImgUrl = () => {
  const envUrl = import.meta.env.VITE_ADPIC_URL;
  const imgUrl = envUrl + "/public/systemAd/" + props.detailInfo.uuid + ".png";
  navigator.clipboard
    .writeText(imgUrl)
    .then(() => {
      alert("複製成功！");
    })
    .catch((error) => {
      console.error("copyError: ", error);
    });
  console.log("uid", imgUrl);
};
</script>
