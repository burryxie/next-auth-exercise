"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { usersSchema } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";

export const get2faSecret = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "User not found",
    };
  }

  const [user] = await db
    .select({ twoFactorAuthSecret: usersSchema.twoFactorAuthSecret })
    .from(usersSchema)
    .where(eq(usersSchema.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  let twoFactorSecret = user.twoFactorAuthSecret;
  console.log(twoFactorSecret);
  if (!twoFactorSecret) {
    twoFactorSecret = authenticator.generateSecret();

    await db
      .update(usersSchema)
      .set({ twoFactorAuthSecret: twoFactorSecret })
      .where(eq(usersSchema.id, parseInt(session?.user?.id!)));
  }

  return {
    twoFactorSecret: authenticator.keyuri(
      session?.user?.email ?? "",
      "MyApp",
      twoFactorSecret!
    ),
  };
};

export const enable2fa = async (token: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "User not found",
    };
  }

  const [user] = await db
    .select({ twoFactorAuthSecret: usersSchema.twoFactorAuthSecret })
    .from(usersSchema)
    .where(eq(usersSchema.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  if (user.twoFactorAuthSecret) {
    const isValid = authenticator.check(token, user.twoFactorAuthSecret);

    if (!isValid) {
      return {
        error: true,
        message: "Invalid OTP",
      };
    }

    await db
      .update(usersSchema)
      .set({ twoFactorAuthSecretActivated: true })
      .where(eq(usersSchema.id, parseInt(session?.user?.id)));
  }
};

export const disable2fa = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "User not found",
    };
  }

  const [user] = await db
    .select({ twoFactorAuthSecret: usersSchema.twoFactorAuthSecret })
    .from(usersSchema)
    .where(eq(usersSchema.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  if (!user.twoFactorAuthSecret) {
    if (!user) {
      return {
        error: true,
        message: "Two factor authentication not set yet",
      };
    }
  } else {
    await db
      .update(usersSchema)
      .set({ twoFactorAuthSecretActivated: false })
      .where(eq(usersSchema.id, parseInt(session?.user?.id)));
  }
};
