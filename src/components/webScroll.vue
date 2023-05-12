<template>
  <button @click="scrollTop" class="bottom-20" v-if="data.scrollT">
    <i class="fa-solid fa-caret-up"></i>
  </button>
  <button class="bottom-10" @click="scrollBottom" v-if="data.scrollB">
    <i class="fa-solid fa-caret-down"></i>
  </button>
  <!-- {{ data.clientHeight + "  " + data.scroolHeight }} -->
</template>
<script setup>
import { reactive, onMounted } from "vue";
const data = reactive({
  clientHeight: 0,
  scroolHeight: 0,
  scrollT: false,
  scrollB: true,
});
onMounted(() => {
  window.addEventListener(
    "scroll",
    () => {
      let scrollTop = window.pageYOffset;
      // 控制滚动按钮的隐藏或显示
      if (scrollTop > 50) {
        data.scrollT = true;
      } else {
        data.scrollT = false;
      }
      if (scrollTop > document.body.scrollHeight - window.innerHeight - 50) {
        data.scrollB = false;
      } else {
        data.scrollB = true;
      }
    },
    true
  );
});
let scrollTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
let scrollBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};
</script>
<style scoped>
button {
  @apply bg-primaryDark/20 rounded flex justify-center px-2 py-1 right-2.5 text-[24px] z-50 fixed;
}
</style>
