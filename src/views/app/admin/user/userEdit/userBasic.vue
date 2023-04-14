<template>
  <div class="mb-8">
    <span class="block py-2 opacity-50 font-bold"
      >使用者的個人資訊和相關管理選項，您可以在這裡查看與編輯該使用者的個人資料細項</span
    >
    <div class="flex overflow-x-hidden relative">
      <div
        class="w-full transition-transform duration-300"
        :class="[
          userStore().userUpdateToggle ? '-translate-x-[100%]' : '',
          Store().getSvcAuth('UpdateUser') ? '' : 'pointer-events-none',
        ]"
      >
        <editItem @click="UserUpdateToggle(updateText)">
          <template #title>使用者名稱</template>
          <template #content>{{ userStore().userEdit.name }}</template>
        </editItem>
        <editItem class="pointer-events-none">
          <template #title>員工編號</template>
          <template #content>{{ userStore().userEdit.empid }}</template>
        </editItem>
        <editItem @click="UserUpdateToggle(updateMima)">
          <template #title>密碼</template>
          <template #content>*****</template>
        </editItem>
        <editItem @click="UserUpdateToggle(updateDept)">
          <template #title> 部門</template>
          <template #content>
            {{ userStore().userEdit.deptname }}
            {{ userStore().userEdit.deptunit }}</template
          >
        </editItem>
        <editItem @click="UserUpdateToggle(updateEmail)">
          <template #title> e-mail</template>
          <template #content> {{ userStore().userEdit.email }}</template>
        </editItem>
        <editItem class="pointer-events-none">
          <template #title>帳號狀態</template>
          <template #content>
            <span
              class="w-full flex md:w-11/16 font-bold text-center md:text-start"
            >
              {{
                userStore().userEdit.status == "enable" ? "啟用中" : "已刪除"
              }}
            </span></template
          >
        </editItem>
        <editItem @click="UserUpdateToggle(updateFailCount)">
          <template #title>密碼輸入錯誤次數 </template>
          <template #content> {{ userStore().userEdit.failcnt }}</template>
        </editItem>
        <editItem @click="UserUpdateToggle(updateMemo)">
          <template #title> 備註</template>
          <template #content> {{ userStore().userEdit.memo }}</template>
        </editItem>
      </div>
      <userUpdatePanel></userUpdatePanel>
    </div>
  </div>
</template>
<script setup>
import { Store, userStore } from "../../../../../store/store";
import { markRaw } from "vue";

import userUpdatePanel from "../../../../../components/user/userUpdatePanel.vue";
import updateText from "../../../../../components/user/updatePanel/updateText.vue";
import updateMima from "../../../../../components/user/updatePanel/updateMima.vue";
import updateDept from "../../../../../components/user/updatePanel/updateDept.vue";
import updateEmail from "../../../../../components/user/updatePanel/updateEmail.vue";
import updateFailCount from "../../../../../components/user/updatePanel/updateFailCount.vue";
import updateMemo from "../../../../../components/user/updatePanel/updateMemo.vue";
import editItem from "../../../../../components/user/editItem.vue";
//放頁面user修改後資料
const UserUpdateToggle = (com) => {
  if (Store().getSvcAuth("UpdateUser")) {
    userStore().userUpdateToggle = !userStore().userUpdateToggle;
    userStore().userCurrentUpdate = markRaw(com);
  }
};
</script>
