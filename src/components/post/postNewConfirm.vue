<template>
  <div class="my-2">
    <div class="flex gap-8 items-center my-4">
      <div class="flex-initial w-72">
        <span class="block font-bold"> 權重 : </span>
        <span class="inp">
          {{ props.newPost.top == 1 ? "置頂" : "不置頂" }}
        </span>
      </div>
      <div class="flex-initial w-72">
        <span class="block font-bold"> 發布日期 : </span>
        <span class="inp">
          {{ props.newPost.postDate }}
        </span>
      </div>
    </div>
    <div class="flex gap-8 items-center my-4">
      <div class="flex-initial w-72">
        <span class="block font-bold">發布系統 :</span>
        <div class="rounded text-white bg-primaryDark my-2 py-2 shadow-lg">
          <span class="block font-bold text-sm ml-2">{{
            poststore.getRelSys(props.newPost, "name")
          }}</span>
          <span class="block text-2xl font-bold ml-2">
            {{ poststore.getRelSys(props.newPost, "memo") }}
          </span>
        </div>
      </div>
      <div class="flex-initial w-72">
        <span class="block font-bold">類別 :</span>
        <div class="text-white my-2 py-2 rounded bg-primaryDark shadow-lg">
          <span class="block font-bold text-sm ml-2">{{
            poststore.getTag(props.newPost, "name")
          }}</span>
          <span class="font-bold text-2xl ml-2">{{
            poststore.getTag(props.newPost, "memo")
          }}</span>
        </div>
      </div>
      <div class="flex-initial w-72">
        <span class="block font-bold">審核流程 :</span>
        <div
          class="w-full my-2 py-2 bg-primaryDark rounded flex z-50 shadow-lg relative"
        >
          <div class="text-white my-auto ml-2">
            <span class="block font-bold text-sm"
              >{{ props.newPost.flow }} 流程共
              {{ flowStore.caseDetail.totalLevel }} 層</span
            >
            <span class="block text-2xl font-bold">
              {{ flowStore.caseDetail.memo }}
            </span>
          </div>
          <div class="h-12 absolute bottom-2 right-0 opacity-50">
            <img src="../../assets/caseflowimg.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 公告內容 -->
  <div>
    <span for="postTitle" class="block font-bold">標題 : </span>
    <div class="inpLabel w-full">
      <p class="w-full inp">
        {{ props.newPost.title }}
      </p>
    </div>
    <span for="textArea" class="block font-bold"> 內文 : </span>
    <p
      ref="content"
      class="tiptapStyle p-2 w-full bg-white whitespace-pre-line rounded"
    ></p>
  </div>
  <div class="flex justify-center my-8">
    <button
      @click="poststore.newPostStep = 'postnewWrite'"
      class="btn btnClick mr-8"
    >
      上一步
    </button>
    <button @click="sendNewPostInfo" class="btn btnClick bg-submit">
      確認送出
    </button>
  </div>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { FindCaseFlowAndDetail } from "../../api/service";
import { useCommonStore } from "../../store/commonStore";
import { useFlowStore, usePostStore, useStore } from "../../store/store";

const route = useRoute();
const router = useRouter();
const store = useStore();
const poststore = usePostStore();
const flowStore = useFlowStore();
const commonStore = useCommonStore();
const content = ref(null);
const props = defineProps(["newPost"]);

let sendNewPostInfo = () => {
  store.alertShow = true;
  store.alertObj = {
    msg: "確定傳送公告？",
    func: async (e) => {
      if (e.target.value === "confirm") {
        store.loadingSpinner = true;
        // 建立公告
        await apiRequest
          .post("CreatePost", props.newPost)
          .then((res) => {
            store.loadingSpinner = false;
            if (res.desc == "successful") {
              store.routerPush = "postAll";
              router.push({ name: "SvcSucess" });
            } else {
              commonStore.SvcFail.msg = res.desc;
              router.push({ name: "SvcFail" });
            }
          })
          .catch();
      }
    },
  };
};

onMounted(async () => {
  content.value.innerHTML = props.newPost.content;
  await FindCaseFlowAndDetail(props.newPost.flow);
});
</script>
