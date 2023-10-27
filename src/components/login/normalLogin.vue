<template>
  <div class="w-full relative transition-all duration-300 px-2">
    <div
      class="top-0 w-full relative transition-all duration-300 px-2"
      :class="Store.otpShow ? '-left-[110%]' : 'left-[0%]'"
    >
      <span class="block text-sm md:text-base text-gray-600">員工編號 : </span>
      <label
        ><input
          type="text"
          class="inp w-full border-2 border-primaryDark h-10"
          v-verify:[adNumValidArg].noMsg="loginChecking.adNum"
          v-model="adNum"
        />
      </label>
      <span class="block mt-2 text-sm md:text-base text-gray-600">密碼 : </span>
      <label
        ><input
          type="password"
          class="inp w-full border-2 border-primaryDark h-10"
          v-verify:[mimaValidArg].noMsg="loginChecking.mima"
          v-model="mima"
      /></label>
    </div>
    <div
      class="top-0 w-full absolute transition-all duration-300 px-2"
      :class="Store.otpShow ? '-left-[0%]' : 'left-[110%]'"
    ></div>
    <div class="w-full flex justify-between gap-4 px-2 my-2">
      <span class="text-cancel font-bold">{{ errorText }}</span>
      <button
        class="btn btnClick bg-primaryDark hover:bg-primary"
        @click="normalLogin()"
        :disabled="Store.loadingSpinner"
      >
        {{ normalLoginBtnText
        }}<i
          v-if="!Store.loadingSpinner"
          class="pl-2 fa-solid fa-right-to-bracket"
        ></i>
        <i v-else class="fa-solid fa-spinner fa-spin"></i>
      </button>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { checkValidList } from "../../formValidation/validTunnel";
import { useStore } from "../../store/store";
const Store = useStore();

const router = useRouter();
//
const adNum = ref("");
const mima = ref("");
const adNumValidArg = ["notNull", "charMin(6)"];
const mimaValidArg = ["notNull", "charMin(6)", "charMax(12)", "numMixEn"];
const loginChecking = ref({
  adNum: { pass: null, msg: null },
  mima: { pass: null, msg: null },
});
//
const normalLoginBtnText = ref("登入");
const errorText = ref("");

const normalLogin = async () => {
  if (!checkValidList(loginChecking.value)) {
    errorText.value = "請重新檢查輸入資料";
    return;
  }
  normalLoginBtnText.value = "登入中...";
  // try {
  const res = await apiRequest.post("/UserLogin", {
    empid: adNum.value,
    mima: mima.value,
  });

  if (res.desc == "successful") {
    Store.$reset();
    Store.loadingSpinner = false;
    sessionStorage.setItem("userInfo", JSON.stringify(res.resBody));

    const resMima = await apiRequest.post("CheckMimaValid", {});
    if (resMima.desc !== "successful") {
      Store.alertShow = true;
      Store.alertObj = {
        msg: `${res.desc}，請更換密碼`,
        func: (e) => {
          Store.changePWShow = true;
          router.push({
            name: "userInfo",
            query: { closeIcon: true },
          });
        },
      };
    } else {
      router.push({
        name: "Lobby",
      });
      // .then(() => {
      //   if (router.currentRoute.value.name !== "Lobby") {
      //     router.go(0);
      //   }
      // });
    }
  } else {
    Store.loadingSpinner = false;
    normalLoginBtnText.value = "登入";
    errorText.value = res.desc;
  }
  // } catch {
  //   (e) => {
  //     Store.loadingSpinner = false;
  //     normalLoginBtnText.value = "登入";
  //     errorText.value = "登入失敗";
  //   };
  // }
};

const getResetLogin = computed(() => {
  return Store.resetLogin;
});

watch(getResetLogin, () => {
  adNum.value = "";
  mima.value = "";
});
</script>
