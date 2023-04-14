<template>
  <authSet :currentStore="userStore().newUser"></authSet>
  <authList :currentStore="userStore().newUser"></authList>
  <div class="flex justify-evenly">
    <button
      class="btn btnClick bg-primaryDark my-8"
      @click="Store().currentNewStep = 'usernewBasic'"
    >
      上一步
    </button>
    <button
      class="btn btnClick bg-primaryDark my-8"
      @click="
        if (userStore().userRangeValid) {
          Store().currentNewStep = 'userNewRange';
        } else {
          Store().currentNewStep = 'usernewConfirm';
        }
      "
    >
      下一步
    </button>
  </div>
</template>
<script setup>
import { Store, userStore } from "../../store/store";
import authList from "./authList.vue";
import authSet from "./authSet.vue";
</script>
