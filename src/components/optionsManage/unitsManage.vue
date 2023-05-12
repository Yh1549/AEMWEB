<template>
  <div class="w-full my-2 py-2 border-2 border-primaryLight rounded">
    <div v-for="i in unitRender" class="md:p-2" :key="i">
      <!-- 編輯(!isEditing) -->
      <div
        v-if="!i.isEditing"
        class="w-full flex justify-between items-center border-2 border-primaryDark rounded p-2 mb-2"
      >
        <div class="w-3/4 flex flex-wrap">
          <span
            class="w-32 md:w-20 text-sm flex justify-center md:text-base pr-1 border-r-2 border-primaryDark"
          >
            {{ i.code }}
          </span>
          <span
            class="w-32 text-sm flex justify-center md:text-base px-1 border-r-2 border-primaryDark"
          >
            {{ i.name }}
          </span>
          <span class="w-32 text-sm flex justify-center md:text-base md:pl-1">
            {{ i.unit }}
          </span>
        </div>
        <div class="w-20">
          <button
            class="rounded w-8 h-8 bg-primaryDark mr-2 hover:scale-110 transition-all"
            @click="starEditDept(i)"
          >
            <i class="fa-solid fa-gear text-white"></i>
          </button>
          <button
            class="rounded w-8 h-8 bg-cancel hover:scale-110 transition-all"
            @click.stop="deleteUnit([i.code, i.name, i.unit])"
          >
            <i class="fa-solid fa-trash text-white"></i>
          </button>
        </div>
      </div>
      <!-- 編輯(isEditing) -->
      <div v-else class="w-full border-2 border-primaryDark rounded">
        <div class="flex p-1 justify-between">
          <p class="font-bold">
            <span class="mr-2">編輯此單位</span>
            <span class="text-cancel"
              >（注意！編輯部門單位將立即登出該部門內所有使用者，請謹慎使用）</span
            >
          </p>
          <div>
            <button
              v-if="newUnitId.trim() && newUnitName.trim()"
              @click="confirmEditDept(i)"
              class="h-8 mr-2 px-2 rounded bg-secondaryLight font-semibold"
            >
              確認編輯
            </button>
            <button
              class="w-8 h-8 bg-cancel rounded"
              @click="i.isEditing = !i.isEditing"
            >
              <span class="text-white">
                <i class="fa-solid fa-xmark"></i>
              </span>
            </button>
          </div>
        </div>
        <div class="md:flex justify-center bg-primaryLight rounded-b">
          <div class="p-2">
            <span>單位代碼：</span>
            <input
              onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
              onchange="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
              class="rounded w-full p-2"
              placeholder="請輸入代碼"
              v-model="newUnitId"
            />
          </div>
          <div class="p-2">
            <span>部門名稱：</span>
            <input
              class="rounded w-full p-2"
              placeholder="請輸入名稱"
              v-model="newDeptName"
            />
          </div>
          <div class="p-2">
            <span>單位名稱：</span>
            <input
              class="rounded w-full p-2"
              placeholder="請輸入名稱"
              v-model="newUnitName"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="md:p-2">
      <!-- 新增(!isCreating) -->
      <div
        v-if="!unitIsCreating"
        @click="startCreateDept"
        class="w-full border-2 border-primaryDark rounded text-primary p-3 mb-1 hover:cursor-pointer"
      >
        <span class="px-1 w-6 text-primaryDark">
          <i class="fa-solid fa-plus"></i>
        </span>
      </div>
      <!-- 新增(isCreating) -->
      <div
        v-else
        class="w-full border-2 border-primaryDark rounded"
        @keyup.enter="confirmCreateDept"
        @keyup.esc="cancelCreateDept"
      >
        <div class="flex p-1 justify-between">
          <p class="font-bold">
            <span class="mr-2">新增部門單位</span>
            <span class="text-cancel"
              >（注意！在現有部門下新增單位將立即登出該部門內所有使用者，請謹慎使用）</span
            >
          </p>
          <div>
            <button
              v-if="newUnitId.trim() && newUnitName.trim()"
              @mousedown="confirmCreateDept"
              class="h-8 mr-2 px-2 rounded bg-secondaryLight font-semibold"
            >
              確認新增
            </button>
            <button
              class="w-8 h-8 bg-cancel rounded"
              @click="unitIsCreating = !unitIsCreating"
            >
              <span class="text-white">
                <i class="fa-solid fa-xmark"></i>
              </span>
            </button>
          </div>
        </div>
        <div class="md:flex justify-center bg-primaryLight rounded-b">
          <div class="p-2">
            <span>單位代碼：</span>
            <input
              onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
              onchange="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
              class="rounded w-full p-2"
              placeholder="請輸入代碼"
              v-model="newUnitId"
            />
          </div>
          <div class="p-2">
            <span>部門名稱：</span>
            <input
              class="rounded w-full p-2"
              placeholder="請輸入名稱"
              v-model="newDeptName"
            />
          </div>
          <div class="p-2">
            <span>單位名稱：</span>
            <input
              class="rounded w-full p-2"
              placeholder="請輸入名稱"
              v-model="newUnitName"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Store } from "../../store/store";
import {
  SelectDept,
  createDept,
  updateDept,
  deleteDept,
} from "../../api/service";

const units = ref([]);
const getUnits = async () => {
  await SelectDept();
  units.value = Store().postOption.Unit;
};
getUnits();
const unitRender = computed(() => {
  return units.value;
});

// create unit
const newUnitId = ref(""),
  newDeptName = ref(""),
  newUnitName = ref("");
const unitIsCreating = ref(false);

const startCreateDept = () => {
  newUnitId.value = "";
  newDeptName.value = "";
  newUnitName.value = "";
  units.value.map((x) => (x.isEditing = false));
  unitIsCreating.value = true;
};
const cancelCreateDept = () => {
  newUnitId.value = "";
  newDeptName.value = "";
  newUnitName.value = "";
  unitIsCreating.value = false;
};
const confirmCreateDept = async () => {
  try {
    if (
      newUnitId.value.trim() == "" ||
      newDeptName.value.trim() == "" ||
      newUnitName.value.trim() == ""
    ) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "請確認填寫所有資訊！",
        func: (e) => {},
      };
      return;
    }
    if (
      units.value.some((x) => x.code == newUnitId.value.trim()) ||
      units.value.some((x) => x.unit == newUnitName.value.trim())
    ) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "單位代碼或名稱已存在，請重新填寫！",
        func: (e) => {},
      };
      return;
    }
    let code = newUnitId.value,
      name = newDeptName.value,
      unit = newUnitName.value;
    const res = await createDept({ code, name, unit });
    if (res.desc == "successful") {
      units.value.push({
        code: newUnitId.value,
        name: newDeptName.value,
        unit: newUnitName.value,
      });
      sessionStorage.removeItem("deptList");
      cancelCreateDept();
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "新增部門單位失敗",
        func: (e) => {},
      };
    }
  } catch (error) {
    console.error(error.message);
    cancelCreateDept();
  }
};

// edit unit
const unitIsEditing = ref([]);
const starEditDept = (i) => {
  unitIsCreating.value = false;
  units.value.map((x) => (x.isEditing = false));
  i.isEditing = true;
  newUnitId.value = i.code;
  newDeptName.value = i.name;
  newUnitName.value = i.unit;
};
const cancelEditDept = (i) => {
  i.isEditing = false;
};
const confirmEditDept = async (i) => {
  try {
    if (
      newUnitId.value.trim() == "" ||
      newDeptName.value.trim() == "" ||
      newUnitName.value.trim() == ""
    ) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "請確認填寫所有資訊！",
        func: (e) => {},
      };
      return;
    }
    if (
      units.value.some((x) => x.code == newUnitId.value.trim()) &&
      i.code !== newUnitId.value.trim()
    ) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "單位代碼已存在，請重新填寫！",
        func: (e) => {},
      };
      return;
    }
    if (
      units.value.some((x) => x.unit == newUnitName.value.trim()) &&
      i.unit !== newUnitName.value.trim()
    ) {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "單位名稱已存在，請重新填寫！",
        func: (e) => {},
      };
      return;
    }

    let origin = i.code,
      code = newUnitId.value,
      name = newDeptName.value,
      unit = newUnitName.value,
      memo = "memo";
    const res = await updateDept({ origin, code, name, unit, memo });
    if (res.desc == "successful") {
      sessionStorage.removeItem("deptList");
      i.code = newUnitId.value;
      i.name = newDeptName.value;
      i.unit = newUnitName.value;
      cancelEditDept(i);
    } else {
      Store().alertShow = true;
      Store().alertObj = {
        msg: "編輯部門單位失敗",
        func: (e) => {},
      };
    }
  } catch (error) {
    console.error(error.message);
    cancelEditDept(i);
  }
};

// delete unit
const deleteUnit = ([code, name, unit]) => {
  Store().alertShow = true;
  Store().alertObj = {
    msg: `確定要刪除「${name} ${unit}」嗎？`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        try {
          const res = await deleteDept({ code });
          if (res.desc == "successful") {
            units.value = units.value.filter((i) => i.code !== code);
            sessionStorage.removeItem("deptList");
          } else {
            Store().alertShow = true;
            Store().alertObj = {
              msg: "刪除部門單位失敗",
              func: (e) => {},
            };
          }
        } catch (error) {
          console.error(error.message);
        }
      }
    },
  };
};
</script>
