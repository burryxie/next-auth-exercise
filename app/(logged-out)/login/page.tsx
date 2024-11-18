"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { passwordSchema } from "@/validation/passwordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { logIn, preLoginCheck } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const preLogInCheckResponse = await preLoginCheck({
      email: data.email,
      password: data.password,
    });

    if (preLogInCheckResponse.error) {
      form.setError("root", {
        message: preLogInCheckResponse.message,
      });
      return;
    }
    if (preLogInCheckResponse.tewoFactorActivated) {
      setStep(2);
    } else {
      const response = await logIn({
        email: data.email,
        password: data.password,
      });

      if (response?.error) {
        form.setError("root", {
          message: response.message,
        });
      } else {
        router.push("/my-account");
      }
    }
  };

  const email = form.getValues("email");

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await logIn({
      email: form.getValues("email"),
      password: form.getValues("password"),
      token: otp,
    });

    if (response?.error) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    } else {
      router.push("/my-account");
    }
  };

  return (
    <main className="flex justify-center items-center h-screen">
      {step == 1 && (
        <Card className="w-[350px]">
          <CardHeader className="text-center">
            <CardTitle>用户登陆</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex flex-col gap-2"
                >
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>邮箱地址</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="请输入邮箱地址"
                            {...field}
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>密码</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="请输入密码"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.formState.errors.root?.message && (
                    <FormMessage>
                      {form.formState.errors.root?.message}
                    </FormMessage>
                  )}

                  <Button type="submit" className="mt-4">
                    登陆
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm text-center">
              没有账号？
              <Link href="/register" className="underline">
                注册
              </Link>
            </div>

            <div className="text-muted-foreground text-sm text-center">
              忘记密码？
              <Link
                href={`/password-reset${
                  email ? `?email=${encodeURIComponent(email)}` : ""
                }`}
                className="underline"
              >
                找回密码
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}

      {step == 2 && (
        <Card className="w-[500px]">
          <CardHeader className="text-center">
            <CardTitle>请输入二次验证码</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOtpSubmit}>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Button
                className="w-full mt-3"
                type="submit"
                disabled={otp.length != 6}
              >
                提交
              </Button>
              <Button
                className="w-full mt-3"
                variant={"outline"}
                onClick={() => setStep(1)}
              >
                取消
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

export default Login;
