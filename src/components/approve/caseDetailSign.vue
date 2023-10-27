<template>
  <div class="flex md:justify-evenly px-8 pt-8 md:px-4">
    <div class="rounded bg-white shadow-md w-full mb-4 md:w-4/16 mx-2 relative">
      <p class="font-bold text-center py-2 mb-2 bg-primaryLight">
        單位經辦/公告發布人
      </p>
      <p class="font-bold text-center text-2xl">
        {{ Store.approveCase.applicantName }}
      </p>
      <p class="font-bold text-center mb-1 text-cancel">
        {{ Store.approveCase.startTime }}
      </p>
    </div>
    <!-- {{  Store.caseSign }} -->
    <div
      v-for="i in Store.caseSign"
      :key="i"
      class="rounded bg-white shadow-md w-full mb-4 mx-2 md:w-4/16 relative"
    >
      <p
        class="font-bold text-center py-2 mb-2 bg-primaryLight"
        :class="i.positionType == 'reject' ? 'bg-cancelLight' : ''"
      >
        第{{ i.level }}層覆核人員
      </p>
      <p class="font-bold text-center text-2xl">
        {{ i.name }}
      </p>
      <p class="font-bold text-center mb-1 text-cancel">
        {{ i.time }}
      </p>
      <div
        class="absolute top-1/2 left-1/2 border-4 border-dashed text-cancel/40 border-cancel/40 text-5xl w-[90%] h-[80%] flex justify-around items-center font-bold -translate-x-1/2 -translate-y-1/2"
        v-if="i.positionType == 'reject'"
      >
        <span class="font-bold">退</span><span class="font-bold">件</span>
      </div>
    </div>
    <div
      v-for="i in Store.approveCase.totalLevel"
      v-show="i > Store.caseSign.length"
      :key="i"
      class="rounded bg-white shadow-md w-full mb-4 mx-2 md:w-4/16 relative"
    >
      <p
        class="font-bold text-center py-2 mb-2"
        :class="
          i == Store.approveCase.nowLevel
            ? 'bg-submit text-white'
            : 'bg-gray-300'
        "
      >
        第{{ i }}層覆核人員
      </p>
      <p class="font-bold text-center text-2xl">
        {{ i.name }}
      </p>
      <p class="font-bold text-center mb-1">
        {{ i.time }}
      </p>
    </div>
  </div>
</template>
<script setup>
import { useStore } from "../../store/store";
const Store = useStore();
</script>
