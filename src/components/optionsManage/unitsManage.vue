<template>
  <div class="w-full relative">
    <button
      v-if="Store.getSvcAuth('CreateDept')"
      class="btn absolute right-0"
      @click="startNew"
    >
      新增+
    </button>
    <listTable>
      <template #th>
        <th>單位代碼</th>
        <th>單位名稱</th>
        <th>部門名稱</th>
        <th>備註</th>
        <th>編輯選項</th>
      </template>
      <template #td>
        <tr v-for="item in unitList" :key="item">
          <td>{{ item.code }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.unit }}</td>
          <td>{{ item.memo }}</td>
          <td class="flex gap-2">
            <button
              v-if="Store.getSvcAuth('UpdateDept')"
              class="rounded w-8 h-8 bg-primaryDark"
              @click="startEdit(item)"
            >
              <i class="fa-solid fa-gear text-white"></i>
            </button>
            <button
              v-if="Store.getSvcAuth('DeleteDept')"
              class="rounded w-8 h-8 bg-cancel"
              :value="item.code"
              @click="deleteUnit($event)"
            >
              <i class="fa-solid fa-trash text-white pointer-events-none"></i>
            </button>
          </td>
        </tr>
      </template>
    </listTable>
    <dialog ref="editDialog" class="rounded w-1/2 bg-background scrollbar">
      <div class="my-2">
        <p>單位代碼：</p>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            :placeholder="dialogStatus == 'edit' ? unitUpdate.code : ''"
            v-model="unitUpdate.code"
          />
        </label>
      </div>
      <div class="my-2">
        <p>單位名稱：</p>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            :placeholder="dialogStatus == 'edit' ? unitUpdate.name : ''"
            v-model="unitUpdate.name"
          />
        </label>
      </div>
      <div class="my-2">
        <p>部門名稱：</p>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            :placeholder="dialogStatus == 'edit' ? unitUpdate.unit : ''"
            v-model="unitUpdate.unit"
          />
        </label>
      </div>
      <div class="my-2">
        <p>備註：</p>
        <label class="inpLabel w-full">
          <input
            class="inp w-full"
            :placeholder="dialogStatus == 'edit' ? unitUpdate.memo : ''"
            v-model="unitUpdate.memo"
          />
        </label>
      </div>
      <div class="flex justify-center gap-8">
        <button class="btn bg-cancel" @click="editDialog.close()">取消</button>
        <button class="btn bg-submit" @click="update">儲存</button>
      </div>
    </dialog>
    <dialog ref="alert" class="rounded w-1/2 bg-background scrollbar">
      <p class="test-2xl font-bold text-center my-10">{{ alertMsg }}</p>
      <div class="flex w-full justify-center my-2">
        <button class="btn bg-sumit" @click="alert.close()">確認</button>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import apiRequest from "../../api/apiRequest";
import { createDept, deleteDept, updateDept } from "../../api/service";
import { useStore } from "../../store/store";
import listTable from "../listTable.vue";

const Store = useStore();
const unitList = ref([]);
const dialogStatus = ref("");
const editDialog = ref(null);
const alert = ref(null);
const alertMsg = ref(null);
const currentCode = ref("");
const unitUpdate = ref({
  code: "",
  name: "",
  unit: "",
  memo: "",
});

const startEdit = (current) => {
  editDialog.value.showModal();
  dialogStatus.value = "edit";
  currentCode.value = current.code;
  unitUpdate.value.code = current.code;
  unitUpdate.value.name = current.name;
  unitUpdate.value.unit = current.unit;
  unitUpdate.value.memo = current.memo;
};

const editUnit = async () => {
  let origin = currentCode.value,
    code = unitUpdate.value.code,
    name = unitUpdate.value.name,
    unit = unitUpdate.value.unit,
    memo = unitUpdate.value.memo;
  const res = await updateDept({ origin, code, name, unit, memo });
  alert.value.showModal();
  editDialog.value.close();
  if (res.desc == "successful") {
    alertMsg.value = "修改成功";
    sessionStorage.removeItem("deptList");
  } else {
    alertMsg.value = "修改失敗";
  }
  selectDept();
};

const startNew = () => {
  editDialog.value.showModal();
  dialogStatus.value = "new";
};

const newUnit = async () => {
  const res = await createDept({
    code: unitUpdate.value.code,
    name: unitUpdate.value.name,
    unit: unitUpdate.value.unit,
  });
  alert.value.showModal();
  editDialog.value.close();
  if (res.desc == "successful") {
    alertMsg.value = "新增成功";
    sessionStorage.removeItem("deptList");
  } else {
    alertMsg.value = "新增失敗";
  }
  selectDept();
};
const update = () => {
  if (dialogStatus.value == "edit") {
    editUnit();
  } else if (dialogStatus.value == "new") {
    newUnit();
  }
};

// delete unit
const deleteUnit = async (e) => {
  let code = e.target.value;
  const res = await deleteDept({ code });
  alert.value.showModal();
  if (res.desc == "successful") {
    alertMsg.value = "刪除成功";
    sessionStorage.removeItem("deptList");
  } else {
    alertMsg.value = "刪除失敗";
  }
  selectDept();
};
const selectDept = async () => {
  if (sessionStorage.getItem("deptList")) {
    unitList.value = JSON.parse(sessionStorage.getItem("deptList"));
  } else {
    let res = await apiRequest.post("SelectDept", {});
    if (res.desc == "successful") {
      sessionStorage.setItem("deptList", JSON.stringify(res.resBody.deptList));
      unitList.value = res.resBody.deptList;
    }
  }
};
onBeforeMount(async () => {
  selectDept();
});
</script>
