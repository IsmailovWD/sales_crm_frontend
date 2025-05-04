<template>
  <n-card
    :bordered="false"
    class="card-item"
    :theme-overrides="{
      borderRadius: '10px',
      paddingMedium: '15px',
    }"
  >
    <n-statistic :label="props.cardValues.title" tabular-nums>
      <n-number-animation
        :from="props.cardValues.minProfitValue"
        :to="props.cardValues.value"
        :active="true"
        :precision="2"
        show-separator
      />
    </n-statistic>
    <div style="position: absolute; top: 15px; right: 15px">
      <n-button
        :color="props.cardValues.color"
        type="success"
        size="large"
        circle
      >
        <template #icon>
          <n-icon :component="generateIcon(props.cardValues.title)" />
        </template>
      </n-button>
    </div>
    <template #action>
      <div style="display: flex; justify-content: space-between">
        <n-button text>
          <div style="display: flex; align-items: center; gap: 4px">
            view more
            <n-icon :component="ArrowForward" />
          </div>
        </n-button>
        <n-tag
          :type="
            props.cardValues.minProfitValue === props.cardValues.value
              ? 'warning'
              : props.cardValues.minProfitValue > props.cardValues.value
              ? 'error'
              : 'success'
          "
          round
        >
          <div style="display: flex; align-items: center; gap: 4px">
            <n-icon
              size="24"
              :component="
                props.cardValues.minProfitValue === props.cardValues.value
                  ? ArrowRotateClockwise24Filled
                  : props.cardValues.minProfitValue > props.cardValues.value
                  ? TrendingDownOutline
                  : ArrowTrending24Filled
              "
            />
            {{ $formatCurrency(props.cardValues.percent ?? 0, 1) }} %
          </div>
        </n-tag>
      </div>
    </template>
  </n-card>
</template>
<script setup lang="ts">
import { Albums, TrendingDownOutline, ArrowForward } from "@vicons/ionicons5";
import {
  ArrowRotateClockwise24Filled,
  ArrowTrending24Filled,
  ShoppingBagArrowLeft24Filled,
} from "@vicons/fluent";
import {
  NCard,
  NNumberAnimation,
  NStatistic,
  NTag,
  NIcon,
  NButton,
} from "naive-ui";
import type { Component } from "vue";
export type Props = {
  value: number;
  minProfitValue: number;
  title: string;
  redirectUrl: string;
  percent?: number;
  color?: string;
};

const props = withDefaults(
  defineProps<{
    cardValues: Props;
  }>(),
  {
    cardValues: () => ({
      value: 0,
      minProfitValue: 0,
      title: "",
      redirectUrl: "",
      percent: 0,
    }),
  }
);
const generateIcon = (card: string): Component => {
  switch (card) {
    case "deal":
      return ShoppingBagArrowLeft24Filled;
    case "Sales":
      return TrendingDownOutline;
    case "Visits":
      return ArrowTrending24Filled;
    case "Users":
      return ArrowForward;
    default:
      return Albums;
  }
};
</script>
