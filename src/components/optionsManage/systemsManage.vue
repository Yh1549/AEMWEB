<template>
  <div class="w-full flex justify-evenly pt-4">
    <!-- 公告發布系統 -->
    <div class="w-1/3 border-2 border-primaryDark rounded">
      <div class="flex justify-between items-center p-2">
        <p class="font-bold text-lg">系統</p>
        <button
          v-if="Store.getSvcAuth('CreateSysList')"
          @click="systemDialog.showModal()"
          class="btn btnClick bg-primaryDark"
        >
          新增+
        </button>
      </div>
      <div class="flex justify-between p-2">
        <label class="inpLabel w-full">
          <select
            class="inp w-full"
            @change="selectSystem"
            v-model="chosenSystem"
          >
            <option :value="undefined" disabled>請選擇系統</option>
            <option v-for="i in systemRender" :value="i" :key="i">
              {{ i.memo }}/{{ i.name }}
            </option>
          </select>
        </label>
      </div>
      <div class="w-full p-2">
        <div class="my-2 h-20">
          <p class="opacity-60 text-sm font-bold">系統代碼</p>
          <p class="text-lg font-bold">{{ chosenSystem?.name }}</p>
        </div>
        <div class="my-2 h-20">
          <p class="opacity-60 text-sm font-bold">系統名稱</p>
          <p class="text-lg font-bold">{{ chosenSystem?.memo }}</p>
        </div>
      </div>
    </div>
    <!-- 公告類別群組 -->
    <div class="w-1/2 border-2 border-primaryDark rounded">
      <div class="flex justify-between items-center p-2">
        <p class="font-bold text-lg">{{ chosenSystem?.memo }}</p>
        <button
          v-if="Store.getSvcAuth('CreatePostTag') && chosenSystem != null"
          @click="tagEdit('new')"
          class="btn btnClick bg-primaryDark"
        >
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
          <tr v-for="tag in tagList" class="px-4" :key="tag">
            <td>{{ tag.name }}</td>
            <td>{{ tag.memo }}</td>
            <td>
              <button
                v-if="Store.getSvcAuth('UpdatePostTag')"
                class="rounded w-8 h-8 bg-primaryDark mr-2 transition-all"
                @click="tagEdit('edit', tag)"
              >
                <i class="fa-solid fa-gear text-white"></i>
              </button>
              <button
                v-if="Store.getSvcAuth('DeletePostTag')"
                class="rounded w-8 h-8 bg-cancel transition-all"
                @click.stop="deleteTag(tag)"
              >
                <i class="fa-solid fa-trash text-white pointer-events-none"></i>
              </button>
            </td>
          </tr>
        </template>
      </listTable>
    </div>
  </div>
  <!-- 編輯與新增群組類別 -->
  <dialog
    ref="tagEditDialog"
    @close="tagReset"
    class="w-1/3 rounded bg-background overflow-y-auto scrollbar"
  >
    <p class="font-bold text-2xl my-2">新增/修改類別</p>
    <form>
      <div class="h-24">
        <span> 類別代碼 </span>
        <label class="inpLabel w-full">
          <input
            v-if="tagChangeState == 'new'"
            class="inp w-full"
            :placeholder="tagCurrent?.name"
            v-verify:[IdValidArg]="tagCheckList.tagId"
            v-model="tagId"
          />
          <span v-else>{{ tagCurrent?.name }}</span>
        </label>
        <inputErrorMsg v-if="tagCheckList.tagId.pass == false">{{
          tagCheckList.tagId.msg
        }}</inputErrorMsg>
      </div>
      <div class="h-24">
        <span> 類別名稱 </span>
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
      <button @click="cancelTagEdit" class="btn btnClick bg-cancel">
        取消
      </button>
      <button
        @click="tagChangeState == 'edit' ? updateTag() : newTag()"
        class="btn btnClick bg-submit"
      >
        儲存
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
      <button @click="cancelSystem" class="btn btnClick bg-cancel">取消</button>
      <button @click="createSystem" class="btn btnClick bg-submit">儲存</button>
    </div>
  </dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import apiRequest from "../../api/apiRequest";
import {
  createPostTag,
  createSysList,
  deletePostTag,
  findSysList,
  updatePostTag,
} from "../../api/service";
import { checkValidList } from "../../formValidation/validTunnel";
import { useStore } from "../../store/store";
import inputErrorMsg from "../inputErrorMsg.vue";
import listTable from "../listTable.vue";
const Store = useStore();

const systems = ref([]);
const getSystems = async () => {
  await findSysList();
  systems.value = JSON.parse(sessionStorage.getItem("SysList"));
};
getSystems();
const systemRender = computed(() => {
  return systems.value;
});

const systemDialog = ref(null);
const tagEditDialog = ref(null);

const chosenSystem = ref(null);
const tagList = ref([]);
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

const reset = () => {
  newSystemId.value = "";
  newSysCheckList.value.newSystemId.pass = null;
  newSystemName.value = "";
  newSysCheckList.value.newSystemName.pass = null;
  errorMsg.value = "";
};

const selectSystem = async () => {
  findPostTag();
  reset();
};
const createSystem = async () => {
  if (checkValidList(newSysCheckList.value) != true) {
    errorMsg.value = "請重新確認輸入資料";
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
  } else {
    Store.alertShow = true;
    Store.alertObj = {
      msg: "新增系統失敗",
      func: (e) => {},
    };
  }
  reset();
};
const cancelSystem = () => {
  reset();
  systemDialog.value.close();
};
const findPostTag = async () => {
  let res = await apiRequest.post("FindPostTag", {
    system: chosenSystem.value.name,
  });
  if (res.desc == "successful") {
    tagList.value = res.resBody.tagModelList;
  }
};
// **********************公告類別群組************************

const tagChangeState = ref("");
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
  tagId.value = "";
  tagMemo.value = "";
  tagCurrent.value = "";
  tagErrorMsg.value = "";
};

const tagEdit = (edit, tag) => {
  if (edit == "edit") {
    tagChangeState.value = "edit";
    tagCurrent.value = tag;
  } else if (edit == "new") {
    tagChangeState.value = "new";
  }
  tagEditDialog.value.showModal();
};
const cancelTagEdit = () => {
  tagReset();
  tagEditDialog.value.close();
};
const updateTag = async () => {
  tagId.value = tagCurrent.value.name;
  tagCheckList.value.tagId.pass = true;
  let resMsg = "";
  if (checkValidList(tagCheckList.value) != true) {
    tagErrorMsg.value = "請重新確認輸入資料";
    return;
  }
  const res = await updatePostTag({
    system: chosenSystem.value.name,
    name: tagId.value,
    memo: tagMemo.value,
  });
  if (res.desc == "successful") {
    findPostTag();
    resMsg = "編輯成功";
  } else {
    resMsg = "編輯失敗";
  }
  Store.alertShow = true;
  Store.alertObj = {
    msg: resMsg,
    func: (e) => {},
  };
  tagReset();
  tagEditDialog.value.close();
};

const newTag = async () => {
  let resMsg = "";
  if (checkValidList(tagCheckList.value) != true) {
    tagErrorMsg.value = "請重新確認輸入資料";
    return;
  }
  const res = await createPostTag({
    system: chosenSystem.value.name,
    name: tagId.value,
    memo: tagMemo.value,
  });
  if (res.desc == "successful") {
    findPostTag();
    resMsg = "新增成功";
  } else {
    resMsg = "新增失敗";
  }
  Store.alertShow = true;
  Store.alertObj = {
    msg: resMsg,
    func: () => {},
  };
  tagReset();

  tagEditDialog.value.close();
};

// delete postTag
const deleteTag = async (tag) => {
  let resMsg = "";
  Store.alertShow = true;
  Store.alertObj = {
    msg: `確定要刪除「${tag.memo}」嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await deletePostTag({
          system: chosenSystem.value.name,
          name: tag.name,
        });
        if (res.desc == "successful") {
          findPostTag();
          resMsg = "刪除成功";
        } else {
          resMsg = "刪除失敗";
        }
        Store.alertShow = true;
        Store.alertObj = {
          msg: resMsg,
          func: (e) => {},
        };
      }
    },
  };
};
</script>
