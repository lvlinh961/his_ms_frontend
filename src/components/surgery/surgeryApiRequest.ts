import http from "@/lib/http";
import { ApiResponseInterface } from "@/types";
import {
  AcceptSurgeryTicketFormSchema,
  DocumentTypeEnum,
  SurgeryTicketFormSchema,
  ProcedureTicketFormSchema,
} from "./surgery.types";
import z from "zod";

const surgeryApiRequest = {
  /**
   * Tạo phiếu đồng ý phẫu thuật
   * @param data
   * @returns
   */
  createNewAcceptTicket: (data: AcceptSurgeryTicketFormSchema) =>
    http.post<ApiResponseInterface<AcceptSurgeryTicketFormSchema>>(
      `out_patient/documents`,
      data
    ),

  /**
   * Lấy thông tin phiếu đồng ý phẫu thuật
   * @param ticketId
   * @param type
   * @returns
   */
  getAcceptSurgeryTicket: (
    ticketId: string,
    type: z.infer<typeof DocumentTypeEnum>
  ) =>
    http.get<ApiResponseInterface<AcceptSurgeryTicketFormSchema>>(
      `out_patient/documents/ticket/${ticketId}/type/${type}`
    ),

  /**
   * Lưu phiếu phẫu thuật
   * @param data
   * @returns
   */
  saveSurgeryTicket: (data: SurgeryTicketFormSchema) =>
    http.post<ApiResponseInterface<SurgeryTicketFormSchema>>(
      `out_patient/documents`,
      data
    ),

  /**
   * Lấy thông tin phiếu phẫu thuật
   * @param ticketId
   * @param type
   * @returns
   */
  getSurgeryTicket: (
    ticketId: string,
    type: z.infer<typeof DocumentTypeEnum>
  ) =>
    http.get<ApiResponseInterface<SurgeryTicketFormSchema>>(
      `out_patient/documents/ticket/${ticketId}/type/${type}`
    ),

  /**
   * Lưu phiếu thủ thuật
   * @param data
   * @returns
   */
  saveProcedureTicket: (data: ProcedureTicketFormSchema) =>
    http.post<ApiResponseInterface<ProcedureTicketFormSchema>>(
      `out_patient/documents`,
      data
    ),

  /**
   * Lấy thông tin phiếu thủ thuật
   * @param ticketId
   * @param type
   * @returns
   */
  getProcedureTicket: (
    ticketId: string,
    type: z.infer<typeof DocumentTypeEnum>
  ) =>
    http.get<ApiResponseInterface<ProcedureTicketFormSchema>>(
      `out_patient/documents/ticket/${ticketId}/type/${type}`
    ),
};

export default surgeryApiRequest;
