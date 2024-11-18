"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { usersSchema } from "@/db/schemas";
import { confirmPasswordMatch } from "@/validation/confirmPassword";
import { passwordSchema } from "@/validation/passwordSchema";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

const ChangePassword = async ({
  currentPassword,
  password,
  confirmPassword,
}: {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}) => {
  const session = await auth();

  //   console.log(session, session?.user?.id);
  if (!session?.user?.id) {
    return {
      error: true,
      message: "You must logged in first to change password",
    };
  }

  if (currentPassword === password) {
    return {
      error: true,
      message: "新密码不能与旧密码相同",
    };
  }

  const formSchema = z
    .object({ currentPassword: passwordSchema })
    .and(confirmPasswordMatch);

  const passwordValidation = formSchema.safeParse({
    currentPassword,
    password,
    confirmPassword,
  });

  if (passwordValidation.error) {
    return {
      error: true,
      message: passwordValidation.error.issues[0].message || "An error occured",
    };
  }

  const [user] = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.id, parseInt(session?.user?.id as string)));

  if (!user) {
    return {
      error: true,
      message: "未找到用户",
    };
  }

  const passwordMatch = await compare(currentPassword, user.password as string);

  if (!passwordMatch) {
    return {
      error: true,
      message: "当前密码输入错误",
    };
  }

  const hashedPassword = await hash(password as string, 10);

  await db
    .update(usersSchema)
    .set({ password: hashedPassword })
    .where(eq(usersSchema.id, parseInt(session?.user?.id as string)));
};

export default ChangePassword;
