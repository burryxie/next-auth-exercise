"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { passwordResetTokensSchema, usersSchema } from "@/db/schemas";
import { mailer } from "@/lib/email";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

const ResetPassword = async ({ email }: { email: string }) => {
  const session = await auth();

  if (!!session?.user?.id) {
    return { error: true, message: "您已经登陆" };
  }

  const [user] = await db
    .select({ id: usersSchema.id })
    .from(usersSchema)
    .where(eq(usersSchema.email, email));

  if (!user) {
    return;
    // return { error: true, message: "未找到用户，请确认邮箱是否正确" };
  }

  const passwordResetToken = randomBytes(32).toString("hex");
  const tokenExpiryAt = new Date(Date.now() + 3600000);
  await db
    .insert(passwordResetTokensSchema)
    .values({
      userId: user.id,
      email: email,
      token: passwordResetToken,
      tokenExpiresAt: tokenExpiryAt,
    })
    .onConflictDoUpdate({
      target: passwordResetTokensSchema.userId,
      set: {
        token: passwordResetToken,
        tokenExpiresAt: tokenExpiryAt,
      },
    });

  const resetLink = `${process.env.SITE_BASE_URL}/update-password?token=${passwordResetToken}`;

  await mailer.sendMail({
    from: "test@resend.dev",
    to: email,
    subject: "重置密码",
    text: `请点击以下链接重置密码：\n${resetLink}`,
    html: `<p>请点击以下链接重置密码：</p><a href="${resetLink}">${resetLink}</a>`,
  });

  console.log(passwordResetToken);
};

export default ResetPassword;
