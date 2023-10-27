<template>
  <div class="flex flex-wrap justify-between items-center">
    <div class="p-2 flex" v-if="!postStore.historyCase">
      <button class="btn btnClick" @click="postRelease">放行已選擇項目</button>
      <div class="mx-2 flex h-12">
        <label class="checkBox relative flex self-center mx-2"
          ><input
            type="checkbox"
            class="hidden"
            @change="checkAll"
            v-model="Store.checkAll"
          /><span class="checkMark border-white"></span
          ><span class="checkMarkBg"></span
          ><span class="ml-2 checked:font-bold">全選</span></label
        >
        <div v-if="Store.checkAll" class="flex items-center">
          <span v-if="pickAllSpan"
            >*已選取這個頁面上的項目，
            <button
              class="text-cancel font-bold p-2 rounded-lg hover:bg-background"
              @click="pickAll"
            >
              點此選取全部{{ postStore.List.length }}項目
            </button></span
          >
          <span v-else
            >已選取全部項目，
            <button
              class="text-cancel font-bold p-2 rounded-lg hover:bg-background"
              @click="pickAllClean"
            >
              點此清除已選取的全部項目
            </button></span
          >
        </div>
      </div>
    </div>
    <div
      class="md:flex items-center gap-2 p-2 w-full"
      :class="postStore.historyCase ? '' : 'md:w-10/12'"
    >
      <label
        class="bg-white rounded border-2 border-primaryDark flex my-2 p-2 w-full md:w-1/5"
      >
        <span class="pointer-events-none">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
        <input
          type="text"
          id="keyword"
          class="inp px-1 w-full"
          v-model="keyword"
          placeholder="請輸入關鍵字"
          @keyup.enter="handleSearch"
        />
      </label>
      <div
        class="bg-primaryLight rounded w-full md:w-1/4 px-2 py-2 my-4 md:my-0"
      >
        <label for="name" class="block">
          <span class="inpSpan text-base">案件類型</span>
          <div class="grid gap-2 grid-cols-2">
            <select name="caseType" class="inp w-full" v-model="caseType">
              <option :value="undefined">-- 請選擇 --</option>
              <option
                v-for="(i, index) in commonStore.caseType"
                :value="index"
                :key="index"
              >
                {{ i.title }}
              </option>
            </select>
            <select name="actionType" class="inp w-full" v-model="actionType">
              <option :value="undefined">-- 請選擇 --</option>
              <option
                v-for="(i, index) in commonStore.actionType"
                :value="index"
                :key="index"
              >
                {{ i.title }}
              </option>
            </select>
          </div>
        </label>
      </div>
      <div class="w-full md:w-2/5 md:flex md:gap-x-2">
        <div
          class="bg-primaryLight rounded w-full md:w-1/3 px-2 py-2 md:my-0"
          v-if="props.caseStatus"
        >
          <label for="name" class="block">
            <span class="inpSpan text-base">案件狀態</span>
            <select name="user" class="inp w-full" v-model="caseStatus">
              <option :value="undefined">-- 請選擇 --</option>
              <option v-for="i in data.status" :value="i.name" :key="i.name">
                {{ i.memo }}
              </option>
            </select>
          </label>
        </div>
        <div
          class="bg-primaryLight rounded w-full px-2 py-2 my-4 md:my-0"
          :class="props.caseStatus ? 'md:w-1/3' : 'md:w-1/2'"
        >
          <label for="name" class="block">
            <span class="inpSpan text-base">發布系統</span>
            <select name="user" class="inp w-full" v-model="system">
              <option :value="undefined">-- 請選擇 --</option>
              <option v-for="i in data.system" :value="i" :key="i">
                {{ i.memo }} / {{ i.name }}
              </option>
            </select>
          </label>
        </div>
        <div
          class="bg-primaryLight rounded w-full px-2 py-2 my-4 md:my-0"
          :class="props.caseStatus ? 'md:w-1/3' : 'md:w-1/2'"
        >
          <label for="startTime" class="block">
            <span class="inpSpan text-base">案件創建日期</span>
            <input
              type="date"
              name="startTime"
              id="startTime"
              class="inp w-full"
              v-model="startTime"
            />
          </label>
        </div>
      </div>
      <button class="btn btnClick" @click="handleSearch(false)">搜尋</button>
      <button class="btn btnClick" @click="cancelSearch">取消搜尋</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { useCommonStore } from "../../store/commonStore";
import { usePostStore, useStore } from "../../store/store";
const Store = useStore();
const postStore = usePostStore();
const commonStore = useCommonStore();
const router = useRouter();
const props = defineProps(["allCase", "caseStatus"]);
const data = ref({
  system: JSON.parse(sessionStorage.getItem("SysList")),
  status: [
    { name: "checking", memo: "審核中" },
    { name: "end", memo: "已結案" },
    { name: "deleted", memo: "已否決" },
  ],
});
const keyword = ref(undefined),
  caseType = ref(undefined),
  actionType = ref(undefined),
  caseStatus = ref(undefined),
  system = ref(undefined),
  startTime = ref(undefined);
// 全選功能
const pickAllSpan = ref(true);
let pickAll = () => {
  pickAllSpan.value = !pickAllSpan.value;
  Store.chosenList = [];
  for (let i = 0; i < postStore.List.length; i++) {
    Store.chosenList.push(postStore.List[i].caseUuid);
  }
};
let pickAllClean = () => {
  pickAllSpan.value = !pickAllSpan.value;
  Store.chosenList = [];
  Store.checkAll = false;
};

let checkAll = (e) => {
  if (e.target.checked) {
    Store.chosenList = [];
    for (let i = 0; i < Store.pageData.pager.length; i++) {
      Store.chosenList.push(Store.pageData.pager[i].caseUuid);
    }
  } else {
    pickAllSpan.value = true;
    for (let i = 0; i < Store.pageData.pager.length; i++) {
      let x = 0;
      for (let y = 0; y < Store.chosenList.length; y++) {
        if (Store.chosenList[x] == Store.pageData.pager[i].caseUuid) {
          Store.chosenList.splice(y, 1);
        } else {
          x += 1;
        }
      }
    }
  }
};
const postRelease = async () => {
  // 放行按鈕
  Store.alertShow = true;
  Store.alertObj = {
    msg: "是否放行已選擇案件？",
    func: async (e) => {
      if (e.target.value === "confirm") {
        await apiRequest
          .post("FastCheckCaseAndRelease", { caseUuidList: Store.chosenList })
          .then((res) => {
            if (res.desc == "successful") {
              Store.chosenList = [];
              router.push({
                name: "SvcSucess",
              });
            } else {
              commonStore.SvcFail.msg = res.desc;
              router.push({
                name: "SvcFail",
              });
            }
          })
          .catch();
      }
    },
  };
};

const handleSearch = (init) => {
  // 判斷搜尋條件是否為空值
  if (
    !init &&
    !keyword.value &&
    !caseType.value &&
    !actionType.value &&
    !caseStatus.value &&
    !system.value &&
    !startTime.value
  ) {
    Store.alertShow = true;
    Store.alertObj = {
      msg: "請選擇查詢條件！",
      func: (e) => {},
    };
    return;
  }
  Store.searchMemo.keyword = keyword.value;
  Store.searchMemo.caseType = caseType.value;
  Store.searchMemo.actionType = actionType.value;
  Store.searchMemo.caseStatus = caseStatus.value;
  Store.searchMemo.system = system.value;
  Store.searchMemo.startTime = startTime.value;

  let result = props.allCase;
  if (keyword.value) {
    result = result.filter((i) =>
      [i.title, i.empId, i.applicantName].some((text) =>
        text.includes(keyword.value)
      )
    );
  }
  if (caseType.value) {
    result = result.filter((i) => i.type == caseType.value);
  }
  if (actionType.value) {
    result = result.filter((i) => i.actionType == actionType.value);
  }
  if (caseStatus.value) {
    result = result.filter((i) => i.status == caseStatus.value);
  }
  if (system.value) {
    result = result.filter((p) => p.relSys == system.value.name);
  }
  if (startTime.value) {
    result = result.filter(
      (p) =>
        Date.parse(startTime.value).valueOf() + 86400000 >=
          Date.parse(p.startTime).valueOf() &&
        Date.parse(p.startTime).valueOf() >=
          Date.parse(startTime.value).valueOf()
    );
  }
  postStore.List = result;
};
const cancelSearch = () => {
  clearSearch();
  postStore.List = props.allCase;
};
const clearSearch = () => {
  Store.searchMemo.keyword = keyword.value = undefined;
  Store.searchMemo.caseType = caseType.value = undefined;
  Store.searchMemo.actionType = actionType.value = undefined;
  Store.searchMemo.caseStatus = caseStatus.value = undefined;
  Store.searchMemo.system = system.value = undefined;
  Store.searchMemo.startTime = startTime.value = undefined;
};
</script>
