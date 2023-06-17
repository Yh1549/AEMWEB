<template>
  <div class="my-2">
    <div class="flex gap-8 items-center my-4">
      <div class="flex-initial w-72">
        <span class="block font-bold"> 發布日期 : </span>
        <span class="inp">
          {{ props.newAd.startDate }}
        </span>
      </div>
      <div class="flex-initial w-72">
        <span class="block font-bold"> 結束日期 : </span>
        <span class="inp">
          {{ props.newAd.endDate }}
        </span>
      </div>
      <div class="flex-initial w-72">
        <span class="block font-bold"> 關聯系統 : </span>
        <span class="inp">
          {{ props.newAd.system }}
        </span>
      </div>
      <div class="flex-initial w-72">
        <span class="block font-bold"> 放置區域 : </span>
        <span class="inp">
          {{ props.newAd.block }}
        </span>
      </div>
    </div>

    <div class="flex gap-8 items-center my-4">
      <div class="flex-initial w-72">
        <span class="block font-bold"> 超連結 : </span>
        <span class="inp w-full">
          {{ props.newAd.block }}
        </span>
      </div>
    </div>
    <div class="py-2 md:w-10/16 flex flex-col">
      <span class="mx-auto">圖片預覽</span>
      <img
        v-if="props.newAd.photo != null"
        :src="`data:image;base64,${props.newAd.photo}`"
        class="mx-auto md:max-h-60"
      />
      <div v-else>無</div>
    </div>
    <div class="flex flex-col">
      <span>標題 :{{ props.newAd.title }}</span>
      <div v-html="props.newAd.content" class="tiptapStyle"></div>
    </div>
  </div>
  <div class="flex justify-center my-8">
    <button @click="adStore.newAdStep = true" class="btn btnClick mr-8">
      上一步
    </button>
    <button @click="sendNewAdvertise" class="btn btnClick bg-submit">
      確認送出
    </button>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { useCommonStore } from "../../store/commonStore";
import { useAdStore, useStore } from "../../store/store";
const adStore = useAdStore();
const Store = useStore();
const commonStore = useCommonStore();
const props = defineProps(["newAd"]);
const router = useRouter();
const sendNewAdvertise = () => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確認新增此廣告嗎？`,
    func: (e) => {
      if (e.target.value === "confirm") {
        apiRequest
          .post("CreateAdvertise", props.newAd)
          .then((res) => {
            if (res.desc == "successful") {
              router.push({ name: "SvcSucess" });
            } else {
              commonStore.SvcFail.msg = res.desc;
              router.push({ name: "SvcFail" });
            }
          })
          .catch();
      }
    },
  };
};
</script>
