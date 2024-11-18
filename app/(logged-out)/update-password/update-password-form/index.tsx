"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { confirmPasswordMatch } from "@/validation/confirmPassword";
import { passwordSchema } from "@/validation/passwordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UpdatePassword from "./actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const formSchema = confirmPasswordMatch;

export default function UpdatePasswordForm({ token }: { token: string }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await UpdatePassword({
      token: token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (response?.tokenInvalid) {
      window.location.reload();
    }

    if (response?.error) {
      form.setError("root", { message: response.message });
    } else {
      toast({
        title: "密码修改成功",
        description: "请重新登录",
        className: "bg-green-500 text-white",
      });
      form.reset();
    }
  };

  return (
    <div>
      {form.formState.isSubmitSuccessful ? (
        <div>
          您的密码已经重置。<Link href="/login">登陆</Link>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset
              disabled={form.formState.isSubmitting}
              className="flex flex-col gap-2"
            >
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新设密码</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入新密码"
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
                    <FormLabel>重复密码</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="再次输入新密码"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!!form.formState.errors.root?.message && (
                <FormMessage>{form.formState.errors.root?.message}</FormMessage>
              )}

              <Button type="submit" className="mt-4">
                修改
              </Button>
            </fieldset>
          </form>
        </Form>
      )}
    </div>
  );
}
