<template>
  <n-form ref="formRef" :model="props.formValue" :rules="rules">
    <n-form-item path="name" :label="t('products.name')">
      <n-input
        v-model:value="props.formValue.name"
        @keydown.enter.prevent
        :onUpdate:value="updateValues"
      />
    </n-form-item>
    <n-form-item path="price" :label="t('products.price')">
      <n-input-number
        v-model:value="props.formValue.price"
        @keydown.enter.prevent
        style="width: 100%"
        :parse="$parseCurrency"
        :format="$formatCurrency"
        min="0"
        :onUpdate:value="updateValues"
      />
    </n-form-item>
    <n-form-item path="body_summa" :label="t('products.body_summa')">
      <n-input-number
        v-model:value="props.formValue.body_summa"
        @keydown.enter.prevent
        style="width: 100%"
        :parse="$parseCurrency"
        :format="$formatCurrency"
        min="0"
        :onUpdate:value="updateValues"
      />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import type { ProductsAttr } from "@/api/main/types";
import {
  type FormInst,
  type FormRules,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
} from "naive-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
type Props = {
  formValue: ProductsAttr | Omit<ProductsAttr, "id">;
};
const { t } = useI18n();
const formRef = ref<FormInst>();
const props = defineProps<Props>();
const emits = defineEmits({
  changeBtnDisabled: (value: boolean) => true,
});
const rules: FormRules = {
  name: {
    type: "string",
    required: true,
    trigger: ["blur"],
    message: () =>
      t("input_errors.{name} is required", { name: t("products.name") }),
  },
  price: {
    type: "number",
    required: true,
    trigger: ["blur"],
    message: () =>
      t("input_errors.{name} is required", { name: t("products.price") }),
  },
  body_summa: {
    type: "number",
    required: true,
    trigger: ["blur"],
    message: () =>
      t("input_errors.{name} is required", {
        name: t("products.body_summa"),
      }),
  },
};

const updateValues = () => {
  formRef.value?.validate((errors) => {
    emits("changeBtnDisabled", errors !== undefined); // true agar xato bo'lsa, aks holda false
  });
};
</script>
