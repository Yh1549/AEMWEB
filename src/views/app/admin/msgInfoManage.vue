<template>
  <div class="flex justify-between">
    <label class="bg-white rounded border-2 border-primaryDark flex my-2 p-2">
      <span class="pointer-events-none">
        <i class="fa-solid fa-magnifying-glass"></i>
      </span>
      <input
        type="text"
        id="keyword"
        class="inp px-1"
        v-model="keyword"
        placeholder="請輸入關鍵字"
        @keyup="handleSearch"
      />
    </label>
    <button
      class="btn btnClick bg-submit m-2 text-base"
      @click="(msgInfoCard = true), (cardMsg = true)"
      v-if="Store.getSvcAuth('CreateMsgInfo')"
    >
      新增訊息
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
  <hr class="my-2" />
  <div class="my-7">
    <div class="overflow-x-auto scrollbar">
      <table class="w-full whitespace-nowrap">
        <thead class="text-left">
          <tr class="bg-primaryLight">
            <th class="w-8">#</th>
            <th>代碼</th>
            <th>標題</th>
            <th>內文</th>
            <th>備註</th>
            <th class="w-16">類型</th>
            <th class="w-28"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="
              Store.msgInfoList == '' || !Store.getSvcAuth('FindAllMsgInfo')
            "
            class="bg-primaryDark/20"
          >
            <td colspan="8" class="md:text-center">
              <span class="px-[20vw]">--- 目前尚無資料 ---</span>
            </td>
          </tr>
          <tr
            v-for="(i, index) of Store.msgInfoList"
            :key="index"
            class="hover:bg-secondaryLight/50"
            v-else
          >
            <td>
              {{ index + 1 }}
            </td>
            <td>{{ i.id }}</td>
            <td>{{ textEllipsis(i.title, 20) }}</td>
            <td>
              {{ textEllipsis(i.content, 30) }}
            </td>
            <td>{{ textEllipsis(i.memo, 10) }}</td>
            <td>{{ i.type }}</td>
            <td class="flex gap-x-2">
              <div class="menu">
                <button
                  class="text-primaryDark"
                  @click="findMsgInfo(i.id)"
                  v-if="Store.getSvcAuth('FindOneMsgInfo')"
                >
                  <div class="px-0.5"><i class="fa-solid fa-pen"></i></div>
                </button>
              </div>
              <div class="menu">
                <button
                  class="text-cancel"
                  @click="delMsgInFo(i.id)"
                  v-if="Store.getSvcAuth('DeleteMsgInfo')"
                >
                  <div class="px-[3px]">
                    <i class="fa-solid fa-trash"></i>
                  </div>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    v-if="msgInfoCard"
    class="fixed z-50 left-0 top-0 w-full h-full bg-black/[.40] grid place-items-center"
  >
    <div
      class="absolute rounded-md border bg-background shadow-lg w-[90%] md:w-[50%] rounded z-50 overflow-y-auto scrollbar inset-y-5 lg:inset-y-8 p-3"
    >
      <div class="flex justify-end fill-slate-400 mr-3">
        <button @click="closeCard">
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
      <div class="items-center text-center">
        <div class="font-bold text-2xl mb-3">
          {{ cardMsg ? "新增" : "修改" }}訊息
        </div>
      </div>
      <div class="px-5">
        <div class="my-2">
          <div class="text-sm">代碼<span class="text-cancel">※</span></div>
          <label class="inpLabel w-full" v-if="cardMsg">
            <input
              type="text"
              name="jobData"
              class="inp w-full"
              v-model="data.id"
            />
          </label>
          <div class="mx-2" v-else>{{ data.id }}</div>
        </div>
        <div class="my-2">
          <div class="text-sm">標題<span class="text-cancel">※</span></div>
          <label class="inpLabel w-full">
            <input
              type="text"
              name="jobData"
              class="inp w-full"
              v-model="data.title"
            />
          </label>
        </div>
        <div class="my-2">
          <div class="text-sm">內文<span class="text-cancel">※</span></div>
          <textarea
            class="inpLabel outline-none w-full min-h-[250px] resize-none scrollbar"
            v-model="data.content"
          ></textarea>
        </div>
        <div class="my-2">
          <div class="text-sm">備註</div>
          <label class="inpLabel w-full">
            <input
              type="text"
              name="jobData"
              class="inp w-full"
              v-model="data.memo"
            />
          </label>
        </div>
        <div class="my-2 flex flex-col">
          <div class="text-sm">類型<span class="text-cancel">※</span></div>
          <label
            ><input
              type="radio"
              value="MAIL"
              class="m-2"
              v-model="data.type"
              checked
            />MAIL</label
          >
        </div>
        <button
          id="ok-btn"
          class="btn btnClick w-full my-3"
          @click="submitInfo(cardMsg)"
          v-if="cardMsg || Store.getSvcAuth('UpdateMsgInfo')"
        >
          {{ cardMsg ? "新增" : "修改" }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import apiRequest from "../../../api/apiRequest";
import router from "../../../router/router";
import { useCommonStore } from "../../../store/commonStore";
import { useStore } from "../../../store/store";
const commonStore = useCommonStore();
const Store = useStore();
const msgInfoCard = ref(false);
const allInfoList = Store.msgInfoList;
const keyword = ref(undefined);
const data = reactive({
  id: "",
  title: "",
  content: "",
  memo: "",
  type: "MAIL",
});
const cardMsg = ref(true);
const textEllipsis = (text, long) => {
  if (text.length > long) {
    return text.slice(0, long) + "...";
  } else {
    return text;
  }
};
const submitInfo = (msg) => {
  Store.alertShow = true;
  if (msg) {
    Store.alertObj = {
      msg: "確定新增？",
      func: async (e) => {
        if (e.target.value === "confirm") {
          const res = await apiRequest.post("CreateMsgInfo", data);
          if (res.desc == "successful") {
            router.push({
              name: "SvcSucess",
            });
          } else {
            commonStore.SvcFail.msg = res.desc;
            router.push({
              name: "SvcFail",
            });
          }
        }
      },
    };
  } else {
    Store.alertObj = {
      msg: "確定修改？",
      func: async (e) => {
        if (e.target.value === "confirm") {
          const res = await apiRequest.post("UpdateMsgInfo", data);
          if (res.desc == "successful") {
            router.push({
              name: "SvcSucess",
            });
          } else {
            commonStore.SvcFail.msg = res.desc;
            router.push({
              name: "SvcFail",
            });
          }
        }
      },
    };
  }
};
const findMsgInfo = (id) => {
  cardMsg.value = false;
  apiRequest.post("FindOneMsgInfo", { id }).then((res) => {
    data.id = res.resBody.id;
    data.title = res.resBody.title;
    data.content = res.resBody.content;
    data.memo = res.resBody.memo;
    data.type = res.resBody.type;
    msgInfoCard.value = true;
  });
};
const delMsgInFo = (id) => {
  Store.alertShow = true;
  Store.alertObj = {
    msg: `您確定要刪除「${id}」嗎?`,
    func: async (e) => {
      if (e.target.value === "confirm") {
        const res = await apiRequest.post("DeleteMsgInfo", { id });
        if (res.desc == "successful") {
          router.push({
            name: "SvcSucess",
          });
        } else {
          commonStore.SvcFail.msg = res.desc;
          router.push({
            name: "SvcFail",
          });
        }
      }
    },
  };
};
const closeCard = () => {
  msgInfoCard.value = false;
  Object.keys(data).forEach((key) => {
    data[key] = "";
  });
};
const handleSearch = () => {
  let result = allInfoList;
  if (keyword.value) {
    result = result.filter((i) =>
      [i.id, i.title, i.content, i.memo, i.type].some((text) =>
        text.includes(keyword.value)
      )
    );
    Store.msgInfoList = result;
  } else {
    Store.msgInfoList = allInfoList;
  }
};
</script>
<style scoped>
button {
  @apply h-6 px-2 rounded border-primaryDark border drop-shadow;
}
.menu {
  @apply relative;
}
.menu > span {
  @apply absolute w-28 text-center font-bold -top-[130%] -left-[105%] opacity-0 lg:inline-block py-1 z-20 text-sm transition-all pointer-events-none bg-primaryDark rounded text-white  hidden;
}
.menu:hover span {
  opacity: 1;
}
button > i {
  @apply m-1;
}
table {
  @apply border border-primaryDark/30;
}
th {
  @apply border-r border-primaryDark/30 px-1;
}
td {
  @apply border-r border-primaryLight/30 p-1;
}
</style>
