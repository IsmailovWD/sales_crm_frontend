<template>
  <div
    :class="`status-item ${props.index == 0 ? 'first' : ''}`"
    style="color: #fff; height: 100%"
  >
    <div class="status--item-header">
      <n-card
        :theme-overrides="{
          paddingSmall: '4px 16px',
          borderRadius: '10px',
        }"
        size="small"
      >
        <div
          style="
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            gap: 5px;
          "
          v-if="!isEditName"
        >
          <div style="font-weight: 500; font-size: 14px; gap: 5px">
            <div
              style="
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <span
                class="column-scroll-handle"
                :title="props.item.name"
                ref="spanRef"
                @mousedown="mousedown"
                @mouseup="mouseup"
                >{{ props.item.name }}</span
              >
              <n-icon
                @click="
                  () => {
                    isEditName = true;
                    focusInt();
                  }
                "
                size="14"
                style="cursor: pointer"
              >
                <Pencil></Pencil>
              </n-icon>
            </div>
          </div>
          <div
            style="
              display: flex;
              gap: 5px;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <div style="display: flex; align-self: center">
              <n-tag
                size="small"
                :color="{
                  color: `${props.item.color}50`,
                  borderColor: `${props.item.color}`,
                }"
                round
              >
                {{ $formatCurrency(props.item.deals.length, 0) }}/{{
                  $formatCurrency(props.item.totalCount, 0)
                }}
              </n-tag>
            </div>
            <div
              class="column-drag-handle"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: move;
              "
            >
              <n-icon size="18">
                <ArrowMove24Filled></ArrowMove24Filled>
              </n-icon>
            </div>
            <div>
              <n-dropdown
                :options="optionsDropdown"
                :trigger="'click'"
                :placement="'right-start'"
                :disabled="selectedIds.length == 0"
                @select="handleSelect"
              >
                <div
                  style="
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <n-icon size="18">
                    <MoreHorizontal24Filled></MoreHorizontal24Filled>
                  </n-icon>
                </div>
              </n-dropdown>
            </div>
          </div>
        </div>
        <div
          class="edit-crm-stage"
          v-else
          style="display: flex; gap: 5px; align-items: center"
        >
          <n-input
            size="small"
            :default-value="props.item.name"
            clearable
            ref="inpRef"
            :autofocus="true"
            :on-change="() => changeName()"
          ></n-input>
          <n-color-picker
            :swatches="[
              '#FFFFFF',
              '#18A058',
              '#2080F0',
              '#F0A020',
              'rgba(208, 48, 80, 1)',
            ]"
            :default-value="props.item.color"
            size="small"
            style="width: 30px"
            :show-preview="true"
            placeholder="sad"
            ref="colorRef"
            :show-alpha="false"
            :on-complete="focusInt"
          />
        </div>
      </n-card>
      <div
        ref="el"
        style="
          width: 100%;
          height: calc(100% - 40px);
          overflow: auto;
          position: relative;
        "
      >
        <TransitionGroup name="deals" tag="div">
          <cards-vue
            v-for="(item, index) in props.item.deals"
            :key="item.id"
            :item="item"
            :index="index"
            :stage-list="props.stageList"
            @change-stage="(...args) => emit('changeStage', ...args)"
          ></cards-vue>
        </TransitionGroup>
      </div>
      <Transition name="spin">
        <n-spin v-if="loading" stroke="#fff">
          <div style="height: 60px"></div>
        </n-spin>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ArrowHookUpRight24Filled,
  ArrowMove24Filled,
  MoreHorizontal24Filled,
} from "@vicons/fluent";
import {
  NCard,
  NIcon,
  NTag,
  NInput,
  useMessage,
  type MessageReactive,
  type InputInst,
  NColorPicker,
  NSpin,
  type DropdownOption,
  NDropdown,
} from "naive-ui";
import {
  computed,
  h,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  useTemplateRef,
  watch,
} from "vue";
import {
  crmStageApi,
  type DealStagesAttr,
} from "@/api/main/actions/crmStageApi";
import { useI18n } from "vue-i18n";
import { Pencil } from "@vicons/ionicons5";
import { useEventBus } from "@/eventBus";
import cardsVue from "./cards.vue";
import { useScroll } from "@vueuse/core";
import { dealsApi } from "@/api/main/actions/dealsApi";
import type { DealStagesAttr as s } from "@/api/main/types";

type Props = {
  item: DealStagesAttr;
  index: number;
  stageList: s[];
};
const props = defineProps<Props>();
const emit = defineEmits({
  changeStage: (ids: number[], newStageId: number, oldStageId: number) => true,
});

const optionsDropdown = ref<DropdownOption[]>([]);
const selectedIds = computed<number[]>(() =>
  props.item.deals.filter((d) => d.is_checked).map((d) => d.id)
);
const el = useTemplateRef<HTMLElement>("el");
const eventBus = useEventBus();
const message = useMessage();
const inpRef = ref<InputInst>();
const colorRef = ref();
const { t } = useI18n();
const isEditName = ref(false);
const isScroll = ref(false);
const scrollLeft = ref(0);
const { arrivedState } = useScroll(el);
const { bottom } = toRefs(arrivedState);
const loading = ref(false);

const changeName = () => {
  let msgReactive: MessageReactive | null = null;
  let name = inpRef.value?.inputElRef?.value,
    color = colorRef.value?.mergedValue;
  isEditName.value = false;
  if (!name || name === props.item.name) return;
  msgReactive = message.create(t("updating"), {
    type: "loading",
    duration: 0,
  });
  crmStageApi
    .update(props.item.id, name, color)
    .then(() => {
      if (msgReactive) {
        msgReactive.type = "success";
        msgReactive.content = t("updated");
        props.item.name = name;
        props.item.color = color;
      }
      setTimeout(() => {
        msgReactive?.destroy();
      }, 1000);
    })
    .catch(() => {
      if (msgReactive) {
        msgReactive.type = "error";
        msgReactive.content = t("update_error");
      }
      setTimeout(() => {
        msgReactive?.destroy();
      }, 1000);
    });
};
const focusInt = () => setTimeout(() => inpRef.value?.inputElRef?.focus(), 100);
const spanRef = ref<HTMLSpanElement>();
const mousedown = (e: MouseEvent) => {
  e.preventDefault();
  isScroll.value = true;
  scrollLeft.value = e.clientX;
  eventBus.$emit("changeDragScroll", isScroll.value);
};
const mouseup = (e: MouseEvent) => {
  e.preventDefault();
  isScroll.value = false;
  eventBus.$emit("changeDragScroll", isScroll.value);
};
const mousemove = (e: MouseEvent) => {
  if (isScroll.value) {
    eventBus.$emit("changeScrollPosition", -(e.clientX - scrollLeft.value));
    scrollLeft.value = e.clientX;
  }
};
const getAll = () => {
  loading.value = true;
  dealsApi
    .getAll(props.item.deals.length, props.item.id)
    .then((res) => {
      props.item.deals.push(...res);
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleSelect = (key: number) => {
  if (key) {
    emit("changeStage", selectedIds.value, key, props.item.id);
  }
};
watch(
  () => bottom.value,
  () => {
    if (bottom.value && props.item.deals.length >= 20 && !loading.value) {
      getAll();
    }
  }
);
onMounted(() => {
  window.addEventListener("mouseup", mouseup);
  window.addEventListener("mousemove", mousemove);
  if (props.stageList.length) {
    optionsDropdown.value = props.stageList
      .filter(({ id }) => id !== props.item.id)
      .map(({ id, name, color }) => ({
        label: name,
        key: id,
        icon: () =>
          h(NIcon, { color }, { default: () => h(ArrowHookUpRight24Filled) }),
      }));
  }

  optionsDropdown.value.push(
    {
      type: "divider",
      key: 0,
    },
    {
      label: "Delete",
      key: -1,
    }
  );
});
onUnmounted(() => {
  window.removeEventListener("mouseup", mouseup);
  window.removeEventListener("mousemove", mousemove);
});
</script>
<style scoped>
.spin-enter-active,
.spin-leave-active {
  transition: all 0.25s ease;
  transform-origin: center;
}

.spin-enter-from,
.spin-leave-to {
  transform: scale(0);
}
.status-item {
  display: inline-block;
  width: 300px;
  border-right: 2px dashed var(--menu-hover-bg);
  padding: 4px 8px;
}
.status-item.first {
  border-left: 2px dashed var(--menu-hover-bg);
}
.column-scroll-handle {
  width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: grab;
  user-select: none;
}
.column-scroll-handle.grabbing {
  cursor: grabbing;
}
.status--item-header {
  height: calc(100% - 10px);
}
/*  */
.deals-move,
.deals-enter-active,
.deals-leave-active {
  transition: all 0.5s ease-in-out;
  transform-origin: center top;
}

/* 2. declare enter from and leave to state */
.deals-enter-from,
.deals-leave-to {
  opacity: 0;
  transform: scale(0.01);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.deals-leave-active {
  width: 100%;
  position: absolute;
}
</style>
