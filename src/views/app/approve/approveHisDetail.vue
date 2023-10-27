<template>
  <loadSpinner>
    <template #title>載入中</template>
  </loadSpinner>
  <div class="w-full">
    <div class="flex justify-between w-full">
      <div class="grid grid-cols-3 gap-x-2 text-center">
        <span class="font-bold rounded p-2 bg-primaryDark text-white">{{
          commonStore.caseType[Store.approveCase?.type]?.title
        }}</span>
        <span
          class="font-bold text-white rounded p-2"
          :class="commonStore.actionType[Store.approveCase?.actionType]?.color"
        >
          {{ commonStore.actionType[Store.approveCase?.actionType]?.title }}
        </span>
        <span
          class="font-bold rounded p-2"
          :class="commonStore.caseStatus[Store.approveCase.caseStatus]?.color"
          >{{
            commonStore.caseStatus[Store.approveCase.caseStatus]?.title
          }}</span
        >
      </div>
      <div class="flex items-center">
        <span>審核流程：</span>
        <span class="font-bold mr-10">{{ Store.approveCase?.flow }}</span>
        <span>目前層級/總層級：</span>
        <span class="font-bold">
          {{ Store.approveCase?.nowLevel }}/{{
            Store.approveCase?.totalLevel
          }}</span
        >
      </div>
    </div>
    <div class="flex gap-x-10 my-3">
      <p>審核開始日期：{{ Store.approveCase.startTime }}</p>
      <p>審核結案日期：{{ Store.approveCase.endTime ?? "-" }}</p>
    </div>
    <hr class="my-3" />
    <div
      class="grid grid-cols-2 mb-2"
      v-if="Store.approveCase?.actionType == 'update'"
    >
      <p class="font-bold">修改前：</p>
      <p class="font-bold">修改後：</p>
    </div>
    <div
      :class="
        Store.approveCase?.actionType == 'update' ? 'grid grid-cols-2' : ''
      "
    >
      <div class="border-r" v-if="Store.approveCase?.actionType == 'update'">
        <caseDetailTitle :caseDetail="Store.originalDetail"></caseDetailTitle>
        <caseDetailContent
          :caseDetail="Store.originalDetail"
        ></caseDetailContent>
      </div>
      <div>
        <caseDetailTitle :caseDetail="Store.approveDetail"></caseDetailTitle
        ><caseDetailContent
          :caseDetail="Store.approveDetail"
        ></caseDetailContent>
      </div>
    </div>
    <caseDetailSign></caseDetailSign>
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import apiRequest from "../../../api/apiRequest";
import {
  CaseDetail,
  FindCaseSignMsgLog,
  findPostTag,
  findSysList,
} from "../../../api/service";
import caseDetailContent from "../../../components/approve/caseDetailContent.vue";
import caseDetailSign from "../../../components/approve/caseDetailSign.vue";
import caseDetailTitle from "../../../components/approve/caseDetailTitle.vue";
import { useCommonStore } from "../../../store/commonStore";
import { useAdStore, useStore } from "../../../store/store";
const commonStore = useCommonStore();
const Store = useStore();
const adStore = useAdStore();
const route = useRoute();
const sign = ref({});
sign.value = Store.caseSign;
onBeforeMount(async (from) => {
  Store.loadingSpinner = true;
  findSysList();
  Store.originalDetail = [];
  const detailRes = await CaseDetail(route.params.caseUuid);
  if (detailRes.desc == "successful") {
    Store.loadingSpinner = false;
    Store.approveCase = detailRes.resBody;
  } else {
  }
  await FindCaseSignMsgLog(route.params.caseUuid);
  if (Store.approveCase.postDetail) {
    Store.approveDetail = Store.approveCase.postDetail;
    Store.originalDetail = Store.approveCase.originalPostDetail;
    if (Store.approveDetail.postTag != "null") {
      findPostTag(Store.approveDetail.relSys);
    }
  } else if (Store.approveCase.advertiseDetail) {
    Store.approveDetail = Store.approveCase.advertiseDetail;
    Store.originalDetail = Store.approveCase.originalAdvertiseDetail;
    await apiRequest
      .post("FindSystemBlock", { system: Store.approveDetail.system })
      .then((res) => {
        if (res.desc == "successful") {
          adStore.adBlockList = res.resBody.blockModelList;
        }
      })
      .catch();
  }
  const flow = Store.approveCase.flow;
  const flowDet = await apiRequest.post("FindCaseFlowAndDetail", { flow });
  if (flowDet.desc == "successful") {
    Store.approveCase.flow = flowDet.resBody.memo;
  } else {
  }
});
</script>
