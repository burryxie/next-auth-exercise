import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "./db/drizzle";
import { usersSchema } from "./db/usersSchema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { authenticator } from "otplib";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        token: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const [user] = await db
          .select()
          .from(usersSchema)
          .where(eq(usersSchema.email, credentials?.email as string));

        if (!user) {
          throw new Error("No users found");
        }

        const passwordCorrect = await compare(
          credentials.password as string,
          user.password as string
        );

        if (!passwordCorrect) {
          throw new Error("Wrong password");
        }

        if (user.twoFactorAuthSecretActivated) {
          const isValid = authenticator.check(
            credentials.token as string,
            user.twoFactorAuthSecret as string
          );

          if (!isValid) {
            throw new Error("Incorrect OTP");
          }
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
