<template>
  <div @dblclick="edit" style="margin: 3px 0" class="kanban-card">
    <div class="kanban-card-content">
      <div @click="copyLead" class="kanban-card-content-title">
        #{{
          props.item.title && props.item.title != ""
            ? props.item.title
            : props.item.id
        }}
      </div>
      <div class="kanban-card-content-summa">
        UZS {{ $formatCurrency(props.item.summa) }}
      </div>
      <div class="kanban-card-content-contact">
        <n-a>
          {{ props.item.contact.name }}
        </n-a>
      </div>
      <div class="kanban-card-content-tags">
        <n-tag
          v-for="(tag, index) in props.item.tags"
          :key="index"
          type="success"
          round
          size="small"
        >
          {{ tag }}
        </n-tag>
      </div>
    </div>
    <div class="kanban-card-actions">
      <n-dropdown
        :options="optionsDropdown"
        :trigger="'click'"
        :placement="'right-start'"
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
      <input type="checkbox" v-model="props.item.is_checked" @dblclick.stop />
      <n-badge color="#353535" :show-zero="true" :value="0" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DealAttr, DealStagesAttr } from "@/api/main/types";
import {
  NTag,
  NA,
  NBadge,
  NIcon,
  NDropdown,
  type DropdownOption,
} from "naive-ui";
import { useRouter } from "vue-router";
import {
  MoreHorizontal24Filled,
  ArrowHookUpLeft24Filled,
  ArrowHookUpRight24Filled,
} from "@vicons/fluent";
import { h, onMounted, ref } from "vue";

type Props = {
  item: DealAttr;
  stageList: DealStagesAttr[];
};
const emit = defineEmits({
  changeStage: (ids: number[], newStageId: number, oldStageId: number) => true,
});
const router = useRouter();
const props = defineProps<Props>();
const optionsDropdown = ref<DropdownOption[]>([]);
const copyLead = () => {
  if (props.item.title) navigator.clipboard.writeText(props.item.title);
  else if (props.item.id)
    navigator.clipboard.writeText(props.item.id.toString());
};
const edit = () => {
  router.push({
    name: "crm-deal-detail",
    params: {
      deal_id: props.item.id,
    },
  });
};
const handleSelect = (key: number) => {
  if (key) {
    emit("changeStage", [props.item.id], key, props.item.stage_id!);
  }
};
onMounted(async () => {
  if (props.stageList.length) {
    optionsDropdown.value = props.stageList
      .filter(({ id }) => id !== props.item.stage_id)
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
</script>
<style lang="scss" scoped>
.kanban-card {
  display: grid;
  grid-template-columns: 1fr 30px;
  user-select: none;
  &-content {
    display: grid;
    gap: 5px;
    &-title {
      cursor: pointer;
    }
  }
  &-actions {
    display: grid;
    justify-content: end;
    gap: 10px;
  }
}
</style>
