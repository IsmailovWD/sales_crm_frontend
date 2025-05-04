<template>
  <div style="width: 100%">
    <Region v-if="props.isEdit || edit" :model-value="props.model"></Region>
    <div @click="changeEdit" v-else>
      <n-text
        :style="props.textStyle"
        v-if="props.model.region || props.model.district"
        >{{ props.model.region ? `${props.model.region.name} - ` : ""
        }}{{ props.model.district ? props.model.district.name : "" }}</n-text
      >
      <span v-else>-</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, type CSSProperties } from "vue";
import { NText } from "naive-ui";
import { useEventBus } from "@/eventBus";
import Region from "@/components/select/Region.vue";

const eventBus = useEventBus();
const edit = ref(false);
const changeEdit = () => {
  edit.value = !edit.value;
};

type Props = {
  model: any;
  isEdit: boolean;
  textStyle?: CSSProperties;
};

const props = withDefaults(defineProps<Props>(), {});
eventBus.$on("edit-cancel", () => {
  edit.value = false;
});
</script>
