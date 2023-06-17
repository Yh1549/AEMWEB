<template>
  <div class="w-full flex justify-evenly pt-4">
    <!-- 公告發布系統 -->
    <div class="w-1/3 border-2 border-primaryDark rounded">
      <div class="flex justify-between items-center p-2">
        <p class="font-bold text-lg">關聯系統選項</p>
        <button
          @click="systemDialog.showModal()"
          class="btn btnClick bg-primaryDark"
        >
          新增+
        </button>
      </div>
      <div class="flex justify-between p-2">
        <label class="inpLabel w-full">
          <select class="inp w-full" v-model="chosenSystemName">
            <option :value="undefined" disabled>請選擇系統</option>
            <option v-for="i in systemRender" :value="i.memo" :key="i">
              {{ i.memo }}
            </option>
          </select>
        </label>
      </div>
      <div class="w-full p-2">
        <div class="my-2 h-20">
          <p class="opacity-60 text-sm font-bold">系統代碼</p>
          <p class="text-lg font-bold">{{ chosenSystem.name }}</p>
        </div>
        <div class="my-2 h-20">
          <p class="opacity-60 text-sm font-bold">系統名稱</p>
          <p class="text-lg font-bold">{{ chosenSystem.memo }}</p>
        </div>
      </div>
    </div>
    <!-- 公告類別群組 -->
    <div class="w-1/2 border-2 border-primaryDark rounded">
      <p v-if="!chosenSystemName" class="text-center font-bold text-2xl p-2">
        尚未選擇關聯系統
      </p>
      <div v-else>
        <div class="flex justify-between items-center p-2">
          <p class="font-bold text-lg">{{ chosenSystem.memo }}群組</p>
          <button @click="tagEdit('new')" class="btn btnClick bg-primaryDark">
            新增+
          </button>
        </div>
        <hr class="my-2" />
        <listTable>
          <template #th>
            <th>代碼</th>
            <th class="w-8/16">名稱</th>
            <th class="w-3/16">編輯選項</th>
          </template>
          <template #td>
            <tr v-for="tag in chosenSystem.postTags" class="px-4" :key="tag">
              <td>{{ tag.name }}</td>
              <td>{{ tag.memo }}</td>
              <td>
                <button
                  class="rounded w-8 h-8 bg-primaryDark mr-2 transition-all"
                  @click="tagEdit('edit', tag)"
                >
                  <i class="fa-solid fa-gear text-white"></i>
                </button>
                <button
                  class="rounded w-8 h-8 bg-cancel transition-all"
                  @click.stop="confirmDeletePostTag([tag.name, tag.memo])"
                >
                  <i class="fa-solid fa-trash text-white"></i>
                </button>
              </td>
            </tr>
          </template>
        </listTable>
      </div>
    </div>
  </div>
  <!-- 編輯與新增群組類別 -->
  <dialog
    ref="tagEditDialog"
    @close="tagReset"
    class="w-1/3 rounded bg-background overflow-y-auto scrollbar"
  >
    <p class="font-bold text-2xl my-2">修改類別</p>
    <form>
      <div class="h-24">
        <span> 類別代碼 </span>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            :placeholder="tagCurrent?.name"
            v-verify:[IdValidArg]="tagCheckList.tagId"
            v-model="tagId"
          />
        </label>
        <inputErrorMsg v-if="tagCheckList.tagId.pass == false">{{
          tagCheckList.tagId.msg
        }}</inputErrorMsg>
      </div>
      <div class="h-24">
        <span> 系統名稱 </span>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            :placeholder="tagCurrent?.memo"
            v-verify:[memoValidArg]="tagCheckList.tagMemo"
            v-model.trim="tagMemo"
          />
        </label>
        <inputErrorMsg v-if="tagCheckList.tagMemo.pass == false">{{
          tagCheckList.tagMemo.msg
        }}</inputErrorMsg>
      </div>
    </form>
    <div class="h-6">
      <inputErrorMsg v-if="tagErrorMsg != ''">{{ tagErrorMsg }}</inputErrorMsg>
    </div>
    <div class="flex justify-evenly">
      <button @click="tagEditDialog.close()" class="btn btnClick bg-cancel">
        取消新增
      </button>
      <button
        @click="tagCheangeState == 'edit' ? updateTag() : newTag()"
        class="btn btnClick bg-submit"
      >
        儲存新增
      </button>
    </div>
  </dialog>
  <!-- 新增系統 -->
  <dialog
    ref="systemDialog"
    @close="reset"
    class="w-1/3 rounded bg-background overflow-y-auto scrollbar"
  >
    <p class="font-bold text-2xl my-2">新增系統</p>
    <form>
      <div class="h-24">
        <span> 系統代碼 </span>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            placeholder="請輸入系統代碼"
            v-verify:[newSystemIdValidArg]="newSysCheckList.newSystemId"
            v-model.trim="newSystemId"
          />
        </label>
        <inputErrorMsg v-if="newSysCheckList.newSystemId.pass == false">{{
          newSysCheckList.newSystemId.msg
        }}</inputErrorMsg>
      </div>
      <div class="h-24">
        <span> 系統名稱 </span>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            placeholder="請輸入系統名稱"
            v-verify:[newSystemNameValidArg]="newSysCheckList.newSystemName"
            v-model.trim="newSystemName"
          />
        </label>
        <inputErrorMsg v-if="newSysCheckList.newSystemName.pass == false">{{
          newSysCheckList.newSystemName.msg
        }}</inputErrorMsg>
      </div>
    </form>
    <div class="h-6">
      <inputErrorMsg v-if="errorMsg != ''">{{ errorMsg }}</inputErrorMsg>
    </div>
    <div class="flex justify-evenly">
      <button @click="systemDialog.close()" class="btn btnClick bg-cancel">
        取消新增
      </button>
      <button @click="createSystem" class="btn btnClick bg-submit">
        儲存新增
      </button>
    </div>
  </dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import {
  createPostTag,
  createSysList,
  deletePostTag,
  findPostTag,
  findSysList,
  updatePostTag,
} from "../../api/service";
import { useStore } from "../../store/store";
import inputErrorMsg from "../inputErrorMsg.vue";
import listTable from "../listTable.vue";
const Store = useStore();

const systems = ref([]);
const getSystems = async () => {
  await findSysList();
  systems.value = Store.postOption.System;
};
getSystems();
const systemRender = computed(() => {
  return systems.value;
});

const systemDialog = ref(null);
const tagEditDialog = ref(null);

const chosenSystemName = ref(undefined);
const chosenSystem = ref({});
const newSystemId = ref(""),
  newSystemName = ref("");
const newSysCheckList = ref({
  newSystemId: { pass: null, msg: null },
  newSystemName: { pass: null, msg: null },
});
const newSystemIdValidArg = ["notNull"];
const newSystemNameValidArg = ["notNull"];
const errorMsg = ref("");
const tagErrorMsg = ref("");

watch(chosenSystemName, async () => {
  if (chosenSystemName.value == undefined) {
    chosenSystem.value.id = "";
    chosenSystem.value.name = "";
    chosenSystem.value.memo = "";
    chosenSystem.value.postTags = [];
  } else {
    chosenSystem.value = systems.value
      .filter((i) => i.memo == chosenSystemName.value)
      .shift();
    newSystemId.value = chosenSystem.value.name;
    newSystemName.value = chosenSystem.value.memo;

    let system = chosenSystem.value.name;
    await findPostTag(system);
    chosenSystem.value.postTags = Store.postOption.Tag;
  }
});

const reset = () => {
  newSystemId.value = "";
  newSysCheckList.value.newSystemId.pass = null;
  newSystemName.value = "";
  newSysCheckList.value.newSystemName.pass = null;
  errorMsg.value = "";
};
const validCheck = (checkList) => {
  for (let item in checkList) {
    if (checkList[item].pass != true) {
      return false;
    }
  }
  return true;
};
const createSystem = async () => {
  if (validCheck(newSysCheckList.value) != true) {
    errorMsg.value = "請重新確認輸入資料";
    return;
  }
  if (
    systems.value.some((x) => x.name == newSystemId.value) ||
    systems.value.some((x) => x.memo == newSystemName.value)
  ) {
    errorMsg.value = "系統代碼或名稱已存在，請重新填寫！";
    return;
  }
  const name = newSystemId.value;
  const memo = newSystemName.value;
  const res = await createSysList({ name, memo });
  if (res.desc == "successful") {
    systems.value.push({
      name: newSystemId.value,
      memo: newSystemName.value,
      postTags: [],
      disabled: false,
    });
    sessionStorage.removeItem("SysList");
    chosenSystemName.value = newSystemName.value;
  } else {
    Store.alertShow = true;
    Store.alertObj = {
      msg: "新增系統失敗",
      func: (e) => {},
    };
  }
  reset();
};
// **********************公告類別群組************************

const tagCheangeState = ref("");
const tagCurrent = ref("");
const tagId = ref("");
const tagMemo = ref("");
const tagCheckList = ref({
  tagId: { pass: null, msg: null },
  tagMemo: { pass: null, msg: null },
});
const IdValidArg = ["notNull"];
const memoValidArg = ["notNull"];

const tagReset = () => {
  tagCurrent.value = "";
  tagErrorMsg.value = "";
};

const tagEdit = (edit, tag) => {
  if (edit == "edit") {
    tagCheangeState.value = "edit";
    tagCurrent.value = tag;
  } else if (edit == "new") {
    tagCheangeState.value = "new";
  }
  tagEditDialog.value.showModal();
};

const updateTag = async () => {
  if (validCheck(tagCheckList.value) != true) {
    tagErrorMsg.value = "請重新確認輸入資料";
    return;
  }
  const oldName = tagCurrent.value.name;
  const name = tagId.value;
  const memo = tagMemo.value;
  const system = chosenSystem.value.name;
  const res = await updatePostTag({ system, oldName, name, memo });
  if (res.desc == "successful") {
    tagEditDialog.value.close();
  } else {
    tagEditDialog.value.close();
    Store.alertShow = true;
    Store.alertObj = {
      msg: "編輯類別群組失敗",
      func: (e) => {},
    };
  }
};

const newTag = async () => {
  if (validCheck(tagCheckList.value) != true) {
    tagErrorMsg.value = "請重新確認輸入資料";
    return;
  }
  const name = tagId.value,
    memo = tagMemo.value,
    system = chosenSystem.value.name;
  const res = await createPostTag({ system, name, memo });
  if (res.desc == "successful") {
    chosenSystem.value.postTags.push({
      name: tagId.value,
      memo: tagMemo.value,
    });
    tagEditDialog.value.close();
  } else {
    tagEditDialog.value.close();
    Store.alertShow = true;
    Store.alertObj = {
      msg: "新增類別群組失敗",
      func: () => {},
    };
  }
};

// delete postTag
const confirmDeletePostTag = async ([name, memo]) => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定要刪除「${memo}」嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        try {
          let system = chosenSystem.value.name;
          const res = await deletePostTag({ system, name });
          if (res.desc == "successful") {
            chosenSystem.value.postTags = chosenSystem.value.postTags.filter(
              (i) => i.name !== name
            );
          } else {
            Store.alertShow = true;
            Store.alertObj = {
              msg: "刪除類別群組失敗",
              func: (e) => {},
            };
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    },
  };
};
</script>
