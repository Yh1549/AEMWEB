<template>
  <div class="w-full bg-primaryLight">
    <button
      v-for="tab of tabs"
      class="w-1/2 md:w-48 py-4 border-primary text-center font-bold hover:cursor-pointer hover:bg-gray-900/5 box-border text-lg"
      :class="{
        'border-secondaryDark border-b-4 bg-gray-900/5 text-white':
          tabCurrent === tab,
        'bg-primaryLight': tabCurrent !== tab,
      }"
      :key="tab"
      @click="tabChange"
    >
      {{ tab }}
    </button>
  </div>
  <!-- 關聯系統 -->
  <systemsManage v-if="optionsManage == 'systems'" />
  <!-- 部門單位 -->
  <unitsManage v-else-if="optionsManage == 'units'" />
</template>

<script setup>
import { ref } from "vue";
import systemsManage from "../../../components/optionsManage/systemsManage.vue";
import unitsManage from "../../../components/optionsManage/unitsManage.vue";

const optionsManage = ref("systems");
// tabs
const tabs = ref(["關聯系統選項", "部門單位選項"]);
const tabCurrent = ref("關聯系統選項");
const tabChange = (e) => {
  if (e) {
    tabCurrent.value = e.target.innerText;
    if (e.target.innerText === "關聯系統選項") {
      optionsManage.value = "systems";
    } else if (e.target.innerText === "部門單位選項") {
      optionsManage.value = "units";
    }
  }
};
</script>
