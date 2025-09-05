"use client";
import React, { useState, useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { CustomerList } from "@/components/customer/customer-list";
import CusomerInfo from "@/components/customer/customer-info";
// import { customers } from "@/constants/data";
import { Customer } from "@/types";
import apiRequest from "@/components/customer/api-request";

type CustomerProps = {
  className?: string;
};

export default function CustomerLeftSideBar({ className }: CustomerProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilterCustomers] = useState([]);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  const handleInputChange = (e: any) => {
    const searchValue = e.target.value;
    setSearchItem(searchValue);
    if (customers !== undefined) {
      const filterItems =
        customers &&
        customers.filter(
          (item: Customer) =>
            item.patientName
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            item.patientCode.toString().includes(searchValue)
        );

      setFilterCustomers(filterItems);
    }
  };

  useEffect(() => {
    fetchListRegist();
  }, []);

  const fetchListRegist = async () => {
    const response = await apiRequest.getListRegistInDate();
    const data = response?.payload.result;

    setCustomers(data);
    setFilterCustomers(data);
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
            {/* <CusomerInfo /> */}
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
                DANH SÁCH BỆNH NHÂN
              </div>
              <CustomerList data={filteredCustomers} />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
