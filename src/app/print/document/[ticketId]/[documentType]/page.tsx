"use client";

import { DocumentTypeEnum } from "@/components/surgery/surgery.types";
import z from "zod";
import AcceptSurgeryTicket from "../../templates/AcceptSurgeryTicket";
import SurgeryTicket from "../../templates/SurgeryTicket";
import { notFound } from "next/navigation";
import ProcedureTicket from "../../templates/ProcedureTicket";
import SurgicalSafetyChecklist from "../../templates/SurgicalSafetyChecklist";

export default function Page({
  params,
}: {
  params: { ticketId: string; documentType: z.infer<typeof DocumentTypeEnum> };
}) {
  const { ticketId, documentType } = params;

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
    default:
      return notFound();
  }
}
