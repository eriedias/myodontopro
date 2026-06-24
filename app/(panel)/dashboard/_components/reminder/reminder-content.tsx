"use client"

import { Button } from "@/components/ui/button"
import { useReminderForm, ReminderFormdata } from "./reminder-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { createReminder } from "../_actions/create-reminder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


interface ReminderContentProps {
  closeDialog: () => void
}

export function ReminderContent({ closeDialog }: ReminderContentProps) {

  const form = useReminderForm()
  const router = useRouter()

  async function onSubmit(formData: ReminderFormdata) {

    const response = await createReminder({ description: formData.description })

    if (response.error) {
      toast.error(response.error)
      return;
    }

    toast.success(response.data)
    router.refresh();
    closeDialog();
  }

  return (
    <div className="grid gap-4 py-4">
      <form
        id="form-reminder"
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        
        <FieldGroup>
          
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-reminder-description">
                Descreva o lembrete:
              </FieldLabel>
              <Textarea
                {...field}
                id="form-reminder-description"
                aria-invalid={fieldState.invalid}
                placeholder="Digite o nome do lembrete..."
                className="max-h-52"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
              </Field>
            )}
          />

        </FieldGroup>

        <Button
          type="submit"
          disabled={!form.watch("description")}
        >
          Cadastrar lembrete
        </Button>
      </form>
    </div>
  )
}