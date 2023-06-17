<template>
  <span class="block py-4 opacity-50 font-bold">填寫使用者基本資料</span>
  <div class="w-1/2 mx-auto">
    <formRow>
      <formRowItem :width="'w-1/2'">
        <span class="ml-2">使用者姓名 : </span>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            type="text"
            placeholder="請輸入姓名"
            v-verify:[nameValidArg]="newUserChecking.name"
            v-model.trim="props.newUser.name"
          />
        </label>
        <inputErrorMsg v-if="newUserChecking.name.pass == false">{{
          newUserChecking.name.msg
        }}</inputErrorMsg>
      </formRowItem>
      <formRowItem :width="'w-1/2'"
        ><span class="ml-2">員工編號 :</span>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            type="tel"
            maxlength="8"
            placeholder="請輸入員工編號"
            data-valid-option="notNull"
            v-verify:[empidValidArg]="newUserChecking.empid"
            v-model="props.newUser.empid"
          />
        </label>
        <inputErrorMsg v-if="newUserChecking.empid.pass == false">{{
          newUserChecking.empid.msg
        }}</inputErrorMsg>
      </formRowItem>
    </formRow>
    <formRow>
      <formRowItem :width="'w-1/2'">
        <span class="ml-2">密碼 :</span>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            type="password"
            placeholder="請輸入密碼"
            v-verify:[mimaValidArg]="newUserChecking.mima"
            v-model="props.newUser.mima"
        /></label>
        <span class="text-cancel font-bold">*請輸入6~12碼，英文數字混和</span>
        <inputErrorMsg v-if="newUserChecking.mima.pass == false">{{
          newUserChecking.mima.msg
        }}</inputErrorMsg>
      </formRowItem>
      <formRowItem :width="'w-1/2'">
        <span class="ml-2">確認密碼 :</span>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            type="password"
            placeholder="請再次輸入密碼"
            v-model="mimaDoubleCheck"
            @keyup="doubleCheck"
          />
        </label>
        <inputErrorMsg v-if="newUserChecking.mimaDouble.pass == false">{{
          newUserChecking.mimaDouble.msg
        }}</inputErrorMsg>
      </formRowItem>
    </formRow>
    <formRow>
      <formRowItem :width="'w-full'">
        <span>部門</span>
        <label class="inpLabel w-full">
          <select
            class="inp w-full"
            name="deptcode"
            v-verify:[deptcodeValidArg]="newUserChecking.deptcode"
            v-model="props.newUser.deptcode"
          >
            <option
              v-for="item in Store.postOption.Unit"
              :key="item.code"
              :value="item.code"
            >
              {{ item.name }}
              {{ item.unit }}
            </option>
          </select>
        </label>
      </formRowItem>
    </formRow>
    <formRow>
      <formRowItem :width="'w-full'">
        <span>備註 </span>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            type="text"
            name="memo"
            placeholder="備註說明"
            v-verify:[memoValidArg]="newUserChecking.memo"
            v-model="props.newUser.memo"
          />
        </label>
      </formRowItem>
    </formRow>
    <div class="flex">
      <button class="btn btnClick my-8 mx-auto" @click="nextStep">
        下一步
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useStore } from "../../store/store";
import formRow from "../formRow.vue";
import formRowItem from "../formRowItem.vue";
import inputErrorMsg from "../inputErrorMsg.vue";
const Store = useStore();
const props = defineProps(["newUser"]);
const emit = defineEmits(["newUserConfirm"]);
const mimaDoubleCheck = ref(null);
//
const newUserChecking = ref({
  name: { pass: null, msg: null },
  empid: { pass: null, msg: null },
  mima: { pass: null, msg: null },
  mimaDouble: { pass: null, msg: null },
  deptcode: { pass: null, msg: null },
  memo: { pass: true, msg: null },
});
const nameValidArg = ["notNull", "charMax(64)"];
const empidValidArg = ["notNull", "charMax(64)"];
const mimaValidArg = ["notNull", "charMax(12)", "charMin(6)", "numMixEn"];
const deptcodeValidArg = ["notNull"];
const memoValidArg = ["charMax(64)"];
//
const doubleCheck = () => {
  if (mimaDoubleCheck.value != props.newUser.mima) {
    newUserChecking.value.mimaDouble.pass = false;
    newUserChecking.value.mimaDouble.msg = "與密碼不符";
  } else {
    newUserChecking.value.mimaDouble.pass = true;
    newUserChecking.value.mimaDouble.msg = "驗證相符";
  }
};

const nextStep = () => {
  for (let item in newUserChecking.value) {
    if (newUserChecking.value[item].pass != true) {
      Store.alertShow = true;
      Store.alertObj = {
        msg: `輸入有誤，請重新檢查`,
        func: (e) => {},
      };
      return;
    }
  }
  emit("newUserConfirm", props.newUser);
  Store.currentNewStep = "usernewAuth";
};
</script>
