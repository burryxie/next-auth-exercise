import Link from "next/link";
import React from "react";
import LogoutButton from "./logout-button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const LoggedInLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  console.log(session);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="flex justify-between items-center p-4 bg-gray-200">
        <ul className="flex flex-row justify-between  gap-4">
          <li>
            <Link href="/my-account">My Account</Link>
          </li>
          <li>
            <Link href="/change-password">Change Password</Link>
          </li>
        </ul>
        <div>
          <LogoutButton />
        </div>
      </nav>
      <div className="flex justify-center items-center flex-1">{children}</div>
    </div>
  );
};

export default LoggedInLayout;
