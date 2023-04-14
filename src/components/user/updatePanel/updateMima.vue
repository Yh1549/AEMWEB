<template>
  <div class="w-1/2 mx-auto">
    <div class="flex">
      <input
        id="toggleSwicthInput"
        type="checkbox"
        v-model="mimaInp"
        class="hidden"
        @change="userStore().userModify.mima = null"
      />
      <label for="toggleSwicthInput" class="toggleSwicth"></label>
      <span class="mx-2 font-bold">
        {{ mimaInp == false ? "點選開始更改新密碼" : "更改中..再次點選關閉" }}
      </span>
    </div>
    <div class="my-4">
      <span class="block">密碼</span>
      <label class="inpLabel w-full">
        <span class="inp" v-if="!mimaInp">*****</span>
        <input
          v-else
          type="password"
          class="inp"
          v-model="userStore().userModify.mima"
        />
      </label>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { userStore } from "../../../store/store";
import apiRequest from "../../../api/apiRequest";
const mimaInp = ref(false);
</script>
