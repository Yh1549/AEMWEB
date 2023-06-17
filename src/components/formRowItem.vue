<template>
  <div
    class="flex-initial h-24"
    :class="props.width == undefined ? 'w-72' : props.width"
  >
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps(["width"]);
// console.log(props.width);
</script>
