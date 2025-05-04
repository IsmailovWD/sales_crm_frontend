import axios from "../axios.instance";
import type { ApiResponse, ContactsAttr } from "../types";
const endpointV1 = "/api/v1/contacts";

export const contactsApi = {
  getAllClients: (size: number, page: number, search?: string) =>
    axios
      .get<ApiResponse<{ data: ContactsAttr[]; count: number }>>(
        `${endpointV1}/clients/all/${page}/${size}?search=${search}`
      )
      .then((res) => res.data),

  getAllSuppliers: (size: number, page: number, search?: string) =>
    axios
      .get<ApiResponse<{ data: ContactsAttr[]; count: number }>>(
        `${endpointV1}/suppliers/all/${page}/${size}?search=${search}`
      )
      .then((res) => res.data),

  create: (data: Omit<ContactsAttr, "id">) =>
    axios
      .post<ApiResponse<ContactsAttr>>(`${endpointV1}/create`, data)
      .then((res) => res.data),

  update: (id: number, data: Omit<ContactsAttr, "id">) =>
    axios
      .put<ApiResponse<ContactsAttr>>(`${endpointV1}/update/id/${id}`, data)
      .then((res) => res.data),
};
