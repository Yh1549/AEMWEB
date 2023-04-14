<template>
  <span class="block py-2 opacity-50 font-bold">確認使用者資料</span>
  <userInfoTemplate :infoObj="infoObj" class="shadow-md rounded">
    <template #userName>{{ userStore().newUser.name }}</template>
  </userInfoTemplate>
  <div
    class="w-full transition-transform duration-500 p-4 my-8 border-2 border-primaryLight rounded"
  >
    <span class="font-bold text-lg">權限</span>
    <span>{{ userStore().newUser.sets }}</span>
    <div class="w-full flex flex-wrap justify-evenly">
      <label
        v-for="(svc, index) in userStore().newUser.authority"
        :key="svc"
        class="w-full md:w-7/16 lg:w-5/16 p-3 m-2 border-2 rounded flex flex-wrap box-border hover:border-secondary border-primaryDark bg-secondaryLight/50"
      >
        <div class="flex">
          <i class="fa-solid fa-circle-check text-primaryDark text-[32px]"></i>
          <input
            type="checkbox"
            :key="index"
            :value="svc"
            v-model="userStore().newUser.authority"
            disabled
            hidden
          />
        </div>
        <div class="w-full flex flex-col mt-2">
          <span class="text-sm">#{{ Store().getSvc(svc)?.tag }}{{ svc }}</span>
          <span class="font-bold">{{ Store().getSvc(svc)?.svcName }}</span>
          <span class="font-bold">{{ Store().getSvc(svc)?.summary }}</span>
          <span class="text-sm opacity-80">{{
            Store().getSvc(svc)?.desc
          }}</span>
        </div>
      </label>
    </div>
  </div>
  <div class="flex justify-evenly mb-8">
    <button
      class="btn btnClick bg-primaryDark"
      @click="
        if (userStore().userRangeValid) {
          Store().currentNewStep = 'userNewRange';
        } else {
          Store().currentNewStep = 'usernewAuth';
        }
      "
    >
      上一步
    </button>
    <button class="btn btnClick bg-submit" @click="CreateUser">確認新增</button>
  </div>
</template>
<script setup>
import apiRequest from "../../api/apiRequest";
import { userStore, Store } from "../../store/store";
import { commonStore } from "../../store/commonStore";
import { useRouter } from "vue-router";
import userInfoTemplate from "./userInfoTemplate.vue";
import { provide, ref, computed } from "vue";
const router = useRouter();
const RangeOrNot = computed(() => {
  if (userStore().newUser.range?.length != 0) {
    return "是";
  } else {
    return "否";
  }
});
const infoObj = ref({
  rowTop: [
    {
      title: "員工編號",
      value: userStore().newUser.empid,
    },
    {
      title: "密碼",
      value: userStore().newUser.mima,
    },
  ],
  rowMiddle: [
    {
      title: "部門",
      value: Store().getDeptName(userStore().newUser.deptcode).name,
    },
    {
      title: "科別",
      value: Store().getDeptName(userStore().newUser.deptcode).unit,
    },
    {
      title: "是否為部門管理員",
      value: RangeOrNot,
    },
  ],
  rowBot: [{ title: "備註", value: userStore().newUser.memo }],
});
provide("infoObj", infoObj.value);
const CreateUser = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: "確定新增此使用者？",
    func: async (e) => {
      if (e.target.value === "confirm") {
        await apiRequest
          .post("CreateUser", userStore().newUser)
          .then((res) => {
            if (res.desc == "successful") {
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
      }
    },
  };
};
</script>
