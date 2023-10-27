<template>
  <div class="grid justify-items-center">
    <div
      class="box grid justify-items-center mt-3 p-10 w-full md:w-fit rounded border-2 border-primaryDark shadow-xl bg-white"
    >
      <ul class="flex flex-col">
        <li class="py-2 md:py-4 grid md:grid-cols-2 gap-x-8">
          <span class="self-center">
            <div
              class="border-b-2 border-secondaryDark drop-shadow-sm w-fit mb-2 md:mb-0"
            >
              使用者名稱 :
            </div>
          </span>
          <label class="inpLabel">
            <span class="grid items-center">
              {{ Store.currentUser().name }}</span
            >
          </label>
        </li>
        <li class="py-4 grid md:grid-cols-2 gap-x-8">
          <span class="self-center">
            <div
              class="border-b-2 border-secondaryDark drop-shadow-sm w-fit mb-2 md:mb-0"
            >
              帳號 :
            </div>
          </span>
          <label class="inpLabel">
            <span class="grid items-center">{{
              Store.currentUser().empid
            }}</span>
          </label>
        </li>
        <li class="py-4 grid md:grid-cols-2 gap-x-8">
          <span class="self-center">
            <div
              class="border-b-2 border-secondaryDark drop-shadow-sm w-fit mb-2 md:mb-0"
            >
              信箱 :
            </div>
          </span>
          <label class="inpLabel">
            <span class="grid items-center">{{
              Store.currentUser().email
            }}</span>
          </label>
        </li>
        <li class="py-4 grid md:grid-cols-2 gap-x-8">
          <span class="self-center">
            <div
              class="border-b-2 border-secondaryDark drop-shadow-sm w-fit mb-2 md:mb-0"
            >
              單位名稱 :
            </div>
          </span>
          <label class="inpLabel">
            <span class="grid items-center">
              {{ Store.currentUser().deptname }}</span
            >
          </label>
        </li>
        <li class="py-4 grid md:grid-cols-2 gap-x-8">
          <span class="self-center">
            <div
              class="border-b-2 border-secondaryDark drop-shadow-sm w-fit mb-2 md:mb-0"
            >
              備註 :
            </div>
          </span>
          <label class="inpLabel h-11">
            <span class="grid items-center">
              {{ Store.currentUser().deptmemo }}</span
            >
          </label>
        </li>
        <li class="py-4 grid md:grid-cols-2 gap-x-8">
          <span class="self-center">
            <div
              class="border-b-2 border-secondaryDark drop-shadow-sm w-fit mb-2 md:mb-0"
            >
              最近一次登入時間 :
            </div>
          </span>
          <label class="inpLabel">
            <span class="grid items-center">
              {{ Store.currentUser().lastmodifytime }}</span
            >
          </label>
        </li>
        <li class="py-4 grid md:grid-cols-2 gap-x-8">
          <span class="self-center">
            <div
              class="border-b-2 border-secondaryDark drop-shadow-sm w-fit mb-2 md:mb-0"
            >
              最近一次更新時間 :
            </div>
          </span>
          <label class="inpLabel">
            <span class="grid items-center">
              {{ Store.currentUser().lastmodifypsdtime }}</span
            >
          </label>
        </li>
      </ul>
      <changePassWordVue />
    </div>
    <!-- 提醒警示 -->
    <!-- <div class="flex items-center">
      <i class="fa-solid fa-bell text-secondaryDark text-[25px]"></i>
      <div></div>
    </div> -->
    <!-- <button class="btn my-3 h-fit" @click="Store.changePWShow = true">
      修改密碼
    </button> -->
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import changePassWordVue from "../../components/changePassWord.vue";
import { useStore } from "../../store/store";
const Store = useStore();
const route = useRoute();
if (route.query.closeIcon) {
  Store.changePWShow = true;
}
</script>
<style scoped>
.inp {
  @apply break-all mt-2;
}
</style>
