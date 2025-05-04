<template>
  <div>
    <n-form ref="formRef" :model="data" :rules="rules">
      <n-form-item path="metadata.task" :label="t('deals.task.write task')">
        <n-input type="textarea" v-model:value="data.metadata.task" />
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
          <div style="display: flex; align-items: center; gap: 10px">
            <n-date-picker
              v-model:value="data.metadata.due_date"
              type="datetime"
              :is-date-disabled="dateDisabled"
            />
            <n-popselect
              v-model:value="data.metadata.before_due_date"
              multiple
              :options="options"
            >
              <n-badge :value="data.metadata.before_due_date?.length">
                <n-icon size="20">
                  <Notifications></Notifications>
                </n-icon>
              </n-badge>
            </n-popselect>
          </div>
          <n-checkbox v-model:checked="data.is_pin">
            {{ t("deals.task.pin") }}
          </n-checkbox>
        </div>
      </n-form-item>
      <n-button :loading="loading" block type="primary" @click="createTask">{{
        t("deals.task.save_task")
      }}</n-button>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import {
  type DealActivityAttr,
  type TaskMetadataAttr,
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
  NDatePicker,
  NPopselect,
  NIcon,
  NBadge,
  type SelectOption,
  type FormInst,
  NCheckbox,
} from "naive-ui";
import { useRoute } from "vue-router";
import { Notifications } from "@vicons/ionicons5";
import { dealActivityApi } from "@/api/main/actions/dealActivityApi";

const nowDate = new Date();
nowDate.setHours(nowDate.getHours() + 1, 0, 0, 0);

export interface DealActivityAttrForTask
  extends Omit<DealActivityAttr, "id" | "metadata"> {
  metadata: TaskMetadataAttr;
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
    task: {
      type: "string",
      required: true,
      trigger: ["blur", "change"],
      message: () =>
        t("input_errors.{name} is required", { name: t("deals.history.TASK") }),
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
const data = ref<DealActivityAttrForTask>({
  deal_id: Number(route.params.deal_id as string),
  type: DealActivityType.TASK,
  user_id: null,
  is_pin: false,
  metadata: {
    done: false,
    task: "",
    due_date: nowDate.getTime(),
    before_due_date: [],
  },
});
const dateDisabled = (ts: number) => {
  const date = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  return ts < date;
};

const createTask = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true;
      dealActivityApi
        .createActivity(data.value)
        .then((res) => {
          emits("add", res);
          data.value.metadata.task = "";
          data.value.metadata.before_due_date = [];
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
</script>
