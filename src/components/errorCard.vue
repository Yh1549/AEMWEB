<template>
  <div class="w-full md:w-1/3 lg:w-1/4 p-2">
    <div class="border-2 border-primary bg-white relative rounded p-2">
      <div class="">
        <span
          class="text-sm md:text-base btn pointer-events-none bg-secondaryDark"
        >
          {{ sysMsg.sysMsg.msgType }}
        </span>
        <div class="absolute right-2 top-1 flex gap-1">
          <button
            v-if="Store().getSvcAuth('UpdateSysMsg')"
            class="bg-primaryDark rounded shadow-lg px-1.5"
            @click="openCard"
          >
            <span class="text-white">
              <i class="fa-solid fa-pen"></i>
            </span>
          </button>
          <button
            v-if="Store().getSvcAuth('DeleteSysMsg')"
            class="bg-cancel rounded shadow-lg px-2"
            @click="delMsg(sysMsg.sysMsg.msgType, sysMsg.sysMsg.code)"
          >
            <i class="fa-solid fa-trash text-white"></i>
          </button>
        </div>
      </div>
      <div class="mt-1">
        <span class="font-bold">{{ sysMsg.sysMsg.code }} </span>
      </div>
      <div class="flex justify-between items-center">
        <span class=""> {{ sysMsg.sysMsg.desc }} </span>
      </div>
    </div>
    <div
      class="bg-primaryLight w-full rounded-b p-2 transition-all duration-200 relative"
    >
      <p class="text-sm md:text-base overflow-x-auto">
        {{ sysMsg.sysMsg.memo }}
      </p>
    </div>
  </div>
  <!---->
  <div
    v-if="showCard"
    class="fixed z-50 left-0 top-0 w-full h-full bg-black/[.40] grid place-items-center"
  >
    <div
      class="absolute rounded-md border bg-background shadow-lg inset-y-16 md:inset-y-24 w-[90%] md:w-[50%] lg:w-[35%] rounded z-50 overflow-y-auto"
    >
      <div class="flex justify-end fill-slate-400 mt-3 mr-3">
        <button @click="showCard = false">
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
      <div class="items-center text-center">
        <div class="font-bold text-2xl mb-3">修改代碼</div>
        <ul class="flex flex-col px-10 pb-10">
          <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
            <span class="self-center pb-2 md:pb-0">
              <div
                class="border-b-2 border-secondaryDark drop-shadow-sm w-fit flex"
              >
                代碼類型
                <div class="text-cancel">※</div>
              </div></span
            >
            <label class="inpLabel col-span-2">
              <input
                type="text"
                name="msgType"
                data-valid-option="notNull,notCn"
                class="w-full inp block col-span-2"
                v-model="data.msgType"
                @keyup="InputValidation(Store().errorCodeCheck, $event)"
            /></label>
          </li>
          <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
            <span class="self-center pb-2 md:pb-0">
              <div
                class="border-b-2 border-secondaryDark drop-shadow-sm w-fit flex"
              >
                代碼名稱
                <div class="text-cancel">※</div>
              </div></span
            >
            <label class="inpLabel col-span-2">
              <input
                type="text"
                name="code"
                data-valid-option="notNull,notCn"
                class="w-full inp block col-span-2"
                v-model="data.code"
                @keyup="InputValidation(Store().errorCodeCheck, $event)"
            /></label>
          </li>
          <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
            <span class="self-center pb-2 md:pb-0">
              <div
                class="border-b-2 border-secondaryDark drop-shadow-sm w-fit flex"
              >
                代碼描述
                <div class="text-cancel">※</div>
              </div></span
            >
            <label class="inpLabel col-span-2">
              <input
                type="text"
                name="desc"
                data-valid-option="notNull"
                class="w-full inp block col-span-2"
                v-model="data.desc"
                @keyup="InputValidation(Store().errorCodeCheck, $event)"
            /></label>
          </li>
          <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
            <span class="self-center pb-2 md:pb-0">
              <div
                class="border-b-2 border-secondaryDark drop-shadow-sm w-fit flex"
              >
                備註
              </div></span
            >
            <label class="inpLabel col-span-2">
              <input
                type="text"
                name="memo"
                class="w-full inp block"
                v-model="data.memo"
            /></label>
          </li>
          <div class="flex justify-between md:justify-evenly mt-3">
            <button
              class="btn btnClick w-fit bg-transparent text-black border-primaryDark border-2"
              @click="showCard = false"
            >
              取消
            </button>
            <button id="ok-btn" class="btn btnClick w-fit" @click="updateMsg">
              確定
            </button>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "@vue/reactivity";
import { Store } from "../store/store";
import { DeleteSysMsg, UpdateSysMsg } from "../api/service";
import { commonStore } from "../store/commonStore";
import router from "../router/router";
import { update } from "lodash";
import { InputValidation } from "../formValidation/inputCase";
const sysMsg = defineProps(["sysMsg"]);
const showCard = ref(false);
const data = reactive({
  msgType: "",
  code: "",
  desc: "",
  memo: "",
});
const errorMsg = ref("");
const openCard = () => {
  data.msgType = sysMsg.sysMsg.msgType;
  data.code = sysMsg.sysMsg.code;
  data.desc = sysMsg.sysMsg.desc;
  data.memo = sysMsg.sysMsg.memo;
  showCard.value = true;
};
const updateMsg = () => {
  let pass = false;
  for (let value in Store().errorCodeCheck) {
    for (let i of Store().errorCodeCheck[value]) {
      if (i.result === false) {
        pass = false;
        errorMsg.value = i.msg;
        wrongInfo(value);
        break;
      } else {
        pass = true;
      }
    }
    if (!pass) {
      break;
    }
  }
  if (pass === true) {
    Store().alertShow = true;
    Store().alertObj = {
      msg: `確定修改代碼「${sysMsg.sysMsg.msgType} ${sysMsg.sysMsg.code}」嗎？`,
      func: async (e) => {
        if (e.target.value === "confirm") {
          const res = await UpdateSysMsg(
            sysMsg.sysMsg.msgType,
            sysMsg.sysMsg.code,
            data.msgType,
            data.code,
            data.desc,
            data.memo
          );
          if (res.desc == "successful") {
            router.push({
              name: "SvcSucess",
            });
          } else {
            commonStore().SvcFail.msg = res.desc;
            router.push({
              name: "SvcFail",
            });
          }
        }
      },
    };
  }
};
const wrongInfo = (name) => {
  let msgObj = {
    msgType: "代碼類型",
    code: "代碼名稱",
    desc: "代碼描述",
  };
  for (let i = 0; i < Object.keys(msgObj).length; i++) {
    if (Object.keys(msgObj)[i] == name) {
      Store().alertObj.msg = Object.values(msgObj)[i] + " " + errorMsg.value;
      break;
    }
  }
  Store().alertShow = true;
  Store().alertObj.func = (e) => {};
};
const delMsg = (msgType, code) => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `確定刪除代碼「${msgType} ${code}」嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await DeleteSysMsg(msgType, code);
        if (res.desc == "successful") {
          router.push({
            name: "SvcSucess",
          });
        } else {
          commonStore().SvcFail.msg = res.desc;
          router.push({
            name: "SvcFail",
          });
        }
      }
    },
  };
};
</script>
