<template>
  <table class="w-full">
    <thead>
      <tr class="border-b-2 border-black">
        <slot name="th"></slot>
      </tr>
    </thead>
    <tbody>
      <slot name="td"></slot>
    </tbody>
  </table>
</template>
<script setup></script>
<style>
th {
  text-align: start;
}
th,
td {
  padding: 0.5rem;
}

tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
