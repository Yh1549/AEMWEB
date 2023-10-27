<template>
  <div class="my-2">
    <div class="flex gap-8 items-center my-4">
      <div class="flex-initial w-72">
        <p class="font-bold">發布日期時間 :</p>
        <div class="inpLabel">
          <span class="inp">
            {{ props.newAd.startDate }}
          </span>
        </div>
      </div>
      <div class="flex-initial w-72">
        <p class="font-bold">結束日期 :</p>
        <div class="inpLabel">
          <span class="inp">
            {{ props.newAd.endDate }}
          </span>
        </div>
      </div>
      <div class="flex-initial w-72">
        <p class="font-bold">關聯系統 :</p>
        <div class="inpLabel">
          <span class="inp"> {{ system.memo }}/{{ system.name }}</span>
        </div>
      </div>
      <div class="flex-initial w-72">
        <p class="font-bold">放置區域 :</p>
        <div class="inpLabel">
          <span class="inp">
            {{ props.selectedBlock.memo }} /{{ props.selectedBlock.block }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex gap-8 items-center my-4">
      <div class="flex-initial w-72">
        <p class="font-bold">超連結 :</p>
        <div class="inpLabel">
          <span v-if="!props.newAd.link == ''" class="inp w-full">
            {{ props.newAd.link }}
          </span>
          <span v-else>無</span>
        </div>
      </div>
    </div>
    <div class="py-2 w-full flex flex-col">
      <span class="mx-auto">圖片預覽</span>
      <img
        v-if="props.newAd.photo != null"
        :src="`data:image;base64,${props.newAd.photo}`"
        class="mx-auto w-1/2 :max-h-60"
      />
      <div v-else>
        <p class="text-center">無</p>
      </div>
    </div>
    <p>標題 :</p>
    <div class="inpLabel">
      <span class="inp">
        {{ props.newAd.title }}
      </span>
    </div>
    <p class="font-bold">內文 :</p>
    <div v-html="props.newAd.content" class="tiptapStyle"></div>
  </div>
  <div class="flex justify-center my-8">
    <button @click="toWriteEmit" class="btn btnClick mr-8">上一步</button>
    <button @click="sendNewAdvertise" class="btn btnClick bg-submit">
      確認送出
    </button>
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { useCommonStore } from "../../store/commonStore";
import { useAdStore, useStore } from "../../store/store";
const adStore = useAdStore();
const Store = useStore();
const commonStore = useCommonStore();
const props = defineProps(["newAd", "selectedBlock"]);
const emit = defineEmits(["toWrite"]);
const router = useRouter();
const system = ref("");
const sendNewAdvertise = () => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確認新增此廣告嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await apiRequest.post("CreateAdvertise", props.newAd);
        if (res.desc == "successful") {
          adStore.newAdStep = true;
          Store.routerPush = "advertiseAll";
          router.push({ name: "SvcSucess" });
        } else {
          adStore.newAdStep = true;
          commonStore.SvcFail.msg = res.desc;
          router.push({ name: "SvcFail" });
        }
      }
    },
  };
};
const toWriteEmit = () => {
  emit("toWrite", "write");
};
watchEffect(() => {
  for (let item of JSON.parse(sessionStorage.getItem("SysList"))) {
    if (item.name == props.newAd.system) {
      system.value = item;
      return;
    }
  }
});
</script>
