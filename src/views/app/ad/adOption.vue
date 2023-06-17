<template>
  <!-- 選擇系統 -->
  <div class="flex gap-8 mx-auto w-1/2">
    <div class="flex items-center">
      <select
        class="inpLabel w-full"
        v-model="selectedSys"
        @change="getSelectSys"
      >
        <option disabled value="null">請選擇您所發布的系統</option>
        <option
          v-for="item in Store.postOption.System"
          :key="item.name"
          :value="item"
        >
          {{ item.memo }}
        </option>
      </select>
    </div>
    <div class="w-1/2 h-24 p-2 rounded my-2 bg-primaryDark">
      <p class="opacity-70 text-primaryLight text-sm">系統代號 :</p>
      <p class="text-white font-bold md:text-lg">
        {{ selectedSys?.name }}
      </p>
      <p class="text-white">{{ selectedSys?.memo }}</p>
    </div>
  </div>
  <!-- 系統區塊 -->
  <div
    class="flex md:mx-auto overflow-hidden relative border-primaryDark border-2 rounded min-h-[400px]"
  >
    <div
      ref="blockList"
      class="p-2 w-full transition-transform duration-500 flex flex-col"
    >
      <div class="flex justify-between">
        <p class="opacity-70 font-bold">
          *在此查看或編輯{{ selectedSys?.memo }}的區塊列表
        </p>
        <button
          v-if="selectedSys && Store.getSvcAuth('CreateBlock')"
          class="btn btnClick bg-submit"
          @click="createPanelToggle"
        >
          新增
        </button>
      </div>
      <loadSpinner>
        <template #title>載入中</template>
      </loadSpinner>
      <div class="flex flex-wrap justify-start">
        <div
          class="w-3/16 bg-primaryDark shadow-md relative rounded p-2 m-2 text-white"
          v-for="item in adBlockList"
          :key="item"
        >
          <span class="text-sm text-primaryLight">區塊名稱與代號 : </span>
          <p class="mx-auto font-bold text-2xl">
            {{ item.memo }}
          </p>
          <p class="mx-auto font-bold">{{ item.block }}</p>
          <button
            v-if="Store.getSvcAuth('DeleteBlock')"
            :value="[item.block, item.memo]"
            class="shadow-sm m-1 p-1 text-sm bg-cancel rounded absolute top-0 right-0 text-white hover:shadow-md"
            @click="deleteAdBlock"
          >
            <i class="fa-solid fa-trash"></i>
            刪除
          </button>
        </div>
      </div>
    </div>
    <div
      ref="createPanel"
      class="w-full transition-transform duration-500 absolute translate-x-[100%] p-2"
    >
      <p class="opacity-70 font-bold mx-auto">新增新的區塊</p>
      <div
        class="flex flex-wrap justify-center gap-4 border-2 rounded border-primaryDark py-4 bg-white"
      >
        <div class="my-2">
          <span class="block">區塊代號</span>
          <label class="inpLabel">
            <input
              type="text"
              class=""
              v-verify:[blockValidArg]="newAreaChecking.block"
              v-model="newAdvertiseArea.block"
          /></label>
        </div>
        <div class="my-2">
          <span class="block">區塊名稱</span>
          <label class="inpLabel">
            <input
              type="text"
              class=""
              v-verify:[memoValidArg]="newAreaChecking.memo"
              v-model="newAdvertiseArea.memo"
          /></label>
        </div>
      </div>
      <div class="w-full flex justify-evenly mt-8">
        <button class="btn btnClick bg-cancel" @click="createPanelToggle">
          返回
        </button>
        <button class="btn btnClick" @click="createAdvertiseBlock">
          確認新增
        </button>
      </div>
      <div v-if="createErrorMsg" class="mx-auto my-2">
        <span class="font-bold text-cancel">新增失敗，請確認欄位</span>
      </div>
    </div>
  </div>
  <!-- 新增 -->
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import apiRequest from "../../../api/apiRequest";
import { findSysList } from "../../../api/service";
import { useAdStore, useStore } from "../../../store/store";
const Store = useStore();
const adStore = useAdStore();

const selectedSys = ref(null);
const blockList = ref(null);
const createPanel = ref(null);
const adBlockList = ref([]);
//
const newAdvertiseArea = ref({
  system: null,
  block: null,
  memo: null,
});
const newAreaChecking = ref({
  block: { pass: null, msg: null },
  memo: { pass: null, msg: null },
});
const blockValidArg = ["notNull", "charMax(40)"];
const memoValidArg = ["notNull", "charMax(40)"];
//
const createErrorMsg = ref(false);

const createPanelToggle = () => {
  if (Store.getSvcAuth("CreateBlock") === true) {
    blockList.value.classList.toggle("-translate-x-[100%]");
    createPanel.value.classList.toggle("translate-x-[100%]");
  }
};

const getSelectSys = () => {
  Store.loadingSpinner = true;
  apiRequest
    .post("FindSystemBlock", { system: selectedSys.value.name })
    .then((res) => {
      Store.loadingSpinner = false;
      if (res.desc == "successful") {
        adBlockList.value = res.resBody.blockModelList;
      }
    })
    .catch();
};
const delBlockApi = async (block, memo) => {
  let res = await apiRequest.post("DeleteBlock", {
    system: selectedSys.value.name,
    block: block,
  });
  if (res.desc == "successful") {
    findSystemBlock();
    Store.alertShow = true;
    Store.alertObj = {
      msg: `刪除成功`,
      func: (e) => {},
    };
  } else {
    Store.alertShow = true;
    Store.alertObj = {
      msg: `刪除失敗`,
      func: (e) => {},
    };
  }
};

const deleteAdBlock = (e) => {
  let block = e.target.value.split(",")[0];
  let memo = e.target.value.split(",")[1];
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定刪除${selectedSys.value.name}的${memo}區塊?`,
    func: (e) => {
      if (e.target.value == "confirm") {
        delBlockApi(block, memo);
      }
    },
  };
};
const findSystemBlock = async () => {
  let res = await apiRequest.post("FindSystemBlock", {
    system: selectedSys.value.name,
  });
  if (res.desc == "successful") {
    adBlockList.value = res.resBody.blockModelList;
  }
};
const createBlock = async () => {
  let res = await apiRequest.post("CreateBlock", newAdvertiseArea.value);
  if (res.desc == "successful") {
    findSystemBlock();
    blockList.value.classList.toggle("-translate-x-[100%]");
    createPanel.value.classList.toggle("translate-x-[100%]");
  } else {
    createErrorMsg.value = true;
  }
};
const createAdvertiseBlock = () => {
  newAdvertiseArea.value.system = selectedSys.value.name;
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確認新增區塊?`,
    func: (e) => {
      if (e.target.value == "confirm") {
        createBlock();
      }
    },
  };
};
onBeforeMount(async () => {
  adStore.$reset();
  await findSysList();
});
</script>
