<template>
  <div class="w-1/2 mx-auto">
    <div class="flex">
      <input
        id="toggleSwicthInput"
        type="checkbox"
        class="hidden"
        v-model="mimaToggle"
        @change="toggle"
      />
      <label for="toggleSwicthInput" class="toggleSwicth"></label>
      <span class="mx-2 font-bold">
        {{
          mimaToggle == false ? "點選開始更改新密碼" : "更改中..再次點選關閉"
        }}
      </span>
    </div>
    <div class="my-4">
      <span>密碼</span>
      <inputErrorMsg v-if="checking.pass == false">{{
        checking.msg
      }}</inputErrorMsg>
      <label class="inpLabel w-full">
        <input
          type="password"
          :disabled="!mimaToggle"
          class="inp w-full"
          name="mima"
          v-verify:[mimaValidArg]="checking"
          v-model="userStore.userModify.mima"
        />
      </label>
      <span class="text-cancel font-bold whitespace-nowrap"
        >*需為6~12碼，至少包含1個英文大寫字母、1個英文小寫字母、以及1個數字</span
      >
    </div>
  </div>
</template>
<script setup>
import { ref, watch, watchEffect } from "vue";
import { useUserStore } from "../../../store/store";
import inputErrorMsg from "../../inputErrorMsg.vue";

const userStore = useUserStore();

const emit = defineEmits(["checking"]);
const mimaToggle = ref(false);
const checking = ref({ pass: null, msg: null });
const mimaValidArg = ["notNull", "charMin(6)", "charMax(12)", "numMixEn"];
const toggle = () => {
  userStore.userModify.mima = null;
  checking.value.pass = null;
  checking.value.msg = null;
};
watch(checking.value, () => {
  emit("checking", checking.value);
});
watchEffect(() => {
  if (userStore.userUpdateToggle) {
    mimaToggle.value = false;
    toggle();
  }
});
</script>
