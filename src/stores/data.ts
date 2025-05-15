import { ref } from "vue";
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

const CACHE_TIME = 1000 * 60 * 10; // 10 minutes

const GET_ARGS = [
  "crmStagesList",
  "productListWithBalance",
  "deliveryManList",
  "userList",
] as const;

type CacheKey = (typeof GET_ARGS)[number];

type CacheData = {
  crmStagesList: DealStagesAttr[];
  productListWithBalance: ProductsAttr[];
  deliveryManList: DeliveryManAttr[];
  userList: UserAttr[];
};

type Cache = {
  [K in CacheKey]: {
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
        return await crmStageApi.getAllOnlyStages();
      },
    },
    productListWithBalance: {
      data: [],
      time: 0,
      upgradeData: async () => {
        return await productsApi.getAllWithBalance();
      },
    },
    deliveryManList: {
      data: [],
      time: 0,
      upgradeData: async () => {
        const response = await deliveryManApi.getAll(1000, 1, "");
        return response.data;
      },
    },
    userList: {
      data: [],
      time: 0,
      upgradeData: async () => {
        const response = await userApi.getAll(1000, 1, "");
        return response.data;
      },
    },
  } as Cache);

  const pendingPromises = new Map<CacheKey, Promise<any>>();

  async function getData<K extends CacheKey>(key: K): Promise<CacheData[K]> {
    const now = Date.now();
    const cached = cache.value[key];

    if (now - cached.time < CACHE_TIME && cached.data.length > 0) {
      return cached.data as CacheData[K];
    }

    if (pendingPromises.has(key)) {
      return pendingPromises.get(key)!;
    }

    const fetchPromise = cached.upgradeData().then((data) => {
      cached.data = data;
      cached.time = Date.now();
      pendingPromises.delete(key);
      return data;
    });

    pendingPromises.set(key, fetchPromise);
    return fetchPromise as Promise<CacheData[K]>;
  }

  return { getData, cache };
});
