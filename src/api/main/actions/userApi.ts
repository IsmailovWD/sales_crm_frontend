import axios from "../axios.instance";
import type { ApiResponse, UserAttr } from "../types";
const endpointV1 = "/api/v1/users";

export const userApi = {
  getMe: () =>
    axios
      .get<ApiResponse<UserAttr>>(`${endpointV1}/me`)
      .then((res) => res.data),
  getAll: (size: number, page: number, search?: string) =>
    axios
      .get<ApiResponse<{ data: UserAttr[]; count: number }>>(
        `${endpointV1}/${size}/${page}?search=${search}`
      )
      .then((res) => res.data),
  create: (data: Omit<UserAttr, "id">) =>
    axios
      .post<ApiResponse<UserAttr>>(`${endpointV1}`, data)
      .then((res) => res.data),
  update: (id: number, data: Omit<UserAttr, "id">) =>
    axios
      .put<ApiResponse<UserAttr>>(`${endpointV1}/id/${id}`, data)
      .then((res) => res.data),
  delete: (id: string) =>
    axios
      .delete<ApiResponse<UserAttr>>(`${endpointV1}/${id}`)
      .then((res) => res.data),
};
