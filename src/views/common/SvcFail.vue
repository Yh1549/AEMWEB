<template>
  <div class="mt-20">
    <div class="box flex justify-center my-10">
      <div class="boxbody rounded bg-white w-5/6 md:w-1/2 text-center py-8">
        <span class="text-cancel text-[50px] md:text-[150px]">
          <i class="fa-regular fa-circle-xmark"></i>
        </span>
        <div>
          <p class="text-2xl font-bold text-cancel">
            {{ commonStore().SvcFail.title }}
          </p>
          <p class="rounded p-2">
            {{ commonStore().SvcFail.msg }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="grid grid-cols-2 gap-y-6 md:flex p-4 justify-items-center justify-center"
    ></div>
  </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { commonStore } from "../../store/commonStore";
import { useRouter } from "vue-router";
const router = useRouter();
let time;
let autoReturn = () => {
  time = setTimeout(() => {
    if (Store().routerPush) {
      router.push(Store().routerPush);
    } else {
      router.go(-1);
    }
    delete Store().routerPush;
  }, 3000);
};
onMounted(() => {
  autoReturn();
});
onBeforeUnmount(() => {
  clearTimeout(time);
});
</script>
<style scoped>
.box {
  filter: drop-shadow(10px 10px 0px theme(colors.primaryLight));
}
.boxbody {
  box-shadow: 0 0 0 8px theme(colors.primaryDark);
}
</style>
