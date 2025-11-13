"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import apiRequest from "../apiRequest";
import { useAppContext } from "@/providers/app-proviceders";

const formSchema = z.object({
  username: z.string().min(1, { message: "Vui lòng nhập tên tài khoản!!" }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu!!!" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAppContext();
  const defaultValues = {
    username: "",
    password: "",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    // router.push("/department");
    if (loading) return;
    setLoading(true);

    try {
      const result = await apiRequest.login(data);

      await apiRequest.auth({
        sessionToken: result.payload.result.token,
        expiredTime: result.payload.result.expiredTime,
      });

      let account = {
        id: result.payload.result.userId,
        firstName: result.payload.result.firstname,
        lastName: result.payload.result.lastname,
        scope: result.payload.result.scope,
        tenant: result.payload.result.tenant,
      };

      setUser(account);

      router.push("/reception");
      router.refresh();
    } catch (error: any) {
      console.error("Login Error:", error);
      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Tài khoản"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Mật khẩu"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Đăng nhập
          </Button>
        </form>
      </Form>
    </>
  );
}
