<template>
  <div
    class="scrollbar transition-all duration-500 z-10 overflow-scroll overflow-x-hidden"
    :class="!Store().menuToggle ? '-left-[100%]' : ''"
  >
    <div class="w-full bg-background h-screen lg:inline-block">
      <nav>
        <navItem
          v-for="item in navTitle"
          :category="item.name"
          :icon="item.icon"
        >
          <template #title>{{ item.title }}</template>
        </navItem>
      </nav>
    </div>
  </div>
</template>
<script setup>
import { Store } from "../store/store";
import { ref } from "vue";
import navItem from "./navItem.vue";

const navTitle = ref([
  { title: "公告", name: "post", icon: "fa-bullhorn" },
  { title: "廣告", name: "advertise", icon: "fa-envelopes-bulk" },
  { title: "審核", name: "approve", icon: "fa-bullhorn" },
  { title: "管理設定", name: "admin", icon: "fa-gears" },
]);
</script>
<style scoped>
.svgcss {
  height: 26px;
  width: 26px;
  @apply inline-block mx-1;
}
span {
  @apply flex items-center;
}
</style>
