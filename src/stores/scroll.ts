import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useScrollStore = defineStore("scroll", () => {
  const scrollTop = ref<number>(0);

  const setScrollTop = (value: number) => {
    scrollTop.value = value;
  };

  return { scrollTop, setScrollTop };
});
