<template>
  <div class="p-2">
    <span class="block text-lg font-bold flex-row"
      ><div class="bg-primary w-3 h-3 rounded-full inline-block mr-1"></div>
      {{ props.caseDetail.title }}
    </span>
    <p
      v-html="props.caseDetail.content"
      class="tiptapStyle bg-white shadow-lg rounded p-2 border border-primaryDark break-words"
    ></p>
  </div>
</template>
<script setup>
const props = defineProps(["caseDetail"]);
</script>
