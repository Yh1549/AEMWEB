<template>
  <div class="w-1/2 self-center mx-auto h-24">
    <span class="font-bold">備註</span>
    <label class="w-full inpLabel">
      <input
        type="text"
        class="inp w-full"
        :placeholder="userStore.userEdit.memo"
        v-verify:[memoValidArg]="checking"
        v-model="userStore.userModify.memo"
    /></label>
    <inputErrorMsg v-if="checking.pass == false">{{
      checking.msg
    }}</inputErrorMsg>
  </div>
</template>
<script setup>
import { ref, watch, watchEffect } from "vue";
import { useUserStore } from "../../../store/store";
import inputErrorMsg from "../../inputErrorMsg.vue";

const userStore = useUserStore();

const emit = defineEmits(["checking"]);
const memoValidArg = ["charMax(64)"];
const checking = ref({ pass: null, msg: null });
watch(checking.value, () => {
  emit("checking", checking.value);
});
watchEffect(() => {
  if (userStore.userUpdateToggle) {
    checking.value.pass = null;
    checking.value.msg = null;
  }
});
</script>
