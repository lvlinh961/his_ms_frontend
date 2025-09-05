import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UseFormSetError } from "react-hook-form";
import { EntityError } from "@/lib/http";
import { toast } from "@/components/ui/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

/**
 * Group list of object by key
 */
export const groupBy = <T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
) =>
  array.reduce(
    (result, item) => {
      (result[key(item)] ||= []).push(item);
      return result;
    },
    {} as Record<K, T[]>
  );

/**
 * Date format
 */
export const dateFormater = new Intl.DateTimeFormat("vi-VN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Ho_Chi_Minh",
});

/**
 * Datetime format
 */
export const datetimeFormater = new Intl.DateTimeFormat("vi-VN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Ho_Chi_Minh",
});

export const formatDateToIsoWithoutMs = (date: Date): string => {
  return date.toISOString().split(".")[0];
};

export const objectToFormData = (obj: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value instanceof Date) {
      formData.append(key, formatDateToIsoWithoutMs(value)); // Convert Date to ISO 8601
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        const itemKey = `${key}[${i}]`;
        if (v instanceof Date) {
          formData.append(itemKey, v.toISOString());
        } else {
          formData.append(itemKey, v);
        }
      });
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};

export const paramsString = (params: any) => {
  if (params == null || params == undefined) {
    return null;
  }
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined) // loại bỏ các giá trị undefined
      .reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {} as Record<string, string>
      )
  ).toString();

  return queryString;
};

export const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}