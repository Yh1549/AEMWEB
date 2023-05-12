<template>
  <div class="flex">
    <div class="w-full">
      <div class="lobbyBanner">
        <div class="flex flex-col justify-between">
          <span class="text-2xl font-bold text-primaryDark">{{}}</span>
          <div class="">
            <h1 class="text-2xl font-bold text-primaryDark">
              Welcome，{{ Store().currentUser().name }}
            </h1>
            <span class="my-2 font-bold text-primaryDark"
              >歡迎來到聯邦銀行公告系統</span
            >
          </div>
        </div>
        <div class="bg-primary rounded-full shadow-lg">
          <img
            class="w-full hidden scale-90 md:block"
            src="../../assets/man.svg"
          />
        </div>
      </div>
      <div class="md:flex">
        <router-link
          :to="{ name: 'postNew' }"
          class="md:w-1/2 md:mr-3 my-4 flex items-center justify-center bg-gradient-to-br from-primary to-primaryDark rounded cursor-pointer relative group shadow-md"
        >
          <!--加字記號-->
          <div
            class="w-16 md:w-24 mr-4 relative group-hover:scale-105 transition-all"
          >
            <span class="text-white text-[100px]">
              <i class="fa-solid fa-plus"></i>
            </span>
          </div>
          <span class="text-white text-2xl font-bold ml-4"
            >立即新增<span class="text-secondaryDark font-bold"
              >公告</span
            ></span
          >
        </router-link>
        <router-link
          :to="{ name: 'advertiseNew' }"
          class="md:w-1/2 md:ml-2 my-4 flex items-center justify-center bg-gradient-to-br from-primary to-primaryDark rounded cursor-pointer relative group shadow-md"
        >
          <!--加字記號-->
          <div
            class="w-16 md:w-24 mr-4 relative group-hover:scale-105 transition-all"
          >
            <span class="text-white text-[100px]">
              <i class="fa-solid fa-plus"></i>
            </span>
          </div>
          <span class="text-white text-2xl font-bold ml-4"
            >立即新增<span class="text-secondaryDark font-bold"
              >廣告</span
            ></span
          >
        </router-link>
      </div>
    </div>
    <!-- NoticeForRoleLightVer -->
    <div class="ml-4 hidden md:flex lg:w-5/16">
      <div
        class="h-auto p-2 rounded my-4 shadow-lg border-primaryDark border-2 w-full bg-white"
      >
        <div class="py-1 flex items-center">
          <span class="text-secondaryDark text-2xl">
            <i class="fa-solid fa-bell"></i>
          </span>
          <span class="text-lg font-bold">{{ calendarTitle }}</span>
        </div>
        <v-calendar is-expanded :attributes="attrs" @dayclick="onDayClick" />
        <!-- show公告 -->
        <div class="max-h-80 memo my-2 p-2">
          <div
            v-if="showtext != []"
            class="mb-1 bg-primaryDark text-white rounded p-2 font-bold"
            id="textTitle"
          >
            {{ showdata }}
          </div>
          <ul class="text-sm">
            <li
              v-for="item in showtext"
              :key="item"
              class="p-1 my-2 border-2 border-primaryDark rounded bg-primaryLight/40 cursor-pointer hover:scale-101"
              @click="approveDetail(noticeData.detail[item])"
            >
              <div
                class="text-white bg-secondaryDark w-3 h-3 rounded-full inline-block mr-1"
              ></div>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Store } from "../../store/store";
import { commonStore } from "../../store/commonStore";
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import apiRequest from "../../api/apiRequest";
import { NoticeForRoleLightVer } from "../../api/service";
import { useRouter } from "vue-router";

const router = useRouter();
const noticeData = reactive({
  detail: [],
  sum: [],
});
const showdata = ref("請點選月曆"),
  showtext = ref();
const attrs = ref([]);
const calendarTitle = ref("");
onBeforeMount(async () => {
  if (Store().getSvcAuth("CheckCaseAndRelease")) {
    calendarTitle.value = "待審核案件";
    const res = await NoticeForRoleLightVer();
    if (res.desc == "successful") {
      Store().noticeLight = res.resBody.caseList;
      Store().noticeLight.forEach((e) => {
        noticeData.detail[e.caseTitle] = e.caseUuid;
        e.startTime = e.startTime.split(" ")[0].split("/").join("-");
        noticeData.sum = Store().noticeLight.reduce(function (
          accumulator,
          currentValue
        ) {
          return (
            accumulator[currentValue.startTime]
              ? accumulator[currentValue.startTime].push(currentValue.caseTitle)
              : (accumulator[currentValue.startTime] = [
                  currentValue.caseTitle,
                ]),
            accumulator
          );
        },
        {});
      });
    } else {
    }
    Object.keys(noticeData.sum).forEach((e) => {
      const year = e.split("-")[0];
      const month = e.split("-")[1] - 1;
      const date = e.split("-")[2];
      attrs.value.push({
        highlight: {
          style: {
            backgroundColor: "#FFBE01",
          },
          color: "yellow",
          fillMode: "solid",
          contentClass: "italic",
        },
        dates: new Date(year, month, date),
        popover: {
          label: "待審核案件：" + noticeData.sum[e].length,
        },
      });
    });
  } else {
    calendarTitle.value = "無審核權限";
  }
});
const onDayClick = (day) => {
  const idx = Object.keys(noticeData.sum).findIndex((d) => d === day.id);
  if (idx != -1) {
    showdata.value =
      day.id + " 尚有" + noticeData.sum[day.id].length + "筆未審核案件";
    showtext.value = noticeData.sum[day.id];
  } else {
    showdata.value = day.id + "  沒有未審核案件";
    showtext.value = [];
  }
};
const approveDetail = (caseUuid) => {
  Store().approveSign = true;
  router.push({
    name: "approveDetail",
    params: {
      caseUuid,
    },
  });
};
</script>
<style scoped>
.lobbyBanner {
  @apply flex  justify-between p-4 mt-4 rounded border-2 border-primaryDark bg-secondaryLight shadow-lg;
}

.memo {
  overflow-y: auto;
  word-break: break-all;
}
</style>
