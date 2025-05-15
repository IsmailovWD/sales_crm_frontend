<template>
  <div style="min-height: calc(100vh - 160px)">
    <n-card
      class="card-item"
      size="small"
      :theme-overrides="{ borderRadius: '10px' }"
    >
      <div
        style="
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
        "
      >
        <div style="display: flex; align-items: center; gap: 10px">
          <n-button @click="addItem" type="primary">
            {{ t("products.add") }}
          </n-button>
        </div>
      </div>
    </n-card>
    <n-card
      style="margin-top: 10px"
      size="small"
      :theme-overrides="{ borderRadius: '10px' }"
    >
      <x-scroll>
        <n-table :single-line="true" :single-column="false">
          <thead>
            <tr>
              <th>№</th>
              <th>{{ t("products.name") }}</th>
              <th>{{ t("products.price") }}</th>
              <th>{{ t("products.quantity") }}</th>
              <th>{{ t("products.summa") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <items
              v-for="(item, index) in props.formValue.orders"
              :key="index"
              :index="index + 1"
              :item="item"
              @delete="props.formValue.orders?.splice(index, 1)"
              @change:summa="changeSumma"
            ></items>
            <tr v-if="!props.formValue.orders?.length">
              <td colspan="5" style="padding: 50px 10px">
                <n-empty></n-empty>
              </td>
            </tr>
          </tbody>
        </n-table>
      </x-scroll>
      <div class="total">
        <div class="currency">
          {{ t("products.total_summa") }}:
          {{ $formatCurrency(props.formValue.summa!) }}
        </div>
      </div>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import type { DealAttr } from "@/api/main/types";
import { NCard, NButton, NTable, NEmpty, NText } from "naive-ui";
import { useI18n } from "vue-i18n";
import xScroll from "@/components/scroll/x-scroll.vue";
import { Items } from "./product";
import type { FormRules } from "./fields";

type Props = {
  formValue: Partial<DealAttr>;
  rules?: FormRules;
};
const { t } = useI18n();
const props = defineProps<Props>();
const addItem = () => {
  props.formValue.orders?.push({
    product_id: null,
    price: 0,
    quantity: 0,
    summa: 0,
  });
};
const changeSumma = () => {
  props.formValue.summa = props.formValue.orders?.reduce(
    (acc, item) => acc + item.summa,
    0
  );
};
</script>
<style lang="scss">
.total {
  padding: 15px 5px;
  .currency {
    font-size: 20px;
    font-weight: 600;
    text-align: right;
  }
}
</style>
