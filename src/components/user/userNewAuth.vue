<template>
  <authSet :currentStore="userStore().newUser"></authSet>
  <div>
    <button
      class="btn"
      :class="newSvcToggle ? 'bg-cancel' : 'bg-submit'"
      @click="newSvcToggle = !newSvcToggle"
    >
      {{ newSvcToggle ? "關閉修改" : "開啟修改" }}
    </button>
  </div>
  <authList
    :currentStore="userStore().newUser"
    :change="newSvcToggle"
  ></authList>
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
import { ref } from "vue";
import authList from "./authList.vue";
import authSet from "./authSet.vue";
const newSvcToggle = ref(true);
</script>
