<template>
  <div style="width: 100%">
    <div v-if="props.isEdit || edit">
      <n-input-group>
        <n-select
          :default-value="props.model[`${props.keyCodeValue}`]"
          value-field="code"
          label-field="name"
          :options="phoneCountries"
          :render-label="renderLabel"
          :render-tag="renderSelectLabel"
          style="width: 120px"
          :consistent-menu-width="false"
          tabindex="-1"
          :size="props.size"
          :on-update:value="(e:any) => (props.model[`${props.keyCodeValue}`] = e)"
        />
        <n-input
          ref="phoneNumberInp"
          v-model:value="value"
          :size="props.size"
          :onUpdate:value="updatePhoneNumber"
        />
      </n-input-group>
    </div>
    <div @click="changeEdit" v-else>
      <n-text :style="props.textStyle" v-if="props.model[`${props.keyValue}`]"
        >{{ props.model.dial_code }}
        {{
          formatPhoneNumber(
            props.model.country_code,
            props.model[`${props.keyValue}`],
            0
          ).formatted
        }}</n-text
      >
      <span v-else>-</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEventBus } from "@/eventBus";
import { formatPhoneNumber, phoneCountries } from "@/utils/phoneCountries";
import { set } from "@vueuse/core";
import { NInput, NText, type InputInst, NSelect, NInputGroup } from "naive-ui";
import { h, nextTick, onMounted, ref, type CSSProperties } from "vue";

type Props = {
  model: any;
  placeholder?: string;
  size?: "small" | "medium" | "large";
  isEdit: boolean;
  textStyle?: CSSProperties;
  keyCodeValue: string;
  keyValue: string;
};

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
});

const eventBus = useEventBus();
const edit = ref(false);
const phoneNumberInp = ref<InputInst>();
const changeEdit = () => {
  edit.value = !edit.value;
  updatePhoneNumber(value.value);
  setTimeout(() => {
    phoneNumberInp.value?.focus();
  }, 10);
};
const value = ref(props.model[`${props.keyValue}`]);
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
const updatePhoneNumber = (rawValue: string = "") => {
  const inputElement = phoneNumberInp.value?.inputElRef;
  if (!inputElement) return;
  const cursorPos = inputElement.selectionStart || 0;

  // const rawValue = prop.phone_number;

  const { formatted, cursor, dial_code } = formatPhoneNumber(
    props.model[`${props.keyCodeValue}`],
    rawValue,
    cursorPos
  );

  props.model[`${props.keyValue}`] = formatted;
  value.value = formatted;
  props.model.dial_code = dial_code;
  // dialCode.value = dial_code;

  nextTick(() => {
    inputElement.setSelectionRange(cursor, cursor);
  });
};
eventBus.$on("edit-cancel", () => {
  edit.value = false;
});
</script>
<style scoped>
.edit {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
</style>
