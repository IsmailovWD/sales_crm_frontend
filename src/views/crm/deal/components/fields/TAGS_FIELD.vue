<template>
  <div style="width: 100%; padding: 3px 0">
    <n-dynamic-tags
      :round="true"
      type="primary"
      :size="props.tagSize"
      :default-value="props.model[`${props.keyValue}`]"
      :on-update:value="(e: any) => (props.model[`${props.keyValue}`] = e)"
      v-if="props.isEdit || edit"
    >
      <template #trigger="{ activate, disabled }">
        <n-space size="small">
          <n-button
            :size="props.buttonSize"
            type="primary"
            dashed
            round
            :disabled="disabled"
            @click="activate()"
          >
            <template #icon>
              <n-icon>
                <Add />
              </n-icon>
            </template>
            {{ props.buttonText }}
          </n-button>
        </n-space>
      </template>
    </n-dynamic-tags>
    <div @click="changeEdit" v-else>
      <n-space size="small">
        <n-tag
          v-for="(tag, index) in props.model[`${props.keyValue}`]"
          :key="index"
          type="primary"
          :size="props.tagSize"
          round
        >
          {{ tag }}
        </n-tag>
        <span v-if="!props.model[`${props.keyValue}`].length">-</span>
      </n-space>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NDynamicTags, NButton, NIcon, NTag, NSpace } from "naive-ui";
import { Add, Close } from "@vicons/ionicons5";
import { ref } from "vue";
import { useEventBus } from "@/eventBus";

type Size = "small" | "medium" | "large";

const eventBus = useEventBus();
const edit = ref(false);
const changeEdit = () => {
  edit.value = !edit.value;
};
type Props = {
  model: any;
  tagSize?: Size;
  buttonSize?: Size;
  buttonText?: string;
  isEdit: boolean;
  keyValue: string;
};

const props = withDefaults(defineProps<Props>(), {
  tagSize: "medium",
  buttonSize: "small",
  buttonText: "",
});
eventBus.$on("edit-cancel", () => {
  edit.value = false;
});
</script>
