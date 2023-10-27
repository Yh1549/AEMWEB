<template>
  <div class="items-center text-center h-fit">
    <div class="font-bold text-2xl mb-3">修改/設定TiggerTime</div>
    <ul class="flex flex-col px-10 pb-10">
      <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
        <span class="self-center pb-2 md:pb-0">
          <div
            class="border-b-2 border-secondaryDark drop-shadow-sm w-fit flex"
          >
            TiggerTime
            <div class="text-cancel">※</div>
          </div></span
        >
        <label class="inpLabel col-span-2">
          <input
            type="text"
            placeholder="* /50 * * * * ?"
            class="w-full inp block col-span-2"
            v-model="cronTime"
            v-verify:[cronTimeValidArg]="scheduleCheckingList.cronTime"
        /></label>
      </li>
      <button
        id="ok-btn"
        class="btn btnClick w-full mt-3"
        @click="changeTime(props.triggerName, cronTime)"
      >
        變更
      </button>
    </ul>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { UpdateCronTime } from "../../api/service";
import { InputValidation } from "../../formValidation/validTunnel";
import router from "../../router/router";
import { useCommonStore } from "../../store/commonStore";
import { useStore } from "../../store/store";
const Store = useStore();
const commonStore = useCommonStore();
const props = defineProps(["triggerName"]);
const cronTime = ref("");
const cronTimeValidArg = ["notNull", "cronTimeLastWord"];
const scheduleCheckingList = ref({
  cronTime: { pass: null, msg: null },
});

const validCheck = () => {
  for (let item in scheduleCheckingList.value) {
    if (scheduleCheckingList.value[item].pass != true) {
      return false;
    }
  }
  return true;
};
const changeTime = (name, time) => {
  if (validCheck()) {
    Store.alertShow = true;
    Store.alertObj = {
      msg: "確定設定？",
      func: async (e) => {
        if (e.target.value === "confirm") {
          const res = await UpdateCronTime(name, time);
          if (res.desc == "successful") {
            router.push({
              name: "SvcSucess",
            });
          } else {
            commonStore.SvcFail.msg = res.desc;
            router.push({
              name: "SvcFail",
            });
          }
        }
      },
    };
  } else {
    Store.alertShow = true;
    Store.alertObj = {
      msg: "請重新確認資料",
      func: (e) => {},
    };
  }
};
</script>
