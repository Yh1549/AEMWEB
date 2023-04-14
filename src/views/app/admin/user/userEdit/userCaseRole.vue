<template>
  <div class="bg-background mb-8">
    <span class="block py-4 opacity-50 font-bold"
      >查看或編輯不同的公告發布流程下，使用者可以審核的層級，選擇審核流程以<span
        class="text-primaryDark font-bold"
        >新增</span
      >或<span class="text-primaryDark font-bold">刪除</span>該角色</span
    >

    <div class="w-full p-4 border-2 border-primaryLight rounded">
      <div class="w-14/16 mx-auto">
        <div class="p-2 mb-2 border-2 border-primaryLight">
          <span class="block my-2"
            ><span class="btn cursor-default">
              {{ userStore().userEdit?.name }} </span
            >的角色列表，點選以移除該角色</span
          >
          <div class="w-full flex flex-wrap">
            <div
              v-for="item in userStore().userRoleList"
              class="bg-secondaryLight/70 border-2 border-primaryDark rounded p-2 m-1 flex flex-col"
              :key="item"
            >
              <span class="pointer-events-none text-sm"
                >{{ Store().getRoleName(item ?? [])?.total.memo }}的第{{
                  Store().getRoleName(item ?? [])?.detail.level
                }}層</span
              >
              <span class="pointer-events-none font-bold">{{
                Store().getRoleName(item ?? [])?.detail.role
              }}</span>
            </div>
          </div>
        </div>
        <div class="md:flex border-2 border-primaryLight">
          <!-- Left Side -->
          <div class="w-full md:w-7/16 p-2">
            <span class="font-bold">選擇審核流程</span>
            <div class="flex justify-between">
              <select
                class="inp w-full border-2 border-primaryDark p-2"
                v-model="chosenFlow"
                @change="FindCaseFlowAndDetail(chosenFlow)"
              >
                <option disabled>請選擇審核流程</option>
                <option
                  v-for="i in flowStore().caseflow"
                  :value="i.flow"
                  :key="i"
                >
                  {{ i.memo }}
                </option>
              </select>
            </div>
            <div
              class="w-full my-2 py-2 bg-primaryDark rounded flex z-50 shadow-md relative"
            >
              <span v-if="chosenFlow == ''" class="text-white m-2"
                >請先選擇您的<span class="font-bold">審核流程</span></span
              >
              <div v-else class="text-white my-auto ml-2 py-4">
                <span class="block font-bold text-sm">{{
                  flowStore().caseDetail.flow
                }}</span>
                <span class="block md:text-2xl font-bold">
                  {{ flowStore().caseDetail.memo }}
                </span>
                <span class="block font-bold text-sm my-2"
                  >流程共 {{ flowStore().caseDetail?.totalLevel }} 層</span
                >
              </div>
              <div class="h-12 absolute bottom-0 right-0 opacity-50">
                <img
                  src="../../../../../assets/caseflowimg-w.png"
                  class="w-16"
                />
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
                v-for="i in flowStore().caseDetail.detailList"
                class="md:w-7/16 mb-2 border-2 rounded hover:cursor-pointer hover:border-secondary"
                :class="
                  userStore()?.userRoleList.some((el) => el == i.role)
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
                        userStore()?.userRoleList.some((el) => el == i.role)
                          ? 'fa-solid'
                          : 'fa-regular'
                      "
                    ></i>
                  </span>
                  <input
                    hidden
                    :disabled="!Store().getSvcAuth('UpdateUser')"
                    type="checkbox"
                    :value="i.role"
                    v-model="userStore().userRoleList"
                  />
                  <span class="block text-sm md:text-base"
                    >第 {{ i.level }} 層審核角色：</span
                  >
                  <div class="flex flex-wrap">
                    <span class="font-bold text-sm md:text-base mr-2">{{
                      i.role
                    }}</span>
                    <span class="font-bold text-sm md:text-base">{{
                      i.memo
                    }}</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loadSpinner>
      <template #title>儲存中</template>
    </loadSpinner>
    <div
      v-if="Store().getSvcAuth('UpdateUser')"
      class="flex justify-center mt-4"
    >
      <button class="btn btnClick bg-cancel mr-8" @click="resetUserRole">
        重置
      </button>
      <button
        class="btn btnClick bg-primaryDark ml-8"
        @click="CreateAndUpdateEmpCaseRole"
      >
        儲存變更
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { flowStore, userStore, Store } from "../../../../../store/store";
import {
  FindAllCaseFlowAndDetail,
  FindCaseFlowAndDetail,
  FindEmpCaseRole,
} from "../../../../../api/service";
import apiRequest from "../../../../../api/apiRequest";
import { commonStore } from "../../../../../store/commonStore";
const route = useRoute();
const router = useRouter();
const chosenFlow = ref("");
const userRoleList = ref(userStore().userRoleList);
const CreateAndUpdateEmpCaseRole = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `確定更改「${userStore().userEdit.name}」的審核角色嗎？`,
    func: (e) => {
      if (e.target.value === "confirm") {
        Store().loadingSpinner = true;
        apiRequest
          .post("CreateAndUpdateEmpCaseRole", {
            empId: route.params.userId,
            choiceRoleList: userStore().userRoleList,
          })
          .then(async (res) => {
            Store().loadingSpinner = false;
            if (res.desc == "successful") {
              await apirequset
                .post("FindEmpCaseRole", { empId: userStore().userEdit.empid })
                .then((res) => {
                  if (res.desc === "successful") {
                    userStore().userRoleList = res.resBody.userRoleList;
                  }
                })
                .catch();
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
          .catch((error) => {});
      }
    },
  };
};
const flowShow = () => {
  if (flowStore().caseDetail.detailList != undefined) {
    if (flowStore().caseDetail.detailList.length == 0) {
      return true;
    } else {
      return false;
    }
  } else false;
};
const resetUserRole = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `確定重置「${
      userStore().userEdit.name
    }」的審核角色嗎？您所做的變更不會被儲存`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        await apiRequest
          .post("FindEmpCaseRole", { empId: userStore().userEdit.empid })
          .then((res) => {
            if (res.desc === "successful") {
              userStore().userRoleList = res.resBody.userRoleList;
            }
          })
          .catch();
      }
    },
  };
};
onBeforeMount(async () => {
  await FindAllCaseFlowAndDetail();
  if (
    userStore().userRoleList == null ||
    userStore().userRoleList.length == 0
  ) {
    let userRoleListRes = await FindEmpCaseRole(route.params.userId);
    if (userRoleListRes.desc === "successful") {
      userStore().userRoleList = userRoleListRes.resBody.userRoleList;
    }
  }
});
onBeforeUnmount(() => {
  flowStore().caseflow = [];
});
</script>
