<template>
  <div>
    <div class="flex flex-wrap w-full">
      <button
        v-for="tab of tabs"
        class="md:px-3 p-2 mt-1 rounded-t rounded-b md:rounded-b-none border-primaryLight text-center font-bold hover:cursor-pointer hover:bg-secondaryLight mr-1 border-t-2 border-l-2 border-r-2 border-b-2 md:border-b-0"
        :class="{
          ' bg-secondaryDark': tabCurrent == tab.tag,
        }"
        :value="tab.tag"
        :key="tab.tag"
        @click="tabChange"
      >
        {{ tab.name }}
      </button>
    </div>
    <div class="border-2 border-primaryLight">
      <div
        v-for="tab of tabRender"
        class="flex flex-wrap rounded p-2"
        :key="tab"
      >
        <span class="w-full mb-2 border-b-2 border-primaryLight">
          <span class="font-bold text-lg">
            {{ tab.name }}
          </span>
        </span>
        <label
          v-for="svc in svcListRender(tab.tag)"
          class="w-full md:w-3/16 m-1 cursor-pointer border-2 rounded box-border hover:border-secondary flex"
          :class="
            prop.currentStore.authority?.some((el) => el === svc.svcName)
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
                  prop.currentStore.authority?.some((el) => el === svc.svcName)
                    ? 'fa-solid'
                    : 'fa-regular'
                "
              ></i>
            </span>
            <input
              type="checkbox"
              :disabled="prop.change"
              :value="svc.svcName"
              v-model="prop.currentStore.authority"
              hidden
            />
          </div>
          <div class="w-full my-2">
            <span class="font-bold block">{{ svc.summary }}</span>
            <!-- <span class="font-bold hidden md:block text-sm">{{ svc.desc }}</span> -->
            <span class="opacity-80 text-sm">{{ svc.svcName }}</span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { userStore, Store } from "../../store/store";
const prop = defineProps(["currentStore", "change"]);
watch(
  () => prop.currentStore.authority,
  () => {
    if (prop.currentStore.authority.length == 0) {
      prop.currentStore.sets = [];
    }
  }
);
const tabs = ref(userStore().UserSvcListTabs);
const tabCurrent = ref("all");

const svcListRender = (tab) => {
  let svcList = [];
  for (let item in userStore().svcListAll) {
    if (userStore().svcListAll[item].tag === tab) {
      svcList.push(userStore().svcListAll[item]);
    }
  }
  return svcList;
};
const tabRender = computed(() => {
  let list = [];
  if (tabCurrent.value == "all") {
    for (let item in userStore().UserSvcListTabs) {
      if (userStore().UserSvcListTabs[item].tag != "all") {
        list.push(userStore().UserSvcListTabs[item]);
      }
    }
    return list;
  } else {
    for (let item in userStore().UserSvcListTabs) {
      if (userStore().UserSvcListTabs[item].tag == tabCurrent.value) {
        list = [userStore().UserSvcListTabs[item]];
      }
    }
    return list;
  }
});
const tabChange = (e) => {
  tabCurrent.value = e.target.value;
};
</script>
