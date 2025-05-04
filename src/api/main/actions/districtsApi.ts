import { create } from "naive-ui";
import axios from "../axios.instance";
import type { ApiResponse, DistrictsAttr } from "../types";
const endpointV1 = "/api/v1/districts";

export const districtsApi = {
  getAll: () =>
    axios
      .get<ApiResponse<DistrictsAttr[]>>(`${endpointV1}/all`)
      .then((res) => res.data),
  create: (data: Omit<DistrictsAttr, "id">) =>
    axios
      .post<ApiResponse<DistrictsAttr>>(`${endpointV1}/create`, data)
      .then((res) => res.data),
  update: (id: string, data: Omit<DistrictsAttr, "id">) =>
    axios
      .put<ApiResponse<DistrictsAttr>>(`${endpointV1}/id/${id}`, data)
      .then((res) => res.data),
  delete: (id: string) =>
    axios
      .delete<ApiResponse<DistrictsAttr>>(`${endpointV1}/${id}`)
      .then((res) => res.data),
};
