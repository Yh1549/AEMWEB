<template>
  <div class="w-full relative transition-all duration-300 px-2">
    <button class="top-0 right-0 m-2 absolute btnClick z-20" @click="reset">
      <span class="bg-primaryDark text-white font-bold rounded p-1">
        <i class="fa-solid fa-arrow-right"></i>
        返回
      </span>
    </button>
    <div
      class="top-0 w-full relative transition-all duration-300 p-4"
      :class="Store().firstOtpShow ? '-left-[110%]' : 'left-[0%]'"
    >
      <span class="block text-gray-600 my-2 font-bold"
        ><span class="font-bold text-lg">您好!</span><br />
        首次登入或重新設定需要輸入您的email</span
      >
      <span class="block text-sm text-gray-600">員工編號 : </span>
      <label
        ><input
          type="text"
          class="inp w-full border-2 border-primaryDark h-10"
          v-model="adNum"
          name="adNum"
          data-valid-option="notNull"
          @keyup="InputValidation(loginValidObj, $event)"
        />
      </label>
      <span class="block mt-2 text-sm text-gray-600">密碼 : </span>
      <label
        ><input
          type="password"
          class="inp w-full border-2 border-primaryDark h-10"
          v-model="mima"
          name="mima"
          data-valid-option="notNull,charMin(6),charMax(12),numMixEn"
          @keyup="InputValidation(loginValidObj, $event)"
      /></label>
      <span class="block mt-2 text-sm text-gray-600">電子信箱 : </span>
      <label
        ><input
          type="email"
          class="inp w-full border-2 border-primaryDark h-10"
          v-model="firstEmail"
          name="firstEmail"
          data-valid-option="notNull"
          @keyup="InputValidation(loginValidObj, $event)"
      /></label>
      <span class="text-cancel font-bold">{{ errorText }}</span>
    </div>
    <div
      v-if="Store().firstOtpShow"
      class="w-full absolute top-[30%] transition-all duration-300 px-2"
      :class="Store().firstOtpShow ? '-left-[0%]' : 'left-[110%]'"
    >
      <otp :otpObject="otpObject">
        <template #resend>
          <button
            v-if="Store().firstOtpShow"
            :disabled="!Store().reSendButton"
            class="btnClick rounded p-1 text-sm"
            :class="Store().reSendButton ? 'bg-primaryDark' : 'bg-gray-600'"
            @click="reSendLogin"
          >
            <span
              class="text-white font-bold"
              :class="otpObject.validtime - 120 < 1 ? 'hidden' : ''"
              >{{ otpObject.validtime - 120 }}秒後</span
            >
            <span class="text-white font-bold rounded">重新登入 </span>
          </button>
        </template>
        <template #optInp
          ><input type="text" class="inp" v-model="otpInput" /></template
      ></otp>
    </div>
    <div class="w-full flex justify-end my-2">
      <button
        class="btn btnClick"
        @click="
          if (Store().firstOtpShow) {
            normalLogin();
          } else {
            firstLoginOtp();
          }
        "
        :disabled="Store().loadingSpinner"
      >
        {{ firstLoginBtnText
        }}<i
          v-if="!Store().loadingSpinner"
          class="pl-2 fa-solid fa-right-to-bracket"
        ></i>
        <i v-else class="pl-2 fa-solid fa-spinner fa-spin"></i>
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { Store } from "../../store/store";
import { InputValidation } from "../../formValidation/inputCase";
import { useRouter } from "vue-router";
import apiRequest from "../../api/apiRequest";
import otp from "../../components/login/otp.vue";
const router = useRouter();
const adNum = ref("");
const mima = ref("");
const firstEmail = ref("");
const loginValidObj = ref({
  adNum: null,
  mima: null,
  firstEmail: null,
});
const firstLoginBtnText = ref("驗證信箱");
const otpObject = ref({});
const errorText = ref("");
const otpInput = ref("");
let otpTimeInterval;

const OtpCountDown = () => {
  otpObject.value.validtime--;
  if (otpObject.value.validtime == 120) {
    Store().reSendButton = true;
  }
  if (otpObject.value.validtime == 0) {
    Store().firstOtpShow = false;
    clearInterval(otpTimeInterval);
  }
};

const firstLoginOtp = async () => {
  for (let item in loginValidObj.value) {
    if (loginValidObj.value[item] == null) {
      errorText.value = "帳號密碼填寫錯誤";
      return;
    } else {
      for (let i of loginValidObj.value[item]) {
        if (i.result == false) {
          errorText.value = "帳號密碼填寫錯誤";
          return;
        }
      }
    }
  }
  Store().firstOtpShow = true;
  Store().loadingSpinner = true;
  firstLoginBtnText.value = "驗證碼發送中...";
  await apiRequest
    .post("CheckEmailValid", {
      empid: adNum.value,
      mima: mima.value,
      email: firstEmail.value,
    })
    .then((res) => {
      Store().loadingSpinner = false;
      if (res.desc == "successful") {
        otpObject.value = res.resBody;
        otpObject.value.validtime = parseInt(otpObject.value.validtime);
        Store().firstOtpShow = true;
        firstLoginBtnText.value = "登入";
        otpTimeInterval = setInterval(OtpCountDown, 1000);
      } else {
        Store().loadingSpinner = false;
        Store().firstOtpShow = false;
        firstLoginBtnText.value = "驗證信箱";
        errorText.value = res.desc;
      }
    });
};

const normalLogin = async () => {
  clearInterval(otpTimeInterval);
  Store().loadingSpinner = true;
  firstLoginBtnText.value = "登入中...";
  await apiRequest
    .post("/UserLogin", {
      empid: adNum.value,
      mima: mima.value,
      email: firstEmail.value,
      otp: otpObject.value.prefix + "-" + otpInput.value,
    })
    .then(async (res) => {
      // 登入成功
      if (res.desc == "successful") {
        Store().$reset();
        sessionStorage.setItem("userInfo", JSON.stringify(res.resBody));
        router.push({
          name: "Lobby",
        });
      } else {
        Store().loadingSpinner = false;
        Store().firstOtpShow = false;
        firstLoginBtnText.value = "登入";
        errorText.value = "驗證失敗";
      }
    })
    .catch((e) => {});
};
const reSendLogin = () => {
  adNum.value = "";
  mima.value = "";
  Store().firstOtpShow = false;
  firstLoginBtnText.value = "登入";
  clearInterval(otpTimeInterval);
};

const getResetLogin = computed(() => {
  return Store().resetLogin;
});
const reset = () => {
  Store().resetLogin = true;
  Store().firstOtpShow = false;
  router.push({ name: "Login" });
};

watch(getResetLogin, () => {
  adNum.value = "";
  mima.value = "";
  firstEmail.value = "";
  errorText.value = "";
  clearInterval(otpTimeInterval);
});
</script>
