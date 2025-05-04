<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts } from '@/hooks/echarts';
import { NCard, NTag, NIcon, NButton } from 'naive-ui';
import { useThemeStore } from '@/stores/theme';
import { ArrowForward, TrendingDownOutline } from '@vicons/ionicons5';

const appStore = useThemeStore();

defineOptions({
  name: 'GuageChart'
});

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%', 
  },
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      itemStyle: {
        color: '#18a058'
      },
      progress: {
        show: true
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}'
      },
      data: [
        {
          value: 50,
          name: 'SCORE'
        }
      ]
    }
  ]
}));

async function mockData() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  updateOptions(opts => {
    opts.series[0].data[0].value = Math.round(Math.random() * 100);

    return opts;
  });
}

function updateLocale() {
  updateOptions((opts, factory) => {
    const originOpts = factory();

    // opts.legend.data = originOpts.legend.data;
    opts.series[0].name = originOpts.series[0].name;
    opts.series[1].name = originOpts.series[1].name;

    return opts;
  });
}

async function init() {
  mockData();
}

watch(
  () => appStore.theme,
  () => {
    updateLocale();
  }
);

// init
init();
</script>

<template>
  <NCard :bordered="false" class="card-item" :theme-overrides="{
    borderRadius: '10px',
    paddingMedium: '15px'
  }">
    <div ref="domRef" style="height: 360px;"></div>
    <template #action>
      <div style="display: flex; justify-content: space-between;">
        <n-button text>
          <div style="display: flex; align-items: center; gap: 4px;">
            view more
            <n-icon :component="ArrowForward" />
          </div>
        </n-button>
        <n-tag type="success" round>
          <div style="display: flex; align-items: center; gap: 4px;">
            <n-icon size="24"
              :component="TrendingDownOutline" 
            />
            {{ $formatCurrency(Math.floor(Math.random() * 100), 1) }} %
          </div>
        </n-tag>
      </div>
    </template>
  </NCard>
</template>

<style scoped></style>