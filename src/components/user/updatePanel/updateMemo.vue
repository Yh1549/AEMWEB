<template>
  <div class="w-1/2 self-center mx-auto">
    <span class="font-bold">備註</span>
    <label class="w-full inpLabel">
      <input
        type="text"
        class="inp w-full"
        data-valid-option="notNull"
        name="check"
        maxlength="64"
        :placeholder="userStore().userEdit.memo"
        v-model="userStore().userModify.memo"
        @keyup="InputValidation(userStore().userEditCheck, $event)"
    /></label>
  </div>
</template>
<script setup>
import { userStore } from "../../../store/store";
</script>
