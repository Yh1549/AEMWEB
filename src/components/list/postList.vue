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
      ><tr v-for="post in Store().pageData.pager" :key="post.uuid">
        <td class="text-sm">
          {{
            Store().dateReform(
              Store().timeReform(post.postDate)[0],
              ".",
              "/"
            ) ?? "未發布"
          }}
        </td>
        <td>
          <span
            class="rounded p-2 text-white font-bold"
            :class="getStatus(post.status, 'bg')"
          >
            {{ commonStore().getCaseStatusName(post.status)?.title }}
          </span>
        </td>
        <td class="font-bold w-11/16">
          {{ postTitle(post.title, 50) }}
        </td>
        <td>
          {{ Store().getRelSys(post.relSys) }}
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
import { commonStore } from "../../store/commonStore";
import { Store, postStore } from "../../store/store";
import { useRouter } from "vue-router";
import { onBeforeUnmount } from "vue";
import listTable from "../listTable.vue";
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
  // postStore().refId = refId;
};
const getStatus = (status, place) => {
  if (status == "online") {
    return `${place}-primaryDark`;
  } else if (status == "checking") {
    return `${place}-secondaryDark text-black`;
  } else {
    return `${place}-gray-500`;
  }
};

const postTitle = (title, max) => {
  if ((title?.length ?? 0) > max) {
    return title.slice(0, max) + "...";
  } else {
    return title;
  }
};
onBeforeUnmount(() => {
  Store().pageData.pager = [];
});
</script>
