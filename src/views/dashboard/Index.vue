<template>
  <div style="padding: 10px">
    <n-grid x-gap="12" :cols="4">
      <n-gi v-for="(item, index) in StatisticCardsData" :key="index">
        <statistic-cards :card-values="item"></statistic-cards>
      </n-gi>
    </n-grid>
    <div style="margin-top: 10px">
      <n-grid x-gap="12" :cols="6">
        <n-gi span="4">
          <LineCharts></LineCharts>
        </n-gi>
        <n-gi span="2">
          <ScoreVue></ScoreVue>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NGrid, NGi } from "naive-ui";
import {
  StatisticCards,
  LineCharts,
  ScoreVue,
  type StatisticCardsProps,
} from "@/views/dashboard/components/";

import { ref } from "vue";

const StatisticCardsData = ref<StatisticCardsProps[]>([
  {
    title: "deal",
    value: 1000,
    minProfitValue: 500,
    redirectUrl: "",
    percent: Math.floor(Math.random() * 100),
    color: "#18a058",
  },
  {
    title: "Sales",
    value: 400,
    minProfitValue: 3000,
    redirectUrl: "",
    percent: Math.floor(Math.random() * 100),
    color: "#f0a020",
  },
  {
    title: "Visits",
    value: 400,
    minProfitValue: 3000,
    redirectUrl: "",
    percent: Math.floor(Math.random() * 100),
    color: "#8a2be2",
  },
  {
    title: "Users",
    value: 400,
    minProfitValue: 3000,
    redirectUrl: "",
    percent: Math.floor(Math.random() * 100),
    color: "#ff69b4",
  },
]);
</script>
