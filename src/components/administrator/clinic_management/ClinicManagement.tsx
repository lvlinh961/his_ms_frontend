"use client";
import { PaginationAnsyc } from "@/components/ui/PaginationAnsyc";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  clinicSearchSchema,
  ClinicSearchSchema,
  defaultClinicSearchSchema,
  Clinic,
  GetPagingClinicParams,
} from "./clinicManagement.types";
import { useEffect, useState } from "react";
import LoadingOverlay from "@/components/layout/loading-overlay";
import { handleErrorApi } from "@/lib/utils";
import clinicManagementApiRequest from "./clinicManagementApiRequest";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/atoms/custom-form-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dateFormater } from "@/lib/utils";
import { DisableStatus, DisableStatusLabel } from "@/constants/enum";
import CreateClinicDialog from "./CreateClinicDialog";

export default function ClinicManagement() {
  const [listClinic, setListClinic] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const clinicSearchForm = useForm<ClinicSearchSchema>({
    resolver: zodResolver(clinicSearchSchema),
    defaultValues: defaultClinicSearchSchema,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    loadListClinic();
  }, []);

  const loadListClinic = async (page: number = 1, size: number = 20) => {
    setLoading(true);

    let params = {
      page: page,
      size: size,
      name: "",
    } satisfies GetPagingClinicParams;

    try {
      const res = await clinicManagementApiRequest.getTenantPaging(params);

      if (res.status == HttpStatus.SUCCESS) {
        setListClinic(res.payload.data);
        setCurrentPage(res.payload.currentPage);
        setTotalPage(res.payload.totalPage);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const addClinic = (clinic: Clinic) => {
    setListClinic((prev) => {
      return [...prev, clinic];
    });
  };

  const searchClinic = () => {};

  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="flex-1 md:p-4 w-full  h-full">
        <div className="p-4 border gap-4">
          <Form {...clinicSearchForm}>
            <form onSubmit={clinicSearchForm.handleSubmit(searchClinic)}>
              <div className="flex items-center justify-between mt-4">
                <div className="flex">
                  <CustomFormField
                    control={clinicSearchForm.control}
                    name="name"
                    placeholder="Nhập tên phòng khám"
                    fieldType={FormFieldType.INPUT}
                  />
                </div>
                <div>
                  <div className="w-full text-right space-x-2">
                    <button
                      className=" px-4 py-2 rounded bg-[hsl(var(--color-custom-1))] text-[hsl(var(--text-color))]"
                      type="submit"
                    >
                      Tìm
                    </button>
                    <CreateClinicDialog addClinic={addClinic} />
                  </div>
                </div>
              </div>
            </form>
          </Form>
          <Table className="mt-4">
            <TableHeader className="bg-cyan-700 text-white">
              <TableRow>
                <TableHead className="text-white-500 font-bold">STT</TableHead>
                <TableHead className="text-white-500 font-bold">Mã</TableHead>
                <TableHead className="text-white-500 font-bold">
                  Tên PK
                </TableHead>
                <TableHead className="text-white-500 font-bold">
                  Email
                </TableHead>
                <TableHead className="text-white-500 font-bold">SĐT</TableHead>
                <TableHead className="text-white-500 font-bold">
                  Địa chỉ
                </TableHead>
                <TableHead className="text-white-500 font-bold">
                  Ngày tạo
                </TableHead>
                <TableHead className="text-white-500 font-bold">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listClinic &&
                listClinic.map((clinic, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}. </TableCell>
                    <TableCell>{clinic.code}</TableCell>
                    <TableCell>{clinic.name}</TableCell>
                    <TableCell>{clinic.email}</TableCell>
                    <TableCell>{clinic.phone}</TableCell>
                    <TableCell>{clinic.address}</TableCell>
                    <TableCell>
                      {dateFormater.format(new Date(clinic.createdAt))}
                    </TableCell>
                    <TableCell>
                      {DisableStatusLabel[clinic.status as DisableStatus]}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <PaginationAnsyc
            totalPage={totalPage}
            currentPage={currentPage}
            loadList={(page, size) => {
              loadListClinic(page, size);
            }}
          />
        </div>
      </div>
      {loading && <LoadingOverlay />}
    </ScrollArea>
  );
}
