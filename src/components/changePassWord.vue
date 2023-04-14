<template>
  <div class="fixed z-[10000] left-0 top-0 w-full h-full bg-black/[.40]"></div>
  <div
    class="absolute top-36 rounded-md border bg-background shadow-lg w-[90%] md:w-[65%] lg:w-[35%] rounded z-[10000]"
  >
    <div class="flex justify-end fill-slate-400 mt-3 mr-3">
      <button
        @click="Store().changePWShow = false"
        v-if="!route.query.closeIcon"
      >
        <i class="fa-solid fa-x"></i>
      </button>
    </div>
    <div class="text-center">
      <div class="items-center">
        <div class="font-bold text-2xl mb-3">變更密碼</div>
        <ul class="flex flex-col px-10 pb-10">
          <li class="py-2 md:py-4 grid md:grid-cols-2 gap-x-8">
            <span class="self-center mb-2 md:mb-0">
              <div class="border-b-2 border-secondaryDark drop-shadow-sm w-fit">
                舊密碼 :
              </div></span
            >
            <label class="inpLabel">
              <input
                type="password"
                name="oldPw"
                data-valid-option="notNull,charMax(12),charMin(6),numMixEn,notCn"
                class="w-full inp block"
                v-model="oldpw"
                @keyup="InputValidation(Store().changePWList, $event)"
              />
            </label>
          </li>
          <li class="py-2 md:py-4 grid md:grid-cols-2 gap-x-8">
            <span class="self-center mb-2 md:mb-0">
              <div class="border-b-2 border-secondaryDark drop-shadow-sm w-fit">
                新密碼 :
              </div>
            </span>
            <label class="inpLabel">
              <input
                type="password"
                name="newPw"
                data-valid-option="notNull,charMax(12),charMin(6),numMixEn,notCn"
                class="w-full inp block"
                v-model="newPw"
                @keyup="InputValidation(Store().changePWList, $event)"
              />
            </label>
          </li>
          <li class="py-2 md:py-4 grid md:grid-cols-2 gap-x-8">
            <span class="self-center mb-2 md:mb-0">
              <div class="border-b-2 border-secondaryDark drop-shadow-sm w-fit">
                確認密碼 :
              </div>
            </span>
            <label class="inpLabel">
              <input
                type="password"
                name="checkPw"
                data-valid-option="notNull"
                class="w-full inp block"
                v-model="checkPw"
                @keyup="InputValidation(Store().changePWList, $event)"
              />
            </label>
          </li>
          <span class="text-cancel font-bold mt-3 self-center"
            >*密碼規則：請輸入6~12碼，英文數字混和</span
          >
          <button
            id="ok-btn"
            class="btn btnClick w-full mt-3"
            @click="changePw"
          >
            變更
          </button>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Store } from "../store/store";
import { ref } from "vue";
import { UpdateUserMiMa } from "../api/service";
import { useRouter, useRoute } from "vue-router";
import {
  InputValidation,
} from "../formValidation/inputCase";
const router = useRouter();
const route = useRoute();
const oldpw = ref(""),
  newPw = ref(""),
  checkPw = ref(""),
  errorMsg = ref("");
const changePw = async () => {
  let pass = false;
  for (let value in Store().changePWList) {
    if (Store().changePWList[value] != null) {
      for (let i of Store().changePWList[value]) {
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
    if (newPw.value != checkPw.value) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "確認密碼錯誤，請確認密碼是否相符",
        func: (e) => {},
      };
    } else {
      const res = await UpdateUserMiMa(oldpw.value, newPw.value);
      if (res.desc == "successful") {
        Store().alertShow = true;
        Store().alertObj = {
          msg: "變更成功，請重新登入",
          func: (e) => {},
        };
        sessionStorage.removeItem("token");
        router.push({
          name: "Login",
        });
      } else if (res.code == "AMS009") {
        Store().alertShow = true;
        Store().alertObj = {
          msg: "舊密碼錯誤，請重新確認",
          func: (e) => {},
        };
      } else {
        Store().alertShow = true;
        Store().alertObj = {
          msg: "更改失敗，請重新確認",
          func: (e) => {},
        };
      }
    }
  }
};
const wrongInfo = (name) => {
  let msgObj = {
    oldPw: "舊密碼",
    newPw: "新密碼",
    checkPw: "確認密碼",
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
<style scoped>
span {
  @apply flex items-center;
}
</style>
