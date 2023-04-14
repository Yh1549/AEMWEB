<template>
  <div class="w-full">
    <table class="mx-auto w-full">
      <thead>
        <tr>
          <th>名稱</th>
          <th>代號</th>
          <th class="flex">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of getSets">
          <td>{{ item.name }}</td>
          <td>{{ item.userset }}</td>
          <td class="flex">
            <label class="cursor-pointer w-full">
              <input type="checkbox" v-model="setPick" :value="item.userset" />
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { userStore } from "../../store/store";
import { ref, onBeforeMount, watch, computed } from "vue";
import apiRequest from "../../api/apiRequest";

const prop = defineProps(["currentStore"]);
const setPick = ref([]);

const getSets = computed(() => {
  let array = [];

  for (let name of userStore().svcRoleSet) {
    if (name.userset != "default") {
      array.push(name);
    }
  }

  return array;
});
watch(setPick, () => {
  if (setPick.value) {
    if (setPick.value.length == 0) {
      prop.currentStore.authority = [];
    } else {
      let authArray = [];
      let authSet;
      for (let pick of setPick.value) {
        for (let item of userStore().svcRoleSet) {
          if (pick == item.userset || item.userset == "default") {
            authArray = authArray.concat(item.authority);
          }
        }
      }
      authSet = new Set(authArray);
      prop.currentStore.sets = setPick.value;
      prop.currentStore.authority = Array.from(authSet);
    }
  }
});

onBeforeMount(async () => {
  await apiRequest.post("FindUserDefaultSet", {}).then((res) => {
    userStore().svcRoleSet = res.resBody.defaultSetList;
  });
});
</script>
<style scoped>
th {
  text-align: start;
}
th,
td {
  padding: 0.5rem;
}

tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
