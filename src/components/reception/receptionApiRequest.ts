import http from "@/lib/http";
import {
  OutPatientRegistSchema,
  PatientInfo,
  RegistrationHistory,
} from "./reception.schema";

import { ApiResponseInterface } from "@/types";

export interface ServiceAutoCompleteItem {
  serviceId: number;
  serviceName: string;
  normalPrice: number;
}

export interface ServiceDateResponse {
  code: number;
  result?: ServiceAutoCompleteItem[];
  message?: string;
}

export interface PatientRegistResponse {
  message: string;
}

interface GetPatientInfoResponse {
  code: number;
  result?: PatientInfo;
  message?: string;
}

const receptionsApiRequest = {
  // Get service auto suggest
  getServiceAutoComplete: (query: string) =>
    http.get<ServiceDateResponse>(
      "/out_patient/services/autocomplete?query=" + query,
      {}
    ),

  getPatientInfo: (patientCode: string) =>
    http.get<GetPatientInfoResponse>(
      "/out_patient/patient_info/" + patientCode,
      {}
    ),

  // Post registration
  registPatientColsutation: (body: OutPatientRegistSchema) =>
    http.post<PatientRegistResponse>("/out_patient/registration", body),

  getRegistrationHistory: (patientId: string) =>
    http.get<ApiResponseInterface<RegistrationHistory[]>>(
      "/out_patient/registration/" + patientId + "/history",
      {}
    ),
};

export default receptionsApiRequest;
