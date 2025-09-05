"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FileUp } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import apiRequest from "./emrApiRequest";

export default function AddDocumentForm() {
  const [formData, setFormData] = useState({
    documentName: "",
    documentType: "",
    date: new Date(),
    file: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, file: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    var data = new FormData();
    data.append("checkInOutId", "1234");
    data.append("patientId", "12345");
    data.append("patientId", "12345");
    data.append("documentName", formData.documentName);
    data.append("type", formData.documentType);
    data.append("date", formData.date.toISOString().split(".")[0]);
    if (formData.file) data.append("file", formData.file);

    const result = apiRequest.createDocument(data);
    console.log("Create result: ", result);
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FileUp />
            Upload tài liệu
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload phiếu bệnh án</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="gap-3">
              <Label htmlFor="documentName">Tên tài liệu</Label>
              <Input
                id="documentName"
                name="documentName"
                type="text"
                onChange={handleChange}
              />
            </div>
            <div className="gap-3">
              <Label htmlFor="documentType">Loại tài liệu</Label>
              <Select
                name="documentType"
                onValueChange={(value) =>
                  setFormData({ ...formData, documentType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue>Chọn loại tài liệu</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMR">Bệnh án</SelectItem>
                  <SelectItem value="TREATMENT_RECORD">Tờ điều trị</SelectItem>
                  <SelectItem value="XN_APPOINTMENT">
                    Chỉ định xét nghiệm
                  </SelectItem>
                  <SelectItem value="CDHA_APPOINTMENT">
                    Chỉ định CĐHA
                  </SelectItem>
                  <SelectItem value="TAKE_CARE_DOCUMENT">
                    Phiếu chăm sóc điều dưỡng
                  </SelectItem>
                  <SelectItem value="TRANSFER">
                    Phiếu bàn giao người bệnh
                  </SelectItem>
                  <SelectItem value="AGREEMENT">Phiếu cam kết</SelectItem>
                  <SelectItem value="INFORMATION">
                    Phiếu cung cấp thông tin
                  </SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="gap-3">
              <Label htmlFor="date">Ngày tạo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {formData.date ? (
                      format(formData.date, "PPP")
                    ) : (
                      <span>Ngày tạo</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      console.log("select date: ", date);
                      setFormData({ ...formData, date: date! });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="gap-3">
              <Label htmlFor="documentFile">Tệp tài liệu</Label>
              <Input
                id="documentFile"
                type="file"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Huỷ</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
