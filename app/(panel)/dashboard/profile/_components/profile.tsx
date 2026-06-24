"use client"

import { useState } from "react";
import { ProfileFormData, useProfileForm } from "./profile-form"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prisma } from "@/lib/generated/prisma/client"
import { updateProfile } from "../_actions/update-profile";
import { toast } from "sonner";
import { formatPhone } from "@/utils/formatPhone"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserWithSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true;
    }
}>

interface ProfileContentProps {
    user: UserWithSubscription;
}

export function ProfileContent({user}: ProfileContentProps) {
    const router = useRouter();
    const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? []);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { update } = useSession();

    const form = useProfileForm({
        name: user.name,
        address: user.address,
        phone: user.phone,
        status: user.status,
        timeZone: user.timeZone,
    });

    function generateTimeSlots(): string[] {
        const hours: string[] = [];
        for (let i = 8; i <= 23; i++) {
            for (let j = 0; j < 2; j++) {
                const hour = i.toString().padStart(2, "0");
                const minute = (j * 30).toString().padStart(2, "0");
                hours.push(`${hour}:${minute}`);
            }
        }
        return hours;
    }
    const hours = generateTimeSlots();

    function toggleHour(hour: string) {
        setSelectedHours((prev) =>
            prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour].sort()
        );
    }

    const timeZones = Intl.supportedValuesOf("timeZone").filter((zone) => 
        zone.startsWith("America/Sao_Paulo") ||
        zone.startsWith("America/Fortaleza") ||
        zone.startsWith("America/Recife") ||
        zone.startsWith("America/Bahia") ||
        zone.startsWith("America/Belem") ||
        zone.startsWith("America/Manaus") ||
        zone.startsWith("America/Cuiaba") ||
        zone.startsWith("America/Boa_Vista")
    )

    async function onSubmit(values: ProfileFormData) {

        const response = await updateProfile({
            name: values.name,
            address: values.address,
            phone: values.phone,
            status: values.status === "active" ? "active" : "inactive",
            timeZone: values.timeZone,
            times: selectedHours || [],
        });

        // https://sonner.emilkowal.ski/
        if (response.error){
            toast.error(response.error)
            return;
        }

        toast.success(response.data);
    }

    async function handleLogout() {
        await signOut();
        await update();
        router.replace("/");
    }
    
    return (
        <div className="mx-auto">
            <form id="form-profile" onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Meu Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        
                        <div className="flex justify-center">
                            <div className="bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden">
                                <Image 
                                    src={user.image ? user.image : "/foto1.png"} 
                                    fill 
                                    className="object-cover"
                                    alt="Imagem de Perfil"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            
                            <FieldGroup>

                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-profile-name">
                                            Nome
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-profile-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Digite o nome da clínica"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="address"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-profile-address">
                                            Endreço
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-profile-address"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Digite o endereço da clínica"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="phone"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-profile-phone">
                                            Telefone
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-profile-phone"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="(99) 99999-9999"
                                            onChange={(e) => {
                                                const formattedPhone = formatPhone(e.target.value)
                                                field.onChange(formattedPhone)
                                            }}
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="status"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-profile-status">
                                            Status da clínica
                                        </FieldLabel>
                                        <Select
                                            name={field.name}
                                            // value={field.value}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value ? "active" : "inactive"}
                                        >
                                            <SelectTrigger
                                                id="form-profile-status"
                                                aria-invalid={fieldState.invalid}
                                                className="min-w-[120px]"
                                            >
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent position="item-aligned">
                                                <SelectItem value="active">Ativo (clínica aberta)</SelectItem>
                                                <SelectItem value="inactive">Inativo (clínica fechada)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        </Field>
                                    )}
                                />

                            </FieldGroup>

                            <div className="space-y-2">
                                <Label>
                                    Configurar os horários da clínica:
                                </Label>

                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant={"outline"} className="w-full justify-between">
                                            Clique aqui para selecionar os horários
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Horários da clínica</DialogTitle>
                                            <DialogDescription>Selecione abaixo os horários de funcionamento da clínica</DialogDescription>
                                        </DialogHeader>
                                        <section className="py-4">
                                            <p className="text-sm text-muted-foreground mb-2">Clique nos horários abaixo para marcar ou desmarcar:</p>
                                            <div className="grid grid-cols-5 gap-2">
                                                {hours.map((hour) => (
                                                    <Button 
                                                        key={hour}
                                                        variant={"outline"}
                                                        className={cn("h-10", selectedHours.includes(hour) && "border-2 border-emerald-500 text-primary")}
                                                        onClick={() => toggleHour(hour)}
                                                    >
                                                        {hour}
                                                    </Button>
                                                ))}
                                            </div>
                                        </section>
                                        <Button className="w-full" onClick={() => setDialogOpen(false)}>
                                            Fechar janela
                                        </Button>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <FieldGroup>
                                <Controller
                                    name="timeZone"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-profile-timezone">
                                            Selecione o fuso horário
                                        </FieldLabel>
                                        <Select
                                            name={field.name}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                id="form-profile-timezone"
                                                aria-invalid={fieldState.invalid}
                                                className="min-w-[120px]"
                                            >
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent position="item-aligned">
                                                {timeZones.map((zone) => (
                                                    <SelectItem key={zone} value={zone}>
                                                        {zone}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                            <Button
                                type="submit"
                                className="w-full bg-emerald-500 hover:bg-emerald-400"
                            >
                                Salvar Alterações
                            </Button>

                        </div>

                    </CardContent>
                </Card>
            </form>

            <section className="mt-4">
                <Button
                    variant={"destructive"}
                    onClick={handleLogout}
                >
                    Sair da conta
                </Button>
            </section>
        </div>
    )
}