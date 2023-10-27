<template>
  <dialog
    class="rounded border bg-background shadow-lg w-6/16"
    ref="dialog"
    @close="closeModal"
  >
    <loadSpinner v-if="Store.loadingSpinner">
      <template #title>儲存中</template>
    </loadSpinner>
    <form v-else class="flex flex-col gap-2 items-center py-2">
      <div class="h-24">
        <p>舊密碼 :</p>
        <label class="inpLabel w-full">
          <input
            type="password"
            class="w-full inp"
            v-verify:[oldPwValidArg]="changePWList.oldPw"
            v-model="oldpw"
          />
        </label>
        <inputErrorMsg class="block" v-if="changePWList.oldPw.pass == false">{{
          changePWList.oldPw.msg
        }}</inputErrorMsg>
      </div>
      <div class="h-24">
        <p>新密碼 :</p>
        <label class="inpLabel">
          <input
            type="password"
            class="w-full inp block"
            v-verify:[newPwValidArg]="changePWList.newPw"
            v-model="newPw"
          />
        </label>
        <inputErrorMsg class="block" v-if="changePWList.newPw.pass == false">{{
          changePWList.newPw.msg
        }}</inputErrorMsg>
      </div>
      <div class="h-24">
        <p>確認密碼 :</p>
        <label class="inpLabel">
          <input
            type="password"
            class="w-full inp block"
            v-model="checkPw"
            @change="mimaDoubleCheck"
          />
        </label>
        <inputErrorMsg
          class="block"
          v-if="changePWList.checkPw.pass == false"
          >{{ changePWList.checkPw.msg }}</inputErrorMsg
        >
      </div>
      <span class="text-primaryDark font-bold">
        *需為6~12碼，至少包含1個英文大寫字母、1個英文小寫字母
        、以及1個數字</span
      >
      <p class="h-8 text-cancel font-bold text-center" v-if="alertMsg != null">
        <i class="fa-solid fa-circle-exclamation"></i>{{ alertMsg }}
      </p>
      <div class="flex gap-8 my-2">
        <button
          v-if="closeBtnShow"
          class="btn bg-cancel"
          value="cancel"
          formmethod="dialog"
        >
          取消變更
        </button>
        <button class="btn bg-submit" @click="changePw">儲存變更</button>
      </div>
    </form>
  </dialog>
  <button class="btn" @click="dialog.showModal()">更改密碼</button>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UpdateUserMiMa } from "../api/service";
import { useStore } from "../store/store";
import inputErrorMsg from "./inputErrorMsg.vue";
const Store = useStore();

const router = useRouter();
const route = useRoute();
const dialog = ref(null);
const alertMsg = ref(null);
const closeBtnShow = ref(true);
const oldPwValidArg = [
  "notNull",
  "charMax(12)",
  "charMin(6)",
  "numMixEn",
  "notCn",
];
const newPwValidArg = [
  "notNull",
  "charMax(12)",
  "charMin(6)",
  "numMixEn",
  "notCn",
];

const changePWList = ref({
  oldPw: { pass: null, msg: null },
  newPw: { pass: null, msg: null },
  checkPw: { pass: null, msg: null },
});

const oldpw = ref("");
const newPw = ref("");
const checkPw = ref("");

const closeModal = () => {
  oldpw.value = "";
  newPw.value = "";
  checkPw.value = "";
  alertMsg.value = null;
  changePWList.value.oldPw.pass = null;
  changePWList.value.oldPw.msg = null;
  changePWList.value.newPw.pass = null;
  changePWList.value.newPw.msg = null;
  changePWList.value.checkPw.pass = null;
  changePWList.value.checkPw.msg = null;
};

const mimaDoubleCheck = () => {
  if (checkPw.value == newPw.value) {
    changePWList.value.checkPw.pass = true;
  } else {
    changePWList.value.checkPw.pass = false;
    changePWList.value.checkPw.msg = "密碼不符合";
  }
};
const validCheck = () => {
  for (let item in changePWList.value) {
    if (changePWList.value[item].pass != true) {
      return false;
    }
  }
  return true;
};
const updateMima = async () => {
  Store.loadingSpinner = true;
  const res = await UpdateUserMiMa(oldpw.value, newPw.value);
  if (res.desc == "successful") {
    Store.loadingSpinner = false;
    sessionStorage.removeItem("token");
    router.push({
      name: "Login",
    });
    Store.alertShow = true;
    Store.alertObj = {
      msg: "變更成功，請重新登入",
      func: (e) => {},
    };
  } else if (res.code == "AMS009") {
    Store.loadingSpinner = false;
    alertMsg.value = "舊密碼錯誤，請重新確認";
  } else {
    Store.loadingSpinner = false;
    alertMsg.value = "更改失敗，請重新確認";
  }
};
//
const changePw = async () => {
  if (validCheck()) {
    updateMima();
  } else {
    alertMsg.value = "請重新檢查輸入資料";
  }
};
onMounted(() => {
  if (route.query.changeMima == "true") {
    dialog.value.showModal();
    closeBtnShow.value = false;
  }
});
</script>
