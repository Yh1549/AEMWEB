<template>
  <button
    class="w-8 h-8 flex justify-center items-center my-1 mx-0.5 p-1 rounded"
    :class="{ 'text-white bg-black': isActive }"
    @click="buttonClick"
  >
    <span v-if="label" class="floatText">{{ label }}</span>
    <span v-if="iconClass" class="text-lg">
      <i :class="iconClass"></i>
    </span>
    <span v-else="text" class="text-lg font-bold">
      {{ text }}
      <img v-if="img" :src="img" />
    </span>
    <span v-if="textSm" class="text-sm font-bold">{{ textSm }} </span>
  </button>
</template>
<script setup>
const props = defineProps({
  isActive: { type: Boolean, default: false },
  buttonFunction: { type: Function, default: null },
  label: { type: String, default: "" },
  iconClass: { type: String, default: "" },
  text: { type: String, default: "" },
  img: { type: String, default: "" },
  textSm: { type: String, default: "" },
});
const buttonClick = () => {
  if (props.buttonFunction) {
    props.buttonFunction();
  }
};
</script>
