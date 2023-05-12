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
            name="jobName"
            id="jobName"
            class="inp w-full"
            data-valid-option="notNull"
            v-model="jobName"
            @change="InputValidation(Store().scheduleCheckList, $event)"
          >
            <option value="" disabled>請選擇您所發布的排程</option>
            <option
              v-for="job in Store().jobList"
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
        <label class="inpLabel col-span-2">
          <input
            type="text"
            name="triggerName"
            data-valid-option="notNull,notCn"
            class="w-full inp block col-span-2"
            v-model="triggerName"
            @keyup="InputValidation(Store().scheduleCheckList, $event)"
        /></label>
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
            name="triggerGroup"
            id="triggerGroup"
            data-valid-option="notNull"
            class="inp w-full"
            v-model="triggerGroup"
            @change="InputValidation(Store().scheduleCheckList, $event)"
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
            name="cronTime"
            data-valid-option="notNull,cronTimeLastWord"
            placeholder="* /50 * * * * ?"
            class="w-full inp block"
            v-model="cronTime"
            @keyup="InputValidation(Store().scheduleCheckList, $event)"
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
            name="triggerFlag"
            id="triggerFlag"
            data-valid-option="notNull"
            class="inp w-full"
            v-model="triggerFlag"
            @change="InputValidation(Store().scheduleCheckList, $event)"
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
import { Store } from "../../store/store";
import { ref } from "vue";
import { InputValidation } from "../../formValidation/inputCase";
import { CreateSchedule } from "../../api/service";
import { commonStore } from "../../store/commonStore";
import router from "../../router/router";
const errorMsg = ref("");
const cronTime = ref(""),
  jobData = ref(""),
  jobName = ref(""),
  memo = ref(""),
  triggerFlag = ref(""),
  triggerGroup = ref(""),
  triggerName = ref("");
const addTrigger = () => {
  let pass = false;
  for (let value in Store().scheduleCheckList) {
    if (Store().scheduleCheckList[value] != null) {
      for (let i of Store().scheduleCheckList[value]) {
        if (i.result === false) {
          pass = false;
          errorMsg.value = i.msg;
          wrongInfo(value);
          break;
        } else {
          pass = true;
        }
      }
      if (!pass) {
        break;
      }
    } else {
      pass = false;
      errorMsg.value = "不可為空";
      wrongInfo(value);
      break;
    }
  }
  if (pass === true) {
    Store().alertShow = true;
    Store().alertObj = {
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
            commonStore().SvcFail.msg = res.desc;
            router.push({
              name: "SvcFail",
            });
          }
        }
      },
    };
  }
};
const wrongInfo = (name) => {
  let msgObj = {
    jobName: "jobName",
    triggerName: "排程名稱",
    triggerGroup: "排程群組",
    cronTime: "觸發時間",
    triggerFlag: "排程狀態",
  };
  for (let i = 0; i < Object.keys(msgObj).length; i++) {
    if (Object.keys(msgObj)[i] == name) {
      Store().alertObj.msg = Object.values(msgObj)[i] + " " + errorMsg.value;
      break;
    }
  }
  Store().alertShow = true;
  Store().alertObj.func = (e) => {};
};
</script>
