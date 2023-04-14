<template>
  <label for="system" class="font-bold"><slot name="title"></slot></label>
  <select
    class="inp block border-2 border-primaryDark p-2 my-2 w-full"
    v-model="selectedBlock"
    @change="getSelectBlockAd"
  >
    <option disabled value="null">請選擇廣告區塊</option>
    <option v-for="item in props.options" :key="item.block" :value="item">
      {{ item.memo }}
    </option>
  </select>
</template>
<script setup>
import { ref } from "vue";
import apiRequest from "../api/apiRequest";
import { adStore, Store } from "../store/store";
const props = defineProps(["options", "blockAdSvc"]);

const selectedBlock = ref(null);

const getSelectBlockAd = () => {
  Store().loadingSpinner = true;
  apiRequest
    .get(`public/${props.blockAdSvc}`, {
      params: {
        system: adStore().selected,
        block: selectedBlock.value.block,
      },
    })
    .then((res) => {
      Store().loadingSpinner = false;
      if (res.desc == "successful") {
        Store().loadingSpinner = false;
        adStore().List = res.resBody.advertiseModelList;
      }
    })
    .catch();
};
</script>
