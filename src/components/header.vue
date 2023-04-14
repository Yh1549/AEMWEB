<template>
  <header
    class="w-full flex justify-between p-2 bg-background shadow-lg z-20 items-center"
  >
    <div class="flex">
      <router-link class="w-[200px]" to="/Lobby">
        <img class="full" src="../assets/PropertyHorizontal.svg" />
      </router-link>
      <!-- <button @click="Store().menuToggle = !Store().menuToggle">
        <i class="fa-solid fa-circle-arrow-left"></i>
      </button> -->
      <h1 class="lg:block lg:text-lg ml-4 font-bold">
        {{ route.meta.title }}
      </h1>
    </div>
    <div class="flex gap-6">
      <router-link to="/Lobby">
        <span class="text-primary hover:text-secondary">
          <i class="fa-solid fa-house fa-xl"></i>
        </span>
      </router-link>
      <router-link to="/userInfo">
        <span class="text-primary hover:text-secondary">
          <i class="fa-solid fa-user fa-xl"></i>
        </span>
      </router-link>
      <button class="text-primary hover:text-secondary" @click="logOut">
        <i class="fa-solid fa-right-from-bracket fa-xl"></i>
      </button>
    </div>
  </header>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { Store } from "../store/store";
import apiRequest from "../api/apiRequest";

const router = useRouter();
const route = useRoute();
// 登出
let logOut = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: "確定要登出嗎？",
    func: (e) => {
      if (e.target.value === "confirm") {
        apiRequest.post("UserLogout", {}).then((res) => {
          sessionStorage.clear();
          router.push({
            name: "Login",
          });
        });
      }
    },
  };
};
</script>
