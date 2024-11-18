"use server";

import { z } from "zod";

import { passwordSchema } from "@/validation/passwordSchema";
import { signIn } from "@/auth";
import db from "@/db/drizzle";
import { usersSchema } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const logIn = async ({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token?: string;
}) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });

  const loginValidation = loginSchema.safeParse({ email, password });

  if (!loginValidation.success) {
    return {
      success: false,
      message:
        loginValidation.error.issues[0].message ||
        "Something went wrong while validation",
    };
  }

  try {
    await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      token: token,
    });
  } catch (error: unknown) {
    return {
      error: true,
      message: `用户名或密码错误:${error}`,
    };
  }
};

export const preLoginCheck = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const [user] = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.email, email));

  if (!user) {
    return {
      error: true,
      message: "用户名错误",
    };
  } else {
    const passwordCorrect = await compare(password, user.password as string);

    if (!passwordCorrect) {
      return {
        error: true,
        message: "密码错误",
      };
    }
    return {
      tewoFactorActivated: user.twoFactorAuthSecretActivated,
    };
  }
};
