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
import { zodResolver } from "@hookform/resolvers/zod";
import ResetPassword from "./actions";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
});

function PasswordReset() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: decodeURIComponent(searchParams.get("email") || "") || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await ResetPassword({
      email: data.email,
    });
  };

  return (
    <main className="flex justify-center items-center h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[500px] p-4">
          <CardHeader>
            <CardTitle>找回密码</CardTitle>
          </CardHeader>
          <CardContent>
            {`您的邮箱${
              form.getValues().email
            }将会收到一封找回密码的邮件，您可以通过邮件中的链接找回密码`}
          </CardContent>

          <CardFooter className="flex flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm text-center">
              没有账号？
              <Link href="/register" className="underline">
                注册
              </Link>
            </div>

            <div className="text-muted-foreground text-sm text-center">
              已有账号？
              <Link href="/login" className="underline">
                登陆
              </Link>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-[500px]">
          <CardHeader className="text-center">
            <CardTitle>找回密码</CardTitle>
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

                  {form.formState.errors.root?.message && (
                    <FormMessage>
                      {form.formState.errors.root?.message}
                    </FormMessage>
                  )}

                  <Button type="submit" className="mt-4">
                    找回密码
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm text-center">
              没有账号？
              <Link href="/register" className="underline">
                注册
              </Link>
            </div>

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

export default PasswordReset;
