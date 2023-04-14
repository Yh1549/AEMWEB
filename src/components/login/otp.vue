<template>
  <div class="flex justify-between items-center">
    <span class="block text-sm text-gray-600 md:text-base">驗證碼 : </span>
    <slot name="resend"></slot>
  </div>
  <label class="flex flex-col p-1">
    <div class="flex rounded border-2 border-primaryDark">
      <span class="border-2 m-1 w-fit border-black font-bold bg-white">{{
        props.otpObject.prefix
      }}</span>
      <slot name="optInp"></slot>
    </div>
  </label>
  <span class="text-sm fint-bold text-gray-600">
    驗證時效倒數{{ props.otpObject.validtime }}秒
  </span>
  <span class="text-sm font-bold text-gray-600"
    >已發送驗證碼至 :
    <span class="font-bold block underline">{{
      props.otpObject.email
    }}</span></span
  >
</template>
<script setup>
const props = defineProps(["otpObject"]);
</script>
