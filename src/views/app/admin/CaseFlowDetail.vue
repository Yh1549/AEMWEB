<template>
  <div class="rounded-t bg-primaryLight p-4">
    <div class="border-b-2 pb-1 border-white items-center">
      <span class="text-2xl font-bold mr-2">審核流程</span>

      <span class="font-bold mx-2 bg-secondaryLight rounded px-2">
        {{ Store.getRelSys(flowStore.caseDetail.relSys).memo }}/{{
          Store.getRelSys(flowStore.caseDetail.relSys).name
        }}
        <span class="text-sm">{{ flowStore.caseDetail.relSys }}</span>
      </span>
      <span class="font-bold bg-background rounded px-2">{{
        commonStore.caseType[flowStore.caseDetail?.type]?.title
      }}</span>
    </div>
    <div class="w-15/16 mx-auto">
      <div class="flex flex-wrap md:items-center flex-col my-2 md:flex-row">
        <span class="block font-bold">代號：</span>
        <span class="inpSpan">{{ flowStore.caseDetail.flow }}</span>
      </div>
      <div class="flex flex-wrap md:items-center flex-col my-2 md:flex-row">
        <span class="block font-bold">名稱：</span>
        <span class="inpSpan">{{ flowStore.caseDetail.memo }}</span>
      </div>
      <div class="flex flex-row md:items-center mt-2 md:justify-start">
        <span class="block font-bold">層級總數：</span>
        <span class="inpSpan w-7 text-center">{{
          flowStore.caseDetail.totalLevel
        }}</span>
      </div>
    </div>
  </div>
  <div
    class="w-fit p-2 rounded-t border-primaryDark/20 text-center font-bold box-border mr-1 border-t-2 border-l-2 border-r-2 bg-primaryDark text-white mt-6 text-2xl"
  >
    層級細節
  </div>
  <div class="flex flex-wrap border-2 border-primaryDark/20 py-3">
    <div
      class="w-full px-3 py-4 flex flex-wrap gap-3 md:grid md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="levelRole in flowStore.caseDetail.detailList"
        :key="levelRole"
        class="w-full p-3 bg-primaryLight/30 rounded border-2 border-primaryDark"
      >
        <div>
          <div class="mb-2 font-bold flex items-center">
            <div class="border-b-2 border-primary">
              層級 {{ levelRole.level }}
            </div>
          </div>
          <div class="flex flex-wrap justify-between">
            <span class="font-bold">審核代號：</span>
            <span class="ml-3">{{ levelRole.role }}</span>
          </div>
          <div class="flex flex-wrap justify-between">
            <span class="font-bold">審核角色：</span>
            <span class="ml-3">{{ levelRole.memo }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount } from "vue";
import { findSysList } from "../../../api/service";
import { useCommonStore } from "../../../store/commonStore";
import { useFlowStore, useStore } from "../../../store/store";
const Store = useStore();
const commonStore = useCommonStore();
const flowStore = useFlowStore();
onBeforeMount(async () => {
  await findSysList();
});
</script>
<style scoped>
.inpLabel {
  @apply border-b-2 border-white drop-shadow-sm w-fit md:mr-14;
}
.inpSpan {
  @apply bg-background rounded text-cancelDark p-1.5  ml-6 self-start md:self-center;
}
span {
  @apply break-all;
}
</style>
