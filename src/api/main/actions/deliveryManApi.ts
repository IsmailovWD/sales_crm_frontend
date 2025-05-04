import axios from "../axios.instance";
import type { ApiResponse, DeliveryManAttr } from "../types";
const endpointV1 = "/api/v1/delivery-man";

export const deliveryManApi = {
  getAll: (size: number, page: number, search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return axios
      .get<ApiResponse<{ data: DeliveryManAttr[]; count: number }>>(
        `${endpointV1}/all/${page}/${size}${query}`
      )
      .then((res) => res.data);
  },

  create: (data: Omit<DeliveryManAttr, "id">) =>
    axios
      .post<ApiResponse<DeliveryManAttr>>(`${endpointV1}/create`, data)
      .then((res) => res.data),

  update: (id: string, data: Omit<DeliveryManAttr, "id">) =>
    axios
      .put<ApiResponse<DeliveryManAttr>>(`${endpointV1}/update/id/${id}`, data)
      .then((res) => res.data),
};
