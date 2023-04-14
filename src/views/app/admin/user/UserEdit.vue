<template>
  <div class="w-full bg-primary rounded-t items-center p-4">
    <div class="flex justify-between">
      <p class="py-2 mr-2">
        使用者<span class="font-bold btn shadow-none mx-1 p-1"
          ><i class="fa-solid fa-user"></i>{{ userStore().userEdit.name }}</span
        >
      </p>
      <button
        v-if="Store().getSvcAuth('DeleteUser')"
        class="btn btnClick bg-cancel mx-auto md:mx-4"
        @click="deleteUser()"
      >
        刪除使用者
      </button>
    </div>
    <div class="my-2 flex flex-wrap gap-4">
      <div class="">
        <span>最後登入 :</span>
        <div class="inpLabel">
          <span class="mr-2">
            日期:
            <span class="p-1">{{
              userStore().userEdit.time == null
                ? "無登入紀錄"
                : Store().dateReform(
                    Store().timeReform(userStore().userEdit.time)[0],
                    ".",
                    "/"
                  )
            }}</span></span
          >
          <span class="py-2 mr-2"
            >時間:
            <span class="p-1">{{
              userStore().userEdit.time == null
                ? "無登入紀錄"
                : Store().timeReform(userStore().userEdit.time)[1]
            }}</span></span
          >
        </div>
      </div>
      <div>
        <span>帳號註冊時間:</span>
        <div class="inpLabel">
          <span class="py-2 mr-2">
            <span class="p-1">{{
              userStore().userEdit.registertime
            }}</span></span
          >
        </div>
      </div>
      <div>
        <span>上次修改時間:</span>
        <div class="inpLabel">
          <span class="py-2 mr-2">
            <span class="p-1">{{
              userStore().userEdit.lastmodifytime
            }}</span></span
          >
        </div>
      </div>
    </div>
  </div>
  <div class="w-full bg-primary flex">
    <router-link
      class="UserEditTab"
      active-class="border-b-4 text-white bg-gray-900/5 "
      :to="{ name: 'userBasic' }"
      >基本資料</router-link
    >
    <router-link
      class="UserEditTab"
      active-class="border-b-4 text-white bg-gray-900/5"
      :to="{ name: 'userAuth' }"
      >權限
    </router-link>
    <router-link
      class="UserEditTab"
      active-class="border-b-4 text-white bg-gray-900/5 text-white"
      :to="{ name: 'userPostFlow' }"
      >建檔流程</router-link
    >
    <router-link
      class="UserEditTab"
      active-class="border-b-4 text-white bg-gray-900/5"
      :to="{ name: 'userCaseRole' }"
      >審核角色</router-link
    >
  </div>
  <router-view></router-view>
</template>

<script setup>
import { useRoute } from "vue-router";
import { userStore, Store } from "../../../../store/store";
import { onBeforeMount, ref, nextTick } from "vue";
import apiRequest from "../../../../api/apiRequest";
import router from "../../../../router/router";
import { SelectAboutUser, SelectDept } from "../../../../api/service";
const route = useRoute();
const user = ref({});

const users = userStore().List;

const { id } = route.params;
const targetUser = users.filter((u) => u.userId === id);
user.value = targetUser.shift();

const deleteUser = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `注意！確定要刪除「${userStore().userEdit.name}」嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        await apiRequest
          .post("DeleteUser", { empid: userStore().userEdit.empid })
          .then((res) => {
            if (res.desc == "successful") {
              router.push({
                name: "SvcSucess",
              });
            } else {
              commonStore().SvcFail.msg = res.desc;
              router.push({
                name: "SvcFail",
              });
            }
          })
          .catch();
      }
    },
  };
};
onBeforeMount(async () => {
  userStore().$reset();

  await SelectDept();
  let res = await SelectAboutUser(route.params.userId);
  if (res.desc == "successful") {
    let userEdit = res.resBody;
    let authorityNew = [];
    for (let svc of userEdit.authority) {
      authorityNew.push(svc.svcname);
    }
    userEdit.authority = authorityNew;
    userStore().userEdit = userEdit;
  } else {
    Store().alertShow = true;
    Store().alertObj = {
      msg: res.desc,
      func: (e) => {
        router.push({ name: "Lobby" });
      },
    };
  }

  // await FindAllCaseFlowAndDetail();
  // if (
  //   userStore().userRoleList == null ||
  //   userStore().userRoleList.length == 0
  // ) {
  //   let userRoleListRes = await FindEmpCaseRole(route.params.userId);
  //   if (userRoleListRes.desc === "successful") {
  //     userStore().userRoleList = userRoleListRes.resBody.userRoleList;
  //   }
  // }
});
</script>
<style scoped>
.UserEditTab {
  @apply p-1 w-1/4 text-base  border-secondaryDark text-center font-bold hover:cursor-pointer hover:bg-gray-900/5 box-border bg-primary lg:w-2/16 md:text-lg md:p-3;
}
</style>
