<template>
  <div class="w-1/2 mx-auto">
    <span class="block text-cancel mb-2">
      注意！變更使用者部門與管理功能將立即登出該使用者，請謹慎使用
    </span>
    <span
      >目前所屬部門:{{
        Store().getDeptName(userStore().userEdit.deptcode)?.name ?? "無"
      }}{{
        Store().getDeptName(userStore().userEdit.deptcode)?.unit ?? "無"
      }}</span
    >
    <span class="block"
      >是否為部門管理員:{{
        (userStore().userEdit.range?.length ?? 0) == 0 ? "否" : "是"
      }}</span
    >
    <label class="inpLabel w-full">
      <select
        v-model="userStore().userModify.deptcode"
        class="inp w-full"
        :disabled="!rangeValid"
        @change="deptChangeRange"
      >
        <option
          v-for="unit in Store().postOption.Unit"
          :value="unit.code"
          :key="unit"
        >
          {{ unit.name }}
          {{ unit.unit }}
        </option>
      </select></label
    >
    <div
      class="flex items-center justify-between border-2 my-2 px-2 border-primaryDark rounded bg-white"
    >
      <span
        class="block p-2 font-bold"
        :class="toggleUpdate ? '' : 'opacity-50'"
        >管理功能</span
      ><input
        id="toggleSwicthInput"
        class="hidden"
        type="checkbox"
        v-model="toggleUpdate"
        @change="rangeToggle"
        :disabled="!rangeValid"
      />
      <label for="toggleSwicthInput" class="toggleSwicth"></label>
    </div>
    <div v-if="toggleUpdate" class="flex flex-wrap">
      <label
        v-for="item of userStore().userRangeAll"
        :key="item"
        class="w-full md:w-48 p-2 m-2 border-2 rounded box-border"
        :class="[
          userStore().userModify.range.some((el) => el === item.code)
            ? 'border-primaryDark bg-secondaryLight/50'
            : 'border-primary ',
          toggleUpdate ? 'hover:border-secondary cursor-pointer' : '',
        ]"
      >
        <div class="flex">
          <i
            v-if="!userStore().userModify.range.some((el) => el === item.code)"
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
            v-model="userStore().userModify.range"
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
</template>
<script setup>
import { ref, onBeforeMount, watchEffect } from "vue";
import { userStore, Store } from "../../../store/store";
import { checkRangeValid } from "../../../api/service";
const rangeValid = ref(false);
const toggleUpdate = ref(false);

const deptChangeRange = () => {
  userStore().userModify.range = [];
  let userDeptCode = userStore().userModify.deptcode.slice(0, 3);
  for (let item of userStore().userRangeAll) {
    if (item.code.slice(0, 3) == userDeptCode) {
      console.log(item);
      userStore().userModify.range.push(item.code);
    }
  }
};

const rangeToggle = () => {
  userStore().userModify.range = [];
  if (toggleUpdate.value) {
    for (let i = 0; i < userStore().userEdit.range.length; i++) {
      userStore().userModify.range[i] = userStore().userEdit.range[i].code;
    }
    let userDeptCode = userStore().userModify.deptcode.slice(0, 3);
    for (let item of userStore().userRangeAll) {
      if (item.code.slice(0, 3) == userDeptCode) {
        userStore().userModify.range.push(item.code);
      }
    }
  } else {
    userStore().userModify.range = [];
  }
};

onBeforeMount(async () => {
  userStore().userModify.range = [];
  userStore().userModify.deptcode = userStore().userEdit.deptcode;
  if ((userStore().userEdit.range?.length ?? 0) == 0) {
    toggleUpdate.value = false;
    userStore().userModify.range = [];
  } else {
    toggleUpdate.value = true;
    for (let i = 0; i < userStore().userEdit.range.length; i++) {
      userStore().userModify.range[i] = userStore().userEdit.range[i];
    }
  }
  let res = await checkRangeValid();
  if (res.desc == "successful") {
    if (res.resBody.rangeValid == "true") {
      rangeValid.value = true;
    } else {
      rangeValid.value = false;
    }
    userStore().userRangeAll = res.resBody.rangeList;
  } else {
  }
});
watchEffect(() => {});
</script>
