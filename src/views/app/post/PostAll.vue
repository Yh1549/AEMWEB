<template>
  <!-- 關鍵字搜尋 -->
  <button
    @click="togglePersonalPost"
    class="bg-primaryDark rounded p-2 my-1 text-white fill-white font-bold hover:fill-primaryDark hover:bg-secondary hover:text-primaryDark hover:cursor-pointer"
  >
    目前列表為{{ personalPost ? "個人公告" : "所有公告" }}
  </button>
  <div class="md:flex items-center gap-2 bg-primary p-2 rounded-t">
    <label class="bg-white rounded border-2 border-primaryDark flex my-2 p-2">
      <span class="pointer-events-none">
        <i class="fa-solid fa-magnifying-glass"></i>
      </span>
      <input
        type="text"
        id="keyword"
        class="inp px-1"
        v-model="keyword"
        placeholder="請輸入關鍵字"
        @keyup.enter="handleSearch"
      />
    </label>
    <div class="bg-primaryLight rounded md:w-1/4 px-2 py-2 my-4 md:my-0">
      <label for="name" class="block">
        <span class="inpSpan text-base">發布系統</span>
        <select name="user" class="inp w-full" v-model="system">
          <option :value="undefined">-- 請選擇 --</option>
          <option v-for="i in data.system" :value="i" :key="i">
            {{ i.memo }}
          </option>
        </select>
      </label>
    </div>
    <div class="md:flex gap-2 w-full md:w-1/2">
      <div class="bg-primaryLight rounded md:w-1/2 p-2 mb-4 md:mb-0">
        <label for="startTime" class="block">
          <span class="inpSpan text-base">發布時間(開始)</span>
          <input
            type="date"
            name="startTime"
            id="startTime"
            class="inp w-full"
            v-model="startTime"
          />
        </label>
      </div>
      <div class="bg-primaryLight rounded md:w-1/2 px-2 py-2 mb-4 md:mb-0">
        <label for="endTime" class="block">
          <span class="inpSpan text-base">發布時間(結束)</span>
          <input
            type="date"
            name="endTime"
            id="endTime"
            class="inp w-full"
            v-model="endTime"
          />
        </label>
      </div>
    </div>
    <button class="btn btnClick" @click="handleSearch(false)">搜尋</button>
    <button class="btn btnClick" @click="cancelSearch">取消搜尋</button>
  </div>
  <loadSpinner v-if="Store().loadingSpinner">
    <template #title>載入中</template>
  </loadSpinner>
  <div v-else-if="Store().pageRender.length == 0" class="w-full">
    <no-result></no-result>
  </div>
  <div v-else>
    <post-list></post-list>
    <page-control :pageName="Store().pageRender"></page-control>
  </div>
</template>

<script setup>
import { Store, postStore } from "../../../store/store";
import { ref, onBeforeMount } from "vue";
import noResult from "../../../components/NoResultPage.vue";
import pageControl from "../../../components/pageControl.vue";
import postList from "../../../components/list/postList.vue";
import loadSpinner from "../../../components/loadSpinner.vue";
import { FindPost, findSysList } from "../../../api/service";

onBeforeMount(async () => {
  Store().loadingSpinner = true;
  await FindPost();
  await findSysList();
  Store().pageRender = searchBase.value = postStore().List;
  // postDetail route back to postList optimize (keep search record)
  keyword.value = Store().searchMemo.keyword;
  system.value = Store().searchMemo.system;
  startTime.value = Store().searchMemo.startTime;
  endTime.value = Store().searchMemo.endTime;
  handleSearch(true);
  Store().loadingSpinner = false;
});

// 個人公告切換
const searchBase = ref();
const personalPost = ref(false);
const togglePersonalPost = () => {
  personalPost.value = !personalPost.value;
  if (personalPost.value) {
    searchBase.value = postStore().List.filter(
      (i) => i.name == Store().currentUser().empid
    );
    Store().pageRender = searchBase.value;
    clearAll();
  } else {
    searchBase.value = postStore().List;
    Store().pageRender = searchBase.value;
    clearAll();
  }
};

const data = ref({
  system: JSON.parse(sessionStorage.getItem("SysList")),
  status: [
    { name: "checking", memo: "審核中" },
    { name: "online", memo: "已發布" },
    { name: "deleted", memo: "已刪除" },
  ],
  // searchResult: [], // 放搜尋後的資料
  // searchWord: [], // 搜尋條件
});

// v-model連動搜尋條件
const keyword = ref(undefined),
  system = ref(undefined),
  startTime = ref(undefined),
  endTime = ref(undefined);

const handleSearch = (init) => {
  // 判斷搜尋條件是否為空值
  if (
    !init &&
    !keyword.value &&
    !system.value &&
    !startTime.value &&
    !endTime.value
  ) {
    Store().alertShow = true;
    Store().alertObj = {
      msg: "請選擇查詢條件！",
      func: (e) => {},
    };
    return;
  }
  Store().searchMemo.keyword = keyword.value;
  Store().searchMemo.system = system.value;
  Store().searchMemo.startTime = startTime.value;
  Store().searchMemo.endTime = endTime.value;

  // data.value.searchWord = [];
  // data.value.searchResult = [];
  // Store().pageRender = [];

  let result = searchBase.value;
  if (keyword.value) {
    // data.value.searchWord.push(keyword.value);
    if (keyword.value == "審核中") {
      result = result.filter((i) => i.status.includes("checking"));
    } else if (keyword.value == "已發布") {
      result = result.filter((i) => i.status.includes("online"));
    } else if (keyword.value == "已刪除") {
      result = result.filter((i) => i.status.includes("deleted"));
    } else {
      result = result.filter((i) =>
        [i.title, i.name].some((text) => text.includes(keyword.value))
      );
    }
  }
  if (system.value) {
    // data.value.searchWord.push(system.value.memo);
    result = result.filter((p) => p.relSys == system.value.name);
  }
  // 若開始時間晚於結束時間，則將兩值對調(不報錯)並繼續查詢
  if (
    startTime.value &&
    endTime.value &&
    Date.parse(startTime.value).valueOf() > Date.parse(endTime.value).valueOf()
  ) {
    [startTime.value, endTime.value] = [endTime.value, startTime.value];
  }
  if (startTime.value) {
    // data.value.searchWord.push(startTime.value);
    result = result.filter(
      (p) =>
        Date.parse(p.postDate).valueOf() >=
        Date.parse(startTime.value).valueOf()
    );
  }
  if (endTime.value) {
    // data.value.searchWord.push(endTime.value);
    result = result.filter(
      (p) =>
        Date.parse(p.postDate).valueOf() <= Date.parse(endTime.value).valueOf()
    );
  }

  // data.value.searchResult = result;
  // Store().pageRender = data.value.searchResult;
  Store().pageRender = result;
};

const clearAll = () => {
  Store().searchMemo.keyword = keyword.value = undefined;
  Store().searchMemo.system = system.value = undefined;
  Store().searchMemo.startTime = startTime.value = undefined;
  Store().searchMemo.endTime = endTime.value = undefined;
};
const cancelSearch = () => {
  clearAll();
  Store().pageRender = searchBase.value;
};
</script>
