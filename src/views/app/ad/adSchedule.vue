<template>
  <div class="md:flex w-full justify-center">
    <div class="w-full md:w-4/16 p-2">
      <systemSelect :options="Store().postOption.System">
        <template #title>請先選擇一個系統</template>
      </systemSelect>
    </div>
    <div class="w-full md:w-4/16 p-2">
      <sysBlockSelec
        :options="adStore().adBlockList"
        :blockAdSvc="'blockSortAd'"
      >
        <template #title>再選擇一個區塊</template>
      </sysBlockSelec>
    </div>
  </div>
  <div class="mx-auto w-full flex justify-center items-center">
    <input
      id="toggleSwicthInput"
      class="hidden"
      type="checkbox"
      v-model="toggleUpdate"
    />
    <label for="toggleSwicthInput" class="toggleSwicth"></label>
    <span class="font-bold">{{ toggleUpdate ? "排序開啟" : "排序關閉" }}</span>
  </div>
  <span class="opacity-70 block text-center text-sm"
    >*拖曳廣告以調整順序，最上層為最優先顯示，目前拖曳尚未支持手機版</span
  >

  <div
    ref="container"
    class="bg-white min-h-fit select-none border-2 border-primaryDark rounded relative overflow-hidden"
  >
    <p v-if="AdList.length == 0" class="text-center w-full h-20 font-bold">
      目前尚無資料
    </p>
    <loadSpinner>
      <template #title>載入中</template>
    </loadSpinner>

    <div v-for="(item, index) in getAdlist" class="" :key="item">
      <div
        :data-arrange="index + 1"
        :ref="
          (e) => {
            if (arrangeZone.length < AdList.length) {
              arrangeZone.push(e);
            }
          }
        "
        class="drop w-full flex p-2 md:p-4 justify-center items-center border-4 md:border-8 border-transparent"
      >
        <div
          :ref="
            (e) => {
              if (AdListItem.length < AdList.length) {
                AdListItem.push(e);
              }
            }
          "
          :draggable="toggleUpdate"
          class="w-full md:w-3/4 md:h-40 cursor-grab border-4 group rounded border-primary shadow-lg md:flex p-2 hover:border-dashed"
          :data-position="item.uuid"
        >
          <div class="w-full flex">
            <div class="w-1/4 overflow-scroll scrollbar">
              <img
                v-if="item.photo"
                class="pointer-events-none w-full"
                :src="`data:img;base64,${item.photo}`"
              />
              <span v-else> 無圖片</span>
            </div>
            <div class="flex w-full p-2">
              <div class="w-full flex flex-col gap-4 self-center ml-2">
                <div class="flex items-center">
                  <span
                    class="text-sm md:text-base rounded flex items-center"
                    :class="
                      item.status == 'unAdvertise'
                        ? 'text-gray-500'
                        : 'text-submit'
                    "
                    ><div
                      class="w-[5px] h-[5px] m-1 rounded-full"
                      :class="
                        item.status == 'unAdvertise'
                          ? 'bg-gray-500'
                          : 'bg-submit'
                      "
                    ></div>
                    {{
                      item.status == "unAdvertise" ? "未發布" : "公佈中"
                    }}</span
                  >
                  <span
                    class="font-bold bg-primaryDark text-white rounded text-sm md:text-base mx-1 p-1"
                    >排序{{ item.sort }}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="font-bold">{{ item.title }} </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm md:text-base opacity-70">
                    {{ Store().dateReform(item.startDate, ".") }}~{{
                      Store().dateReform(item.endDate)
                    }}
                  </span>
                </div>
              </div>
              <div class="gap-4 flex flex-col justify-between text-center">
                <button
                  :disabled="!toggleUpdate"
                  class="bg-secondary rounded-full w-5 h-5 md:w-10 md:h-10 mx-auto hover:bg-secondaryDark hover:scale-110 transition-all duration-200 cursor-pointer active:animate-ping md:text-lg"
                  :class="[!toggleUpdate ? 'bg-gray-400 opacity-70' : '']"
                  :value="item.uuid"
                  @click="upSort"
                >
                  <i class="fa-solid fa-arrow-up pointer-events-none"></i>
                </button>
                <button
                  :disabled="!toggleUpdate"
                  class="bg-secondary rounded-full w-5 h-5 md:w-10 md:h-10 mx-auto hover:bg-secondaryDark hover:scale-110 transition-all duration-200 cursor-pointer active:animate-ping md:text-lg"
                  :class="[!toggleUpdate ? 'bg-gray-400 opacity-70' : '']"
                  :value="item.uuid"
                  @click="downSort"
                >
                  <i class="fa-solid fa-arrow-down pointer-events-none"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref="fake"
        class="z-50 hidden absolute pointer-events-none w-3/4 cursor-grab border-8 border-dashed rounded border-primary shadow-lg p-2"
      >
        <div class="w-full md:flex">
          <div class="w-1/2 md:w-4/16 self-center mx-auto">
            <img
              class="pointer-events-none w-full"
              :src="`data:img;base64,${item.photo}`"
            />
          </div>
          <div class="w-full self-center ml-2">
            <div class="flex justify-between items-center">
              <span
                class="text-sm md:text-base rounded flex items-center"
                :class="
                  item.status == 'offline' ? 'text-gray-500' : 'text-submit'
                "
                ><div
                  class="w-[5px] h-[5px] m-1 rounded-full"
                  :class="
                    item.status == 'offline' ? 'bg-gray-500' : 'bg-submit'
                  "
                ></div>
                {{ item.status == "offline" ? "已結束" : "公佈中" }}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="font-bold">{{ item.title }} </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm md:text-base opacity-70">
                {{ Store().dateReform(item.startDate) }}~{{
                  Store().dateReform(item.endDate)
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="toggleUpdate" class="flex justify-center">
    <button
      class="btn btnClick my-2"
      :disabled="AdList.length == 0"
      @click="updateSort"
    >
      儲存變更
    </button>
  </div>
  <!-- <div ref="test" class="w-40 h-40 bg-primaryDark"></div> -->
</template>
<script setup>
import {
  ref,
  watchEffect,
  computed,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { adStore, Store } from "../../../store/store";
import apiRequest from "../../../api/apiRequest";
// import {
//   InputValidation,
//   getInputValidation,
// } from "../../../formValidation/inputCase";
import { useRouter } from "vue-router";
import { findSysList } from "../../../api/service";
import loadSpinner from "../../../components/loadSpinner.vue";
import systemSelect from "../../../components/systemSelect.vue";
import sysBlockSelec from "../../../components/sysBlockSelec.vue";
const AdListItem = ref([]);
const arrangeZone = ref([]);
const fake = ref(null);
const AdList = ref([]);
const container = ref(null);
const toggleUpdate = ref(false);
const router = useRouter();
let currentDrag;
let currentZone;
// 資料重新排列
const reArrange = (array) => {
  for (let i = 0; i < array.length; i++) {
    for (let y = i + 1; y < array.length; y++) {
      if (array[i].sort > array[y].sort) {
        let tempSort = array[i];
        array[i] = array[y];
        array[y] = tempSort;
      }
    }
  }
  return array;
};

const getAdlist = computed(() => {
  AdList.value = reArrange(adStore().List);
  return AdList.value;
});

const upSort = (e) => {
  let targetSort;
  for (let item of AdList.value) {
    if (e.target.value == item.uuid) {
      targetSort = item.sort;
    }
  }
  for (let item of AdList.value) {
    if (e.target.value == item.uuid) {
      if (item.sort != 1) {
        item.sort--;
      }
    } else if (item.sort == parseInt(targetSort) - 1) {
      item.sort++;
    }
  }
  AdList.value = reArrange(AdList.value);
};
const downSort = (e) => {
  let targetSort;
  for (let item of AdList.value) {
    if (e.target.value == item.uuid) {
      targetSort = item.sort;
    }
  }
  for (let item of AdList.value) {
    if (e.target.value == item.uuid && item.sort != AdList.value.length) {
      item.sort++;
    } else if (item.sort == parseInt(targetSort) + 1) {
      item.sort--;
    }
  }
  AdList.value = reArrange(AdList.value);
};
const updateSort = () => {
  Store().loadingSpinner = true;
  Store().alertShow = true;
  Store().alertObj = {
    msg: "確定要更動排序?",
    func: async (e) => {
      if (e.target.value === "confirm") {
        let adModelInfo = [];
        for (let item in AdList.value) {
          adModelInfo.push({
            uuid: AdList.value[item].uuid,
            sort: Number(AdList.value[item].sort),
          });
        }
        apiRequest.post("UpdateBlockAd", { adModelInfo }).then((res) => {
          Store().loadingSpinner = false;
          if ((res.desc = "successful")) {
            router.push({ name: "SvcSucess" });
          } else {
            router.push({ name: "SvcFail" });
          }
        });
      } else {
      }
    },
  };
};

watchEffect(() => {
  for (let i = 0; i < AdListItem.value.length; i++) {
    let targetPageXY = [];
    AdListItem.value[i]?.addEventListener(
      "drag",
      (e) => {
        fake.value[i].style.left = e.pageX - targetPageXY[0] + "px";
        fake.value[i].style.top = e.pageY - targetPageXY[1] + "px";
      },
      false
    );
    AdListItem.value[i]?.addEventListener(
      "dragstart",
      (e) => {
        targetPageXY = [
          e.pageX - e.target.offsetLeft,
          e.pageY - e.target.offsetTop,
        ];
        currentDrag = e.target;
        currentZone = e.target.parentNode;
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        setTimeout(() => {
          e.target.classList.add("invisible");
          fake.value[i].classList.remove("hidden");
          fake.value[i].classList.add("flex");
        }, 1);
      },
      false
    );
    AdListItem.value[i]?.addEventListener(
      "dragend",
      (e) => {
        e.target.classList.remove("invisible");
        fake.value[i].classList.add("hidden");
        fake.value[i].classList.remove("flex");
      },
      false
    );
    arrangeZone.value[i]?.addEventListener(
      "dragenter",
      (e) => {
        e.target.childNodes[0].classList.add("pointer-events-none");
        e.target.classList.add("border-secondaryDark");
        e.target.classList.remove("border-transparent");
      },
      false
    );
    arrangeZone.value[i]?.addEventListener(
      "dragleave",
      (e) => {
        e.target.childNodes[0].classList.remove("pointer-events-none");
        e.target.classList.remove("border-secondaryDark");
        e.target.classList.add("border-transparent");
      },
      false
    );
    arrangeZone.value[i]?.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
      },
      false
    );
    arrangeZone.value[i]?.addEventListener(
      "drop",
      (e) => {
        e.preventDefault();
        if (e.target.classList.contains("drop")) {
          e.target.classList.remove("border-secondaryDark");
          e.target.classList.add("border-transparent");
          AdListItem.value[i].classList.remove("pointer-events-none");
          e.target.childNodes[0].classList.remove("pointer-events-none");
          // currentZone.appendChild(e.target.childNodes[0]);
          // currentZone.removeChild(currentDrag);
          // e.target.appendChild(currentDrag);
          for (let item of AdList.value) {
            if (item.uuid == currentDrag.getAttribute("data-position")) {
              item.sort = e.target.getAttribute("data-arrange");
              for (let y of AdList.value) {
                if (
                  y.uuid == e.target.childNodes[0].getAttribute("data-position")
                ) {
                  y.sort = currentZone.getAttribute("data-arrange");
                }
              }
            }
          }
          AdList.value = reArrange(AdList.value);
        }
      },
      false
    );
  }
});
onBeforeMount(async () => {
  await findSysList();
});
onBeforeUnmount(() => {
  adStore().List = [];
});
</script>
