<template>
  <div class="w-full flex justify-evenly bg-primary rounded-t py-4">
    <newStepHeader
      v-for="(item, index) in newTitle"
      :stepValue="[item.name, index]"
    >
      <template #title> {{ item.title }} </template>
    </newStepHeader>
  </div>
  <keep-alive>
    <postnewWrite
      v-if="postStore.newPostStep"
      :newPost="newPost"
      @newPostConfirm="newPostConfirmCallBack"
    ></postnewWrite>
    <postnewConfirm v-else :newPost="newPost"></postnewConfirm>
  </keep-alive>
  <loadSpinner>
    <template #title>儲存中</template>
  </loadSpinner>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import newStepHeader from "../../../components/newStepHeader.vue";
import postnewConfirm from "../../../components/post/postNewConfirm.vue";
import postnewWrite from "../../../components/post/postNewWrite.vue";
import { usePostStore } from "../../../store/store";
const postStore = usePostStore();
const route = useRoute();
const router = useRouter();
const newPost = ref({
  title: null,
  content: null,
  top: "1",
  postDate: null,
  relSys: null,
  tag: null,
  // Unit: null,
  flow: null,
});
const newPostConfirmCallBack = (value) => {
  newPost.value = value;
};
const newTitle = [
  {
    name: "postnewWrite",
    title: "填寫資料",
  },
  {
    name: "postnewConfirm",
    title: "確認後送出",
  },
];

// onBeforeMount(async () => {
//   Store.currentNewStep = "postnewWrite";
// });
</script>
