<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="font-bold">系統/類別或區域:</span>
    <span class="text-center">{{
      Store.getRelSys(props.detailInfo?.relSys)
    }}</span>
    <span class="text-center">{{
      Store.getRelSys(props.detailInfo?.system)
    }}</span
    >/
    <span v-if="props.detailInfo.tag != 'default'" class="text-center">{{
      Store.getTag(props.detailInfo?.tag)
    }}</span>
    <span>{{ adStore.getBlockMemo(props.detailInfo?.block) }}</span>
    <span
      v-if="props.detailInfo.status"
      class="btn inline-block text-center p-2 cursor-default"
      :class="commonStore.getCaseStatusName(props.detailInfo.status).color"
    >
      {{ commonStore.getCaseStatusName(props.detailInfo.status).title }}
    </span>
    <span
      v-if="props.detailInfo.top && props.detailInfo?.top == '1'"
      class="btn inline-block text-center p-2 cursor-default"
    >
      置頂
    </span>
  </div>
</template>
<script setup>
import { useCommonStore } from "../../store/commonStore";
import { useAdStore, useStore } from "../../store/store";
const props = defineProps(["detailInfo"]);
const Store = useStore();
const adStore = useAdStore();
const commonStore = useCommonStore();
</script>
