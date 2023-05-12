<template>
  <div class="md:grid md:gap-4 md:grid-cols-2 md:m-5">
    <div class="rounded-t bg-primaryLight/70 p-4">
      <h2 class="border-b-2 border-white text-2xl pb-1 font-bold mb-3">
        新增錯誤代碼
      </h2>
      <div class="w-15/16 mx-auto">
        <div>
          <span class="flex"
            >代碼類型
            <div class="text-cancel">※</div></span
          >
          <label class="inpLabel w-full">
            <input
              type="text"
              name="msgType"
              data-valid-option="notNull,notCn"
              v-model="data.msgType"
              class="w-full inp"
              @keyup="InputValidation(Store().errorCodeCheck, $event)"
            />
          </label>
        </div>
        <div class="flex flex-wrap items-center md:flex-row">
          <div class="flex justify-between w-full">
            <span class="flex"
              >代碼名稱
              <div class="text-cancel">※</div></span
            ><span class="font-bold text-cancel opacity-70">*限英數字</span>
          </div>
          <label class="inpLabel w-full">
            <input
              type="text"
              name="code"
              data-valid-option="notNull,notCn"
              class="w-full inp"
              v-model="data.code"
              @keyup="InputValidation(Store().errorCodeCheck, $event)"
            />
          </label>
          <!-- <span class="mx-3 md:flex items-center font-bold text-base hidden"
            >*限英數字</span
          > -->
        </div>
        <div>
          <span class="flex"
            >代碼描述
            <div class="text-cancel">※</div></span
          >
          <label class="inpLabel w-full">
            <input
              type="text"
              name="desc"
              data-valid-option="notNull"
              v-model="data.desc"
              class="w-full inp"
              @keyup="InputValidation(Store().errorCodeCheck, $event)"
            />
          </label>
        </div>
        <div>
          <span class="block">備註</span>
          <label class="inpLabel w-full">
            <input
              type="text"
              name="memo"
              v-model="data.memo"
              class="w-full inp"
            />
          </label>
        </div>
      </div>
    </div>
    <div>
      <span class="block pt-4 opacity-50 font-bold">確認輸入資料</span>

      <div
        class="flex flex-wrap border-2 border-primaryDark/20 py-3 h-[89%] items-center"
      >
        <div class="w-15/16 mx-auto py-4 flex flex-wrap">
          <div
            v-if="!data.msgType && !data.code && !data.desc && !data.memo"
            class="w-full p-8 bg-secondaryLight rounded flex justify-center"
          >
            <p class="text-xl">請先填寫資料</p>
          </div>

          <div v-else class="w-full flex flex-wrap justify-center">
            <!-- gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 -->
            <div class="w-full md:w-4/5">
              <div
                class="border-2 border-primary bg-white relative rounded p-2"
              >
                <span
                  class="text-sm md:text-base btn pointer-events-none bg-secondaryDark break-words"
                >
                  {{ data.msgType }}
                </span>
                <div class="mt-1">
                  <span class="font-bold break-words">{{ data.code }} </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="w-full break-words"> {{ data.desc }} </span>
                </div>
              </div>
              <div
                class="bg-primaryLight w-full rounded-b p-2 transition-all duration-200 relative"
              >
                <p class="text-sm break-words md:text-base">
                  {{ data.memo }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button class="btn btnClick mt-8 block mx-auto" @click="addMsg()">
    確認送出
  </button>
</template>
<script setup>
import { Store } from "../../../store/store";
import { ref, reactive } from "vue";
import { CreateSysMsg } from "../../../api/service";
import { commonStore } from "../../../store/commonStore";
import router from "../../../router/router";
import { InputValidation } from "../../../formValidation/inputCase";
const data = reactive({
  msgType: null,
  code: null,
  desc: null,
  memo: null,
});
const errorMsg = ref("");
const addMsg = () => {
  let pass = false;
  for (let value in Store().errorCodeCheck) {
    if (Store().errorCodeCheck[value] != null) {
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
    } else {
      pass = false;
      errorMsg.value = "不可為空";
      wrongInfo(value);
      break;
    }
  }
  if (pass === true) {
    Store().alertShow = true;
    Store().alertObj = {
      msg: `確定新增代碼「${data.code}」？`,
      func: async (e) => {
        if (e.target.value === "confirm") {
          const res = await CreateSysMsg(
            data.msgType,
            data.code,
            data.desc,
            data.memo
          );
          if (res.desc == "successful") {
            Store().routerPush = "errorCodeManage";
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
</script>
<style scoped></style>
