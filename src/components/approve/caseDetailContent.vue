<template>
  <div class="m-2 grid gap-2">
    <!-- <span
      class="block text-lg font-bold p-2 rounded border-2 border-primaryDark"
    >
      {{ postStore().postDetail.title }}
    </span> -->
    <span class="block text-lg font-bold"
      ><div
        class="text-white bg-primary w-3 h-3 rounded-full inline-block mr-1"
      ></div>
      {{ Store().approveDetail.title }}
    </span>
    <div
      v-html="Store().approveDetail.content"
      class="bg-white shadow-lg rounded p-2 border border-primaryDark"
    ></div>
  </div>
</template>
<script setup>
import { postStore, Store } from "../../store/store";
</script>
