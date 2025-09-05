import http from "@/lib/http";
import { PrescriptionSchema } from "./consultation.shema";
import {
  ServiceAppointmentSchema,
  Icd10SuggestResponse,
  DrugMaterialSuggestResponse,
  SavePrescriptionResponse,
  GetPrescriptionForPrintResponse,
  GetPayReceiptResponse,
  GetPrescriptionByTicketResponse,
  GetServiceAppointmentItemResponse,
  ServiceDateResponse,
  SaveServiceAppointmentItemResponse,
  CancelItemResponse,
  CreatePaymentSchema,
  CreatePaymentResponse,
  GetItemUnitResponse,
  GetItemUsageResponse,
} from "./consultation.shema";

const consultationApiRequest = {
  // Get service auto suggest
  getIcd10AutoSuggest: (query: string) =>
    http.get<Icd10SuggestResponse>(
      "/out_patient/icd10/auto_suggest?query=" + query,
      {}
    ),

  getDrugMaterialAutoSuggest: (query: string) =>
    http.get<DrugMaterialSuggestResponse>(
      "/out_patient/drug_material/auto_suggest?query=" + query,
      {}
    ),

  // Post prescription
  savePrescription: (body: PrescriptionSchema) =>
    http.post<SavePrescriptionResponse>("/out_patient/prescription", body),

  // Get prescription for print
  getPrescriptionForPrint: (presId: string) =>
    http.get<GetPrescriptionForPrintResponse>(
      "/out_patient/prescription/print/" + presId
    ),

  // Get pay receipt for print
  getPayReceiptForPrint: (receiptId: number) =>
    http.get<GetPayReceiptResponse>("/out_patient/payment/print/" + receiptId),

  // Get prescription by ticket id
  getPrescriptionByTicketId: (ticketId: string) =>
    http.get<GetPrescriptionByTicketResponse>(
      "/out_patient/prescription/get_by_ticket?ticketId=" + ticketId,
      {}
    ),

  // Get ticket item detail
  getTicketItem: (ticketId: string) =>
    http.get<GetServiceAppointmentItemResponse>(
      "/out_patient/ticket/" + ticketId + "/items",
      {}
    ),

  // Get service auto suggest
  getServiceAutoComplete: (query: string) =>
    http.get<ServiceDateResponse>(
      "/out_patient/services/autocomplete?query=" + query,
      {}
    ),

  saveTicketItem: (body: ServiceAppointmentSchema) =>
    http.post<SaveServiceAppointmentItemResponse>(
      "/out_patient/ticket/add_item",
      body
    ),

  cancelItem: (ticketItemId: number) =>
    http.delete<CancelItemResponse>(
      "/out_patient/ticket_item/" + ticketItemId + "/cancel",
      {}
    ),

  // Create payment
  createPayment: (body: CreatePaymentSchema) =>
    http.post<CreatePaymentResponse>("/out_patient/payment", body),

  // Get item unit
  getListItemUnit: () =>
    http.get<GetItemUnitResponse>("/out_patient/item_units", {}),

  // Get item usage
  getListItemUsage: () =>
    http.get<GetItemUsageResponse>("/out_patient/item_usages", {}),
};

export default consultationApiRequest;
