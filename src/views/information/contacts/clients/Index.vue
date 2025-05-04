<template>
  <div>
    <div style="margin: 10px 0">
      <div style="display: flex; gap: 10px; justify-content: flex-end">
        <n-input
          v-model:value="search"
          :disabled="loading"
          size="large"
          :placeholder="
            t('search', { name: t('sidebar.clients') })
              .toLocaleLowerCase()
              .charAt(0)
              .toUpperCase() +
            t('search', { name: t('sidebar.clients') })
              .toLocaleLowerCase()
              .slice(1)
          "
          style="width: 300px"
          clearable
          @change="getData"
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
          {{ t("add", { name: t("sidebar.clients") }) }}
        </n-button>
        <n-button
          @click="
            () => {
              pagination.page = 1;
              pagination.pageSize = 50;
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
          :data="data"
          :single-line="false"
          :pagination="false"
        />
      </xScroll>
      <div
        style="
          padding: 10px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          bottom: 0px;
          backdrop-filter: blur(10px);
        "
      >
        <div>
          {{
            t("showing {start}-{end} of {total} total items", {
              start: (pagination.page - 1) * pagination.pageSize || 1,
              end: (pagination.page - 1) * pagination.pageSize + data.length,
              total: pagination.total_count,
            })
          }}
        </div>
        <n-pagination
          :disabled="loading"
          v-model:page="pagination.page"
          v-model:page-size="pagination.pageSize"
          v-model:page-count="pagination.page_count"
          v-model:page-sizes="pagination.page_sizes"
          show-quick-jumper
          show-size-picker
          :on-update:page-size="
            (e) => {
              pagination.page = 1;
              pagination.pageSize = e;
              getData();
            }
          "
          :on-update:page="
            (e) => {
              pagination.page = e;
              getData();
            }
          "
        ></n-pagination>
      </div>
    </n-card>
    <n-modal
      v-model:show="modalShow"
      class="custom-card"
      preset="card"
      :style="{ width: '600px' }"
      :title="
        formValues && 'id' in formValues ? t('clients.edit') : t('clients.add')
      "
      transform-origin="center"
      :mask-closable="false"
    >
      <Form
        @closeModal="closeModal"
        :formValue="formValues"
        v-if="formValues"
      />
    </n-modal>
  </div>
</template>
<script setup lang="ts">
import { Add24Regular, Edit24Filled } from "@vicons/fluent";
import { Reload, Search, Trash } from "@vicons/ionicons5";
import {
  NCard,
  NButton,
  NIcon,
  NInput,
  type DataTableColumn,
  NDataTable,
  NPagination,
  NModal,
} from "naive-ui";
import { computed, h, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { contactsApi } from "@/api/main/actions/contactsApi";
import type { ContactsAttr } from "@/api/main/types";
import { useRoute, useRouter } from "vue-router";
import Form from "./Form.vue";
import xScroll from "@/components/scroll/x-scroll.vue";
import { formatPhoneNumber } from "@/utils/phoneCountries";

const saveBtnDisabled = ref(false);
const formValues = ref<ContactsAttr | Omit<ContactsAttr, "id">>();
const modalShow = ref(false);
const router = useRouter();
const route = useRoute();
const search = ref("");
const loading = ref(false);
const pagination = ref({
  page: 1,
  pageSize: 50,
  page_count: 0,
  page_sizes: [50, 100, 150, 200],
  total_count: 0,
});
const { t } = useI18n();
const columns = computed<DataTableColumn<ContactsAttr>[]>(() => [
  { title: "№", key: "", render: (s, i) => i + 1, width: 80 },
  { title: t("clients.name"), key: "name", resizable: true },
  {
    title: t("clients.address"),
    key: "",
    resizable: true,
    render: (row) => {
      return `${row.region?.name} - ${row.district?.name}`;
    },
  },
  {
    title: t("clients.phone"),
    key: "phone_number",
    resizable: true,
    width: 200,
    render: (row) => {
      const { formatted } = formatPhoneNumber(
        row.country_code,
        row.phone_number,
        0
      );
      return row.dial_code + " " + formatted;
    },
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
const data = ref<ContactsAttr[]>([]);
const getData = () => {
  loading.value = true;
  if (search.value) pagination.value.page = 1;
  router.push({
    name: route.name,
    query: {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: search.value,
    },
  });
  contactsApi
    .getAllClients(
      pagination.value.pageSize,
      pagination.value.page,
      search.value
    )
    .then((res) => {
      data.value = res.data;
      pagination.value.page_count = Math.ceil(
        res.count / pagination.value.pageSize
      );
      pagination.value.total_count = res.count;
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
      data: ContactsAttr;
    };
const openModal = (e: OpenModal) => {
  if (e.type === "add") {
    formValues.value = {
      name: "",
      is_client: true,
      is_supplier: false,
      phone_number: "",
      dial_code: "+998",
      country_code: "UZ",
      district_id: null,
      region_id: null,
    };
    saveBtnDisabled.value = true;
  } else {
    formValues.value = { ...e.data };
    saveBtnDisabled.value = false;
  }
  modalShow.value = true;
};
const closeModal = ({
  data: value,
  type,
}: {
  data: ContactsAttr;
  type: "add" | "edit";
}) => {
  if (type === "edit") {
    const index = data.value.findIndex((item) => item.id === value.id);
    if (index !== -1) data.value.splice(index, 1, value);
  } else if (type === "add") {
    if (pagination.value.page === 1) {
      data.value.unshift(value);
    } else {
      pagination.value.page = 1;
      search.value = "";
      getData();
    }
  }
  modalShow.value = false;
};
onMounted(() => {
  if (route.query.search) search.value = route.query.search as string;
  if (route.query.page) pagination.value.page = Number(route.query.page);
  if (route.query.pageSize)
    pagination.value.pageSize = Number(route.query.pageSize);
  getData();
});
</script>
