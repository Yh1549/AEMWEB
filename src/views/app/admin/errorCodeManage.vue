<template>
  <div class="flex flex-row p-2 justify-between">
    <router-link
      v-if="Store().getSvcAuth('CreateSysMsg')"
      class="block self-center bg"
      :to="{ name: 'errorCodeNew' }"
      ><button class="btn pointer-events-none px-2 bg-submit text-base">
        新增錯誤代碼<i class="fa-solid fa-plus pl-1"></i></button
    ></router-link>
    <button
      class="btn bg-secondaryDark flex items-center px-2 text-black text-base"
      @click="cloud"
    >
      同步資料
      <div class="relative ml-1">
        <i class="fa-solid fa-cloud text-lg"></i
        ><i
          class="fa-solid fa-rotate text-[8px] text-secondaryDark absolute left-1.5 top-1.5"
        ></i>
      </div>
    </button>
  </div>
  <hr class="my-2" />
  <div>
    <div class="flex flex-wrap">
      <error-card
        v-for="item in Store().sysMsg"
        :sysMsg="item"
        :key="item.code"
      ></error-card>
    </div>
  </div>
</template>
<script setup>
import { Store } from "../../../store/store";
import errorCard from "../../../components/errorCard.vue";
import { ref, reactive } from "vue";
import { ReloadSysMsg } from "../../../api/service";
import { commonStore } from "../../../store/commonStore";
import router from "../../../router/router";
const cloud = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `確定要同步錯誤代碼嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await ReloadSysMsg();
        if (res.desc == "successful") {
          router.push({
            name: "SvcSucess",
          });
        } else {
          commonStore().SvcFail.msg = res.desc;
          router.push({
            name: "SvcFail",
          });
        }
      }
    },
  };
};
</script>
<style scoped></style>
