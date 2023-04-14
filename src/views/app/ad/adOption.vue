<template>
  <!-- 選擇系統 -->
  <div class="w-full mx-auto md:w-4/16">
    <label for="system" class="font-bold">系統 :</label>
    <select
      class="inp block border-2 border-primaryDark p-2 my-2 w-full"
      v-model="selectedSys"
      @change="getSelectSys"
    >
      <option disabled value="null">請選擇您所發布的系統</option>
      <option
        v-for="item in Store().postOption.System"
        :key="item.name"
        :value="item"
      >
        {{ item.memo }}
      </option>
    </select>
    <div class="w-full p-2 rounded my-2 bg-primaryDark">
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
          v-if="selectedSys && Store().getSvcAuth('CreateBlock')"
          class="btn btnClick"
          @click="createPanelToggle"
        >
          新增
        </button>
      </div>
      <div
        v-if="Store().loadingSpinner"
        class="text-center flex justify-center items-center"
      >
        <span class="text-primaryDark text-[100px]">
          <i class="fa-solid fa-spinner fa-spin"></i>
        </span>
        <span class="mx-4 font-bold"> 載入中... </span>
      </div>
      <div class="flex flex-wrap justify-start">
        <div
          class="w-full md:w-5/16 bg-white border-2 border-primaryDark shadow-md relative rounded p-2 m-2 font-bold"
          v-for="item in adStore().adBlockList"
          :key="item"
        >
          <span class="opacity-70 text-sm text-primaryDark">區塊代號 :</span>
          <p class="mx-auto font-bold">{{ item.block }}</p>
          <p class="opacity-70 text-sm text-primaryDark">區塊名稱 :</p>
          <p class="mx-auto font-bold">{{ item.memo }}</p>
          <button
            v-if="Store().getSvcAuth('DeleteBlock')"
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
            <input type="text" class="" v-model="newAdvertiseArea.block"
          /></label>
        </div>
        <div class="my-2">
          <span class="block">區塊名稱</span>
          <label class="inpLabel">
            <input type="text" class="" v-model="newAdvertiseArea.memo"
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
import { Store, adStore } from "../../../store/store";
import { onBeforeMount, ref } from "vue";
import apiRequest from "../../../api/apiRequest";
import { findSysList } from "../../../api/service";
const selectedSys = ref(null);
const blockList = ref(null);
const createPanel = ref(null);
const newAdvertiseArea = ref({
  system: null,
  block: null,
  memo: null,
});
const createErrorMsg = ref(false);

const createPanelToggle = () => {
  if (Store().getSvcAuth("CreateBlock") === true) {
    blockList.value.classList.toggle("-translate-x-[100%]");
    createPanel.value.classList.toggle("translate-x-[100%]");
  }
};

const getSelectSys = () => {
  Store().loadingSpinner = true;
  apiRequest
    .post("FindSystemBlock", { system: selectedSys.value.name })
    .then((res) => {
      Store().loadingSpinner = false;
      if (res.desc == "successful") {
        adStore().adBlockList = res.resBody.blockModelList;
      }
    })
    .catch();
};

const deleteAdBlock = (e) => {
  let block = e.target.value.split(",")[0];
  let memo = e.target.value.split(",")[1];
  Store().alertShow = true;
  Store().alertObj = {
    msg: `確定刪除${selectedSys.value.name}的${memo}區塊?`,
    func: (e) => {
      if (e.target.value == "confirm") {
        apiRequest
          .post("DeleteBlock", {
            system: selectedSys.value.name,
            block: block,
          })
          .then(async (res) => {
            if (res.desc == "successful") {
              await apiRequest
                .post("FindSystemBlock", { system: selectedSys.value.name })
                .then((res) => {
                  if (res.desc == "successful") {
                    adStore().adBlockList = res.resBody.blockModelList;
                  }
                });
            } else {
              Store().alertShow = true;
              Store().alertObj = {
                msg: `刪除失敗`,
                func: (e) => {},
              };
            }
          });
      }
    },
  };
};

const createAdvertiseBlock = () => {
  newAdvertiseArea.value.system = selectedSys.value.name;
  Store().alertShow = true;
  Store().alertObj = {
    msg: `確認新增區塊?`,
    func: (e) => {
      apiRequest
        .post("CreateBlock", newAdvertiseArea.value)
        .then(async (res) => {
          if (res.desc == "successful") {
            await apiRequest
              .post("FindSystemBlock", { system: selectedSys.value.name })
              .then((res) => {
                if (res.desc == "successful") {
                  adStore().adBlockList = res.resBody.blockModelList;
                }
              });
            blockList.value.classList.toggle("-translate-x-[100%]");
            createPanel.value.classList.toggle("translate-x-[100%]");
          } else {
            createErrorMsg.value = true;
          }
        });
    },
  };
};
onBeforeMount(async () => {
  adStore().$reset();
  await findSysList();
});
</script>
