<template>
  <div class="w-full flex justify-evenly bg-primary rounded-t py-4">
    <newStepHeader
      v-for="(item, index) in newTitle.list"
      :stepValue="[item.name, index]"
    >
      <template #title> {{ item.title }} </template>
    </newStepHeader>
  </div>
  <component :is="getNewTitle"></component>
  <loadSpinner>
    <template #title>儲存中</template>
  </loadSpinner>
  <div
    v-if="Store().currentNewStep == 'postnewWrite'"
    class="w-15/16 mx-auto flex justify-evenly my-8"
  >
    <button @click="nextStep" class="btn btnClick w-2/12">下一步</button>
  </div>
  <div v-else class="flex justify-center my-8">
    <button
      @click="Store().currentNewStep = 'postnewWrite'"
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
import { onBeforeMount, shallowRef, markRaw, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { flowStore, Store, postStore } from "../../../store/store";
import apiRequest from "../../../api/apiRequest";
import { FindEmpCaseFlowForCaseCreate } from "../../../api/service";
import { commonStore } from "../../../store/commonStore";
import newStepHeader from "../../../components/newStepHeader.vue";
import postnewWrite from "../../../components/post/postNewWrite.vue";
import postnewConfirm from "../../../components/post/postNewConfirm.vue";
const route = useRoute();
const router = useRouter();

const newTitle = shallowRef({
  com: postnewWrite,
  list: [
    {
      name: "postnewWrite",
      title: "填寫資料",
      com: markRaw(postnewWrite),
    },
    {
      name: "postnewConfirm",
      title: "確認後送出",
      com: markRaw(postnewConfirm),
    },
  ],
});

const getNewTitle = computed(() => {
  for (let item in newTitle.value.list) {
    if (Store().currentNewStep == newTitle.value.list[item].name) {
      newTitle.value.com = newTitle.value.list[item].com;
    }
  }
  return newTitle.value.com;
});
// 錯誤提示
const wrongInfo = (name) => {
  let msgObj = {
    flow: "建檔流程",
    tag: "類別",
    // top: "權重",
    // Unit: "公告單位",
    relSys: "關聯系統",
    title: "標題",
    content: "內文",
  };
  for (let i = 0; i < Object.keys(msgObj).length; i++) {
    if (Object.keys(msgObj)[i] == name) {
      Store().alertObj.msg = Object.values(msgObj)[i] + `輸入有誤!`;
      break;
    }
  }
  Store().alertShow = true;
  Store().alertObj.func = (e) => {};
};
// 下一步 確認階段
const nextStep = () => {
  if (!postStore().newPost.title.trim()) {
    postStore().newPostCheckList.title = null;
  }
  if (!postStore().newPost.content.trim()) {
    postStore().newPostCheckList.content = null;
  }
  let pass = false;
  for (let value in postStore().newPostCheckList) {
    if (postStore().newPostCheckList[value] != null) {
      for (let i of postStore().newPostCheckList[value]) {
        if (i.result === false) {
          pass = false;
          wrongInfo(value);
          break;
        } else {
          pass = true;
        }
      }
      if (!pass) {
        break;
      }
    } else {
      pass = false;
      wrongInfo(value);
      break;
    }
  }
  if (pass === true) {
    Store().currentNewStep = "postnewConfirm";
  }
};
let sendNewPostInfo = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: "確定傳送公告？",
    func: (e) => {
      if (e.target.value === "confirm") {
        Store().loadingSpinner = true;
        // 編輯公告
        apiRequest
          .post("UpdatePost", postStore().newPost)
          .then((res) => {
            Store().loadingSpinner = false;
            if (res.desc == "successful") {
              router.push({ name: "postAll" });
            } else {
              commonStore().SvcFail.msg = res.desc;
              router.push({ name: "SvcFail" });
            }
          })
          .catch();
      }
    },
  };
};
onBeforeMount(async () => {
  Store().currentNewStep = "postnewWrite";
  postStore().newPostCheckList = {
    flow: [{ result: true, msg: "ok" }],
    title: [{ result: true, msg: "ok" }],
    content: [{ result: true, msg: "ok" }],
    relSys: [{ result: true, msg: "ok" }],
  };
});
</script>
<style scoped></style>
