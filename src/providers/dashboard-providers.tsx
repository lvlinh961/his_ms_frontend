"use client";
import { useState, useCallback, useContext } from "react";
import { Customer, Department } from "@/types";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-proviceders";
import { DashboardContext } from "@/contexts/dashboard-context";

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { fontSize } = useAppContext();
  const [customers, setCustomersState] = useState<Customer[]>([]);
  const [customerSelected, setCustomerSelectedState] =
    useState<Customer | null>(null);
  const [departmentSelected, setDepartmentSelectedState] =
    useState<Department | null>(null);

  const setCustomers = useCallback(
    (patients: Customer[]) => {
      setCustomersState(patients);
    },
    [setCustomersState]
  );

  const setCustomerSelected = useCallback(
    (customerSelected: Customer) => {
      setCustomerSelectedState(customerSelected);
    },
    [setCustomerSelectedState]
  );

  const setDepartmentSelected = useCallback(
    (departmentSelected: Department) => {
      setDepartmentSelectedState(departmentSelected);
    },
    [setDepartmentSelectedState]
  );

  return (
    <DashboardContext.Provider
      value={{
        customers,
        setCustomers,
        customerSelected,
        setCustomerSelected,
        departmentSelected,
        setDepartmentSelected,
      }}
    >
      <div className={cn(fontSize)}>{children}</div>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
