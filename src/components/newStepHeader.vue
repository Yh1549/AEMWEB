<template>
  <div
    class="flex justify-center items-center"
    :class="
      props.currentStep == props.stepValue[0].name ? ' ' : 'hidden md:flex'
    "
  >
    <span
      class="text-center font-bold text-2xl"
      :class="
        props.currentStep == props.stepValue[0].name
          ? 'text-secondary'
          : 'text-primaryDark'
      "
    >
      <span class="font-bold">{{ props.stepValue[1] }}.</span>
      {{ props.stepValue[0].title }}
    </span>
  </div>
</template>
<script setup>
import { useStore } from "../store/store";
const Store = useStore();

const props = defineProps(["stepValue", "currentStep"]);
</script>
