<template>
  <div>
    <div class="flex flex-wrap w-full gap-2">
      <button
        v-for="tab of UserSvcListTabs"
        class="btn p-2 my-2 bg-primaryLight text-center text-black font-bold cursor-pointer hover:bg-secondaryLight"
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
    <div class="border-2 border-primaryDark rounded p-2">
      <div
        v-for="tab of tabRender"
        class="flex flex-wrap gap-4 rounded p-2"
        :key="tab"
      >
        <p class="w-full font-bold text-lg">
          {{ tab.name }}
        </p>
        <label
          v-for="svc in svcListRender(tab.tag)"
          class="w-1/4 cursor-pointer border-2 rounded box-border hover:border-secondary flex"
          :class="
            props.set.authority?.some((el) => el === svc.svcName)
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
                  props.set.authority?.some((el) => el === svc.svcName)
                    ? 'fa-solid'
                    : 'fa-regular'
                "
              ></i>
            </span>
            <input
              type="checkbox"
              :disabled="props.change"
              :value="svc.svcName"
              v-model="props.set.authority"
              hidden
            />
          </div>
          <div class="w-full my-2">
            <span class="font-bold block">{{ svc.summary }}</span>
            <span class="opacity-80 text-sm block">{{ svc.svcName }}</span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { useUserStore } from "../../store/store";

const userStore = useUserStore();

const props = defineProps(["set", "change"]);
const emit = defineEmits(["authoritySet"]);
const UserSvcListTabs = ref([
  {
    name: "全部",
    tag: "all",
  },
  {
    name: "公告",
    tag: "post",
  },
  {
    name: "審核",
    tag: "Case",
  },
  {
    name: "使用者",
    tag: "User",
  },
  {
    name: "部門",
    tag: "Dept",
  },
  {
    name: "廣告",
    tag: "advertise",
  },
  {
    name: "排程",
    tag: "schedule",
  },
  {
    name: "錯誤代碼",
    tag: "SysMsg",
  },
  {
    name: "文本",
    tag: "MsgInfo",
  },
]);
watch(
  () => props.set.authority,
  () => {
    if (props.set.authority.length == 0) {
      props.set.sets = [];
      emit("authoritySet", props.set);
    }
  }
);
const tabCurrent = ref("all");

const svcListRender = (tab) => {
  let svcList = [];
  for (let item in userStore.svcListAll) {
    if (userStore.svcListAll[item].tag === tab) {
      svcList.push(userStore.svcListAll[item]);
    }
  }
  return svcList;
};
const tabRender = computed(() => {
  let list = [];
  if (tabCurrent.value == "all") {
    for (let item in UserSvcListTabs.value) {
      if (UserSvcListTabs.value[item].tag != "all") {
        list.push(UserSvcListTabs.value[item]);
      }
    }
    return list;
  } else {
    for (let item in UserSvcListTabs.value) {
      if (UserSvcListTabs.value[item].tag == tabCurrent.value) {
        list = [UserSvcListTabs.value[item]];
      }
    }
    return list;
  }
});
const tabChange = (e) => {
  tabCurrent.value = e.target.value;
};
</script>
