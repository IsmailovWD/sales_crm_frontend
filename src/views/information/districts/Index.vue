<template>
  <div>
    <div style="margin: 10px 0">
      <div style="display: flex; gap: 10px; justify-content: space-between">
        <div>
          <n-button
            @click="router.push({ name: 'regions' })"
            text
            color="#fff"
            size="large"
          >
            <template #icon>
              <n-icon :component="ArrowLeft24Regular" />
            </template>
            {{ data.name }}
          </n-button>
        </div>
        <div style="display: flex; gap: 10px">
          <n-input
            v-model:value="search"
            :disabled="loading"
            size="large"
            :placeholder="
              t('search', { name: t('sidebar.districts') })
                .toLocaleLowerCase()
                .charAt(0)
                .toUpperCase() +
              t('search', { name: t('sidebar.districts') })
                .toLocaleLowerCase()
                .slice(1)
            "
            style="width: 300px"
            clearable
          >
            <template #prefix>
              <n-icon size="18" :component="Search" />
            </template>
          </n-input>
          <n-button
            @click="openModal({ type: 'add' })"
            :disabled="loading"
            type="primary"
            size="large"
          >
            <template #icon>
              <n-icon :component="Add24Regular" />
            </template>
            {{ t("add", { name: t("sidebar.districts") }) }}
          </n-button>
          <n-button
            @click="
              () => {
                getData();
              }
            "
            :disabled="loading"
            type="primary"
            size="large"
          >
            <template #icon>
              <n-icon :component="Reload" />
            </template>
          </n-button>
        </div>
      </div>
    </div>
    <n-card
      :theme-overrides="{
        borderRadius: '10px',
        paddingMedium: '15px',
      }"
      style="width: 100%"
    >
      <xScroll>
        <n-data-table
          :loading="loading"
          :columns="columns"
          :data="
            search
              ? data.districts.filter((d) => d.name.includes(search))
              : data.districts
          "
          :single-line="false"
          :pagination="false"
        />
      </xScroll>
    </n-card>
    <n-modal
      v-model:show="modalShow"
      class="custom-card"
      preset="card"
      :style="{ width: '600px' }"
      :title="'id' in formValues ? t('districts.edit') : t('districts.add')"
      transform-origin="center"
      :mask-closable="false"
    >
      <Form
        @change-btn-disabled="(e) => (saveBtnDisabled = e)"
        :formValue="formValues"
      />
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 10px">
          <n-button type="error" @click="modalShow = false">
            {{ t("cancel") }}
          </n-button>
          <n-button
            @click="createOrEdit"
            :disabled="saveBtnDisabled"
            type="primary"
          >
            {{ "id" in formValues ? t("districts.edit") : t("districts.add") }}
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>
<script setup lang="ts">
import { Add24Regular, ArrowLeft24Regular, Edit24Filled } from "@vicons/fluent";
import { Reload, Search, Trash } from "@vicons/ionicons5";
import {
  NCard,
  NButton,
  NIcon,
  NInput,
  type DataTableColumn,
  NDataTable,
  NModal,
  useMessage,
  type MessageReactive,
  NSpace,
} from "naive-ui";
import { computed, h, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  regionsApi,
  type RegionsWithDistrictsAttr,
} from "@/api/main/actions/regionsApi";
import { districtsApi } from "@/api/main/actions/districtsApi";
import type { DistrictsAttr } from "@/api/main/types";
import { useRoute, useRouter } from "vue-router";
import Form from "./Form.vue";
import { formatCurrency } from "@/utils/formatCurrency";
import xScroll from "@/components/scroll/x-scroll.vue";

const message = useMessage();
const saveBtnDisabled = ref(false);
const formValues = ref<DistrictsAttr | Omit<DistrictsAttr, "id">>({
  id: "",
  name: "",
  region_id: "",
});
const modalShow = ref(false);
const router = useRouter();
const route = useRoute();
const search = ref("");
const loading = ref(false);
let msgReactive: MessageReactive | null = null;
const { t } = useI18n();
const columns = computed<DataTableColumn<DistrictsAttr>[]>(() => [
  { title: "№", key: "", render: (s, i) => i + 1, width: 80 },
  {
    title:
      t("districts.name").charAt(0).toUpperCase() +
      t("districts.name").slice(1),
    key: "name",
    resizable: true,
  },
  {
    title: "",
    key: "actions",
    width: 120,
    render: (s) => {
      return h("div", { style: { display: "flex", gap: "5px" } }, [
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            onClick: () =>
              openModal({ type: "edit", data: JSON.parse(JSON.stringify(s)) }),
          },
          { default: () => h(NIcon, null, { default: () => h(Edit24Filled) }) }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            // onClick: () => deleteItem(s),
          },
          { default: () => h(NIcon, null, { default: () => h(Trash) }) }
        ),
      ]);
    },
  },
]);
const data = ref<RegionsWithDistrictsAttr>({
  id: "",
  districts: [],
  name: "",
});
const getData = () => {
  loading.value = true;
  router.push({
    name: route.name,
    query: {
      search: search.value,
    },
  });
  regionsApi
    .getByIdWithDistricts(route.params.region_id as string)
    .then((res) => {
      data.value = res;
    })
    .finally(() => {
      loading.value = false;
    });
};

type OpenModal =
  | {
      type: "add";
    }
  | {
      type: "edit";
      data: DistrictsAttr;
    };
const openModal = (e: OpenModal) => {
  if (e.type === "add") {
    formValues.value = {
      name: "",
      region_id: route.params.region_id as string,
    };
    saveBtnDisabled.value = true;
  } else {
    formValues.value = e.data;
    saveBtnDisabled.value = false;
  }
  modalShow.value = true;
};
const createOrEdit = () => {
  msgReactive = message.create(t("districts.adding"), {
    duration: 0,
    type: "loading",
  });
  if ("id" in formValues.value) {
    districtsApi
      .update(formValues.value.id, formValues.value)
      .then((res) => {
        try {
          const index = data.value.districts.findIndex(
            (item) => item.id === res.id
          );
          if (index !== -1) data.value.districts.splice(index, 1, res);
        } catch {}
        positiveResponse();
      })
      .catch(() => {
        negativeResponse();
      });
  } else {
    districtsApi
      .create(formValues.value)
      .then((res) => {
        data.value.districts.unshift(res);
        positiveResponse();
      })
      .catch(() => {
        negativeResponse();
      });
  }
  modalShow.value = false;
};
const positiveResponse = () => {
  if (msgReactive) {
    msgReactive.type = "success";
    msgReactive.content = t("districts.added");
    setTimeout(() => {
      msgReactive?.destroy();
    }, 1000);
  }
};
const negativeResponse = () => {
  if (msgReactive) {
    msgReactive.type = "error";
    msgReactive.content = t("districts.added_error");
    setTimeout(() => {
      msgReactive?.destroy();
    }, 1000);
  }
};
onMounted(() => {
  if (route.query.search) search.value = route.query.search as string;
  getData();
});
</script>
