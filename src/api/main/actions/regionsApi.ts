import { create } from "naive-ui";
import axios from "../axios.instance";
import type { ApiResponse, RegionsAttr, DistrictsAttr } from "../types";
const endpointV1 = "/api/v1/regions";

export interface RegionsWithDistrictsAttr {
  key: number;
  label: string;
  children: {
    key: number;
    label: string;
  }[];
}

export interface RegionsTreeAttr extends RegionsAttr {
  districts: DistrictsAttr[];
}
export const regionsApi = {
  getAll: () =>
    axios
      .get<ApiResponse<RegionsAttr[]>>(`${endpointV1}/all`)
      .then((res) => res.data),
  create: (data: Omit<RegionsAttr, "id">) =>
    axios
      .post<ApiResponse<RegionsAttr>>(`${endpointV1}/create`, data)
      .then((res) => res.data),
  update: (id: string, data: Omit<RegionsAttr, "id">) =>
    axios
      .put<ApiResponse<RegionsAttr>>(`${endpointV1}/id/${id}`, data)
      .then((res) => res.data),
  delete: (id: string) =>
    axios
      .delete<ApiResponse<RegionsAttr>>(`${endpointV1}/${id}`)
      .then((res) => res.data),

  getByIdWithDistricts: (id: string) =>
    axios
      .get<ApiResponse<RegionsTreeAttr>>(
        `${endpointV1}/id/${id}/with-districts`
      )
      .then((res) => res.data),

  getAllWithDistricts: () =>
    axios
      .get<ApiResponse<RegionsWithDistrictsAttr[]>>(
        `${endpointV1}/all/with-districts`
      )
      .then((res) => res.data),
};
