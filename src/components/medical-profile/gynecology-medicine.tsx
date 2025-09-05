import { useState, useCallback, ChangeEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { IcdInputField } from "@/components/atoms/icd-input-field";
import { useAppContext } from "@/providers/app-proviceders";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType, ICDType } from "@/constants/enum";
import { RightTap } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const icdSchema = z.object({
  text: z.string(),
  code: z.string(),
  name: z.string(),
});

const formSchema = z.object({
  doctorName: z.string().min(1, { message: "Vui lòng nhập tên bác sĩ." }),
  reason: z
    .string()
    .min(1, { message: "Vui lòng nhập Lý do vào viện" })
    .optional(),
  icd: z.array(icdSchema).optional(),
  surgery: z.array(
    z
      .object({
        day: z.string().optional(),
        month: z.string().optional(),
        year: z.string().optional(),
        time: z.string().optional(),
        pp_phauthuat_vocam: z.string().optional(),
        phau_thuat_vien: z.string().optional(),
        phau_thuat_vien_gayme: z.string().optional(),
      })
      .optional()
  ),
});

type FormValue = z.infer<typeof formSchema>;

interface GynecologyMedicineProps {
  data?: any;
}

export const GynecologyMedicineDepartment: React.FC<
  GynecologyMedicineProps
> = ({ data }) => {
  const { fontSize } = useAppContext();
  const [activeTab, setActiveTab] = useState("ly_do");

  const handleActivetab = useCallback(
    (tab: string) => {
      setActiveTab(tab);
    },
    [activeTab]
  );

  const rightTabs: RightTap[] = [
    { title: "I/ Lý do vào viện", value: "ly_do" },
    { title: "II/ Hỏi bệnh", value: "hoi_benh" },
    { title: "III/ Khám bệnh", value: "kham_benh" },
    {
      title: "IV/ Chẩn đoán khi vào khoa điều trị",
      value: "chuan_doan_dieu_tri",
    },
    { title: "V/ Tiên lượng", value: "tien_luong" },
    { title: "VI/ Hướng điều trị", value: "huong_dieu_tri" },
  ];

  const defaultValues = {
    doctorName: "",
    reason: "",
    icd: [
      {
        code: "",
        name: "",
      },
    ],
  };

  let form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (data: any) => {
    return data;
  };

  const renderICDInput = useCallback(
    (option: {
      fieldName: string;
      className?: string;
      label: string;
      labelClass?: string;
      btnText?: string;
      fields: string[];
      icdType?: string;
    }) => {
      return (
        <>
          <IcdInputField
            control={form.control}
            name={option.fieldName}
            fieldsName={option.fields}
            label={option.label}
            labelClass={option.labelClass || ""}
            icdType={option.icdType || ""}
            btnAddText={option.btnText}
          />
        </>
      );
    },
    []
  );

  const resetFields = (i: number) => {
    [
      "day",
      "month",
      "year",
      "time",
      "pp_phauthuat_vocam",
      "phau_thuat_vien",
      "phau_thuat_vien_gayme",
    ].map((nameInput: any, index: number) =>
      form.setValue(`surgery[${i}][${nameInput}]` as any, "")
    );
  };

  return (
    <>
      <div className="flex content-center justify-center mb-5">
        <span className="text-[19px] font-semibold">Bệnh án phụ khoa</span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <Tabs defaultValue="benh_an" className="w-full ">
            <TabsList
              className={cn(
                "grid w-full grid-cols-2 sm:grid-cols-4 h-auto dark:bg-accent bg-[hsl(var(--color-custom-3))]",
                fontSize
              )}
            >
              <TabsTrigger value="benh_an">A/ Bệnh án</TabsTrigger>
              <TabsTrigger value="tong_ket_benh_an">
                B/ Tổng kết bệnh án
              </TabsTrigger>
              <TabsTrigger value="bo_sung">C/ Thông tin bổ sung</TabsTrigger>
              <TabsTrigger value="ra_vien">D/ Tình trạng ra viện</TabsTrigger>
            </TabsList>
            {/* A/ Bệnh án */}
            <TabsContent value="benh_an">
              <Card className="rounded-none border-0 shadow-none">
                <div className="flex">
                  {/* RightTap */}
                  <div className="max-w-[180px] min-h-[calc(100vh_-_280px)] bg-accent">
                    {rightTabs.map((item: RightTap, index: number) => {
                      return (
                        <div
                          key={index}
                          className={cn(
                            "p-5 cursor-pointer text-sm text-muted-foreground font-semibold hover:text-foreground",
                            activeTab === item.value
                              ? "border-l-4 border-l-cyan-300 border-r-0 bg-background text-muted-foreground-none"
                              : ""
                          )}
                          onClick={() => handleActivetab(item.value)}
                        >
                          {item.title}
                        </div>
                      );
                    })}
                  </div>

                  {/* I/ Lý do vào viện */}
                  <div
                    className={cn(
                      "flex gap-4 pl-4 w-full",
                      activeTab === "ly_do" ? "block" : "hidden"
                    )}
                  >
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        LÝ DO VÀO VIỆN
                      </div>
                      <div className="p-4 border gap-4">
                        <div className="flex-row space-y-4">
                          <div className="sm:flex md:inline-flex w-full">
                            <div className="grow w-full">
                              <CustomFormField
                                control={form.control}
                                name="doctorName"
                                fieldType={FormFieldType.INPUT}
                                label="Bác sĩ *"
                              />
                            </div>
                            <div className="lg:w-[40%] sm:w-[100%] content-end mb-3 text-end">
                              <span>CN mới nhất 26/08/2024 03:08</span>
                            </div>
                          </div>
                          <div>
                            <CustomFormField
                              control={form.control}
                              name="reason"
                              fieldType={FormFieldType.TEXTAREA}
                              label="Lý do vào viện"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* II/ Hỏi bệnh */}
                  <div
                    className={cn(
                      "flex gap-4 pl-4 pb-4 w-full space-y-4",
                      activeTab === "hoi_benh" ? "block" : "hidden"
                    )}
                  >
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        Hỏi bệnh
                      </div>
                      <div className="p-4 border gap-4">
                        <div className="grid sm:grid-cols-1 gap-4">
                          <CustomFormField
                            control={form.control}
                            name="benh_ly"
                            fieldType={FormFieldType.TEXTAREA}
                            label="Bệnh lý"
                          />
                          <CustomFormField
                            control={form.control}
                            name="tien_su_ban_than"
                            fieldType={FormFieldType.TEXTAREA}
                            label="Tiền sử bệnh bản thân"
                          />

                          <CustomFormField
                            control={form.control}
                            name="tien_su_gia_dinh"
                            label="Tiền sử bệnh gia đình"
                            fieldType={FormFieldType.INPUT}
                          />
                          <div className="md:w-[30%]">
                            <CustomFormField
                              control={form.control}
                              name="in_hospital_with_disease_times"
                              label="Vào viện do bệnh này lần thứ"
                              fieldType={FormFieldType.INPUT}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        Tiền sử sản phụ khoa
                      </div>
                      <div className="p-4 border gap-4">
                        <div className="grid sm:grid-cols-1 gap-4">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            <div>
                              <CustomFormField
                                control={form.control}
                                name="nam_bat_dau_thay_kinh"
                                label="Năm bắt đầu thấy kinh"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div className="sm:w-[50%]">
                              <CustomFormField
                                control={form.control}
                                name="tuoi_co_kinh"
                                label="Tuổi"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            <div>
                              <CustomFormField
                                control={form.control}
                                name="tinh_chat_kinh_nguyet"
                                label="Tính chất kinh nguyệt"
                                fieldType={FormFieldType.TEXTAREA}
                              />
                            </div>
                            <div>
                              <CustomFormField
                                control={form.control}
                                name="chu_ky"
                                label="Chu kỳ"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div>
                              <CustomFormField
                                control={form.control}
                                name="so_ngay_thay_kinh"
                                label="Số ngày thấy kinh"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div>
                              <CustomFormField
                                control={form.control}
                                name="luong_kinh"
                                label="Lượng kinh"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            <div>
                              <CustomFormField
                                control={form.control}
                                name="ngay_kinh_lan_cuoi_date"
                                label="Kinh lần cuối ngày"
                                placeholder="Ngày/Tháng/Năm"
                                fieldType={FormFieldType.DATE_PICKER}
                              />
                            </div>
                            <div className="content-end items-end mb-3 justify-center justify-items-center">
                              <CustomFormField
                                fieldType={FormFieldType.CHECKBOX}
                                control={form.control}
                                name="dau_bung"
                                label="Đau bụng"
                              />
                            </div>
                            <div className="col-span-2">
                              <CustomFormField
                                fieldType={FormFieldType.RADIO}
                                control={form.control}
                                name="thoi_gian_dau_bung"
                                label="Thời gian"
                              >
                                <div className="w-full inline-flex gap-4 pb-3 md:mt-3">
                                  <div className="flex items-center space-x-3 space-y-0">
                                    <RadioGroupItem value="1" id="1_truoc" />
                                    <Label htmlFor="1_truoc">1: Trước</Label>
                                  </div>
                                  <div className="flex items-center space-x-3 space-y-0">
                                    <RadioGroupItem value="2" id="2_trong" />
                                    <Label htmlFor="2_trong">2: Trong</Label>
                                  </div>
                                  <div className="flex items-center space-x-3 space-y-0">
                                    <RadioGroupItem value="3" id="3_sau" />
                                    <Label htmlFor="3_sau">3: Sau</Label>
                                  </div>
                                </div>
                              </CustomFormField>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <CustomFormField
                                control={form.control}
                                name="nam_lay_chong"
                                label="Lấy chồng năm"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div>
                              <CustomFormField
                                control={form.control}
                                name="tuoi_lay_chong"
                                label="Tuổi"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div>
                              <CustomFormField
                                control={form.control}
                                name="nam_het_kinh"
                                label="Hết kinh năm"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div>
                              <CustomFormField
                                control={form.control}
                                name="tuoi_het_kinh"
                                label="Tuổi hết kinh"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                          </div>

                          <div className="gird grid-cols-1">
                            <CustomFormField
                              control={form.control}
                              name="ex_phukhoa"
                              label="Những bệnh phụ khoa đã trị"
                              fieldType={FormFieldType.TEXTAREA}
                            />
                          </div>

                          <div className="flex sm:flex-col gap-1">
                            <div>Tiền thai (Para)</div>
                            <div>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div className="grid grid-cols-4 gap-4">
                                  <div>
                                    <CustomFormField
                                      control={form.control}
                                      name="sinh_du_thang"
                                      fieldType={FormFieldType.INPUT}
                                    />
                                  </div>
                                  <div>
                                    <CustomFormField
                                      control={form.control}
                                      name="de_non"
                                      fieldType={FormFieldType.INPUT}
                                    />
                                  </div>
                                  <div>
                                    <CustomFormField
                                      control={form.control}
                                      name="say"
                                      fieldType={FormFieldType.INPUT}
                                    />
                                  </div>
                                  <div>
                                    <CustomFormField
                                      control={form.control}
                                      name="song"
                                      fieldType={FormFieldType.INPUT}
                                    />
                                  </div>
                                </div>
                                <div className="content-center sm:text-right">
                                  <p>
                                    (Sinh (đủ tháng), Sinh (đẻ non), Sẩy (nạo,
                                    hút), Sống)
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* III/ Khám bệnh */}
                  <div
                    className={cn(
                      "flex gap-4 pl-4 pb-4 w-full space-y-4",
                      activeTab === "kham_benh" ? "block" : "hidden"
                    )}
                  >
                    {/* 1/ Toàn thân */}
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        1/ Toàn thân
                      </div>
                      <div className="p-4 border grid gap-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <div className="inline-flex grow items-end ">
                            <CustomFormField
                              control={form.control}
                              name="mach"
                              label="Mạch"
                              fieldType={FormFieldType.INPUT}
                            />
                            <div className="ml-2 mb-2 flex-initial w-16">
                              <span>lần/phút</span>
                            </div>
                          </div>
                          <div className="inline-flex grow items-end ">
                            <CustomFormField
                              control={form.control}
                              name="huyet_ap"
                              label="Huyết áp"
                              fieldType={FormFieldType.INPUT}
                            />
                            <div className="ml-2 mb-2 flex-initial w-16">
                              <span>lmmHg</span>
                            </div>
                          </div>

                          <div className="inline-flex grow items-end ">
                            <CustomFormField
                              control={form.control}
                              name="nhiet_do"
                              label="Nhiệt độ"
                              fieldType={FormFieldType.INPUT}
                            />
                            <div className="ml-2 mb-2 flex-initial w-16">
                              <span>độ C</span>
                            </div>
                          </div>

                          <div className="inline-flex grow items-end ">
                            <CustomFormField
                              control={form.control}
                              name="nhip_tho"
                              label="Nhịp thở"
                              fieldType={FormFieldType.INPUT}
                            />
                            <div className="ml-2 mb-2 flex-initial w-16">
                              <span>lần/phút</span>
                            </div>
                          </div>
                          <div className="inline-flex grow items-end">
                            <CustomFormField
                              control={form.control}
                              name="can_nang"
                              label="Cân nặng"
                              fieldType={FormFieldType.INPUT}
                            />
                            <div className="ml-2 mb-2 flex-initial w-16">
                              <span>kg</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                          <div>
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.TEXTAREA}
                              name="da_niem_mac_tt"
                              label="Da niêm mạc"
                            />
                          </div>
                          <div>
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.TEXTAREA}
                              name="hach_tt"
                              label="Hạch"
                            />
                          </div>
                          <div>
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.TEXTAREA}
                              name="vu_tt"
                              label="Vú"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 2/ Các cơ quan */}
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        2/ Các cơ quan
                      </div>
                      <div className="p-4 border gap-4">
                        <div className="grid sm:grid-cols-1 gap-4">
                          <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.TEXTAREA}
                            name="tuan_hoan"
                            label="Tuần hoàn"
                          />
                          <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.TEXTAREA}
                            name="ho_hap"
                            label="Hô hấp"
                          />
                          <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.TEXTAREA}
                            name="tieu_hoa"
                            label="Tiêu hóa"
                          />
                          <CustomFormField
                            control={form.control}
                            name="than_kinh"
                            label="Thần kinh"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="co_xuong_khop"
                            label="Cơ xương khớp"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="tiet_nieu"
                            label="Thận Tiết niệu Sinh dục"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="khac"
                            label="Khác"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3/ Khám chuyên khoa */}
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        3/ Khám chuyên khoa
                      </div>
                      <div className="p-4 border gap-4">
                        <span className="font-bold text-red-500">
                          KHÁM NGOÀI
                        </span>
                        <div className="grid sm:grid-cols-2 gap-4 mt-2 mb-5">
                          <CustomFormField
                            control={form.control}
                            name="dau_hieu_sinh_duc"
                            label="Các dấu hiệu sinh dục thứ phát"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="moi_lon"
                            label="Môi lớn"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="moi_be"
                            label="Môi bé"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="am_vat"
                            label="Âm vật"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="am_ho"
                            label="Âm hộ"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="mang_trinh"
                            label="Màng trinh"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="tang_sinh_mon"
                            label="Tăng sinh môn"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                        </div>
                        <span className="font-bold text-red-500 mt-4">
                          KHÁM TRONG
                        </span>
                        <div className="grid sm:grid-cols-2 gap-4 mt-2">
                          <CustomFormField
                            control={form.control}
                            name="am_dao"
                            label="Âm đạo"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="co_tu_cung"
                            label="Cổ tử cung"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="than_tu_cung"
                            label="Thân tử cung"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="phan_phu"
                            label="Phần phụ"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                          <CustomFormField
                            control={form.control}
                            name="cac_tui_cung"
                            label="Các túi cùng"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                        </div>
                      </div>
                    </div>
                    {/* 4/ Các xét nghiệm cận lâm sàng cần làm */}
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        4/ Các xét nghiệm cận lâm sàng cần làm
                      </div>
                      <div className="p-4 border gap-4">
                        <div className="grid sm:grid-cols-1 gap-4">
                          <CustomFormField
                            control={form.control}
                            name="xet_nghiem_can_lam_sang"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        5/ Tóm tắt bệnh án
                      </div>
                      <div className="p-4 border gap-4">
                        <div className="grid sm:grid-cols-1 gap-4">
                          <CustomFormField
                            control={form.control}
                            name="tom_tat_benh_an"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* IV/ Chẩn đoán khi vào khoa điều trị */}
                  <div
                    className={cn(
                      "flex gap-4 pl-5 pb-4 w-full space-y-4",
                      activeTab === "chuan_doan_dieu_tri" ? "block" : "hidden"
                    )}
                  >
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        Chẩn đoán khi vào khoa điều trị
                      </div>
                      <div className="p-4 border grid gap-4">
                        <CustomFormField
                          control={form.control}
                          name="chan_doan"
                          label="Chẩn đoán"
                          fieldType={FormFieldType.TEXTAREA}
                        />

                        {/* Bệnh chính */}
                        {renderICDInput({
                          fieldName: "benh_chinh",
                          label: "Bệnh chính",
                          labelClass: "md:w-[140px]",
                          fields: ["text", "code", "name"],
                          icdType: ICDType.MAIN,
                        })}
                        {renderICDInput({
                          fieldName: "benh_kem_theo",
                          label: "Bệnh kèm theo",
                          labelClass: "md:w-[140px]",
                          fields: ["text", "code", "name"],
                          icdType: ICDType.MAIN,
                        })}
                        {/* Phân biệt */}
                        <CustomFormField
                          control={form.control}
                          name="phan_biet"
                          label="Phân biệt"
                          fieldType={FormFieldType.TEXTAREA}
                        />
                      </div>
                    </div>
                  </div>

                  {/* V/ Tiên lượng */}
                  <div
                    className={cn(
                      "pl-4 w-full ",
                      activeTab === "tien_luong" ? "block" : "hidden"
                    )}
                  >
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        Tiên lượng
                      </div>
                      <div className="p-4 border grid gap-4">
                        <CustomFormField
                          control={form.control}
                          name="tien_luong"
                          fieldType={FormFieldType.TEXTAREA}
                        />
                      </div>
                    </div>
                  </div>

                  {/* VI/ Hướng điều trị */}
                  <div
                    className={cn(
                      "pl-4 w-full ",
                      activeTab === "huong_dieu_tri" ? "block" : "hidden"
                    )}
                  >
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        Hướng điều trị
                      </div>
                      <div className="p-4 border gap-4">
                        <CustomFormField
                          control={form.control}
                          name="huong_dieu_tri"
                          fieldType={FormFieldType.TEXTAREA}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* B/ Tổng kết bệnh án */}
            <TabsContent value="tong_ket_benh_an">
              <Card className="rounded-none border-none shadow-none">
                <div className="flex">
                  <div className="grid gap-y-5 w-full">
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        Tổng kết bệnh án
                      </div>
                      <div className="p-4 border grid gap-4">
                        <CustomFormField
                          control={form.control}
                          name="tong_ket_benh_ly_va_lam_sang"
                          label="Quá trình bệnh lý và diễn biến lâm sàng"
                          fieldType={FormFieldType.TEXTAREA}
                        />
                        <CustomFormField
                          control={form.control}
                          name="tong_ket_can_lam_sang"
                          label="Tóm tắt kết quả xét nghiệm cận lâm sàng có giá trị chẩn đoán"
                          fieldType={FormFieldType.TEXTAREA}
                        />
                        <CustomFormField
                          control={form.control}
                          name="tong_ket_phuong_phap_dieu_tri"
                          label="Phương pháp điều trị"
                          fieldType={FormFieldType.TEXTAREA}
                        />
                        <CustomFormField
                          control={form.control}
                          name="tong_ket_huong_dieu_tri"
                          label="Hướng điều trị và các chế độ tiếp theo"
                          fieldType={FormFieldType.TEXTAREA}
                        />
                        <div className="flex mt-5">
                          <div className="flex items-center w-[150px]">
                            <CustomFormField
                              fieldType={FormFieldType.CHECKBOX}
                              control={form.control}
                              name="thu_thuat"
                              label="Thủ thuật"
                            />
                          </div>
                          <div className="flex items-center ">
                            <CustomFormField
                              fieldType={FormFieldType.CHECKBOX}
                              control={form.control}
                              name="phau_thuat"
                              label="Phẩu thuật"
                            />
                          </div>
                        </div>
                        <div className="inline-flex gap-2">
                          <Table className="border">
                            <TableHeader className="borderdark:bg-accent bg-[hsl(var(--color-custom-3))]">
                              <TableRow>
                                <TableHead className="w-[8px] text-center">
                                  STT
                                </TableHead>
                                <TableHead className="w-[300px]">
                                  Giờ, ngày
                                </TableHead>
                                <TableHead className="w-[300px]">
                                  Phương pháp phẫu thuật/vô cảm
                                </TableHead>
                                <TableHead>Bác sĩ phẫu thuật </TableHead>
                                <TableHead>Bác sĩ gây mê </TableHead>
                                <TableHead></TableHead>
                                {/* <TableHeader>action</TableHeader> */}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[...Array(10)].map((elm: any, i: number) => (
                                <TableRow key={i} className="p-0">
                                  <TableCell>{(i += 1)}</TableCell>
                                  <TableCell>
                                    <div className="w-full sm:flex md:inline-flex gap-1 justify-between items-end">
                                      <CustomFormField
                                        key={i}
                                        control={form.control}
                                        name={`surgery[${i}][day]`}
                                        placeholder="Ngày"
                                        fieldType={FormFieldType.INPUT}
                                      />
                                      <CustomFormField
                                        control={form.control}
                                        name={`surgery[${i}][month]`}
                                        placeholder="Tháng"
                                        fieldType={FormFieldType.INPUT}
                                      />
                                      <CustomFormField
                                        control={form.control}
                                        name={`surgery[${i}][year]`}
                                        placeholder="Năm"
                                        fieldType={FormFieldType.INPUT}
                                      />
                                      <CustomFormField
                                        control={form.control}
                                        name={`surgery[${i}][time]`}
                                        placeholder="Giờ:phút"
                                        fieldType={FormFieldType.INPUT}
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-medium p-1">
                                    <CustomFormField
                                      control={form.control}
                                      name={`surgery[${i}][pp_phauthuat_vocam]`}
                                      fieldType={FormFieldType.TEXTAREA}
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium p-1">
                                    <CustomFormField
                                      control={form.control}
                                      name={`surgery[${i}][phau_thuat_vien]`}
                                      fieldType={FormFieldType.INPUT}
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium p-1">
                                    <CustomFormField
                                      control={form.control}
                                      name={`surgery[${i}][phau_thuat_vien_gayme]`}
                                      fieldType={FormFieldType.INPUT}
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium p-1">
                                    <Icons.close
                                      className="text-red-500 cursor-pointer"
                                      onClick={() => resetFields(i)}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-5">
                          <CustomFormField
                            control={form.control}
                            name="x_quang"
                            label="X-Quang"
                            fieldType={FormFieldType.INPUT}
                          />
                          <CustomFormField
                            control={form.control}
                            name="ct_scanner"
                            label="CT Scanner"
                            fieldType={FormFieldType.INPUT}
                          />
                          <CustomFormField
                            control={form.control}
                            name="sieu_am"
                            label="Siêu âm"
                            fieldType={FormFieldType.INPUT}
                          />
                          <CustomFormField
                            control={form.control}
                            name="xet_nghiem"
                            label="Xét nghiệm"
                            fieldType={FormFieldType.INPUT}
                          />
                          <CustomFormField
                            control={form.control}
                            name="khac_tenloai"
                            label="Khác - Tên loại"
                            fieldType={FormFieldType.INPUT}
                          />
                          <CustomFormField
                            control={form.control}
                            name="khac_soto"
                            label="Khác - Số tờ"
                            fieldType={FormFieldType.INPUT}
                          />
                          <CustomFormField
                            control={form.control}
                            name="toanbo_hoso"
                            label="Toàn bộ hồ sơ"
                            fieldType={FormFieldType.INPUT}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* C/ Thông tin bổ sung */}
            <TabsContent value="bo_sung">
              <Card className="rounded-none border-none shadow-none">
                <div className="flex">
                  <div className={cn("grid gap-y-5 w-full")}>
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        Thông tin bổ sung
                      </div>
                      <div className="p-4 border grid gap-4">
                        <div>
                          {renderICDInput({
                            fieldName: "icd_chuyen_den",
                            label: "ICD chuyển đến",
                            labelClass: "md:w-[140px]",
                            fields: ["text", "code", "name"],
                            icdType: ICDType.MAIN,
                          })}
                          {renderICDInput({
                            fieldName: "icd_chuyen_den_kemtheo",
                            label: "ICD chuyển đến kèm theo",
                            labelClass: "md:w-[140px]",
                            btnText: "Thêm icd chuyển đến kèm theo",
                            fields: ["text", "code", "name"],
                          })}
                        </div>

                        <div>
                          {renderICDInput({
                            fieldName: "icd_kkb_capcuu",
                            label: "ICD KKB cấp cứu kèm theo",
                            labelClass: "md:w-[140px]",
                            fields: ["text", "code", "name"],
                            icdType: ICDType.MAIN,
                          })}

                          {renderICDInput({
                            fieldName: "icd_kkb_capcuu_kemtheo",
                            label: "ICD KKB cấp cứu kèm theo",
                            labelClass: "md:w-[140px]",
                            btnText: "Thêm ICD KKB cấp cứu kèm theo",
                            fields: ["text", "code", "name"],
                          })}
                        </div>

                        <div>
                          {renderICDInput({
                            fieldName: "icd_kkb_capcuu",
                            label: "ICD khoa điều trị kèm theo",
                            labelClass: "md:w-[140px]",
                            fields: ["text", "code", "name"],
                            icdType: ICDType.MAIN,
                          })}
                          {renderICDInput({
                            fieldName: "icd_kkb_capcuu_kemtheo",
                            label: "ICD khoa điều trị kèm theo",
                            labelClass: "md:w-[140px]",
                            btnText: "Thêm icd khoa điều trị kèm theo",
                            fields: ["text", "code", "name"],
                          })}
                        </div>

                        <div className="flex">
                          <div className="flex items-center w-[150px]">
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-2"
                            >
                              Thủ thuật
                            </label>
                            <Checkbox id="thu_thuat" />
                          </div>
                          <div className="flex items-center ">
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-2"
                            >
                              Phẩu thuật
                            </label>
                            <Checkbox id="phau_thuat" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* D/ Tình trạng ra viện */}
            <TabsContent value="ra_vien">
              <Card className="rounded-none border-none shadow-none">
                <div className="flex">
                  <div className={cn("grid gap-y-5  w-full ")}>
                    <div className="flex-col">
                      <div className="p-3 border border-b-0 bg-accent font-bold">
                        Tình trạng ra viện
                      </div>
                      <div className="p-4 border grid gap-4">
                        <div>
                          {renderICDInput({
                            fieldName: "icd_chinh",
                            label: "ICD chính",
                            labelClass: "md:w-[140px]",
                            fields: ["text", "code", "name"],
                            icdType: ICDType.MAIN,
                          })}
                          {renderICDInput({
                            fieldName: "icd_nguyennhan",
                            label: "Nguyên nhân",
                            labelClass: "md:w-[140px]",
                            fields: ["text", "code", "name"],
                            icdType: ICDType.MAIN,
                          })}
                          {renderICDInput({
                            fieldName: "icd_kemtheo",
                            label: "ICD kèm theo",
                            labelClass: "md:w-[140px]",
                            fields: ["text", "code", "name"],
                            btnText: "Thêm icd kèm theo",
                          })}
                        </div>
                        <div>
                          {renderICDInput({
                            fieldName: "icd_chuandoan_truoc_phauthuat",
                            label: "ICD chuẩn đoán trước phẩu thuật",
                            labelClass: "md:w-[140px]",
                            fields: ["text", "code", "name"],
                            btnText: "Thêm icd chẩn đoán trước phẫu thuật",
                          })}
                        </div>
                        <div>
                          {renderICDInput({
                            fieldName: "icd_chuandoan_sau_phauthuat_main",
                            label: "ICD chẩn đoán sau phẫu thuật  ",
                            labelClass: "md:w-[140px]",
                            fields: ["text", "code", "name"],
                            icdType: ICDType.MAIN,
                          })}
                        </div>
                        <div>
                          {renderICDInput({
                            fieldName: "icd_chuandoan_sau_phauthuat_add",
                            label: "Thêm ICD chẩn đoán sau phẫu thuật",
                            labelClass: "md:w-[140px]",
                            fields: ["text", "code", "name"],
                            btnText: "Thêm icd chẩn đoán trước phẫu thuật",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Footer button submit */}
            <div className="flex content-center p-5 justify-center bg-[hsl(var(--color-custom-3))]/50 border-l border-r border-b shadow">
              <Button
                className={cn(
                  "mr-5 w-[150px] bg-[hsl(var(--color-button))] hover:bg-[hsl(var(--color-button))]/80",
                  fontSize
                )}
                type="submit"
              >
                Lưu
              </Button>
              <Button
                className={cn(
                  "w-[150px] bg-[hsl(var(--color-button))] hover:bg-[hsl(var(--color-button))]/80",
                  fontSize
                )}
                type="submit"
              >
                Lưu và In
              </Button>
            </div>
          </Tabs>
        </form>
      </Form>
    </>
  );
};
