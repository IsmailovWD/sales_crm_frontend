<template>
  <div>
    <n-spin size="large" :show="showSpin">
      <div style="min-height: calc(100vh - 160px)">
        <xScroll>
          <div style="overflow: hidden; position: relative" ref="kanbanRef">
            <Container
              group-name="cols"
              tag="div"
              orientation="horizontal"
              behaviour="contain"
              @drop="(event: any) => onColumnDrop(event)"
              drag-handle-selector=".column-drag-handle"
              @drag-start="drag = true"
              @drag-end="drag = false"
              style="
                display: flex;
                width: max-content;
                margin-top: 10px;
                height: 100%;
              "
              :drop-placeholder="{
                className: 'drop-preview',
                animationDuration: '150',
                showOnTop: true,
              }"
            >
              <Draggable
                style="height: 100vh"
                v-for="(item, index) in statusList"
                :key="index"
              >
                <statusVue
                  @drop="(e) => onCardDrop(item.id, e)"
                  :item="item"
                  :index="index"
                ></statusVue>
              </Draggable>
            </Container>
          </div>
          <div
            style="
              position: absolute;
              top: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            v-if="isEmpty && !showSpin"
          >
            <n-result status="418" title="Data not found"> </n-result>
          </div>
        </xScroll>
      </div>
    </n-spin>
    <div ref="elementRef"></div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import statusVue from "./components/status.vue";
import xScroll from "@/components/scroll/x-scroll.vue";
import { useEventBus } from "@/eventBus";
import { Container, Draggable } from "vue3-smooth-dnd";
import { applyDrag } from "@/utils/dnd";
import { NSpin, NResult, NAlert } from "naive-ui";
import {
  crmStageApi,
  type DealStagesAttr,
} from "@/api/main/actions/crmStageApi";
import { crmSocket } from "@/socket";
import { useSocket } from "@/composables/useSocket";
import type { DealAttr } from "@/api/main/types";
import { set } from "@vueuse/core";

useSocket(
  crmSocket,
  "add-deal",
  (data: { deal: DealAttr; deal_stage_id: number }) => {
    const stage = statusList.value.filter(
      (item) => item.id === data.deal_stage_id
    )[0];
    if (stage) {
      stage.totalCount++;
      stage.deals.unshift(data.deal);
    }
  }
);

useSocket(
  crmSocket,
  "remove-deal",
  (data: { id: number; crmStageId: number }) => {
    const stage = statusList.value.filter(
      (item) => item.id === data.crmStageId
    )[0];
    if (stage) {
      stage.totalCount--;
      stage.deals = stage.deals.filter((item) => item.id !== data.id);
    }
  }
);

useSocket(
  crmSocket,
  "update-deal",
  (data: { deal: DealAttr; old_stage_id: number; new_stage_id: number }) => {
    if (data.old_stage_id === data.new_stage_id) {
      const stage = statusList.value.filter(
        (item) => item.id === data.new_stage_id
      )[0];
      if (stage) {
        stage.deals = stage.deals.map((item) => {
          if (item.id === data.deal.id) {
            return data.deal;
          }
          return item;
        });
      }
    } else {
      const oldStage = statusList.value.filter(
        (item) => item.id === data.old_stage_id
      )[0];
      if (oldStage) {
        oldStage.totalCount--;
        oldStage.deals = oldStage.deals.filter(
          (item) => item.id !== data.deal.id
        );
      }
      const newStage = statusList.value.filter(
        (item) => item.id === data.new_stage_id
      )[0];
      if (newStage) {
        newStage.totalCount++;
        newStage.deals.unshift(data.deal);
      }
      statusList.value = statusList.value.filter(
        (item) => item.id !== data.old_stage_id
      );
    }
  }
);

const kanbanHeight = ref(0);
const elementHeight = ref(0);
const showSpin = ref(true);
const eventBus = useEventBus();
const bottomMargin = 10;
const topMargin = 0;
const kanbanRef = ref<HTMLDivElement>();
const elementRef = ref<HTMLDivElement>();
const drag = ref(false);

const statusList = ref<DealStagesAttr[]>([]);
const onColumnDrop = (dropResult: any) => {
  statusList.value = applyDrag(statusList.value, dropResult);
  changeOrder();
};
const onCardDrop = (id: number, dropResult: any) => {
  if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    const columns = Object.assign([], statusList.value);
    const column = columns.filter(
      (item: DealStagesAttr) => item.id === id
    )[0] as DealStagesAttr;
    const columnIndex = columns.indexOf(column);
    const newColumn = Object.assign({}, column) as DealStagesAttr;

    if (dropResult.addedIndex !== null) {
      dropResult.payload.deal_stage_id = newColumn.id;
      crmSocket.emit("add-deal", {
        deal: dropResult.payload,
        deal_stage_id: newColumn.id,
      });
      newColumn.totalCount++;
    }
    if (dropResult.removedIndex !== null) {
      crmSocket.emit("remove-deal", {
        id: dropResult.payload.id,
        deal_stage_id: newColumn.id,
      });
      newColumn.totalCount--;
    }
    newColumn.deals = applyDrag(newColumn.deals, dropResult);

    columns.splice(columnIndex, 1, newColumn);
    statusList.value = columns;
  }
};
const changeHeight = (e?: number) => {
  if (kanbanRef.value && elementRef.value) {
    if (typeof e === "number") {
      kanbanRef.value.style.height = e + kanbanHeight.value + "px";
      elementRef.value.style.height = elementHeight.value - e + "px";
    } else {
      const windowHeight = window.innerHeight - topMargin;
      const top = kanbanRef.value.getBoundingClientRect().top;
      const height = windowHeight - top - bottomMargin + topMargin;
      kanbanRef.value.style.height = height + "px";
      elementRef.value.style.height = top + bottomMargin - topMargin + "px";
      kanbanHeight.value = height;
      elementHeight.value = top + bottomMargin - topMargin;
    }
  }
};
const getStatusList = () => {
  showSpin.value = true;
  crmStageApi
    .getAll()
    .then((res) => {
      statusList.value = res;
    })
    .finally(() => (showSpin.value = false));
};
const changeOrder = () => {
  const orderData = statusList.value.map((item, index) => ({
    id: item.id,
    order: index,
  }));
  showSpin.value = true;
  crmStageApi.changeOrder(orderData).finally(() => (showSpin.value = false));
};
const isEmpty = computed(
  () => statusList.value.reduce((a, b) => a + b.deals.length, 0) === 0
);

eventBus.$on("changeScrollTop", changeHeight);
onMounted(() => {
  getStatusList();
  changeHeight();
  window.addEventListener("resize", () => changeHeight());
});
onUnmounted(() => {
  window.removeEventListener("resize", () => changeHeight());
});
</script>
