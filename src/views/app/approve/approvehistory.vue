<template>
  <div class="bg-primary rounded-t">
    <caseSearch :allCase="allCase" :caseStatus="true"></caseSearch>
  </div>
  <loadSpinner>
    <template #title>載入中</template>
  </loadSpinner>
  <div v-if="!Store.loadingSpinner">
    <div v-if="!postExist" class="w-full">
      <no-result></no-result>
    </div>
    <div v-else>
      <ApproveList toPag="history"></ApproveList>
      <page-control :pageName="resetPage"></page-control>
    </div>
  </div>
</template>
<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { HistoryCases, findSysList } from "../../../api/service";
import noResult from "../../../components/NoResultPage.vue";
import caseSearch from "../../../components/approve/caseSearch.vue";
import ApproveList from "../../../components/list/ApproveList.vue";
import pageControl from "../../../components/pageControl.vue";
import { usePostStore, useStore } from "../../../store/store";
const Store = useStore();
const postStore = usePostStore();
const allCase = ref();
const postExist = computed(() => {
  if (postStore.List.length > 0) {
    return true;
  } else {
    return false;
  }
});

const resetPage = computed(() => {
  return postStore.List;
});

onBeforeMount(async () => {
  postStore.historyCase = true;
  Store.loadingSpinner = true;
  await HistoryCases();
  allCase.value = postStore.List;
  Store.loadingSpinner = false;
  await findSysList();
});
</script>
