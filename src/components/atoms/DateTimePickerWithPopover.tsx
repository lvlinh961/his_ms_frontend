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

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  fromYear?: number;
  toYear?: number;
  placeholder?: string;
};

export default function DateTimePickerWithPopover({
  value,
  onChange,
  fromYear = 1950,
  toYear = new Date().getFullYear(),
  placeholder = "Chọn ngày & giờ",
}: Props) {
  const [date, setDate] = useState<Date>(value ?? new Date());

  useEffect(() => {
    if (value) setDate(value);
  }, [value]);

  // Year/Month
  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("vi-VN", { month: "long" })
  );

  const setPart = (
    part: "year" | "month" | "hours" | "minutes",
    value: number
  ) => {
    const newDate = new Date(date);
    if (part === "year") newDate.setFullYear(value);
    if (part === "month") newDate.setMonth(value);
    if (part === "hours") newDate.setHours(value);
    if (part === "minutes") newDate.setMinutes(value);
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[260px] justify-start text-left font-normal"
        >
          {value ? (
            format(value, "dd/MM/yyyy HH:mm")
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4 space-y-4" align="start">
        <div className="flex gap-2">
          {/* Year */}
          <Select
            value={String(date.getFullYear())}
            onValueChange={(val) => setPart("year", +val)}
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

          {/* Month */}
          <Select
            value={String(date.getMonth())}
            onValueChange={(val) => setPart("month", +val)}
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

        {/* Calendar */}
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              const updated = new Date(
                newDate.getFullYear(),
                newDate.getMonth(),
                newDate.getDate(),
                date.getHours(),
                date.getMinutes()
              );
              setDate(updated);
              onChange(updated);
            }
          }}
          month={date}
          onMonthChange={(m) => setDate(m)}
          fromYear={fromYear}
          toYear={toYear}
        />

        {/* Time Picker */}
        <div className="flex gap-2">
          <Select
            value={String(date.getHours())}
            onValueChange={(val) => setPart("hours", +val)}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Giờ" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, h) => (
                <SelectItem key={h} value={String(h)}>
                  {h.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(date.getMinutes())}
            onValueChange={(val) => setPart("minutes", +val)}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Phút" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, m) => (
                <SelectItem key={m} value={String(m)}>
                  {m.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
