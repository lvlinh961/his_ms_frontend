"use client";
import { useCallback, useContext } from "react";
import { Department } from "@/types";
import { useRouter } from "next/navigation";
import { DashboardContext } from "@/contexts/dashboard-context";
import { departments } from "@/constants/data";

export default function Page() {
  const provider =  useContext(DashboardContext);
  const router = useRouter();

  const setDepartmentSelected = (item: Department) => {
  provider.setDepartmentSelected(item);
    setTimeout(() => {
      router.push("/customer/info");
    }, 100);
  };

     const renderDeparment = useCallback(() => {

  if (!departments.length) return <></>;

    return (
      <div className="grid content-center grid-cols-1 sm:grid-cols-2 content-center justify-center mt-4">
        {departments.map((item: Department, index: number) => {
          return (
            <div
              key={index}
              className="m-2 p-2 content-center border-[#DDD] border border-solid hover:bg-[hsl(var(--selected-user-foreground))] hover:cursor-pointer hover:text-accent transition duration-200 delay-50 bg-muted rounded"
              onClick={() => setDepartmentSelected(item)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    );
  }, []);

  return (
    <>
      <div className="flex-1 text-center content-center m-auto w-[600px] p-4 pt-1 md:p-4 h-full">
        <b>Chọn khoa làm việc</b>
        {renderDeparment()}
      </div>
    </>
  );
}
