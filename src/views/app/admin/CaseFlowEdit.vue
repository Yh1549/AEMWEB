<template>

    <div>
      <h2 class="border-b-2 border-primary text-2xl pb-1">審核流程</h2>
      <div class="w-15/16 mx-auto pl-10">
        <label for="flowCode" class="inpLabel"
          ><span class="w-2/16 inpSpan">審核流程代號</span>
          <input
            type="text"
            id="flowCode"
            name="flowCode"
            v-model="flow.flowCode"
            class="w-6/16 inp"
          />
        </label>
        <label for="flowName" class="inpLabel"
          ><span class="w-2/16 inpSpan">審核流程名稱</span>
          <input
            type="text"
            id="flowName"
            name="flowName"
            v-model="flow.flowName"
            class="w-6/16 inp"
          />
        </label>
        <label for="totalLevels" class="inpLabel"
          ><span class="w-2/16 inpSpan">流程層級總數</span>
          <select
            name="totalLevels"
            v-model="flow.totalLevels"
            class="w-6/16 inp"
          >
            <option disabled selected>請選擇流程層級總數</option>
            <option v-for="item in 10" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </label>
      </div>
      <h2 class="border-b-2 border-primary text-2xl pb-1">層級細節</h2>
      <div class="w-15/16 mx-auto pl-10 py-4 flex flex-wrap gap-3">
        <div
          v-for="level in Number(flow.totalLevels)"
          :key="level"
          class="w-5/16 p-2 bg-primaryLight rounded"
        >
          <div>
            <p class="mb-2 font-bold">層級 {{ level }}</p>
            <p class="flex">
              <label for="role" class="w-4/12 font-bold">審核角色：</label>
              <select
                name="role"
                id="role"
                v-model="flow.levelRoles[level - 1].role"
                class="w-8/12 inp"
              >
                <option disabled selected>請選擇審核角色</option>
                <option
                  v-for="role in roleData"
                  :key="role.roleId"
                  :value="role.roleName"
                >
                  {{ role.roleName }}
                </option>
              </select>
            </p>
          </div>
        </div>
      </div>
      <div class="absolute bottom-4 w-15/16 flex justify-center">
        <button class="btn btnClick w-2/12" @click="submit">確認送出</button>
      </div>
    </div>
    <Alert v-if="alertObj.open" :alertProp="alertObj.prop" />

</template>
<script setup>
import { ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { flowStore } from "../../../store/store";
import apiRequest from "../../../api/apiRequest";

const flow = ref({
  flowCode: "",
  flowName: "",
  totalLevels: "",
  levelRoles: [],
});

const route = useRoute();
const flows = flowStore().caseflow;
const targetFlow = flows.filter((flow) => flow.flowCode === route.params.id);
flow.value = targetFlow.shift();

const roles = ref([]);
// todo: api get 取得 roleData
const roleData = computed(() => {
  let array = [];
  apiRequest
    .get("roles.json")
    .then((res) => {
      roles.value = res;
    })
    .catch((e) => {});
  for (let i = 0; i < roles.value.length; i++) {
    if (roles.value[i].disabled === false) {
      array.push(roles.value[i]);
    }
  }
  return array;
});

// 自動補足10層避免v-for層級讀不到資料出錯
const levelAutofill = () => {
  const autofill = 11 - flow.value.levelRoles.length;
  if (flow.value.levelRoles.length < 10) {
    for (let i = 1; i < autofill; i++) {
      flow.value.levelRoles.push({
        level: flow.value.levelRoles.length + 1,
        role: "",
      });
    }
  }
};
levelAutofill();

const alertObj = reactive({ open: false, prop: "" });
const router = useRouter();
const submit = () => {
  if (
    flow.value.flowCode.trim() == "" ||
    flow.value.flowName.trim() == "" ||
    flow.value.totalLevels < 1
  ) {
    alertObj.open = true;
    alertObj.prop = {
      msg: "請確認所有審核流程欄位都填寫完成！",
      func: (e) => {
        if (e.target.value === "confirm" || "cancel") {
          alertObj.open = false;
        }
      },
    };
    return;
  } else if (
    flow.value.levelRoles
      .slice(0, flow.value.totalLevels)
      .some((l) => l.role == "")
  ) {
    alertObj.open = true;
    alertObj.prop = {
      msg: "請確認所有層級都有指定審核角色！",
      func: (e) => {
        if (e.target.value === "confirm" || "cancel") {
          alertObj.open = false;
        }
      },
    };
    return;
  } else {
    alertObj.open = true;
    alertObj.prop = {
      msg: "確定送出審核流程？",
      func: (e) => {
        if (e.target.value === "confirm") {
          alertObj.open = false;
          flow.value.levelRoles = flow.value.levelRoles.filter(
            (l) => l.role !== ""
          );
          // todo: api post 審核流程資料 to 後端
          console.log("送出成功！");
          router.back();
        } else if (e.target.value === "cancel") {
          alertObj.open = false;
        }
      },
    };
  }
};
</script>
