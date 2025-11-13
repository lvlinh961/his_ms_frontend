import z from "zod";

export const RegisterBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
  result: z.object({
    token: z.string(),
    expiredTime: z.string(),
    profile: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    }),
    userId: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    scope: z.string(),
    tenant: z
      .object({
        id: z.string(),
        address: z.string(),
        email: z.string(),
        name: z.string(),
        phone: z.string(),
        code: z.string(),
        disabled: z.boolean().default(false),
        createdAt: z.date(),
      })
      .optional(),
  }),
  message: z.string(),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
  .object({
    username: z.string().min(1),
    password: z.string().min(1),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = RegisterRes;

export type LoginResType = z.TypeOf<typeof LoginRes>;
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;
export const SlideSessionRes = RegisterRes;

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;
