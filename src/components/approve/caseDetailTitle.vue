<template>
  <div class="w-full">
    <div
      class="flex justify-between"
      :class="{ 'flex-col': Store.approveCase?.actionType == 'update' }"
    >
      <div
        :class="{
          'w-2/3':
            Store.approveCase?.type == 'AD' &&
            Store.approveCase?.actionType != 'update',
        }"
      >
        <div class="flex items-center">
          <span class="text-2xl text-primary mx-2">
            <i class="fa-solid fa-circle-user"></i>
          </span>
          <p class="font-bold text-lg">
            {{ props.caseDetail.name }}
          </p>
        </div>
        <div class="mx-4" v-if="Store.approveCase.postDetail">
          <p>
            系統：{{ Store.getRelSys(props.caseDetail.relSys).memo }}/{{
              Store.getRelSys(props.caseDetail.relSys).name
            }}
            <span class="text-sm ml-1">{{ props.caseDetail.relSys }}</span>
          </p>
          <div>
            群組：
            <span v-if="tagLenght">-</span>
            <span
              v-else
              class="bg-primaryLight/40 rounded px-2 gap-1 mr-1"
              v-for="tag in props.caseDetail.postTag"
            >
              {{ Store.getTag(tag) }}
              <span class="text-sm">{{ tag }}</span>
            </span>
          </div>
          <p>置頂：{{ top(props.caseDetail.top) }}</p>
          <p>發布日期：{{ props.caseDetail.postDate }}</p>
        </div>
        <div class="mx-4" v-if="Store.approveCase.advertiseDetail">
          <p>
            系統：{{ Store.getRelSys(props.caseDetail.system).memo }}
            <span class="text-sm ml-1">{{ props.caseDetail.system }}</span>
          </p>
          <div>
            區域：<span class="bg-primaryLight/40 rounded px-2 gap-2">
              {{ getBlockFromOneAd ?? "-" }}
              <span class="text-sm">{{ props.caseDetail.block }}</span></span
            >
          </div>
          <p>開始日期：{{ props.caseDetail.adStartDate }}</p>
          <p>結束日期：{{ props.caseDetail.adEndDate }}</p>
          <p>
            超連結：{{
              props.caseDetail.link == "" ? "-" : props.caseDetail.link
            }}
          </p>
        </div>
      </div>
      <div
        class="flex justify-end p-2 items-center"
        v-if="Store.approveCase.advertiseDetail"
      >
        <div
          class="border border-primaryDark h-[200px] rounded overflow-y-scroll scrollbar"
          :class="
            Store.approveCase?.actionType == 'update' ? 'w-full' : 'w-[400px]'
          "
        >
          <div class="flex justify-center m-1" v-if="props.caseDetail.photo">
            <img
              class="w-[400px]"
              :src="`data:image;base64,${props.caseDetail.photo}`"
            />
          </div>
          <p v-else class="flex justify-center items-center h-full">無</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watchEffect } from "vue";
import { useAdStore, useStore } from "../../store/store";
const Store = useStore();
const adStore = useAdStore();
const props = defineProps(["caseDetail"]);
const tagLenght = ref(true);
const top = (t) => {
  if (t) return "置頂";
  else return "不置頂";
};
const getBlockFromOneAd = computed(() => {
  for (let i = 0; i < adStore.adBlockList.length; i++) {
    if (props.caseDetail.block === adStore.adBlockList[i].block) {
      return adStore.adBlockList[i].memo;
    }
  }
});
watchEffect(() => {
  if (props.caseDetail.postTag) {
    tagLenght.value = props.caseDetail.postTag.length == 0;
  }
});
</script>
<style scoped>
p {
  @apply break-words;
}
</style>
