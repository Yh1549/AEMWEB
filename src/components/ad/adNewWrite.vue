<template>
  <div class="my-2">
    <div class="flex gap-8 items-center my-4">
      <!-- row -->
      <div class="flex-initial w-72 h-32">
        <span class="ml-2">開始日期/時間 :</span>
        <label class="inpLabel w-full">
          <input
            type="date"
            class="inp w-full"
            :min="Store.getToday()"
            v-verify:[startDateValidArg]="newAdChecking.startDate"
            v-model="startDate"
          />
        </label>
        <label class="inpLabel w-full my-2">
          <input
            type="time"
            class="inp w-full"
            v-verify:[startTimeValidArg]="newAdChecking.startTime"
            v-model="startTime"
            @change="buildStartTime"
          />
        </label>
      </div>
      <div class="flex-initial w-1/2 h-32">
        <p class="block ml-2">結束日期 :</p>
        <div class="flex">
          <button
            class="btn self-start mr-2 my-1"
            :class="foreverOnline ? 'bg-submit' : 'bg-gray-500'"
            @click="foreverOnlineToggle"
          >
            永久上架{{ foreverOnline ? "開啟" : "關閉" }}
          </button>
          <div v-if="!foreverOnline">
            <label class="inpLabel w-full">
              <input
                type="date"
                class="inp w-full"
                v-model="endDate"
                :disabled="startDate == null"
                :min="startDate"
              />
            </label>
            <label class="inpLabel w-full my-2">
              <input
                type="time"
                class="inp w-full"
                v-model="endTime"
                @change="buildEndTime"
              />
            </label>
          </div>
        </div>
        <input type="checkbox" hidden v-model="foreverOnline" />
      </div>
    </div>
    <div class="flex gap-8 items-center my-4">
      <div class="flex-initial w-72 h-24">
        <span class="ml-2">發布系統 :</span>
        <label for="system" class="inpLabel w-full font-bold">
          <select
            class="inp w-full"
            @change="
              getSelectSys($event);
              findFlow();
            "
            v-verify:[systemValidArg]="newAdChecking.system"
            v-model="props.newAd.system"
          >
            <option disabled value="null">請選擇</option>
            <option
              v-for="item in getSystemMemo"
              :key="item.name"
              :value="item.name"
            >
              {{ item.memo }}
            </option>
          </select>
        </label>
      </div>
      <div class="flex-initial w-72 h-24">
        <span class="ml-2">廣告區塊 :</span>
        <label for="system" class="inpLabel w-full font-bold">
          <select
            class="inp w-full"
            v-verify:[blockValidArg]="newAdChecking.block"
            v-model="selectedBlock"
          >
            <option disabled value="null">請選擇</option>
            <option
              v-for="item in adBlockList"
              :key="item.block"
              :value="item.block"
            >
              {{ item.memo }}
            </option>
          </select>
        </label>
      </div>
      <div class="flex-initial w-72 h-24">
        <span class="ml-2">選擇建檔流程 :</span>
        <label class="inpLabel w-full">
          <select
            class="w-full inp"
            v-verify:[flowValidArg]="newAdChecking.flow"
            v-model="props.newAd.flow"
          >
            <option disabled value="null">請選擇</option>
            <option
              v-for="(item, index) in flowStore.caseflow"
              :value="item.flow"
              :key="index"
              :selected="index == 0"
            >
              {{ item.memo }}
            </option>
          </select>
        </label>
      </div>
    </div>
    <div class="h-24">
      <span class="ml-2">超連結 :</span>
      <label class="inpLabel w-full">
        <input type="text" class="inp w-full" v-model="props.newAd.link" />
      </label>
    </div>
    <div
      class="p-4 border-2 border-primaryDark bg-white shadow-md rounded flex flex-col justify-center md:h-full"
    >
      <img
        v-if="props.newAd.photo != null"
        :src="`data:image;base64,${props.newAd.photo}`"
        alt="preview"
        class="mx-auto md:max-h-60"
      />
      <label class="w-full hidden">
        <input
          type="file"
          accept="image/*"
          @change="adImgUpload($event)"
          ref="fileTnput"
        />
      </label>
      <div class="w-full flex justify-center mt-2">
        <!-- <span class="block font-bold text-center">圖片預覽</span> -->
        <button class="btn btnClick" @click="$refs.fileTnput.click()">
          上傳圖片
        </button>
      </div>
      <span class="text-center">圖片檔案大小限制為1MB</span>
    </div>
    <div class="my-4">
      <span class="ml-2">標題 :</span>
      <label class="w-full inpLabel mb-4">
        <input
          type="text"
          class="inp w-full"
          v-verify:[titleValidArg]="newAdChecking.title"
          v-model="props.newAd.title"
        />
      </label>
      <span class="ml-2">內文 :</span>
      <tiptap v-model="props.newAd.content" />
    </div>
  </div>
  <div class="w-full flex justify-evenly my-8">
    <button @click="nextStep" class="btn btnClick w-48">下一步</button>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import apiRequest from "../../api/apiRequest";
import { FindEmpCaseFlowForCaseCreate } from "../../api/service";
import { useAdStore, useFlowStore, useStore } from "../../store/store";
import Tiptap from "../Tiptap/Tiptap.vue";

const flowStore = useFlowStore();
const adStore = useAdStore();
const Store = useStore();
const sysList = ref("");

const emit = defineEmits(["newAdConfirm"]);
const props = defineProps(["newAd"]);
const foreverOnline = ref(true);
const selectedBlock = ref(null);
const adBlockList = ref([]);
const startDate = ref("");
const startTime = ref("");
const endDate = ref("");
const endTime = ref("");
//
const startDateValidArg = ["notNull", "todayAfter"];
const startTimeValidArg = ["notNull"];
const systemValidArg = ["notNull"];
const flowValidArg = ["notNull"];
const titleValidArg = ["notNull", "charMax(64)"];
const contentValidArg = ["notNull"];
const blockValidArg = ["notNull"];
const newAdChecking = ref({
  flow: { pass: null, msg: null },
  startDate: { pass: null, msg: null },
  startTime: { pass: null, msg: null },
  title: { pass: null, msg: null },
  // content: { pass: null, msg: null },
  system: { pass: null, msg: null },
  block: { pass: null, msg: null },
});
//
const foreverOnlineToggle = () => {
  foreverOnline.value = !foreverOnline.value;
  if (foreverOnline.value) {
    props.newAd.endDate = "2099-01-01 00:00:00";
  } else {
    props.newAd.endDate = null;
  }
};
//
const getSelectSys = () => {
  apiRequest
    .post("FindSystemBlock", { system: props.newAd.system })
    .then((res) => {
      if (res.desc == "successful") {
        adBlockList.value = res.resBody.blockModelList;
        selectedBlock.value = null;
      }
    })
    .catch();
};
const findFlow = async () => {
  const res = await FindEmpCaseFlowForCaseCreate("AD", props.newAd.system);
  if (res.desc == "successful") {
    flowStore.caseflow = res.resBody.flowList;
  }
};
const nextStep = () => {
  for (let item in newAdChecking.value) {
    if (!newAdChecking.value[item].pass) {
      Store.alertShow = true;
      Store.alertObj = {
        msg: "請確認輸入資料正確",
        func: (e) => {},
      };
      return;
    }
  }
  props.newAd.block = selectedBlock.value;
  emit("newAdConfirm", props.newAd);
  adStore.newAdStep = false;
};

const adReader = (file) => {
  let Reader = new FileReader();
  Reader.onload = (e) => {
    let img = e.target.result;
    let type = img.split(",")[0].split(";")[0].split(":")[1].split("/")[0];
    if (type === "image") {
      props.newAd.photo = img.split(",")[1];
    } else {
      Store.alertShow = true;
      Store.alertObj = {
        msg: "請上傳圖片!!",
        func: () => {},
      };
    }
  };
  Reader.readAsDataURL(file);
};
const adImgUpload = (e) => {
  if (e.target.files[0].size > 1000000) {
    Store.alertShow = true;
    Store.alertObj = {
      msg: "檔案太大，請上傳小於1MB的圖片",
      func: () => {},
    };
  } else {
    adReader(e.target.files[0]);
  }
};
//
const buildStartTime = () => {
  props.newAd.startDate = startDate.value + " " + startTime.value + ":00";
};
const buildEndTime = () => {
  props.newAd.endDate = endDate.value + " " + endTime.value + ":00";
};
const getSystemMemo = computed(() => {
  let array = [];
  for (let sys of JSON.parse(sessionStorage.getItem("SysList"))) {
    for (let value of sysList.value) {
      if (sys.name == value) {
        array.push(sys);
      }
    }
  }
  return array;
});
onMounted(async () => {
  flowStore.caseDetail = {};
  let res = await apiRequest.post("FindUserSystem", {});
  if ((res.desc = "successful")) {
    sysList.value = res.resBody.system;
  }
});
</script>
