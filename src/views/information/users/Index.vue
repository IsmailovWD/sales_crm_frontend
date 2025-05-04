<template>
  <div>
    <div style="margin: 10px 0">
      <div style="display: flex; gap: 10px; justify-content: flex-end">
        <n-input
          v-model:value="search"
          :disabled="loading"
          size="large"
          :placeholder="
            t('search', { name: t('sidebar.users') })
              .toLocaleLowerCase()
              .charAt(0)
              .toUpperCase() +
            t('search', { name: t('sidebar.users') })
              .toLocaleLowerCase()
              .slice(1)
          "
          style="width: 300px"
          clearable
          @change="getUsers"
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
          {{ t("add", { name: t("sidebar.users") }) }}
        </n-button>
        <n-button
          @click="
            () => {
              pagination.page = 1;
              pagination.pageSize = 50;
              getUsers();
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
              getUsers();
            }
          "
          :on-update:page="
            (e) => {
              pagination.page = e;
              getUsers();
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
      :title="'id' in formValues ? t('user.edit') : t('user.add')"
      transform-origin="center"
      :mask-closable="false"
    >
      <Form @close-modal="closeModal" :formValue="formValues" />
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
import { userApi } from "@/api/main/actions/userApi";
import type { UserAttr } from "@/api/main/types";
import { useRoute, useRouter } from "vue-router";
import Form from "./Form.vue";
import { formatCurrency } from "@/utils/formatCurrency";
import xScroll from "@/components/scroll/x-scroll.vue";

const formValues = ref<UserAttr | Omit<UserAttr, "id">>({
  fullName: "",
  username: "",
  password: "",
  salary: 0,
  sales_kpi: 0,
});
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
const columns = computed<DataTableColumn<UserAttr>[]>(() => [
  { title: "№", key: "", render: (s, i) => i + 1, width: 80 },
  { title: t("user.fullName"), key: "fullName", resizable: true },
  { title: t("user.username"), key: "username", resizable: true },
  {
    title: t("user.salary"),
    key: "salary",
    resizable: true,
    render: (s) => {
      return formatCurrency(s.salary || 0);
    },
  },
  {
    title: t("user.sales_kpi"),
    key: "sales_kpi",
    resizable: true,
    render: (s) => {
      return formatCurrency(s.sales_kpi || 0);
    },
  },
  // {
  //   title: t("products.price"),
  //   key: "price",
  //   resizable: true,
  //   width: 200,
  //   render: (s) => {
  //     return formatCurrency(s.price);
  //   },
  // },
  // {
  //   title: t("products.body_summa"),
  //   key: "body_summa",
  //   resizable: true,
  //   width: 200,
  //   render: (s) => {
  //     return formatCurrency(s.body_summa);
  //   },
  // },
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
const data = ref<UserAttr[]>([]);
const getUsers = () => {
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
  userApi
    .getAll(pagination.value.pageSize, pagination.value.page, search.value)
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
      data: UserAttr;
    };
const openModal = (e: OpenModal) => {
  if (e.type === "add") {
    formValues.value = {
      fullName: "",
      username: "",
      password: "",
      salary: 0,
      sales_kpi: 0,
    };
  } else {
    formValues.value = e.data;
  }
  modalShow.value = true;
};
const closeModal = (e?: UserAttr) => {
  if (e) {
    if ("id" in formValues.value) {
      const index = data.value.findIndex((i) => i.id === e.id);
      if (index === -1) return;
      data.value.splice(index, 1, e);
    } else {
      if (pagination.value.page === 1) {
        data.value.unshift(e);
      } else {
        pagination.value.page = 1;
        search.value = "";
        getUsers();
      }
    }
  }
  modalShow.value = false;
};
onMounted(() => {
  if (route.query.search) search.value = route.query.search as string;
  if (route.query.page) pagination.value.page = Number(route.query.page);
  if (route.query.pageSize)
    pagination.value.pageSize = Number(route.query.pageSize);
  getUsers();
});
</script>
