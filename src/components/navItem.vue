<template>
  <div
    v-if="Store().getPageInfo(props.category).length != 0"
    class="flex items-center justify-between cursor-pointer hover:bg-secondary py-3 px-1"
    @click="toggle = !toggle"
  >
    <span
      class="font-bold text-sm md:text-base w-14/16 transition-all duration-1000"
    >
      <i class="fa-solid fa-xl mr-2 text-[16px]" :class="props.icon"></i>
      <slot v-if="!Store().menuToggle" name="title"></slot
    ></span>
    <div
      v-if="!Store().menuToggle"
      class="flex justify-center items-center transition-all duration-500"
      :class="{ 'rotate-180': toggle }"
    >
      <i class="mx-auto fa-solid fa-chevron-up text-sm"></i>
    </div>
  </div>
  <div class="overflow-hidden">
    <transition name="slide">
      <div v-if="toggle" class="flex flex-col pl-4">
        <router-link
          v-for="item in Store().getPageInfo(props.category)"
          :key="item"
          :to="item.path"
          class="text-sm md:text-base py-2 pl-5 hover:border-l-secondaryDark hover:border-l-4 hover:bg-secondaryLight flex"
          active-class=" border-l-primaryDark border-l-4 bg-primaryLight"
          >{{ item.title }}
          <span
            class="flex h-3 w-3 ml-1 relative mt-0.5"
            v-if="item.title == '審核放行' && Store().noticeLight != ''"
          >
            <span
              class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-cancel opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-cancel"
            ></span>
          </span>
        </router-link>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { Store } from "../store/store";
import { ref } from "vue";
const toggle = ref(false);
const props = defineProps(["category", "icon"]);
</script>
<style scoped>
.slide-enter-active {
  transition: all 0.3s;
}
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
