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
        <n-text depth="3">{{ t("crm.contact") }}</n-text>
        <div>
          <n-button @click="isEdit = !isEdit" size="small" text>
            {{ isEdit ? t("cancel") : t("edit") }}
          </n-button>
        </div>
      </div>
      <n-divider style="margin: 10px 0"></n-divider>
      <n-form-item
        :label="t('clients.phone')"
        path="contact.phone_number"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <PHONE_NUMBER_FIELD
          :is-edit="isEdit"
          :model="props.formValue.contact"
          :key-code-value="'country_code'"
          :key-value="'phone_number'"
        ></PHONE_NUMBER_FIELD>
      </n-form-item>
      <n-form-item
        :label="t('clients.name')"
        path="contact.name"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <TEXT_FIELD
          :is-edit="isEdit"
          size="medium"
          :model="props.formValue.contact!"
          :keyValue="'name'"
          :label="t('clients.name')"
        ></TEXT_FIELD>
      </n-form-item>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import type { DealAttr } from "@/api/main/types";
import { useI18n } from "vue-i18n";
import { PHONE_NUMBER_FIELD, TEXT_FIELD } from "../fields";
import { NCard, NText, NButton, NDivider, NFormItem } from "naive-ui";
import { ref } from "vue";
import { useEventBus } from "@/eventBus";
const { t } = useI18n();

type Props = {
  formValue: Partial<DealAttr>;
};
const eventBus = useEventBus();
const props = defineProps<Props>();
const isEdit = ref("id" in props.formValue ? false : true);
eventBus.$on("edit-cancel", () => {
  isEdit.value = false;
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
