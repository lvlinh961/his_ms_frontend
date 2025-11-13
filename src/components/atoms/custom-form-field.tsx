import React, { useState } from "react";
import { FormFieldType } from "@/constants/enum";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/radio-group";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useAppContext } from "@/providers/app-proviceders";
import { CustomFormFieldProps } from "@/types/index";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePickerWithPopover from "./DatePickerWithPopover";
import DateTimePickerWithPopover from "./DateTimePickerWithPopover";

const RenderInput = ({
  field,
  props,
  onChangeCustom,
}: {
  field: any;
  props: CustomFormFieldProps;
  onChangeCustom?: (value: any) => void;
}) => {
  const [date, setDate] = React.useState<Date>();

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className={cn("flex ", props.fieldWidth || "flex-1")}>
          <FormControl>
            <Input
              type={
                props?.type === "password" ? "password" : props?.type || "text"
              }
              placeholder={props?.placeholder || ""}
              {...field}
              disabled={props?.disabled || false}
              className={props?.fontSize || ""}
              onChange={onChangeCustom ? onChangeCustom : field.onChange}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.NUMBER:
      return (
        <div className={cn("flex", props.fieldWidth || "flex-1")}>
          <FormControl>
            <Input
              type="number"
              placeholder={props?.placeholder || ""}
              disabled={props?.disabled || false}
              className={props?.fontSize || ""}
              inputMode="numeric"
              value={field.value ?? ""}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? undefined : Number(e.target.value);
                field.onChange(value);
                if (onChangeCustom) onChangeCustom;
              }}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            disabled={props?.disabled || false}
            className={cn(props?.fontSize || "", "flex-1")}
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={onChangeCustom ? onChangeCustom : field.onChange}
            />
            <label htmlFor={props.name}>{props.label || ""}</label>
          </div>
        </FormControl>
      );
    case FormFieldType.RADIO:
      return (
        <FormControl className="">
          <RadioGroup
            onValueChange={(value) => {
              field.onChange(value);
              if (onChangeCustom) onChangeCustom(value);
            }}
            value={String(field.value)}
          >
            {props.children}
          </RadioGroup>
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          {/* onCheckedChange={onChangeCustom ? onChangeCustom : field.onChange} */}
          <Select
            onValueChange={onChangeCustom ? onChangeCustom : field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{props.children}</SelectContent>
          </Select>
        </FormControl>
      );
    // case FormFieldType.DATE_PICKER:
    //   const [open, setOpen] = useState(false);
    //   // Ensure date state always valid
    //   const parsedValue = field.value ? new Date(field.value) : undefined;
    //   const [date, setDate] = useState<Date | undefined>(parsedValue);

    //   return (
    //     <div className="flex rounded-md">
    //       <FormControl>
    //         <Input
    //           type="date"
    //           placeholder={props?.placeholder || ""}
    //           value={field.value ?? ""}
    //           onChange={(e) => {
    //             const v = e.target.value;
    //             field.onChange(v);
    //             setDate(v ? new Date(v) : undefined);
    //           }}
    //           disabled={props?.disabled || false}
    //           className={cn("input-date", props?.fontSize || "")}
    //         />
    //       </FormControl>

    //       <Popover open={open} onOpenChange={setOpen}>
    //         <PopoverTrigger asChild>
    //           <CalendarIcon className="ml-2 mt-2 h-6 w-6" />
    //         </PopoverTrigger>
    //         <PopoverContent className="w-auto p-0" align="end">
    //           <Calendar
    //             mode="single"
    //             selected={date}
    //             onSelect={(value) => {
    //               console.log("TEST Date Picker", value);
    //               setDate(value);
    //               if (value) {
    //                 const formatted = format(value, "yyyy-MM-dd");
    //                 field.onChange(formatted);
    //               } else {
    //                 field.onChange("");
    //               }
    //               setOpen(false);
    //             }}
    //             initialFocus
    //           />
    //         </PopoverContent>
    //       </Popover>
    //     </div>
    //   );

    case FormFieldType.DATE_PICKER:
      return (
        <FormControl>
          <DatePickerWithPopover
            value={field.value ? new Date(field.value) : null}
            onChange={field.onChange}
          />
        </FormControl>
      );
    case FormFieldType.DATETIME_PICKER:
      return (
        <FormControl>
          <DateTimePickerWithPopover
            value={field.value ? new Date(field.value) : null}
            onChange={field.onChange}
          />
        </FormControl>
      );
    default:
      return null;
  }
};

const CustomFormField = (props: CustomFormFieldProps) => {
  const { control, name, label, onChangeCustom } = props;
  const { fontSize } = useAppContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex ${props.direction === "row" ? "flex-row items-center space-x-2" : "flex-col space-y-1"} flex-1`}
        >
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel
              className={cn(
                fontSize || "",
                props.direction === "row" && props.labelWidth
              )}
            >
              {label}
            </FormLabel>
          )}
          <RenderInput
            field={field}
            props={{ ...props, fontSize }}
            onChangeCustom={onChangeCustom}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
