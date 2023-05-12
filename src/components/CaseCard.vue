<template>
  <div class="p-2 w-full">
    <div
      class="py-4 bg-background rounded z-50 shadow-md relative border-2 border-primaryDark"
    >
      <div class="my-auto mx-2">
        <div class="flex justify-between items-center">
          <span class="block text-sm opacity-70 w-fit py-1 rounded">{{
            flowCode
          }}</span>
          <span
            class="text-sm rounded px-2"
            :class="{
              'bg-secondary': type == 'POST',
              'bg-primaryLight': type == 'AD',
            }"
            >{{ commonStore().caseType[type]?.title }}</span
          >
        </div>
        <span class="block font-bold w-fit border-primaryLight">
          {{ flowName }}
        </span>
        <span class="block text-sm my-2">流程共 {{ totalLevels }} 層</span>
      </div>
      <div class="absolute bottom-0 right-0 opacity-50">
        <img src="../assets/caseflowimg-pd30.svg" class="w-20" />
      </div>
    </div>
    <div
      v-if="route.path === '/caseflow'"
      class="flex flex-col relative -top-14 transition-all"
    >
      <div class="w-full h-14 bg-primaryLight/50 pt-3">
        <button
          class="cardButton"
          @click="
            router.push({
              name: 'caseflowDetail',
              params: {
                id: flowCode,
              },
            })
          "
        >
          查看細節
        </button>
      </div>
      <!-- 下拉箭號 -->
      <div
        class="w-full rounded-b bg-primaryLight flex justify-center py-1 cursor-pointer hover:bg-secondary"
        @click="toggle"
      >
        <div
          class="transition-all duration-500 pointer-events-none"
          :class="toggleRotate ? '' : 'rotate-180'"
        >
          <i class="mx-auto fa-solid fa-chevron-up"></i>
        </div>
      </div>
      <!-- 下拉箭號 -->
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiRequest from "../api/apiRequest";
import { commonStore } from "../store/commonStore";
const Prop = defineProps({ flow: Object });
const flowCode = ref(Prop.flow.flow);
const flowName = ref(Prop.flow.memo);
const totalLevels = ref(Prop.flow.totalLevel);
const relSys = ref(Prop.flow.relSys);
const type = ref(Prop.flow.type);
const toggleRotate = ref(false);
const router = useRouter();
const route = useRoute();
// 刪除
let caseDelete = (e) => {
  // apiRequest.post().then().catch()
};
// 箭號下拉
const toggle = (e) => {
  let target = e.target.parentNode.classList;
  let targetChild = e.target.firstChild.classList;
  toggleRotate.value = !toggleRotate.value;
  if (target.contains("-top-14")) {
    target.remove("-top-14");
    target.add("-top-2");
    targetChild.add("active");
  } else {
    target.remove("-top-2");
    target.add("-top-14");
    targetChild.remove("active");
  }
};
</script>
<style scoped>
.cardButton {
  @apply bg-background p-1 rounded mx-2 my-1 font-bold text-primaryDark hover:bg-secondary hover:text-black;
}
</style>
