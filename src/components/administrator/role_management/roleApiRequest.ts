import http from "@/lib/http";
import { ApiResponseInterface } from "@/types";
import { Role } from "./role.types";

const roleApiRequest = {
  getAll: () => http.get<ApiResponseInterface<Role[]>>("/identity/roles"),
  autoSuggest: (query: string) =>
    http.get<ApiResponseInterface<Role[]>>(
      "/identity/roles/auto_suggest?query" + query
    ),
};

export default roleApiRequest;
