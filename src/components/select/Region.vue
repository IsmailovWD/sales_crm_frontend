<script setup lang="ts">
import {
  regionsApi,
  type RegionsWithDistrictsAttr,
} from "@/api/main/actions/regionsApi";
import {
  NTreeSelect,
  type TreeSelectOverrideNodeClickBehavior,
} from "naive-ui";
import { onMounted, ref } from "vue";

const loading = ref(false);
const options = ref<RegionsWithDistrictsAttr[]>([]);

type Props = {
  modelValue: {
    region_id: number | null;
    district_id: number | null;
    [key: string]: any;
  };
};
const props = defineProps<Props>();

const getData = async () => {
  loading.value = true;
  regionsApi
    .getAllWithDistricts()
    .then((res) => {
      options.value = res;
    })
    .finally(() => {
      loading.value = false;
    });
};
const override: TreeSelectOverrideNodeClickBehavior = ({ option }) => {
  if (option.children) {
    return "toggleExpand";
  }
  return "default";
};
const updateDistrict = (e: any) => {
  props.modelValue.district_id = e;
  if (props.modelValue.district_id) {
    const region = options.value.find((region) =>
      region.children.find(
        (district) => district.key === props.modelValue.district_id
      )
    );

    const district = region?.children.find(
      (district) => district.key === props.modelValue.district_id
    );
    const regionId = region?.key;
    if (regionId) {
      props.modelValue.region_id = regionId;
    }
    if (district) {
      props.modelValue.district = {
        id: district.key,
        name: district.label,
      };
    }
    if (region) {
      props.modelValue.region = {
        id: region.key,
        name: region.label,
      };
    }
  } else {
    props.modelValue.region_id = null;
  }
};
onMounted(() => {
  getData();
});
</script>

<template>
  <n-tree-select
    style="width: 100%"
    v-model:value="props.modelValue.district_id"
    :loading="loading"
    block-line
    :options="options"
    :show-path="true"
    clearable
    filterable
    check-strategy="child"
    :override-default-node-click-behavior="override"
    :on-update:value="updateDistrict"
  />
</template>
