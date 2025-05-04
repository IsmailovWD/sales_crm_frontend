import { App } from "vue";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $formatCurrency: (
      value: number | null | string,
      minimumFractionDigits?: number
    ) => string;
    $parseCurrency: (input: string | number) => number | null;
  }
}
