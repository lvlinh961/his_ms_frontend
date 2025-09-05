"use client";
import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import CusomerInfo from "@/components/customer/customer-info";
import { customers } from "@/constants/data";
import { Customer } from "@/types";
import { listsEmrItem, EmrDocumentGroup } from "./list-document";
import EmrGroupMenu from "./emr-group-menu";

type CustomerProps = {
  className?: string;
};

export default function EmrLeftSideBar({ className }: CustomerProps) {
  const [isOpen, setisOpen] = useState(false);
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [filteredCustomers, setFilterCustomers] = useState(customers);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  const handleInputChange = (e: any) => {
    // const searchValue = e.target.value;
    // setSearchItem(searchValue);
    // const filterItems = customers.filter(
    //   (item: Customer) =>
    //     item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    //     item.id.toString().includes(searchValue)
    // );
    // setFilterCustomers(filterItems);
  };

  return (
    <>
      <nav
        className={cn(
          `relative hidden h-screen flex-none border-r z-10 pt-20 lg:block`,
          status && "duration-500",
          !isMinimized ? "w-72" : "w-[40px]",
          className
        )}
      >
        <ChevronLeft
          className={cn(
            "absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground",
            isMinimized && "rotate-180"
          )}
          onClick={handleToggle}
        />
        {!isMinimized && (
          <div>
            <CusomerInfo />
            <div className="p-2 shadow">
              <Input
                type="text"
                value={searchItem}
                placeholder="Tìm bệnh nhân"
                className="w-full md:max-w-sm shadow-inner"
                onChange={handleInputChange}
              />
            </div>
            <div className="h-fulll">
              <div className="flex text-center justify-center p-3 font-bold  border-t border-b">
                Hồ sơ bệnh án
              </div>
              {/* {listsEmrItem.map((group: EmrDocumentGroup, index: number) => {
                return <EmrGroupMenu key={index} group={group} />;
              })} */}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
