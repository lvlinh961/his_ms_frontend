import http from "@/lib/http";
import { Customer } from "@/types";

export interface ListRegistInDateResponse {
  code: number;
  result?: Customer[];
  message?: string;
}

const apiRequest = {
  getListRegistInDate: () =>
    http.get<ListRegistInDateResponse>("/out_patient/registration", {}),
};

export default apiRequest;
