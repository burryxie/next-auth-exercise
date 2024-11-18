import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TwoFactorAuthForm from "./two-factor-auth-form";
import db from "@/db/drizzle";
import { usersSchema } from "@/db/schemas";
import { eq } from "drizzle-orm";

const MyAccount = async () => {
  const session = await auth();

  const [user] = await db
    .select({
      TwoFactorAuthSecretActivated: usersSchema.twoFactorAuthSecretActivated,
    })
    .from(usersSchema)
    .where(eq(usersSchema.id, parseInt(session?.user?.id!)));

  return (
    <div>
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>我的账号</CardTitle>
        </CardHeader>

        <CardContent>
          <Label>邮箱地址</Label>
          <div className="text-sm text-muted-foreground">
            {session?.user?.email}
          </div>
          <TwoFactorAuthForm
            twoFactorAuthActivated={user.TwoFactorAuthSecretActivated ?? false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MyAccount;
