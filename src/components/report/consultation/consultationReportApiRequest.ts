import http from "@/lib/http";
import { ApiResponseInterface } from "@/types";
import { ConsultationReport } from "./consutationReport.types";

const consultationReportApiRequest = {
  getConsultationReports: (startDate: string, endDate: string) =>
    http.get<ApiResponseInterface<ConsultationReport[]>>(
      `/out_patient/reports/consultations?startDate=${startDate}&endDate=${endDate}`
    ),
};

export default consultationReportApiRequest;
