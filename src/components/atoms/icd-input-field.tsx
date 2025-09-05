import React, { useState } from "react";
import { cn } from "@/lib/utils";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType, ICDType } from "@/constants/enum";
import { Icons } from "@/components/icons";
import { useAppContext } from "@/providers/app-proviceders";
import { Label } from "@radix-ui/react-label";
import clsx from "clsx";

interface InputProps {
  name: string;
  control?: any;
  fieldsName: string[];
  label?: string;
  btnAddText?: string;
  labelClass?: string;
  icdType?: string;
}
type ICDInclude = {
  text?: string;
  code?: string;
  name?: string;
};

export const IcdInputField: React.FC<InputProps> = (props: InputProps) => {
  const { name, control, fieldsName, label, btnAddText, icdType } = props;
  const { fontSize } = useAppContext();
  const entries = [...fieldsName].map((item: string) => [item, ""]);
  const defaultData = Object.fromEntries(entries);
  const [icdList, setIcdList] = useState([defaultData]);
  const img = icdType === ICDType.MAIN ? "settings" : "trash";
  const Icon = Icons[img];

  const handleClick = (i: number) => {
    if (icdType === ICDType.MAIN) {
      alert("Show modal.");
    } else {
      removeIcdInput(i);
    }
  };

  const removeIcdInput = (i: number) => {
    let newFormValues: {
      [key: number]: ICDInclude;
    }[] = [...icdList];
    newFormValues.splice(i, 1);
    setIcdList(newFormValues);
  };

  const addNewICDInput = () => {
    setIcdList((prevState) => [...prevState, defaultData]);
  };

  const renderInput = () => {
    return (
      <>
        {icdList.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className="sm:flex md:inline-flex w-full gap-x-3 space-y-2 mb-2"
            >
          {fieldsName.map((field: any, i: number) => (
              <div
                  key={`icd${i}`}
                className={clsx("sm:w-full content-end justify-end", {
                  "md:w-[30%]": i === 0 && fieldsName.length < 3,
                  "flex-none md:w-[35%]":
                    (i === 0 || i == 2) && fieldsName.length === 3,
                  "flex-none md:w-[20%]": i === 1 && fieldsName.length === 3,
                })}
              >
                <CustomFormField
                  key={`FormField${i}`}
                  control={control}
                  name={
                    icdType === ICDType.MAIN
                      ? `${name}_${field}`
                      : `${name}[${index}][${field}]`
                  }
                  label={i === 0 ? label : ""}
                  fieldType={FormFieldType.INPUT}
                />
              </div>
          ))}
          <div className="content-end w-10">
            <div
              className={clsx(
                "flex border justify-center h-10 p-2 rounded cursor-pointer",
                {
                  "bg-red-500 text-white": icdType !== ICDType.MAIN,
                  "bg-accent": icdType === ICDType.MAIN,
                }
              )}
              onClick={() => handleClick(index)}
            >
              <Icon className="remr-2 h-5 w-5" />
            </div>
          </div>
        </div>
          );
        })}
      </>
    );
  };

  if (!fieldsName) return <></>;

  return (
    <section>
      <div className="w-[100%]">{renderInput()}</div>

      {btnAddText && icdType !== ICDType.MAIN && (
        <div className="w-full">
          <Label
            className={cn(
              "flex content-center font-bold text-[hsl(var(--color-button))] cursor-pointer",
              fontSize
            )}
            onClick={() => addNewICDInput()}
          >
            <Icons.add className={cn("remr-2 h-5 w-5")} />
            {btnAddText}
          </Label>
        </div>
      )}
    </section>
  );
};
