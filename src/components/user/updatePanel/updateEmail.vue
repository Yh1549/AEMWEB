<template>
  <div class="w-1/2 self-center mx-auto">
    <span class="font-bold">e-mail</span>
    <label class="w-full inpLabel">
      <span class="inp">{{ userStore().userEdit.email }}</span>
    </label>
    <div class="w-full text-center py-2">
      <label class="">
        <i
          v-if="userStore().userModify.email != '@'"
          class="fa-regular fa-circle text-primaryLight text-[20px]"
        ></i>
        <i
          v-else
          class="fa-solid fa-circle-check text-primaryDark text-[20px]"
        ></i>
        <input
          type="radio"
          class="hidden"
          value="@"
          v-model="userStore().userModify.email"
        />
        <span class="px-2 font-bold">重置信箱</span>
      </label>
    </div>
  </div>
</template>
<script setup>
import { userStore } from "../../../store/store";
</script>
