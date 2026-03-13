"use client";
import * as z from "zod";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { RoleDefaultValue } from "./permissionSetting.schema";
import authApiRequest, { PermissionItem } from "./permissionApiRequest";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, Settings2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ProductFormProps {
  initialData?: any;
  open: boolean;
  onClose: () => void;
  loadList: () => void;
}

export const AddPermDialog: React.FC<ProductFormProps> = ({
  initialData,
  open,
  onClose,
}) => {
  useEffect(() => {
    if (open) {
      loadLstPermission();
      loadLstRolePermission();
    }
  }, [initialData]);

  const [permissionList, setPermissionList] = useState<
    Record<string, PermissionItem[]>
  >({});
  const [rolePermissionList, setRolePermissionList] = useState<any[]>([]);
  const [permissionLists, setpermissionLists] = useState<any[]>([]);
  const [error, setError] = useState("");

  const loadLstRolePermission = async () => {
    const result = await authApiRequest.getListRolesPermission(
      initialData.name,
    );
    if (result.status == 200) {
      if (result.payload.code == 200) {
        setRolePermissionList(result.payload.result);
      } else {
        setError(result.payload.message || "Lỗi không xác định");
      }
    } else {
      setError("Không thể kết nối đến server");
    }
  };

  const loadLstPermission = async () => {
    const result = await authApiRequest.getListPermission();
    if (result.status == 200) {
      if (result.payload.code == 200) {
        setPermissionList(result.payload.result || {});
      } else {
        setError(result.payload.message || "Lỗi không xác định");
      }
    } else {
      setError("Không thể kết nối đến server");
    }
  };

  useEffect(() => {
    const hasRolePermission =
      (rolePermissionList as any)?.permissions?.length > 0;

    const hasPermissionList =
      permissionList?.permissions &&
      Object.keys(permissionList.permissions).length > 0;

    if (hasRolePermission && hasPermissionList) {
      const moduleArray = Object.entries(permissionList?.permissions || {}).map(
        ([module, permissions]) => ({
          module,
          permissions,
        }),
      );
      if (moduleArray.length > 0) {
        for (const module of moduleArray) {
          const permissions = Array.isArray(module.permissions)
            ? module.permissions
            : Object.values(module.permissions);
          for (const permission of permissions) {
            permission.checked = false;
            var check = (rolePermissionList as any)?.permissions.filter(
              (x: PermissionItem) => x.name === permission.name,
            );
            if (check.length > 0) {
              permission.checked = true;
            }
          }
        }
      }
      setpermissionLists(moduleArray);
    }
  }, [rolePermissionList, permissionList]);

  const addPerm = async (perm: PermissionItem) => {
    setpermissionLists((prev) =>
      prev.map((module) => ({
        ...module,
        permissions: module.permissions.map((p: PermissionItem) =>
          p.name === perm.name ? { ...p, checked: !p.checked } : p,
        ),
      })),
    );

    if (!perm.checked) {
      const body = {
        role: initialData.name,
        permission: perm.name,
      };
      const result = await authApiRequest.addPermission(body);
      if (result.status == 200) {
        if (result.payload.code == 200) {
          setError(result.payload.message || "Thêm quyền thành công");
        } else {
          setError(result.payload.message || "Lỗi không xác định");
        }
      } else {
        setError("Không thể kết nối đến server");
      }
    } else {
      const result = await authApiRequest.deleteRolePerm(
        initialData.name,
        perm.name,
      );
      if (result.status == 200) {
        if (result.payload.code == 200) {
          setError(result.payload.message || "Xoá quyền thành công");
        } else {
          setError(result.payload.message || "Lỗi không xác định");
        }
      } else {
        setError("Không thể kết nối đến server");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl p-0 gap-0 overflow-hidden border-none shadow-2xl h-[90vh] flex flex-col">
        {/* Header Section */}
        <DialogHeader className="p-6 bg-slate-50/80 backdrop-blur-sm border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Cấu hình quyền hạn
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    Vai trò:
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-100 uppercase font-mono"
                  >
                    {initialData?.description}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Permissions List Section */}
        {/* <ScrollArea className="flex-1 w-full bg-white"> */}
        <div className="flex-1 overflow-y-auto w-full bg-white custom-scrollbar">
          <div className="p-6 space-y-8">
            {permissionLists.map((perm) => (
              <div key={perm.module} className="group">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <h3 className="font-bold text-lg text-slate-800 uppercase tracking-tight">
                    Module: {perm.module}
                  </h3>
                  <Separator className="flex-1 ml-4" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {perm.permissions.map((p: PermissionItem) => (
                    <div
                      key={p.name}
                      className={`
                      flex items-start justify-between p-3 rounded-xl border transition-all duration-200
                      ${
                        p.checked
                          ? "border-blue-200 bg-blue-50/30 shadow-sm"
                          : "border-slate-100 hover:border-slate-300 bg-white"
                      }
                    `}
                    >
                      <div className="space-y-1 pr-2">
                        <p
                          className={`text-sm font-semibold leading-none ${p.checked ? "text-blue-700" : "text-slate-700"}`}
                        >
                          {p.description}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {p.name}
                        </p>
                      </div>
                      <Switch
                        checked={p.checked}
                        onCheckedChange={() => addPerm(p)}
                        // Sửa lại class để Switch Disable nhìn cực r
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* </ScrollArea> */}

        {/* Footer Section */}
        <DialogFooter className="p-4 bg-slate-50 border-t flex items-center justify-between sm:justify-between shrink-0">
          <p className="text-xs text-muted-foreground hidden md:block italic">
            * Yêu cầu người dùng login lại để apply quyền mới
          </p>
          <div className="flex gap-2 sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none border-slate-300"
            >
              Đóng
            </Button>
            {/* <Button
              onClick={() => {
              }}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 shadow-md"
            >
              <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
            </Button> */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
