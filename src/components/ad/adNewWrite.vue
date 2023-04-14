<template>
  <div class="md:flex my-4 gap-2">
    <div
      class="w-1/2 flex flex-wrap p-4 border-2 border-primaryDark bg-white shadow-md rounded"
    >
      <adNewPanel></adNewPanel>
    </div>
    <div
      class="w-1/2 p-4 border-2 border-primaryDark bg-white rounded shadow-lg"
    >
      <span class="block font-bold">選擇建檔流程 :</span>
      <div class="flex flex-col md:flex-row">
        <div class="w-full md:w-1/2">
          <label class="inpLabel w-full">
            <select
              name="flow"
              class="w-full inp"
              data-valid-option="notNull"
              v-model="adStore().newAd.flow"
              @change="
                FindCaseFlowAndDetail(adStore().newAd.flow);
                InputValidation(adStore().newAdCheckList, $event);
              "
            >
              <option
                v-for="(item, index) in flowStore().caseflow"
                :value="item.flow"
                :key="index"
                :selected="index == 0"
              >
                {{ item.memo }}
              </option>
            </select>
          </label>

          <div
            class="w-full my-2 py-2 bg-primaryDark rounded flex z-50 shadow-md relative"
          >
            <span v-if="flowStore().caseflow.length == 0" class="text-white m-2"
              >注意!若此帳號沒有任何建檔流程，將無法新增公告</span
            >
            <span
              v-else-if="adStore().getCaseflow() == false"
              class="text-white m-2"
              >請先選擇您的<span class="font-bold">建檔流程</span></span
            >

            <div v-else class="text-white my-auto ml-2 py-4">
              <span class="block font-bold text-sm">{{
                flowStore().caseDetail.flow
              }}</span>
              <span class="block text-2xl font-bold">
                {{ flowStore().caseDetail.memo }}
              </span>
              <span class="block font-bold text-sm my-2"
                >流程共 {{ flowStore().caseDetail.totalLevel }} 層</span
              >
            </div>
            <div class="h-12 absolute bottom-0 right-0 opacity-50">
              <img src="../../assets/caseflowimg-w.png" class="w-16" />
            </div>
          </div>
          <span>*建檔流程為此則公告所需經過主管審查之流程</span>
        </div>
        <div class="w-full md:w-1/2 md:mx-2">
          <span v-if="flowStore().caseDetail.detailList" class="block"
            >此流程所包含的層級角色 :</span
          >
          <span v-if="flowStore().caseDetail.detailList?.length == 0"
            >此流程無任何層級角色</span
          >
          <div
            v-for="item in flowStore().caseDetail.detailList"
            :key="item"
            class="w-full bg-primaryDark rounded flex items-center mb-4"
          >
            <div
              class="rounded-full bg-secondaryDark w-[20px] h-[20px] m-2 flex justify-center items-center"
            >
              <span class="text-primaryDark font-bold">{{ item.level }}</span>
            </div>
            <div class="flex justify-between items-center w-full pr-2">
              <span class="text-white">{{ item.memo }}</span>
              <span class="text-primaryLight text-sm">{{ item.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full my-4">
    <adNewImg></adNewImg>
  </div>
  <div
    class="p-2 w-full border-2 border-primaryDark bg-white shadow-md rounded"
  >
    <adNewContent></adNewContent>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { flowStore, adStore } from "../../store/store";
import adNewPanel from "./adNewPanel.vue";
import adNewImg from "./adNewImg.vue";
import adNewContent from "./adNewContent.vue";
import { InputValidation } from "../../formValidation/inputCase";
import { FindCaseFlowAndDetail } from "../../api/service";
onMounted(() => {
  flowStore().caseDetail = {};
});
</script>
