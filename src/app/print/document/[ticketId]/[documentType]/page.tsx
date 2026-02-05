"use client";

import { DocumentTypeEnum } from "@/types";
import z from "zod";
import AcceptSurgeryTicket from "../../templates/AcceptSurgeryTicket";
import SurgeryTicket from "../../templates/SurgeryTicket";
import { notFound } from "next/navigation";
import ProcedureTicket from "../../templates/ProcedureTicket";
import SurgicalSafetyChecklist from "../../templates/SurgicalSafetyChecklist";
import TreatmentRecord from "../../templates/TreatmentRecord";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ ticketId: string; documentType: z.infer<typeof DocumentTypeEnum> }>;
}) {
  const resolvedParams = use(params);
  const { ticketId, documentType } = resolvedParams;

  switch (documentType) {
    case DocumentTypeEnum.enum.SURGERY_CONSENT:
      return (
        <AcceptSurgeryTicket ticketId={ticketId} documentType={documentType} />
      );
    case DocumentTypeEnum.enum.SURGERY_TICKET:
      return <SurgeryTicket ticketId={ticketId} documentType={documentType} />;
    case DocumentTypeEnum.enum.PROCEDURE_TICKET:
      return (
        <ProcedureTicket ticketId={ticketId} documentType={documentType} />
      );
    case DocumentTypeEnum.enum.SURGICAL_SAFETY_CHECKLIST:
      return (
        <SurgicalSafetyChecklist
          ticketId={ticketId}
          documentType={documentType}
        />
      );
    case DocumentTypeEnum.enum.TREATMENT_RECORD:
      return (
        <TreatmentRecord ticketId={ticketId} documentType={documentType} />
      );
    default:
      return notFound();
  }
}
