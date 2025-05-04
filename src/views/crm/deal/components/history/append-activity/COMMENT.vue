<template>
  <div>
    <n-form ref="formRef" :model="data" :rules="rules">
      <n-form-item
        path="metadata.comment"
        :label="t('deals.comment.write comment')"
      >
        <n-input type="textarea" v-model:value="data.metadata.comment" />
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
      <n-button
        :loading="loading"
        block
        type="primary"
        @click="createComment"
        >{{ t("deals.comment.save_comment") }}</n-button
      >
    </n-form>
  </div>
</template>

<script setup lang="ts">
import {
  type DealActivityAttr,
  type CommentMetadataAttr,
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

export interface DealActivityAttrForComment
  extends Omit<DealActivityAttr, "id" | "metadata"> {
  metadata: CommentMetadataAttr;
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
    comment: {
      type: "string",
      required: true,
      trigger: ["blur", "change"],
      message: () =>
        t("input_errors.{name} is required", {
          name: t("deals.history.comment"),
        }),
    },
  },
};
const data = ref<DealActivityAttrForComment>({
  deal_id: Number(route.params.deal_id as string),
  type: DealActivityType.COMMENT,
  user_id: null,
  is_pin: false,
  metadata: {
    comment: "",
  },
});
const dateDisabled = (ts: number) => {
  const date = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  return ts < date;
};

const createComment = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true;
      dealActivityApi
        .createActivity(data.value)
        .then((res) => {
          emits("add", res);
          data.value.metadata.comment = "";
          data.value.is_pin = false;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
</script>
