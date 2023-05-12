<template>
  <span class="block py-4 opacity-50 font-bold">填寫使用者基本資料</span>
  <div
    class="w-full flex flex-col items-center p-4 mb-8 border-2 border-primaryLight rounded"
  >
    <span class="">使用者姓名</span>
    <div class="flex flex-col w-full md:w-1/2">
      <label
        class="userNewBasicLabel inpLabel"
        :class="{
          inputInValid:
            getInputValidation(userStore().newUserCheckList.name).result ==
            false,
        }"
      >
        <input
          class="inp"
          type="text"
          maxlength="24"
          placeholder="請輸入姓名"
          name="name"
          data-valid-option="notNull"
          v-model.trim="userStore().newUser.name"
          @keyup="InputValidation(userStore().newUserCheckList, $event)"
        /> </label
      ><span
        v-if="
          getInputValidation(userStore().newUserCheckList.name).result == false
        "
        class="text-cancel font-bold"
        ><i class="fa-solid fa-circle-exclamation mx-2"></i
        >{{ getInputValidation(userStore().newUserCheckList.name).msg }}</span
      >
    </div>
    <span>員工編號</span>
    <div class="flex flex-col w-full md:w-1/2">
      <label
        class="userNewBasicLabel inpLabel"
        :class="{
          inputInValid:
            getInputValidation(userStore().newUserCheckList.empid).result ==
            false,
        }"
      >
        <input
          class="inp"
          type="tel"
          maxlength="8"
          placeholder="請輸入員工編號"
          name="empid"
          data-valid-option="notNull"
          v-model="userStore().newUser.empid"
          @keyup="InputValidation(userStore().newUserCheckList, $event)"
        />
      </label>
      <span
        v-if="
          getInputValidation(userStore().newUserCheckList.empid).result == false
        "
        class="text-cancel font-bold"
        ><i class="fa-solid fa-circle-exclamation mx-2"></i
        >{{ getInputValidation(userStore().newUserCheckList.empid).msg }}</span
      >
    </div>
    <span>密碼</span>
    <div class="flex flex-col w-full md:w-1/2">
      <label
        class="userNewBasicLabel inpLabel"
        :class="
          getInputValidation(userStore().newUserCheckList.mima).result
            ? ''
            : 'border-cancel'
        "
      >
        <input
          class="inp"
          type="password"
          placeholder="請輸入密碼"
          name="mima"
          data-valid-option="notNull,charMax(12),charMin(6),numMixEn"
          v-model="userStore().newUser.mima"
          @keyup="
            InputValidation(userStore().newUserCheckList, $event)
          " /></label
      ><span class="text-cancel font-bold"
        >*密碼規則:請輸入6~12碼，英文數字混和</span
      >
      <span
        v-if="!getInputValidation(userStore().newUserCheckList.mima).result"
        class="text-cancel font-bold"
        ><i class="fa-solid fa-circle-exclamation mx-2"></i
        >{{ getInputValidation(userStore().newUserCheckList.mima).msg }}
      </span>
    </div>
    <span>確認密碼</span>
    <div class="flex flex-col w-full md:w-1/2">
      <label
        class="userNewBasicLabel inpLabel"
        :class="{
          inputInValid:
            getInputValidation(userStore().newUserCheckList.mimaDouble)
              .result == false,
        }"
      >
        <input
          class="inp"
          type="password"
          placeholder="請再次輸入密碼"
          v-model="userStore().mimaDoubleCheck"
          @keyup="doubleCheck"
        /> </label
      ><span
        v-if="
          getInputValidation(userStore().newUserCheckList.mimaDouble).result ==
          false
        "
        class="text-cancel font-bold"
        ><i class="fa-solid fa-circle-exclamation mx-2"></i
        >{{
          getInputValidation(userStore().newUserCheckList.mimaDouble).msg
        }}</span
      >
    </div>
    <span>部門</span>
    <div class="flex flex-col w-full md:w-1/2">
      <label class="userNewBasicLabel inpLabel">
        <select
          class="inp w-full"
          name="deptcode"
          data-valid-option="notNull"
          v-model="userStore().newUser.deptcode"
          :class="{
            inputInValid:
              getInputValidation(userStore().newUserCheckList.deptcode)
                .result == false,
          }"
          @change="InputValidation(userStore().newUserCheckList, $event)"
        >
          <option
            v-for="item in Store().postOption.Unit"
            :key="item.code"
            :value="item.code"
          >
            {{ item.name }}
            {{ item.unit }}
          </option>
        </select>
      </label>
    </div>
    <span>備註 </span>
    <div class="flex flex-col w-full md:w-1/2">
      <label
        class="userNewBasicLabel inpLabel"
        :class="
          getInputValidation(userStore().newUserCheckList.memo).result
            ? ''
            : 'border-cancel'
        "
      >
        <input
          class="inp"
          type="text"
          name="memo"
          placeholder="備註說明"
          data-valid-option="charMax(64)"
          v-model="userStore().newUser.memo"
          @keyup="InputValidation(userStore().newUserCheckList, $event)"
        />
      </label>
      <span
        v-if="!getInputValidation(userStore().newUserCheckList.memo).result"
        class="text-cancel font-bold"
        ><i class="fa-solid fa-circle-exclamation mx-2"></i
        >{{ getInputValidation(userStore().newUserCheckList.memo).msg }}
      </span>
    </div>
    <button class="btn btnClick bg-primaryDark my-8" @click="nextStep">
      下一步
    </button>
  </div>
</template>
<script setup>
import { userStore, Store } from "../../store/store";
import { computed, ref } from "vue";
import {
  InputValidation,
  getInputValidation,
} from "../../formValidation/inputCase";
const wrongInfo = {
  name: "姓名",
  empid: "員工編號",
  mima: "密碼",
  mimaDouble: "確認密碼",
  deptcode: "部門",
  title: "職稱",
};
const doubleCheck = () => {
  if (userStore().mimaDoubleCheck != userStore().newUser.mima) {
    userStore().newUserCheckList.mimaDouble = [
      {
        result: false,
        msg: "與密碼不符合",
      },
    ];
  } else {
    userStore().newUserCheckList.mimaDouble = [
      {
        result: true,
        msg: "ok",
      },
    ];
  }
};
const nextStep = () => {
  for (let item in userStore().newUserCheckList) {
    if (userStore().newUserCheckList[item] != null) {
      for (let i of userStore().newUserCheckList[item]) {
        if (i.result === false) {
          Store().alertShow = true;
          Store().alertObj = {
            msg: `${wrongInfo[item]}輸入有誤，請重新檢查`,
            func: (e) => {},
          };
          return false;
        }
      }
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: `輸入有誤，請重新檢查是否有空白`,
        func: (e) => {},
      };
      return false;
    }
  }
  Store().currentNewStep = "usernewAuth";
};
</script>
<style scoped>
.userNewBasicLabel {
  @apply my-2;
}
.userNewBasicLabel input {
  @apply w-full;
}
.userNewBasicLabel span {
  @apply block self-center pointer-events-none font-bold m-1;
}
</style>
