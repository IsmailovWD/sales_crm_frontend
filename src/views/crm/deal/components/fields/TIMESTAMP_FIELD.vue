<template>
  <div style="width: 100%; display: flex; flex-direction: column; gap: 2px">
    <n-date-picker
      :size="props.size"
      :placeholder="props.label"
      ref="inpRef"
      v-model:value="inputValue"
      type="date"
      :autofocus="true"
      :onUpdate:value="updateValue"
      clearable
      v-if="props.isEdit || edit"
    />
    <div @click="changeEdit" v-else>
      <n-text :style="props.textStyle" v-if="props.model[props.keyValue]">
        {{ props.model[props.keyValue] }}
      </n-text>
      <span v-else>-</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventBus } from "@/eventBus";
import { NDatePicker, NText, type InputInst } from "naive-ui";
import { ref, nextTick, type CSSProperties } from "vue";
import type { FormRules } from ".";

const eventBus = useEventBus();
const edit = ref(false);
const inpRef = ref<InputInst>();
const isError = ref(false);
const props = defineProps<Props<Record<string, any>>>();
const errorText = ref("");
const inputValue = ref<number | null>(props.model[props.keyValue] ?? null);

const changeEdit = () => {
  edit.value = !edit.value;
  nextTick(() => {
    inpRef.value?.focus();
  });
};

type Props<T> = {
  label?: string;
  size?: "small" | "medium" | "large";
  isEdit: boolean;
  textStyle?: CSSProperties;
  rules?: FormRules<T>;
  model: T;
  keyValue: keyof T;
};

const updateValue = (value: number | null) => {
  props.model[props.keyValue] = value;
};

eventBus.$on("edit-cancel", () => {
  edit.value = false;
});
</script>
