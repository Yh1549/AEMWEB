<template>
  <div class="flex md:justify-evenly px-8 pt-8 md:px-4">
    <div class="rounded bg-white shadow-md w-full mb-4 md:w-4/16 mx-2 relative">
      <p class="font-bold text-center py-2 mb-2 bg-primaryLight">
        單位經辦/公告發布人
      </p>
      <p class="font-bold text-center text-2xl">
        {{ Store().approveCase.applicantName }}
      </p>
      <p class="font-bold text-center mb-1 text-cancel">
        {{ Store().approveCase.startTime }}
      </p>
    </div>
    <!-- {{  Store().caseSign }} -->
    <div
      v-for="i in Store().caseSign"
      :key="i"
      class="rounded bg-white shadow-md w-full mb-4 mx-2 md:w-4/16 relative"
    >
      <p
        class="font-bold text-center py-2 mb-2 bg-primaryLight"
        :class="i.positionType == 'reject' ? 'bg-cancelLight' : ''"
      >
        第{{ i.level }}層覆核人員
      </p>
      <p class="font-bold text-center text-2xl">
        {{ i.name }}
      </p>
      <p class="font-bold text-center mb-1 text-cancel">
        {{ i.time }}
      </p>
      <div
        class="absolute top-1/2 left-1/2 border-4 border-dashed text-cancel/40 border-cancel/40 text-5xl w-[90%] h-[80%] flex justify-around items-center font-bold -translate-x-1/2 -translate-y-1/2"
        v-if="i.positionType == 'reject'"
      >
        <span class="font-bold">退</span><span class="font-bold">件</span>
      </div>
    </div>
    <div
      v-for="i in Store().approveCase.totalLevel"
      v-show="i > Store().caseSign.length"
      :key="i"
      class="rounded bg-white shadow-md w-full mb-4 mx-2 md:w-4/16 relative"
    >
      <p
        class="font-bold text-center py-2 mb-2"
        :class="
          i == Store().approveCase.nowLevel
            ? 'bg-submit text-white'
            : 'bg-gray-300'
        "
      >
        第{{ i }}層覆核人員
      </p>
      <p class="font-bold text-center text-2xl">
        {{ i.name }}
      </p>
      <p class="font-bold text-center mb-1">
        {{ i.time }}
      </p>
    </div>
  </div>
  <div
    class="pb-8 mx-auto flex justify-evenly w-full"
    v-if="Store().approveSign"
  >
    <button
      v-if="Store().getSvcAuth('RejectCase')"
      class="btn btnClick w-1/4 md:w-1/6 bg-cancel font-bold"
      @click="disapprove"
    >
      {{ buttonSpinnerReject ? "" : "退件" }}
      <i v-if="buttonSpinnerReject" class="fa-solid fa-spinner fa-spin"></i>
    </button>
    <button
      v-if="Store().getSvcAuth('CheckCaseAndRelease')"
      class="btn btnClick w-1/4 md:w-1/6 bg-submit font-bold"
      @click="approve"
    >
      {{ buttonSpinnerApprove ? "" : "通過審核並蓋章" }}
      <i v-if="buttonSpinnerApprove" class="fa-solid fa-spinner fa-spin"></i>
    </button>
  </div>
</template>
<script setup>
import { Store, postStore } from "../../store/store";
import { useRouter, useRoute } from "vue-router";
import { ref, onBeforeMount } from "vue";
import apiRequest from "../../api/apiRequest";
import { commonStore } from "../../store/commonStore";
const buttonSpinnerApprove = ref(false);
const buttonSpinnerReject = ref(false);
const route = useRoute();
const sign = ref({});
sign.value = Store().caseSign;
const router = useRouter();
const id = route.params.caseUuid;
const reSign = Store().caseSign.length;

const approve = () => {
  Store().alertShow = true;
  buttonSpinnerApprove.value = true;
  Store().alertObj = {
    msg: "確定要通過審核嗎？",
    func: async (e) => {
      if (e.target.value === "confirm") {
        await apiRequest
          .post("CheckCaseAndRelease", { caseUuid: id })
          .then((res) => {
            buttonSpinnerApprove.value = false;
            if (res.desc == "successful") {
              Store().routerPush = "approveAll";
              router.push({
                name: "SvcSucess",
              });
            } else {
              commonStore().SvcFail.msg = res.desc;
              router.push({
                name: "SvcFail",
              });
            }
          })
          .catch();
      } else {
        buttonSpinnerApprove.value = false;
      }
    },
  };
};
const disapprove = () => {
  // 退件
  Store().alertShow = true;
  buttonSpinnerReject.value = true;
  Store().alertObj = {
    msg: "確定要退件嗎？",
    func: async (e) => {
      if (e.target.value === "confirm") {
        buttonSpinnerReject.value = false;
        await apiRequest
          .post("RejectCase", { caseUuid: id })
          .then((res) => {
            if (res.desc == "successful") {
              Store().routerPush = "approveAll";
              router.push({ name: "SvcSucess" });
            } else {
              commonStore().SvcFail.msg = res.desc;
              router.push({ name: "SvcFail" });
            }
          })
          .catch();
      } else {
        buttonSpinnerReject.value = false;
      }
    },
  };
};
onBeforeMount(async () => {});
</script>
