<template>
  <div class="bg-background mb-8">
    <span class="block py-4 opacity-50 font-bold"
      >使用者可以使用的公告發布流程，點選以<span
        class="text-primaryDark font-bold border-2 border-primary bg-secondaryLight p-1 rounded"
        >啟用</span
      >或<span
        class="text-primaryDark font-bold border-2 border-primary p-1 rounded"
        >關閉</span
      >該流程
    </span>
    <div
      class="w-full p-4 border-2 border-primaryLight rounded flex flex-wrap justify-center"
    >
      <label
        class="min-w-fit md:w-3/16 m-2 cursor-pointer border-2 rounded"
        :class="
          userCaseFlow.some((el) => el == flow.flow)
            ? 'border-primaryDark bg-secondaryLight/50'
            : 'border-primaryLight'
        "
        v-for="flow in flowList"
      >
        <div class="flex">
          <span
            v-if="userCaseFlow.some((el) => el == flow.flow)"
            class="text-primaryDark text-2xl m-2"
          >
            <i class="fa-solid fa-circle-check"></i>
          </span>
          <span v-else class="text-primaryLight text-2xl m-2">
            <i class="fa-regular fa-circle-check"></i>
          </span>

          <span
            v-if="userCaseFlow.some((el) => el == flow.flow)"
            class="opacity-50 font-bold self-center"
            >已選取</span
          >
          <span v-else class="opacity-50 font-bold self-center">未選取</span>
          <input
            hidden
            :disabled="!Store.getSvcAuth('UpdateUser')"
            type="checkbox"
            :value="flow.flow"
            v-model="userCaseFlow"
          />
        </div>
        <case-card :key="flow" :flow="flow" />
      </label>
    </div>
    <loadSpinner>
      <template #title>儲存中</template>
    </loadSpinner>
    <div v-if="Store.getSvcAuth('UpdateUser')" class="flex justify-center mt-8">
      <button class="btn btnClick bg-cancel mr-8" @click="resetUserCaseFlow">
        取消變更
      </button>
      <button
        class="btn btnClick bg-primaryDark ml-8"
        @click="updateUserCaseFlow"
      >
        儲存變更
      </button>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiRequest from "../../../../../api/apiRequest";
import caseCard from "../../../../../components/CaseCard.vue";
import { useCommonStore } from "../../../../../store/commonStore";
import { useStore, useUserStore } from "../../../../../store/store";
const Store = useStore();
const userStore = useUserStore();
const commonStore = useCommonStore();
const route = useRoute();
const router = useRouter();
const flowList = ref([]);
const userCaseFlow = ref([]);
const updateUserCaseFlow = async () => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定修改「${userStore.userEdit.name}」的建檔流程嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        Store.loadingSpinner = true;
        const res = await apiRequest.post("CreateAndUpdateEmpCaseFlow", {
          empId: route.params.userId,
          choiceCaseFlowList: userCaseFlow.value,
        });
        Store.loadingSpinner = false;
        if (res.desc == "successful") {
          router.push({
            name: "SvcSucess",
          });
        } else {
          commonStore.SvcFail.msg = res.desc;
          if (res.code == "AMS208") {
            Store.alertShow = true;
            Store.alertObj = {
              msg:
                commonStore.SvcFail.msg +
                "。如果仍要新增，請清除「審核角色」裡的權限。",
              func: async (e) => {},
            };
          } else {
            router.push({
              name: "SvcFail",
            });
          }
        }
      }
    },
  };
};
const resetUserCaseFlow = async () => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定取消變更「${userStore.userEdit.name}」的建檔流程嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const caseRes = await apiRequest.post("FindEmpCaseFlowForEdit", {
          empId: userStore.userEdit.empid,
        });
        if (caseRes.desc == "successful") {
          useUserStore().caseFlow = caseRes.resBody.userCaseFlowList;
          userCaseFlow.value = userStore.caseFlow;
        }
      }
    },
  };
};
onBeforeMount(async () => {
  const res = await apiRequest.post("FindEmpCanApplyFlow", {
    empId: route.params.userId,
  });
  if (res.desc == "successful") {
    flowList.value = res.resBody.flowList;
  }
  const caseRes = await apiRequest.post("FindEmpCaseFlowForEdit", {
    empId: route.params.userId,
  });
  if (caseRes.desc == "successful") {
    useUserStore().caseFlow = caseRes.resBody.userCaseFlowList;
    userCaseFlow.value = userStore.caseFlow;
  }
});
</script>
