<template>
  <button
    class="border-2 border-primaryDark w-10 h-10 rounded"
    @click="postSetting = !postSetting"
  >
    <span class="text-[25px] text-primaryDark">
      <i class="fa-solid fa-gear" :class="postSetting ? 'fa-spin' : ''"></i>
    </span>
  </button>
  <div
    class="absolute right-14 opacity-0 bg-white border-2 border-primaryDark rounded transition-all"
    :class="
      postSetting ? 'top-2 opacity-100' : '-top-[100%] pointer-events-none'
    "
  >
    <div
      class="flex justify-between items-center border-b-2 border-primaryDark p-1"
    >
      <span class="font-bold">變更公告</span>
    </div>
    <div
      class="p-4 flex gap-x-4"
      v-if="postStore().postDetail.status == 'online'"
    >
      <button
        v-if="Store().getSvcAuth('UpdatePost') && hasCaseFlow"
        class="block bg-secondaryDark rounded p-4 cursor-pointer"
        @click="updatePost()"
      >
        <span class="text-white font-bold">
          <i class="fa-solid fa-pen mr-2"></i>編輯此公告
        </span>
      </button>
      <button
        v-if="Store().getSvcAuth('DeletePost')"
        class="block bg-cancel rounded p-4"
        @click="deletePost()"
      >
        <span class="text-white font-bold">
          <i class="fa-solid fa-trash mr-2"></i>隱藏此公告
        </span>
      </button>
      <span
        v-if="
          !Store().getSvcAuth('UpdatePost') &&
          (!Store().getSvcAuth('DeletePost') || !hasCaseFlow)
        "
        >暫無變更公告之權限。</span
      >
    </div>
    <div
      class="p-4 flex gap-x-4"
      v-if="postStore().postDetail.status == 'hide'"
    >
      <button
        v-if="Store().getSvcAuth('DeletePost')"
        class="block bg-submit rounded p-4 cursor-pointer"
        @click="recoverPost"
      >
        <span class="text-white font-bold">
          <i class="fa-solid fa-arrow-up-from-bracket mr-2"></i>重新上架此公告
        </span>
      </button>
      <span v-else>暫無變更公告之權限。</span>
    </div>
    <div
      class="p-4 flex gap-x-4"
      v-if="postStore().postDetail.status == 'checking'"
    >
      <span>此公告正在審核中，暫時無法進行變更。</span>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { postStore, Store } from "../../store/store";
import apiRequest from "../../api/apiRequest";

const postSetting = ref(false);
// const postSettingErr = ref("");
const togglePostTop = ref(false);
const route = useRoute();
const router = useRouter();

const hasCaseFlow = ref(false);
onBeforeMount(async () => {
  const res = await apiRequest.post("CheckUserCaseFlow", {
    refId: postStore().postDetail.refId,
  });
  if (res.desc == "successful") {
    hasCaseFlow.value = true;
  }
});

watchEffect(() => {
  if (postStore().postDetail.top == 1) {
    togglePostTop.value = true;
  } else {
    togglePostTop.value = false;
  }
});

// const updateTop = () => {
//   let top;
//   if (togglePostTop.value) {
//     top = "1";
//   } else top = "0";
//   updatingSpin.value = true;
//   Store().alertShow = true;
//   Store().alertObj = {
//     msg: "確定變更?",
//     func: (e) => {
//       if (e.target.value == "confirm") {
//         apiRequest
//           .post("UpdateTop", { uuid: route.params.uuid, top: top })
//           .then((res) => {
//             if (res.desc == "successful") {
//               updatingSpin.value = false;
//               postStore().postDetail.top = top;
//               postSetting.value = false;
//             } else {
//               postSettingErr.value = "設定失敗";
//             }
//           });
//       } else {
//         updatingSpin.value = false;
//       }
//     },
//   };
// };

const updatePost = () => {
  router.push(`/postUpdate/${route.params.uuid}`);
};

const deletePost = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: "即將送出隱藏公告審核，確定要隱藏此公告?",
    func: (e) => {
      if (e.target.value == "confirm") {
        Store().loadingSpinner = true;
        apiRequest
          .post("DeletePost", { uuid: route.params.uuid, status: "1" })
          .then((res) => {
            Store().loadingSpinner = false;
            postSetting.value = false;
            if (res.desc == "successful") {
              router.push({ name: "SvcSucess" });
            } else {
              router.push({ name: "SvcFail" });
            }
          });
      }
    },
  };
};

const recoverPost = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: "即將送出重新上架審核，確定要重新上架此公告?",
    func: (e) => {
      if (e.target.value == "confirm") {
        Store().loadingSpinner = true;
        apiRequest
          // recover跟delete共用一隻API: status=1是將公告狀態調整為隱藏、0是恢復
          .post("DeletePost", { uuid: route.params.uuid, status: "0" })
          .then((res) => {
            Store().loadingSpinner = false;
            postSetting.value = false;
            if (res.desc == "successful") {
              router.push({ name: "SvcSucess" });
            } else {
              router.push({ name: "SvcFail" });
            }
          });
      }
    },
  };
};
</script>
