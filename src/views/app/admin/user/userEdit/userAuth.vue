<template>
  <div class="w-full p-2">
    <span>目前人員權限設置 : </span>
    <span v-if="getSets.length == 0">無</span>
    <div class="flex gap-2">
      <span
        class="btn pointer-events-none w-2/16 flex items-center justify-center"
        v-for="item of getSets"
        >{{ item }}</span
      >
    </div>
  </div>

  <div class="flex gap-2">
    <div class="flex justify-between w-full">
      <button
        v-if="Store().getSvcAuth('UpdateUser')"
        class="btn"
        :class="svcMenuToggle ? '' : 'bg-secondaryDark'"
        @click="svcMenuToggle = !svcMenuToggle"
      >
        編輯權限{{ svcMenuToggle ? "關閉" : "開啟" }}
      </button>
      <div v-if="!svcMenuToggle" class="flex gap-2">
        <button class="btn btnClick" @click="svcSetToggle = !svcSetToggle">
          預設權限
        </button>
        <button class="btn btnClick bg-submit" @click="updateUserSvc">
          儲存
        </button>
        <button class="btn btnClick bg-cancel" @click="resetUserSvc">
          取消
        </button>
      </div>
    </div>
  </div>
  <authSet v-if="svcSetToggle" :currentStore="userStore().userEdit"></authSet>
  <authList :currentStore="userStore().userEdit" :change="svcMenuToggle">
  </authList>
  <loadSpinner>
    <template #title>儲存中</template>
  </loadSpinner>
</template>
<script setup>
import { Store, userStore } from "../../../../../store/store";
import { onBeforeMount, ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  SelectAboutUser,
  SelectSvcSchema,
  UpdateUser,
} from "../../../../../api/service";
import apiRequest from "../../../../../api/apiRequest";
import { commonStore } from "../../../../../store/commonStore";
import authList from "../../../../../components/user/authList.vue";
import authSet from "../../../../../components/user/authSet.vue";

const router = useRouter();
const route = useRoute();
const authArray = ref([]);
const svcMenuToggle = ref(true);
const svcSetToggle = ref(false);

const getSets = computed(() => {
  let array = [];
  for (let item in userStore().userEdit.sets) {
    if (userStore().userEdit.sets[item] != "default") {
      for (let name of userStore().svcRoleSet) {
        if (userStore().userEdit.sets[item] == name.userset) {
          array.push(name.name);
        }
      }
    }
  }
  return array;
});
watch(svcMenuToggle, () => {
  if (svcMenuToggle) {
    userStore().userEdit.authority = authArray.value.authority;
    svcSetToggle.value = false;
  } else {
  }
});
watch(svcSetToggle, () => {
  if (svcSetToggle) {
    userStore().userEdit.authority = authArray.value.authority;
  } else {
  }
});
const updateUserSvc = async () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: "確定變更使用者權限？",
    func: async (e) => {
      if (e.target.value === "confirm") {
        Store().loadingSpinner = true;
        let updateUserData = {
          empid: userStore().userEdit.empid,
          sets: userStore().userEdit.sets,
          authority: userStore().userEdit.authority,
        };
        let res = await UpdateUser(updateUserData);
        if (res.desc == "successful") {
          Store().loadingSpinner = false;
          router.push({
            name: "SvcSucess",
          });
        } else {
          Store().loadingSpinner = false;
          commonStore().SvcFail.msg = res.desc;
          router.push({
            name: "SvcFail",
          });
        }
      }
    },
  };
};

const resetUserSvc = async () => {
  userStore().userEdit.authority = authArray.value.authority;
  svcMenuToggle.value = true;
};

onBeforeMount(async () => {
  await SelectSvcSchema();
  let res = await SelectAboutUser(route.params.userId);
  if (res.desc == "successful") {
    let userEdit = res.resBody;
    let authorityNew = [];
    for (let svc of userEdit.authority) {
      authorityNew.push(svc.svcname);
    }
    userEdit.authority = authorityNew;
    authArray.value = userEdit;
  } else {
    Store().alertShow = true;
    Store().alertObj = {
      msg: res.desc,
      func: (e) => {
        router.push({ name: "Lobby" });
      },
    };
  }
  await apiRequest.post("FindUserDefaultSet", {}).then((res) => {
    userStore().svcRoleSet = res.resBody.defaultSetList;
  });
});
</script>
