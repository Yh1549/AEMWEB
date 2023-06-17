<template>
  <div
    class="w-full h-full transition-transform duration-500 absolute py-8"
    :class="userStore.userUpdateToggle ? '' : '-translate-x-[100%]'"
  >
    <component
      :is="userStore.userCurrentUpdate"
      @checking="checkingEmit"
    ></component>
    <loadSpinner>
      <template #title>儲存中</template>
    </loadSpinner>
    <div
      v-if="!Store.loadingSpinner"
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
  </div>
</template>
<script setup>
import { ref } from "vue";
import { SelectAboutUser, UpdateUser } from "../../api/service";
import { useStore, useUserStore } from "../../store/store";
import loadSpinner from "../loadSpinner.vue";
const Store = useStore();
const userStore = useUserStore();
const checking = ref({});

const backToEdit = () => {
  userStore.userModify = {
    empid: userStore.userEdit.empid,
  };
  userStore.userUpdateToggle = !userStore.userUpdateToggle;
};
const checkingEmit = (value) => {
  checking.value = value;
};
const validCheck = () => {
  if (checking.value.pass != true) {
    return false;
  }
  return true;
};
const updateUser = async () => {
  let res = await UpdateUser(userStore.userModify);
  if (res.desc == "successful") {
    Store.alertShow = true;
    Store.alertObj = {
      msg: `修改成功`,
      func: async (e) => {
        userStore.userUpdateToggle = !userStore.userUpdateToggle;
      },
    };
  } else {
    Store.alertShow = true;
    Store.alertObj = {
      msg: `修改失敗，請重新再試,${res.desc}`,
      func: async (e) => {},
    };
  }
  Store.loadingSpinner = false;
  res = await SelectAboutUser(userStore.userEdit.empid);
  if (res.desc == "successful") {
    userStore.userEdit = res.resBody;
  }
  userStore.userModify = {
    empid: userStore.userEdit.empid,
  };
};
const updateUserBasic = async () => {
  if (validCheck()) {
    userStore.userModify.empid = userStore.userEdit.empid;
    Store.alertShow = true;
    Store.alertObj = {
      msg: "確定修改？",
      func: async (e) => {
        if (e.target.value === "confirm") {
          Store.loadingSpinner = true;
          updateUser();
        }
      },
    };
  } else {
    Store.alertShow = true;
    Store.alertObj = {
      msg: `請確認輸入資料是否正確`,
      func: async (e) => {},
    };
  }
};
</script>
