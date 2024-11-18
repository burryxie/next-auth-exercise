import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/drizzle";
import { passwordResetTokensSchema } from "@/db/passwordResetTokensSchema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import React from "react";
import UpdatePasswordForm from "./update-password-form";

const UpdatePassword = async ({
  searchParams,
}: {
  searchParams: { token?: string };
}) => {
  let tokenIsValid = false;
  const { token } = searchParams;

  if (token) {
    const [passwordResetToken] = await db
      .select()
      //   .select({ tokenExpiresAt: passwordResetTokensSchema.tokenExpiresAt })
      .from(passwordResetTokensSchema)
      .where(eq(passwordResetTokensSchema.token, token));

    const now = new Date();

    if (
      passwordResetToken?.tokenExpiresAt &&
      now.getTime() <= passwordResetToken.tokenExpiresAt?.getTime()
    ) {
      tokenIsValid = true;
    }
  }

  return (
    <main className="flex justify-center items-center h-screen">
      <Card className="w-[500px] p-4">
        <CardHeader>
          <CardTitle>
            {tokenIsValid ? "密码重置" : "密码重置链接错误或已失效"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tokenIsValid ? (
            <UpdatePasswordForm token={token || ""} />
          ) : (
            <Link href="/password-reset">重置密码</Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default UpdatePassword;
