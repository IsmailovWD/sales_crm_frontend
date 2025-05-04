import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type {
  DealStagesAttr,
  ProductsAttr,
  DeliveryManAttr,
  UserAttr,
} from "@/api/main/types";
import { crmStageApi } from "@/api/main/actions/crmStageApi";
import { productsApi } from "@/api/main/actions/productsApi";
import { deliveryManApi } from "@/api/main/actions/deliveryManApi";
import { userApi } from "@/api/main/actions/userApi";

const CACHE_TIME = 1000 * 60 * 10; //  minutes
const GET_ARGS = [
  "crmStagesList",
  "productListWithBalance",
  "deliveryManList",
  "userList",
] as const;

type CacheData = {
  crmStagesList: DealStagesAttr[];
  productListWithBalance: ProductsAttr[];
  deliveryManList: DeliveryManAttr[];
  userList: UserAttr[];
};

type Cache = {
  [K in (typeof GET_ARGS)[number]]: {
    data: CacheData[K];
    time: number;
    upgradeData: () => Promise<CacheData[K]>;
  };
};

export const useDataStore = defineStore("data", () => {
  const cache = ref<Cache>({
    crmStagesList: {
      data: [],
      time: 0,
      upgradeData: async () => {
        const response = await crmStageApi.getAllOnlyStages();
        return response;
      },
    },
    productListWithBalance: {
      data: [],
      time: 0,
      upgradeData: async () => {
        const response = await productsApi.getAllWithBalance();
        return response;
      },
    },
    deliveryManList: {
      data: [],
      time: 0,
      upgradeData: async () => {
        const response = (await deliveryManApi.getAll(1000, 1)).data;
        return response;
      },
    },
    userList: {
      data: [],
      time: 0,
      upgradeData: async () => {
        // const response = (await userApi.getAll(1000, 1)).data;
        // return response;
        return [];
      },
    },
  });

  async function getData<T extends keyof Cache>(
    key: T
  ): Promise<Cache[T]["data"]> {
    const cached = cache.value[key];
    if (cached && Date.now() - cached.time < CACHE_TIME) {
      return cached.data as Cache[T]["data"];
    } else {
      cached.time = Date.now();
      cached.data = await cached.upgradeData();
      return cached.data as Cache[T]["data"];
    }
  }

  return { getData, cache };
});
