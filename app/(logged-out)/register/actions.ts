"use server";

import { z } from "zod";
import { hash } from "bcryptjs";

// import { confirmPasswordMatch } from "@/validation/confirmPassword";
import db from "@/db/drizzle";
import { usersSchema } from "@/db/usersSchema";

export const registerUser = async ({
  email,
  password,
}: // confirmPassword,
{
  email: string;
  password: string;
  // confirmPassword: string;
}) => {
  try {
    const newUserSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });
    // .and(confirmPasswordMatch);

    const newUserValidation = newUserSchema.safeParse({
      email,
      password,
      // confirmPassword,
    });

    if (!newUserValidation.success) {
      return {
        error: true,
        message:
          newUserValidation.error.issues[0]?.message ?? "An error occurred",
      };
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(usersSchema).values({
      email,
      password: hashedPassword,
    });
  } catch (error: unknown) {
    if (error.code === "23505") {
      return {
        error: true,
        message: "该邮箱已经注册",
      };
    }
    return {
      error: true,
      message: "An error occurred",
    };
  }
};
