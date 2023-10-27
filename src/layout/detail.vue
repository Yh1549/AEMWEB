<template>
  <div>
    <div class="p-2 w-full flex justify-between relative">
      <detailStatus :detailInfo="detailInfo"></detailStatus>
      <DetailModify
        v-if="Store.detailUpdateToggle == false"
        :hasCaseFlow="hasCaseFlow"
        :detailInfo="detailInfo"
      />
      <button v-else class="btn" @click="returnDetail">返回</button>
    </div>
    <div v-if="!Store.detailUpdateToggle">
      <detailContent :detailInfo="detailInfo" />
      <caseTable :uuid="detailInfo.uuid"></caseTable>
    </div>
    <div v-else>
      <component :is="getUpdatePage" :data="detailInfo"></component>
    </div>
  </div>
</template>
<script setup>
import { computed, markRaw, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiRequest from "../api/apiRequest";
import { FindOnePost, findSysList } from "../api/service";
import adUpdate from "../components/ad/adUpdate.vue";
import caseTable from "../components/caseTable.vue";
import detailContent from "../components/detail/detailContent.vue";
import DetailModify from "../components/detail/detailModify.vue";
import detailStatus from "../components/detail/detailStatus.vue";
import postUpdate from "../components/post/PostUpdate.vue";
import { useAdStore, usePostStore, useStore } from "../store/store";
const Store = useStore();
const adStore = useAdStore();
const postStore = usePostStore();

const route = useRoute();
const router = useRouter();
const hasCaseFlow = ref(false);
const detailInfo = ref({});
//
const getUpdatePage = computed(() => {
  if (route.params.category == "post") {
    return markRaw(postUpdate);
  } else if (route.params.category == "ad") {
    return markRaw(adUpdate);
  }
});

const checkUserCaseFlow = async () => {
  let res = await apiRequest.post("CheckUserCaseFlow", {
    id: detailInfo.value.uuid,
  });
  if (res.desc == "successful") {
    hasCaseFlow.value = true;
  }
};

// const findSystemBlock = async () => {
//   let res = await apiRequest.post("FindSystemBlock", {
//     system: detailInfo.value.system,
//   });
//   if (res.desc == "successful") {
//     adBlockList.value = res.resBody.blockModelList;
//   }
// };

onBeforeMount(async () => {
  useStore().detailUpdateToggle = false;
  if (route.params.category == "post") {
    const res = await FindOnePost(route.params.uuid);
    if (res.desc == "successful") {
      detailInfo.value = res.resBody;
      let resTag = await apiRequest.post("FindPostTag", {
        system: detailInfo.value.relSys,
      });
      if (resTag.desc == "successful") {
        detailInfo.value.tagList = resTag.resBody.tagModelList;
      }
      checkUserCaseFlow();
    } else {
      Store.alertShow = true;
      Store.alertObj = {
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
          detailInfo.value = res.resBody;
          checkUserCaseFlow();
        } else {
          Store.alertShow = true;
          Store.alertObj = {
            msg: "查無資料",
            func: (e) => {},
          };
        }
      });
  }
  findSysList();
});
const returnDetail = () => {
  adStore.$reset();
  postStore.$reset();
  Store.detailUpdateToggle = false;
};
</script>
