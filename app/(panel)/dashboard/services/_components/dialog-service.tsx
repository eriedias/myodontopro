"use client"

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogServiceFormData, useDialogServiceFormData } from "./dialog-service-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { convertRealToCents } from "@/utils/convertCurrency";
import { createNewService } from "../_actions/create-service";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateService } from "../_actions/update-service";

interface DialogServiceProps {
    closeModal: () => void;
    serviceId?: string;
    initialValues?: {
        name: string;
        price: string;
        hours: string;
        minutes: string;
    }
}

export function DialogService( {closeModal, initialValues, serviceId}: DialogServiceProps ) {

    const form = useDialogServiceFormData({ initialValues: initialValues });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(values: DialogServiceFormData){
        setLoading(true);
        const priceInCents = convertRealToCents(values.price)
        const hours = parseInt(values.hours) || 0;
        const minutes = parseInt(values.minutes) || 0;

        const duration = (hours * 60) + minutes;

        if(serviceId){
            await editServiceById({
                serviceId: serviceId,
                name: values.name,
                priceInCents: priceInCents,
                duration: duration,
            })

            return;
        }

        const response = await createNewService({
            name: values.name,
            price: priceInCents,
            duration: duration
        })
            
        setLoading(false);

        if (response.error){
            toast.error(response.error)
            return;
        }

        toast.success("Serviço cadastrado com sucesso")
        handleCloseModal();
        router.refresh();
    }

    async function editServiceById({ 
        serviceId, 
        name, 
        priceInCents, 
        duration }: { 
            serviceId: string, 
            name: string,
            priceInCents: number,
            duration: number,
        }) {
           
        const response = await updateService({
            serviceId: serviceId, 
            name: name,
            price: priceInCents,
            duration: duration,
        })

        setLoading(false);

        if(response.error) {
            toast(response.error)
            return;
        }

        toast(response.data);
        handleCloseModal();
    }

    function handleCloseModal(){
        form.reset();
        closeModal();
    }

    function changeCurrency(event: React.ChangeEvent<HTMLInputElement>){
        let { value } = event.target;
        value = value.replace(/\D/g, '');

        // Valor em centavos:   VALOR EM REAIS * 100
        // Valor em reais:      VALOR EM CENTAVOS / 100
        if (value) {
            value = (parseInt(value, 10) / 100).toFixed(2);
            value = value.replace('.', ',');
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }

        event.target.value = value;
        form.setValue("price", value);
    }
    
    return (
        <>
            <DialogHeader>
                <DialogTitle>Novo serviço</DialogTitle>
                <DialogDescription>
                    Adicione um novo serviço
                </DialogDescription>
            </DialogHeader>
            
            <form id="form-service" className="space-y-2"
                onSubmit={form.handleSubmit(onSubmit)}
            >

                <div className="flex flex-col space-y-6">

                    <FieldGroup>

                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-service-name">
                                    Nome do serviço
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-service-name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Digite o nome do serviço"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-service-price">
                                    Preço do serviço
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-service-price"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Ex.: 120,00"
                                    autoComplete="off"
                                    onChange={changeCurrency}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                                </Field>
                            )}
                        />

                    </FieldGroup>

                    <FieldGroup className="grid grid-cols-2">

                        <Controller
                            name="hours"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-service-hours">
                                    Horas
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-service-hours"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="0"
                                    min="0"
                                    type="number"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="minutes"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-service-minutes">
                                    Minutos
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-service-minutes"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="0"
                                    min="0"
                                    type="number"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                                </Field>
                            )}
                        />

                    </FieldGroup>

                </div>

                <Button 
                    type="submit" 
                    className="w-full font-semibold text-white mt-6"
                    disabled={loading}
                >
                    {loading ? "Carregando..." : `${serviceId ? "Atualizar serviço" : "Cadastrar serviço"}`}
                </Button>

            </form>
        </>
    );
}