<template>
  <div
    class="flex justify-center items-center"
    :class="
      Store().currentNewStep == props.stepValue[0] ? ' ' : 'hidden md:flex'
    "
  >
    <span
      class="text-center font-bold text-2xl"
      :class="
        Store().currentNewStep == props.stepValue[0]
          ? 'text-secondary'
          : 'text-primaryDark'
      "
    >
      <span class="font-bold">{{ props.stepValue[1] }}.</span>
      <slot name="title"></slot>
    </span>
  </div>
</template>
<script setup>
import { Store, userStore } from "../store/store";
const props = defineProps(["stepValue"]);
</script>
