<template>
  <authSet @authoritySet="authoritySet" :set="set"></authSet>
  <div>
    <button
      class="btn"
      :class="newSvcToggle ? 'bg-cancel' : 'bg-submit'"
      @click="newSvcToggle = !newSvcToggle"
    >
      {{ newSvcToggle ? "修改關閉" : "修改開啟" }}
    </button>
  </div>
  <authList
    @authoritySet="authoritySet"
    :change="newSvcToggle"
    :set="set"
  ></authList>
  <div class="flex justify-evenly">
    <button
      class="btn btnClick bg-primaryDark my-8"
      @click="Store.currentNewStep = 'usernewBasic'"
    >
      上一步
    </button>
    <button
      class="btn btnClick bg-primaryDark my-8"
      @click="
        if (userStore.userRangeValid) {
          Store.currentNewStep = 'userNewRange';
        } else {
          Store.currentNewStep = 'usernewConfirm';
        }
      "
    >
      下一步
    </button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useStore, useUserStore } from "../../store/store";
import authList from "./authList.vue";
import authSet from "./authSet.vue";
const Store = useStore();
const userStore = useUserStore();

const props = defineProps(["newUser"]);
const emit = defineEmits(["newUserConfirm"]);
const set = ref({
  authority: [],
  sets: null,
});
const newSvcToggle = ref(true);
const authoritySet = (value) => {
  set.value = value;
  props.newUser.authority = value.authority;
  props.newUser.sets = value.sets;
  emit("newUserConfirm", props.newUser);
};
</script>
