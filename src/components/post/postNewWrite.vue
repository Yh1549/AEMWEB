<template>
  <div class="my-2">
    <div class="w-full md:flex justify-evenly">
      <div
        class="w-full p-4 mb-2 md:mb-0 md:mr-2 flex flex-col md:flex-row border-2 border-primaryDark rounded bg-white shadow-lg"
        :class="{ 'md:w-1/2': route.path == '/postNew' }"
      >
        <div class="w-full md:w-1/2">
          <!-- 權重 -->
          <div class="">
            <span class="font-bold">是否置頂 : </span>
            <div class="my-2">
              <label class="inp block border-none"
                ><input
                  type="radio"
                  value="0"
                  v-model="postStore().newPost.top"
                />
                <span class="ml-1">置頂</span></label
              ><label class="inp block border-none">
                <input
                  type="radio"
                  value="1"
                  v-model="postStore().newPost.top"
                /><span class="ml-1">不置頂</span>
              </label>
            </div>
            <span>上架日期</span>
            <label class="inpLabel ml-1 p-0">
              <input
                type="date"
                class="inp p-1"
                :min="Store().getToday()"
                name="postDate"
                data-valid-option="notNull,todayAfter"
                v-model="postStore().newPost.postDate"
                @change="InputValidation(postStore().newPostCheckList, $event)"
              />
            </label>
          </div>
        </div>
        <div class="w-full md:w-1/2">
          <div>
            <!-- 關聯系統 -->
            <div class="mb-2">
              <div class="flex justify-between items-center pr-1">
                <span class="font-bold">發布系統</span>
                <span class="text-sm opacity-70">您打算發送公告的系統</span>
              </div>
              <label class="inpLabel w-full">
                <select
                  name="relSys"
                  data-valid-option="notNull"
                  v-model="postStore().newPost.relSys"
                  class="w-full inp block"
                  :disabled="route.name == 'postUpdate'"
                  @change="
                    findPostTag(postStore().newPost.relSys);
                    InputValidation(postStore().newPostCheckList, $event);
                    findFlow();
                  "
                >
                  <option disabled value="null">請選擇您所發布的系統</option>
                  <option
                    v-for="item in Store().postOption.System"
                    :key="item.name"
                    :value="item.name"
                  >
                    {{ item.memo }}
                  </option>
                </select></label
              >
            </div>
            <!-- 群組tag -->
            <div class="">
              <div class="flex justify-between items-center pr-1">
                <span class="font-bold">發布類別 :</span>
                <span class="text-sm opacity-70">預計發送系統的分類</span>
              </div>
              <label class="inpLabel w-full">
                <select
                  name="tag"
                  data-valid-option=""
                  v-model="postStore().newPost.tag"
                  class="w-full inp block"
                  @change="
                    InputValidation(postStore().newPostCheckList, $event)
                  "
                >
                  <option disabled value="null">請選擇公告類別</option>
                  <option
                    v-for="item in Store().postOption.Tag"
                    :key="item.name"
                    :value="item.name"
                  >
                    {{ item.memo }}
                  </option>
                </select>
              </label>
            </div>
          </div>
          <div class="rounded bg-primaryDark flex my-2 py-2">
            <span v-if="postStore().getRelSys() == false" class="text-white m-2"
              >請先選擇您的<span class="font-bold">系統</span
              >，再選定您希望此公告的類別</span
            >
            <div v-else class="text-white my-auto ml-2">
              <span class="text-primaryLight text-sm">關聯系統:</span>
              <span class="block font-bold text-sm">{{
                postStore().getRelSys("name")
              }}</span>

              <span class="block text-2xl font-bold">
                {{ postStore().getRelSys("memo") }}
              </span>
              <span class="my-2 text-sm text-primaryLight">類別 :</span
              ><span class="font-bold">{{ postStore().getTag("memo") }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 建檔流程選擇 -->
      <div
        v-if="route.path == '/postNew'"
        class="md:w-1/2 p-4 border-2 border-primaryDark bg-white rounded shadow-lg"
      >
        <span class="block font-bold">選擇建檔流程 :</span>
        <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-1/2">
            <label class="inpLabel w-full">
              <select
                name="flow"
                class="w-full inp"
                data-valid-option="notNull"
                v-model="postStore().newPost.flow"
                @change="
                  FindCaseFlowAndDetail(postStore().newPost.flow);
                  InputValidation(postStore().newPostCheckList, $event);
                "
              >
                <option
                  v-for="(item, index) in flowStore().caseflow"
                  :value="item.flow"
                  :key="index"
                  :selected="index == 0"
                >
                  {{ item.memo }}
                </option>
              </select>
            </label>

            <div
              class="w-full my-2 py-2 bg-primaryDark rounded flex z-50 shadow-md relative"
            >
              <span
                v-if="flowStore().caseflow.length == 0"
                class="text-white m-2"
                >注意!若此帳號沒有任何建檔流程，將無法新增公告</span
              >
              <span
                v-else-if="postStore().getCaseflow() == false"
                class="text-white m-2"
                >請選擇您的<span class="font-bold">建檔流程</span></span
              >

              <div v-else class="text-white my-auto ml-2 py-4">
                <span class="block font-bold text-sm">{{
                  flowStore().caseDetail.flow
                }}</span>
                <span class="block text-2xl font-bold">
                  {{ flowStore().caseDetail.memo }}
                </span>
                <span class="block font-bold text-sm my-2"
                  >流程共 {{ flowStore().caseDetail.totalLevel }} 層</span
                >
              </div>
              <div class="h-12 absolute bottom-0 right-0 opacity-50">
                <img src="../../assets/caseflowimg-w.png" class="w-16" />
              </div>
            </div>
            <span>*建檔流程為此則公告所需經過主管審查之流程</span>
          </div>
          <div class="w-full md:w-1/2 md:mx-2">
            <span v-if="flowStore().caseDetail.detailList" class="block"
              >此流程所包含的層級角色 :</span
            >
            <span v-if="flowStore().caseDetail.detailList?.length == 0"
              >此流程無任何層級角色</span
            >
            <div
              v-for="item in flowStore().caseDetail.detailList"
              :key="item"
              class="w-full bg-primaryDark rounded flex items-center mb-4"
            >
              <div
                class="rounded-full bg-secondaryDark w-[20px] h-[20px] m-2 flex justify-center items-center"
              >
                <span class="text-primaryDark font-bold">{{ item.level }}</span>
              </div>
              <div class="flex justify-between items-center w-full pr-2">
                <span class="text-white">{{ item.memo }}</span>
                <span class="text-primaryLight text-sm">{{ item.role }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full p-4 border-2 border-primaryDark bg-white shadow-lg rounded mt-2"
    >
      <div class="flex justify-between items-center pr-1">
        <span class="font-bold">標題</span>
        <span class="text-sm opacity-70">您打算發送公告的標題</span>
      </div>
      <label for="title" class="inpLabel w-full">
        <input
          type="text"
          placeholder="請填寫公告標題"
          class="w-full inp"
          :class="
            getInputValidation(postStore().newPostCheckList.title).result
              ? ''
              : 'border-cancel'
          "
          name="title"
          data-valid-option="notNull,charMax(64)"
          v-model="postStore().newPost.title"
          @keyup="InputValidation(postStore().newPostCheckList, $event)"
        />
      </label>
      <span
        v-if="!getInputValidation(postStore().newPostCheckList.title).result"
        class="text-cancel font-bold"
        ><i class="fa-solid fa-circle-exclamation mx-2"></i
        >{{ getInputValidation(postStore().newPostCheckList.title).msg }}
      </span>
      <div class="flex justify-between items-center pr-1">
        <span class="font-bold">內文</span>
        <span class="text-sm opacity-70">您打算發送公告的內文</span>
      </div>
      <tiptap
        data-valid-option="notNull"
        v-model="postStore().newPost.content"
        @keyup="
          InputValidationContent(
            postStore().newPost.content,
            postStore().newPostCheckList,
            'content',
            'notNull'
          )
        "
      />
      <span
        v-if="!getInputValidation(postStore().newPostCheckList.content).result"
        class="text-cancel font-bold"
        ><i class="fa-solid fa-circle-exclamation mx-2"></i
        >{{ getInputValidation(postStore().newPostCheckList.content).msg }}
      </span>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref } from "vue";
import { postStore, flowStore, Store } from "../../store/store";
import {
  InputValidation,
  getInputValidation,
  InputValidationContent,
} from "../../formValidation/inputCase";
import {
  findPostTag,
  FindCaseFlowAndDetail,
  FindEmpCaseFlowForCaseCreate,
} from "../../api/service";
import Tiptap from "../Tiptap/Tiptap.vue";
import { useRoute } from "vue-router";
const route = useRoute();

const findFlow = async () => {
  flowStore().$reset();
  postStore().newPostCheckList.flow = null;
  const res = await FindEmpCaseFlowForCaseCreate(
    "POST",
    postStore().newPost.relSys
  );
  if (res.desc == "successful") {
    flowStore().caseflow = res.resBody.flowList;
  }
};
onMounted(() => {
  flowStore().caseDetail = {};
});
</script>
