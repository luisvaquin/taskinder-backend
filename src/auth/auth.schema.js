import { z } from "zod";

export const registerSchema = z.object({
    username: z.string({
        required_error: 'Usuario es requerido',
    }).min(3, {
        message: 'El usuario  debe tener al menos 3 caracteres',
    }),
    email: z.string({
        required_error: 'Correo es requerido',
    }).email({
        message: 'Correo invalido',
    }),
    password: z.string({
        required_error: 'Password is required',
    }).min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres',
    })
})

export const loginSchema = z.object({
    email: z.string({
        required_error: "Correo es requerido",
    }).email({
        message: "Correo invalido",
    }),
    password: z.string({
        required_error: "Contraseña es requerida",
    }).min(6, {
        message: "Contraseña invalida",
    })
})