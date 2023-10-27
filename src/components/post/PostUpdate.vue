<template>
  <div class="w-full p-2">
    <formRow class="w-3/4 mx-auto">
      <formRowItem :width="'w-full'">
        <span class="font-bold block">標題 :</span>
        <label class="inpLabel w-full">
          <input
            type="text"
            class="inp w-full"
            :placeholder="props.data.title"
            v-verify:[titleValidArg]="postUpdateChecking.title"
            v-model="updatePost.title"
          />
        </label> </formRowItem
    ></formRow>
    <formRow class="w-3/4 mx-auto">
      <formRowItem>
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
      </formRowItem>
      <formRowItem>
        <p class="font-bold block">日期/時間 :</p>
        <p class="border-2 rounded p-2 border-primaryDark">
          {{ props.data.postDate }}
        </p>
      </formRowItem>
    </formRow>
    <formRow class="w-3/4 mx-auto">
      <formRowItem :width="'w-full'">
        <span class="font-bold block">標籤 :</span>
        <div class="inpLabel w-full flex gap-2">
          <label v-for="item in tags" class="inpLabel cursor-pointer">
            <input
              type="checkbox"
              v-model="updatePost.tag"
              :value="item.name"
              :checked="props.data.tag.includes(item.name)"
            />
            {{ item.memo }}/{{ item.name }}
          </label>
        </div>
      </formRowItem>
    </formRow>

    <div class="w-3/4 mx-auto p-2">
      <span class="font-bold block">內文 :</span>
      <tiptap class="tiptapStyle" v-model="updatePost.content" />
    </div>
  </div>
  <div class="flex justify-center items-center">
    <button class="btn bg-submit" @click="sendNewPostInfo">儲存</button>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import apiRequest from "../../api/apiRequest";
import { findPostTag } from "../../api/service";
import tiptap from "../../components/Tiptap/Tiptap.vue";
import { useCommonStore } from "../../store/commonStore";
import { useStore } from "../../store/store";
import formRow from "../formRow.vue";
import formRowItem from "../formRowItem.vue";
const Store = useStore();
const commonStore = useCommonStore();
const router = useRouter();
const toggleTop = ref(false);
const props = defineProps(["data"]);
const tags = ref([]);
//
const updatePost = ref({
  uuid: props.data.uuid,
  title: props.data.title,
  content: props.data.content,
  top: props.data.top,
  tag: props.data.tag,
});
const postUpdateChecking = ref({
  title: { pass: true, msg: null },
  // content: { pass: null, msg: null },
});
const titleValidArg = ["notNull", "charMax(64)"];

//
const sendUpdatePost = async () => {
  let res = await apiRequest.post("UpdatePost", updatePost.value);
  if (res.desc == "successful") {
    Store.loadingSpinner = false;
    Store.detailUpdateToggle = false;
    await findPostTag(props.data.relSys);
    router.push({ name: "SvcSucess" });
  } else {
    commonStore.SvcFail.msg = res.desc;
    router.push({ name: "SvcFail" });
  }
};
//
const sendNewPostInfo = () => {
  for (let item in postUpdateChecking.value) {
    if (postUpdateChecking.value[item].pass != true) {
      Store.alertShow = true;
      Store.alertObj = {
        msg: "請重新檢查輸入資料",
        func: (e) => {},
      };
      return;
    }
  }
  Store.alertShow = true;
  Store.alertObj = {
    msg: "確定修改？",
    func: (e) => {
      if (e.target.value === "confirm") {
        Store.loadingSpinner = true;
        sendUpdatePost();
      }
    },
  };
};
watch(toggleTop, () => {
  if (toggleTop.value) {
    updatePost.value.top = "1";
  } else {
    updatePost.value.top = "0";
  }
});
onBeforeMount(async () => {
  let res = await apiRequest.post("FindPostTag", { system: props.data.relSys });
  if (res.desc == "successful") {
    tags.value = res.resBody.tagModelList;
  }
});
</script>
