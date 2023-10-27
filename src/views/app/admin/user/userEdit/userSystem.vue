<template>
  <div class="bg-background mb-8">
    <span class="block py-4 opacity-50 font-bold"
      >使用者可以使用的系統，點選以<span
        class="text-primaryDark font-bold border-2 border-primary bg-secondaryLight p-1 rounded"
        >啟用</span
      >或<span
        class="text-primaryDark font-bold border-2 border-primary p-1 rounded"
        >關閉</span
      >該系統
    </span>
    <div
      class="w-full p-4 border-2 border-primaryLight rounded flex flex-wrap justify-center"
    >
      <label
        class="min-w-fit md:w-3/16 m-2 cursor-pointer border-2 rounded"
        :class="
          userActiveSystem.some((el) => el == Sys.name)
            ? 'border-primaryDark bg-secondaryLight/50'
            : 'border-primaryLight'
        "
        v-for="Sys in Store.postOption.System"
      >
        <div class="flex">
          <span
            v-if="userActiveSystem.some((el) => el == Sys.name)"
            class="text-primaryDark text-2xl m-2"
          >
            <i class="fa-solid fa-circle-check"></i>
          </span>
          <span v-else class="text-primaryLight text-2xl m-2">
            <i class="fa-regular fa-circle-check"></i>
          </span>

          <span
            v-if="userActiveSystem.some((el) => el == Sys.name)"
            class="opacity-50 font-bold self-center"
            >啟用中</span
          >
          <span v-else class="opacity-50 font-bold self-center">未啟用</span>
          <input
            hidden
            :disabled="!Store.getSvcAuth('UpdateUser')"
            type="checkbox"
            :value="Sys.name"
            v-model="userActiveSystem"
          />
        </div>
        <span class="ml-2 font-bold">{{ Sys.memo }}</span>
      </label>
    </div>
    <loadSpinner>
      <template #title>儲存中</template>
    </loadSpinner>
    <div v-if="Store.getSvcAuth('UpdateUser')" class="flex justify-center mt-8">
      <button
        class="btn btnClick bg-cancel mr-8"
        @click="resetUserActiveSystem"
      >
        取消變更
      </button>
      <button
        class="btn btnClick bg-primaryDark ml-8"
        @click="updateUserActiveSystem"
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
import { findSysList } from "../../../../../api/service";
import { useCommonStore } from "../../../../../store/commonStore";
import { useStore, useUserStore } from "../../../../../store/store";
const Store = useStore();
const userStore = useUserStore();
const commonStore = useCommonStore();
const route = useRoute();
const router = useRouter();

const userSystemList = ref([]);
const userActiveSystem = ref([]);
const updateUserActiveSystem = async () => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定修改「${userStore.userEdit.name}」的可用系統嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        Store.loadingSpinner = true;
        let res = await apiRequest.post("CreateUserSystem", {
          empId: route.params.userId,
          system: userActiveSystem.value,
        });
        if (res.desc == "successful") {
          Store.loadingSpinner = false;
          router.push({
            name: "SvcSucess",
          });
        } else {
          commonStore.SvcFail.msg = res.desc;
          router.push({
            name: "SvcFail",
          });
        }
      }
    },
  };
};
const resetUserActiveSystem = async () => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定取消變更「${userStore.userEdit.name}」的可用系統嗎？`,
    func: async (e) => {
      let res = await apiRequest.post("FindEmpIdSystem", {
        empId: route.params.userId,
      });
      if (res.desc == "successful") {
        if (res.resBody.system == null) {
          userActiveSystem.value = [];
        } else {
          userActiveSystem.value = res.resBody.system;
        }
      }
    },
  };
};
onBeforeMount(async () => {
  findSysList();
  let res = await apiRequest.post("FindEmpIdSystem", {
    empId: route.params.userId,
  });
  if (res.desc == "successful") {
    if (res.resBody.system == null) {
      userActiveSystem.value = [];
    } else {
      userActiveSystem.value = res.resBody.system;
    }
  }
});
</script>
