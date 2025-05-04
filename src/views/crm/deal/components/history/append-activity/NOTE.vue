<template>
  <div>
    <n-form ref="formRef" :model="data" :rules="rules">
      <n-form-item path="metadata.note" :label="t('deals.note.write note')">
        <n-input type="textarea" v-model:value="data.metadata.note" />
      </n-form-item>
      <n-form-item :show-label="false">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          "
        >
          <div></div>
          <n-checkbox v-model:checked="data.is_pin">
            {{ t("deals.task.pin") }}
          </n-checkbox>
        </div>
      </n-form-item>
      <n-button :loading="loading" block type="primary" @click="createnote">{{
        t("deals.note.save_note")
      }}</n-button>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import {
  type DealActivityAttr,
  type NoteMetadataAttr,
  DealActivityType,
} from "@/api/main/types";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  NInput,
  NForm,
  NFormItem,
  NButton,
  type FormRules,
  type SelectOption,
  type FormInst,
  NCheckbox,
} from "naive-ui";
import { useRoute } from "vue-router";
import { Notifications } from "@vicons/ionicons5";
import { dealActivityApi } from "@/api/main/actions/dealActivityApi";

const nowDate = new Date();
nowDate.setHours(nowDate.getHours() + 1, 0, 0, 0);

export interface DealActivityAttrFornote
  extends Omit<DealActivityAttr, "id" | "metadata"> {
  metadata: NoteMetadataAttr;
}
const emits = defineEmits({
  add: (data: DealActivityAttr) => true,
});
const loading = ref(false);
const formRef = ref<FormInst>();
const { t } = useI18n();
const route = useRoute();
const rules: FormRules = {
  metadata: {
    note: {
      type: "string",
      required: true,
      trigger: ["blur", "change"],
      message: () =>
        t("input_errors.{name} is required", {
          name: t("deals.history.note"),
        }),
    },
  },
};
const options: SelectOption[] = [
  {
    label: "5m",
    value: 5 * 60 * 1000, // 5m
  },
  {
    label: "30m",
    value: 30 * 60 * 1000, // 30m
  },
  {
    label: "1h",
    value: 1 * 60 * 60 * 1000, // 1h
  },
  {
    label: "2h",
    value: 2 * 60 * 60 * 1000, // 2h
  },
];
const data = ref<DealActivityAttrFornote>({
  deal_id: Number(route.params.deal_id as string),
  type: DealActivityType.NOTE,
  user_id: null,
  is_pin: false,
  metadata: {
    note: "",
  },
});
const dateDisabled = (ts: number) => {
  const date = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  return ts < date;
};

const createnote = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true;
      dealActivityApi
        .createActivity(data.value)
        .then((res) => {
          emits("add", res);
          data.value.metadata.note = "";
          data.value.is_pin = false;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
</script>
