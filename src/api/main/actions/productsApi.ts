import { create } from "naive-ui";
import axios from "../axios.instance";
import type { ApiResponse, ProductsAttr } from "../types";
const endpointV1 = "/api/v1/products";

export const productsApi = {
  getAll: (size: number, page: number, search?: string) =>
    axios
      .get<ApiResponse<{ data: ProductsAttr[]; count: number }>>(
        `${endpointV1}/${size}/${page}?search=${search}`
      )
      .then((res) => res.data),
  create: (data: Omit<ProductsAttr, "id">) =>
    axios
      .post<ApiResponse<ProductsAttr>>(`${endpointV1}`, data)
      .then((res) => res.data),
  update: (id: number, data: Omit<ProductsAttr, "id">) =>
    axios
      .put<ApiResponse<ProductsAttr>>(`${endpointV1}/id/${id}`, data)
      .then((res) => res.data),
  delete: (id: string) =>
    axios
      .delete<ApiResponse<ProductsAttr>>(`${endpointV1}/${id}`)
      .then((res) => res.data),

  getAllWithBalance: () =>
    axios
      .get<ApiResponse<ProductsAttr[]>>(`${endpointV1}/with-balance`)
      .then((res) => res.data),
};
