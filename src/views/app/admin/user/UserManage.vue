<template>
  <div class="bg-primary rounded-t">
    <div class="flex flex-wrap items-center justify-center md:justify-between">
      <quick-search></quick-search>
      <div class="flex gap-4 mx-2">
        <router-link
          v-if="Store().getSvcAuth('CreateUser')"
          :to="{ name: 'userNew' }"
          class="btn flex hover:bg-secondary hover:text-primaryDark"
        >
          <span class="font-bold self-center"
            >新增使用者 <i class="fa-solid fa-user-plus"></i
          ></span>
        </router-link>
        <button
          v-if="Store().getSvcAuth('UpdateDept')"
          @click="unitOptionToggle = !unitOptionToggle"
          class="btn flex hover:bg-secondary hover:text-primaryDark"
        >
          <span class="font-bold self-center"> 部門單位管理 </span>
        </button>
        <button
          v-if="Store().getSvcAuth('UpdateUser')"
          @click="setOptionToggle = !setOptionToggle"
          class="btn flex hover:bg-secondary hover:text-primaryDark"
        >
          <span class="font-bold self-center"> 各類人員權限 </span>
        </button>
      </div>
    </div>
    <button
      class="text-sm md:text-base p-2 border-b-4 hover:cursor-pointer hover:bg-gray-900/5 box-border"
      :class="{
        'border-secondaryDark text-white bg-gray-900/20':
          Store().tabCurrent === 'all',
      }"
      value="all"
      @click="Store().getDeptTabPage($event)"
    >
      <span class="text-center font-bold pointer-events-none">全部</span>
    </button>
    <button
      v-for="tab of Store().getDeptTabList()"
      :key="tab"
      class="text-sm md:text-base p-2 border-b-4 hover:cursor-pointer hover:bg-gray-900/5 box-border"
      :class="{
        'border-secondaryDark text-white bg-gray-900/20':
          Store().tabCurrent === tab,
      }"
      :value="tab"
      @click="Store().getDeptTabPage($event)"
    >
      <span class="text-center font-bold pointer-events-none">{{ tab }}</span>
    </button>
  </div>
  <div
    v-if="setOptionToggle"
    class="fixed bg-black/[.40] w-full h-full top-0 left-0 justify-center flex z-[10000]"
  >
    <div
      class="absolute p-2 bg-white rounded overflow-y-auto inset-5 scrollbar"
    >
      <button
        class="flex w-full justify-end"
        @click="setOptionToggle = !setOptionToggle"
      >
        <span class="text-cancel">
          <i class="fa-solid fa-x"></i>
        </span>
      </button>
      <userSetMange></userSetMange>
    </div>
  </div>
  <div
    v-if="unitOptionToggle"
    class="fixed bg-black/[.40] w-full h-full top-0 left-0 justify-center flex z-[10000]"
  >
    <div class="absolute w-1/2 p-4 bg-white rounded overflow-y-auto inset-y-5">
      <button
        class="flex w-full justify-end"
        @click="unitOptionToggle = !unitOptionToggle"
      >
        <span class="text-cancel">
          <i class="fa-solid fa-x"></i>
        </span>
      </button>
      <units-manage></units-manage>
    </div>
  </div>
  <loadSpinner>
    <template #title>載入中</template>
  </loadSpinner>
  <div v-if="!Store().loadingSpinner">
    <div v-if="userExist()">
      <UserList />
      <page-control :pageName="Store().pageRender" />
    </div>
    <div
      v-else
      class="flex justify-center items-center py-12 border-2 border-primary"
    >
      <span> 目前查無資料 </span>
    </div>
  </div>
</template>
<script setup>
import UserList from "../../../../components/list/UserList.vue";
import pageControl from "../../../../components/pageControl.vue";
import quickSearch from "../../../../components/quickSearch.vue";
import { useRouter } from "vue-router";
import { ref, onBeforeMount } from "vue";
import { Store, userStore } from "../../../../store/store";
import { SelectAllUser, SelectDept } from "../../../../api/service";
import unitsManage from "../../../../components/optionsManage/unitsManage.vue";
import userSetMange from "../../../../components/user/userSetMange.vue";

const router = useRouter();
const unitOptionToggle = ref(false);
const setOptionToggle = ref(false);

const createUser = () => {
  router.push("/createUser");
};
const userExist = () => {
  if (Store().pageRender.length != 0) {
    return true;
  } else {
    return false;
  }
};
onBeforeMount(async () => {
  Store().loadingSpinner = true;
  await SelectDept();
  const listRes = await SelectAllUser();
  if (listRes.desc == "successful") {
    Store().loadingSpinner = false;
    userStore().List = listRes.resBody.userList;
  } else {
    Store().loadingSpinner = false;
    Store().alertShow = true;
    Store().alertObj = {
      msg: "查無使用者",
      func: (e) => {},
    };
  }

  Store().getDeptTabPage(null);
});
</script>
