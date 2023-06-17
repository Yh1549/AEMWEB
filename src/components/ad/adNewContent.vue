<template>
  <span class="block font-bold">標題 :</span>
  <label class="w-full inpLabel">
    <input
      type="text"
      class="inp w-full"
      :class="
        getInputValidation(adStore.newAdCheckList.title).result
          ? 'border-primary'
          : 'border-cancel'
      "
      name="title"
      data-valid-option="notNull,charMax(64)"
      v-model="adStore.newAd.title"
      @keyup="InputValidation(adStore.newAdCheckList, $event)"
    />
  </label>
  <span
    v-if="!getInputValidation(adStore.newAdCheckList.title).result"
    class="text-cancel font-bold"
    ><i class="fa-solid fa-circle-exclamation mx-2"></i
    >{{ getInputValidation(adStore.newAdCheckList.title).msg }}
  </span>
  <span class="block font-bold">內文 :</span>
  <tiptap
    class="tiptapStyle"
    v-model="adStore.newAd.content"
    @keyup="
      InputValidationContent(
        adStore.newAd.content,
        adStore.newAdCheckList,
        'content',
        'notNull'
      )
    "
  />
  <span
    v-if="!getInputValidation(adStore.newAdCheckList.content).result"
    class="text-cancel font-bold"
    ><i class="fa-solid fa-circle-exclamation mx-2"></i
    >{{ getInputValidation(adStore.newAdCheckList.content).msg }}
  </span>
</template>
<script setup>
import {
  InputValidation,
  InputValidationContent,
  getInputValidation,
} from "../../formValidation/inputCase";
import { useAdStore } from "../../store/store";
import Tiptap from "../Tiptap/Tiptap.vue";
const adStore = useAdStore();
</script>
