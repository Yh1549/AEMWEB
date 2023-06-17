<template>
  <headerCom></headerCom>
  <div class="flex h-[93vh]">
    <div class="w-2/16 scrollbar bg-background overflow-auto">
      <app-navgation />
    </div>
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <Container :key="route.name">
          <template #mainContent> <component :is="Component" /> </template>
        </Container>
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import appNavgation from "../components/appNavgation.vue";
import Container from "../components/container.vue";
import headerCom from "../components/header.vue";
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
