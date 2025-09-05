"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useRef, useState } from "react";
import apiRequest from "./consultationApiRequest";
import { useDashboardContext } from "@/providers/dashboard-providers";
import { useToast } from "@/components/ui/use-toast";
import { Car, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  CreatePaymentSchema,
  ServiceAppointmentSchema,
  serviceAppointmentSchema,
  defauleServiceAppointment,
  ServiceAppointmentItem,
} from "./consultation.shema";

export default function ServiceAppointmentForm() {
  const form = useForm<ServiceAppointmentSchema>({
    resolver: zodResolver(serviceAppointmentSchema),
    defaultValues: defauleServiceAppointment,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const { customerSelected } = useDashboardContext();
  const { toast } = useToast();
  const [ticketItems, setTicketItems] = useState<ServiceAppointmentItem[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const containerRef = useRef(null);

  // Close when click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setServices([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (customerSelected?.ticketId.length > 0) {
      form.setValue("ticketId", customerSelected.ticketId, {
        shouldValidate: true,
        shouldDirty: true,
      });

      getTicketItem(customerSelected.ticketId);
    }
  }, [customerSelected]);

  const getTicketItem = async (ticketId: string) => {
    try {
      const res = await apiRequest.getTicketItem(ticketId);

      if (res.payload?.result?.length > 0) {
        setTicketItems(res.payload?.result);

        const totalPrice = res.payload?.result.reduce((total, item) => {
          total += item.quantity * item.price;
          return total;
        }, 0);
        setTotalPrice(totalPrice);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Có lỗi xảy ra!",
      });
    }
  };

  const serviceFetchOption = async (query: string) => {
    if (!query) return setServices([]);

    try {
      const res = await apiRequest.getServiceAutoComplete(query);
      setServices(res.payload.result);
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Có lỗi xảy ra",
      });
    }
  };
  const debouncedFetch = useCallback(serviceFetchOption, []);

  async function onSubmit(data: ServiceAppointmentSchema) {
    if (!customerSelected) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Vui lòng chọn bệnh nhân khám!",
      });
      return;
    }

    if (form.formState.errors) {
      console.log("Form error: ", form.formState.errors);
    }

    try {
      const res = await apiRequest.saveTicketItem(data);

      if (res.status === 200) {
        setTicketItems([...ticketItems, res.payload.result]);

        const newTotalPrice = totalPrice + res.payload.result.price;
        setTotalPrice(newTotalPrice);

        toast({
          title: "Thông báo",
          description: "Thêm dịch vụ thành công!",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Có lỗi khi lu lưu toa thuốc!",
      });
    }
  }

  const canceledItem = async (item: ServiceAppointmentItem) => {
    try {
      const res = await apiRequest.cancelItem(item.id);

      if (res.status == 200) {
        const updatedTicketItems = ticketItems.filter((i) => i.id != item.id);
        setTicketItems(updatedTicketItems);

        const totalPrice = updatedTicketItems.reduce((total, item) => {
          total += item.quantity * item.price;
          return total;
        }, 0);
        setTotalPrice(totalPrice);

        toast({
          title: "Thông báo",
          description: "Huỷ dịch vụ thành công!",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Có lỗi khi lu lưu toa thuốc!",
      });
    }
  };

  const payment = async () => {
    if (!customerSelected) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Vui lòng chọn bệnh nhân khám!",
      });
      return;
    }

    try {
      const data = {
        ticketId: customerSelected.ticketId,
        totalPrice: totalPrice,
        items: ticketItems,
      } satisfies CreatePaymentSchema;

      const res = await apiRequest.createPayment(data);

      if (res.status == 200) {
        const printUrl = `print/receipt/${res?.payload?.result?.payReceiptId}`;
        window.open(
          printUrl,
          "_blank",
          "width=800,height=600,left=200,top=100,toolbar=0,scrollbars=0"
        );
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Có lỗi khi lu lưu toa thuốc!",
      });
    }
  };

  return (
    <div className="flex flex-col items-end justify-end p-4">
      <Form {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Dịch vụ</FormLabel>
                  <FormControl>
                    <div className="relative" ref={containerRef}>
                      <Input
                        {...field}
                        placeholder="Dịch vụ chỉ định"
                        autoComplete="off"
                        onChange={(e) => {
                          field.onChange(e);
                          debouncedFetch(e.target.value);
                        }}
                      />
                      {services.length > 0 && (
                        <Card className="absolute z-10 w-full mt-1 max-h-60 overdlow-auto">
                          <CardContent className="p-1 space-y-1 max-h-60 overdlow-auto">
                            {services.map((service, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  form.setValue("serviceId", service.serviceId);
                                  form.setValue(
                                    "serviceName",
                                    service.serviceName
                                  );
                                  setServices([]);
                                }}
                                className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                              >
                                {service.serviceName} -{" "}
                                <strong>
                                  (
                                  {Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(service.normalPrice)}
                                  )
                                </strong>
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
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Số lượng" />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-end">
              <Button className="bg-[hsl(var(--color-custom-1))] text-[hsl(var(--text-color))] hover:bg-[hsl(var(--color-custom-2))]">
                Thêm dịch vụ
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <Table className="mt-4">
        <TableHeader className="bg-[hsl(var(--color-custom-1))]">
          <TableRow>
            <TableHead className="text-[hsl(var(--text-color))]">#</TableHead>
            <TableHead className="text-[hsl(var(--text-color))]">Mã</TableHead>
            <TableHead className="text-[hsl(var(--text-color))]">
              Tên dịch vụ
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))]">
              Loại
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))]">Giá</TableHead>
            <TableHead className="text-[hsl(var(--text-color))]">
              Số lượng
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))]">
              Trạng thái
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))]">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ticketItems &&
            ticketItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1})</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  {Intl.NumberFormat("vi-VN").format(item.price)}
                </TableCell>
                <TableCell>
                  {Intl.NumberFormat("vi-VN").format(item.quantity)}
                </TableCell>
                <TableCell>
                  {item?.paid == 0 ? "Chưa thanh toán" : "Đã thanh toán"}
                </TableCell>
                <TableCell>
                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => canceledItem(item)}
                    className="text-destructive"
                  >
                    <X />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="flex flex-col w-full items-end justify-end">
        <div>
          <p>
            Thành tiền (VNĐ):{" "}
            <strong className="text-lg">
              {Intl.NumberFormat("vi-VN").format(totalPrice)}
            </strong>
          </p>
        </div>
        <div>
          <p>
            Giảm giá (VNĐ):{" "}
            <strong className="text-lg">
              {Intl.NumberFormat("vi-VN").format(totalPrice)}
            </strong>
          </p>
        </div>
        <div>
          <Button
            className="bg-[hsl(var(--color-custom-1))] mt-4"
            onClick={payment}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
