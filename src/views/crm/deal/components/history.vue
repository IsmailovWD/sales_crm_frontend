<template>
  <div @scroll="handleScroll" ref="el" class="history">
    <div>
      <n-card
        size="small"
        :theme-overrides="{
          borderRadius: '10px',
        }"
        class="card-item"
        style="position: sticky; top: 0"
      >
        <div>
          <n-text style="font-size: 14px" depth="3">{{
            t("deals.deal-history")
          }}</n-text>
        </div>
        <n-tabs animated default-value="tasks" type="line">
          <n-tab-pane name="tasks" :tab="t('deals.history.TASK')">
            <TASK_FIELD @add="addActivity"></TASK_FIELD>
          </n-tab-pane>
          <n-tab-pane name="note" :tab="t('deals.history.NOTE')">
            <NOTE_FIELD @add="addActivity"></NOTE_FIELD>
          </n-tab-pane>
          <n-tab-pane name="comment" :tab="t('deals.history.COMMENT')">
            <COMMENT_FIELD @add="addActivity"></COMMENT_FIELD>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
    <div>
      <TIMELINE
        v-for="(item, index) in historyList"
        :key="index"
        :item="item"
        :is-last="index === historyList.length - 1"
      ></TIMELINE>
      <n-spin :show="loading">
        <div v-if="loading" style="height: 60px"></div>
      </n-spin>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DealActivityAttr, DealAttr } from "@/api/main/types";
import { NCard, NTabs, NTabPane, NText, NSpin } from "naive-ui";
import { useI18n } from "vue-i18n";
import { TIMELINE } from "./history";
import {
  COMMENT_FIELD,
  NOTE_FIELD,
  TASK_FIELD,
} from "./history/append-activity";
import {
  dealActivityApi,
  type GetAllActivityDataAttr,
} from "@/api/main/actions/dealActivityApi";
import { onMounted, ref } from "vue";

type Props = {
  formValue: Partial<DealAttr>;
};
const CONSTANTS: { PAGE: number; readonly PAGESIZE: number; ENDING: boolean } =
  {
    PAGE: 1,
    PAGESIZE: 50,
    ENDING: false,
  };
const historyList = ref<GetAllActivityDataAttr[]>([]);
const el = ref<HTMLElement>();
const { t } = useI18n();
const props = defineProps<Props>();
const loading = ref(true);
const getAllActivity = () => {
  loading.value = true;
  dealActivityApi
    .getAllWithPagination(
      CONSTANTS.PAGE++,
      CONSTANTS.PAGESIZE,
      "id" in props.formValue ? props.formValue.id : 0
    )
    .then((res) => {
      if (historyList.value.length === 0) {
        res.forEach((item, index) => {
          historyList.value.push({
            date: item.date,
            type: item.type,
            data: [],
          });
        });
        res.forEach((item, index) => {
          setTimeout(() => {
            historyList.value[index].data.push(...item.data);
          }, 1);
        });
      } else {
        if (
          historyList.value[historyList.value.length - 1].date == res[0].date
        ) {
          historyList.value[0].data.push(...res[0].data);
          historyList.value.push(...res.slice(1));
        } else {
          historyList.value.push(...res);
        }
      }
      if (
        res.reduce((acc, item) => acc + item.data.length, 0) <
        CONSTANTS.PAGESIZE
      )
        CONSTANTS.ENDING = true;
    })
    .finally(() => {
      loading.value = false;
    });
};
const addActivity = (e: DealActivityAttr) => {
  const activityDate = formatDate(e.created_at!);
  const firstDateGroup = historyList.value.find((item) => item.type === "date");
  const firstDate = firstDateGroup
    ? formatDate(firstDateGroup.date as any)
    : null;

  if (e.is_pin) {
    let pinGroup = historyList.value.find((item) => item.type === "pin");
    if (!pinGroup) {
      pinGroup = { type: "pin", date: e.created_at as any, data: [] };
      historyList.value.unshift(pinGroup);
    }
    pinGroup.data.unshift(e);
  } else {
    if (firstDate === activityDate) {
      const dateGroup = historyList.value.find((item) => item.type === "date");
      dateGroup?.data.unshift(e);
    } else {
      historyList.value.unshift({
        type: "date",
        date: e.created_at as any,
        data: [e],
      });
    }
  }
};

const formatDate = (date: string | Date) => {
  return new Date(date)
    .toLocaleDateString("ru", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");
};
const handleScroll = (e: Event) => {
  if (el.value) {
    const { scrollTop, scrollHeight, clientHeight } = el.value;
    if (
      Math.ceil(scrollTop) + Math.ceil(clientHeight) >=
      Math.ceil(scrollHeight)
    ) {
      if (loading.value || CONSTANTS.ENDING) return;
      getAllActivity();
    }
  }
};
onMounted(() => {
  getAllActivity();
});
</script>
<style scoped lang="scss">
.history {
  position: relative;
  display: grid;
  grid-template-columns: 40% 58%;
  gap: 2%;
  height: calc(100vh - 106px);
  overflow-y: auto;
}
</style>
