<template>
  <button
    class="btn my-2"
    :class="historyToggle ? 'bg-secondaryDark' : ''"
    @click="historyToggle = !historyToggle"
  >
    審核歷程
  </button>
  <div
    class="overflow-hidden transition-all"
    :class="historyToggle ? 'h-full' : 'h-0'"
  >
    <listTable v-if="caseHistory?.length != 0">
      <template #th>
        <th class="text-start w-1/4">開始日期</th>
        <th class="text-start w-1/4">結束日期</th>
        <th class="text-start">操作類型</th>
        <th class="text-start">狀態</th>
        <th class="text-start">發布人</th>
      </template>
      <template #td>
        <tr class="bg-white" v-for="item of caseHistory">
          <td class="py-2">{{ item.startTime ?? "無" }}</td>
          <td>{{ item.endTime ?? "無" }}</td>
          <td>{{ getActionType(item.actionType) ?? "無" }}</td>
          <td>{{ getStatus(item.status) ?? "無" }}</td>
          <td>{{ item.name ?? "無" }}</td>
        </tr>
      </template>
    </listTable>
    <div
      v-else
      class="m-2 border-2 flex justify-center items-center rounded border-primaryDark h-24"
    >
      <span class="font-bold">無</span>
    </div>
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import apiRequest from "../api/apiRequest";
import listTable from "./listTable.vue";
const props = defineProps(["uuid"]);

const caseHistory = ref([]);
const historyToggle = ref(false);

watchEffect(() => {
  if (props.uuid) {
    apiRequest.post("FindTargetRefCase", { id: props.uuid }).then((res) => {
      caseHistory.value = res.resBody.caseList.sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );
    });
  }
});

const getActionType = (type) => {
  switch (type) {
    case "create":
      return "建檔";
    case "update":
      return "修改";
    case "hide":
      return "隱藏";
    case "recover":
      return "復原";
  }
};

const getStatus = (type) => {
  switch (type) {
    case "checking":
      return "審核中";
    case "end":
      return "已結案";
    case "deleted":
      return "已否決";
  }
};
</script>
