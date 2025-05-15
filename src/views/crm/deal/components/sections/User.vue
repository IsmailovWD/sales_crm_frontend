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
        <n-text depth="3">{{ t("crm.user_about") }}</n-text>
        <div>
          <n-button @click="isEdit = !isEdit" size="small" text>
            {{ isEdit ? t("cancel") : t("edit") }}
          </n-button>
        </div>
      </div>
      <n-divider style="margin: 10px 0"></n-divider>
      <n-form-item
        :label="t('crm.user')"
        path="assigned_user_id"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <SINGLE_VALUE_SELECT_FIELD
          :is-edit="isEdit"
          :key-value="'assigned_user_id'"
          :model="props.formValue"
          :options="data"
          :placeholder="t('crm.user')"
          :text-style="{ fontSize: '16px' }"
        ></SINGLE_VALUE_SELECT_FIELD>
      </n-form-item>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import type { DealAttr, DealStagesAttr, UserAttr } from "@/api/main/types";
import { useI18n } from "vue-i18n";
import { SINGLE_VALUE_SELECT_FIELD, type FormRules } from "../fields";
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
const data = ref<{ id: number; name: string }[]>([]);
const dataStore = useDataStore();
const { t } = useI18n();

type Props = {
  formValue: Partial<DealAttr>;
  rules?: FormRules;
};
const props = defineProps<Props>();
const isEdit = ref("id" in props.formValue ? false : true);
eventBus.$on("edit-cancel", () => {
  isEdit.value = false;
});
onMounted(async () => {
  data.value = (await dataStore.getData("userList")).map((item) => ({
    id: item.id,
    name: item.fullName,
  }));
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
