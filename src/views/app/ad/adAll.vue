<template>
  <div class="w-1/2 mx-auto py-4">
    <span class="font-bold"> 系統 / 區塊 :</span>
    <div class="flex w-full gap-4">
      <!-- 系統 -->
      <label class="inpLabel w-full">
        <select
          class="inp w-full"
          v-model="adStore.selectedSys"
          @change="getSelected"
        >
          <option disabled :value="null">請選擇</option>
          <option v-for="item in systemList" :key="item" :value="item.name">
            {{ item.memo }} / {{ item.name }}
          </option>
        </select>
      </label>
      <label class="inpLabel w-full">
        <select
          class="inp w-full"
          :disabled="blockList.length == 0"
          v-model="adStore.selectedBlock"
          @change="getSelectBlockAd"
        >
          <option disabled :value="null">{{ getPlaceholder }}</option>
          <option
            v-for="item in blockList"
            :key="item.block"
            :value="item.block"
          >
            {{ item.memo }} / {{ item.block }}
          </option>
        </select>
      </label>
    </div>
    <div class="text-end my-2">
      <button class="btn" @click="reset">清空搜尋</button>
    </div>
  </div>
  <span class="text-sm opacity-70">*選定系統與區塊後，即可編輯與查看廣告</span>
  <adAllList />
  <loadingSpinner></loadingSpinner>
  <no-result v-if="adStore.List.length == 0"></no-result>
  <page-control v-else :pageName="adStore.List"></page-control>
</template>
<script setup>
import { computed, onBeforeMount, ref } from "vue";
import apiRequest from "../../../api/apiRequest";
import { findSysList } from "../../../api/service";
import NoResult from "../../../components/NoResultPage.vue";
import adAllList from "../../../components/list/adAllList.vue";
import loadingSpinner from "../../../components/loadSpinner.vue";
import pageControl from "../../../components/pageControl.vue";
import { useAdStore, useStore } from "../../../store/store";

const Store = useStore();
const adStore = useAdStore();

const systemList = ref(JSON.parse(sessionStorage.getItem("SysList")));
const blockList = ref([]);
onBeforeMount(async () => {
  findSysList();
  if (adStore.selectedSys != null && adStore.selectedBlock != null) {
    apiRequest
      .post("FindSystemBlock", { system: adStore.selectedSys })
      .then((res) => {
        if (res.desc == "successful") {
          blockList.value = res.resBody.blockModelList;
        }
      })
      .catch();
    getSelectBlockAd();
  }
});
const getSelected = () => {
  adStore.List = [];
  adStore.selectedBlock = null;
  apiRequest
    .post("FindSystemBlock", { system: adStore.selectedSys })
    .then((res) => {
      if (res.desc == "successful") {
        blockList.value = res.resBody.blockModelList;
      }
    })
    .catch();
};
const getSelectBlockAd = () => {
  Store.loadingSpinner = true;
  apiRequest
    .get(`blockAd`, {
      params: {
        system: adStore.selectedSys,
        block: adStore.selectedBlock,
      },
    })
    .then((res) => {
      Store.loadingSpinner = false;
      if (res.desc == "successful") {
        adStore.List = res.resBody.advertiseModelList;
      }
    })
    .catch((e) => {
      Store.loadingSpinner = false;
    });
};
const reset = () => {
  adStore.selectedSys = null;
  adStore.selectedBlock = null;
  adStore.List = [];
};
const getPlaceholder = computed(() => {
  // console.log(blockList.length);
  if (blockList.value.length == 0) {
    return "無區塊";
  }
  return "請選擇";
});
</script>
