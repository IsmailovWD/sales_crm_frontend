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
            renderDate(props.item.created_at!)
          }}</n-text>
          <n-text>{{ props.item.user?.fullName }}</n-text>
        </div>
        <div class="body">
          <component :is="bodyHtml()" />
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import type {
  ActionMetadataAttr,
  CommentMetadataAttr,
  DealActivityAttr,
  EditMetadataAttr,
  NoteMetadataAttr,
  StageChangeMetadataAttr,
  TaskMetadataAttr,
} from "@/api/main/types";
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
import { computed, h, type VNode } from "vue";
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
const bodyHtml = (): VNode | VNode[] => {
  switch (props.item.type) {
    case DealActivityType.STAGE_CHANGE:
      return renderStageChange(props.item.metadata as StageChangeMetadataAttr);
    case DealActivityType.ACTION:
      return renderAction(props.item.metadata as ActionMetadataAttr);
    case DealActivityType.TASK:
      return renderTask(props.item.metadata as TaskMetadataAttr);
    case DealActivityType.COMMENT:
      return renderComment(props.item.metadata as CommentMetadataAttr);
    case DealActivityType.NOTE:
      return renderNote(props.item.metadata as NoteMetadataAttr);
    case DealActivityType.EDIT:
      return renderEdit(props.item.metadata as EditMetadataAttr[]);
    default:
      return h("div", {}, []);
  }
};

function renderDate(data: Date | number, only_time: boolean = true): string {
  if (only_time)
    return new Date(data).toLocaleTimeString("ru", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  else
    return new Date(data).toLocaleDateString("ru", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
}

function renderStageChange(data: StageChangeMetadataAttr): VNode {
  return h(
    "div",
    {
      style: "display: flex; align-items: center; gap: 2px",
    },
    [
      h(
        NTag,
        { round: true, type: "error" },
        { default: () => data.from_stage }
      ),
      h(NIcon, { size: "small" }, { default: () => h(CaretRight24Filled) }),
      h(
        NTag,
        { round: true, type: "success" },
        { default: () => data.to_stage }
      ),
    ]
  );
}
function renderAction(data: ActionMetadataAttr): VNode {
  return h("div", {}, [
    h(NText, {}, { default: () => t(`deals.actions.${data.action}`) }),
  ]);
}
function renderTask(data: TaskMetadataAttr): VNode {
  return h("div", {}, [
    h(NText, {}, { default: () => t(`deals.tasks.${data.task}`) }),
    h("br"),
    h(NText, { depth: 3 }, [
      h("div", { style: "display: flex; justify-content: space-between" }, [
        h(
          "span",
          {},
          {
            default: () =>
              `${t("deals.task.due_date")}: ${new Date(
                data.due_date!
              ).toLocaleString("ru")}`,
          }
        ),
        data.before_due_date.length
          ? h(
              "span",
              {},
              {
                default: () =>
                  `${t("deals.task.additional_warnings")} ${
                    data.before_due_date.length
                  }`,
              }
            )
          : null,
      ]),
    ]),
  ]);
}
function renderComment(data: CommentMetadataAttr): VNode {
  return h("div", {}, [
    h(NText, {}, { default: () => t(`deals.actions.${data.comment}`) }),
  ]);
}
function renderNote(data: NoteMetadataAttr): VNode {
  return h("div", {}, [
    h(NText, {}, { default: () => t(`deals.actions.${data.note}`) }),
  ]);
}
function renderEdit(data: EditMetadataAttr[]): VNode {
  return h(
    "div",
    {},
    data.map((item) => {
      const old_value = filedValueRender(item.field, item.old_value);
      const new_value = filedValueRender(item.field, item.new_value);
      return h("div", { style: "margin-bottom: 8px" }, [
        h(NText, {}, { default: () => t(`deals.actions.${item.field}`) }),
        h("div", { style: "display: flex; align-items: center; gap: 2px" }, [
          old_value &&
            h(
              NTag,
              { round: true, type: "default" },
              { default: () => old_value }
            ),
          old_value &&
            new_value &&
            h(
              NIcon,
              { size: "small" },
              { default: () => h(CaretRight24Filled) }
            ),
          new_value &&
            h(
              NTag,
              { round: true, type: "success" },
              { default: () => new_value }
            ),
        ]),
      ]);
    })
  );
}
function filedValueRender(field: string, value: string): string {
  switch (field) {
    case "delivery_date":
      return value && value != "" ? renderDate(Number(value), false) : "";
    default:
      return value;
  }
}

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
