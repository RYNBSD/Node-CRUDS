import { z } from "zod";

export const User = z.object({
  id: z.number().min(0),
  name: z.string().trim().min(1),
  email: z.string().trim().min(1).email(),
});

export type TUser = z.infer<typeof User>

export const ArrUser = z.array(User)

export type TArrUser = TUser[]

export const isEmail = z.string().trim().min(1).email();
