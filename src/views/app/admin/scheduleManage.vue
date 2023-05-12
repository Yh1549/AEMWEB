<template>
  <button
    class="btn btnClick bg-submit m-2 text-base"
    @click="addSchedule()"
    v-if="Store().getSvcAuth('CreateSchedule')"
  >
    新增排程
    <i class="fa-solid fa-plus"></i>
  </button>
  <hr class="my-2" />
  <div v-for="schedule of Store().scheduleList" :key="schedule" class="my-7">
    <div class="flex gap-x-4 items-center w-full flex-wrap">
      <div class="flex gap-x-4 items-center">
        <span class="text-lg font-bold">{{ schedule.job }}</span>
        <span>{{ schedule.description }}</span>
      </div>
      <div class="flex flex-1 justify-end gap-x-2 pr-4">
        <div class="menu" v-if="Store().getSvcAuth('FindHistoryFireJob')">
          <button class="text-gray-400" @click="findHistory(schedule.job)">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </button>
          <span class="">查看JOB歷史紀錄</span>
        </div>
        <div
          class="menu"
          v-if="
            schedule.triggerInfoList != '' && Store().getSvcAuth('DeleteJob')
          "
        >
          <span>刪除JOB</span>
          <button class="bg-cancel text-white" @click="delJob(schedule.job)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <div
          class="menu"
          v-if="
            schedule.triggerInfoList != '' && Store().getSvcAuth('ReFireJob')
          "
        >
          <button class="bg-secondaryDark flex" @click="reJob(schedule.job)">
            <span class="hidden md:flex">立即執行</span>
            <i class="fa-solid fa-forward"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto scrollbar">
      <table class="w-full whitespace-nowrap">
        <thead class="text-left">
          <tr class="bg-primaryLight">
            <th class="w-24">狀態</th>
            <th>名稱</th>
            <th>建立日期</th>
            <th>上次執行時間</th>
            <th>下次執行時間</th>
            <th>triggerState</th>
            <th>備註</th>
            <th class="min-w-min"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="schedule.triggerInfoList == ''" class="bg-primaryDark/20">
            <td colspan="8" class="md:text-center">
              <span class="px-[20vw]">--- 目前尚無資料 ---</span>
            </td>
          </tr>
          <tr
            v-for="i of schedule.triggerInfoList"
            :key="i"
            class="hover:bg-secondaryLight/50"
            v-else
          >
            <td class="flex">
              <div
                class="w-4 h-4 my-auto mr-2 rounded-full border-2"
                :class="
                  i.triggerState == 'NORMAL'
                    ? ' bg-submit border-submitLight'
                    : 'bg-cancel border-cancelLight'
                "
              ></div>
              {{ i.triggerState == "NORMAL" ? "啟用中" : "未啟用" }}
            </td>
            <td>{{ i.triggerName }}</td>
            <td>{{ i.startTime }}</td>
            <td>{{ i.previousFireTime }}</td>
            <td>{{ i.nextFireTime }}</td>
            <td>{{ i.triggerState }}</td>
            <td class="">
              <div class="flex gap-x-2" v-if="!i.isEditing">
                <div>{{ i.description }}</div>
                <button
                  class=""
                  @click="starEdit(i)"
                  v-if="Store().getSvcAuth('UpdateMemo')"
                >
                  <div><i class="flex fa-solid fa-pen m-0.5"></i></div>
                </button>
              </div>
              <div class="flex gap-x-1" v-else>
                <input
                  type="text"
                  class="border-b border-black px-1 bg-cancelLight/70"
                  v-model="data.memo"
                />
                <button
                  class="bg-submit text-white"
                  @click="saveEdit(i.triggerName)"
                >
                  <i class="fa-solid fa-floppy-disk"></i>
                </button>
                <button class="bg-cancel text-white" @click="closeEdit(i)">
                  <i class="fa-solid fa-x"></i>
                </button>
              </div>
            </td>
            <td class="flex gap-x-2">
              <div class="menu" v-if="Store().getSvcAuth('UpdateStatus')">
                <span v-if="i.triggerState == 'NORMAL'">停用JOB</span>
                <span v-else>啟用JOB</span>
                <button @click="updateStatus(i.triggerName, i.triggerState)">
                  <div class="px-[5px]" v-if="i.triggerState == 'NORMAL'">
                    <i class="fa-solid fa-pause"></i>
                  </div>
                  <i class="fa-solid fa-play" v-else></i>
                </button>
              </div>
              <div class="menu" v-if="Store().getSvcAuth('UpdateCronTime')">
                <span>設定TiggerTime</span>
                <button
                  class="text-primaryDark"
                  @click="
                    (inputWin = true),
                      (setTime = true),
                      (data.triggerName = i.triggerName)
                  "
                >
                  <div class="px-0.5"><i class="fa-solid fa-gear"></i></div>
                </button>
              </div>
              <div class="menu" v-if="Store().getSvcAuth('DeleteTrigger')">
                <span>刪除Trigger</span>
                <button class="text-cancel" @click="delTrigger(i.triggerName)">
                  <div class="px-[3px]">
                    <i class="fa-solid fa-trash"></i>
                  </div>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    v-if="inputWin"
    class="fixed z-[10000] left-0 top-0 w-full h-full bg-black/[.40] grid place-items-center"
  >
    <div
      class="absolute rounded-md border bg-background shadow-lg w-[90%] md:w-[50%] lg:w-[35%] rounded z-[10000] overflow-y-auto scrollbar"
      :class="{
        'inset-y-5 lg:inset-y-8': newSchedule,
        'top-36 md:inset-y-auto': setTime,
        'inset-y-5  md:inset-y-20': history,
      }"
    >
      <div class="flex justify-end fill-slate-400 mt-3 mr-3">
        <button @click="cardClose()">
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
      <createSchedule v-if="newSchedule"></createSchedule>
      <updataTime :triggerName="data.triggerName" v-if="setTime"></updataTime>
      <historyJob v-if="history"></historyJob>
    </div>
  </div>
</template>
<script setup>
import { Store } from "../../../store/store";
import { ref, reactive } from "vue";
import createSchedule from "../../../components/schedule/createSchedule.vue";
import updataTime from "../../../components/schedule/UpdateTime.vue";
import historyJob from "../../../components/schedule/historyJob.vue";
import {
  UpdateStatus,
  ReFireJob,
  FindJob,
  DeleteTrigger,
  DeleteJob,
  UpdateMemo,
  FindHistoryFireJob,
} from "../../../api/service";
import { commonStore } from "../../../store/commonStore";
import router from "../../../router/router";
const inputWin = ref(false),
  newSchedule = ref(false),
  setTime = ref(false),
  history = ref(false);
const data = reactive({
  triggerName: "",
  cronTime: "",
  memo: "",
});
let mes = "";
for (let value in Store().scheduleCheckList) {
  Store().scheduleCheckList[value] = null;
}
const addSchedule = () => {
  FindJob();
  inputWin.value = true;
  newSchedule.value = true;
};
const updateStatus = (triggerName, status) => {
  if (status == "NORMAL") {
    mes = "您確定要停用JOB?";
    status = 0;
  } else {
    mes = "您確定要啟用JOB?";
    status = 1;
  }
  Store().alertShow = true;
  Store().alertObj = {
    msg: mes,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await UpdateStatus(triggerName, status);
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
const delJob = (jobName) => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `您確定要刪除「${jobName}」嗎?`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await DeleteJob(jobName);
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
const reJob = (job) => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `您確定要重啟「${job}」嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await ReFireJob(job);
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
const delTrigger = (triggerName) => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `您確定要刪除「${triggerName}」嗎?`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await DeleteTrigger(triggerName);
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
const starEdit = (trigger) => {
  data.memo = trigger.description;
  Store().scheduleList.map((x) =>
    x.triggerInfoList.forEach((e) => {
      e.isEditing = false;
    })
  );
  trigger.isEditing = true;
};
const saveEdit = (triggerName) => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `您確定您確定要變更Trigger備註嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await UpdateMemo(triggerName, data.memo);
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
const closeEdit = (trigger) => {
  trigger.isEditing = false;
};
const cardClose = () => {
  inputWin.value = false;
  newSchedule.value = false;
  setTime.value = false;
  history.value = false;
  data.cronTime = "";
};
const findHistory = async (jobName) => {
  await FindHistoryFireJob(jobName);
  inputWin.value = true;
  history.value = true;
};
</script>
<style scoped>
button {
  @apply h-6 px-2 rounded border-primaryDark border drop-shadow hover:scale-110;
}
.menu {
  @apply relative;
}
.menu > span {
  @apply absolute w-28 text-center font-bold -top-[130%] -left-[105%] opacity-0 lg:inline-block py-1 z-20 text-sm transition-all pointer-events-none bg-primaryDark rounded text-white  hidden;
}
.menu:hover span {
  opacity: 1;
}
button > i {
  @apply m-1;
}
table {
  @apply border border-primaryDark/30;
}
th {
  @apply border-r border-primaryDark/30 px-1;
}
td {
  @apply border-r border-primaryLight/30 p-1;
}
</style>
