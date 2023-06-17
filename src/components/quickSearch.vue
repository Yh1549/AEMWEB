<template>
  <div class="flex flex-wrap items-center">
    <label class="inpLabel m-2">
      <span class="pointer-events-none">
        <i class="fa-solid fa-magnifying-glass"></i>
      </span>
      <input
        type="text"
        placeholder="快速搜尋"
        class="inp ml-1"
        v-model="quickSearch"
      />
    </label>
    <span v-if="noResult" class="text-cancel font-bold mr-2">查無此資料!</span>
    <button
      class="rounded bg-primaryDark text-white font-bold p-1 my-2 md:btn md:btnClick"
      @click="clearSearch"
    >
      清除搜尋
    </button>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { usePostStore, useStore, useUserStore } from "../store/store";
const Store = useStore;
const userStore = useUserStore;
const postStore = usePostStore;
const route = useRoute();

const quickSearch = ref("");
const noResult = ref(false);

const search = () => {
  if (quickSearch.value == "") {
    noResult.value = false;
    if (route.path == "/UserManage" && Store.tabCurrent == "all") {
      Store.pageRender = userStore.List;
    } else if (
      (route.path == "/postPersonal" && Store.tabCurrent == "all") ||
      route.path == "/postAll"
    ) {
      Store.pageRender = postStore.List;
    } else {
      Store.pageRender = Store.tabList;
    }
  } else {
    if (route.path == "/UserManage" && Store.tabCurrent == "all") {
      Store.pageRender = userStore.List.filter((i) =>
        [i.empid, i.name].some((text) => text.includes(quickSearch.value))
      );
      noResult.value = false;
    } else if (route.path == "/UserManage" && Store.tabCurrent !== "all") {
      Store.pageRender = Store.tabList.filter((i) =>
        [i.empid, i.name].some((text) => text.includes(quickSearch.value))
      );
      noResult.value = false;
    } else if (
      (route.path == "/postPersonal" && Store.tabCurrent == "all") ||
      route.path == "/postAll"
    ) {
      Store.pageRender = postStore.List.filter((i) =>
        // [i.postDate, i.title, i.status, i.tag, i.relSys, i.name]
        [i.title, i.status, i.relSys].some((text) =>
          text.includes(quickSearch.value)
        )
      );
      noResult.value = false;
    } else if (route.path == "/postPersonal" && Store.tabCurrent !== "all") {
      Store.pageRender = Store.tabList.filter((i) =>
        // [i.postDate, i.title, i.status, i.tag, i.relSys, i.name]
        [i.title, i.status, i.relSys].some((text) =>
          text.includes(quickSearch.value)
        )
      );
      noResult.value = false;
    }
    if (Store.pageRender.length == 0) {
      noResult.value = true;
    }
  }
};

const clearSearch = () => {
  quickSearch.value = "";
  noResult.value = false;
};

// 動態搜尋(不用按 enter)
watch(quickSearch, () => {
  search();
});
</script>
