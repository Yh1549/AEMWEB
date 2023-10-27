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
    <adnewWrite
      v-if="currentStep == 'write'"
      :newAd="newAd"
      @toConfirm="toConfirm"
    ></adnewWrite>
    <adnewConfirm
      v-else
      :newAd="newAd"
      :selectedBlock="selectedBlock"
      @toWrite="toWrite"
    ></adnewConfirm>
  </keep-alive>
</template>
<script setup>
import { onBeforeMount } from "@vue/runtime-core";
import { ref } from "vue";
import { findSysList } from "../../../api/service";
import adnewConfirm from "../../../components/ad/adNewConfirm.vue";
import adnewWrite from "../../../components/ad/adNewWrite.vue";
import newStepHeader from "../../../components/newStepHeader.vue";

//
const currentStep = ref("write");
const selectedBlock = ref({});
const newAd = ref({
  title: null,
  content: null,
  startDate: null,
  endDate: "2099-01-01 00:00:00",
  system: null,
  photo: null,
  link: "",
  block: null,
  flow: null,
});
const newTitle = [
  { name: "write", title: "填寫資料" },
  { name: "confirm", title: "確認後送出" },
];

const toConfirm = (value, step, block) => {
  newAd.value = value;
  currentStep.value = step;
  selectedBlock.value = block;
};
const toWrite = (step) => {
  currentStep.value = step;
};

onBeforeMount(async () => {
  await findSysList();
});
</script>
