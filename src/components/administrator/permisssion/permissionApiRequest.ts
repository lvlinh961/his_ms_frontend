import http from "@/lib/http";
import {

} from "@/schemaValidation/auth.schema";
import { MessageResType } from "@/schemaValidation/common.schema";

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

export interface PermissionItem {
  name: string;
  description: string;
  module: string;
  checked: boolean
}


export interface RoleItem {
  name: string;
  description?: string;
  permissions: Record<string, PermissionItem[]>;
}

export interface ApiResponse<T> {
  code: number;
  result?: T;
  message?: string;
}

export interface RolePermission {
  name: string;
  description: string;
  permissions: PermissionItem[];
}



const authApiRequest = {
  getListRoles: () =>
    http.get<ServiceDateResponse>("/identity/roles", {}),
  getListRolesPermission: (name: any) =>
    http.get<ServiceDateResponse>("/identity/roles/" + name, {}),
  createRole: (body: any) =>
    http.post<ServiceDateResponse>("/identity/roles", body,),
  deleteRole: (name: any) =>
    http.delete<ServiceDateResponse>("/identity/roles/" + name,),
  getListPermission: () =>
    http.get<ApiResponse<Record<string, PermissionItem[]>>>("/identity/permissions"),
  createPerm: (body: any) =>
    http.post<ServiceDateResponse>("/identity/permissions", body,),
  deletePerm: (name: any) =>
    http.delete<ServiceDateResponse>("/identity/permissions/" + name,),
  addPermission: (body: any) =>
    http.put<ServiceDateResponse>("/identity/roles/add_permission", body,),
  deleteRolePerm: (nameRole: any, namePre: any,) =>
    http.delete<ServiceDateResponse>("/identity/roles/" + nameRole + '/remove/' + namePre,),
};

export default authApiRequest;
