<template>
  <div
    class="w-80 p-2 my-2 inline-block border-2 border-primary bg-white relative rounded"
  >
    <div class="flex justify-between">
      <p class="text-sm bg-secondaryDark p-1 rounded font-bold text-white">
        {{ props.sysMsg.msgType }}
      </p>
      <div class="flex gap-1">
        <button
          v-if="Store.getSvcAuth('UpdateSysMsg')"
          class="bg-primaryDark rounded shadow-lg px-1.5"
          @click="openCard"
        >
          <span class="text-white">
            <i class="fa-solid fa-pen"></i>
          </span>
        </button>
        <button
          v-if="Store.getSvcAuth('DeleteSysMsg')"
          class="bg-cancel rounded shadow-lg px-2"
          @click="delMsg(props.sysMsg.msgType, props.sysMsg.code)"
        >
          <i class="fa-solid fa-trash text-white"></i>
        </button>
      </div>
    </div>
    <p class="font-bold my-1">{{ props.sysMsg.code }}</p>
    <p>{{ props.sysMsg.desc }}</p>
    <hr class="my-2" />
    <p class="text-sm opacity-80">代碼備註 :</p>
    <p class="text-sm whitespace-nowrap overflow-x-scroll scrollbar">
      {{ props.sysMsg.memo }}
    </p>
  </div>
</template>
<script setup>
import { DeleteSysMsg } from "../api/service";
import router from "../router/router";
import { useCommonStore } from "../store/commonStore";
import { useStore } from "../store/store";
const Store = useStore();
const commonStore = useCommonStore();

const props = defineProps(["sysMsg"]);
const emit = defineEmits(["cardEmit"]);

const openCard = () => {
  emit("cardEmit", props.sysMsg);
};

const delMsg = (msgType, code) => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定刪除代碼「${msgType} ${code}」嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await DeleteSysMsg(msgType, code);
        if (res.desc == "successful") {
          router.push({
            name: "SvcSucess",
          });
        } else {
          commonStore.SvcFail.msg = res.desc;
          router.push({
            name: "SvcFail",
          });
        }
      }
    },
  };
};
</script>
