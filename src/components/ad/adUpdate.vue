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
          v-model="adStore().updateModify.title"
          @keyup="InputValidation(adStore().updateModifyValid, $event)"
        />
      </label>
      <span
        class="text-cancel font-bold transition-all duration-200"
        :class="
          !getInputValidation(adStore().updateModifyValid.title).result
            ? 'opacity-100'
            : 'opacity-0'
        "
        ><i class="fa-solid fa-circle-exclamation mr-2"></i
        >{{ getInputValidation(adStore().updateModifyValid.title).msg }}</span
      >
    </div>
    <div class="p-2 w-3/4 mx-auto flex gap-2">
      <div class="w-1/2">
        <span class="font-bold"
          >日期:{{
            Store().dateReform(
              Store().timeReform(Store().detailinfo.startDate)[0]
            )
          }}~{{
            Store().dateReform(
              Store().timeReform(Store().detailinfo.endDate)[0]
            )
          }}</span
        >
        <div class="">
          <label class="inpLabel w-full flex">
            <span class="w-12">上線:</span>
            <input
              type="date"
              class="inp w-full"
              :min="Store().getToday()"
              :max="adStore().updateModify.endDate"
              name="startDate"
              data-valid-option="notNull"
              v-model="adStore().updateModify.startDate"
              @change="InputValidation(adStore().updateModifyValid, $event)"
            />
          </label>
          <div class="flex my-2 gap-2">
            <button
              class="btn"
              :class="permanentToggle ? 'bg-submit' : 'bg-cancel'"
              @click="permanentToggle = !permanentToggle"
            >
              永久上線{{ permanentToggle ? "開啟" : "關閉" }}
            </button>
            <label class="inpLabel w-full flex">
              <span class="w-12">下線:</span>
              <input
                type="date"
                class="inp w-full"
                :disabled="permanentToggle"
                :min="adStore().updateModify.startDate"
                v-model="adStore().updateModify.endDate"
              />
            </label>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <span class="font-bold block">區塊 :</span>
        <label class="inpLabel w-full">
          <select class="w-full inp" v-model="adStore().updateModify.block">
            <option
              v-for="item in adStore().adBlockList"
              :key="item.block"
              :value="item.block"
            >
              {{ item.memo }}
            </option>
          </select>
        </label>
      </div>
    </div>
    <div class="p-2 w-3/4 mx-auto">
      <span class="font-bold">超連結 :</span>
      <label class="inpLabel w-full">
        <input
          type="text"
          class="w-full inp"
          :placeholder="Store().detailinfo.link"
          v-model="adStore().updateModify.link"
        />
      </label>
    </div>
    <div class="p-2 w-3/4 mx-auto flex justify-center">
      <div class="w-full flex flex-col justify-center items-center">
        <button class="btn" @click="$refs.photo.click()">上傳圖片</button>
        <div class="overflow-scroll flex justify-center mt-2">
          <img
            class="w-full"
            :src="`data:image;base64,${adStore().updateModify.photo}`"
          />
        </div>
        <label class="w-full hidden">
          <input
            type="file"
            accept="image/*"
            data-valid-option="notNull"
            data-store-name="adStore"
            @change="adImgUpload($event)"
            ref="photo"
          />
        </label>
      </div>
    </div>
    <div class="w-3/4 mx-auto p-2 my-4">
      <Tiptap
        v-model="adStore().updateModify.content"
        @keyup="
          InputValidationContent(
            adStore().updateModify.content,
            adStore().updateModifyValid,
            'content',
            'notNull'
          )
        "
      ></Tiptap>
    </div>
  </div>
  <div class="flex justify-center">
    <button class="btn bg-submit" @click="updateAd">儲存</button>
  </div>
</template>
<script setup>
import { Store, adStore } from "../../store/store";
import {
  InputValidation,
  InputValidationContent,
  getInputValidation,
} from "../../formValidation/inputCase";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import apiRequest from "../../api/apiRequest";
import Tiptap from "../Tiptap/Tiptap.vue";
const route = useRoute();

const permanentToggle = ref(false);

const adReader = (file) => {
  let Reader = new FileReader();
  Reader.onload = (e) => {
    let img = e.target.result;
    let type = img.split(",")[0].split(";")[0].split(":")[1].split("/")[0];
    if (type === "image") {
      adStore().updateModify.photo = img.split(",")[1];
    } else {
      adStore().checkList.photo = null;
      Store().alertShow = true;
      Store().alertObj = {
        msg: "請上傳圖片!!",
        func: () => {},
      };
    }
  };
  Reader.readAsDataURL(file);
};
const adImgUpload = (e) => {
  if (e.target.files[0].size > 1000000) {
    Store().alertShow = true;
    Store().alertObj = {
      msg: "檔案太大，請上傳小於1MB的圖片",
      func: () => {},
    };
  } else {
    adReader(e.target.files[0]);
  }
};

const validCheck = () => {
  for (let item in adStore().updateModifyValid) {
    if (adStore().updateModifyValid[item] != null) {
      for (let i of adStore().updateModifyValid[item]) {
        if (i.result == false) {
          return false;
        }
      }
    } else {
      return true;
    }
  }
};
const updateAd = (event) => {
  let check = validCheck();
  if (!check) {
    Store().alertShow = true;
    Store().alertObj = {
      msg: "輸入有誤，請重新檢查",
      func: (e) => {},
    };
    return;
  }
  Store().alertShow = true;
  for (let item in adStore().updateModify) {
    if (
      adStore().updateModify[item] == "" ||
      adStore().updateModify[item] == null
    ) {
      Store().alertObj = {
        msg: "瑱寫錯誤，欄位不得為空",
        func: (e) => {},
      };
    } else {
      Store().alertObj = {
        msg: "確定修改?",
        func: (e) => {
          if (e.target.value == "confirm") {
            Store().loadingSpinner = true;
            apiRequest
              .post("UpdateAdvertise", adStore().updateModify)
              .then(async (res) => {
                if (res.desc === "successful") {
                  await apiRequest
                    .post("FindOneAd", { uuid: route.params.uuid })
                    .then(async (res) => {
                      Store().loadingSpinner = false;
                      if (res.desc == "successful") {
                        Store().alertShow = true;
                        Store().alertObj = {
                          msg: "變更成功",
                          func: () => {},
                        };
                        Store().detailinfo = res.resBody;
                        Store().detailUpdateToggle = false;
                      } else {
                        router.push({
                          name: "404error",
                        });
                      }
                    });
                } else {
                  Store().loadingSpinner = false;
                  Store().alertShow = true;
                  Store().alertObj = {
                    msg: "變更失敗",
                    func: () => {},
                  };
                }
              });
          }
        },
      };
    }
  }
};
onBeforeMount(async () => {
  adStore().updateModify.uuid = Store().detailinfo.uuid;
  adStore().updateModify.title = Store().detailinfo.title;
  adStore().updateModify.content = Store().detailinfo.content;
  adStore().updateModify.photo = Store().detailinfo.photo;
  adStore().updateModify.block = Store().detailinfo.block;
  adStore().updateModify.startDate = Store().detailinfo.startDate;
  adStore().updateModify.endDate = Store().detailinfo.endDate;
  if (Store().detailinfo.endDate == "2099-01-01") {
    permanentToggle.value = true;
  }
  await apiRequest
    .post("FindSystemBlock", { system: Store().detailinfo.system })
    .then((res) => {
      if (res.desc == "successful") {
        adStore().adBlockList = res.resBody.blockModelList;
      }
    })
    .catch();
});
</script>
