<template>
  <div>
    <div style="margin: 10px 0">
      <div style="display: flex; gap: 10px; justify-content: flex-end">
        <n-input
          v-model:value="search"
          :disabled="loading"
          size="large"
          :placeholder="
            t('search', { name: t('sidebar.products') })
              .toLocaleLowerCase()
              .charAt(0)
              .toUpperCase() +
            t('search', { name: t('sidebar.products') })
              .toLocaleLowerCase()
              .slice(1)
          "
          style="width: 300px"
          clearable
          @change="getProducts"
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
          {{ t("add", { name: t("sidebar.products") }) }}
        </n-button>
        <n-button
          @click="
            () => {
              pagination.page = 1;
              pagination.pageSize = 50;
              getProducts();
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
              getProducts();
            }
          "
          :on-update:page="
            (e) => {
              pagination.page = e;
              getProducts();
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
      :title="'id' in formValues ? t('products.edit') : t('products.add')"
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
            {{ "id" in formValues ? t("products.edit") : t("products.add") }}
          </n-button>
        </div>
      </template>
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
  useMessage,
  type MessageReactive,
  NSpace,
} from "naive-ui";
import { computed, h, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { productsApi } from "@/api/main/actions/productsApi";
import type { ProductsAttr } from "@/api/main/types";
import { useRoute, useRouter } from "vue-router";
import Form from "./Form.vue";
import { formatCurrency } from "@/utils/formatCurrency";
import xScroll from "@/components/scroll/x-scroll.vue";

const message = useMessage();
const saveBtnDisabled = ref(false);
const formValues = ref<ProductsAttr | Omit<ProductsAttr, "id">>({
  name: "",
  price: 0,
  body_summa: 0,
});
const modalShow = ref(false);
const router = useRouter();
const route = useRoute();
const search = ref("");
const loading = ref(false);
let msgReactive: MessageReactive | null = null;
const pagination = ref({
  page: 1,
  pageSize: 50,
  page_count: 0,
  page_sizes: [50, 100, 150, 200],
  total_count: 0,
});
const { t } = useI18n();
const columns = computed<DataTableColumn<ProductsAttr>[]>(() => [
  { title: "№", key: "", render: (s, i) => i + 1, width: 80 },
  { title: t("products.name"), key: "name", resizable: true },
  {
    title: t("products.price"),
    key: "price",
    resizable: true,
    width: 200,
    render: (s) => {
      return formatCurrency(s.price);
    },
  },
  {
    title: t("products.body_summa"),
    key: "body_summa",
    resizable: true,
    width: 200,
    render: (s) => {
      return formatCurrency(s.body_summa);
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
const data = ref<ProductsAttr[]>([]);
const getProducts = () => {
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
  productsApi
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
      data: ProductsAttr;
    };
const openModal = (e: OpenModal) => {
  if (e.type === "add") {
    formValues.value = {
      name: "",
      price: 0,
      body_summa: 0,
    };
    saveBtnDisabled.value = true;
  } else {
    formValues.value = e.data;
    saveBtnDisabled.value = false;
  }
  modalShow.value = true;
};
const createOrEdit = () => {
  msgReactive = message.create(t("products.adding"), {
    duration: 0,
    type: "loading",
  });
  if ("id" in formValues.value) {
    productsApi
      .update(formValues.value.id, formValues.value)
      .then((res) => {
        try {
          positiveResponse();
          const index = data.value.findIndex((item) => item.id === res.id);
          if (index !== -1) data.value.splice(index, 1, res);
        } catch {}
      })
      .catch(() => {
        negativeResponse();
      });
  } else {
    productsApi
      .create(formValues.value)
      .then((res) => {
        if (pagination.value.page === 1) {
          data.value.unshift(res);
        } else {
          pagination.value.page = 1;
          search.value = "";
          getProducts();
        }
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
    msgReactive.content = t("products.added");
    setTimeout(() => {
      msgReactive?.destroy();
    }, 1000);
  }
};
const negativeResponse = () => {
  if (msgReactive) {
    msgReactive.type = "error";
    msgReactive.content = t("products.added_error");
    setTimeout(() => {
      msgReactive?.destroy();
    }, 1000);
  }
};
onMounted(() => {
  if (route.query.search) search.value = route.query.search as string;
  if (route.query.page) pagination.value.page = Number(route.query.page);
  if (route.query.pageSize)
    pagination.value.pageSize = Number(route.query.pageSize);
  getProducts();
});
</script>
