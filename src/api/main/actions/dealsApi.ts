import axios from "../axios.instance";
import type { ApiResponse, DealAttr } from "../types";
const endpointV1 = "/api/v1/deals";

export const dealsApi = {
  create: (data: Omit<DealAttr, "id">) =>
    axios
      .post<ApiResponse<DealAttr>>(`${endpointV1}/create`, data)
      .then((res) => res.data),

  update: (id: number, data: Omit<DealAttr, "id">) =>
    axios
      .patch<ApiResponse<DealAttr>>(`${endpointV1}/update/id/${id}`, data)
      .then((res) => res.data),

  getById: (id: string) =>
    axios
      .get<ApiResponse<DealAttr>>(`${endpointV1}/id/${id}`)
      .then((res) => res.data),

  getAll(deals_length: number, stage_id: number) {
    return axios
      .get<ApiResponse<DealAttr[]>>(
        `${endpointV1}/all/${deals_length}/${stage_id}`
      )
      .then((res) => res.data);
  },
};
