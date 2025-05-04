<template>
  <n-space vertical>
    <n-layout has-sider position="absolute">
      <n-layout-sider
        :bordered="false"
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :show-trigger="false"
        :inverted="inverted"
        trigger-class="trigger"
        :collapsed="collapsed"
        @update-collapsed="(e) => (collapsed = e)"
      >
        <n-scrollbar style="max-height: 100vh">
          <div style="padding: 10px; width: max-content">
            <div
              style="
                display: flex;
                align-items: center;
                gap: 5px;
                justify-content: start;
              "
            >
              <img
                :class="`logo ${collapsed ? 'active' : ''}`"
                :src="shopOptions[0].label"
              />
              <Transition name="title-animations">
                <n-text
                  :theme-overrides="{
                    textColor: '#fff',
                  }"
                  v-if="!collapsed"
                  style="
                    font-size: 24px;
                    line-height: 22px;
                    white-space: nowrap;
                    letter-spacing: 1px;
                    font-weight: 400;
                  "
                >
                  {{ shopOptions[0]?.value }}
                </n-text>
              </Transition>
            </div>
          </div>
          <n-menu
            :inverted="inverted"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :default-value="defaultValue"
            :collapsed="collapsed"
            @update:value="router.push({ name: $event })"
          />
        </n-scrollbar>
      </n-layout-sider>
      <n-layout>
        <div @scroll="handleScroll" class="layout-content">
          <GlobalHeader></GlobalHeader>
          <RouterView v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <KeepAlive v-if="route.meta.keepAlive">
                <component :is="Component" />
              </KeepAlive>
              <component v-else :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script setup lang="ts">
import {
  NSpace,
  NLayout,
  NLayoutSider,
  NMenu,
  NScrollbar,
  NText,
} from "naive-ui";
import { h, onMounted, ref } from "vue";
import GlobalHeader from "../header/global-header/index.vue";
import type { SelectMixedOption } from "naive-ui/es/select/src/interface";
import useMenu from "../../composables/useMenu";
import { useEventBus } from "@/eventBus";
import { useRoute, useRouter } from "vue-router";
import { useSocket } from "@/composables/useSocket";
import { testSocket } from "@/socket";

// useSocket(testSocket, 'test', (data) => {
//     console.log(data)
// })

const route = useRoute();
const router = useRouter();
const eventBus = useEventBus();
const { menuOptions } = useMenu();
const collapsed = ref(true);
const shop = ref(1);
const inverted = ref(false);
const defaultValue = ref<string>(
  typeof route.path === "string" ? route.path.split("/")[1] : ""
);
type shopOptionsType = {
  value: string;
  label: string;
} & SelectMixedOption;
const shopOptions = ref<shopOptionsType[]>([
  {
    key: 1,
    value: "ext sales",
    label: "/logo.svg",
    render() {
      return h(
        "div",
        {
          style: {
            cursor: "pointer",
            padding: "10px",
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
            gap: "5px",
          },
        },
        [
          h("img", {
            src: "/logo.svg",
            width: "15",
          }),
          h(NText, {}, { default: () => "ext sales" }),
        ]
      );
    },
  },
]);
const handleScroll = (e: Event) => {
  const container = e.target as HTMLDivElement;
  eventBus.$emit("changeScrollTop", container.scrollTop);
};
eventBus.$on("toggleCollapsed", () => {
  collapsed.value = !collapsed.value;
});
onMounted(() => {
  // testSocket.emit('sendMessage', {
  //     message: 'hello'
  // })
});
</script>
<style scoped>
.layout-content {
  /* background: var(--layout-bg); */
  max-height: 100vh;
  overflow: auto;
}

.title-animations-enter-active,
.title-animations-leave-active {
  transition: opacity 0.3s ease;
  transform-origin: left;
}

.title-animations-enter-from,
.title-animations-leave-to {
  opacity: 0;
}

.logo {
  width: 30px;
  transition: all 0.3s ease;
  margin-left: 20px;
}

.logo.active {
  width: 30px;
  margin-left: 5px;
}

.fade-enter-from {
  opacity: 0;
  /* transform: translateX(-50px); */
}

.fade-leave-to {
  opacity: 0;
  /* transform: translateX(50px); */
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease-out;
}
</style>
