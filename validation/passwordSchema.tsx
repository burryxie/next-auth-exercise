import { z } from "zod";

export const passwordSchema = z.string().min(8, "密码长度不能少于8位");
