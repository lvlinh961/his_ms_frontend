"use client";
import { createContext } from "react";
import { Customer, Department } from "@/types";

const DashboardContext = createContext<{
  customers: Customer[] | [];
  setCustomers: (customers: Customer[] | []) => void;
  customerSelected: Customer | null;
  setCustomerSelected: (customer: Customer) => void;
  departmentSelected: Department | null;
  setDepartmentSelected: (department: Department) => void;
}>({
  customers: [],
  setCustomers: () => {},
  customerSelected: null,
  setCustomerSelected: () => {},
  departmentSelected: null,
  setDepartmentSelected: () => {},
});

export { DashboardContext };
