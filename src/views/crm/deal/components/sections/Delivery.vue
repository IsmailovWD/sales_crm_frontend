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
        <n-text depth="3">{{ t("crm.about_delivery") }}</n-text>
        <div>
          <n-button @click="isEdit = !isEdit" size="small" text>
            {{ isEdit ? t("cancel") : t("edit") }}
          </n-button>
        </div>
      </div>
      <n-divider style="margin: 10px 0"></n-divider>
      <n-form-item
        :label="t('crm.delivery_date')"
        path="delivery_date"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <TIMESTAMP_FIELD
          :is-edit="isEdit"
          :label="'YYYY-MM-DD'"
          size="medium"
          :model="props.formValue"
          :key-value="'delivery_date'"
          :text-style="{ fontSize: '20px' }"
        ></TIMESTAMP_FIELD>
      </n-form-item>
      <n-form-item
        :label="t('crm.delivery-region')"
        path="title"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <REGION_FIELD
          :is-edit="isEdit"
          :model="props.formValue"
          :text-style="{ fontSize: '20px' }"
        ></REGION_FIELD>
      </n-form-item>
      <n-form-item
        :label="t('crm.address')"
        path="title"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <TEXT_FIELD
          :is-edit="isEdit"
          :label="t('crm.address')"
          size="medium"
          :model="props.formValue"
          :key-value="'address'"
          :text-style="{ fontSize: '20px' }"
        ></TEXT_FIELD>
      </n-form-item>
      <!-- <n-form-item
        :label="t('crm.location')"
        path="title"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <Map></Map>
      </n-form-item> -->
      <n-form-item
        :label="t('crm.delivery')"
        path="deliveryman_id"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '25px',
        }"
      >
        <SINGLE_VALUE_SELECT_FIELD
          :is-edit="isEdit"
          :key-value="'deliveryman_id'"
          :model="props.formValue"
          :options="data"
          :placeholder="t('crm.delivery')"
          :text-style="{ fontSize: '16px' }"
        ></SINGLE_VALUE_SELECT_FIELD>
      </n-form-item>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import type { DealAttr } from "@/api/main/types";
import { useI18n } from "vue-i18n";
import {
  TIMESTAMP_FIELD,
  REGION_FIELD,
  TEXT_FIELD,
  SINGLE_VALUE_SELECT_FIELD,
} from "../fields";
import { NCard, NText, NButton, NDivider, NFormItem } from "naive-ui";
import Map from "@/components/Map.vue";
import { onMounted, ref } from "vue";
import { useEventBus } from "@/eventBus";
import { useDataStore } from "@/stores/data";

const data = ref<any>([]);
const dataStore = useDataStore();
const eventBus = useEventBus();
const { t } = useI18n();

type Props = {
  formValue: Partial<DealAttr>;
};
const props = defineProps<Props>();
const isEdit = ref("id" in props.formValue ? false : true);

eventBus.$on("edit-cancel", () => {
  isEdit.value = false;
});
onMounted(async () => {
  data.value = (await dataStore.getData("deliveryManList")).map((item) => ({
    id: item.id,
    name: item.name,
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
