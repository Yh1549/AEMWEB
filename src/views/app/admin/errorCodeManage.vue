<template>
  <div class="flex flex-row p-2 justify-between">
    <router-link
      v-if="Store.getSvcAuth('CreateSysMsg')"
      class="block self-center bg"
      :to="{ name: 'errorCodeNew' }"
      ><button class="btn pointer-events-none px-2 bg-submit text-base">
        新增錯誤代碼<i class="fa-solid fa-plus pl-1"></i></button
    ></router-link>
    <button
      class="btn bg-secondaryDark flex items-center px-2 text-black text-base"
      @click="cloud"
      v-if="Store.getSvcAuth('ReloadSysMsg')"
    >
      同步資料
      <div class="relative ml-1">
        <i class="fa-solid fa-cloud text-lg"></i
        ><i
          class="fa-solid fa-rotate text-[8px] text-secondaryDark absolute left-1.5 top-1.5"
        ></i>
      </div>
    </button>
  </div>
  <hr class="my-2" />
  <div class="flex flex-wrap justify-between">
    <error-card
      v-for="item in Store.sysMsg"
      :sysMsg="item"
      :key="item.code"
      @cardEmit="openCard"
    ></error-card>
  </div>
  <dialog
    ref="dialog"
    @close="reset"
    class="w-[35%] rounded bg-background shadow-lg overflow-y-auto scrollbar"
  >
    <div class="flex justify-between my-2">
      <p>修改錯誤代碼</p>
      <button @click="dialog.close()">
        <span class="font-bold text-cancel text-lg"> X </span>
      </button>
    </div>
    <p class="my-2 font-bold">{{ card.code }}{{ card.desc }}</p>
    <form>
      <div class="flex flex-col w-72 mx-auto h-24">
        <span>代碼類型</span>
        <label class="inpLabel">
          <input
            type="text"
            class="w-full inp block"
            v-verify:[msgTypeValidArg]="errorMsgCheckList.msgType"
            :placeholder="card.msgType"
            v-model="errorMsgChange.msgType"
        /></label>
        <inputErrorMsg v-if="errorMsgCheckList.msgType.pass == false">{{
          errorMsgCheckList.msgType.msg
        }}</inputErrorMsg>
      </div>
      <div class="flex flex-col w-72 mx-auto h-24">
        <span>代碼名稱</span>
        <label class="inpLabel">
          <input
            type="text"
            class="w-full inp block"
            v-verify:[codeValidArg]="errorMsgCheckList.code"
            :placeholder="card.code"
            v-model="errorMsgChange.code"
        /></label>
        <inputErrorMsg v-if="errorMsgCheckList.code.pass == false">{{
          errorMsgCheckList.code.msg
        }}</inputErrorMsg>
      </div>
      <div class="flex flex-col w-72 mx-auto h-24">
        <span>代碼描述</span>
        <label class="inpLabel">
          <input
            type="text"
            class="w-full inp block"
            v-verify:[descValidArg]="errorMsgCheckList.desc"
            :placeholder="card.desc"
            v-model="errorMsgChange.desc"
        /></label>
        <inputErrorMsg v-if="errorMsgCheckList.desc.pass == false">{{
          errorMsgCheckList.desc.msg
        }}</inputErrorMsg>
      </div>
      <div class="flex flex-col w-72 mx-auto h-24">
        <span>備註</span>
        <label class="inpLabel">
          <input
            type="text"
            class="w-full inp block"
            :placeholder="card.memo"
            v-model="errorMsgChange.memo"
        /></label>
        <inputErrorMsg v-if="errorMsgCheckList.memo.pass == false">{{
          errorMsgCheckList.memo.msg
        }}</inputErrorMsg>
      </div>
    </form>
    <div class="h-12 text-center">
      <inputErrorMsg v-if="error == true"> 資料有誤,請重新確認</inputErrorMsg>
    </div>
    <div class="flex justify-center gap-8">
      <button class="btn bg-cancel" @click="dialog.close()">取消變更</button>
      <button class="btn bg-submit" @click="updateMsg">儲存</button>
    </div>
  </dialog>
</template>
<script setup>
import { ref } from "vue";
import { ReloadSysMsg, UpdateSysMsg } from "../../../api/service";
import errorCard from "../../../components/errorCard.vue";
import inputErrorMsg from "../../../components/inputErrorMsg.vue";
import router from "../../../router/router";
import { useCommonStore } from "../../../store/commonStore";
import { useStore } from "../../../store/store";
const commonStore = useCommonStore();
const Store = useStore();

const dialog = ref(null);
const card = ref({});
const error = ref("");
const errorMsgChange = ref({
  msgType: "",
  code: "",
  desc: "",
  memo: "",
});
const errorMsgCheckList = ref({
  msgType: { pass: null, msg: null },
  code: { pass: null, msg: null },
  desc: { pass: null, msg: null },
  memo: { pass: null, msg: null },
});
const msgTypeValidArg = ["notNull", "notCn"];
const codeValidArg = ["notNull", "notCn"];
const descValidArg = ["notNull"];

const openCard = (value) => {
  card.value = value;
  dialog.value.showModal();
};

const reset = () => {
  errorMsgChange.value.msgType = "";
  errorMsgCheckList.value.msgType = null;
  errorMsgChange.value.code = "";
  errorMsgCheckList.value.code = null;
  errorMsgChange.value.desc = "";
  errorMsgCheckList.value.desc = null;
  errorMsgChange.value.memo = "";
  errorMsgCheckList.value.memo = null;
  error.value = "";
};
const validCheck = () => {
  for (let item in errorMsgCheckList.value) {
    if (errorMsgCheckList.value[item].pass != true) {
      return false;
    }
  }
  return true;
};
const updateMsg = async () => {
  if (validCheck() != true) {
    error.value = true;
    return;
  }
  const res = await UpdateSysMsg(
    card.value.msgType,
    card.value.code,
    errorMsgChange.value.msgType,
    errorMsgChange.value.code,
    errorMsgChange.value.desc,
    errorMsgChange.value.memo
  );
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
};
const cloud = () => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定要同步錯誤代碼嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await ReloadSysMsg();
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
