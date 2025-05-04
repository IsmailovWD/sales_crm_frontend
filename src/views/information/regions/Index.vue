<template>
  <div>
    <div style="margin: 10px 0">
      <div style="display: flex; gap: 10px; justify-content: flex-end">
        <n-input
          v-model:value="search"
          :disabled="loading"
          size="large"
          :placeholder="
            t('search', { name: t('sidebar.regions') })
              .toLocaleLowerCase()
              .charAt(0)
              .toUpperCase() +
            t('search', { name: t('sidebar.regions') })
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
          {{ t("add", { name: t("sidebar.regions") }) }}
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
          :data="search ? data.filter((d) => d.name.includes(search)) : data"
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
      :title="'id' in formValues ? t('regions.edit') : t('regions.add')"
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
            {{ "id" in formValues ? t("regions.edit") : t("regions.add") }}
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
  NModal,
  useMessage,
  type MessageReactive,
  NSpace,
} from "naive-ui";
import { computed, h, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { regionsApi } from "@/api/main/actions/regionsApi";
import type { RegionsAttr } from "@/api/main/types";
import { useRoute, useRouter } from "vue-router";
import Form from "./Form.vue";
import { formatCurrency } from "@/utils/formatCurrency";
import xScroll from "@/components/scroll/x-scroll.vue";

const message = useMessage();
const saveBtnDisabled = ref(false);
const formValues = ref<RegionsAttr | Omit<RegionsAttr, "id">>({
  id: "",
  name: "",
});
const modalShow = ref(false);
const router = useRouter();
const route = useRoute();
const search = ref("");
const loading = ref(false);
let msgReactive: MessageReactive | null = null;
const { t } = useI18n();
const columns = computed<DataTableColumn<RegionsAttr>[]>(() => [
  { title: "№", key: "", render: (s, i) => i + 1, width: 80 },
  {
    title:
      t("regions.name").charAt(0).toUpperCase() + t("regions.name").slice(1),
    key: "name",
    resizable: true,
    render: (row) => {
      return h(
        NButton,
        {
          type: "primary",
          size: "small",
          text: true,
          onClick: () => {
            router.push({
              name: "districts",
              params: {
                region_id: row.id,
              },
            });
          },
        },
        { default: () => row.name }
      );
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
const data = ref<RegionsAttr[]>([]);
const getData = () => {
  loading.value = true;
  router.push({
    name: route.name,
    query: {
      search: search.value,
    },
  });
  regionsApi
    .getAll()
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
      data: RegionsAttr;
    };
const openModal = (e: OpenModal) => {
  if (e.type === "add") {
    formValues.value = {
      name: "",
    };
    saveBtnDisabled.value = true;
  } else {
    formValues.value = e.data;
    saveBtnDisabled.value = false;
  }
  modalShow.value = true;
};
const createOrEdit = () => {
  msgReactive = message.create(t("regions.adding"), {
    duration: 0,
    type: "loading",
  });
  if ("id" in formValues.value) {
    regionsApi
      .update(formValues.value.id, formValues.value)
      .then((res) => {
        try {
          const index = data.value.findIndex((item) => item.id === res.id);
          if (index !== -1) data.value.splice(index, 1, res);
        } catch {}
        positiveResponse();
      })
      .catch(() => {
        negativeResponse();
      });
  } else {
    regionsApi
      .create(formValues.value)
      .then((res) => {
        data.value.unshift(res);
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
    msgReactive.content = t("regions.added");
    setTimeout(() => {
      msgReactive?.destroy();
    }, 1000);
  }
};
const negativeResponse = () => {
  if (msgReactive) {
    msgReactive.type = "error";
    msgReactive.content = t("regions.added_error");
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
