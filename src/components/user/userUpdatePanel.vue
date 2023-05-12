<template>
  <div
    class="w-full h-full transition-transform duration-500 absolute py-8"
    :class="userStore().userUpdateToggle ? '' : '-translate-x-[100%]'"
  >
    <component :is="userStore().userCurrentUpdate"></component>
    <loadSpinner>
      <template #title>儲存中</template>
    </loadSpinner>
    <div
      v-if="!Store().loadingSpinner"
      class="w-full flex justify-center gap-10 py-4"
    >
      <button
        class="btn btnClick bg-cancel text-sm md:text-base"
        @click="backToEdit"
      >
        <i class="fa-solid fa-arrow-left"></i>返回
      </button>
      <button
        class="btn btnClick bg-primaryDark text-sm md:text-base"
        @click="updateUserBasic"
      >
        儲存變更
      </button>
    </div>
    <span
      v-if="SvcMsg !== ''"
      class="font-bold block text-center text-sm md:text-lg w-1/2 mx-auto"
      :class="SvcMsg ? 'text-submit' : 'text-cancel'"
      >{{ SvcMsg ? "修改成功" : "修改失敗，請重新再試" }}</span
    >
  </div>
</template>
<script setup>
import { ref } from "vue";
import { Store, userStore } from "../../store/store";
import apiRequest from "../../api/apiRequest";
import { UpdateUser, SelectAboutUser } from "../../api/service";

import loadSpinner from "../loadSpinner.vue";

const SvcMsg = ref("");
const backToEdit = () => {
  SvcMsg.value = "";
  userStore().userModify = {
    empid: userStore().userEdit.empid,
  };
  userStore().userUpdateToggle = !userStore().userUpdateToggle;
};
const updateUserBasic = async () => {
  userStore().userModify.empid = userStore().userEdit.empid;
  Store().alertShow = true;
  Store().alertObj = {
    msg: "確定修改？",
    func: async (e) => {
      if (e.target.value === "confirm") {
        Store().loadingSpinner = true;
        let res = await UpdateUser(userStore().userModify);
        if (res.desc == "successful") {
          Store().loadingSpinner = false;
          await SelectAboutUser(userStore().userEdit.empid);
          userStore().userModify = {
            empid: userStore().userEdit.empid,
          };
          SvcMsg.value = true;
          // mimaInp.value = false;
        } else {
          Store().loadingSpinner = false;
          userStore().userModify = {
            empid: userStore().userEdit.empid,
          };
          SvcMsg.value = false;
        }
      }
    },
  };
};
</script>
