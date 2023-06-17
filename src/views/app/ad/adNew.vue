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
    <adnewWrite
      v-if="adStore.newAdStep"
      :newAd="newAd"
      @newAdConfirm="newAdConfirmCallBack"
    ></adnewWrite>
    <adnewConfirm v-else :newAd="newAd"></adnewConfirm>
  </keep-alive>
  <loadSpinner>
    <template #title>儲存中</template>
  </loadSpinner>
  <!-- <component :is="getNewTitle"></component> -->
</template>
<script setup>
import { onBeforeMount } from "@vue/runtime-core";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { findSysList } from "../../../api/service";
import adnewConfirm from "../../../components/ad/adNewConfirm.vue";
import adnewWrite from "../../../components/ad/adNewWrite.vue";
import newStepHeader from "../../../components/newStepHeader.vue";
import { useAdStore } from "../../../store/store";
const adStore = useAdStore();
const router = useRouter();
//
const newAd = ref({
  title: null,
  content: null,
  startDate: null,
  endDate: "2099-01-01 00:00:00",
  system: null,
  photo: null,
  link: null,
  block: null,
  flow: null,
});
const newTitle = [
  { name: "adnewWrite", title: "填寫資料" },
  { name: "adnewConfirm", title: "確認後送出" },
];

const newAdConfirmCallBack = (value) => {
  newAd.value = value;
};

onBeforeMount(async () => {
  // Store.currentNewStep = "adnewWrite";
  await findSysList();
  // adStore.$reset();
});
</script>
