<template>
  <listTable>
    <template #th
      ><th>時間</th>
      <th>狀態</th>
      <th>標題</th>
      <th>系統</th>
      <th>細節</th>
    </template>
    <template #td
      ><tr v-for="post in Store.pageData.pager" :key="post.uuid">
        <td class="text-sm">
          {{ post.postDate?.substring(0, 16) ?? "未發布" }}
        </td>
        <td>
          <span
            class="rounded p-2 text-white font-bold"
            :class="commonStore.getCaseStatusName(post.status)?.color"
          >
            {{ commonStore.getCaseStatusName(post.status)?.title }}
          </span>
        </td>
        <td class="font-bold w-1/2">
          {{ postTitle(post.title, 50) }}
        </td>
        <td>
          {{ Store.getRelSys(post.relSys).memo }}/
          {{ Store.getRelSys(post.relSys).name }}
        </td>
        <td>
          <button
            @click="postDetail(post.uuid, 'post')"
            class="border-2 border-primaryDark rounded w-10 h-10 text-primaryDark text-2xl hover:bg-secondaryLight"
          >
            <i class="fa-solid fa-clipboard-list"></i>
          </button>
        </td></tr
    ></template>
  </listTable>
</template>
<script setup>
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useCommonStore } from "../../store/commonStore";
import { useStore } from "../../store/store";
import listTable from "../listTable.vue";
const Store = useStore();
const commonStore = useCommonStore();
const router = useRouter();
const postDetail = (uuid, category) => {
  router.push({
    // name: "postDetail",
    name: "detail",
    params: {
      uuid,
      category,
    },
  });
  // postStore.refId = refId;
};

const postTitle = (title, max) => {
  if ((title?.length ?? 0) > max) {
    return title.slice(0, max) + "...";
  } else {
    return title;
  }
};
onBeforeUnmount(() => {
  Store.pageData.pager = [];
  Store.pageData.pageCurrent = 1;
  Store.pageData.pageSize = 20;
});
</script>
