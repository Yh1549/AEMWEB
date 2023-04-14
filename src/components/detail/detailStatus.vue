<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="font-bold">系統/類別或區域:</span>
    <span class="text-center">{{
      Store().getRelSys(Store().detailinfo?.relSys)
    }}</span>
    <span class="text-center">{{
      Store().getRelSys(Store().detailinfo?.system)
    }}</span
    >/
    <span v-if="Store().detailinfo.tag != 'default'" class="text-center">{{
      Store().getTag(Store().detailinfo?.tag)
    }}</span>
    <span>{{ adStore().getBlockMemo(Store().detailinfo?.block) }}</span>
    <span
      v-if="Store().detailinfo.status"
      class="btn inline-block text-center p-2 cursor-default"
      :class="commonStore().getCaseStatusName(Store().detailinfo.status).color"
    >
      {{ commonStore().getCaseStatusName(Store().detailinfo.status).title }}
    </span>
    <span
      v-if="Store().detailinfo.top && Store().detailinfo?.top == '1'"
      class="btn inline-block text-center p-2 cursor-default"
    >
      置頂
    </span>
  </div>
</template>
<script setup>
import { Store, adStore } from "../../store/store";
import { commonStore } from "../../store/commonStore";
</script>
