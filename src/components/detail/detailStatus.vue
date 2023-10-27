<template>
  <div class="flex flex-wrap items-center gap-2">
    <span
      v-if="props.detailInfo.status"
      class="btn inline-block text-center p-2 cursor-default"
      :class="commonStore.getCaseStatusName(props.detailInfo.status).color"
    >
      {{ commonStore.getCaseStatusName(props.detailInfo.status).title }}
    </span>
    <span
      v-if="props.detailInfo.top && props.detailInfo?.top == '1'"
      class="btn inline-block text-center p-2 cursor-default"
    >
      置頂
    </span>
    <span class="font-bold">系統:</span>
    <span v-if="props.detailInfo?.relSys" class="inpLabel"
      >{{ getFullSystem.memo }}/{{ getFullSystem.name }}</span
    >
    <span v-if="props.detailInfo?.system" class="inpLabel"
      >{{ getFullSystem.memo }}/ {{ getFullSystem.name }}</span
    >

    <div v-if="props.detailInfo.tag" class="flex gap-2 flex-wrap">
      <span class="self-center font-bold">群組tags:</span>
      <span v-for="item in getFullTag" class="inpLabel">
        {{ item.memo }}/
        {{ item.name }}
      </span>
    </div>
    <div v-if="props.detailInfo?.block" class="flex gap-2 flex-wrap">
      <span class="self-center font-bold">區塊block:</span>
      <span class="inpLabel"> {{ adBlock.memo }}/{{ adBlock.block }} </span>
    </div>
  </div>
</template>
<script setup>
import { computed, onBeforeMount, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { useCommonStore } from "../../store/commonStore";
const props = defineProps(["detailInfo"]);
const commonStore = useCommonStore();
const route = useRoute();
const fullSysList = ref([]);
const adBlock = ref({ memo: "", block: "" });
const getFullSystem = computed(() => {
  if (route.params.category == "post") {
    for (let item of fullSysList.value) {
      if (props.detailInfo.relSys == item.name) {
        return item;
      }
    }
  } else {
    for (let item of fullSysList.value) {
      if (props.detailInfo.system == item.name) {
        return item;
      }
    }
  }
});
const getFullTag = computed(() => {
  let array = [];
  for (let item in props.detailInfo.tagList) {
    for (let value in props.detailInfo.tag) {
      if (props.detailInfo.tagList[item].name == props.detailInfo.tag[value]) {
        array.push(props.detailInfo.tagList[item]);
      }
    }
  }
  return array;
});
watchEffect(async () => {
  if (route.params.category == "ad") {
    let res = await apiRequest.post("FindSystemBlock", {
      system: props.detailInfo.system,
    });
    if (res.desc == "successful") {
      for (let item in res.resBody.blockModelList) {
        if (res.resBody.blockModelList[item].block == props.detailInfo.block) {
          adBlock.value = res.resBody.blockModelList[item];
        }
      }
    }
  }
});
onBeforeMount(async () => {
  fullSysList.value = JSON.parse(sessionStorage.getItem("SysList"));
});
</script>
