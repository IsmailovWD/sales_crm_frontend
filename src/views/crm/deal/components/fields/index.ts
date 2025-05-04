import TAGS_FIELD from "./TAGS_FIELD.vue";
import TEXT_FIELD from "./TEXT_FIELD.vue";
import SINGLE_VALUE_SELECT_FIELD from "./SINGLE_VALUE_SELECT_FIELD.vue";
import PHONE_NUMBER_FIELD from "./PHONE_NUMBER_FIELD.vue";
import TIMESTAMP_FIELD from "./TIMESTAMP_FIELD.vue";
import REGION_FIELD from "./REGION_FIELD.vue";
export type Rules = {
  required: boolean;
  message?: string | (() => string);
  trigger: string[];
  validator?: (rule: any, value: any, callback: any) => void;
};
export type FormRules<T = any> = {
  [key in keyof T]?: Rules | FormRules | FormRules<T[key]>;
};
export {
  TAGS_FIELD,
  TEXT_FIELD,
  SINGLE_VALUE_SELECT_FIELD,
  PHONE_NUMBER_FIELD,
  TIMESTAMP_FIELD,
  REGION_FIELD,
};
