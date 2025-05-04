<template>
  <n-spin :show="loading">
    <n-form ref="formRef" :model="formValues" :rules="rules">
      {{ formValues }}
      <n-form-item path="name" :label="t('clients.name')">
        <n-input v-model:value="formValues.name" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="phone_number" :label="t('clients.phone')">
        <n-input-group>
          <n-select
            v-model:value="formValues.country_code"
            value-field="code"
            label-field="name"
            :options="phoneCountries"
            :render-label="renderLabel"
            :render-tag="renderSelectLabel"
            style="width: 120px"
            :consistent-menu-width="false"
            tabindex="-1"
          />
          <n-input
            ref="phoneNumberInp"
            v-model:value="formValues.phone_number"
            @keydown.enter.prevent
            :onUpdate:value="updatePhoneNumber"
          />
        </n-input-group>
      </n-form-item>
      <n-form-item :label="t('address')">
        <select-region :model-value="formValues"></select-region>
      </n-form-item>
      <br />
      <div style="display: flex; justify-content: flex-end; gap: 10px">
        <n-button @click="createOrEdit" type="error">
          {{ t("cancel") }}
        </n-button>
        <n-button @click="createOrEdit" type="primary">
          {{ "id" in formValue ? t("clients.edit") : t("clients.add") }}
        </n-button>
      </div>
    </n-form>
  </n-spin>
</template>

<script setup lang="ts">
import type { ContactsAttr } from "@/api/main/types";
import {
  type FormInst,
  type FormRules,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NInputGroup,
  type InputInst,
  useMessage,
  type MessageReactive,
  NButton,
  NSpin,
} from "naive-ui";
import { h, ref, nextTick, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  type PhoneCountry,
  phoneCountries,
  formatPhoneNumber,
  validatePhoneNumber,
} from "@/utils/phoneCountries";
import { contactsApi } from "@/api/main/actions/contactsApi";
import SelectRegion from "@/components/select/Region.vue";
type Props = {
  formValue: ContactsAttr | Omit<ContactsAttr, "id">;
};
type Emits = {
  (
    e: "closeModal",
    payload: { data: ContactsAttr; type: "add" | "edit" }
  ): void;
};

const formValues = ref<ContactsAttr | Omit<ContactsAttr, "id">>({
  name: "",
  phone_number: "",
  is_client: true,
  is_supplier: false,
  dial_code: "+998",
  country_code: "UZ",
  district_id: null,
  region_id: null,
});
const loading = ref(false);
const dialCode = ref("+998");
const { t } = useI18n();
const formRef = ref<FormInst>();
const props = defineProps<Props>();
const phoneNumberInp = ref<InputInst>();
const emits = defineEmits<Emits>();
const rules: FormRules = {
  name: {
    type: "string",
    required: true,
    trigger: ["blur", "input"],
    message: () =>
      t("input_errors.{name} is required", { name: t("clients.name") }),
  },
  phone_number: {
    type: "string",
    required: true,
    trigger: ["blur", "input"],
    validator: (rule, v) => {
      return validatePhoneNumber(
        rule,
        formValues.value.phone_number,
        formValues.value.country_code,
        t
      );
    },
  },
};
const renderLabel = (option: any) => {
  return [
    h("div", null, {
      default: () => `${option.emoji} ${option.name} (${option.dial_code})`,
    }),
  ];
};
const renderSelectLabel = ({ option }: any) => {
  return [
    h("div", null, {
      default: () => `${option.emoji} ${option.dial_code}`,
    }),
  ];
};
const updatePhoneNumber = () => {
  const inputElement = phoneNumberInp.value?.inputElRef;
  if (!inputElement) return;
  const cursorPos = inputElement.selectionStart || 0;
  const rawValue = formValues.value.phone_number;

  const { formatted, cursor, dial_code } = formatPhoneNumber(
    formValues.value.country_code,
    rawValue,
    cursorPos
  );

  formValues.value.phone_number = formatted;
  dialCode.value = dial_code;

  nextTick(() => {
    inputElement.setSelectionRange(cursor, cursor);
  });
};
const createOrEdit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true;
      const data: ContactsAttr | Omit<ContactsAttr, "id"> = {
        ...formValues.value,
        phone_number: formValues.value.phone_number.replace(/\D/g, ""),
      };
      if ("id" in data) {
        contactsApi
          .update(data.id, data)
          .then((res) => {
            try {
              emits("closeModal", { data: res, type: "edit" });
            } catch {}
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        contactsApi
          .create(data)
          .then((res) => {
            emits("closeModal", { data: res, type: "add" });
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};
onMounted(() => {
  formValues.value = JSON.parse(JSON.stringify(props.formValue));
  if ("id" in formValues.value) {
    updatePhoneNumber();
  }
});
</script>
