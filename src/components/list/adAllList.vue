<template>
  <div class="flex flex-wrap">
    <div
      v-for="item in Store().pageData.pager"
      class="w-full p-2 md:w-4/16"
      :key="item"
    >
      <div class="flex justify-center h-40 overflow-hidden">
        <div class="w-full">
          <img
            v-if="item.photo"
            :src="`data:img;base64,${item?.photo}`"
            class="border-2 border-primary w-full rounded opacity-70"
          />
          <div
            v-else
            class="flex h-full border-2 border-primary rounded justify-center items-center"
          >
            <span>無圖片</span>
          </div>
        </div>
      </div>
      <div
        class="relative p-2 my-2 -top-[15%] md:flex rounded-b shadow-xl bg-white border-b-2 border-x-2 border-primary"
      >
        <div class="w-full self-center">
          <div class="flex items-center text-sm my-2">
            <span
              class="rounded flex items-center font-bold"
              :class="
                item.status == 'offline' ? 'text-gray-500' : 'text-primary'
              "
              ><div
                class="w-[5px] h-[5px] m-1 rounded-full"
                :class="item.status == 'offline' ? 'bg-gray-500' : 'bg-submit'"
              ></div>
              {{ commonStore().getCaseStatusName(item.status)?.title }}</span
            ><span class="bg-primaryDark text-white rounded font-bold p-1 mx-1">
              {{ Store().getRelSys(item.system) }}
            </span>
            <span
              class="bg-secondaryDark text-white rounded font-bold p-1 mx-1"
            >
              排序:{{ item.sort }}
            </span>
          </div>
          <div class="flex justify-between h-12">
            <span class="font-bold">{{ adTitle(item.title) }} </span>
          </div>
          <span class="text-sm opacity-70">
            {{ Store().dateReform(item.startDate) }}~{{
              Store().dateReform(item.endDate)
            }}
          </span>
          <div class="flex justify-between items-center">
            <span class="font-bold">
              <span class="text-primary text-lg mx-2"
                ><i class="fa-solid fa-circle-user"></i></span
              >{{ item.empId ? item.empId : "無" }}</span
            >
            <div class="flex gap-2">
              <button
                class="rounded w-10 h-10 text-primaryDark text-2xl border-2 border-primaryDark hover:bg-secondaryLight"
                @click="advertiseDetail(item.uuid, 'ad')"
              >
                <i class="fa-solid fa-clipboard-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { adStore, Store } from "../../store/store";
import { commonStore } from "../../store/commonStore";
import { useRouter } from "vue-router";
import { onBeforeUnmount } from "vue";
const router = useRouter();
const adTitle = (title) => {
  if (title.length > 35) {
    return title.slice(0, 35) + "...";
  } else {
    return title;
  }
};
const advertiseDetail = (uuid, category) => {
  router.push({
    name: "detail",
    params: {
      uuid,
      category,
    },
  });
};
onBeforeUnmount(() => {
  Store().pageData.pager = adStore().List;
  Store().pageData.pageCurrent = 1;
  Store().pageData.pageSize = 20;
});
</script>
