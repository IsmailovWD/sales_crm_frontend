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
      <n-badge color="#353535" :show-zero="true" :value="0" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DealAttr } from "@/api/main/types";
import { NTag, NA, NBadge } from "naive-ui";
import { useRouter } from "vue-router";
type Props = {
  item: DealAttr;
};

const router = useRouter();
const props = defineProps<Props>();
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
