import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { EmrItem } from "./emr-schema";
import apiRequest from "./emrApiRequest";

interface EmrGroupMenuProps {
  title: string;
  items: EmrItem[];
}

export default function EmrGroupMenu({ title, items }: EmrGroupMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDocument = async () => {
    const result = await apiRequest.getDocument("");
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full rounded-lg shadow-lg p-2"
    >
      <CollapsibleTrigger className="flex items-center w-full justify-between font-bold">
        <span>{title}</span>
        <ChevronDown
          className={`left transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 border-t mt-2 ml-4">
        {items.map((item: EmrItem, index: number) => {
          return (
            <div className="pt-2" onClick={getDocument} key={index}>
              {item.documentType}
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
