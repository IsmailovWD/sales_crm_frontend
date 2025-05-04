<template>
  <div ref="domRef" style="padding: 0 10px">
    <n-card
      size="small"
      :bordered="false"
      class="card-item"
      :theme-overrides="{
        borderRadius: '10px',
        paddingSmall: '0',
      }"
    >
      <n-menu
        class="custom-style-menu"
        v-model:value="activeKey"
        mode="horizontal"
        :options="menuOptions"
        responsive
        :theme-overrides="{
          itemColorActive: 'var(--menu-active-bg)',
          itemTextColorActive: 'var(--menu-active-text)',
          itemIconColorActive: 'var(--menu-active-text)',
          itemColorActiveHover: 'var(--menu-active-hover-bg)',
          itemTextColorActiveHover: 'var(--menu-active-text)',
          itemIconColorActiveHover: 'var(--menu-active-text)',
          itemColorActiveCollapsed: 'var(--menu-active-bg)',
          itemIconColor: 'var(--navbar-color)',
          itemTextColor: 'var(--navbar-color)',
          itemColorHover: 'var(--menu-hover-bg)',
          itemTextColorHover: 'var(--navbar-color)',
          itemIconColorHover: 'var(--navbar-color)',
          itemIconColorCollapsed: 'var(--navbar-color)',
          fontSize: '14px',
          itemHeight: '60px',
        }"
        @update:value="
          (e) => {
            router.push({ name: e }).finally(() => {
              activeKey = e;
            });
          }
        "
      />
    </n-card>
    <div>
      <RouterView v-slot="{ Component }">
        <Transition :name="'child-fade'" :mode="'out-in'">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NCard, NMenu } from "naive-ui";
import { getMenuChild } from "@/composables/useMenu";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const domRef = ref<HTMLDivElement>();
const route = useRoute();
const router = useRouter();
const menuOptions = getMenuChild("information");
const activeKey = ref<string>(route.name as string);

const scrollTo = () => {
  domRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
onMounted(() => {
  activeKey.value = route.name as string;
  // if (route.name == 'information' && menuOptions.value.length > 0) {
  //     router.push({ name: menuOptions.value[0].key })
  //     activeKey.value = menuOptions.value[0].key
  // }
  scrollTo();
});
</script>
