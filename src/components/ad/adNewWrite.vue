<template>
  <div class="my-2">
    <formRow>
      <formRowItem :width="'w-96'">
        <span class="text-cancel font-bold">*</span>
        <span>開始日期/時間 :</span>
        <div class="flex gap-4">
          <label class="inpLabel w-full my-2">
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
      </formRowItem>
      <formRowItem :width="'w-full'">
        <p>結束日期 :</p>
        <div class="flex gap-4">
          <button
            class="btn self-center my-2"
            :class="foreverOnline ? 'bg-submit' : 'bg-gray-500'"
            @click="foreverOnlineToggle"
          >
            永久上架{{ foreverOnline ? "開啟" : "關閉" }}
          </button>
          <div v-if="!foreverOnline" class="flex gap-2">
            <label class="inpLabel my-2">
              <input
                type="date"
                class="inp w-full"
                v-model="endDate"
                :disabled="startDate == null"
                :min="startDate"
              />
            </label>
            <label class="inpLabel my-2">
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
      </formRowItem>
    </formRow>
    <formRow>
      <formRowItem>
        <span class="text-cancel font-bold">*</span>
        <span>發布系統 :</span>
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
              {{ item.memo }} / {{ item.name }}
            </option>
          </select>
        </label>
      </formRowItem>
      <formRowItem>
        <span class="text-cancel font-bold">*</span>
        <span>廣告區塊 :</span>
        <label for="system" class="inpLabel w-full font-bold">
          <select
            class="inp w-full"
            v-verify:[blockValidArg]="newAdChecking.block"
            v-model="selectedBlock"
          >
            <option disabled value="null">請選擇</option>
            <option v-for="item in adBlockList" :key="item.block" :value="item">
              {{ item.memo }}/{{ item.block }}
            </option>
          </select>
        </label></formRowItem
      >
      <formRowItem>
        <span class="text-cancel font-bold">*</span>
        <span>選擇建檔流程 :</span>
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
              {{ item.memo }}/{{ item.flow }}
            </option>
          </select>
        </label></formRowItem
      >
    </formRow>
    <formRow>
      <formRowItem :width="'w-full'">
        <span class="ml-2">超連結 :</span>
        <label class="inpLabel w-full">
          <input
            type="text"
            class="inp w-full"
            v-verify:[linkValidArg]="newAdChecking.link"
            v-model="props.newAd.link"
          />
        </label>
      </formRowItem>
    </formRow>
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
    <formRow>
      <formRowItem :width="'w-full'">
        <span class="text-cancel font-bold">*</span>
        <span>標題 :</span>
        <label class="w-full inpLabel mb-4">
          <input
            type="text"
            class="inp w-full"
            v-verify:[titleValidArg]="newAdChecking.title"
            v-model="props.newAd.title"
          />
        </label>
      </formRowItem>
    </formRow>

    <span class="text-cancel font-bold">*</span>
    <span>內文 :</span>
    <tiptap class="tiptapStyle" v-model="props.newAd.content" />
  </div>
  <div class="w-full flex justify-evenly my-8">
    <button @click="nextStep" class="btn btnClick w-48">下一步</button>
  </div>
</template>
<script setup>
import { computed, onBeforeMount, ref } from "vue";
import apiRequest from "../../api/apiRequest";
import { FindEmpCaseFlowForCaseCreate } from "../../api/service";
import { checkValidList } from "../../formValidation/validTunnel";
import { useFlowStore, useStore } from "../../store/store";
import Tiptap from "../Tiptap/Tiptap.vue";
import formRow from "../formRow.vue";
import formRowItem from "../formRowItem.vue";

const flowStore = useFlowStore();
const Store = useStore();
const sysList = ref("");
const fullSysList = ref("");

const emit = defineEmits(["toConfirm"]);
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
const linkValidArg = ["notNull"];
const blockValidArg = ["notNull"];
const newAdChecking = ref({
  flow: { pass: null, msg: null },
  startDate: { pass: null, msg: null },
  startTime: { pass: null, msg: null },
  title: { pass: null, msg: null },
  // content: { pass: null, msg: null },
  link: { pass: true, msg: null },
  system: { pass: null, msg: null },
  block: { pass: null, msg: null },
});

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
  if (!checkValidList(newAdChecking.value)) {
    Store.alertShow = true;
    Store.alertObj = {
      msg: "請確認輸入資料正確",
      func: (e) => {},
    };
    return;
  }
  props.newAd.block = selectedBlock.value.block;
  emit("toConfirm", props.newAd, "confirm", selectedBlock.value);
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
  for (let sys of fullSysList.value) {
    for (let value of sysList.value) {
      if (sys.name == value) {
        array.push(sys);
      }
    }
  }
  return array;
});
onBeforeMount(async () => {
  flowStore.caseDetail = {};
  fullSysList.value = JSON.parse(sessionStorage.getItem("SysList"));
  let res = await apiRequest.post("FindUserSystem", {});
  if ((res.desc = "successful")) {
    sysList.value = res.resBody.system;
  }
});
</script>
