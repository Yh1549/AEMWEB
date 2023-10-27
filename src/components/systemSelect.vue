<template>
  <div>
    <label for="system" class="font-bold"><slot name="title"></slot> </label>
    <select
      class="inp block border-2 border-primaryDark p-2 my-2 w-full"
      v-model="selected"
      @change="getSelected"
    >
      <option disabled value="null">請選擇您的系統</option>
      <option v-for="item in getSystemList" :key="item" :value="item.name">
        {{ item.memo }}
      </option>
    </select>
  </div>
</template>
<script setup>
import { computed, onBeforeMount, ref } from "vue";
import apiRequest from "../api/apiRequest";
import { findSysList } from "../api/service";
import { useAdStore, useStore } from "../store/store";
const Store = useStore();
const adStore = useAdStore();

const props = defineProps(["options"]);

const selected = ref(Store.adBlockMemo.system);
const getSystemList = computed(() => {
  let array = [];
  for (let item of props.options) {
    for (let value of JSON.parse(sessionStorage.getItem("SysList"))) {
      if (item == value.name) {
        array.push(value);
      }
    }
  }
  return array;
});
const getSelected = () => {
  Store.adBlockMemo.system = selected.value;
  adStore.List = [];
  apiRequest
    .post("FindSystemBlock", { system: selected.value })
    .then((res) => {
      if (res.desc == "successful") {
        adStore.adBlockList = res.resBody.blockModelList;
        adStore.selected = selected.value;
      }
    })
    .catch();
};
onBeforeMount(() => {
  findSysList();
});
</script>
