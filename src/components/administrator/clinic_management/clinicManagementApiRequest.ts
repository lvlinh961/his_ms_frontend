import { ApiResponseInterface, ApiPagingResponseInterface } from "@/types";
import {
  Clinic,
  GetPagingClinicParams,
  CreateClinicSchema,
} from "./clinicManagement.types";
import { paramsString } from "@/lib/utils";
import http from "@/lib/http";

const clinicManagementApiRequest = {
  getTenantPaging: (params: GetPagingClinicParams) =>
    http.get<ApiPagingResponseInterface<Clinic[]>>(
      "/identity/tenants?" + paramsString(params)
    ),

  autoSuggest: (query: string) =>
    http.get<ApiResponseInterface<Clinic[]>>(
      "/identity/tenants/auto_suggest?query=" + query
    ),

  createClinic: (data: CreateClinicSchema) =>
    http.post<ApiResponseInterface<Clinic>>("/identity/tenants", data),
};

export default clinicManagementApiRequest;
