<template>
  <div class="relative">
    <div class="w-full h-screen backEffect"></div>
    <div
      class="w-full h-screen absolute top-0 left-0 flex justify-center items-center"
    >
      <div
        class="flex flex-col rounded md:flex-row md:w-1/2 md:h-[500px] md:justify-center min-w-fit shadow-2xl -backdrop-hue-rotate-180 relative overflow-hidden"
      >
        <div class="w-full md:w-10/16 p-4 flex flex-col justify-between">
          <div class="w-1/2">
            <img src="../assets/PropertyHorizontal.svg" />
          </div>
          <span
            class="block text-[30px] font-extrabold text-center text-white"
            >{{ envTitle }}</span
          >
          <span class="text-white font-bold text-sm md:text-lg"
            >2023@聯邦商業銀行</span
          >
        </div>
        <div
          class="w-full md:w-6/16 py-8 flex flex-col justify-center bg-white rounded overflow-hidden relative"
        >
          <router-view v-slot="{ Component, route }">
            <transition name="fade" mode="out-in">
              <div :key="route.name">
                <component :is="Component" />
              </div>
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const envTitle = import.meta.env.VITE_BASE_TITLE;
</script>
<style scoped>
.backEffect {
  background: linear-gradient(-60deg, #ee7752, #7a2143, #136989, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
