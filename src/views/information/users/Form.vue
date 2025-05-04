<template>
  <n-spin :show="loading">
    <n-form ref="formRef" :model="props.formValue" :rules="rules">
      <n-form-item path="fullName" :label="t('user.fullName')">
        <n-input
          v-model:value="props.formValue.fullName"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="username" :label="t('user.username')">
        <n-input
          v-model:value="props.formValue.username"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="password" :label="t('user.password')">
        <n-input
          v-model:value="props.formValue.password"
          @keydown.enter.prevent
          type="password"
          show-password-on="mousedown"
        />
      </n-form-item>
      <n-form-item path="price" :label="t('user.salary')">
        <n-input-number
          v-model:value="props.formValue.salary"
          @keydown.enter.prevent
          style="width: 100%"
          :parse="$parseCurrency"
          :format="$formatCurrency"
          min="0"
        />
      </n-form-item>
      <n-form-item path="sales_kpi" :label="t('user.sales_kpi')">
        <n-input-number
          v-model:value="props.formValue.sales_kpi"
          @keydown.enter.prevent
          style="width: 100%"
          :parse="$parseCurrency"
          :format="$formatCurrency"
          min="0"
        />
      </n-form-item>
      <div style="display: flex; justify-content: flex-end; gap: 10px">
        <n-button type="error" @click="emits('closeModal')">
          {{ t("cancel") }}
        </n-button>
        <n-button @click="createOrEdit" type="primary">
          {{ "id" in props.formValue ? t("user.edit") : t("user.add") }}
        </n-button>
      </div>
    </n-form>
  </n-spin>
</template>

<script setup lang="ts">
import type { UserAttr } from "@/api/main/types";
import {
  type FormInst,
  type FormRules,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NButton,
} from "naive-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { userApi } from "@/api/main/actions/userApi";

type Props = {
  formValue: UserAttr | Omit<UserAttr, "id">;
};
const loading = ref(false);
const { t } = useI18n();
const formRef = ref<FormInst>();
const props = defineProps<Props>();
const emits = defineEmits({
  closeModal: (data?: UserAttr) => void 0,
});
const rules: FormRules = {
  fullName: {
    type: "string",
    required: true,
    trigger: ["blur"],
    message: () =>
      t("input_errors.{name} is required", { name: t("user.fullName") }),
  },
  username: {
    type: "string",
    required: true,
    trigger: ["blur"],
    message: () =>
      t("input_errors.{name} is required", { name: t("user.username") }),
  },
  password: {
    required: true,
    trigger: ["blur"],
    min: 6,
    message: () =>
      t("input_errors.{name} is required", { name: t("user.password") }),
  },
};
const createOrEdit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true;
      if ("id" in props.formValue) {
        userApi
          .update(props.formValue.id, props.formValue)
          .then((res) => {
            emits("closeModal", res);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        userApi
          .create(props.formValue)
          .then((res) => {
            emits("closeModal", res);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};
</script>
