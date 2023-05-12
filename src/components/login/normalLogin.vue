<template>
  <div class="w-full relative transition-all duration-300 px-2">
    <div
      class="top-0 w-full relative transition-all duration-300 px-2"
      :class="Store().otpShow ? '-left-[110%]' : 'left-[0%]'"
    >
      <span class="block text-sm md:text-base text-gray-600">員工編號 : </span>
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
      <span class="block mt-2 text-sm md:text-base text-gray-600">密碼 : </span>
      <label
        ><input
          type="password"
          class="inp w-full border-2 border-primaryDark h-10"
          v-model="mima"
          name="mima"
          data-valid-option="notNull,charMin(6),charMax(12),numMixEn"
          @keyup="InputValidation(loginValidObj, $event)"
      /></label>
    </div>
    <div
      class="top-0 w-full absolute transition-all duration-300 px-2"
      :class="Store().otpShow ? '-left-[0%]' : 'left-[110%]'"
    ></div>
    <div class="w-full flex justify-between gap-4 px-2 my-2">
      <span class="text-cancel font-bold">{{ errorText }}</span>
      <button
        class="btnClick font-bold border-2 p-1 border-primaryDark rounded hover:bg-secondaryLight"
        @click="normalLogin()"
        :disabled="Store().loadingSpinner"
      >
        {{ normalLoginBtnText
        }}<i
          v-if="!Store().loadingSpinner"
          class="pl-2 fa-solid fa-right-to-bracket"
        ></i>
        <i v-else class="fa-solid fa-spinner fa-spin"></i>
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

const router = useRouter();
const adNum = ref("");
const mima = ref("");
const loginValidObj = ref({
  adNum: null,
  mima: null,
});
const normalLoginBtnText = ref("登入");
const errorText = ref("");

const normalLogin = async () => {
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
  Store().loadingSpinner = true;
  normalLoginBtnText.value = "登入中...";
  await apiRequest
    .post("/UserLogin", {
      empid: adNum.value,
      mima: mima.value,
    })
    .then(async (res) => {
      // 登入成功
      if (res.desc == "successful") {
        Store().$reset();
        sessionStorage.setItem("userInfo", JSON.stringify(res.resBody));
        await apiRequest
          .post("CheckMimaValid", {})
          .then((res) => {
            Store().loadingSpinner = false;
            if (res.desc !== "successful") {
              Store().alertShow = true;
              Store().alertObj = {
                msg: `${res.desc}，請更換密碼`,
                func: (e) => {
                  Store().changePWShow = true;
                  router.push({
                    name: "userInfo",
                    query: { closeIcon: true },
                  });
                },
              };
            } else {
              router
                .push({
                  name: "Lobby",
                })
                .then(() => {
                  if (router.currentRoute.value.name !== "Lobby") {
                    router.go(0);
                  }
                });
            }
          })
          .catch((e) => {});
      } else {
        Store().loadingSpinner = false;
        normalLoginBtnText.value = "登入";
        errorText.value = res.desc;
      }
    })
    .catch((e) => {
      loginButtonDisabled.value = false;
    });
};

const getResetLogin = computed(() => {
  return Store().resetLogin;
});
watch(getResetLogin, () => {
  adNum.value = "";
  mima.value = "";
});
</script>
