"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { confirmPasswordMatch } from "@/validation/confirmPassword";
import { registerUser } from "./actions";
import Link from "next/link";

// import { passwordSchema } from "@/validation/password";

const formSchema = z
  .object({
    email: z.string().email(),
    // password: passwordSchema,
    //   confirmPassword: z.string(),
  })
  .and(confirmPasswordMatch);

function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    // if (data.password !== data.confirmPassword) {
    //   form.setError("password", { message: "密码不匹配" });
    //   form.setError("confirmPassword", { message: "密码不匹配" });
    //   return;
    // }

    const response = await registerUser({
      email: data.email,
      // password: (await hash(data.password, 10)).toString(),
      password: data.password,
      // confirmPassword: data.confirmPassword,
    });

    if (response?.error) {
      console.log(response.error);
      form.setError("email", { message: response.message });
    } else {
    }
  };

  return (
    <main className="flex justify-center items-center h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[200px]">
          <CardHeader className="text-center">
            <CardTitle>注册成功</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center">
            <Button asChild>
              <Link href="/login">返回登录</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle>用户注册</CardTitle>
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
                            // type="email"
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

                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>密码</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="再次输入密码"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="mt-4">
                    注册
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm text-center">
              已有账号？
              <Link href="/login" className="underline">
                登陆
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}

export default Register;
