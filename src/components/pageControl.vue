<template>
  <div
    class="w-full box-border flex flex-col justify-center items-center rounded-b bg-primary"
  >
    <div class="my-2 w-full md:w-1/2 flex justify-evenly">
      <button
        class="pgeControl pgeHover hidden md:inline-block"
        @click="showPage(1)"
      >
        <i class="fa-solid fa-angles-left"></i>
      </button>
      <button
        class="pgeControl pgeHover"
        @click="showPage(pageData.pageCurrent - 1)"
      >
        <i class="fa-solid fa-angle-left"></i>
      </button>
      <div class="pgeControl">
        <input
          type="tel"
          class="w-8 md:w-10 text-primaryDark mx-2 px-2"
          v-model="pageData.pageCurrent"
          min="1"
          :max="pageData.totalPages"
          maxlength="5"
          @blur="showPage(pageData.pageCurrent)"
        />
        <span class="font-bold">Of {{ pageData.totalPages }}</span>
      </div>
      <button
        class="pgeControl pgeHover"
        @click="showPage(pageData.pageCurrent + 1)"
      >
        <i class="fa-solid fa-angle-right"></i>
      </button>
      <button
        class="pgeControl pgeHover hidden md:inline-block"
        @click="showPage(pageData.totalPages)"
      >
        <i class="fa-solid fa-angles-right"></i>
      </button>
    </div>
    <div class="hidden md:inline-block">
      <select
        name="pageSize"
        id="pageSize"
        class="hover:cursor-pointer"
        v-model="pageData.pageSize"
        @change="showPage(1)"
      >
        <option
          v-for="item in Store().pageSizeOptions"
          :value="item"
          :key="item"
        >
          {{ item }}
        </option>
      </select>
      <span class="">總共{{ pageName.length }}筆資料</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect, toRef } from "vue";
import { useRoute } from "vue-router";
import { Store, postStore } from "../store/store";

// 頁數設定
const route = useRoute();
const pageData = ref(Store().pageData);
const showPage = (pageIndex) => {
  if (pageIndex > 0) {
    pageData.value.pageCurrent = Math.min(pageIndex, pageData.value.totalPages);
  } else {
    pageData.value.pageCurrent = 1;
  }
  if (route.path == "/approveAll") {
    let newPage = [];
    pageData.value.totalPages = Math.ceil(
      pageName.value.length / pageData.value.pageSize
    );
    for (let i = 0; i < pageData.value.pageSize; i++) {
      let index =
        i + (pageData.value.pageCurrent - 1) * pageData.value.pageSize;
      if (pageName.value[index] == undefined) break;
      newPage[newPage.length] = pageName.value[index];
    }
    let x = newPage;
    if (Store().chosenList.lastIndexOf(x[0].caseUuid) == -1) {
      Store().checkAll = false;
    } else {
      Store().checkAll = true;
    }
  }
};

// 換頁資料渲染
const prop = defineProps(["pageName"]);
const pageName = toRef(prop, "pageName");

watch(pageName, () => {
  pageData.value.pageCurrent = 1;
});

watchEffect(() => {
  let newPage = [];
  pageData.value.totalPages = Math.ceil(
    pageName.value.length / pageData.value.pageSize
  );
  for (let i = 0; i < pageData.value.pageSize; i++) {
    let index = i + (pageData.value.pageCurrent - 1) * pageData.value.pageSize;
    if (pageName.value[index] == undefined) break;
    newPage[newPage.length] = pageName.value[index];
  }
  pageData.value.pager = newPage;

  // pager 為 render 出來的 list
});
</script>
<style scoped>
.pgeControl {
  @apply p-2 border-b-4 md:px-4;
}
.pgeHover {
  @apply hover:border-secondaryDark;
}
</style>
