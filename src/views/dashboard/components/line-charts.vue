<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts } from '@/hooks/echarts';
import { NCard, NTag, NIcon, NButton } from 'naive-ui';
import { useThemeStore } from '@/stores/theme';
import { ArrowForward, TrendingDownOutline } from '@vicons/ionicons5';

const appStore = useThemeStore();

defineOptions({
  name: 'LineChart'
});

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['in', 'out']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [] as string[]
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      color: '#8e9dff',
      name: 'out',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#8e9dff'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    },
    {
      color: '#18a058',
      name: 'in',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#18a058'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    }
  ]
}));

async function mockData() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  updateOptions(opts => {
    opts.xAxis.data = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'];
    opts.series[0].data = [4623, 6145, 6268, 6411, 1890, 4251, 2978, 3880, 3606, 4311];
    opts.series[1].data = [2208, 2016, 2916, 4512, 8281, 2008, 1963, 2367, 2956, 678];

    return opts;
  });
}

function updateLocale() {
  updateOptions((opts, factory) => {
    const originOpts = factory();

    opts.legend.data = originOpts.legend.data;
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