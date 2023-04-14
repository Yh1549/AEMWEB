<template>
  <div class="md:flex w-full justify-center">
    <!-- 系統 -->
    <div class="w-full md:w-4/16 p-2">
      <systemSelect :options="Store().postOption.System">
        <template #title>請先選擇一個系統</template>
      </systemSelect>
    </div>
    <div class="w-full md:w-4/16 p-2">
      <sysBlockSelec :options="adStore().adBlockList" :blockAdSvc="'blockAd'">
        <template #title>再選擇一個區塊</template>
      </sysBlockSelec>
    </div>
  </div>
  <span class="text-sm opacity-70">*選定系統與區塊後，即可編輯與查看廣告</span>
  <div>
    <div
      v-if="Store().loadingSpinner"
      class="text-center bg-gray-100 border-2 border-primary min-h-[50vh] flex justify-center items-center"
    >
      <span class="text-primaryDark text-[100px]">
        <i class="fa-solid fa-spinner fa-spin"></i>
      </span>
      <span class="mx-4 font-bold"> 載入中... </span>
    </div>
    <adAllList />
  </div>
  <div v-if="!Store().loadingSpinner">
    <no-result v-if="adStore().List.length == 0"></no-result>
  </div>
  <page-control :pageName="adStore().List"></page-control>
</template>
<script setup>
import { onBeforeMount } from "vue";
import { Store, adStore } from "../../../store/store";
import pageControl from "../../../components/pageControl.vue";
import NoResult from "../../../components/NoResultPage.vue";
import { findSysList } from "../../../api/service";
import adAllList from "../../../components/list/adAllList.vue";
import systemSelect from "../../../components/systemSelect.vue";
import sysBlockSelec from "../../../components/sysBlockSelec.vue";

onBeforeMount(async () => {
  await findSysList();
});
</script>
