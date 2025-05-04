<template>
  <div style="display: grid; gap: 10px; grid-template-columns: 500px 1fr 100px">
    <div>
      <ABOUT_SECTION
        :rules="props.rules"
        :form-value="props.formValue"
      ></ABOUT_SECTION>
      <br />
      <CONTACT_SECTION :form-value="props.formValue"></CONTACT_SECTION>
    </div>
    <div>
      <USER_SECTION :form-value="props.formValue"></USER_SECTION>
      <br />
      <DELIVERY_SECTION :form-value="props.formValue"></DELIVERY_SECTION>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DealAttr } from "@/api/main/types";
import {
  ABOUT_SECTION,
  CONTACT_SECTION,
  DELIVERY_SECTION,
  USER_SECTION,
} from "./sections";
import type { FormRules } from "./fields";

type Props = {
  formValue: Omit<DealAttr, "id">;
  rules?: FormRules;
};

const props = defineProps<Props>();
</script>
