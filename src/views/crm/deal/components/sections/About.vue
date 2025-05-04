<template>
  <div>
    <n-card
      size="small"
      :theme-overrides="{
        borderRadius: '10px',
      }"
      class="card-item"
    >
      <div class="card-custom-header">
        <n-text depth="3">{{ t("crm.about-lead") }}</n-text>
        <div>
          <n-button @click="isEdit = !isEdit" size="small" text>
            {{ isEdit ? t("cancel") : t("edit") }}
          </n-button>
        </div>
      </div>
      <n-divider style="margin: 10px 0"></n-divider>
      <n-form-item
        :label="t('crm.deal-title')"
        path="title"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <TEXT_FIELD
          :is-edit="isEdit"
          :label="'XXX-XXX'"
          size="medium"
          :model="props.formValue"
          :key-value="'title'"
          :text-style="{ fontSize: '20px' }"
        ></TEXT_FIELD>
      </n-form-item>
      <n-form-item
        :label="t('crm.tags')"
        path="tags"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <TAGS_FIELD
          :is-edit="isEdit"
          :key-value="'tags'"
          :model="props.formValue"
          :button-text="t('crm.add-tag')"
        ></TAGS_FIELD>
      </n-form-item>
      <n-form-item
        :label="t('crm.stage')"
        path="deal_stage_id"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <SINGLE_VALUE_SELECT_FIELD
          :is-edit="isEdit"
          :key-value="'deal_stage_id'"
          :model="props.formValue"
          :options="data"
          :placeholder="t('crm.stage')"
          :text-style="{ fontSize: '16px' }"
        ></SINGLE_VALUE_SELECT_FIELD>
      </n-form-item>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import type { DealAttr, DealStagesAttr } from "@/api/main/types";
import { useI18n } from "vue-i18n";
import {
  TAGS_FIELD,
  TEXT_FIELD,
  SINGLE_VALUE_SELECT_FIELD,
  type FormRules,
} from "../fields";
import {
  NCard,
  NText,
  NButton,
  NFormItem,
  NInput,
  NDivider,
  NDynamicTags,
  NIcon,
} from "naive-ui";
import { computed, onMounted, ref } from "vue";
import { useDataStore } from "@/stores/data";
import { useEventBus } from "@/eventBus";

const eventBus = useEventBus();
const data = ref<DealStagesAttr[]>([]);
const dataStore = useDataStore();
const { t } = useI18n();

type Props = {
  formValue: DealAttr | Omit<DealAttr, "id">;
  rules?: FormRules;
};
const props = defineProps<Props>();
const isEdit = ref("id" in props.formValue ? false : true);
eventBus.$on("edit-cancel", () => {
  isEdit.value = false;
});
onMounted(async () => {
  data.value = await dataStore.getData("crmStagesList");
});
</script>
<style scoped>
.card-custom-header {
  display: grid;
  grid-template-columns: auto max-content;
  gap: 10px;
  align-items: center;
}
</style>
