<template>
  <div class="items-center text-center">
    <div class="font-bold text-2xl mb-3">新增排程</div>
    <ul class="flex flex-col px-10 pb-10">
      <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
        <span class="self-center pb-2 md:pb-0">
          <div
            class="border-b-2 border-secondaryDark drop-shadow-sm w-fit flex"
          >
            jobName
            <div class="text-cancel">※</div>
          </div></span
        >
        <label class="inpLabel col-span-2">
          <select
            class="inp w-full"
            v-verify:[jobNameValidArg]="scheduleCheckingList.jobName"
            v-model="jobName"
          >
            <option value="" disabled>請選擇您所發布的排程</option>
            <option
              v-for="job in Store.jobList"
              :key="job.job"
              :value="job.job"
            >
              {{ job.job + "_" + job.description }}
            </option>
          </select>
        </label>
      </li>
      <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
        <span class="self-center pb-2 md:pb-0">
          <div class="border-b-2 border-secondaryDark drop-shadow-sm w-fit">
            jobData
          </div></span
        >
        <label class="inpLabel col-span-2">
          <input
            type="text"
            name="jobData"
            class="w-full inp"
            v-model="jobData"
          />
        </label>
      </li>
      <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
        <span class="self-center pb-2 md:pb-0">
          <div
            class="border-b-2 border-secondaryDark drop-shadow-sm w-fit flex"
          >
            排程名稱
            <div class="text-cancel">※</div>
          </div></span
        >
        <label class="inpLabel">
          <input
            type="text"
            class="w-full inp"
            v-verify:[triggerNameValidArg]="scheduleCheckingList.triggerName"
            v-model="triggerName"
        /></label>
        <inputErrorMsg v-if="scheduleCheckingList.triggerName.pass == false"
          >{{ scheduleCheckingList.triggerName.msg }}
        </inputErrorMsg>
      </li>
      <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
        <span class="self-center pb-2 md:pb-0">
          <div
            class="border-b-2 border-secondaryDark drop-shadow-sm w-fit flex"
          >
            排程群組
            <div class="text-cancel">※</div>
          </div></span
        >
        <label class="inpLabel col-span-2">
          <select
            class="inp w-full"
            v-verify:[triggerGroupValidArg]="scheduleCheckingList.triggerGroup"
            v-model="triggerGroup"
          >
            <option disabled value="">請選擇您所發布的群組</option>
            <option value="post">公告</option>
            <option value="advertise">廣告</option>
          </select></label
        >
      </li>

      <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
        <span class="self-center pb-2 md:pb-0">
          <div
            class="border-b-2 border-secondaryDark drop-shadow-sm w-fit flex"
          >
            觸發時間
            <div class="text-cancel">※</div>
          </div></span
        >
        <label class="inpLabel col-span-2">
          <input
            type="text"
            placeholder="* /50 * * * * ?"
            class="w-full inp block"
            v-verify:[cronTimeValidArg]="scheduleCheckingList.cronTime"
            v-model="cronTime"
        /></label>
      </li>
      <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
        <span class="self-center pb-2 md:pb-0">
          <div
            class="border-b-2 border-secondaryDark drop-shadow-sm w-fit flex"
          >
            排程狀態
            <div class="text-cancel">※</div>
          </div></span
        >
        <label class="inpLabel col-span-2">
          <select
            class="inp w-full"
            v-verify:[triggerFlagValidArg]="scheduleCheckingList.triggerFlag"
            v-model="triggerFlag"
          >
            <option disabled value="">請選擇您所發布的狀態</option>
            <option value="1">啟用</option>
            <option value="0">未啟用</option>
          </select></label
        >
      </li>
      <li class="py-2 md:py-4 grid md:grid-cols-3 gap-x-8">
        <span class="self-center pb-2 md:pb-0">
          <div class="border-b-2 border-secondaryDark drop-shadow-sm w-fit">
            備註
          </div></span
        >
        <label class="inpLabel col-span-2">
          <input
            type="text"
            name="status"
            class="w-full inp block col-span-2"
            v-model="memo"
        /></label>
      </li>
      <span class="text-cancel mt-3 self-center">{{}}</span>
      <button id="ok-btn" class="btn btnClick w-full mt-3" @click="addTrigger">
        新增
      </button>
    </ul>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { CreateSchedule } from "../../api/service";
import router from "../../router/router";
import { useCommonStore } from "../../store/commonStore";
import { useStore } from "../../store/store";
import inputErrorMsg from "../inputErrorMsg.vue";
const Store = useStore();
const commonStore = useCommonStore();
const cronTime = ref(""),
  jobData = ref(""),
  jobName = ref(""),
  memo = ref(""),
  triggerFlag = ref(""),
  triggerGroup = ref(""),
  triggerName = ref("");

const jobNameValidArg = ["notNull"];
const triggerNameValidArg = ["notNull", "notCn"];
const triggerGroupValidArg = ["notNull"];
const triggerFlagValidArg = ["notNull"];
const cronTimeValidArg = ["notNull", "cronTimeLastWord"];

const scheduleCheckingList = ref({
  jobName: { pass: null, msg: null },
  triggerName: { pass: null, msg: null },
  triggerGroup: { pass: null, msg: null },
  cronTime: { pass: null, msg: null },
  triggerFlag: { pass: null, msg: null },
});

const validCheck = () => {
  for (let item in scheduleCheckingList.value) {
    if (scheduleCheckingList.value[item].pass != true) {
      return false;
    }
  }
  return true;
};

const addTrigger = () => {
  if (validCheck()) {
    Store.alertShow = true;
    Store.alertObj = {
      msg: "確定新增？",
      func: async (e) => {
        if (e.target.value === "confirm") {
          const res = await CreateSchedule(
            jobName.value,
            jobData.value,
            triggerName.value,
            triggerGroup.value,
            cronTime.value,
            triggerFlag.value,
            memo.value
          );
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
