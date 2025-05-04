<template>
  <n-spin :show="loading">
    <n-form ref="formRef" :model="formValues" :rules="rules">
      <n-form-item path="name" :label="t('delivery-man.name')">
        <n-input v-model:value="formValues.name" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="phone_number" :label="t('delivery-man.phone')">
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
      <n-form-item path="salary_type" :label="t('delivery-man.salary_type')">
        <n-radio-group v-model:value="formValues.salary_type" name="radiogroup">
          <n-space>
            <n-radio
              v-for="song in ['none', 'salary', 'percent', 'summa']"
              :key="song"
              :value="song"
              :label="t(`delivery-man.${song}`)"
            />
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item
        v-if="formValues.salary_type !== 'none'"
        path="salary_value"
        :label="t(`delivery-man.${formValues.salary_type}`)"
      >
        <n-input-number
          style="width: 100%"
          v-model:value="formValues.salary_value"
          :parse="$parseCurrency"
          :format="$formatCurrency"
        >
          <template #prefix>
            <n-icon>
              <svg
                v-if="formValues.salary_type === 'percent'"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7.5 4C5.57 4 4 5.57 4 7.5S5.57 11 7.5 11S11 9.43 11 7.5S9.43 4 7.5 4zm0 5C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6S9 6.67 9 7.5S8.33 9 7.5 9zm9 4c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm2.79-13.29c.39.39.39 1.02 0 1.41L6.12 19.29a.996.996 0 1 1-1.41-1.41L17.88 4.71a.996.996 0 0 1 1.41 0z"
                  fill="currentColor"
                ></path>
              </svg>
              <MoneyHand24Regular v-else></MoneyHand24Regular>
            </n-icon>
          </template>
        </n-input-number>
      </n-form-item>
      <n-form-item
        path="werehouse_available"
        :label="t('delivery-man.werehouse')"
      >
        <n-switch
          v-model:value="formValues.werehouse_available"
          :rail-style="railStyle"
        >
          <template #checked>
            {{
              t("available").charAt(0).toUpperCase() + t("available").slice(1)
            }}
          </template>
          <template #unchecked>
            {{
              t("not_available").charAt(0).toUpperCase() +
              t("not_available").slice(1)
            }}
          </template>
        </n-switch>
      </n-form-item>
      <n-form-item :label="t('delivery-man.password')" path="password">
        <n-input
          type="password"
          show-password-on="mousedown"
          v-model:value="formValues.password"
        >
        </n-input>
      </n-form-item>
      <br />
      <div style="display: flex; justify-content: flex-end; gap: 10px">
        <n-button @click="createOrEdit" type="error">
          {{ t("cancel") }}
        </n-button>
        <n-button @click="createOrEdit" type="primary">
          {{
            "id" in formValues ? t("delivery-man.edit") : t("delivery-man.add")
          }}
        </n-button>
      </div>
    </n-form>
  </n-spin>
</template>

<script setup lang="ts">
import type { DeliveryManAttr } from "@/api/main/types";
import {
  type FormInst,
  type FormRules,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NInputGroup,
  type InputInst,
  NButton,
  NSpin,
  NRadioGroup,
  NSpace,
  NRadio,
  NInputNumber,
  NIcon,
  NSwitch,
} from "naive-ui";
import { h, ref, nextTick, onMounted, type CSSProperties } from "vue";
import { useI18n } from "vue-i18n";
import {
  type PhoneCountry,
  phoneCountries,
  formatPhoneNumber,
  validatePhoneNumber,
} from "@/utils/phoneCountries";
import { deliveryManApi } from "@/api/main/actions/deliveryManApi";
import SelectRegion from "@/components/select/Region.vue";
import { MoneyHand24Regular } from "@vicons/fluent";

type Props = {
  formValue: DeliveryManAttr | Omit<DeliveryManAttr, "id">;
};
type Emits = {
  (
    e: "closeModal",
    payload: { data: DeliveryManAttr; type: "add" | "edit" }
  ): void;
};

const formValues = ref<DeliveryManAttr | Omit<DeliveryManAttr, "id">>({
  name: "",
  phone_number: "",
  dial_code: "+998",
  country_code: "UZ",
  districtId: null,
  regionId: null,
  salary_type: "none",
  salary_value: 0,
  werehouse_available: false,
  password: "",
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
      t("input_errors.{name} is required", { name: t("delivery-man.name") }),
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
  salary_type: {
    required: true,
    message: () =>
      t("input_errors.{name} is required", {
        name: t("delivery-man.salary_type"),
      }),
  },
  salary_value: {
    required: true,
    validator: (rule, v) => {
      if (formValues.value.salary_type === "none") return true;
      if (v == 0 || !v)
        return new Error(
          t("input_errors.{name} is required", {
            name: t(`delivery-man.${formValues.value.salary_type}`),
          })
        );
      return v > 0;
    },
    trigger: ["blur", "input"],
  },
  password: {
    required: true,
    validator: (rule, v) => {
      if ("id" in formValues.value) return true;
      if (!v || v.length < 6)
        return new Error(
          t("input_errors.{name} is required", {
            name: t("delivery-man.password"),
          })
        );
      return true;
    },
    trigger: ["blur", "input"],
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
      const data: DeliveryManAttr | Omit<DeliveryManAttr, "id"> = {
        ...formValues.value,
        phone_number: formValues.value.phone_number.replace(/\D/g, ""),
      };
      if ("id" in data) {
        deliveryManApi
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
        deliveryManApi
          .create(data)
          .then((res) => {
            emits("closeModal", { data: res, type: "add" });
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
    console.log(errors);
  });
};
const railStyle = ({
  focused,
  checked,
}: {
  focused: boolean;
  checked: boolean;
}) => {
  const style: CSSProperties = {};
  if (!checked) {
    style.background = "#d03050";
    if (focused) {
      style.boxShadow = "0 0 0 2px #d0305040";
    }
  } else {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};
onMounted(() => {
  formValues.value = JSON.parse(JSON.stringify(props.formValue));
  if ("id" in formValues.value) {
    updatePhoneNumber();
  }
});
</script>
