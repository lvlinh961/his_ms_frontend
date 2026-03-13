"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Edit2, Key, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  configRolPermFormSchema,
  ConfigRolPermFormSchema,
  ConfigRolPermDefaultValue,
} from "./permissionSetting.schema";
import authApiRequest from "./permissionApiRequest";
import { RoleDialog } from "./RoleDialog";
import { AddPermDialog } from "./AddPermDialog";

interface ProductFormProps {}

export const RoleManagement: React.FC<ProductFormProps> = () => {
  const [roleList, setRoleList] = useState<any[]>([]);
  const [permissionList, setPermissionList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const [assignedPermissions, setAssignedPermissions] = useState<{
    [key: string]: string[];
  }>({
    Admin: ["View Dashboard", "Edit Articles", "Delete Comments"],
  });

  const { register, handleSubmit, watch } = useForm();

  const selectedRole = watch("role") || "Admin";

  const assignPermission = async (data: any) => {
    const result = await authApiRequest.addPermission(data);
    if (result.status == 200) {
      if (result.payload.code == 200) {
        setAssignedPermissions((prev) => ({
          ...prev,
          [data.role]: [
            ...new Set([...(prev[data.role] || []), data.permission]),
          ],
        }));
      } else {
        setError(result.payload.message || "Lỗi không xác định");
      }
    } else {
      setError("Không thể kết nối đến server");
    }
  };

  useEffect(() => {
    loadLstRoles();
    // loadLstPermission();
  }, []);

  const loadLstRoles = async () => {
    const result = await authApiRequest.getListRoles();
    if (result.status == 200) {
      if (result.payload.code == 200) {
        setRoleList(result.payload.result);
      } else {
        setError(result.payload.message || "Lỗi không xác định");
      }
    } else {
      setError("Không thể kết nối đến server");
    }
  };

  // const loadLstPermission = async () => {
  //   const result = await authApiRequest.getListPermission();
  //   if (result.status == 200) {
  //     if (result.payload.code == 200) {
  //       setPermissionList(result.payload.result);
  //     } else {
  //       setError(result.payload.message || "Lỗi không xác định");
  //     }
  //   } else {
  //     setError("Không thể kết nối đến server");
  //   }
  // };

  const form = useForm<ConfigRolPermFormSchema>({
    resolver: zodResolver(configRolPermFormSchema),
    defaultValues: ConfigRolPermDefaultValue,
  });

  const [roleDialogOpen, setDialogRoleOpen] = useState(false);
  const [addPermRoleDialogOpen, setDialogAddPermRoleOpen] = useState(false);
  const [isEditRole, setIsEditRole] = useState(false);
  const [roleSelectedItem, setSelectedRoleItem] = useState<any | undefined>();

  const openRoleDialog = (item: any, isEdit: boolean) => {
    setSelectedRoleItem(item);
    setDialogRoleOpen(true);
    setIsEditRole(isEdit);
  };

  const openAddPermDialog = (item: any) => {
    setSelectedRoleItem(item);
    setDialogAddPermRoleOpen(true);
  };

  const onRoleConfirm = async (name: any) => {
    const result = await authApiRequest.deleteRole(name);
    if (result.status == 200) {
      if (result.payload.code == 200) {
        // loadLstPermission();
        setOpen(false);
        setError(result.payload.message || "Xoá thành công");
      } else {
        setError(result.payload.message || "Lỗi không xác định");
      }
    } else {
      setError("Không thể kết nối đến server");
    }
  };

  const [permDialogOpen, setDialogPermOpen] = useState(false);
  const [isEditPerm, setIsEditPerm] = useState(false);
  const [permSelectedItem, setSelectedPermItem] = useState<any | undefined>();
  const openPermDialog = (item: any, isEdit: boolean) => {
    setSelectedPermItem(item);
    setDialogPermOpen(true);
    setIsEditPerm(isEdit);
  };

  const [permOpen, setPermOpen] = useState(false);
  const onPermConfirm = async (name: any) => {
    const result = await authApiRequest.deletePerm(name);
    if (result.status == 200) {
      if (result.payload.code == 200) {
        loadLstRoles();
        setPermOpen(false);
        setError(result.payload.message || "Xoá thành công");
      } else {
        setError(result.payload.message || "Lỗi không xác định");
      }
    } else {
      setError("Không thể kết nối đến server");
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-80px)] bg-slate-50/50">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-row md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Quản lý Chức danh
            </h2>
            <p className="text-sm text-muted-foreground">
              Quản lý quyền hạn và vai trò của người dùng trong hệ thống.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all px-4 py-2.5 rounded-lg text-white font-medium shadow-sm shadow-blue-200"
            onClick={() => openRoleDialog({}, false)}
          >
            <Plus size={18} />
            Tạo chức danh
          </button>
        </div>

        {/* Table Section Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Tên chức danh
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Mô tả chi tiết
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roleList.map((role) => (
                  <tr
                    key={role.name}
                    className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    <td
                      className="px-6 py-4"
                      onClick={() => openAddPermDialog(role)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <ShieldCheck size={18} />
                        </div>
                        <span className="font-medium text-slate-900">
                          {role.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-slate-500 italic"
                      onClick={() => openAddPermDialog(role)}
                    >
                      {role.description || "Chưa có mô tả..."}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="Chỉnh sửa thông tin"
                          className="p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            openRoleDialog(role, true);
                          }}
                        >
                          <Edit2 size={18} />
                        </button>

                        <button
                          title="Phân quyền chức danh"
                          className="p-2 text-yellow-500 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddPermDialog(role);
                          }}
                        >
                          <Key size={18} />
                        </button>

                        <button
                          title="Xóa chức danh"
                          className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            // setRoleSelectedItem(role); // Đảm bảo set đúng item trước khi mở modal xóa
                            setOpen(true);
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {roleList.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      Không tìm thấy chức danh nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals/Dialogs */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onRoleConfirm(roleSelectedItem?.name)} // Đảm bảo truyền đúng name cần xóa
        loading={loading}
      />
      <RoleDialog
        initialData={roleSelectedItem}
        isEdit={isEditRole}
        open={roleDialogOpen}
        onClose={() => setDialogRoleOpen(false)}
        loadList={() => {
          loadLstRoles();
          setDialogRoleOpen(false);
        }}
      />
      <AddPermDialog
        initialData={roleSelectedItem}
        open={addPermRoleDialogOpen}
        onClose={() => setDialogAddPermRoleOpen(false)}
        loadList={() => setDialogAddPermRoleOpen(false)}
      />
    </ScrollArea>
  );
};
