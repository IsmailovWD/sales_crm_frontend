import { ref, computed } from "vue";
import { defineStore } from "pinia";

export type ErrorStoreType =
  | {
      new: true;
      message: string;
      errors?: string[];
    }
  | {
      new: false;
      message: null;
      errors?: undefined;
    };

export const useErrorStore = defineStore("error", () => {
  const error = ref<ErrorStoreType>({
    message: null,
    new: false,
  });

  const globalLoading = ref(false);

  const setError = ({ message, errors }: ErrorStoreType) => {
    error.value.new = true;
    error.value.message = message;
    error.value.errors = errors;
  };

  const clearError = () => {
    error.value.new = false;
    error.value.message = null;
    error.value.errors = undefined;
  };

  return { error, setError, clearError, globalLoading };
});
