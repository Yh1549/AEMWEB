<template>
  <div class="w-full flex justify-evenly bg-primary rounded-t py-4">
    <newStepHeader
      v-for="(item, index) in newTitle.list"
      :stepValue="[item, index]"
      :currentStep="currentStep"
    >
    </newStepHeader>
  </div>
  <keep-alive>
    <component :is="getNewTitle" :newUser="newUser" @toNext="toNext"></component
  ></keep-alive>
</template>
<script setup>
import { computed, markRaw, onBeforeMount, ref, shallowRef } from "vue";
import {
  SelectDept,
  SelectSvcSchema,
  checkRangeValid,
} from "../../../../api/service";
import newStepHeader from "../../../../components/newStepHeader.vue";
import usernewAuth from "../../../../components/user/userNewAuth.vue";
import usernewBasic from "../../../../components/user/userNewBasic.vue";
import usernewConfirm from "../../../../components/user/userNewConfirm.vue";
import userNewRange from "../../../../components/user/userNewRange.vue";
import { useStore, useUserStore } from "../../../../store/store";
const Store = useStore();
const userStore = useUserStore();
const currentStep = ref("basic");
const newTitle = shallowRef([]);
const rangeValid = ref(false);
const newUser = ref({
  name: null,
  empid: null,
  mima: null,
  memo: null,
  deptcode: null,
  // email: null,
  // title: null,
  authority: [],
  range: [],
  sets: [],
});
const toNext = (value, step) => {
  newUser.value = value;
  console.log(step);
  currentStep.value = step;
};
const getNewTitle = computed(() => {
  for (let item in newTitle.value.list) {
    if (currentStep.value == newTitle.value.list[item].name) {
      newTitle.value.com = newTitle.value.list[item].com;
      break;
    }
  }
  return newTitle.value.com;
});

onBeforeMount(async () => {
  userStore.$reset();
  await SelectDept();
  await SelectSvcSchema();
  let res = await checkRangeValid();
  if (res.desc == "successful") {
    rangeValid.value = res.resBody.rangeValid;
    if (res.resBody.rangeValid == "true") {
      userStore.userRangeAll = res.resBody.rangeList;
      userStore.userRangeValid = res.resBody.rangeValid;
      // new step init
      newTitle.value = {
        com: usernewBasic,
        list: [
          {
            name: "basic",
            title: "基本資料",
            com: markRaw(usernewBasic),
          },
          { name: "auth", title: "權限設定", com: markRaw(usernewAuth) },
          {
            name: "range",
            title: "管理範圍",
            com: markRaw(userNewRange),
          },
          {
            name: "confirm",
            title: "資料確認",
            com: markRaw(usernewConfirm),
          },
        ],
      };
    } else {
      newTitle.value = {
        com: usernewBasic,
        list: [
          {
            name: "basic",
            title: "基本資料",
            com: markRaw(usernewBasic),
          },
          { name: "auth", title: "權限設定", com: markRaw(usernewAuth) },
          {
            name: "confirm",
            title: "資料確認",
            com: markRaw(usernewConfirm),
          },
        ],
      };
    }
  }
});
</script>
