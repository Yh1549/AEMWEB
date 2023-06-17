<template>
  <div class="items-center text-center">
    <div class="font-bold text-2xl mb-3">查看JOB歷史紀錄</div>
    <hr class="mx-5 mb-5" />
    <div class="flex flex-col px-5 pb-10">
      <table class="w-full">
        <thead class="">
          <tr class="bg-primaryLight overflow-x-auto">
            <th>StartTime</th>
            <th>RunTime</th>
            <th class="w-24">狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-primaryDark/20" v-if="Store().scheduleHistory == ''">
            <td colspan="3">
              <span class="">--- 目前尚無資料 ---</span>
            </td>
          </tr>
          <tr
            v-for="i of Store.scheduleHistory"
            :key="i"
            class="bg-background hover:bg-secondaryLight/50 h-8"
          >
            <td>{{ i.startTime }}</td>
            <td>{{ i.runTime }}</td>
            <td v-if="i.status == 1" class="text-submit">成功</td>
            <td v-else class="text-cancel">失敗</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { useStore } from "../../store/store";
const Store = useStore();
</script>
