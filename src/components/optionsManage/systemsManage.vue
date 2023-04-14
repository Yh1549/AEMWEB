<template>
  <div class="w-full lg:flex justify-evenly pt-8">
    <!-- 公告發布系統 -->
    <div
      class="w-full lg:w-6/16 border-2 border-primaryLight rounded mb-8 lg:mb-0"
    >
      <div class="w-full bg-primaryLight p-2 mb-4">
        <span class="font-bold text-lg">關聯系統選項</span>
      </div>
      <div class="flex justify-between px-4">
        <select class="inp w-1/2 inpLabel" v-model="chosenSystemName">
          <option value="undefined" disabled>請選擇系統</option>
          <option v-for="i in systemRender" :value="i.memo" :key="i">
            {{ i.memo }}
          </option>
        </select>
        <button @click="startCreateSystem" class="btn btnClick bg-primaryDark">
          新增系統
        </button>
      </div>

      <!-- Edit -->
      <div v-if="systemIsEditing" class="w-full p-4">
        <label class="block my-4 inpLabel"
          >系統代碼
          <input
            class="inp w-full border-2 border-secondaryDark"
            placeholder="請輸入系統代碼"
            v-model="newSystemId"
        /></label>
        <label class="block mb-12 inpLabel"
          >系統名稱
          <input
            class="inp w-full border-2 border-secondaryDark"
            placeholder="請輸入系統名稱"
            v-model="newSystemName"
        /></label>
        <div class="flex justify-between">
          <button @click="cancelEditSystem" class="btn btnClick bg-cancel/70">
            取消編輯
          </button>
          <button
            @click="confirmEditSystem"
            class="btn btnClick bg-secondaryLight text-black"
          >
            儲存變更
          </button>
        </div>
      </div>

      <!-- Read -->
      <div v-else class="w-full p-4">
        <label class="block my-4 inpLabel"
          >系統代碼
          <input
            type="text"
            class="inp bg-white block w-full px-2"
            v-model="chosenSystem.name"
            disabled
          />
        </label>
        <label class="block mb-12 inpLabel"
          >系統名稱
          <input
            type="text"
            class="inp bg-white block w-full px-2"
            v-model="chosenSystem.memo"
            disabled
          />
        </label>

        <div class="flex justify-between">
          <!-- <button
            v-if="chosenSystem.name"
            @click="startEditSystem"
            class="btn bg-secondaryLight text-black"
          >
            編輯系統 >
          </button> -->
          <button
            v-if="chosenSystem.name"
            @click="deleteSystem"
            class="btn btnClick bg-cancel/70"
          >
            刪除系統
          </button>
        </div>
      </div>
    </div>
    <!-- 公告類別群組 -->
    <div class="w-full lg:w-1/2 border-2 border-primaryLight rounded">
      <div class="w-full bg-primaryLight p-2 mb-4">
        <span class="font-bold text-lg">類別群組選項</span>
      </div>
      <!-- system 空白處理 -->
      <div
        v-if="!chosenSystemName"
        class="w-full bg-secondaryLight font-bold text-2xl flex justify-center p-2 mb-4"
      >
        請先選擇關聯系統 ！
      </div>
      <div v-else>
        <div v-for="i in chosenSystem.postTags" class="px-4" :key="i">
          <!-- 編輯群組(!isEditing) -->
          <div
            v-if="!i.isEditing"
            class="w-full border-2 border-primaryDark rounded text-primaryDark p-1 mb-2 flex flex-wrap justify-between items-center"
          >
            <div class="w-3/4 flex flex-wrap">
              <div class="w-36 py-1 px-4 border-r border-primaryDark">
                {{ i.name }}
              </div>
              <div class="w-36 py-1 px-4">
                {{ i.memo }}
              </div>
            </div>
            <div class="w-20">
              <button
                class="rounded w-8 h-8 bg-primaryDark mr-2 hover:scale-110 transition-all"
                @click="startEditPostTag(i)"
              >
                <i class="fa-solid fa-gear text-white"></i>
              </button>
              <button
                class="rounded w-8 h-8 bg-cancel hover:scale-110 transition-all"
                @click.stop="confirmDeletePostTag([i.name, i.memo])"
              >
                <i class="fa-solid fa-trash text-white"></i>
              </button>
            </div>
          </div>
          <!-- 編輯群組(isEditing) -->
          <div v-else class="w-full border-2 border-primaryDark rounded mb-2">
            <div class="flex p-1 justify-between">
              <p class="font-bold">編輯此類別</p>
              <div>
                <button
                  v-if="newPostTagName.trim() && newPostTagMemo.trim()"
                  @mousedown="confirmEditPostTag(i)"
                  class="h-8 mr-2 px-2 rounded bg-secondaryLight font-semibold"
                >
                  確認編輯
                </button>
                <button
                  class="w-8 h-8 bg-cancel rounded"
                  @click="i.isEditing = false"
                >
                  <span class="text-white">
                    <i class="fa-solid fa-xmark"></i>
                  </span>
                </button>
              </div>
            </div>
            <div
              class="md:flex lg:flex-none items-center bg-primaryLight rounded-b"
            >
              <div class="p-2">
                <span>群組代碼：</span>
                <input
                  onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
                  onchange="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
                  class="rounded p-2 mr-2 h-8 md:mb-0"
                  placeholder="請輸入代碼"
                  v-model="newPostTagName"
                />
              </div>
              <div class="p-2">
                <span>群組名稱：</span>
                <input
                  class="rounded p-2 mr-2 h-8 md:mb-0"
                  placeholder="請輸入名稱"
                  v-model="newPostTagMemo"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="px-4">
          <!-- 新增群組(!isCreating) -->
          <div
            v-if="!postTagIsCreating"
            @click="startCreatePostTag"
            class="w-full rounded text-primary border-2 border-primaryDark p-2 mb-1 hover:cursor-pointer"
          >
            <span class="px-1 w-6 text-primaryDark"
              ><i class="fa-solid fa-plus"></i
            ></span>
          </div>
          <!-- 新增群組(isCreating) -->
          <div v-else class="w-full border-2 border-primaryDark rounded mb-2">
            <div class="flex p-1 justify-between">
              <p class="font-bold">新增類別群組</p>
              <div>
                <button
                  v-if="newPostTagName.trim() && newPostTagMemo.trim()"
                  @mousedown="confirmCreatePostTag"
                  class="h-8 mr-2 px-2 rounded bg-secondaryLight font-semibold"
                >
                  確認新增
                </button>
                <button
                  class="w-8 h-8 bg-cancel rounded"
                  @click="postTagIsCreating = false"
                >
                  <span class="text-white">
                    <i class="fa-solid fa-xmark"></i>
                  </span>
                </button>
              </div>
            </div>
            <div
              class="md:flex lg:flex-none items-center bg-primaryLight rounded-b"
            >
              <div class="p-2">
                <span>群組代碼：</span>
                <input
                  onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
                  onchange="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
                  class="rounded p-2 mr-2 h-8 md:mb-0"
                  placeholder="請輸入代碼"
                  v-model="newPostTagName"
                />
              </div>
              <div class="p-2">
                <span>群組名稱：</span>
                <input
                  class="rounded p-2 mr-2 h-8 md:mb-0"
                  placeholder="請輸入名稱"
                  v-model="newPostTagMemo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 新增系統 -->
  <div v-if="systemIsCreating">
    <div class="fixed z-[10000] left-0 top-0 w-full h-full bg-black/[.40]">
      <div class="relative mx-8 md:mx-auto mt-44 md:w-1/2 rounded bg-white p-4">
        <div class="relative w-full h-80 bg-primaryLight/50 rounded p-2">
          <p class="mb-4 font-bold text-2xl">新增系統</p>
          <p class="mb-4 px-4">
            <label>系統代碼</label>
            <input
              onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
              onchange="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
              class="inp w-full"
              placeholder="請輸入系統代碼"
              v-model.trim="newSystemId"
            />
          </p>
          <p class="mb-4 px-4">
            <label>系統名稱</label>
            <input
              class="inp w-full"
              placeholder="請輸入系統名稱"
              v-model.trim="newSystemName"
            />
          </p>
          <button
            @click="cancelCreateSystem"
            class="absolute left-2 bottom-2 btn btnClick bg-cancel/70"
          >
            取消新增
          </button>
          <button
            @click="confirmCreateSystem"
            class="absolute right-2 bottom-2 btn btnClick bg-primaryDark"
          >
            儲存新增
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Store } from "../../store/store";
import {
  findSysList,
  createSysList,
  updateSysList,
  deleteSysList,
  findPostTag,
  createPostTag,
  updatePostTag,
  deletePostTag,
} from "../../api/service";

const systems = ref([]);
const getSystems = async () => {
  await findSysList();
  systems.value = Store().postOption.System;
};
getSystems();
const systemRender = computed(() => {
  return systems.value;
});
const chosenSystemName = ref(undefined);
const chosenSystem = ref({});
const newSystemId = ref(""),
  newSystemName = ref("");

watch(chosenSystemName, async () => {
  if (chosenSystemName.value == undefined) {
    chosenSystem.value = { id: "", name: "", memo: "", postTags: [] };
  } else {
    chosenSystem.value = systems.value
      .filter((i) => i.memo == chosenSystemName.value)
      .shift();
    newSystemId.value = chosenSystem.value.name;
    newSystemName.value = chosenSystem.value.memo;

    let system = chosenSystem.value.name;
    await findPostTag(system);
    chosenSystem.value.postTags = Store().postOption.Tag;
  }
});

// **********************關聯系統************************

// create system
const systemIsCreating = ref(false);
const startCreateSystem = () => {
  systemIsCreating.value = true;
  newSystemId.value = "";
  newSystemName.value = "";
};
const cancelCreateSystem = () => {
  systemIsCreating.value = false;
  newSystemId.value = "";
  newSystemName.value = "";
};
const confirmCreateSystem = async () => {
  try {
    if (newSystemId.value == "" || newSystemName.value == "") {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "請確認填寫所有資訊！",
        func: (e) => {},
      };
      return;
    }
    if (
      systems.value.some((x) => x.name == newSystemId.value) ||
      systems.value.some((x) => x.memo == newSystemName.value)
    ) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "系統代碼或名稱已存在，請重新填寫！",
        func: (e) => {},
      };
      return;
    }
    let name = newSystemId.value,
      memo = newSystemName.value;
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
      cancelCreateSystem();
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "新增系統失敗",
        func: (e) => {},
      };
    }
  } catch (error) {
    console.error(error.message);
    cancelCreateSystem();
  }
};

// edit system (temporally disabled)
const systemIsEditing = ref(false);
const startEditSystem = () => {
  newSystemId.value = chosenSystem.value.name;
  newSystemName.value = chosenSystem.value.memo;
  systemIsEditing.value = true;
};
const cancelEditSystem = () => {
  systemIsEditing.value = false;
  newSystemId.value = "";
  newSystemName.value = "";
};
const confirmEditSystem = async () => {
  try {
    if (newSystemId.value.trim() == "" || newSystemName.value.trim() == "") {
      alert("請確認填寫所有資訊 ！");
      return;
    }
    if (
      systems.value.some((x) => x.name == newSystemId.value.trim()) &&
      newSystemId.value.trim() !== chosenSystem.value.name
    ) {
      alert("系統代碼已存在，請重新填寫 ！");
      return;
    }
    if (
      systems.value.some((x) => x.memo == newSystemName.value.trim()) &&
      newSystemName.value.trim() !== chosenSystem.value.memo
    ) {
      alert("系統名稱已存在，請重新填寫 ！");
      return;
    }
    let oldName = chosenSystem.value.name,
      name = newSystemId.value,
      memo = newSystemName.value;
    const res = await updateSysList({ oldName, name, memo });
    if (res.desc == "successful") {
      chosenSystem.value.name = newSystemId.value;
      chosenSystem.value.memo = newSystemName.value;
      chosenSystemName.value = newSystemName.value;
      cancelEditSystem();
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "編輯系統失敗",
        func: (e) => {},
      };
    }
  } catch (error) {
    console.error(error.message);
    cancelEditSystem();
  }
};

// delete system
const deleteSystem = () => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `確定要刪除「${chosenSystemName.value}」嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        try {
          let name = chosenSystem.value.name;
          const res = await deleteSysList({ name });
          if (res.desc == "successful") {
            systems.value = systems.value.filter(
              (i) => i.memo !== chosenSystemName.value
            );
            sessionStorage.removeItem("SysList");
            chosenSystemName.value = undefined;
          } else {
            Store().alertShow = true;
            Store().alertObj = {
              msg: "刪除系統失敗",
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

// **********************公告類別群組************************

// create postTag
const newPostTagName = ref(""),
  newPostTagMemo = ref("");
const postTagInput = ref(null);
const postTagIsCreating = ref(false);
const startCreatePostTag = () => {
  newPostTagName.value = "";
  newPostTagMemo.value = "";
  chosenSystem.value.postTags.map((x) => (x.isEditing = false));
  postTagIsCreating.value = true;
};
const cancelCreatePostTag = () => {
  newPostTagName.value = "";
  newPostTagMemo.value = "";
  postTagIsCreating.value = false;
};
const confirmCreatePostTag = async () => {
  try {
    if (newPostTagName.value.trim() == "") {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "請確認填寫所有資訊！",
        func: (e) => {},
      };
      return;
    }
    if (
      chosenSystem.value.postTags.some(
        (x) =>
          x.name == newPostTagName.value.trim() ||
          x.memo == newPostTagMemo.value.trim()
      )
    ) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "類別群組不得重複，請重新填寫！",
        func: (e) => {},
      };
      return;
    }
    let name = newPostTagName.value,
      memo = newPostTagMemo.value,
      system = chosenSystem.value.name;
    const res = await createPostTag({ system, name, memo });
    if (res.desc == "successful") {
      chosenSystem.value.postTags.push({
        name: newPostTagName.value,
        memo: newPostTagMemo.value,
      });
      cancelCreatePostTag();
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "新增類別群組失敗",
        func: () => {
          newPostTagName.value = "";
          newPostTagMemo.value = "";
        },
      };
    }
  } catch (error) {
    console.error(error.message);
    cancelCreatePostTag();
  }
};

// edit postTag
const postTagIsEditing = ref([]);
const startEditPostTag = (i) => {
  postTagIsCreating.value = false;
  chosenSystem.value.postTags.map((x) => (x.isEditing = false));
  i.isEditing = true;
  newPostTagName.value = i.name;
  newPostTagMemo.value = i.memo;
};
const cancelEditPostTag = (i) => {
  i.isEditing = false;
  newPostTagName.value = "";
  newPostTagMemo.value = "";
};
const confirmEditPostTag = async (i) => {
  try {
    if (
      newPostTagName.value.trim() == "" ||
      newPostTagMemo.value.trim() == ""
    ) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "請確認填寫所有資訊！",
        func: (e) => {},
      };
      return;
    }
    if (
      chosenSystem.value.postTags.some(
        (x) => x.name == newPostTagName.value.trim()
      ) &&
      i.name !== newPostTagName.value.trim()
    ) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "群組代碼已存在，請重新填寫！",
        func: (e) => {},
      };
      return;
    }
    if (
      chosenSystem.value.postTags.some(
        (x) => x.memo == newPostTagMemo.value.trim()
      ) &&
      i.memo !== newPostTagMemo.value.trim()
    ) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "群組名稱已存在，請重新填寫！",
        func: (e) => {},
      };
      return;
    }
    let oldName = i.name,
      name = newPostTagName.value,
      memo = newPostTagMemo.value,
      system = chosenSystem.value.name;
    const res = await updatePostTag({ system, oldName, name, memo });
    if (res.desc == "successful") {
      i.name = newPostTagName.value;
      i.memo = newPostTagMemo.value;
      cancelEditPostTag(i);
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "編輯類別群組失敗",
        func: (e) => {},
      };
    }
  } catch (error) {
    console.error(error.message);
    cancelEditPostTag(i);
  }
};

// delete postTag
const confirmDeletePostTag = async ([name, memo]) => {
  Store().alertShow = true;
  Store().alertObj = {
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
            Store().alertShow = true;
            Store().alertObj = {
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
