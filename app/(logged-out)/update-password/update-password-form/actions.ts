"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { passwordResetTokensSchema, usersSchema } from "@/db/schemas";
import { confirmPasswordMatch } from "@/validation/confirmPassword";
import { passwordSchema } from "@/validation/passwordSchema";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

const UpdatePassword = async ({
  token,
  password,
  confirmPassword,
}: {
  token: string;
  password: string;
  confirmPassword: string;
}) => {
  const formSchema = confirmPasswordMatch;
  const passwordValidation = formSchema.safeParse({
    password,
    confirmPassword,
  });

  if (passwordValidation.error) {
    return {
      error: true,
      message: passwordValidation.error.issues[0].message || "An error occured",
    };
  }

  const session = await auth();
  console.log(session);

  if (session?.user?.id) {
    return {
      error: true,
      message:
        "You have already logged in. Please logout first to reset your password",
    };
  }

  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokensSchema)
      .where(eq(passwordResetTokensSchema.token, token));

    const now = new Date();

    if (
      passwordResetToken?.tokenExpiresAt &&
      now.getTime() > passwordResetToken.tokenExpiresAt?.getTime()
    ) {
      return {
        error: true,
        message: "链接已过期",
        tokenInvalid: true,
      };
    }

    const hashedPassword = await hash(password as string, 10);

    await db
      .update(usersSchema)
      .set({ password: hashedPassword })
      .where(eq(usersSchema.id, passwordResetToken?.userId as number));

    await db
      .delete(passwordResetTokensSchema)
      .where(eq(passwordResetTokensSchema.token, token));
  }
};

export default UpdatePassword;
