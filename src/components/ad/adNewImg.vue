<template>
  <div
    class="p-4 border-2 border-primaryDark bg-white shadow-md rounded flex flex-col justify-center md:h-full"
  >
    <img
      v-if="adStore().newAd.photo != null"
      :src="`data:image;base64,${adStore().newAd.photo}`"
      alt="preview"
      class="mx-auto md:max-h-60"
    />
    <label class="w-full hidden">
      <input
        type="file"
        accept="image/*"
        @change="adImgUpload($event)"
        ref="fileTnput"
      />
    </label>
    <div class="w-full flex justify-center mt-2">
      <!-- <span class="block font-bold text-center">圖片預覽</span> -->
      <button class="btn btnClick" @click="$refs.fileTnput.click()">
        上傳圖片
      </button>
    </div>
    <span class="text-center">圖片檔案大小限制為1MB</span>
  </div>
</template>
<script setup>
import { adStore, Store } from "../../store/store";

const adReader = (file) => {
  let Reader = new FileReader();
  Reader.onload = (e) => {
    let img = e.target.result;
    let type = img.split(",")[0].split(";")[0].split(":")[1].split("/")[0];
    if (type === "image") {
      adStore().newAd.photo = img.split(",")[1];
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
</script>
