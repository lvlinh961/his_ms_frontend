"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/constants/navItems";
import { MenuIcon } from "lucide-react";
import { useState, useContext, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "../ui/input";
import { DashboardContext } from "@/contexts/dashboard-context";
import { customers } from "@/constants/data";
import { Customer } from "@/types";

export function MobileSidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [searchItem, setSearchItem] = useState("");
  const [filteredCustomers, setFilterCustomers] = useState(customers);
  const [open, setOpen] = useState(false);
  const [toogleItem, setToogleItem] = useState(false);
  const provider = useContext(DashboardContext);

  const handleInputChange = (e: any) => {
    const searchValue = e.target.value;
    setSearchItem(searchValue);

    const filterItems = customers.filter(
      (item: Customer) =>
        item.patientName.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.patientCode.toString().includes(searchValue)
    );
    setFilterCustomers(filterItems);
    setToogleItem(true);
  };

  const handleSelectedItem = (item: Customer) => {
    provider.setCustomerSelected(item);
    setOpen(false);
    setToogleItem(false);
  };

  const renderCustomerList = useCallback((customers: Customer[]) => {
    if (!customers.length) {
      return (
        <div className="p-5 ">
          <span>No result...</span>
        </div>
      );
    }

    return (
      <>
        {customers.map((item: Customer, i: number) => {
          return (
            <CommandItem key={i}>
              <div
                className="flex flex-col"
                onClick={() => handleSelectedItem(item)}
              >
                <span>{item.patientName}</span>
                <span>{item.patientCode}</span>
              </div>
            </CommandItem>
          );
        })}
      </>
    );
  }, []);

  const renderCustomerInfo = (customer: Customer) => {
    if (!customer) return <></>;

    return (
      <>
        <center>
          <h2 className="px-4 text-lg font-semibold tracking-tight">
            {provider.customerSelected?.patientName}
          </h2>
        </center>
        {provider.customerSelected ? (
          <>
            <center>
              ID:{provider.customerSelected?.patientCode},{" "}
              {/* {provider.customerSelected.age} tuổi,{" "} */}
              {provider.customerSelected.gender ? "Nam" : "Nữ"}
            </center>
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              {renderCustomerInfo(provider.customerSelected)}
              <div className="w-full flex center align-center item-center pb-4]">
                <Command className="z-10 rounded-lg border shadow-md h-auto w-[100%]">
                  <Input
                    type="text"
                    value={searchItem}
                    placeholder="Tìm bệnh nhân"
                    className="w-full md:max-w-sm shadow-inner"
                    onChange={handleInputChange}
                  />
                  <CommandList
                    className={cn(
                      toogleItem ? "" : "hidden",
                      "absolute w-[95%] mt-12 bg-[hsl(var(--primary-foreground))]"
                    )}
                  >
                    {renderCustomerList(filteredCustomers)}
                  </CommandList>
                </Command>
              </div>
              <div className="space-y-1">
                <DashboardNav
                  items={navItems}
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
