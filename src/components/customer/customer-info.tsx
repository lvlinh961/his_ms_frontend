"use client";
import React, { useState, useContext } from "react";
import { DashboardContext } from "@/contexts/dashboard-context";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

export default function PatienInfo() {
  const provider = useContext(DashboardContext);

  return (
    <div className="flex flex-col h-[100px] justify-center items-center font-semibold bg-[hsl(var(--background))] p-[5px] mb-[5px]">
      {provider?.customerSelected && (
        <>
          <div className="text-[hsl(var(--selected-patient))] text-lg">
            <center>{provider?.customerSelected?.patientName ?? ""}</center>
          </div>
          <div className="text-[13px]">
            <center>
              <label>
                ({provider.customerSelected.gender ? "Nam" : "Nữ"}, )
                {/* {provider.customerSelected.age} tuổi */}
              </label>
            </center>
            <center>
              <label>ID: {provider.customerSelected.patientCode}</label>
            </center>
            <center>
              {/* {provider.customerSelected.insurance && (
                <label>
                  <Badge
                    className={clsx("ml-2", {
                      "bg-green-600":
                        provider.customerSelected.insurance ===
                        "BHYT đúng tuyến",
                      "bg-red-600":
                        provider.customerSelected.insurance !==
                        "BHYT đúng tuyến",
                    })}
                  >
                    {provider.customerSelected.insurance ?? ""}
                  </Badge>
                </label>
              )} */}
            </center>
          </div>
        </>
      )}
      {!provider?.customerSelected && (
        <>
          <span className="text-[13px] font-light">
            Chưa có bệnh nhân được chọn.
          </span>
        </>
      )}
    </div>
  );
}
