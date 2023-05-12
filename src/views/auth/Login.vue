<template>
  <div class="p-4">
    <span class="block font-bold text-[30px] text-gray-600">Hello,</span>
    <span class="font-bold text-gray-600">歡迎使用聯邦銀行公告管理系統</span>
  </div>
  <normalLogin></normalLogin>
  <div
    class="block text-gray-600 font-bold text-sm md:text-base text-center my-2"
  >
    首次登入或信箱重置嗎?<br />請按
    <button class="btn btnClick" @click="firstLogin">信箱設置</button>
    <br /><span class="text-sm">沒有帳號或無法登入? 請聯絡資訊部 </span>
  </div>
  <!-- <button class="btn btnClick">QR code登入</button> -->
</template>
<script setup>
import { Store } from "../../store/store";
import { useRouter } from "vue-router";
import normalLogin from "../../components/login/normalLogin.vue";

const router = useRouter();
const firstLogin = () => {
  Store().resetLogin = false;
  router.push({ name: "firstLogin" });
};
</script>
