<template>
  <div class="flex gap-6">
    <label class="inpLabel">
      <select
        class="inp w-full"
        @change="resetUpdate"
        v-model="set"
        :disabled="!authToggle"
      >
        <option v-for="item in svcRoleSet" :value="item">
          {{ item.name }}
        </option>
      </select>
    </label>
    <button
      class="btn"
      :class="newSetToggle ? 'bg-cancel' : ''"
      @click="newSet"
      :disabled="settingToggle"
    >
      {{ newSetToggle ? "取消新增" : "新增+" }}
    </button>
    <button
      class="btn"
      :class="settingToggle ? 'bg-cancel' : ''"
      @click="updateSetOpen"
      :disabled="newSetToggle"
    >
      {{ settingToggle ? "取消編輯" : "編輯" }}
    </button>
    <button
      v-if="!newSetToggle"
      class="btn bg-cancel"
      :class="settingToggle ? 'bg-cancel' : ''"
      @click="
        alertDelete.showModal();
        alertMsg = '確認刪除?';
      "
      :disabled="newSetToggle"
    >
      刪除{{ set.name }}
    </button>
  </div>
  <div class="flex gap-2 my-2">
    <div>
      <p>名稱 :</p>
      <label class="inpLabel">
        <input
          type="text"
          class="inp"
          :placeholder="set.name"
          v-model="setUpdate.name"
          :disabled="!saveBtnToggle"
        />
      </label>
    </div>
    <div>
      <p>代碼 :</p>
      <label class="inpLabel">
        <input
          type="text"
          class="inp"
          :placeholder="set.userset"
          v-model="setUpdate.userset"
          :disabled="!saveBtnToggle"
        />
      </label>
    </div>
    <button
      class="btn bg-submit self-center"
      :class="saveBtnToggle ? '' : 'hidden'"
      @click="save"
    >
      儲存
    </button>
  </div>
  <dialog ref="alert" class="rounded w-1/2 bg-background">
    <p class="test-2xl font-bold text-center my-10">{{ alertMsg }}</p>
    <div class="flex w-full justify-center my-2">
      <button class="btn bg-sumit" @click="alert.close()">確認</button>
    </div>
  </dialog>
  <dialog ref="alertDelete" class="rounded w-1/2 bg-background">
    <p class="test-2xl font-bold text-center my-10">{{ alertMsg }}</p>
    <div class="flex w-full justify-center my-2 gap-4">
      <button class="btn bg-cancel" value="cancel" @click="deleteSet($event)">
        取消
      </button>
      <button class="btn bg-sumit" value="confirm" @click="deleteSet($event)">
        確認
      </button>
    </div>
  </dialog>
  <authList @authoritySet="authoritySet" :change="authToggle" :set="setUpdate">
  </authList>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import apiRequest from "../../api/apiRequest";
import { SelectSvcSchema } from "../../api/service";
import authList from "./authList.vue";
const svcRoleSet = ref([]);
const alertMsg = ref("");
const alert = ref(null);
const alertDelete = ref(null);
const set = ref({
  authority: null,
  userset: null,
  name: null,
});
const setUpdate = ref({
  authority: [],
  name: "",
  userset: "",
});
const authToggle = ref(true);
const settingToggle = ref(false);
const newSetToggle = ref(false);
const saveBtnToggle = ref(false);

const authoritySet = (value) => {
  set.value = value;
};

const newSet = () => {
  saveBtnToggle.value = !saveBtnToggle.value;
  newSetToggle.value = !newSetToggle.value;
  authToggle.value = !authToggle.value;
  if (authToggle.value) {
    set.value = svcRoleSet.value[0];
    resetUpdate();
  } else {
    setUpdate.value.authority = [];
    setUpdate.value.name = "";
    setUpdate.value.userset = "";
  }
};

const createSet = async () => {
  saveBtnToggle.value = false;
  newSetToggle.value = false;
  authToggle.value = true;
  let res = await apiRequest.post("CreateDefaultSet", {
    userset: setUpdate.value.userset,
    name: setUpdate.value.name,
    authority: setUpdate.value.authority,
  });
  if (res.desc == "successful") {
    alert.value.showModal();
    alertMsg.value = "修改成功";
    findUserDefaultSet();
  } else {
    alert.value.showModal();
    alertMsg.value = "修改失敗";
  }
};
const save = async () => {
  if (!authToggle.value && settingToggle.value) {
    updateSet();
  } else {
    createSet();
  }
};
const resetUpdate = () => {
  setUpdate.value.authority = set.value.authority;
  setUpdate.value.name = set.value.name;
  setUpdate.value.userset = set.value.userset;
};

const updateSetOpen = () => {
  saveBtnToggle.value = !saveBtnToggle.value;
  settingToggle.value = !settingToggle.value;
  authToggle.value = !authToggle.value;
  resetUpdate();
};

const updateSet = async () => {
  saveBtnToggle.value = false;
  settingToggle.value = false;

  authToggle.value = true;
  let res = await apiRequest.post("UpdateDefaultSet", {
    userset: set.value.userset,
    name: setUpdate.value.name,
    authority: setUpdate.value.authority,
  });
  if (res.desc == "successful") {
    alert.value.showModal();
    alertMsg.value = "修改成功";
    findUserDefaultSet();
  } else {
    alert.value.showModal();
    alertMsg.value = "修改失敗";
  }
};

const findUserDefaultSet = async () => {
  let reloadRes = await apiRequest.post("FindUserDefaultSet", {});
  if (reloadRes.desc == "successful") {
    svcRoleSet.value = reloadRes.resBody.defaultSetList;
    set.value = svcRoleSet.value[0];
    resetUpdate();
  }
};

const deleteSet = async (e) => {
  if (e.target.value == "confirm") {
    let res = await apiRequest.post("DeleteDefaultSet", {
      userset: setUpdate.value.userset,
    });
    alert.value.showModal();
    if (res.desc == "successful") {
      findUserDefaultSet();
      alertMsg.value = "修改成功";
    } else {
      alertMsg.value = "刪除失敗";
    }
  }
  alertDelete.value.close();
};

onBeforeMount(async () => {
  await SelectSvcSchema();
  let res = await apiRequest.post("FindUserDefaultSet", {});
  if ((res.desc = "successful")) {
    svcRoleSet.value = res.resBody.defaultSetList;
    set.value = svcRoleSet.value[0];
    resetUpdate();
  }
});
</script>
