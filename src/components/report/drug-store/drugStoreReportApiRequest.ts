import http from "@/lib/http";
import { ApiResponseInterface } from "@/types";
import {
  StockCardItem,
  StockTransactionReportItem,
} from "./drugStoreReport.schema";

const drugStoreReportApiRequest = {
  getStockTransactionReport: (params: URLSearchParams) =>
    http.get<ApiResponseInterface<StockTransactionReportItem[]>>(
      "/drug-store/stock/report/transaction?" + params.toString(),
    ),

  getStockCardReport: (params: URLSearchParams) =>
    http.get<ApiResponseInterface<StockCardItem[]>>(
      "/drug-store/stock/report/stock-card?" + params.toString(),
    ),
};

export default drugStoreReportApiRequest;
