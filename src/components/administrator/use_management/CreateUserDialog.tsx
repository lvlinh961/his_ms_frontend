"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createUserFormSchema,
  CreateUserFormSchema,
  defaultCreateUserFormSchema,
  User,
} from "./userManagement.types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { Label } from "@/components/ui/label";
import DatePickerWithPopover from "@/components/atoms/DatePickerWithPopover";
import clinicManagementApiRequest from "../clinic_management/clinicManagementApiRequest";
import { Clinic } from "../clinic_management/clinicManagement.types";
import { handleErrorApi } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Role } from "../role_management/role.types";
import roleApiRequest from "../role_management/roleApiRequest";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import userApiRequest from "./userApiRequest";
import { set } from "date-fns";
import { toast } from "sonner";

interface CreateUserDialogProps {
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  setSelectedUser?: (user: User | null) => void;
  user?: User;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export default function CreateUserDialog({
  addUser,
  updateUser,
  setSelectedUser,
  setOpen,
  open,
  user,
}: CreateUserDialogProps) {
  const createUserForm = useForm<CreateUserFormSchema>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: defaultCreateUserFormSchema,
  });
  const [listClinic, setListClinic] = useState<Clinic[]>([]);
  const [listRole, setListRole] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Tạo người dùng mới");
  const [roleSelectOpen, setRoleSelectOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchRoleList();
  }, []);

  useEffect(() => {
    if (user) {
      createUserForm.reset({
        ...user,
        password: "",
        roles: user.roles,
        tenantName: user?.tenantName,
        dob: user.dob ? new Date(user.dob) : new Date(),
      });
      setTitle("Cập nhật người dùng");
    } else {
      createUserForm.reset(defaultCreateUserFormSchema);
    }
  }, [user, createUserForm]);

  const clinicAutoComplete = async (query: string) => {
    if (!query) return setListClinic([]);

    try {
      const res = await clinicManagementApiRequest.autoSuggest(query);

      if (res?.payload.result) {
        setListClinic(res.payload.result);
      }
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const fetchRoleList = async () => {
    try {
      const res = await roleApiRequest.getAll();

      if (res?.payload.result) {
        setListRole(res.payload.result);
      }
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const debounceClinicAutoSuggest = useCallback(clinicAutoComplete, []);

  const submitUser = async (data: CreateUserFormSchema) => {
    setLoading(true);

    try {
      let res;

      if (user) {
        res = await userApiRequest.updateUser(user.id, data);
      } else {
        res = await userApiRequest.createUser(data);
      }

      if (res.status == HttpStatus.SUCCESS) {
        if (user) updateUser(res.payload.result);
        else addUser(res.payload.result);

        createUserForm.reset(defaultCreateUserFormSchema);
        setOpen(false);

        toast.success(`${user ? "Cập nhật" : "Tạo"} người dùng thành công`);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      createUserForm.reset(defaultCreateUserFormSchema);
      setSelectedUser && setSelectedUser(null);
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="bg-[hsl(var(--color-custom-1))] text-[hsl(var(--text-color))] px-4 py-2 rounded">
          Tạo người dùng
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...createUserForm}>
          <form onSubmit={createUserForm.handleSubmit(submitUser)}>
            <div className="grid gap-2">
              <CustomFormField
                control={createUserForm.control}
                name="username"
                label="Tên đăng nhập"
                fieldType={FormFieldType.INPUT}
              />
              <CustomFormField
                control={createUserForm.control}
                name="password"
                label="Mật khẩu"
                type="password"
                fieldType={FormFieldType.INPUT}
              />
              <CustomFormField
                control={createUserForm.control}
                name="firstName"
                label="Tên"
                fieldType={FormFieldType.INPUT}
              />
              <CustomFormField
                control={createUserForm.control}
                name="lastName"
                label="Họ"
                fieldType={FormFieldType.INPUT}
              />
              <div className="gap-3">
                <Label htmlFor="dob">Ngày sinh</Label>
                <FormField
                  control={createUserForm.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <DatePickerWithPopover
                          value={field.value ? new Date(field.value) : null}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="gap-3">
                <Label htmlFor="tenantId">Phòng khám</Label>
                <FormField
                  control={createUserForm.control}
                  name="tenantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Nhập tên phòng khám"
                            autoComplete="off"
                            onChange={(e) => {
                              field.onChange(e);
                              debounceClinicAutoSuggest(e.target.value);
                            }}
                          />
                          {listClinic.length > 0 && (
                            <Card className="absolute z-10 w-full mt-1">
                              <CardContent className="p-1 space-y-1 max-h-60 overflow-y-auto">
                                {listClinic.map((item, index) => (
                                  <div
                                    key={item.id}
                                    className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                                    onClick={() => {
                                      createUserForm.setValue(
                                        "tenantName",
                                        item.name
                                      );
                                      createUserForm.setValue(
                                        "tenantId",
                                        item.id
                                      );
                                      setListClinic([]);
                                    }}
                                  >
                                    {item.name}
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="gap-3">
                <Label htmlFor="roles">Loại người dùng</Label>
                <FormField
                  control={createUserForm.control}
                  name="roles"
                  render={({ field }) => {
                    const selected = field.value;

                    const toggleRole = (role: string) => {
                      if (selected.includes(role)) {
                        field.onChange(selected.filter((r) => r !== role));
                      } else {
                        field.onChange([...selected, role]);
                      }
                    };

                    return (
                      <Popover
                        modal={true}
                        open={roleSelectOpen}
                        onOpenChange={setRoleSelectOpen}
                      >
                        {/* Trigger: Clickable selected roles list */}
                        <PopoverTrigger asChild>
                          <div className="border rounded-md p-2 cursor-pointer flex flex-wrap gap-2 hover:border-primary transition">
                            {selected.length === 0 ? (
                              <span className="text-muted-foreground">
                                Click để phân loại
                              </span>
                            ) : (
                              selected.map((role) => (
                                <div
                                  key={role}
                                  className="px-2 py-1 bg-muted rounded-md text-sm flex items-center gap-1"
                                >
                                  {role}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation(); // prevent closing popover
                                      toggleRole(role);
                                    }}
                                    className="text-muted-foreground hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </PopoverTrigger>

                        {/* Content: Role picker dropdown */}
                        <PopoverContent className="w-[300px] p-0 mt-2">
                          <Command>
                            <CommandInput placeholder="Tìm loại..." />
                            <CommandList>
                              <CommandEmpty>
                                Không có loại người dùng.
                              </CommandEmpty>
                              <CommandGroup heading="Danh sách loại người dùng">
                                {listRole.map((role) => (
                                  <CommandItem
                                    key={role.name}
                                    value={role.name}
                                    onSelect={() => {
                                      toggleRole(role.name);
                                    }}
                                  >
                                    {role.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Huỷ
                </Button>
              </DialogClose>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </Form>
        {loading && <LoadingOverlay />}
      </DialogContent>
    </Dialog>
  );
}
