<template>
  <!-- 新增審核流程Banner -->
  <router-link
    to="/CaseFlowNew"
    class="w-14/16 md:w-12/16 min-w-[270px] mb-8 mx-auto flex items-center justify-center bg-primaryDark border-4 rounded cursor-pointer transition-all group relative hover:border-secondaryDark"
    v-if="Store.getSvcAuth('CreateCaseFlowAndDetail')"
  >
    <!--加字記號-->
    <div
      class="text-white text-[80px] md:text-[96px] mr-2 relative group-hover:scale-105 transition-all"
    >
      <i class="fa-solid fa-plus"></i>
    </div>
    <!--加字記號-->
    <span class="text-white text-4xl font-bold ml-4 text-2xl"
      >新增審核流程</span
    >
    <div class="h-12 absolute bottom-3 right-0 opacity-50">
      <img src="../../../assets/caseflowimg-w.png" class="w-20" />
    </div>
  </router-link>
  <div v-for="sys in system">
    <span class="font-bold">
      {{ sys.memo }}
      <span class="text-sm ml-1">{{ sys.name }}</span
      >：
    </span>

    <div v-if="sys.flow.length == 0" class="my-6">
      <span>無</span>
    </div>
    <div v-else class="flex flex-wrap mx-auto">
      <case-card v-for="flow in sys.flow" :key="flow" :flow="flow" />
    </div>
  </div>
</template>

<script setup>
import caseCard from "../../../components/CaseCard.vue";
import { useFlowStore, useStore } from "../../../store/store";
const Store = useStore();
const flowStore = useFlowStore();
const system = Store.postOption.System;
const dataList = flowStore.caseflow;
system.forEach((e) => {
  e.flow = [];
  for (let i = 0; i < dataList.length; i++) {
    if (e.name == dataList[i].relSys) {
      e.flow.push(dataList[i]);
      dataList.splice(i, 1);
      i--;
    }
  }
});
</script>
<style scoped></style>
