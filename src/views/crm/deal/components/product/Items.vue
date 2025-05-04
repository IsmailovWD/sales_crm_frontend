<template>
  <tr>
    <td>{{ props.index }}</td>
    <td>
      <n-form-item
        :show-label="false"
        :show-feedback="false"
        :path="`orders[${props.index - 1}].product_id`"
      >
        <n-select
          :options="data"
          value-field="id"
          label-field="name"
          filterable
          clearable
          size="large"
          v-model:value="item.product_id"
          :on-update:value="updateProduct"
          :virtual-scroll="true"
        >
        </n-select>
      </n-form-item>
    </td>
    <td>
      <n-form-item
        :show-label="false"
        :show-feedback="false"
        :path="`orders[${props.index - 1}].price`"
      >
        <n-input-number
          ref="inpPrice"
          size="large"
          v-model:value="item.price"
          :show-button="false"
          min="0"
          :parse="$parseCurrency"
          :format="$formatCurrency"
          style="text-align: right"
          @keydown="(e: KeyboardEvent) => {
            if(isNaN(Number(e.key)) && e.key.length == 1) e.preventDefault();
          }"
          @focus="inpPrice?.select()"
          :on-update:value="(e) => updateValue(e, 'price')"
        ></n-input-number>
      </n-form-item>
    </td>
    <td>
      <n-form-item
        :show-label="false"
        :show-feedback="false"
        :path="`orders[${props.index - 1}].quantity`"
      >
        <n-input-number
          ref="inpQuantity"
          size="large"
          v-model:value="item.quantity"
          :show-button="false"
          min="0"
          :parse="$parseCurrency"
          :format="$formatCurrency"
          style="text-align: right"
          @keydown="(e: KeyboardEvent) => {
            if(isNaN(Number(e.key)) && e.key.length == 1) e.preventDefault();
          }"
          @focus="inpQuantity?.select()"
          :on-update:value="(e) => updateValue(e, 'quantity')"
        ></n-input-number>
      </n-form-item>
    </td>
    <td>{{ $formatCurrency(item.summa) }}</td>
    <td>
      <n-dropdown
        :render-label="renderLabel"
        trigger="hover"
        :options="options"
        @select="handleSelect"
      >
        <n-button quaternary>
          <template #icon>
            <component :is="threeDots"></component>
          </template>
        </n-button>
      </n-dropdown>
    </td>
  </tr>
</template>
<script setup lang="ts">
import type { DealOrderAttr } from "@/api/main/types";
import { useDataStore } from "@/stores/data";
import {
  type DropdownOption,
  NDropdown,
  NButton,
  NIcon,
  NSelect,
  NInputNumber,
  type InputNumberInst,
  NFormItem,
} from "naive-ui";
import { computed, h, ref } from "vue";
import { useI18n } from "vue-i18n";

type Props = {
  item: DealOrderAttr;
  index: number;
};
const { t } = useI18n();
const props = defineProps<Props>();
const inpPrice = ref<InputNumberInst>();
const inpQuantity = ref<InputNumberInst>();
const emits = defineEmits({
  delete: () => true,
  "change:summa": () => true,
});
const dataStore = useDataStore();
const options = computed<DropdownOption[]>(() => [
  {
    key: "delete",
    label: t("delete"),
  },
]);
const threeDots = () =>
  h(NIcon, null, {
    default: () =>
      h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          xmlnsXlink: "http://www.w3.org/1999/xlink",
          viewBox: "0 0 24 24",
        },
        {
          default: () => [
            h(
              "g",
              {
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              },
              [
                h("circle", { cx: "5", cy: "12", r: "1" }),
                h("circle", { cx: "12", cy: "12", r: "1" }),
                h("circle", { cx: "19", cy: "12", r: "1" }),
              ]
            ),
          ],
        }
      ),
  });
const handleSelect = (key: string) => {
  if (key == "delete") {
    emits("delete");
  }
};
const renderLabel = (option: DropdownOption) => {
  if (option.key == "delete") {
    return [
      h(
        "div",
        { style: { color: "red" } },
        {
          default: () => `${t("delete")}`,
        }
      ),
    ];
  } else {
    return [
      h("div", null, {
        default: () => `${option.label}`,
      }),
    ];
  }
};
const updateValue = (value: number | null, key: string) => {
  if (key == "price") {
    if (value == null) props.item.price = 0;
    else props.item.price = value;
  }
  if (key == "quantity") {
    if (value == null) props.item.quantity = 0;
    else props.item.quantity = value;
  }
  props.item.summa = props.item.price * props.item.quantity;
  emits("change:summa");
};
const updateProduct = (e: number | null) => {
  if (e) {
    const product = data.value.find((item) => item.id == e);
    if (product) {
      props.item.product_id = product.id;
      props.item.price = product.price;
      updateValue(product.price, "price");
    }
  }
};
const data = computed(() => dataStore.cache.productListWithBalance.data);
</script>
