<template>
  <n-spin :show="loading">
    <div>
      <n-form
        ref="formRef"
        inline
        :label-width="80"
        :model="formValue"
        :rules="rules"
        :theme-overrides="{
          labelPaddingVertical: '0px',
          labelHeightSmall: '5px',
        }"
      >
        <n-tabs
          :default-value="defaultTabs"
          type="line"
          animated
          :on-update:value="changeTab"
          v-model:value="activeTab"
        >
          <n-tab-pane
            display-directive="show"
            name="general"
            :tab="t('crm.general')"
          >
            <div
              :style="{
                'min-height': 'calc(100vh - 160px)',
              }"
            >
              <general :form-value="props.formValue" />
            </div>
          </n-tab-pane>
          <n-tab-pane
            display-directive="show"
            name="products"
            :tab="t('crm.products')"
          >
            <product :form-value="props.formValue" />
          </n-tab-pane>
          <n-tab-pane
            name="history"
            :tab="t('deals.deal-history')"
            :disabled="props.type !== 'update'"
          >
            <history
              :is_active="
                'id' in props.formValue && props.formValue.id ? true : false
              "
              :form-value="props.formValue"
            ></history>
          </n-tab-pane>
        </n-tabs>
      </n-form>
      <div id="footer-form-crm" ref="footerRef">
        <n-button @click="createOrEditDeal" type="primary">{{
          t("save")
        }}</n-button>
        <n-button @click="cancelChange" tertiary type="error">{{
          t("cancel")
        }}</n-button>
      </div>
    </div>
  </n-spin>
</template>
<script setup lang="ts">
import {
  NTabs,
  NTabPane,
  NButton,
  type FormInst,
  NForm,
  NSpin,
} from "naive-ui";
import type { DealAttr } from "@/api/main/types";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { computed, onMounted, ref, watch } from "vue";
import { General, Product, History } from "./components";
import { validatePhoneNumber } from "@/utils/phoneCountries";
import { useEventBus } from "@/eventBus";
import { dealsApi } from "@/api/main/actions/dealsApi";
import type { FormRules } from "naive-ui";

type Props = {
  type: "create" | "update";
  formValue: Omit<DealAttr, "id"> | DealAttr;
};
const footerRef = ref<HTMLElement>();
const { t } = useI18n();
const props = defineProps<Props>();
const emits = defineEmits(["onAfterCreate", "onAfterUpdate"]);
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const backupFormValue = ref<Omit<DealAttr, "id"> | DealAttr>();

const eventBus = useEventBus();
const defaultTabs = computed(() => {
  return props.type === "update"
    ? route.hash
      ? route.hash.slice(1)
      : "general"
    : "general";
});
const activeTab = ref(defaultTabs.value);
const formRef = ref<FormInst>();

const generateRules = (): FormRules => {
  const baseRules: FormRules = {
    deal_stage_id: {
      required: true,
      message: () => {
        return t("input_errors.{name} is required", { name: t("crm.stage") });
      },
      trigger: ["blur", "change"],
      type: "number",
    },
    contact: {
      phone_number: {
        required: true,
        trigger: ["blur", "input"],
        validator: (rule, v) => {
          return validatePhoneNumber(
            rule,
            props.formValue.contact.phone_number,
            props.formValue.contact.country_code,
            t
          );
        },
      },
      name: {
        required: true,
        message: () =>
          t("input_errors.{name} is required", { name: t("clients.name") }),
        trigger: ["blur", "change"],
        type: "string",
      },
    },
  };

  props.formValue.orders.forEach((_, index) => {
    baseRules[`orders[${index}].product_id`] = {
      required: true,
      message: () =>
        t("input_errors.{name} is required", { name: t("crm.product") }),
      trigger: ["blur", "change"],
      type: "number",
    };
    baseRules[`orders[${index}].quantity`] = {
      required: true,
      message: () =>
        t("input_errors.{name} is required", { name: t("crm.quantity") }),
      type: "number",
      trigger: ["blur", "change"],
    };
    baseRules[`orders[${index}].price`] = {
      required: true,
      message: () =>
        t("input_errors.{name} is required", { name: t("crm.price") }),
      type: "number",
      trigger: ["blur", "change"],
    };
  });

  return baseRules;
};

const rules = computed(() => generateRules());
const changeTab = (name: string) => {
  // router.push({ hash: `#${name}` });
};
const createOrEditDeal = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true;
      props.formValue.contact.phone_number =
        props.formValue.contact.phone_number.replace(/\D/g, "");
      if (props.type == "create") {
        dealsApi
          .create(props.formValue)
          .then(async (res) => {
            eventBus.$emit("edit-cancel", false);
            footerRef.value?.classList.remove("edit");
            emits("onAfterCreate", res);
            router.push({
              name: "crm-deal-detail",
              params: {
                deal_id: res.id,
              },
            });
          })
          .finally(() => {
            loading.value = false;
          });
      } else if (props.type == "update" && "id" in props.formValue) {
        dealsApi
          .update(props.formValue.id, props.formValue)
          .then(() => {
            eventBus.$emit("edit-cancel", false);
            footerRef.value?.classList.remove("edit");
            emits("onAfterUpdate");
          })
          .finally(() => {
            loading.value = false;
          });
      }
    } else {
      if (errors[0] && errors[0][0].field?.includes("orders")) {
        activeTab.value = "products";
      } else {
        activeTab.value = "general";
      }
    }
  });
};
const cancelChange = () => {
  eventBus.$emit("edit-cancel", false);
  if (backupFormValue.value) {
    for (let key in props.formValue) {
      if (key === "id") continue;

      const typedKey = key as keyof typeof backupFormValue.value;

      if (!backupFormValue.value[typedKey]) {
        props.formValue[key as keyof typeof props.formValue] = backupFormValue
          .value[typedKey] as never;
      }
    }
  }
  footerRef.value?.classList.remove("edit");
};
watch(
  props.formValue,
  (newVal, oldVal) => {
    if (footerRef.value && !footerRef.value.className.includes("edit"))
      footerRef.value.classList.add("edit");
  },
  { deep: true }
);
onMounted(() => {
  backupFormValue.value = { ...props.formValue };
  if (props.type == "create") {
    footerRef.value?.classList.add("edit");
  }
});
</script>
<style scoped>
#footer-form-crm {
  /* transform: translateY(100%); */
  display: none;
  gap: 10px;
  justify-content: center;
  align-items: center;
  position: sticky;
  bottom: 0px;
  padding: 10px 0;
  backdrop-filter: blur(10px);
}
#footer-form-crm.edit {
  display: flex;
}
</style>
