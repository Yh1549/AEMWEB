<template>
  <div>
    <label for="system" class="font-bold"><slot name="title"></slot> </label>
    <select
      class="inp block border-2 border-primaryDark p-2 my-2 w-full"
      v-model="selected"
      @change="getSelected"
    >
      <option disabled value="null">請選擇您的系統</option>
      <option v-for="item in props.options" :key="item.name" :value="item">
        {{ item.memo }}
      </option>
    </select>
  </div>
</template>
<script setup>
import { ref } from "vue";
import apiRequest from "../api/apiRequest";
import { useAdStore, useStore } from "../store/store";
const Store = useStore();
const adStore = useAdStore();

const props = defineProps(["options"]);

const selected = ref(Store.adBlockMemo.system);

const getSelected = () => {
  Store.adBlockMemo.system = selected.value;
  adStore.List = [];
  apiRequest
    .post("FindSystemBlock", { system: selected.value.name })
    .then((res) => {
      if (res.desc == "successful") {
        adStore.adBlockList = res.resBody.blockModelList;
        adStore.selected = selected.value.name;
      }
    })
    .catch();
};
</script>
