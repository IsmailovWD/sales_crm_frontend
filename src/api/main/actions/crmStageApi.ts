import axios from "../axios.instance";
import type { ApiResponse, DealStagesAttr as s, DealAttr } from "../types";
const endpointV1 = "/api/v1/deal-stages";

export interface DealStagesAttr extends s {
  deals: DealAttr[];
  totalCount: number;
}

export const crmStageApi = {
  getAll: () =>
    axios
      .get<ApiResponse<DealStagesAttr[]>>(`${endpointV1}/all`)
      .then((res) => res.data),

  update: (id: number, name: string, color: string) =>
    axios
      .put<ApiResponse<DealStagesAttr>>(`${endpointV1}/update/id/${id}`, {
        name,
        color,
      })
      .then((res) => res.data),

  changeOrder: (data: { id: number; order: number }[]) =>
    axios
      .put<ApiResponse<DealStagesAttr>>(`${endpointV1}/change-order`, data)
      .then((res) => res.data),

  getAllOnlyStages: () =>
    axios
      .get<ApiResponse<s[]>>(`${endpointV1}/all-only-stages`)
      .then((res) => res.data),
};
