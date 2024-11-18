import { z } from "zod";
import { passwordSchema } from "./passwordSchema";

export const confirmPasswordMatch = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "两次输入的密码不一致",
      });
    }
  });
