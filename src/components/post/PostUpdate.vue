<template>
  <div class="w-full p-2">
    <div class="w-3/4 mx-auto p-2">
      <span class="font-bold block">標題 :</span>
      <label class="inpLabel w-full">
        <input
          type="text"
          class="inp w-full"
          :placeholder="Store().detailinfo.title"
          name="title"
          data-valid-option="notNull,charMax(64)"
          v-model="postStore().postUpdate.title"
          @keyup="InputValidation(postStore().postUpdateCheckList, $event)"
        />
      </label>
      <span
        class="text-cancel font-bold transition-all duration-200"
        :class="
          !getInputValidation(postStore().postUpdateCheckList.title).result
            ? 'opacity-100'
            : 'opacity-0'
        "
        ><i class="fa-solid fa-circle-exclamation mr-2"></i
        >{{
          getInputValidation(postStore().postUpdateCheckList.title).msg
        }}</span
      >
    </div>
    <div class="flex w-3/4 mx-auto">
      <div class="w-1/3 mx-auto p-2">
        <span class="font-bold block">置頂 :</span>
        <div class="mx-auto w-full flex gap-2 items-center">
          <input
            id="toggleSwicthInput"
            class="hidden"
            type="checkbox"
            v-model="toggleTop"
          />
          <label for="toggleSwicthInput" class="toggleSwicth"></label>
          <span class="font-bold">{{ toggleTop ? "置頂" : "不置頂" }}</span>
        </div>
      </div>
      <div class="w-1/3 mx-auto p-2">
        <span class="font-bold block">日期 :</span>
        <label class="inpLabel w-full">
          <input
            type="date"
            class="inp w-full"
            :min="Store().getToday()"
            :placeholder="Store().detailinfo.postDate"
            v-model="postStore().postUpdate.postDate"
          />
        </label>
      </div>
      <div class="w-1/3 mx-auto p-2">
        <span class="font-bold block">標籤 :</span>
        <label class="inpLabel w-full">
          <select
            name="tag"
            data-valid-option=""
            v-model="postStore().postUpdate.tag"
            class="w-full inp"
            @change="InputValidation(postStore().postUpdateCheckList, $event)"
          >
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
    <div class="w-3/4 mx-auto p-2">
      <span class="font-bold block">內文 :</span>
      <tiptap
        data-valid-option="notNull"
        v-model="postStore().postUpdate.content"
        @keyup="
          InputValidationContent(
            postStore().postUpdate.content,
            postStore().postUpdateCheckList,
            'content',
            'notNull'
          )
        "
      />
      <span
        v-if="
          !getInputValidation(postStore().postUpdateCheckList.content).result
        "
        class="text-cancel font-bold"
        ><i class="fa-solid fa-circle-exclamation mx-2"></i
        >{{ getInputValidation(postStore().postUpdateCheckList.content).msg }}
      </span>
    </div>
  </div>
  <div class="flex justify-center items-center">
    <button class="btn bg-submit" @click="sendNewPostInfo">儲存</button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { Store, postStore } from "../../store/store";
import apiRequest from "../../api/apiRequest";
import { commonStore } from "../../store/commonStore";
import {
  InputValidation,
  getInputValidation,
  InputValidationContent,
} from "../../formValidation/inputCase";
import { onBeforeMount, ref, watch } from "vue";
import { findPostTag, FindOnePost } from "../../api/service";
import tiptap from "../../components/Tiptap/Tiptap.vue";
const route = useRoute();
const router = useRouter();
const toggleTop = ref(false);

const validCheck = () => {
  for (let item in postStore().postUpdateCheckList) {
    if (postStore().postUpdateCheckList[item] != null) {
      for (let i of postStore().postUpdateCheckList[item]) {
        if (i.result == false) {
          return false;
        }
      }
    } else {
      return true;
    }
  }
  return true;
};

let sendNewPostInfo = () => {
  let check = validCheck();
  if (!check) {
    Store().alertShow = true;
    Store().alertObj = {
      msg: "輸入有誤，請重新檢查",
      func: (e) => {},
    };
  } else {
    Store().alertShow = true;
    Store().alertObj = {
      msg: "確定修改？",
      func: (e) => {
        if (e.target.value === "confirm") {
          Store().loadingSpinner = true;
          // 編輯公告
          apiRequest
            .post("UpdatePost", postStore().postUpdate)
            .then(async (res) => {
              Store().loadingSpinner = false;
              if (res.desc == "successful") {
                const res = await FindOnePost(route.params.uuid);
                if (res.desc == "successful") {
                  Store().alertShow = true;
                  Store().alertObj = {
                    msg: "變更成功",
                    func: () => {},
                  };
                  Store().detailinfo = res.resBody;
                  Store().detailUpdateToggle = false;
                  await findPostTag(detailInfo.relSys);
                } else {
                  commonStore().SvcFail.msg = res.desc;
                  router.push({ name: "SvcFail" });
                }
              } else {
                commonStore().SvcFail.msg = res.desc;
                router.push({ name: "SvcFail" });
              }
            })
            .catch();
        }
      },
    };
  }
};
watch(toggleTop, () => {
  if (toggleTop.value) {
    postStore().postUpdate.top = "1";
  } else {
    postStore().postUpdate.top = "0";
  }
});
onBeforeMount(() => {
  postStore().postUpdate.uuid = Store().detailinfo.uuid;
  postStore().postUpdate.postDate = Store().detailinfo.postDate;
  postStore().postUpdate.title = Store().detailinfo.title;
  postStore().postUpdate.top = Store().detailinfo.top;
  postStore().postUpdate.content = Store().detailinfo.content;
  postStore().postUpdate.tag = Store().detailinfo.tag;
  if (Store().detailinfo.top == "1") {
    toggleTop.value = true;
  }
});
</script>
<style scoped></style>
