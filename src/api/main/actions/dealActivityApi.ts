import axios from "../axios.instance";
import type { ApiResponse, DealActivityAttr, UserAttr } from "../types";
const endpointV1 = "/api/v1/deal-activity";

export interface GetAllActivityDataAttr {
  date: string;
  type: "pin" | "date";
  data: DealActivityAttr[];
}
[];

export const dealActivityApi = {
  getAllWithPagination: (page: number, limit: number, deal_id: number = 0) => {
    return axios
      .get<ApiResponse<GetAllActivityDataAttr[]>>(
        `${endpointV1}/all/${deal_id}/${page}/${limit}`
      )
      .then((res) => res.data);
  },
  createActivity: (data: Omit<DealActivityAttr, "id">) =>
    axios
      .post<ApiResponse<DealActivityAttr>>(`${endpointV1}/create`, data)
      .then((res) => res.data),
};
