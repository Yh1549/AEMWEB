<template>
  <div class="w-full flex justify-evenly bg-primary rounded-t py-4">
    <newStepHeader
      v-for="(item, index) in newTitle.list"
      :stepValue="[item.name, index]"
    >
      <template #title> {{ item.title }} </template>
    </newStepHeader>
  </div>
  <component :is="getNewTitle"></component>
  <div
    class="flex justify-center my-4"
    v-if="Store().currentNewStep == 'adnewWrite'"
  >
    <button class="btn btnClick" @click="nextStep">下一步</button>
  </div>
  <div class="flex justify-evenly my-4" v-else>
    <button class="btn btnClick" @click="Store().currentNewStep = 'adnewWrite'">
      上一步
    </button>
    <button class="btn btnClick" @click="addNewAdvertise">確認送出</button>
  </div>
</template>
<script setup>
import apiRequest from "../../../api/apiRequest";
import adnewConfirm from "../../../components/ad/adNewConfirm.vue";
import adnewWrite from "../../../components/ad/adNewWrite.vue";
import newStepHeader from "../../../components/newStepHeader.vue";
import { Store, adStore } from "../../../store/store";
import { commonStore } from "../../../store/commonStore";
import { useRouter } from "vue-router";
import { onBeforeMount } from "@vue/runtime-core";
import { findSysList } from "../../../api/service";
import { shallowRef, markRaw, computed } from "vue";
const router = useRouter();

const newTitle = shallowRef({
  com: adnewWrite,
  list: [
    { name: "adnewWrite", title: "填寫資料", com: markRaw(adnewWrite) },
    { name: "adnewConfirm", title: "確認後送出", com: markRaw(adnewConfirm) },
  ],
});

const getNewTitle = computed(() => {
  for (let item in newTitle.value.list) {
    if (Store().currentNewStep == newTitle.value.list[item].name) {
      newTitle.value.com = newTitle.value.list[item].com;
    }
  }
  return newTitle.value.com;
});

const nextStep = () => {
  for (let item in adStore().newAdCheckList) {
    if (adStore().newAdCheckList[item] != null) {
      for (let i of adStore().newAdCheckList[item]) {
        if (i.result === false) {
          Store().alertShow = true;
          Store().alertObj = {
            msg: "輸入有誤，請重新檢查",
            func: (e) => {},
          };
          return false;
        }
      }
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "輸入有誤，請重新檢查是否有空白",
        func: (e) => {},
      };
      return false;
    }
  }
  Store().currentNewStep = "adnewConfirm";
};
const addNewAdvertise = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `確認新增此廣告嗎？`,
    func: (e) => {
      if (e.target.value === "confirm") {
        apiRequest
          .post("CreateAdvertise", adStore().newAd)
          .then((res) => {
            if (res.desc == "successful") {
              router.push({ name: "SvcSucess" });
            } else {
              commonStore().SvcFail.msg = res.desc;
              router.push({ name: "SvcFail" });
            }
          })
          .catch((e) => console.log(e));
      }
    },
  };
};
onBeforeMount(async () => {
  Store().currentNewStep = "adnewWrite";
  await findSysList();
  adStore().$reset();
});
</script>
