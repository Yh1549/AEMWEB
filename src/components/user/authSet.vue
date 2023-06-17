<template>
  <div class="w-full">
    <table class="mx-auto w-full">
      <thead class="border-b-2">
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
import { computed, onBeforeMount, ref, watch } from "vue";
import apiRequest from "../../api/apiRequest";
const prop = defineProps(["set"]);
const emit = defineEmits(["authoritySet"]);
const svcRoleSet = ref([]);
const setPick = ref([]);

const getSets = computed(() => {
  let array = [];
  for (let name of svcRoleSet.value) {
    if (name.userset != "default") {
      array.push(name);
    }
  }
  return array;
});
watch(setPick, () => {
  if (setPick.value) {
    if (setPick.value.length == 0) {
      prop.set.authority = [];
      prop.set.sets = [];
    } else {
      let authArray = [];
      let authSet;
      for (let pick of setPick.value) {
        for (let item of svcRoleSet.value) {
          if (pick == item.userset || item.userset == "default") {
            authArray = authArray.concat(item.authority);
          }
        }
      }
      authSet = new Set(authArray);
      prop.set.sets = setPick.value;
      prop.set.authority = Array.from(authSet);
    }
    emit("authoritySet", prop.set);
  }
});
onBeforeMount(async () => {
  await apiRequest.post("FindUserDefaultSet", {}).then((res) => {
    svcRoleSet.value = res.resBody.defaultSetList;
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
