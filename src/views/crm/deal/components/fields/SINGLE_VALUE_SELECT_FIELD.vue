<template>
  <div style="width: 100%">
    <n-select
      v-if="props.isEdit || edit"
      label-field="name"
      value-field="id"
      :default-value="props.model[`${props.keyValue}`]"
      :options="props.options"
      :placeholder="props.placeholder"
      :size="props.size"
      ref="slcRef"
      :on-update:value="(e) => (props.model[`${props.keyValue}`] = e)"
      clearable
      :filterable="props.filterable"
    />
    <div @click="changeEdit" v-else>
      <n-text
        :style="props.textStyle"
        v-if="props.model[`${props.keyValue}`]"
        >{{
          props.options.find((i) => i.id == props.model[`${props.keyValue}`])
            ?.name
        }}</n-text
      >
      <span v-else>-</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, type CSSProperties } from "vue";
import { NSelect, type SelectInst, NText } from "naive-ui";
import { useEventBus } from "@/eventBus";

const eventBus = useEventBus();
const slcRef = ref<SelectInst>();
const edit = ref(false);
const changeEdit = () => {
  edit.value = !edit.value;
  setTimeout(() => {
    slcRef.value?.focus();
  }, 10);
};
type Options = {
  id: number;
  name: string;
  [key: string]: any;
};
type Props = {
  model: any;
  isEdit: boolean;
  keyValue: string;
  options: Options[];
  placeholder?: string;
  textStyle?: CSSProperties;
  size?: "small" | "medium" | "large";
  filterable?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  size: "medium",
});
eventBus.$on("edit-cancel", () => {
  edit.value = false;
});
</script>
