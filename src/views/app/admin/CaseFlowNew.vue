<template>
  <div class="rounded-t bg-primaryLight p-4">
    <h2 class="border-b-2 border-white text-2xl pb-1 font-bold mb-3">
      審核流程
    </h2>
    <div class="w-15/16 mx-auto">
      <div class="flex">
        <div class="mr-5">
          <span class="block">系統</span>
          <label class="inpLabel">
            <select
              v-verify:[relSysValidArg]="flowCheckList.relSys"
              v-model.trim="flow.relSys"
              class="w-full inp"
            >
              <option disabled value="">請選擇審核流程系統</option>
              <option
                v-for="item in Store.postOption.System"
                :key="item.memo"
                :value="item.name"
              >
                {{ item.memo }} / {{ item.name }}
              </option>
            </select>
          </label>
          <inputErrorMsg v-if="flowCheckList.relSys.pass == false">{{
            flowCheckList.relSys.msg
          }}</inputErrorMsg>
        </div>
        <div class="mr-5">
          <span class="block">類型</span>
          <label class="inpLabel">
            <select
              v-verify:[typeValidArg]="flowCheckList.type"
              v-model.trim="flow.type"
              class="w-full inp"
            >
              <option disabled value="">請選擇審核流程類型</option>
              <option value="POST">公告</option>
              <option value="AD">廣告</option>
            </select>
          </label>
          <inputErrorMsg v-if="flowCheckList.type.pass == false">{{
            flowCheckList.type.msg
          }}</inputErrorMsg>
        </div>
        <div>
          <span class="block">層級總數</span>
          <label class="inpLabel">
            <select
              v-verify:[totalLevelValidArg]="flowCheckList.totalLevel"
              v-model.trim="flow.totalLevel"
              class="w-full inp"
              ref="selectLevels"
            >
              <option disabled value="">請選擇流程層級總數</option>
              <option v-for="item in 3" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </label>
          <inputErrorMsg v-if="flowCheckList.totalLevel.pass == false">{{
            flowCheckList.totalLevel.msg
          }}</inputErrorMsg>
        </div>
      </div>
      <div class="h-24">
        <span class="block">名稱</span>
        <label class="inpLabel w-full">
          <input
            type="text"
            id="memo"
            v-verify:[memoValidArg]="flowCheckList.memo"
            v-model.trim="flow.memo"
            class="w-full inp"
          />
        </label>
        <inputErrorMsg v-if="flowCheckList.memo.pass == false">{{
          flowCheckList.memo.msg
        }}</inputErrorMsg>
      </div>
    </div>
  </div>
  <h2
    class="w-fit p-2 rounded-t border-primaryDark/20 text-center font-bold box-border mr-1 border-t-2 border-l-2 border-r-2 bg-primaryDark text-white mt-6 text-2xl"
  >
    層級細節
  </h2>
  <div class="w-full flex flex-wrap border-2 border-primaryDark/20 py-3">
    <div class="w-15/16 mx-auto py-4 flex flex-wrap gap-3">
      <div
        v-if="flow.totalLevel < 1"
        class="w-full p-8 bg-secondaryLight rounded flex justify-center"
      >
        <p class="text-xl">
          請先選擇「<span
            class="font-bold hover:cursor-pointer hover:underline"
            @click="toSelectLevels"
            >流程層級總數</span
          >」
        </p>
      </div>

      <div
        class="w-full px-3 py-4 flex flex-wrap gap-3 md:grid md:grid-cols-2 lg:grid-cols-3"
        v-else
      >
        <div
          v-for="level in Number(flow.totalLevel)"
          :key="level"
          class="w-full p-3 bg-primaryLight/30 rounded border-2 border-primaryDark"
        >
          <div>
            <p class="mb-2 border-b-2 border-primary w-fit">
              層級{{ " " + level }}
            </p>
            <span class="flex flex-wrap justify-between">
              <label for="role" class="font-bold min-w-fit">審核代號：</label>
              <div class="ml-3">
                {{ flow.relSys + flow.type + flow.totalLevel + "_" + level }}
              </div>
            </span>
            <span class="flex flex-wrap justify-between">
              <label for="role" class="font-bold min-w-fit">審核角色：</label>
              <div class="ml-3">
                {{ flow.memo + "放行_第" + level + "層" }}
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button class="btn btnClick mt-8 block mx-auto" @click="submit">
    確認送出
  </button>
</template>
<script setup>
import { onBeforeMount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { CreateCaseFlowAndDetail, findSysList } from "../../../api/service";
import inputErrorMsg from "../../../components/inputErrorMsg.vue";
import { useCommonStore } from "../../../store/commonStore";
import { useStore } from "../../../store/store";
const Store = useStore();
const commonStore = useCommonStore();
const router = useRouter();

const flow = reactive({
  relSys: "",
  type: "",
  totalLevel: "",
  memo: "",
  detailList: [],
});
const flowCheckList = ref({
  relSys: { pass: null, msg: null },
  type: { pass: null, msg: null },
  totalLevel: { pass: null, msg: null },
  memo: { pass: null, msg: null },
});
const relSysValidArg = ["notNull"];
const typeValidArg = ["notNull"];
const totalLevelValidArg = ["notNull"];
const memoValidArg = ["notNull", "charMax(39)"];

// 自動填入審核角色名稱
const levelAutofill = () => {
  for (let i = 1; i <= flow.totalLevel; i++) {
    flow.detailList.push({
      role: flow.relSys + flow.type + flow.totalLevel + "_" + i,
      memo: flow.memo + "放行_第" + i + "層",
      level: i,
    });
  }
};

const selectLevels = ref(null);
const toSelectLevels = () => {
  selectLevels.value.focus();
};
const validCheck = () => {
  for (let item in flowCheckList.value) {
    if (flowCheckList.value[item].pass != true) {
      return false;
    }
  }
  return true;
};
const submit = () => {
  if (validCheck() != true) {
    Store.alertShow = true;
    Store.alertObj = {
      msg: "資料有誤,請重新確認",
      func: (e) => {},
    };
    return;
  }
  Store.alertShow = true;
  Store.alertObj = {
    msg: "確定送出審核流程？",
    func: async (e) => {
      if (e.target.value === "confirm") {
        levelAutofill();
        const res = await CreateCaseFlowAndDetail(flow);
        if (res.desc == "successful") {
          Store.routerPush = "caseflow";
          router.push({ name: "SvcSucess" });
        } else {
          commonStore.SvcFail.msg = res.desc;
          router.push({ name: "SvcFail" });
        }
      }
    },
  };
};

onBeforeMount(async () => {
  await findSysList();
});
</script>
