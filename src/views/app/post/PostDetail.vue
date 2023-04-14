<template>
  <loadSpinner>
    <template #title>載入中</template>
  </loadSpinner>
  <div v-if="!Store().loadingSpinner">
    <div class="p-2 w-full flex justify-between relative">
      <post-status></post-status>
      <postDetailUpdate />
    </div>
    <postDetailContent />
    <caseTable :uuid="postStore().postDetail.refId"></caseTable>
  </div>
</template>
<script setup>
import { Store, postStore } from "../../../store/store";
import { useRoute } from "vue-router";
import { ref, onBeforeMount } from "vue";
import {
  findPostTag,
  findSysList,
  FindOnePost,
  CheckCheckingCase,
} from "../../../api/service";

import postDetailUpdate from "../../../components/post/postDetailUpdate.vue";
import postDetailContent from "../../../components/post/postDetailContent.vue";
import postStatus from "../../../components/post/postStatus.vue";
import caseTable from "../../../components/caseTable.vue";
import ApproveAll from "../approve/approveAll.vue";

const route = useRoute();

onBeforeMount(async () => {
  Store().loadingSpinner = true;
  const postRes = await FindOnePost(route.params.uuid);
  if (postRes.desc == "successful") {
    Store().loadingSpinner = false;
    postStore().postDetail = postRes.resBody;
  } else {
    Store().loadingSpinner = false;
    Store().alertShow = true;
    Store().alertObj = {
      msg: "查無此公告細節",
      func: (e) => {},
    };
  }
  const checkRes = await CheckCheckingCase(Store().detailinfo.refId);
  console.log(checkRes);
  findSysList();
  findPostTag(postStore().postDetail.relSys);
});
</script>
<style scoped>
.postText {
  @apply font-bold my-2;
}
.postText span {
  @apply rounded bg-white w-full block p-2 shadow-md mb-3;
}
.sign {
  @apply px-3 absolute text-5xl text-cancel/30 border-cancel/30 font-bold w-[90%] h-fit border-4 border-dashed my-4;
  text-align: justify;
  text-align-last: justify;
}
</style>
