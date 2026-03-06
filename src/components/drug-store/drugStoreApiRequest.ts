import http from "@/lib/http";
import { ApiResponseInterface, ApiPagingResponseInterface } from "@/types";
import {
  PharImportOrderItem,
  DrugMaterialSuggest,
  PharImportCreateRequest,
  SearchStoreResponse,
  ApprovePharImportOrderRequest,
  DrugStockSuggest,
  PrescriptionPreparePayment,
  PharPaymentRequest,
  PharInvoiceResponse,
} from "./drug-store.schema";

const drugStoreApiRequest = {
  getAll: (params: URLSearchParams) =>
    http.get<ApiPagingResponseInterface<PharImportOrderItem[]>>(
      "/drug-store/phar-import-order?" + params.toString(),
    ),

  getDetail: (id: string) =>
    http.get<ApiResponseInterface<PharImportCreateRequest>>(
      "/drug-store/phar-import-order/" + id,
    ),

  autoSuggest: (query: string) =>
    http.get<ApiResponseInterface<DrugMaterialSuggest[]>>(
      "/drug-store/drug-material/auto-suggest?q=" + query,
    ),

  createPharImportOrder: (data: PharImportCreateRequest) =>
    http.post<ApiResponseInterface<PharImportCreateRequest>>(
      "/drug-store/phar-import-order",
      data,
    ),

  searchStore: (params: URLSearchParams) =>
    http.get<ApiResponseInterface<SearchStoreResponse[]>>(
      "/drug-store/stores/search?" + params.toString(),
    ),

  approvePharImportOrder: (data: ApprovePharImportOrderRequest) =>
    http.post<ApiResponseInterface<string>>(
      `/drug-store/phar-import-order/${data.id}/approve`,
      data,
    ),

  searchInStock: (params: URLSearchParams) =>
    http.get<ApiResponseInterface<DrugStockSuggest[]>>(
      "/drug-store/stock/search-for-prescription?" + params.toString(),
    ),

  preparePrescriptionPayment: (id: string) =>
    http.get<ApiResponseInterface<PrescriptionPreparePayment>>(
      `/drug-store/payment/prescription/${id}/prepare`,
    ),

  processPrescriptionPayment: (data: PharPaymentRequest) =>
    http.post<ApiResponseInterface<PharInvoiceResponse>>(
      "/drug-store/payment/prescription/process",
      data,
    ),
};

export default drugStoreApiRequest;
