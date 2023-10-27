<template>
  <div class="bg-white mb-8">
    <span class="block py-4 opacity-50 font-bold"
      >查看或編輯不同的公告發布流程下，使用者可以審核的層級，選擇審核流程以<span
        class="text-primaryDark font-bold"
        >新增</span
      >或<span class="text-primaryDark font-bold">刪除</span>該角色</span
    >
    <div class="p-2 border-2 border-primaryDark rounded">
      <p class="block my-2">
        <span class="btn p-2 cursor-default">
          {{ userStore.userEdit?.name }} </span
        >的角色列表
      </p>
      <div v-if="userStore.userRoleList.length == 0">
        <span>無角色</span>
      </div>
      <div v-else class="w-full flex flex-wrap gap-2">
        <div
          v-for="flow in userStore.userRoleList"
          class="bg-secondaryLight border-2 border-primaryDark rounded p-2"
          :key="flow"
        >
          <p class="text-sm opacity-70">角色代碼 :</p>
          <p class="pointer-events-none font-bold w-36">{{ flow }}</p>
        </div>
      </div>
    </div>
    <div class="my-2 flex">
      <!-- Left Side -->
      <div class="md:w-7/16 p-2">
        <p class="font-bold">選擇審核流程</p>
        <label class="inpLabel w-full">
          <select
            class="inp w-full"
            v-model="chosenFlow"
            @change="FindCaseFlowAndDetail(chosenFlow)"
          >
            <option disabled>請選擇審核流程</option>
            <option v-for="i in flowList" :value="i.flow" :key="i">
              {{ i.memo }}
            </option>
          </select>
        </label>
        <div
          class="w-full my-2 p-2 h-32 bg-primaryDark rounded z-50 shadow-md relative"
        >
          <p v-if="chosenFlow == ''" class="text-white my-auto">
            請先選擇您的<span class="font-bold">審核流程</span>
          </p>
          <div v-else class="text-white p-2">
            <p class="font-bold text-sm">{{ currentFlow.flow }}</p>
            <p class="text-2xl font-bold">
              {{ currentFlow.memo }}
            </p>
            <p class="font-bold text-sm my-2">
              流程共 {{ currentFlow.totalLevel }} 層
            </p>
          </div>
          <div class="h-12 absolute bottom-0 right-0 opacity-50">
            <img src="../../../../../assets/caseflowimg-w.png" class="w-16" />
          </div>
        </div>
      </div>
      <!-- Right Side -->
      <div class="w-full md:w-9/16 p-2">
        <span class="font-bold">選擇審核角色</span>
        <div v-if="chosenFlow == ''" class="w-full">
          <span class="text-black/50 font-bold">
            請先選擇審核流程，再選擇流程的角色</span
          >
        </div>
        <div v-if="flowShow()" class="w-full">
          <span class="text-black/50 font-bold">此流程無審核角色</span>
        </div>
        <div class="w-full flex flex-wrap gap-x-4">
          <label
            v-for="i in flowStore.caseDetail.detailList"
            class="md:w-7/16 mb-2 border-2 rounded hover:cursor-pointer hover:border-secondary"
            :class="
              userStore?.userRoleList.some((el) => el == i.role)
                ? 'border-primaryDark bg-secondaryLight/50'
                : 'border-primaryLight'
            "
            :key="i"
          >
            <div class="p-2">
              <span class="text-primaryDark p-1">
                <i
                  class="fa-circle-check"
                  :class="
                    userStore?.userRoleList.some((el) => el == i.role)
                      ? 'fa-solid'
                      : 'fa-regular'
                  "
                ></i>
              </span>
              <input
                hidden
                :disabled="!Store.getSvcAuth('UpdateUser')"
                type="checkbox"
                :value="i.role"
                v-model="userStore.userRoleList"
              />
              <span class="block text-sm md:text-base"
                >第 {{ i.level }} 層審核角色：</span
              >
              <div class="flex flex-wrap">
                <span class="font-bold text-sm md:text-base mr-2">{{
                  i.role
                }}</span>
                <span class="font-bold text-sm md:text-base">{{ i.memo }}</span>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
    <loadSpinner>
      <template #title>儲存中</template>
    </loadSpinner>
    <div v-if="Store.getSvcAuth('UpdateUser')" class="flex justify-center mt-4">
      <button class="btn btnClick bg-cancel mr-8" @click="resetUserRole">
        取消變更
      </button>
      <button class="btn btnClick bg-primaryDark ml-8" @click="createCaseRole">
        儲存變更
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiRequest from "../../../../../api/apiRequest";
import {
  FindCaseFlowAndDetail,
  FindEmpCaseRole,
} from "../../../../../api/service";
import { useCommonStore } from "../../../../../store/commonStore";
import {
  useFlowStore,
  useStore,
  useUserStore,
} from "../../../../../store/store";
const Store = useStore();
const flowStore = useFlowStore();
const userStore = useUserStore();
const commonStore = useCommonStore();
const route = useRoute();
const router = useRouter();
const chosenFlow = ref("");
const flowList = ref([]);
const userRoleList = ref(userStore.userRoleList);
const createCaseRole = async () => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定更改「${userStore.userEdit.name}」的審核角色嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        Store.loadingSpinner = true;
        CreateAndUpdateEmpCaseRole();
      }
    },
  };
};
const CreateAndUpdateEmpCaseRole = async () => {
  let res = await apiRequest.post("CreateAndUpdateEmpCaseRole", {
    empId: route.params.userId,
    choiceRoleList: userStore.userRoleList,
  });
  if (res.desc == "successful") {
    router.push({
      name: "SvcSucess",
    });
    refreshCaseRole();
  } else {
    commonStore.SvcFail.msg = res.desc;
    if (res.code == "AMS208") {
      Store.alertShow = true;
      Store.alertObj = {
        msg:
          commonStore.SvcFail.msg +
          "。如果仍要新增，請清除「建檔流程」裡的權限。",
        func: async (e) => {},
      };
    } else {
      router.push({
        name: "SvcFail",
      });
    }
  }
  Store.loadingSpinner = false;
};
const refreshCaseRole = async () => {
  let res = await apiRequest.post("FindEmpCaseRole", {
    empId: userStore.userEdit.empid,
  });
  if (res.desc === "successful") {
    userStore.userRoleList = res.resBody.userRoleList;
  }
};
const flowShow = () => {
  if (flowStore.caseDetail.detailList != undefined) {
    if (flowStore.caseDetail.detailList.length == 0) {
      return true;
    } else {
      return false;
    }
  } else false;
};
const currentFlow = computed(() => {
  for (let item of flowList.value) {
    if (item.flow == chosenFlow.value) {
      return item;
    }
  }
});
const resetUserRole = () => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定取消變更「${userStore.userEdit.name}」的審核角色嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        await apiRequest
          .post("FindEmpCaseRole", { empId: userStore.userEdit.empid })
          .then((res) => {
            if (res.desc === "successful") {
              userStore.userRoleList = res.resBody.userRoleList;
            }
          })
          .catch();
      }
    },
  };
};
onBeforeMount(async () => {
  if (userStore.userRoleList == null || userStore.userRoleList.length == 0) {
    let userRoleListRes = await FindEmpCaseRole(route.params.userId);
    if (userRoleListRes.desc === "successful") {
      userStore.userRoleList = userRoleListRes.resBody.userRoleList;
    }
  }
  const res = await apiRequest.post("FindEmpCanApplyFlow", {
    empId: route.params.userId,
  });
  if (res.desc == "successful") {
    flowList.value = res.resBody.flowList;
  }
});
onBeforeUnmount(() => {
  flowStore.caseflow = [];
});
</script>
