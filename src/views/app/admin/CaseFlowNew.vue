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
              name="relSys"
              data-valid-option="notNull"
              v-model.trim="flow.relSys"
              class="w-full inp"
              @change="InputValidation(Store().caseFlowCheck, $event)"
            >
              <option disabled value="">請選擇審核流程系統</option>
              <option
                v-for="item in Store().postOption.System"
                :key="item.memo"
                :value="item.name"
              >
                {{ item.memo }}
              </option>
            </select>
          </label>
        </div>
        <div class="mr-5">
          <span class="block">類型</span>
          <label class="inpLabel">
            <select
              name="type"
              data-valid-option="notNull"
              v-model.trim="flow.type"
              class="w-full inp"
              @change="InputValidation(Store().caseFlowCheck, $event)"
            >
              <option disabled value="">請選擇審核流程類型</option>
              <option value="POST">公告</option>
              <option value="AD">廣告</option>
            </select>
          </label>
        </div>
        <div>
          <span class="block">層級總數</span>
          <label class="inpLabel">
            <select
              name="totalLevel"
              data-valid-option="notNull"
              v-model.trim="flow.totalLevel"
              class="w-full inp"
              ref="selectLevels"
              @change="InputValidation(Store().caseFlowCheck, $event)"
            >
              <option disabled value="">請選擇流程層級總數</option>
              <option v-for="item in 3" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </label>
        </div>
      </div>
      <div>
        <span class="block">名稱</span>
        <label class="inpLabel w-full">
          <input
            type="text"
            id="memo"
            name="memo"
            data-valid-option="notNull,charMax(39)"
            v-model.trim="flow.memo"
            class="w-full inp"
            @keyup="InputValidation(Store().caseFlowCheck, $event)"
          />
        </label>
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
                {{ flow.memo + level }}
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
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { CreateCaseFlowAndDetail, findSysList } from "../../../api/service";
import { commonStore } from "../../../store/commonStore";
import { Store } from "../../../store/store";
import { InputValidation } from "../../../formValidation/inputCase";
const flow = reactive({
  relSys: "",
  type: "",
  totalLevel: "",
  memo: "",
  detailList: [],
});
const errorMsg = ref("");

// 自動填入審核角色名稱
const levelAutofill = () => {
  for (let i = 1; i <= flow.totalLevel; i++) {
    flow.detailList.push({
      role: flow.relSys + flow.type + flow.totalLevel + "_" + i,
      memo: flow.memo + i,
      level: i,
    });
  }
};

const selectLevels = ref(null);
const toSelectLevels = () => {
  selectLevels.value.focus();
};

const router = useRouter();
const submit = () => {
  let pass = false;
  for (let value in Store().caseFlowCheck) {
    if (Store().caseFlowCheck[value] != null) {
      for (let i of Store().caseFlowCheck[value]) {
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
      msg: "確定送出審核流程？",
      func: async (e) => {
        if (e.target.value === "confirm") {
          levelAutofill();
          const res = await CreateCaseFlowAndDetail(flow);
          if (res.desc == "successful") {
            Store().routerPush = "caseflow";
            router.push({ name: "SvcSucess" });
          } else {
            commonStore().SvcFail.msg = res.desc;
            router.push({ name: "SvcFail" });
          }
        }
      },
    };
  }
};
const wrongInfo = (name) => {
  let msgObj = {
    relSys: "流程系統",
    type: "流程類型",
    totalLevel: "層級總數",
    memo: "流程名稱",
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
onBeforeMount(async () => {
  await findSysList();
});
</script>
