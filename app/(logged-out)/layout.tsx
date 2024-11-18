import { auth } from "@/auth";
import { redirect } from "next/navigation";

const loggedOutLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!!session?.user?.id) {
    redirect("/my-account");
  }

  return <div>{children}</div>;
};

export default loggedOutLayout;
