"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface UseProfileFormProps {
    name: string | null;
    address: string | null;
    phone: string | null;
    status: string | null;
    timeZone: string | null;
}

const profileSchema = z.object({
    name:       z.string().min(1, "O nome deve conter pelo menos 1 caractere"),
    address:    z.string().optional(),
    phone:      z.string().optional(),
    status:     z.string().optional(),
    timeZone:   z.string().min(1, "O fuso horário é obrigatório"),
})

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({ name, address, phone, status, timeZone}: UseProfileFormProps) {
    return useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: name || "",
            address: address || "",
            phone: phone || "",
            status: status || "active",
            timeZone: timeZone || "",
        },
    });
}

export function onSubmit(data: z.infer<typeof profileSchema>) {
    console.log("Form enviado", data);
}