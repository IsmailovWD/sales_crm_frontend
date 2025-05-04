import axios from "../axios.instance";
import type { ApiResponse, UserAttr } from "../types";
const endpointV1 = "/api/v1/auth";

export const authApi = {
  singIn: (data: Pick<UserAttr, "password" | "username">) =>
    axios
      .post<ApiResponse<UserAttr & { token: string }>>(
        `${endpointV1}/signin`,
        data
      )
      .then((res) => res.data),
};
