import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6)
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export const updateSchema = z.object({
    name: z.string().min(1).optional(),
    oldPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional()
})

export const groupSchema = z.object({
    name: z.string().min(1),
    members: z.array(z.string()).min(1)
})