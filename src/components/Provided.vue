<template>
  <NConfigProvider
    :theme-overrides="
      theme == 'dark' ? darkThemeOverrides : lightThemeOverrides
    "
    :theme="theme == 'dark' ? darkTheme : null"
  >
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-notification-provider>
          <n-message-provider>
            <App></App>
          </n-message-provider>
        </n-notification-provider>
      </n-loading-bar-provider>
    </n-dialog-provider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NLoadingBarProvider,
} from "naive-ui";
import { computed, onMounted, ref } from "vue";
import {
  NConfigProvider,
  type GlobalThemeOverrides,
  darkTheme,
} from "naive-ui";
import { useEventBus } from "@/eventBus";
import { useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import App from "@/App.vue";

const themeStore = useThemeStore();
const route = useRoute();
const eventBus = useEventBus();
const theme = ref<"light" | "dark">("light");

const themeOverrides = ref<GlobalThemeOverrides>({
  common: {
    borderRadius: "4px",
  },
});
// gb(24, 24, 28)
const darkThemeOverrides = ref<GlobalThemeOverrides>({
  ...themeOverrides.value,
  Menu: {
    itemColorActive: "var(--menu-active-bg)",
    itemTextColorActive: "var(--menu-active-text)",
    itemIconColorActive: "var(--menu-active-text)",
    itemColorActiveHover: "var(--menu-active-hover-bg)",
    itemTextColorActiveHover: "var(--menu-active-text)",
    itemIconColorActiveHover: "var(--menu-active-text)",
    itemColorActiveCollapsed: "var(--menu-active-bg)",
    itemIconColor: "var(--menu-active-text)",
    itemTextColor: "var(--menu-active-text)",
    itemColorHover: "var(--menu-hover-bg)",
    itemTextColorHover: "var(--menu-active-text)",
    itemIconColorHover: "var(--menu-active-text)",
    itemIconColorCollapsed: "var(--menu-active-text)",
  },
});

const lightThemeOverrides = ref<GlobalThemeOverrides>({
  ...themeOverrides.value,
  Layout: {
    color: "#f5f7f9",
  },
  Menu: {
    itemColorActive: "var(--menu-active-bg)",
    itemTextColorActive: "var(--menu-active-text)",
    itemIconColorActive: "var(--menu-active-text)",
    itemColorActiveHover: "var(--menu-active-hover-bg)",
    itemTextColorActiveHover: "var(--menu-active-text)",
    itemIconColorActiveHover: "var(--menu-active-text)",
    itemColorActiveCollapsed: "var(--menu-active-bg)",
    itemIconColor: "#fff",
    itemTextColor: "#fff",
    itemColorHover: "var(--menu-hover-bg)",
    itemTextColorHover: "#fff",
    itemIconColorHover: "#fff",
    itemIconColorCollapsed: "#fff",
  },
  Drawer: {
    color: "#f5f7f9",
  },
});
const changeTheme = (value: string) => {
  if (value == "auto") {
    theme.value = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } else {
    theme.value = value as "light" | "dark";
  }
  themeStore.setTheme(theme.value);
};

eventBus.$on("changeTheme", changeTheme);

onMounted(() => {
  changeTheme(localStorage.getItem("theme") || "light");
});
</script>
