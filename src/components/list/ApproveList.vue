<template>
  <listTable>
    <template #th>
      <th v-if="!postStore.historyCase">勾選</th>
      <th>類別</th>
      <th>時間</th>
      <th>標題</th>
      <th>操作類型</th>
      <th>發布人</th>
      <th>系統</th>
      <th v-if="postStore.historyCase">狀態</th>
      <th>細節</th>
    </template>
    <template #td
      ><tr
        v-for="approveCase in Store.pageData.pager"
        :key="approveCase.uuid"
        class="border-l-8"
        :class="[
          Store.chosenList.includes(approveCase.caseUuid)
            ? 'border-secondaryDark'
            : 'border-primaryDark',
        ]"
      >
        <td v-if="!postStore.historyCase">
          <label class="checkBox relative flex"
            ><input
              type="checkbox"
              class="hidden"
              :id="approveCase.caseUuid"
              :value="approveCase.caseUuid"
              v-model="Store.chosenList" /><span
              class="checkMark border-primaryDark"
            ></span
            ><span class="checkMarkBg"></span
          ></label>
        </td>
        <td>
          {{ commonStore.caseType[approveCase.type]?.title }}
        </td>
        <td class="text-sm">
          {{ approveCase.startTime }}
          <!-- {{
            Store.dateReform(
              Store.timeReform(approveCase.startTime)[0],
              ".",
              "/"
            )
          }} -->
        </td>
        <td>{{ postTitle(approveCase.title, 40) }}</td>
        <td>
          <span
            class="rounded p-2 font-bold text-white"
            :class="commonStore.actionType[approveCase.actionType]?.color"
            >{{ commonStore.actionType[approveCase.actionType]?.title }}</span
          >
        </td>
        <td>{{ approveCase.applicantName }}</td>
        <td>
          {{ Store.getRelSys(approveCase.relSys).memo ?? "無" }}/{{
            Store.getRelSys(approveCase.relSys).name ?? "無"
          }}
        </td>
        <td v-if="postStore.historyCase">
          <span
            class="btn p-2"
            :class="commonStore.getCaseStatusName(approveCase.status)?.color"
          >
            {{ commonStore.getCaseStatusName(approveCase.status)?.title }}
          </span>
        </td>
        <td>
          <button
            class="border-2 border-primaryDark rounded w-10 h-10 text-primaryDark text-2xl hover:bg-secondaryLight"
            @click="approveDetail(approveCase.caseUuid)"
          >
            <i class="fa-solid fa-clipboard-list"></i>
          </button>
        </td></tr
    ></template>
  </listTable>
</template>
<script setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCommonStore } from "../../store/commonStore";
import { usePostStore, useStore } from "../../store/store";
import listTable from "../listTable.vue";
const Store = useStore();
const postStore = usePostStore();
const commonStore = useCommonStore();
const route = useRoute();
const router = useRouter();
const props = defineProps(["toPag"]);
const postTitle = (title, max) => {
  if (title?.length > max) {
    return title.slice(0, max) + "...";
  } else {
    return title;
  }
};
const approveDetail = (caseUuid) => {
  if (props.toPag == "all") {
    router.push({
      name: "approveDetail",
      params: {
        caseUuid,
      },
    });
  } else {
    router.push({
      name: "approveHisDetail",
      params: {
        caseUuid,
      },
    });
  }
};

onBeforeUnmount(() => {
  Store.pageData.pager = [];
  Store.pageData.pageCurrent = 1;
  Store.pageData.pageSize = 20;
});
</script>
