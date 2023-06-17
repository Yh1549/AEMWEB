<template>
  <div class="fixed z-[1000] left-0 top-0 w-full h-full bg-black/[.40]">
    <div
      class="relative mx-auto mt-32 w-15/16 md:w-2/5 rounded -4 bg-primaryLight"
    >
      <div
        class="py-12 px-5 md:px-12 text-lg flex items-center bg-white rounded-t"
      >
        <span class="mx-2 text-cancel">
          <i class="fa-solid fa-circle-exclamation"></i>
        </span>
        <span class="font-bold text-base">{{ Store.alertObj.msg }}</span>
      </div>
      <button
        class="absolute text-lg top-4 right-4 hover:cursor-pointer"
        @click="close"
        value="cancel"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="flex justify-evenly my-2 py-2">
        <button
          class="btn btnClick bg-cancel text-sm md:text-base"
          @click="close"
          value="cancel"
        >
          取消
        </button>
        <button
          class="btn btnClick bg-submit text-sm md:text-base"
          value="confirm"
          @click="confirm"
        >
          確認
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStore } from "../store/store";
const Store = useStore();

const confirm = async (e) => {
  Store.alertObj.func(e);
  Store.alertShow = false;
};
const close = (e) => {
  Store.alertObj.func(e);
  Store.alertShow = false;
};
</script>
