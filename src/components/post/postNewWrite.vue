<template>
  <div class="my-2">
    <!-- row-->
    <formRow>
      <formRowItem>
        <span class="inline-block ml-2">是否置頂 : </span>
        <div class="w-full flex gap-4">
          <label class="inpLabel cursor-pointer">
            <input type="radio" value="1" v-model="props.newPost.top" />
            <span class="ml-1">置頂</span>
          </label>
          <label class="inpLabel cursor-pointer">
            <input type="radio" value="0" v-model="props.newPost.top" />
            <span class="ml-1">不置頂</span>
          </label>
        </div>
      </formRowItem>
      <formRowItem :width="'w-96'">
        <span class="block ml-2">上架日期與時間 : </span>
        <label class="inpLabel w-1/2">
          <input
            type="date"
            class="inp w-full"
            :min="Store.getToday()"
            v-verify:[postDateValidArg]="newPostChecking.postDate"
            v-model="postDate"
          />
        </label>
        <label class="inpLabel w-1/2">
          <input
            type="time"
            class="inp w-full"
            v-verify:[postTimeValidArg]="newPostChecking.postTime"
            v-model="postTime"
            @change="buildPostTime"
          />
        </label>
        <inputErrorMsg v-if="newPostChecking.postDate.pass == false">{{
          newPostChecking.postDate.msg
        }}</inputErrorMsg>
      </formRowItem>
    </formRow>
    <formRow>
      <!-- row -->
      <formRowItem>
        <div class="flex justify-between items-center pr-1">
          <span class="ml-2">發布系統</span>
          <span class="text-sm opacity-70">您打算發送公告的系統</span>
        </div>
        <label class="inpLabel w-full">
          <select
            class="w-full inp"
            v-verify:[relSysValidArg]="newPostChecking.relSys"
            v-model="props.newPost.relSys"
            @change="
              findPostTag(props.newPost.relSys);
              findFlow();
              props.newPost.tag = null;
              props.newPost.flow = null;
            "
          >
            <option disabled value="null">請選擇您所發布的系統</option>
            <option
              v-for="item in getSystemMemo"
              :key="item"
              :value="item.name"
            >
              {{ item.memo }}
            </option>
          </select></label
        >
        <inputErrorMsg v-if="newPostChecking.relSys.pass == false">{{
          newPostChecking.relSys.msg
        }}</inputErrorMsg>
      </formRowItem>
      <formRowItem>
        <div class="flex justify-between items-center pr-1">
          <span class="ml-2">發布類別 :</span>
          <span class="text-sm opacity-70">預計發送系統的分類</span>
        </div>
        <label class="inpLabel w-full">
          <select class="w-full inp" v-model="props.newPost.tag">
            <option disabled value="null">請選擇公告類別</option>
            <option
              v-for="item in Store.postOption.Tag"
              :key="item.name"
              :value="item.name"
            >
              {{ item.memo }}
            </option>
          </select>
        </label>
      </formRowItem>
      <formRowItem>
        <span class="ml-2">選擇建檔流程 :</span
        ><label class="inpLabel w-full">
          <select
            class="w-full inp"
            v-verify:[flowValidArg]="newPostChecking.flow"
            v-model="props.newPost.flow"
            @change="flowDetail"
          >
            <option
              v-for="(item, index) in flowList"
              :value="item.flow"
              :key="index"
              :selected="index == 0"
            >
              {{ item.memo }}
            </option>
          </select>
        </label>
        <inputErrorMsg v-if="newPostChecking.flow.pass == false">{{
          newPostChecking.flow.msg
        }}</inputErrorMsg>
      </formRowItem>
      <formRowItem>
        <div
          class="w-full my-2 py-2 bg-primaryDark rounded flex z-50 shadow-lg relative h-20"
        >
          <div v-if="props.newPost.flow != null" class="text-white ml-2">
            <span class="block font-bold text-sm"
              >{{ props.newPost.flow }} 流程共
              {{ flowDetailInfo.totalLevel }} 層</span
            >
            <span class="block text-2xl font-bold">
              {{ flowDetailInfo.memo }}
            </span>
          </div>
          <span v-else class="text-white text-2xl ml-2">尚未選擇流程</span>

          <div class="h-12 absolute bottom-2 right-0 opacity-50">
            <img src="../../assets/caseflowimg.png" />
          </div>
        </div>
      </formRowItem>
    </formRow>
    <div class="my-4">
      <div class="flex justify-between items-center pr-1">
        <span class="ml-2">標題</span>
        <span class="text-sm opacity-70">您打算發送公告的標題</span>
      </div>
      <label for="title" class="inpLabel w-full mb-4">
        <input
          type="text"
          placeholder="請填寫公告標題"
          class="w-full inp"
          v-verify:[titleValidArg]="newPostChecking.title"
          v-model="props.newPost.title"
        />
      </label>
      <inputErrorMsg v-if="newPostChecking.title.pass == false">{{
        newPostChecking.title.msg
      }}</inputErrorMsg>
      <div class="flex justify-between items-center pr-1">
        <span class="ml-2">內文</span>
        <span class="text-sm opacity-70">您打算發送公告的內文</span>
      </div>
      <tiptap
        class="tiptapStyle"
        v-model="props.newPost.content"
        @keyup="
          InputValidationContent(props.newPost.content, newPostChecking.content)
        "
      />
    </div>
  </div>
  <div class="w-full flex justify-evenly my-8">
    <button @click="nextStep" class="btn btnClick w-48">下一步</button>
  </div>
</template>
<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { FindEmpCaseFlowForCaseCreate, findPostTag } from "../../api/service";
import { InputValidationContent } from "../../formValidation/validTunnel";
import { usePostStore, useStore } from "../../store/store";
import Tiptap from "../Tiptap/Tiptap.vue";
import formRow from "../formRow.vue";
import formRowItem from "../formRowItem.vue";
import inputErrorMsg from "../inputErrorMsg.vue";
const Store = useStore();
const postStore = usePostStore();

const route = useRoute();
const emit = defineEmits(["newPostConfirm"]);
const props = defineProps(["newPost"]);
const postDate = ref("");
const postTime = ref("");
const sysList = ref("");
//
const postDateValidArg = ["notNull", "todayAfter"];
const postTimeValidArg = ["notNull"];
const relSysValidArg = ["notNull"];
const flowValidArg = ["notNull"];
const titleValidArg = ["notNull", "charMax(64)"];
const contentValidArg = ["notNull"];
const newPostChecking = ref({
  flow: { pass: null, msg: null },
  postDate: { pass: null, msg: null },
  postTime: { pass: null, msg: null },
  title: { pass: null, msg: null },
  content: { pass: null, msg: null },
  relSys: { pass: null, msg: null },
});
//
const flowList = ref([]);
const flowDetailInfo = ref({});
const findFlow = async () => {
  const res = await FindEmpCaseFlowForCaseCreate("POST", props.newPost.relSys);
  if (res.desc == "successful") {
    flowList.value = res.resBody.flowList;
  }
};
const flowDetail = async () => {
  const res = await apiRequest.post("FindCaseFlowAndDetail", {
    flow: props.newPost.flow,
  });
  if (res.desc == "successful") {
    flowDetailInfo.value = res.resBody;
  }
};
const buildPostTime = () => {
  props.newPost.postDate = postDate.value + " " + postTime.value + ":00";
};
const nextStep = () => {
  for (let item in newPostChecking.value) {
    if (!newPostChecking.value[item].pass) {
      Store.alertShow = true;
      Store.alertObj = {
        msg: "請確認輸入資料正確",
        func: (e) => {},
      };
      return;
    }
  }
  emit("newPostConfirm", props.newPost);
  postStore.newPostStep = false;
  Store.currentNewStep = "postnewConfirm";
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

onBeforeMount(async () => {
  let res = await apiRequest.post("FindUserSystem", {});
  if ((res.desc = "successful")) {
    sysList.value = res.resBody.system;
  }
});
</script>
