<template>
  <listTable>
    <template #th
      ><th>帳號員編</th>
      <th>姓名</th>
      <th>部門/科別</th>
      <th>密碼變更</th>
      <th>備註</th>
      <th>上次修改密碼時間</th>
      <th>註冊時間</th>
      <th>查看編輯</th>
    </template>
    <template #td
      ><tr v-for="user in Store.pageData.pager" :key="user.empid">
        <td class="flex items-center">
          <span
            class="text-2xl mr-1"
            :class="user.status == 'enable' ? ' text-submit' : ' text-cancel'"
          >
            <i class="fa-solid fa-circle-user"></i>
          </span>
          {{ user.empid }}
        </td>
        <td>{{ user.name }}</td>
        <td>
          {{ Store.getDeptName(user.deptcode)?.name }}/
          {{ Store.getDeptName(user.deptcode)?.unit }}
        </td>
        <td>{{ user.failcnt }}</td>
        <td>{{ user.memo }}</td>
        <td>{{ user.lastmodifypsdtime }}</td>
        <td>{{ user.registertime }}</td>
        <td>
          <button
            class="border-2 border-primaryDark rounded w-10 h-10 text-primaryDark text-2xl hover:bg-secondaryLight"
            @click="userDetailEnter(user)"
          >
            <i class="fa-solid fa-clipboard-list"></i>
          </button>
        </td></tr
    ></template>
  </listTable>
</template>
<script setup>
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../../store/store";
import listTable from "../listTable.vue";
const Store = useStore();

const router = useRouter();

const userDetailEnter = (user) => {
  router.push({ name: "userEdit", params: { userId: user.empid } });
};
onBeforeUnmount(() => {
  Store.pageData.pager = [];
  Store.pageData.pageCurrent = 1;
  Store.pageData.pageSize = 20;
});
</script>
