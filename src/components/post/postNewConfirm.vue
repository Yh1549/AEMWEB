<template>
  <div class="my-2">
    <div class="flex gap-8 items-center my-4">
      <div class="flex-initial w-72">
        <span class="block font-bold"> 是否置頂 : </span>
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
    <div class="flex gap-8 items-center my-4 flex-wrap">
      <div class="flex-initial w-72">
        <span class="block font-bold">發布系統 :</span>
        <div class="rounded text-white bg-primaryDark my-2 py-2 shadow-lg">
          <span class="block font-bold text-sm ml-2">{{ system.name }}</span>
          <span class="block text-2xl font-bold ml-2">
            {{ system.memo }}
          </span>
        </div>
      </div>
      <div class="flex-initial">
        <span class="block font-bold">群組 :</span>
        <div class="flex gap-2 flex-wrap">
          <div v-for="item in tagList" class="inpLabel">
            <span>{{ item.memo }}/{{ item.name }}</span>
          </div>
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
    <div
      v-html="props.newPost.content"
      class="tiptapStyle p-2 w-full bg-white whitespace-pre-line rounded"
    ></div>
  </div>
  <div class="flex justify-center my-8">
    <button @click="toWriteEmit" class="btn btnClick mr-8">上一步</button>
    <button @click="sendNewPostInfo" class="btn btnClick bg-submit">
      確認送出
    </button>
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { useCommonStore } from "../../store/commonStore";
import { useFlowStore, useStore } from "../../store/store";

const router = useRouter();
const store = useStore();
const flowStore = useFlowStore();
const commonStore = useCommonStore();
const content = ref(null);
const tagList = ref([]);
const emit = defineEmits(["toWrite"]);
const props = defineProps(["newPost", "fullInfo"]);
const system = ref("");
let sendNewPostInfo = () => {
  store.alertShow = true;
  store.alertObj = {
    msg: "確定傳送公告？",
    func: async (e) => {
      if (e.target.value === "confirm") {
        // 建立公告
        await apiRequest
          .post("CreatePost", props.newPost)
          .then((res) => {
            if (res.desc == "successful") {
              store.routerPush = "postAll";
              router.push({ name: "SvcSucess" });
            } else {
              commonStore.SvcFail.msg = res.desc;
              router.push({ name: "SvcFail" });
            }
          })
          .catch((e) => {});
      }
    },
  };
};
watchEffect(() => {
  for (let item of JSON.parse(sessionStorage.getItem("SysList"))) {
    if (item.name == props.newPost.relSys) {
      system.value = item;
    }
  }
});
watchEffect(() => {
  for (let item of props.fullInfo.tag) {
    for (let value of props.newPost.tag) {
      if (item.name == value) {
        tagList.value.push(item);
      }
    }
  }
});
const toWriteEmit = () => {
  emit("toWrite", "write");
};
</script>
