<template>
  <div style="padding: 0 10px">
    <div
      style="
        display: grid;
        grid-template-columns: max-content auto max-content;
        gap: 10px;
        align-items: center;
      "
    >
      <div class="custom-bg-light type-list">
        <n-flex size="large">
          <n-button
            :type="route.params.dealTab === 'kanban' ? 'primary' : 'default'"
            text
            size="large"
            :color="route.params.dealTab === 'kanban' ? '' : '#fff'"
            @click="goRoute('kanban')"
          >
            <template #icon>
              <n-icon><Filter24Filled /></n-icon>
            </template>
            {{ t("sidebar.crm-deal-kanban") }}
          </n-button>
          <n-button
            :type="route.params.dealTab === 'list' ? 'primary' : 'default'"
            text
            size="large"
            :color="route.params.dealTab === 'list' ? '' : '#fff'"
            @click="goRoute('list')"
          >
            <template #icon>
              <n-icon><AppsListDetail24Filled /></n-icon>
            </template>
            {{ t("sidebar.crm-deal-list") }}
          </n-button>
          <n-button
            :type="route.params.dealTab === 'calendar' ? 'primary' : 'default'"
            text
            size="large"
            :color="route.params.dealTab === 'calendar' ? '' : '#fff'"
            @click="goRoute('calendar')"
          >
            <template #icon>
              <n-icon><CalendarLtr20Filled /></n-icon>
            </template>
            {{ t("sidebar.crm-deal-calendar") }}
          </n-button>
        </n-flex>
      </div>
      <n-input :theme-overrides="{ borderRadius: '10px' }" size="large">
        <template #prefix>
          <n-icon size="18" :component="Search" />
        </template>
      </n-input>
      <n-button
        @click="
          () =>
            router.push({
              name: 'crm-deal-detail',
              params: { deal_id: 0 },
            })
        "
        type="primary"
        size="large"
        :theme-overrides="{
          borderRadiusLarge: '10px',
        }"
        >{{
          t("add", { name: t("sidebar.crm-deal") })
            .charAt(0)
            .toUpperCase() +
          t("add", { name: t("sidebar.crm-deal") })
            .toLocaleLowerCase()
            .slice(1)
        }}</n-button
      >
    </div>
    <div>
      <!-- <RouterView v-slot="{ Component }"> -->
      <Transition name="child-fade" mode="out-in">
        <component
          :is="currentComponent"
          :key="route.params.dealTab.toString()"
        />
      </Transition>
      <!-- </RouterView> -->
      <!-- <Teleport to="body">
      </Teleport> -->
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  AppsListDetail24Filled,
  CalendarLtr20Filled,
  Filter24Filled,
} from "@vicons/fluent";
import { Search } from "@vicons/ionicons5";
import { NButton, NSpace, NIcon, NFlex, NInput } from "naive-ui";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import listIndex from "./list/Index.vue";
import kanbanIndex from "./kanban/Index.vue";
import calendarIndex from "./calendar/Index.vue";
import { computed } from "vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const currentComponent = computed(() => {
  switch (route.params.dealTab) {
    case "list":
      return listIndex;
    case "kanban":
      return kanbanIndex;
    case "calendar":
      return calendarIndex;
    default:
      return listIndex;
  }
});

const goRoute = (name: string) => {
  router.push({ name: "crm-deal-tabs", params: { dealTab: name } });
};
</script>
<style scoped>
.type-list {
  padding: 4px 16px;
  border-radius: 10px;
}
</style>
