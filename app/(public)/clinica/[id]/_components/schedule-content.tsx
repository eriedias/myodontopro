"use client"

import Image from "next/image"
import { MapPin } from "lucide-react"
import { Prisma } from "@/lib/generated/prisma/client"
import { useAppointmentForm, AppointmentFormData } from "./schedule-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { formatPhone } from "@/utils/formatPhone"
import { DateTimePicker } from "./date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { ScheduleTimeList } from "./schedule-time-list"
import { createNewAppointment } from "../_actions/create-appointment"
import { toast } from "sonner"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
    services: true,
  }
}>

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {

  const form = useAppointmentForm();
  const { watch } = form;

  const selectedDate = watch("date")
  const selectedServiceId = watch("serviceId")

  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [blockedTimes, setBlockedTimes] = useState<string[]>([])

  const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
    setLoadingSlots(true);
    try {
      const dateString = date.toISOString().split("T")[0]
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`)

      const json = await response.json();
      setLoadingSlots(false);
      return json;
      
    } catch (err) {
      console.log(err);
      setLoadingSlots(false);
      return [];
    }
  }, [clinic.id])

  useEffect(() => {

    if(selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTimes(blocked);
        const times = clinic.times || [];
        const finalSlots = times.map((time) => ({
          time: time,
          available: !blocked.includes(time)
        }))

        // Se o slot atual estiver indisponivel, limpamos a seleção
        const stillAvailable = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.available
        )

        if(!stillAvailable) {
          setSelectedTime("");
        }

        setAvailableTimeSlots(finalSlots)

      })
    }

  }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])

  async function handleRegisterAppointment(formData: AppointmentFormData) {
    if (!selectedTime) {
      return;
    }

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      serviceId: formData.serviceId,
      time: selectedTime,
      clinicId: clinic.id
    })

    if (response.error) {
      toast.error(response.error)
      return;
    }

    toast.success("Consulta agendada com sucesso!")
    form.reset();
    setSelectedTime("");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-emerald-500" />

      <section className="contianer mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8">
              <Image
                src={clinic.image ? clinic.image : "/foto1.png"}
                alt="Foto da clinica"
                className="object-cover"
                fill
              />
            </div>

            <h1 className="text-2xl font-bold mb-2">
              {clinic.name}
            </h1>
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>
                {clinic.address ? clinic.address : "Endereço não informado"}
              </span>
            </div>
          </article>

        </div>
      </section>

      <section className="max-w-2xl mx-auto w-full mt-5">
        <form 
          onSubmit={form.handleSubmit(handleRegisterAppointment)}
          className="mx-2 space-y-6 bg-white p-6 rounded-md shadow-sm"
        >

          <FieldGroup>

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-schedule-name">
                    Nome completo
                </FieldLabel>
                <Input
                    {...field}
                    id="form-schedule-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite seu nome completo"
                    autoComplete="off"
                />
                {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-schedule-email">
                    E-mail
                </FieldLabel>
                <Input
                    {...field}
                    id="form-schedule-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite seu e-mail"
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
                <FieldLabel htmlFor="form-schedule-phone">
                    Telefone
                </FieldLabel>
                <Input
                  {...field}
                  id="form-schedule-phone"
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
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-schedule-date">
                    Data do agendamento
                </FieldLabel>
                  <DateTimePicker
                    initialDate={new Date()}
                    className="w-full rounded border p-2"
                    onChange={(date) => {
                      if (date) {
                        field.onChange(date)
                        setSelectedTime("") // Limpa o horário selecionado ao mudar a data
                      }
                    }}
                  />
                {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                )}
                </Field>
              )}
            />

            <Controller
              name="serviceId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-schedule-serviceId">
                    Serviço
                </FieldLabel>
                <Select
                  name={field.name}
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedTime("") // Limpa o horário selecionado ao mudar o serviço
                  }}
                >
                  <SelectTrigger
                    id="form-profile-status"
                    aria-invalid={fieldState.invalid}
                    className="min-w-[120px]"
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {clinic.services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - {Math.floor(service.duration / 60)}h {service.duration % 60}min
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

          {selectedServiceId && (
            <div className="space-y-2">
              <Label className="font-semibold">Horários disponíveis:</Label>
              <div className="bg-gray-50 p-4 rounded-lg">
                {loadingSlots ? (
                  <p>Carregando horários...</p>
                ) : availableTimeSlots.length === 0 ? (
                  <p>Nenhum horário disponível</p>
                ) : (
                  <ScheduleTimeList 
                    onSelectTime={(time) => setSelectedTime(time)}
                    clinicTimes={clinic.times}
                    blockedTimes={blockedTimes}
                    availableTimeSlots={availableTimeSlots}
                    selectedTime={selectedTime}
                    selectedDate={selectedDate}
                    requiredSlots={
                      clinic.services.find(service => service.id === selectedServiceId) ? Math.ceil(clinic.services.find(service => 
                      service.id === selectedServiceId)!.duration / 30) : 1
                    }
                  />
                )}
              </div>
            </div>
          )}

          {clinic.status == "active" ? (
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400"
              disabled={!watch("name") || !watch("email") || !watch("phone") || !watch("date")}
            >
              Realizar agendamento
            </Button>
          ) : (
            <p className="bg-red-500 text-white text-center px-4 py-2 rounded-md">
              A clínica está fechada nesse momento.
            </p>
          )}

        </form>
      </section>

    </div>
  )
}