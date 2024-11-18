"use client";

import { Button } from "@/components/ui/button";
import logout from "./actions";

export default function LogoutButton() {
  return (
    <Button
      size="sm"
      onClick={() => {
        logout();
      }}
    >
      退出
    </Button>
  );
}