import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SlideSessionResType,
} from "@/schemaValidation/auth.schema";
import { MessageResType } from "@/schemaValidation/common.schema";

const authApiRequest = {
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/identity/auth/login", body),

  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("/auth/register", body),

  auth: (body: { sessionToken: string; expiredTime: string }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),

  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post<MessageResType>(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),

  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post<MessageResType>(
      "/api/auth/logout",
      {
        force,
      },
      {
        baseUrl: "",
        signal,
      }
    ),

  slideSessionFromNextServerToServer: (sessionToken: string) =>
    http.post<SlideSessionResType>(
      "/auth/slide-session",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),

  slideSessionFromNextClientToNextServer: () =>
    http.post<SlideSessionResType>(
      "/api/auth/slide-session",
      {},
      { baseUrl: "" }
    ),

  getListAllErmDocumentGroup: (token: string) =>
    http.get("/emr/emr_document_group", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),
  deleteEmrDocumentGroup: (token: string, id: any) =>
    http.delete("/emr/emr_document_group/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),
  createEmrDocumentGroup: (token: string, body: any) =>
    http.post("/emr/emr_document_group", body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),
  updateListAllErmDocumentGroup: (token: string, id: any, body: any) =>
    http.put("/emr/emr_document_group/" + id, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),
};

export default authApiRequest;
