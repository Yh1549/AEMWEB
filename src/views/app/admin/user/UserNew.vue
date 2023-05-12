<template>
  <div class="w-full flex justify-evenly bg-primary rounded-t py-4">
    <newStepHeader
      v-for="(item, index) in newTitle.list"
      :stepValue="[item.name, index]"
    >
      <template #title> {{ item.title }} </template>
    </newStepHeader>
  </div>
  <keep-alive>
    <component :is="getNewTitle"></component>
  </keep-alive>
</template>
<script setup>
import { userStore, Store } from "../../../../store/store";
import { onBeforeMount, computed, shallowRef, markRaw } from "vue";
import usernewBasic from "../../../../components/user/userNewBasic.vue";
import usernewAuth from "../../../../components/user/userNewAuth.vue";
import usernewConfirm from "../../../../components/user/userNewConfirm.vue";
import userNewRange from "../../../../components/user/userNewRange.vue";
import newStepHeader from "../../../../components/newStepHeader.vue";
import {
  SelectDept,
  SelectSvcSchema,
  checkRangeValid,
} from "../../../../api/service";
const newTitle = shallowRef([]);
const getNewTitle = computed(() => {
  for (let item in newTitle.value.list) {
    if (Store().currentNewStep == newTitle.value.list[item].name) {
      newTitle.value.com = newTitle.value.list[item].com;
    }
  }
  return newTitle.value.com;
});

onBeforeMount(async () => {
  userStore().$reset();
  await SelectDept();
  await SelectSvcSchema();
  let res = await checkRangeValid();
  if (res.desc == "successful") {
    if (res.resBody.rangeValid == "true") {
      userStore().userRangeAll = res.resBody.rangeList;
      userStore().userRangeValid = res.resBody.rangeValid;
      // new step init
      newTitle.value = {
        com: usernewBasic,
        list: [
          {
            name: "usernewBasic",
            title: "基本資料",
            com: markRaw(usernewBasic),
          },
          { name: "usernewAuth", title: "權限設定", com: markRaw(usernewAuth) },
          {
            name: "userNewRange",
            title: "管理範圍",
            com: markRaw(userNewRange),
          },
          {
            name: "usernewConfirm",
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
            name: "usernewBasic",
            title: "基本資料",
            com: markRaw(usernewBasic),
          },
          { name: "usernewAuth", title: "權限設定", com: markRaw(usernewAuth) },
          {
            name: "usernewConfirm",
            title: "資料確認",
            com: markRaw(usernewConfirm),
          },
        ],
      };
    }
    Store().currentNewStep = newTitle.value.list[0].name;
  }
});
</script>
<style scoped>
.stepStatus {
  @apply w-1/2 rounded px-2 my-2 font-bold text-center;
}
</style>
