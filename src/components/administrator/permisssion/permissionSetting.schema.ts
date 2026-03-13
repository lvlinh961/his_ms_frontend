import z from "zod";

export type rolePermission = {
  role: string;
  permission: string;
};

export const permissionFormSchema = z.object({
    name: z.string().min(1, 'Không được để trống').optional(),
    description: z.string().min(1, 'Không được để trống').optional(),
});

export type PermissionFormSchema = z.infer<typeof permissionFormSchema>;

export const permissionDefaultValue = {
    name: '',
    description: ''
} satisfies PermissionFormSchema;

export const roleFormSchema = z.object({
    name: z.string().min(1, 'Không được để trống').optional(),
    description: z.string().min(1, 'Không được để trống').optional(),
});

export type RoleFormSchema = z.infer<typeof roleFormSchema>;

export const RoleDefaultValue = {
    name: '',
    description: ''
} satisfies RoleFormSchema;

export const configRolPermFormSchema = z.object({
    role: z.string().min(1, 'Vui lòng chọn Chức danh').optional(),
    permission: z.string().min(1, 'Vui lòng chọn Quyền').optional(),
});

export type ConfigRolPermFormSchema = z.infer<typeof configRolPermFormSchema>;

export const ConfigRolPermDefaultValue = {
    role: '',
    permission: ''
} satisfies ConfigRolPermFormSchema;