<template>
  <div class="flex">
    <button
      class="min-w-fit border-t-2 border-l-2 border-primaryLight rounded-t p-2 font-bold last-of-type:border-r-2 bg-background"
      :class="currentTab == item ? 'bg-secondaryLight' : 'border-b-2'"
      v-for="item of userStore().svcRoleSet"
      @click="currentTab = item"
    >
      {{ item.name }}
    </button>
    <div class="border-b-2 p-1 border-primaryLight w-full text-end">
      <button
        class="btn mr-2"
        :class="newSetToggle ? 'bg-secondaryDark' : ''"
        @click="newSet"
        :disabled="settingToggle"
      >
        新增+
      </button>
      <button
        class="btn"
        :class="settingToggle ? 'bg-secondaryDark' : ''"
        @click="updateSetOpen"
        :disabled="newSetToggle"
      >
        編輯
      </button>
    </div>
  </div>
  <div class="w-full border-x-2 border-b-2 border-primaryLight bg-background">
    <div class="flex justify-between">
      <div class="flex gap-2 p-2 items-center">
        <span class="font-bold">代號:</span>
        <label v-if="newSetToggle" class="inpLabel">
          <input class="inp" v-model="setUpdate.userset" />
        </label>
        <label v-else class="inpLabel">
          <div class="inp">{{ currentTab?.userset }}</div>
        </label>
        <span class="font-bold">名稱:</span>
        <label class="inpLabel">
          <input
            class="inp"
            :disabled="!newSetToggle && !settingToggle"
            v-model="setUpdate.name"
          />
        </label>
      </div>
      <div v-if="newSetToggle" class="flex items-center p-1 gap-2">
        <button class="btn bg-submit" @click="createSet">儲存</button>
        <button class="btn bg-cancel" @click="newsetClose">取消</button>
      </div>
      <div v-if="settingToggle" class="flex items-center p-1 gap-2">
        <button
          class="rounded w-8 h-8 bg-cancel hover:scale-110 transition-all"
          @click.stop="deleteSet"
        >
          <i class="fa-solid fa-trash text-white"></i>
        </button>
        <button class="btn bg-submit" @click="updateSet">儲存</button>
        <button class="btn bg-cancel" @click="updateSetClose">取消</button>
      </div>
    </div>
    <button class="btn m-2" :class="authToggle" @click="authToggle = !authToggle">權限列表</button>
    <div class="overflow-hidden" :class="!authToggle ? 'h-0' : 'h-full'">
      <div v-for="item of userStore().UserSvcListTabs">
        <div
          class="w-full border-b-2 border-primaryDark"
          v-if="item.tag != 'all'"
        >
          <span class="font-bold text-lg">
            {{ item.name }}
          </span>
        </div>
        <div class="flex flex-wrap w-full py-2" v-if="item.tag != 'all'">
          <label
            v-for="svc in svcListRender(item.tag)"
            class="w-3/16 m-1 cursor-pointer border-2 rounded box-border hover:border-secondary flex"
            :class="
              setUpdate.authority.some((el) => el === svc.svcName)
                ? 'border-primaryDark bg-secondaryLight/50'
                : 'border-primaryLight '
            "
            :key="svc"
          >
            <div class="flex mr-2 items-center">
              <span class="text-primaryDark p-1">
                <i
                  class="fa-circle-check"
                  :class="
                    setUpdate.authority?.some((el) => el === svc.svcName)
                      ? 'fa-solid'
                      : 'fa-regular'
                  "
                ></i>
              </span>
              <input
                type="checkbox"
                :disabled="authSettingToggle"
                :value="svc.svcName"
                v-model="setUpdate.authority"
                hidden
              />
            </div>
            <div class="w-full">
              <span class="font-bold block">{{ svc.summary }}</span>
              <span class="opacity-80 text-sm">{{ svc.svcName }}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, ref, watch, nextTick } from "vue";
import { userStore, Store } from "../../store/store";
import apiRequest from "../../api/apiRequest";
import { SelectSvcSchema } from "../../api/service";

const currentTab = ref();
const setUpdate = ref({
  authority: [],
  name: "",
  userset: "",
});
const settingToggle = ref(false);
const authToggle = ref(false);
const newSetToggle = ref(false);
const authSettingToggle = ref(true);

watch(currentTab, () => {
  if (currentTab.value != "new") {
    settingToggle.value = false;
    newSetToggle.value = false;
    setUpdate.value.authority = currentTab.value.authority;
    setUpdate.value.userset = currentTab.value.userset;
    setUpdate.value.name = currentTab.value.name;
  } else {
    setUpdate.value = {
      authority: [],
      name: "",
      userset: "",
    };
  }
});

const svcListRender = (tab) => {
  let svcList = [];
  for (let item in userStore().svcListAll) {
    if (userStore().svcListAll[item].tag === tab) {
      svcList.push(userStore().svcListAll[item]);
    }
  }
  return svcList;
};

const newSet = () => {
  newSetToggle.value = true;
  authToggle.value = true;
  authSettingToggle.value = false;
  currentTab.value = "new";
};
const newsetClose = () => {
  newSetToggle.value = false;
  authToggle.value = false;
  authSettingToggle.value = true;
  currentTab.value = userStore().svcRoleSet[0];
};
const createSet = () => {
  newSetToggle.value = false;
  apiRequest
    .post("CreateDefaultSet", {
      userset: setUpdate.value.userset,
      name: setUpdate.value.name,
      authority: setUpdate.value.authority,
    })
    .then((res) => {
      if (res.desc == "successful") {
        Store().alertShow = true;
        Store().alertObj = {
          msg: "修改成功",
          func: async (e) => {
            await apiRequest.post("FindUserDefaultSet", {}).then((res) => {
              userStore().svcRoleSet = res.resBody.defaultSetList;
              currentTab.value = userStore().svcRoleSet[0];
              setUpdate.value.authority = currentTab.value.authority;
              nextTick();
            });
          },
        };
      } else {
        Store().alertShow = true;
        Store().alertObj = {
          msg: "修改失敗",
          func: (e) => {},
        };
      }
    });
};

const updateSetOpen = () => {
  settingToggle.value = true;
  authSettingToggle.value = false;
};
const updateSetClose = () => {
  settingToggle.value = !settingToggle.value;
  authSettingToggle.value = true;
  setUpdate.value.authority = currentTab.value.authority;
  setUpdate.value.userset = currentTab.value.userset;
  setUpdate.value.name = currentTab.value.name;
};
const updateSet = () => {
  apiRequest
    .post("UpdateDefaultSet", {
      userset: currentTab.value.userset,
      name: setUpdate.value.name,
      authority: setUpdate.value.authority,
    })
    .then((res) => {
      if (res.desc == "successful") {
        Store().alertShow = true;
        Store().alertObj = {
          msg: "修改成功",
          func: async (e) => {
            await apiRequest.post("FindUserDefaultSet", {}).then((res) => {
              userStore().svcRoleSet = res.resBody.defaultSetList;
              currentTab.value = userStore().svcRoleSet[0];
              setUpdate.value.authority = currentTab.value.authority;
              nextTick();
            });
          },
        };
      } else {
        Store().alertShow = true;
        Store().alertObj = {
          msg: "修改失敗",
          func: (e) => {},
        };
      }
    });
};

const deleteSet = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: "確定刪除?",
    func: async (e) => {
      await apiRequest
        .post("DeleteDefaultSet", { userset: currentTab.value.userset })
        .then(async (res) => {
          if (res.desc == "successful") {
            await apiRequest.post("FindUserDefaultSet", {}).then((res) => {
              userStore().svcRoleSet = res.resBody.defaultSetList;
              currentTab.value = userStore().svcRoleSet[0];
              setUpdate.value.authority = currentTab.value.authority;
              nextTick();
            });
          } else {
            Store().alertShow = true;
            Store().alertObj = {
              msg: "刪除失敗",
              func: (e) => {},
            };
          }
        });
    },
  };
};

onBeforeMount(async () => {
  await SelectSvcSchema();
  await apiRequest.post("FindUserDefaultSet", {}).then((res) => {
    userStore().svcRoleSet = res.resBody.defaultSetList;
    currentTab.value = userStore().svcRoleSet[0];
    setUpdate.value.authority = currentTab.value.authority;
    nextTick();
  });
});
</script>
