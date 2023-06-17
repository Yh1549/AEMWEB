<template>
  <button
    class="border-2 border-primaryDark w-10 h-10 rounded hover:bg-secondaryLight"
    v-if="Store.getSvcAuth(currentSvc.update)"
    @click="settingToggle = !settingToggle"
  >
    <span class="text-[25px] text-primaryDark">
      <i class="fa-solid fa-gear" :class="settingToggle ? 'fa-spin' : ''"></i>
    </span>
  </button>
  <div
    class="absolute right-[5%] bg-white border-2 border-primaryDark rounded transition-all"
    :class="
      settingToggle
        ? 'top-2 opacity-100'
        : '-top-[100%] pointer-events-none  opacity-0'
    "
  >
    <div class="border-b-2 border-primaryDark p-1 text-center">
      <span class="font-bold">變更選項 </span>
    </div>
    <div class="p-2 flex gap-x-4" v-if="getDetailStatusValid">
      <button
        class="rounded p-2"
        :class="
          props.hasCaseFlow
            ? 'bg-secondaryDark'
            : 'pointer-events-none bg-gray-400'
        "
        @click="update"
      >
        <span class="text-white font-bold">
          <i class="fa-solid fa-pen mr-2"></i>編輯
        </span>
      </button>
      <button
        v-if="
          route.params.category == 'post' &&
          useStore().getSvcAuth(currentSvc.delete)
        "
        class="block bg-cancel rounded p-2"
        :class="
          props.hasCaseFlow ? 'bg-cancel' : 'pointer-events-none bg-gray-400'
        "
        @click="deletePost()"
      >
        <span class="text-white font-bold">
          <i class="fa-solid fa-trash mr-2"></i>隱藏
        </span>
      </button>
    </div>
    <div class="p-2 flex" v-else-if="props.detailInfo.status == 'hide'">
      <button
        v-if="
          route.params.category == 'post' &&
          useStore().getSvcAuth(currentSvc.delete)
        "
        class="block rounded p-2 cursor-pointer"
        :class="hasCaseFlow ? 'bg-submit' : 'pointer-events-none bg-gray-400'"
        @click="recoverPost"
      >
        <span class="text-white font-bold">
          <i class="fa-solid fa-bullhorn mr-2"></i>重新上架
        </span>
      </button>
    </div>
    <div class="p-2 flex" v-else>
      <span>無法進行變更。</span>
    </div>
  </div>
</template>
<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { useStore } from "../../store/store";
const Store = useStore();
const route = useRoute();
const router = useRouter();
const props = defineProps(["hasCaseFlow", "detailInfo"]);
const settingToggle = ref(false);
const currentSvc = ref({
  update: "",
  delete: "",
});

const update = () => {
  Store.detailUpdateToggle = true;
  settingToggle.value = false;
};
const getDetailStatusValid = computed(() => {
  if (route.params.category == "post") {
    return props.detailInfo.status == "online";
  } else {
    if (props.detailInfo.status != "checking") {
      return true;
    }
  }
});

onBeforeMount(async () => {
  if (route.params.category == "post") {
    currentSvc.value.update = "UpdatePost";
    currentSvc.value.delete = "DeletePost";
  } else {
    currentSvc.value.update = "UpdateAdvertise";
    // currentSvc.value.delete = "DeletePost";
  }
});

const deletePost = () => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: "即將送出隱藏公告審核，確定要隱藏此公告?",
    func: (e) => {
      if (e.target.value == "confirm") {
        Store.loadingSpinner = true;
        apiRequest
          .post("DeletePost", { uuid: route.params.uuid, status: "1" })
          .then((res) => {
            Store.loadingSpinner = false;
            settingToggle.value = false;
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
  Store.alertShow = true;
  Store.alertObj = {
    msg: "即將送出重新上架審核，確定要重新上架此公告?",
    func: (e) => {
      if (e.target.value == "confirm") {
        Store.loadingSpinner = true;
        apiRequest
          // recover跟delete共用一隻API: status=1是將公告狀態調整為隱藏、0是恢復
          .post("DeletePost", { uuid: route.params.uuid, status: "0" })
          .then((res) => {
            Store.loadingSpinner = false;
            settingToggle.value = false;
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
