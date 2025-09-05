"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  fromYear?: number;
  toYear?: number;
  placeholder?: string;
};

export default function DatePickerWithPopover({
  value,
  onChange,
  fromYear = 1950,
  toYear = new Date().getFullYear(),
  placeholder = "Chọn ngày",
}: Props) {
  const [month, setMonth] = useState<Date>(value ?? new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    if (value) setMonth(value);
  }, [value]);

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("vi-VN", { month: "long" })
  );

  const handleSelectMonth = (monthIndex: number) => {
    const newDate = new Date(month);
    newDate.setMonth(monthIndex);
    setMonth(newDate);
  };

  const handleSelectYear = (year: number) => {
    const newDate = new Date(month);
    newDate.setFullYear(year);
    setMonth(newDate);
  };

  return (
    <Popover
      open={datePickerOpen}
      onOpenChange={setDatePickerOpen}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[260px] justify-start text-left font-normal"
        >
          {value ? (
            format(value, "dd/MM/yyyy", { locale: vi })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="px-3 py-2 flex gap-2">
          <Select
            value={String(month.getFullYear())}
            onValueChange={(val) => handleSelectYear(Number(val))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(month.getMonth())}
            onValueChange={(val) => handleSelectMonth(Number(val))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((label, i) => (
                <SelectItem key={i} value={String(i)}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            if (date) {
              onChange(date);
              setDatePickerOpen(false);
            }
          }}
          month={month}
          onMonthChange={setMonth}
          fromYear={fromYear}
          toYear={toYear}
        />
      </PopoverContent>
    </Popover>
  );
}
