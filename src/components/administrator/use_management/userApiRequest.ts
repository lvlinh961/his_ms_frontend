import { ApiResponseInterface, ApiPagingResponseInterface } from "@/types";
import http from "@/lib/http";
import {
  User,
  GetPagingUserParam,
  CreateUserFormSchema,
} from "./userManagement.types";
import { paramsString } from "@/lib/utils";

const userApiRequest = {
  getListUser: (queries: GetPagingUserParam) =>
    http.get<ApiPagingResponseInterface<User[]>>(
      "/identity/users?" + paramsString(queries)
    ),

  createUser: (data: CreateUserFormSchema) =>
    http.post<ApiResponseInterface<User>>("/identity/users/save", data),

  updateUser: (id: string, data: CreateUserFormSchema) =>
    http.put<ApiResponseInterface<User>>(`/identity/users/${id}`, data),
};

export default userApiRequest;
