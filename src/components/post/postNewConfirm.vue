<template>
  <span class="block py-4 opacity-50 font-bold">確認輸入資料</span>
  <div class="w-full p-4 mb-8 border-2 border-primaryDark/20 rounded">
    <div class="w-14/16 flex flex-wrap justify-between mx-auto">
      <div class="w-full md:w-5/16 bg-primaryLight p-4 my-2 rounded">
        <span class="block font-bold"> 權重 : </span>
        <p class="inp bg-white my-2 p-1.5">
          {{ postStore().newPost.top == 0 ? "置頂" : "不置頂" }}
        </p>
      </div>
      <div class="w-full md:w-5/16 bg-primaryLight p-4 my-2 rounded">
        <span class="block font-bold">關聯系統 :</span>
        <div class="rounded bg-primaryDark flex my-2 py-2 shadow-lg">
          <div class="text-white my-auto ml-2">
            <span class="block font-bold text-sm">{{
              postStore().getRelSys("name")
            }}</span>

            <span class="block text-2xl font-bold">
              {{ postStore().getRelSys("memo") }}
            </span>
            <span class="mr-2 text-sm text-primaryLight">類別 :</span
            ><span class="font-bold">{{ postStore().getTag("memo") }}</span>
          </div>
        </div>
      </div>
      <!-- 審核流程 -->
      <div class="w-full md:w-5/16 my-2 p-4 bg-primaryLight rounded">
        <span class="block font-bold">審核流程 :</span>
        <div
          class="w-full my-4 py-4 bg-primaryDark rounded flex z-50 shadow-lg relative"
        >
          <div v-if="route.path == '/postNew'" class="text-white my-auto ml-2">
            <span class="block font-bold text-sm">{{
              flowStore().caseDetail.flow
            }}</span>
            <span class="block text-2xl font-bold">
              {{ flowStore().caseDetail.memo }}
            </span>
            <span class="block font-bold text-sm my-2"
              >流程共 {{ flowStore().caseDetail.totalLevel }} 層</span
            >
          </div>
          <div v-else class="text-white my-auto ml-2 font-bold text-2xl">
            公告編輯審核流程
          </div>
          <div class="h-12 absolute bottom-2 right-0 opacity-50">
            <img src="../../assets/caseflowimg.png" />
          </div>
        </div>
      </div>
    </div>
    <!-- 公告內容 -->
    <div class="w-14/16 mx-auto bg-primaryLight p-4 m-4 rounded">
      <span for="postTitle" class="block font-bold">標題 : </span>
      <p class="p-2 w-full bg-white rounded">
        {{ postStore().newPost.title }}
      </p>
      <span for="textArea" class="block font-bold"> 內文 : </span>
      <p
        ref="content"
        class="p-2 w-full bg-white whitespace-pre-line rounded"
      ></p>
    </div>
  </div>
</template>
<script setup>
import apiRequest from "../../api/apiRequest";
import { postStore, flowStore } from "../../store/store";
import { FindCaseFlowAndDetail } from "../../api/service";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { useRoute } from "vue-router";
const route = useRoute();
const content = ref(null);

const getTotalLevel = async (str) => {
  await FindCaseFlowAndDetail(str);
};

onMounted(() => {
  content.value.innerHTML = postStore().newPost.content;
});
</script>
