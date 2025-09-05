"use client";
import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardContext } from "@/contexts/dashboard-context";
import { Customer } from "@/types";
import { Badge } from "@/components/ui/badge";

interface CustomerListProps {
  data: Customer[];
}
export const CustomerList: React.FC<CustomerListProps> = ({ data }) => {
  const provider = useContext(DashboardContext);
  const [active, setActive] = useState(
    provider?.customerSelected?.patientCode ?? 0
  );

  const setCustomerSeleted = (customer: Customer) => {
    setActive(customer.patientCode);
    provider.setCustomerSelected(customer);
  };

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="mt-2.5 ">
        {data && data.length ? (
          <>
            {data.map((item: Customer, i: number) => {
              return (
                <div
                  className={cn(
                    `flex flex-col p-2 leading-7 border-b cursor-pointer hover:opacity-80 odd:bg-[hsl(var(--muted))]/10`,
                    active === item.patientCode
                      ? "bg-[hsl(var(--selected-user-foreground))] odd:bg-[hsl(var(--selected-user-foreground))] border-2 border-[hsl(var(--selected-user-foreground))] text-background"
                      : ""
                  )}
                  key={i}
                  onClick={() => setCustomerSeleted(item)}
                >
                  <span className="font-semibold">{item.patientName}</span>
                  <p className={cn(`opacity-60`)}>
                    <span>{item.patientCode}</span>
                    <span className="text-[12px]">
                      {/* {item.insurance ? ` - ${item.insurance}` : ""} */}
                    </span>
                  </p>
                </div>
              );
            })}
          </>
        ) : (
          <center>
            <span className="font-semibold">Không có bệnh nhân..</span>
          </center>
        )}
      </div>
    </ScrollArea>
  );
};
