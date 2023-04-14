<template>
  <ul class="mx-auto">
    <li
      class="flex justify-between px-4 h-8 bg-white font-bold border-4 border-transparent box-border cursor-pointer"
    >
      <div class="w-1/16">#</div>
      <div class="w-3/16">交易時間</div>
      <div class="w-2/16">身分證</div>
      <div class="w-2/16">交易代碼</div>
      <div class="w-2/16">訊息代碼</div>
      <div class="w-1/16">執行時間</div>
      <div class="w-2/16 pl-2">IP</div>
      <div class="w-1/16"></div>
    </li>
    <li
      v-for="(log, index) in Store().pageData.pager"
      :key="log.serviceId"
      class="flex justify-between my-1 h-12 bg-white border-4 border-transparent box-border hover:shadow-xl hover:border-l-primary cursor-pointer"
      :class="{
        'bg-gray-300': index % 2 == 0,
      }"
    >
      <div class="w-full flex justify-around">
        <span class="w-1/16 pl-1 flex self-center">
          {{ index + 1 }}
        </span>
        <span class="w-3/16 pl-1 flex self-center">
          {{ log.transTime }}
        </span>
        <span class="w-2/16 pl-1 flex self-center">
          {{ log.idNumber }}
        </span>
        <span class="w-2/16 pl-1 flex self-center">
          {{ log.transCode }}
        </span>
        <span class="w-2/16 pl-1 flex self-center">
          {{ log.msgCode }}
        </span>
        <span class="w-1/16 pl-1 flex self-center">
          {{ log.exeTime }}
        </span>
        <span class="w-2/16 pl-1 flex self-center">
          {{ log.ipAddress }}
        </span>
        <span class="w-1/16 pl-1 flex self-center">
          <i class="fa-solid fa-eye text-[28px]" @click="showModal(log)"></i>
        </span>
      </div>
    </li>
  </ul>
  <div
    class="fixed z-50 left-0 top-0 w-full h-full bg-black/[.40]"
    v-if="modalIsShowed"
  >
    <div class="relative mx-auto mt-16 w-2/5 bg-zinc-50 rounded">
      <div class="mx-8 my-16 p-8">
        <p class="p-2 font-bold">交易時間</p>
        <p class="pl-4">{{ modalLog.transTime }}</p>
        <p class="p-2 font-bold">身分證</p>
        <p class="pl-4">{{ modalLog.idNumber }}</p>
        <p class="p-2 font-bold">交易代碼</p>
        <p class="pl-4">{{ modalLog.transCode }}</p>
        <p class="p-2 font-bold">訊息代碼</p>
        <p class="pl-4">{{ modalLog.msgCode }}</p>
        <p class="p-2 font-bold">執行時間</p>
        <p class="pl-4">{{ modalLog.exeTime }}</p>
        <p class="p-2 font-bold">IP位址</p>
        <p class="pl-4">{{ modalLog.ipAddress }}</p>
      </div>
      <div>
        <div>
          <div
            class="absolute top-4 right-4 hover:cursor-pointer"
            @click="hideModal()"
          >
            <img src="../assets/close-icon.webp" alt="close" class="w-4" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Store } from "../../store/store";

const liSelected = ref(false);

const modalLog = ref({});
const modalIsShowed = ref(false);
const curTop = ref(0);
let preventScroll = () => {
  window.scrollTo(0, curTop.value);
};
const showModal = (log) => {
  curTop.value = window.scrollY;
  window.addEventListener("scroll", preventScroll);
  modalLog.value = log;
  modalIsShowed.value = true;
};

const hideModal = () => {
  window.removeEventListener("scroll", preventScroll);
  modalIsShowed.value = false;
};
</script>
