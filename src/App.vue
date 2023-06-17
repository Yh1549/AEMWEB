<template>
  <Alert v-if="Store.alertShow" />
  <router-view></router-view>
  <div v-if="devMark == 'true'" class="watermark">
    {{ envTitle }}
  </div>
</template>
<script setup>
import { computed, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiRequest } from "./api/apiRequest";
import Alert from "./components/Alert.vue";
import { useStore } from "./store/store";
const Store = useStore();
const envTitle = import.meta.env.VITE_BASE_TITLE;
const devMark = ref(import.meta.env.VITE_MARK);

const route = useRoute();
const router = useRouter();
const bodyElement = ref(document.getElementsByTagName("body"));
const currentRouteName = computed(() => {
  return route.name;
});
const refreshEventOn = ref(false);
const removeEvent = () => {
  bodyElement.value[0].removeEventListener("mousemove", refreshSession, false);
};
const registerEvent = () => {
  if (sessionStorage.getItem("userInfo") != null) {
    refreshEventOn.value = true;
    bodyElement.value[0].addEventListener("mousemove", refreshSession, false);
  }
};
const refreshSession = () => {
  removeEvent();
  apiRequest
    .post("RefreshSession", {})
    .then((res) => {
      if (res.desc == "successful") {
        // 每5分鐘重設一次觸發refresh的mouse事件
        setTimeout(() => {
          refreshEventOn.value = false;
          registerEvent();
        }, 1000 * 60 * 3);
      } else {
        router.push({ name: "Login" });
      }
    })
    .catch();
};
watch(
  () => router.currentRoute.value,
  () => {
    window.scrollTo(0, 0);
  }
);
watchEffect(() => {
  if (!sessionStorage.getItem("userInfo")) {
    removeEvent();
  } else if (
    currentRouteName.value != "Login" &&
    refreshEventOn.value == false
  ) {
    registerEvent();
  }
});
</script>
<style scoped>
.watermark {
  @apply z-[1000] font-bold left-0 top-[25%] absolute text-cancel/10 -rotate-45 text-[80px] pointer-events-none;
}
</style>
