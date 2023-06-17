<template>
  <table class="w-full">
    <thead>
      <tr class="border-b-2 border-black ListTr">
        <slot name="th"></slot>
      </tr>
    </thead>
    <tbody class="ListTd">
      <slot name="td"></slot>
    </tbody>
  </table>
</template>
<script setup></script>
<style>
.ListTr th {
  text-align: start;
}
.ListTr th,
.ListTd td {
  padding: 0.5rem;
}

.ListTd tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
