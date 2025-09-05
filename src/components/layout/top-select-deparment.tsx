"use client";
import React from "react";
import { departments } from "@/constants/data";
import { Department } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TopSelectDeparmentProps = {
  className?: string;
};
export default function TopSelectDeparment({
  className,
}: TopSelectDeparmentProps) {
  return (
    <>
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Chọn khoa làm việc" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {departments.length &&
              departments.map((item: Department, index: number) => {
                return (
                  <SelectItem key={index} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                );
              })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
