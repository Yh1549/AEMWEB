<template>
  <div class="w-1/2 self-center mx-auto h-24">
    <span class="font-bold">使用者名稱</span>
    <label class="w-full inpLabel">
      <input
        type="text"
        class="inp w-full"
        :placeholder="userStore.userEdit?.name"
        v-verify:[nameValidArg]="checking"
        v-model="userStore.userModify.name"
    /></label>
    <inputErrorMsg v-if="checking.pass == false">{{
      checking.msg
    }}</inputErrorMsg>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "../../../store/store";
import inputErrorMsg from "../../inputErrorMsg.vue";

const userStore = useUserStore();

const emit = defineEmits(["checking"]);
const checking = ref({ pass: null, msg: null });
const nameValidArg = ["notNull", "charMax(64)"];
watch(checking.value, () => {
  emit("checking", checking.value);
});
</script>
