import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ChangePasswordForm from "./change-password-form";

const ChangePassword = () => {
  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader>修改密码</CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
