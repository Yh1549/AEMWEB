<template>
  <div class="my-2">
    <!-- row-->
    <formRow>
      <formRowItem>
        <span class="text-cancel font-bold">*</span>
        <span class="inline-block">是否置頂 : </span>
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
        <div class="block">
          <span class="text-cancel font-bold">*</span>
          <span>上架日期與時間 : </span>
        </div>
        <div class="flex gap-4">
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
        </div>
        <inputErrorMsg v-if="newPostChecking.postDate.pass == false">{{
          newPostChecking.postDate.msg
        }}</inputErrorMsg>
      </formRowItem>
    </formRow>
    <formRow>
      <!-- row -->
      <formRowItem>
        <div class="flex justify-between items-center pr-1">
          <div>
            <span class="text-cancel font-bold">*</span>
            <span>發布系統</span>
          </div>
          <span class="text-sm opacity-70">您打算發送公告的系統</span>
        </div>
        <label class="inpLabel w-full">
          <select
            class="w-full inp"
            v-verify:[relSysValidArg]="newPostChecking.relSys"
            v-model="props.newPost.relSys"
            @change="selectSystemGetTag"
          >
            <option disabled value="null">請選擇您所發布的系統</option>
            <option
              v-for="item in getSystemMemo"
              :key="item"
              :value="item.name"
            >
              {{ item.memo }}/{{ item.name }}
            </option>
          </select></label
        >
        <inputErrorMsg v-if="newPostChecking.relSys.pass == false">{{
          newPostChecking.relSys.msg
        }}</inputErrorMsg>
      </formRowItem>
      <formRowItem :width="'w-fit'" class="min-h-[96px] h-fit">
        <p class="ml-2">發布群組 :</p>
        <div class="w-full flex gap-3 flex-wrap">
          <span v-if="checkTag()" class="opacity-70">{{ noTag }}</span>
          <div v-else class="flex gap-4">
            <label v-for="item in tagList" class="inpLabel cursor-pointer">
              <input type="checkbox" v-model="postTag" :value="item.name" />
              {{ item.memo }}/{{ item.name }}
            </label>
          </div>
        </div>
      </formRowItem>
    </formRow>
    <formRow>
      <formRowItem>
        <span class="text-cancel font-bold">*</span>
        <span>選擇建檔流程 :</span>
        <label class="inpLabel w-full">
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
        <div>
          <span class="text-cancel font-bold">*</span>
          <span>標題</span>
        </div>
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
        <div>
          <span class="text-cancel font-bold">*</span>
          <span>內文</span>
        </div>
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
import { FindEmpCaseFlowForCaseCreate } from "../../api/service";
import { InputValidationContent } from "../../formValidation/validTunnel";
import { useStore } from "../../store/store";
import Tiptap from "../Tiptap/Tiptap.vue";
import formRow from "../formRow.vue";
import formRowItem from "../formRowItem.vue";
import inputErrorMsg from "../inputErrorMsg.vue";
const Store = useStore();

const route = useRoute();
const emit = defineEmits(["toConfirm"]);
const props = defineProps(["newPost"]);
const fullInfo = ref({});
const postDate = ref("");
const postTime = ref("");
const sysList = ref("");
const tagList = ref("");
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
const noTag = ref("");
const flowList = ref([]);
const flowDetailInfo = ref({});
const postTag = ref([]);
const findFlow = async () => {
  const res = await FindEmpCaseFlowForCaseCreate("POST", props.newPost.relSys);
  if (res.desc == "successful") {
    flowList.value = res.resBody.flowList;
  }
};
const selectSystemGetTag = async () => {
  let res = await apiRequest.post("FindPostTag", {
    system: props.newPost.relSys,
  });
  if (res.desc == "successful") {
    tagList.value = res.resBody.tagModelList;
  }
  findFlow();
  postTag.value = [];
  props.newPost.flow = null;
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
const checkTag = () => {
  if (props.newPost.relSys == null) {
    noTag.value = "請先選擇發布的系統";
    return true;
  } else if (tagList.value.length == 0) {
    noTag.value = "目前尚無群組";
    return true;
  } else {
    return false;
  }
};
const nextStep = () => {
  props.newPost.tag = postTag.value;
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
  fullInfo.value.tag = tagList.value;
  emit("toConfirm", props.newPost, "confirm", fullInfo.value);
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
