<template>
  <div class="w-full flex justify-evenly bg-primary rounded-t py-4">
    <newStepHeader
      v-for="(item, index) in newTitle"
      :stepValue="[item, index]"
      :currentStep="currentStep"
    >
    </newStepHeader>
  </div>
  <keep-alive>
    <postnewWrite
      v-if="currentStep == 'write'"
      :newPost="newPost"
      @toConfirm="toConfirm"
    ></postnewWrite>
    <postnewConfirm
      v-else
      :newPost="newPost"
      :fullInfo="fullInfo"
      @toWrite="toWrite"
    ></postnewConfirm>
  </keep-alive>
</template>

<script setup>
import { ref } from "vue";
import newStepHeader from "../../../components/newStepHeader.vue";
import postnewConfirm from "../../../components/post/postNewConfirm.vue";
import postnewWrite from "../../../components/post/postNewWrite.vue";
import { usePostStore } from "../../../store/store";
const postStore = usePostStore();
const currentStep = ref("write");
const newPost = ref({
  title: null,
  content: null,
  top: "0",
  postDate: null,
  relSys: null,
  tag: [],
  // Unit: null,
  flow: null,
});
const fullInfo = ref({});
const toConfirm = (value, step, info) => {
  newPost.value = value;
  currentStep.value = step;
  fullInfo.value = info;
};
const toWrite = (step) => {
  currentStep.value = step;
};
const newTitle = [
  {
    name: "write",
    title: "填寫資料",
  },
  {
    name: "confirm",
    title: "確認後送出",
  },
];
</script>
