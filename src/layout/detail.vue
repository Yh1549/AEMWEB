<template>
  <loadSpinner>
    <template #title>載入中</template>
  </loadSpinner>
  <div v-if="!Store().loadingSpinner">
    <div class="p-2 w-full flex justify-between relative">
      <detailStatus></detailStatus>
      <DetailModify
        v-if="Store().detailUpdateToggle == false"
        :hasCaseFlow="hasCaseFlow"
      />
      <button
        v-else
        class="btn"
        @click="
          adStore().$reset();
          postStore().$reset();
          Store().detailUpdateToggle = false;
        "
      >
        返回
      </button>
    </div>
    <div v-if="!Store().detailUpdateToggle">
      <detailContent />
      <caseTable :uuid="Store().detailinfo.refId"></caseTable>
    </div>
    <div v-else>
      <component :is="getUpdatePage"></component>
    </div>
  </div>
</template>
<script setup>
import { Store, adStore, postStore } from "../store/store";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, ref, markRaw, computed } from "vue";
import {
  findPostTag,
  findSysList,
  FindOnePost,
  CheckCheckingCase,
} from "../api/service";
import apiRequest from "../api/apiRequest";
import detailContent from "../components/detail/detailContent.vue";
import detailStatus from "../components/detail/detailStatus.vue";
import caseTable from "../components/caseTable.vue";
import DetailModify from "../components/detail/detailModify.vue";
import postUpdate from "../components/post/PostUpdate.vue";
import adUpdate from "../components/ad/adUpdate.vue";

const route = useRoute();
const router = useRouter();
const hasCaseFlow = ref(false);

const getUpdatePage = computed(() => {
  if (route.params.category == "post") {
    return markRaw(postUpdate);
  } else if (route.params.category == "ad") {
    return markRaw(adUpdate);
  }
});

onBeforeMount(async () => {
  Store().detailUpdateToggle = false;
  Store().loadingSpinner = true;
  let detailInfo = {};
  if (route.params.category == "post") {
    const res = await FindOnePost(route.params.uuid);
    if (res.desc == "successful") {
      Store().loadingSpinner = false;
      detailInfo = res.resBody;
      await findPostTag(detailInfo.relSys);
    } else {
      Store().loadingSpinner = false;
      Store().alertShow = true;
      Store().alertObj = {
        msg: "查無資料",
        func: (e) => {
          router.go(-1);
        },
      };
    }
  } else if (route.params.category == "ad") {
    await apiRequest
      .post("FindOneAd", { uuid: route.params.uuid })
      .then(async (res) => {
        if (res.desc == "successful") {
          Store().loadingSpinner = false;
          detailInfo = res.resBody;
          apiRequest
            .post("FindSystemBlock", { system: detailInfo.system })
            .then((res) => {
              if (res.desc == "successful") {
                adStore().adBlockList = res.resBody.blockModelList;
              }
            })
            .catch();
        } else {
          Store().loadingSpinner = false;
          Store().alertShow = true;
          Store().alertObj = {
            msg: "查無資料",
            func: (e) => {},
          };
        }
      });
  }
  Store().detailinfo = detailInfo;
  const checkRes = await CheckCheckingCase(Store().detailinfo.refId);
  Store().noCheckingCase = checkRes.code == "0" ? true : false;
  await apiRequest
    .post("CheckUserCaseFlow", {
      refId: Store().detailinfo.refId,
    })
    .then((res) => {
      if (res.desc == "successful") {
        hasCaseFlow.value = true;
      } else {
      }
    });
  findSysList();
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
