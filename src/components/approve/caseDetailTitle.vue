<template>
  <div>
    <div class="flex justify-between">
      <div>
        <div class="flex items-center">
          <span class="text-2xl text-primary mx-2">
            <i class="fa-solid fa-circle-user"></i>
          </span>
          <p class="font-bold text-lg">
            {{ Store().approveCase.applicantName }}
          </p>
        </div>
        <div class="mx-4" v-if="Store().approveCase.postDetail">
          <p>系統：{{ Store().getRelSys(Store().approveDetail.relSys) }}</p>
          <p>類別：{{ Store().getTag(Store().approveDetail.postTag) }}</p>
          <p>置頂：{{ top(Store().approveDetail.top) }}</p>
          <p>發布日期：{{ Store().approveDetail.postDate }}</p>
        </div>
        <div class="mx-4" v-if="Store().approveCase.advertiseDetail">
          <p>系統：{{ Store().getRelSys( Store().approveDetail.system) }}</p>
          <p>區域：{{ getBlockFromOneAd }}</p>
          <p>開始日期：{{ Store().approveDetail.adStartDate }}</p>
          <p>結束日期：{{ Store().approveDetail.adEndDate }}</p>
          <p>超連結：{{ Store().approveDetail.link }}</p>
        </div>
      </div>
      <div
        class="border border-primaryDark w-1/3 rounded"
        v-if="Store().approveCase.advertiseDetail"
      >
        <div class="overflow-scroll flex justify-center mt-2">
          <img
            class="w-full"
            :src="`data:image;base64,${Store().approveDetail.photo}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { postStore, Store, adStore } from "../../store/store";
import { computed } from "vue";

const top = (t) => {
  if (!t) return "置頂";
  else return "不置頂";
};
const getBlockFromOneAd = computed(() => {
  for (let i = 0; i < adStore().adBlockList.length; i++) {
    if (Store().approveDetail.block === adStore().adBlockList[i].block) {
      return adStore().adBlockList[i].memo;
    }
  }
});
</script>
