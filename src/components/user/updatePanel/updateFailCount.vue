<template>
  <div class="w-1/2 self-center mx-auto">
    <span class="font-bold">密碼失敗次數</span>
    <div class="w-full inpLabel">
      <span class="inp">{{ userStore.userEdit.failcnt }}</span>
    </div>
    <div class="w-full text-center py-2">
      <label class="">
        <i
          v-if="userStore.userModify.failcnt != '0'"
          class="fa-regular fa-circle text-primaryLight text-[20px]"
        ></i>
        <i
          v-else
          class="fa-solid fa-circle-check text-primaryDark text-[20px]"
        ></i>
        <input
          type="radio"
          class="hidden"
          value="0"
          v-model="userStore.userModify.failcnt"
          @change="emit('checking', checking)"
        />
        <span class="px-2 font-bold">重置次數</span>
      </label>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useUserStore } from "../../../store/store";
const userStore = useUserStore();

const emit = defineEmits(["checking"]);
const checking = ref({ pass: true, msg: null });
</script>
