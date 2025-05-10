<template>
  <div
    style="
      display: grid;
      grid-template-columns: 50px auto;
      position: relative;
      padding-bottom: 10px;
    "
  >
    <div
      :class="`icon ${props.isLast ? 'last' : ''}`"
      style="
        display: flex;
        justify-content: flex-start;
        position: sticky;
        top: 0;
      "
    >
      <div
        class="card-item timeline-icon"
        :style="{
          backgroundColor: IconColor,
        }"
      >
        <n-badge :offset="[5, -10]" v-if="props.item.is_pin" :color="IconColor">
          <n-icon :size="24" :component="ICON" color="#fff" />
          <template #value>
            <n-icon :component="Pin24Filled" />
          </template>
        </n-badge>
        <n-icon v-else :size="24" :component="ICON" color="#fff" />
      </div>
    </div>
    <n-card
      size="small"
      :theme-overrides="{
        borderRadius: '10px',
      }"
      class="card-item"
    >
      <div class="content">
        <div class="title">
          <n-text strong depth="3">{{
            t(`deals.history.${props.item.type}`)
          }}</n-text>
          <n-text strong depth="3">{{
            new Date(props.item.created_at!).toLocaleTimeString("ru", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })
          }}</n-text>
          <n-text>{{ props.item.user?.fullName }}</n-text>
        </div>
        <div class="body">
          <div
            style="display: flex; align-items: center; gap: 2px"
            v-if="props.item.type === DealActivityType.STAGE_CHANGE"
          >
            <n-tag round type="error">{{
              "from_stage" in props.item.metadata
                ? props.item.metadata?.from_stage
                : ""
            }}</n-tag>
            <n-icon>
              <CaretRight24Filled></CaretRight24Filled>
            </n-icon>
            <n-tag round type="success">{{
              "to_stage" in props.item.metadata
                ? props.item.metadata?.to_stage
                : ""
            }}</n-tag>
          </div>
          <div v-if="props.item.type === DealActivityType.ACTION">
            <n-text>{{
              "action" in props.item.metadata
                ? t(`deals.actions.${props.item.metadata?.action}`)
                : ""
            }}</n-text>
          </div>
          <div v-if="props.item.type === DealActivityType.TASK">
            <n-text>{{
              "task" in props.item.metadata ? props.item.metadata?.task : ""
            }}</n-text>
            <br />
            <n-text depth="3">
              <div style="display: flex; justify-content: space-between">
                <span
                  >{{ t("deals.task.due_date") }}:
                  {{
                    "task" in props.item.metadata &&
                    new Date(props.item.metadata?.due_date!).toLocaleString(
                      "ru"
                    )
                  }}</span
                >
                <span
                  v-if="
                    'task' in props.item.metadata &&
                    props.item.metadata?.before_due_date?.length
                  "
                >
                  {{ t("deals.task.additional_warnings") }}:
                  {{ props.item.metadata?.before_due_date?.length }}
                </span>
              </div>
            </n-text>
          </div>
          <div v-if="props.item.type === DealActivityType.COMMENT">
            <n-text>{{
              "comment" in props.item.metadata
                ? props.item.metadata?.comment
                : ""
            }}</n-text>
          </div>
          <div v-if="props.item.type === DealActivityType.NOTE">
            <n-text>{{
              "note" in props.item.metadata ? props.item.metadata?.note : ""
            }}</n-text>
          </div>
          <div v-if="props.item.type === DealActivityType.EDIT">
            <div
              v-if="Array.isArray(props.item.metadata)"
              v-for="(meta, i) in props.item.metadata"
              :key="i"
            >
              <n-text>{{ t(`crm.${meta.field}`) }}</n-text>
              <div style="display: flex; align-items: center; gap: 2px">
                <n-tag size="small" round type="default">{{
                  meta.old_value
                }}</n-tag>
                <n-icon size="small">
                  <CaretRight24Filled></CaretRight24Filled>
                </n-icon>
                <n-tag size="small" round type="success">{{
                  meta.new_value
                }}</n-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import type { DealActivityAttr } from "@/api/main/types";
import { DealActivityType } from "@/api/main/types";
import {
  CaretRight24Filled,
  BroadActivityFeed24Filled,
  Checkmark16Filled,
  CheckmarkSquare24Filled,
  CommentMultiple24Filled,
  DocumentEdit24Filled,
  Notepad24Filled,
  Pin24Filled,
} from "@vicons/fluent";
import { useI18n } from "vue-i18n";
import { NIcon, NText, NTag, NCard, NBadge } from "naive-ui";
import { computed } from "vue";
import { ShuffleOutline } from "@vicons/ionicons5";

type Props = {
  item: DealActivityAttr;
  isLast: boolean;
};

const props = defineProps<Props>();

const IconColor = computed(() => {
  switch (props.item.type) {
    case DealActivityType.NOTE:
      return "#F7C800";
    case DealActivityType.COMMENT:
      return "#28A745";
    case DealActivityType.TASK:
      return "#007BFF";
    case DealActivityType.STAGE_CHANGE:
      return "#6F42C1";
    case DealActivityType.EDIT:
      return "#DC3545";
    case DealActivityType.ACTION:
      return "#17A2B8";
    default:
      return undefined;
  }
});
const ICON = computed(() => {
  switch (props.item.type) {
    case DealActivityType.NOTE:
      return Notepad24Filled;
    case DealActivityType.COMMENT:
      return CommentMultiple24Filled;
    case DealActivityType.TASK:
      return CheckmarkSquare24Filled;
    case DealActivityType.STAGE_CHANGE:
      return ShuffleOutline;
    case DealActivityType.EDIT:
      return DocumentEdit24Filled;
    case DealActivityType.ACTION:
      return BroadActivityFeed24Filled;
    default:
      return undefined;
  }
});
const { t } = useI18n();
</script>
<style scoped lang="scss">
.icon {
  // &::after {
  //   content: "";
  //   position: absolute;
  //   top: 20px;
  //   left: 40px;
  //   width: 10px;
  //   height: 1px;
  //   border-radius: 10px;
  //   pointer-events: none;
  //   background: var(--timeline-line-color);
  // }
  // &::before {
  //   content: "";
  //   position: absolute;
  //   bottom: -15px;
  //   left: 20px;
  //   width: 1px;
  //   height: calc(100% - 25px);
  //   border-radius: 10px;
  //   pointer-events: none;
  //   background: var(--timeline-line-color);
  // }
  // &.last {
  //   &::before {
  //     display: none;
  //   }
  // }
  .timeline-icon {
    border-radius: 10px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: sticky;
    top: 0;
  }
}
.content {
  position: relative;
  min-height: 50px;
  .title {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
}
</style>
