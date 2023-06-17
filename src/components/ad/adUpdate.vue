<template>
  <div class="w-full p-2">
    <formRow class="w-3/4 mx-auto">
      <formRowItem :width="'w-full'">
        <span class="font-bold block">標題 :</span>
        <label class="inpLabel w-full">
          <input
            type="text"
            class="inp w-full"
            :placeholder="props.data.title"
            v-verify:[titleValidArg]="adUpdateChecking.title"
            v-model="updateAd.title"
          />
        </label>
      </formRowItem>
    </formRow>
    <div class="w-3/4 mx-auto">
      <p class="font-bold">
        日期/時間:<span class="mx-2">{{ props.data.startDate }}</span>
      </p>
    </div>
    <formRow class="w-3/4 mx-auto">
      <formRowItem :width="'w-1/2'">
        <p class="mb-2">上線日期/時間:</p>
        <div class="flex gap-2">
          <label class="inpLabel w-1/2 self-center">
            <input
              type="date"
              class="inp w-full"
              :min="Store.getToday()"
              :max="updateAd.endDate"
              v-model="startDate"
            />
          </label>
          <label class="inpLabel w-1/2 self-center">
            <input
              type="time"
              class="inp w-full"
              v-model="startTime"
              @change="buildStartTime"
            />
          </label>
        </div>
      </formRowItem>
      <formRowItem :width="'w-1/2'">
        <div class="flex gap-2 mb-2">
          <span>下線日期/時間:</span>
          <input
            id="toggleSwicthInput"
            class="hidden"
            type="checkbox"
            v-model="permanentToggle"
          />
          <label for="toggleSwicthInput" class="toggleSwicth"></label>
          <span> 永久上線{{ permanentToggle ? "開啟" : "關閉" }} </span>
        </div>
        <div class="flex gap-2">
          <label class="inpLabel w-1/2 self-center">
            <input
              type="date"
              class="inp w-full"
              :disabled="permanentToggle"
              :min="updateAd.startDate"
              v-model="endDate"
            />
          </label>
          <label class="inpLabel w-1/2 self-center">
            <input
              type="time"
              class="inp w-full"
              :disabled="permanentToggle"
              v-model="endTime"
              @change="buildEndTime"
            />
          </label>
        </div>
      </formRowItem>
    </formRow>
    <formRow class="w-3/4 mx-auto">
      <formRowItem>
        <p class="font-bold">區塊 :</p>
        <label class="inpLabel w-full">
          <select class="w-full inp" v-model="updateAd.block">
            <option
              v-for="item in adBlockList"
              :key="item.block"
              :value="item.block"
            >
              {{ item.memo }}
            </option>
          </select>
        </label>
      </formRowItem>
    </formRow>
    <formRow class="w-3/4 mx-auto">
      <formRowItem :width="'w-full'">
        <span class="font-bold">超連結 :</span>
        <label class="inpLabel w-full">
          <input
            type="text"
            class="w-full inp"
            :placeholder="props.data.link"
            v-model="updateAd.link"
          />
        </label> </formRowItem
    ></formRow>
    <div
      class="p-2 w-3/4 mx-auto flex justify-between border-2 border-primaryDark rounded min-h-[100px]"
    >
      <button class="btn self-center" @click="$refs.photo.click()">
        上傳圖片
      </button>
      <div class="w-full flex items-center justify-center">
        <div v-if="updateAd.photo" class="overflow-scroll flex justify-center">
          <img class="w-full" :src="`data:image;base64,${updateAd.photo}`" />
        </div>
        <span v-else>無</span>
      </div>
      <label class="hidden">
        <input
          type="file"
          accept="image/*"
          @change="adImgUpload($event)"
          ref="photo"
        />
      </label>
    </div>
    <div class="w-3/4 mx-auto p-2 my-4">
      <Tiptap v-model="updateAd.content"></Tiptap>
    </div>
  </div>
  <div class="flex justify-center">
    <button class="btn bg-submit" @click="sendUpdateAd">儲存</button>
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { useStore } from "../../store/store";
import Tiptap from "../Tiptap/Tiptap.vue";
import formRow from "../formRow.vue";
import formRowItem from "../formRowItem.vue";

const Store = useStore();

const route = useRoute();
const router = useRouter();
const props = defineProps(["data"]);
const startDate = ref("");
const startTime = ref("");
const endDate = ref("");
const endTime = ref("");
//
const adBlockList = ref([]);
const updateAd = ref({
  uuid: props.data.uuid,
  title: props.data.title,
  content: props.data.content,
  startDate: props.data.startDate,
  endDate: props.data.endDate + ":00",
  photo: props.data.photo,
  link: props.data.link,
  block: props.data.block,
});
const adUpdateChecking = ref({
  title: { pass: true, msg: null },
  // content: { pass: null, msg: null },
});
const titleValidArg = ["notNull", "charMax(64)"];
//
const permanentToggle = ref(false);

const adReader = (file) => {
  let Reader = new FileReader();
  Reader.onload = (e) => {
    let img = e.target.result;
    let type = img.split(",")[0].split(";")[0].split(":")[1].split("/")[0];
    if (type === "image") {
      updateAd.value.photo = img.split(",")[1];
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

const validCheck = () => {
  for (let item in adUpdateChecking.value) {
    if (adUpdateChecking.value[item].pass != true) {
      return false;
    }
  }
  return true;
};
const findOneAd = async () => {
  let res = await apiRequest.post("FindOneAd", { uuid: route.params.uuid });
  if (res.desc == "successful") {
    Store.loadingSpinner = false;
    props.data = res.resBody;
    Store.detailUpdateToggle = false;
  } else {
    Store.loadingSpinner = false;
    router.push({
      name: "404error",
    });
  }
};
const updateAdvertise = async () => {
  let res = await apiRequest.post("UpdateAdvertise", updateAd.value);
  if (res.desc === "successful") {
    findOneAd();
  } else {
    Store.loadingSpinner = false;
    Store.alertShow = true;
    Store.alertObj = {
      msg: "變更失敗",
      func: () => {},
    };
  }
};
const sendUpdateAd = (event) => {
  let check = validCheck();
  if (!check) {
    Store.alertShow = true;
    Store.alertObj = {
      msg: "輸入有誤，請重新檢查",
      func: (e) => {},
    };
    return;
  }
  Store.alertShow = true;
  Store.alertObj = {
    msg: "確定修改?",
    func: async (e) => {
      if (e.target.value == "confirm") {
        Store.loadingSpinner = true;
        updateAdvertise();
      }
    },
  };
};
const buildStartTime = () => {
  updateAd.value.startDate = startDate.value + " " + startTime.value + ":00";
};
const buildEndTime = () => {
  updateAd.value.endDate = endDate.value + " " + endTime.value + ":00";
};
onBeforeMount(async () => {
  if (props.data.endDate == "2099-01-01 00:00:00") {
    permanentToggle.value = true;
  }
  await apiRequest
    .post("FindSystemBlock", { system: props.data.system })
    .then((res) => {
      if (res.desc == "successful") {
        adBlockList.value = res.resBody.blockModelList;
      }
    })
    .catch();
});
</script>
