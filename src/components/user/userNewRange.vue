<template>
  <span class="block py-4 opacity-50 font-bold">設定此使用者部門權限</span>
  <div class="w-full p-4 mb-8 border-2 border-primaryLight rounded">
    <div class="flex items-center gap-4">
      <input
        id="toggleSwicthInput"
        class="hidden"
        type="checkbox"
        v-model="toggleUpdate"
        @change="rangeToggle"
      />
      <label for="toggleSwicthInput" class="toggleSwicth"></label>
      <span
        class="block py-4 font-bold"
        :class="toggleUpdate ? '' : 'opacity-50'"
        >將<span class="font-bold text-primaryDark"
          >{{ props.newUser.name }} </span
        >設定為{{ toggleUpdate ? "部門管理員" : "一般使用者" }}，目前所屬部門:{{
          Store.getDeptName(props.newUser.deptcode)?.name ?? "無"
        }}
        科別:{{ Store.getDeptName(props.newUser.deptcode)?.unit ?? "無" }}</span
      >
    </div>
    <div class="flex flex-wrap">
      <label
        v-for="item of userStore.userRangeAll"
        :key="item"
        class="w-full md:w-48 p-2 m-2 border-2 rounded box-border"
        :class="[
          props.newUser.range.some((el) => el === item.code)
            ? 'border-primaryDark bg-secondaryLight/50'
            : 'border-primary ',
          toggleUpdate ? 'hover:border-secondary cursor-pointer' : '',
        ]"
      >
        <div class="flex">
          <i
            v-if="!props.newUser.range.some((el) => el === item.code)"
            class="fa-regular fa-circle text-primaryLight text-[32px]"
          ></i>
          <i
            v-else
            class="fa-solid fa-circle-check text-primaryDark text-[32px]"
          ></i>
          <input
            type="checkbox"
            :disabled="!toggleUpdate"
            :value="item.code"
            v-model="props.newUser.range"
            hidden
          />
        </div>
        <div class="w-full my-2">
          <span class="hidden md:block text-sm">代碼:{{ item.code }}</span>
          <span class="font-bold block">{{ item.name }}</span>
          <span class="font-bold hidden md:block text-sm">{{ item.unit }}</span>
        </div>
      </label>
    </div>
  </div>
  <div class="flex justify-evenly">
    <button
      class="btn btnClick bg-primaryDark my-8"
      @click="Store.currentNewStep = 'usernewAuth'"
    >
      上一步
    </button>
    <button class="btn btnClick bg-primaryDark my-8" @click="nextStep">
      下一步
    </button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useStore, useUserStore } from "../../store/store";
const Store = useStore();
const userStore = useUserStore();

const props = defineProps(["newUser"]);
const emit = defineEmits(["newUserConfirm"]);

const toggleUpdate = ref(false);
const rangeToggle = () => {
  if (toggleUpdate.value) {
    let userDeptCode = props.newUser.deptcode.slice(0, 3);
    for (let item of userStore.userRangeAll) {
      if (item.code.slice(0, 3) == userDeptCode) {
        props.newUser.range.push(item.code);
      }
    }
  } else {
    props.newUser.range = [];
  }
};
const nextStep = () => {
  Store.currentNewStep = "usernewConfirm";
  emit("newUserConfirm", props.newUser);
};
</script>
