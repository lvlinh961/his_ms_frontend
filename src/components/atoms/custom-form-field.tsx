import React from "react";
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

const RenderInput = ({
  field,
  props,
  onChangeCustom,
}: {
  field: any;
  props: CustomFormFieldProps;
  onChangeCustom?: () => void;
}) => {
  const [date, setDate] = React.useState<Date>();

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex">
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
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            disabled={props?.disabled || false}
            className={props?.fontSize || ""}
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
        <FormControl className="space-y-3">
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
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
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md">
          <FormControl>
            <>
              <Input
                type="date"
                placeholder={props?.placeholder || ""}
                {...field}
                disabled={props?.disabled || false}
                className={cn("input-date", props?.fontSize || "")}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <CalendarIcon className="ml-2 mt-2 h-6 w-6" />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(value) => {
                      setDate(value);
                      if (value) {
                        field.value = format(value, "yyyy-MM-dd");
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </>
          </FormControl>
        </div>
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
        <FormItem className="flex-1 space-y-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className={fontSize || ""}>{label}</FormLabel>
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
