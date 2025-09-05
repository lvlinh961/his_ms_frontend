import http from "@/lib/http";
import {
  EmrResponse,
  DermatologyEmr,
  DermatologyEmrSchema,
  DermatologyEmrPrint
} from "./emr-schema";
import { ApiResponseInterface } from "@/types";

const emrApiRequest = {
  getDocument: (fileName: string) =>
    http.get("/profile/employees/pdf" + fileName, {}),

  getListEmr: (patientId: string) =>
    http.get<EmrResponse>("/profile/emr/" + patientId, {}),

  createDocument: (data: any) => http.post<EmrResponse>("/profile/emr", data),

  createDermatologyEmr: (data: DermatologyEmrSchema) =>
    http.post<ApiResponseInterface<DermatologyEmr>>(
      "/out_patient/dermatology_emr",
      data
    ),

  getDermatologyEmrByTicket: (ticketId: string) =>
    http.get<ApiResponseInterface<DermatologyEmr>>(
      "/out_patient/dermatology_emr/get_by_ticket/" + ticketId
    ),

  getDermatologyEmrById: (id: string) =>
    http.get<ApiResponseInterface<DermatologyEmr>>(
      "/out_patient/dermatology_emr/" + id
    ),

  getDermatologyEmrPrintData: (id: string) =>
    http.get<ApiResponseInterface<DermatologyEmrPrint>>(
      "/out_patient/dermatology_emr/print/" + id
    ),
};

export default emrApiRequest;
