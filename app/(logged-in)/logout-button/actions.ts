"use server";

import { signOut } from "@/auth";

const logout = async () => {
  return await signOut();
};

export default logout;
