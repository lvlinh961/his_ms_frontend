import z from "zod";

export const AccountRes = z
  .object({
    data: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
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
  })
  .strict();

export type AccountResType = z.TypeOf<typeof AccountRes>;

export const UpdateMeBody = z.object({
  name: z.string().trim().min(2).max(256),
});

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
