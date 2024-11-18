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
import ChangePassword from "./actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(confirmPasswordMatch);

export default function ChangePasswordForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await ChangePassword({
      currentPassword: data.currentPassword,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <fieldset
            disabled={form.formState.isSubmitting}
            className="flex flex-col gap-2"
          >
            <FormField
              name="currentPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>当前密码</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入当前密码"
                      {...field}
                      type="password"
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
    </div>
  );
}
