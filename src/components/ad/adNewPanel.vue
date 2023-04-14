<template>
  <div>
    <div class="py-1">
      <span class="font-bold">開始日期 :</span>
      <label class="inpLabel ml-1 p-0">
        <input
          type="date"
          class="inp p-1"
          :min="Store().getToday()"
          name="startDate"
          data-valid-option="notNull,todayAfter"
          v-model="adStore().newAd.startDate"
          @change="InputValidation(adStore().newAdCheckList, $event)"
        />
      </label>
    </div>
    <div class="flex flex-wrap gap-2 items-center">
      <span class="font-bold">結束日期 :</span>
      <button
        class="btn"
        :class="foreverOnline ? 'bg-submit' : 'bg-gray-500'"
        @click="foreverOnlineToggle"
      >
        永久上架{{ foreverOnline ? "開啟" : "關閉" }}
      </button>
      <label v-if="!foreverOnline" class="inpLabel p-2 md:p-0">
        <input
          type="date"
          class="inp p-1"
          name="endDate"
          data-valid-option="notNull,"
          v-model="adStore().newAd.endDate"
          :disabled="adStore().newAd.startDate == null"
          :min="adStore().newAd.startDate"
          @change="InputValidation(adStore().newAdCheckList, $event)"
        />
      </label>
      <input type="checkbox" hidden v-model="foreverOnline" />
    </div>
    <span class="opacity-70 text-sm"
      >廣告發布的時間，以選擇當日00:00為發布時間</span
    >
  </div>
  <!-- 發布系統 -->
  <div class="w-full flex flex-wrap gap-2">
    <div class="w-full p-2 md:p-0">
      <label for="system" class="inpLabel w-full font-bold">
        <select
          class="inp block w-full"
          name="system"
          data-valid-option="notNull"
          v-model="adStore().newAd.system"
          @change="
            getSelectSys($event);
            InputValidation(adStore().newAdCheckList, $event);
            findFlow();
          "
        >
          <option disabled value="null">請選擇您所發布的系統</option>
          <option
            v-for="item in Store().postOption.System"
            :key="item.name"
            :value="item.name"
          >
            {{ item.memo }}
          </option>
        </select>
      </label>
    </div>
    <div class="w-full p-2 md:p-0">
      <label for="system" class="inpLabel w-full font-bold">
        <select
          class="inp block w-full"
          name="block"
          data-valid-option="notNull"
          v-model="selectedBlock"
          @change="
            InputValidation(adStore().newAdCheckList, $event);
            assignBlock($event);
          "
        >
          <option disabled value="null">請選擇廣告區塊</option>
          <option
            v-for="item in adStore().adBlockList"
            :key="item.block"
            :value="item"
          >
            {{ item.memo }}
          </option>
        </select>
      </label>
    </div>
  </div>
  <span class="opacity-70 text-sm">廣告發布的系統與位置 ex.個人銀行,數存</span>
  <div class="w-full">
    <span class="font-bold">超連結</span>
    <label class="inpLabel w-full">
      <input type="text" class="inp w-full" v-model="adStore().newAd.link" />
    </label>
    <span
      v-if="!getInputValidation(adStore().newAdCheckList.link).result"
      class="text-cancel font-bold"
      ><i class="fa-solid fa-circle-exclamation mx-2"></i
      >{{ getInputValidation(adStore().newAdCheckList.link).msg }}
    </span>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { adStore, Store, flowStore } from "../../store/store";
import apiRequest from "../../api/apiRequest";
import { FindEmpCaseFlowForCaseCreate } from "../../api/service";
import {
  InputValidation,
  getInputValidation,
  InputValidationContent,
} from "../../formValidation/inputCase";
const foreverOnline = ref(true);
const selectedBlock = ref(null);

const findFlow = async () => {
  flowStore().$reset();
  adStore().newAdCheckList.flow = null;
  const res = await FindEmpCaseFlowForCaseCreate("AD", adStore().newAd.system);
  if (res.desc == "successful") {
    flowStore().caseflow = res.resBody.flowList;
  }
};

const foreverOnlineToggle = () => {
  foreverOnline.value = !foreverOnline.value;
  if (foreverOnline.value) {
    adStore().newAd.endDate = "2099-01-01";
  } else {
    adStore().newAd.endDate = null;
  }
};
const assignBlock = (e) => {
  adStore().newAd.block = selectedBlock.value.block;
};
const getSelectSys = () => {
  apiRequest
    .post("FindSystemBlock", { system: adStore().newAd.system })
    .then((res) => {
      if (res.desc == "successful") {
        adStore().adBlockList = res.resBody.blockModelList;
        selectedBlock.value = null;
      }
    })
    .catch();
};
</script>
