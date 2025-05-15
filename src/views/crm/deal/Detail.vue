<template>
  <n-drawer
    v-model:show="active"
    :default-width="'calc(100% - 100px)'"
    :placement="'right'"
    v-on:after-leave="
      router.push({
        name: 'crm-deal-tabs',
        params: { dealTab: route.params.dealTab.toString() },
      })
    "
    resizable
  >
    <n-drawer-content
      closable
      class="custom-drawer"
      :body-content-style="{
        padding: '0px 15px',
      }"
    >
      <template #header>
        {{
          route.params.deal_id !== "0"
            ? t("sidebar.crm-deal-update")
            : t("sidebar.crm-deal-create")
        }}
      </template>
      <n-spin :show="loading">
        <div style="min-height: calc(100vh - 160px)">
          <deal-form
            v-if="!loading"
            :type="data.type"
            :form-value="data.data"
            @on-after-create="onAfterCreate"
            @on-after-update="onAfterUpdate"
          />
        </div>
      </n-spin>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import DealForm from "./Form.vue";
import type { DealAttr } from "@/api/main/types";
import { useDataStore } from "@/stores/data";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { NDrawer, NDrawerContent, NSpin } from "naive-ui";
import { dealsApi } from "@/api/main/actions/dealsApi";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const active = ref(false);
const loading = ref(false);

const data = ref<
  | {
      type: "update";
      data: DealAttr;
    }
  | {
      type: "create";
      data: Omit<DealAttr, "id">;
    }
>({
  type: "create",
  data: {
    title: null,
    contact_id: null,
    stage_id: null,
    summa: 0,
    tags: [],
    contact: {
      name: "",
      phone_number: "",
      is_client: true,
      is_supplier: false,
      dial_code: "+998",
      country_code: "UZ",
      region_id: null,
      district_id: null,
    },
    orders: [],
    address: null,
    comment: null,
    deliveryman_id: null,
    delivery_date: null,
    region_id: null,
    district_id: null,
    location: [],
  },
});
const getData = () => {
  loading.value = true;
  if (route.params.deal_id && route.params.deal_id != "0") {
    Promise.all([
      dataStore.getData("crmStagesList"),
      dealsApi.getById(route.params.deal_id as string),
      dataStore.getData("productListWithBalance"),
      dataStore.getData("deliveryManList"),
      dataStore.getData("userList"),
    ]).then(([crmStagesList, crmLead]) => {
      data.value.data = crmLead;
      data.value.type = "update";
      data.value.data.stage_id =
        crmStagesList.find((item) => item.key == "new")?.id || null;
      loading.value = false;
    });
  } else {
    Promise.all([
      dataStore.getData("crmStagesList"),
      dataStore.getData("productListWithBalance"),
    ]).then(([crmStagesList]) => {
      data.value.type = "create";
      data.value.data.stage_id =
        crmStagesList.find((item) => item.key == "new")?.id || null;
      loading.value = false;
    });
  }
};
const onAfterCreate = (attr: DealAttr) => {
  data.value = {
    type: "update",
    data: {
      id: attr.id,
      ...data.value.data,
    },
  };
};
const onAfterUpdate = () => {
  // active.value = false;
};
onMounted(() => {
  active.value = true;
  getData();
});
</script>
