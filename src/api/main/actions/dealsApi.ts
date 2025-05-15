import axios from "../axios.instance";
import type { ApiResponse, DealAttr } from "../types";
const endpointV1 = "/api/v1/deals";

export const dealsApi = {
  create: (data: Partial<DealAttr>) =>
    axios
      .post<ApiResponse<DealAttr>>(`${endpointV1}/create`, data)
      .then((res) => res.data),

  update: (id: number, data: Partial<DealAttr>) =>
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
  changeStageByIds: (ids: number[], stage_id: number, old_stage_id: number) =>
    axios
      .patch<ApiResponse<DealAttr[]>>(`${endpointV1}/change-stage-by-ids`, {
        ids,
        stage_id,
        old_stage_id,
      })
      .then((res) => res.data),
};
