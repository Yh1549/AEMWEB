<template>
  <div class="w-1/2 self-center mx-auto">
    <span class="font-bold">使用者名稱</span>
    <label class="w-full inpLabel">
      <input
        type="text"
        class="inp"
        :placeholder="userStore().userEdit?.name"
        data-valid-option="notNull"
        name="check"
        v-model="userStore().userModify.name"
        @keyup="InputValidation(userStore().userEditCheck, $event)"
    /></label>
    <span
      v-if="getInputValidation(userStore().userEditCheck.check).result == false"
      class="text-cancel font-bold"
      ><i class="fa-solid fa-circle-exclamation mx-2"></i
      >{{ getInputValidation(userStore().userEditCheck.check).msg }}</span
    >
  </div>
</template>
<script setup>
import { userStore } from "../../../store/store";
import {
  InputValidation,
  getInputValidation,
} from "../../../formValidation/inputCase";
</script>
