<template>
  <loadSpinner>
    <template #title>載入中</template>
  </loadSpinner>
  <div class="grid gap-3">
    <div class="flex justify-between my-2">
      <div class="grid grid-cols-2 gap-x-2">
        <span
          class="font-bold rounded p-2"
          :class="commonStore().caseType[Store().approveCase?.type]?.color"
          >{{ commonStore().caseType[Store().approveCase?.type]?.title }}</span
        >
        <span
          class="font-bold text-white rounded p-2"
          :class="
            commonStore().actionType[Store().approveCase?.actionType]?.color
          "
        >
          {{ commonStore().actionType[Store().approveCase?.actionType]?.title }}
        </span>
      </div>
      <div class="flex items-center text-center">
        <span class="font-bold">審核流程：</span>
        <span class="font-bold text-white mx-2 bg-primaryDark rounded p-2">{{
          Store().approveCase?.flow
        }}</span>
        <span class="font-bold">目前層級：</span>
        <span
          class="font-bold w-10 h-10 justify-center mx-2 bg-secondaryLight rounded p-2"
        >
          {{ Store().approveCase?.nowLevel }}</span
        >
        <span class="font-bold">總層級：</span>
        <span
          class="font-bold w-10 h-10 justify-center text-white mx-2 bg-primaryDark rounded p-2"
        >
          {{ Store().approveCase?.totalLevel }}</span
        >
      </div>
    </div>
    <div class="grid grid-cols-3">
      <p>審核開始日期：{{ Store().approveCase.startTime }}</p>
      <p>審核結案日期：{{ Store().approveCase.endTime }}</p>
      <div>
        <span>審核狀態：</span>
        <span
          class="font-bold w-10 h-10 justify-center mx-2 rounded p-2"
          :class="
            commonStore().caseStatus[Store().approveCase.caseStatus]?.color
          "
          >{{
            commonStore().caseStatus[Store().approveCase.caseStatus]?.title
          }}</span
        >
      </div>
    </div>
    <hr class="mt-2" />
    <caseDetailTitle></caseDetailTitle>
    <caseDetailContent></caseDetailContent>
    <caseDetailSign></caseDetailSign>
  </div>
</template>
<script setup>
import { commonStore } from "../../../store/commonStore";
import { Store, adStore } from "../../../store/store";
import { useRoute } from "vue-router";
import { ref, onBeforeMount } from "vue";
import apiRequest from "../../../api/apiRequest";
import caseDetailTitle from "../../../components/approve/caseDetailTitle.vue";
import caseDetailContent from "../../../components/approve/caseDetailContent.vue";
import caseDetailSign from "../../../components/approve/caseDetailSign.vue";
import {
  CaseDetail,
  findPostTag,
  findSysList,
  FindCaseSignMsgLog,
} from "../../../api/service";
const route = useRoute();
const sign = ref({});
sign.value = Store().caseSign;
onBeforeMount(async () => {
  Store().loadingSpinner = true;
  findSysList();
  const detailRes = await CaseDetail(route.params.caseUuid);
  if (detailRes.desc == "successful") {
    Store().loadingSpinner = false;
    Store().approveCase = detailRes.resBody;
  } else {
  }
  await FindCaseSignMsgLog(route.params.caseUuid);
  if (Store().approveCase.postDetail) {
    Store().approveDetail = Store().approveCase.postDetail;
    if (Store().approveDetail.postTag != "null") {
      findPostTag(Store().approveDetail.relSys);
    }
  } else if (Store().approveCase.advertiseDetail) {
    Store().approveDetail = Store().approveCase.advertiseDetail;
    await apiRequest
      .post("FindSystemBlock", { system: Store().approveDetail.system })
      .then((res) => {
        if (res.desc == "successful") {
          adStore().adBlockList = res.resBody.blockModelList;
        }
      })
      .catch();
  }
  const flow = Store().approveCase.flow;
  const flowDet = await apiRequest.post("FindCaseFlowAndDetail", { flow });
  if (flowDet.desc == "successful") {
    Store().approveCase.flow = flowDet.resBody.memo;
  } else {
  }
});
</script>
