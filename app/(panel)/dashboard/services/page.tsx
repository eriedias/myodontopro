import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ServicesContent } from "./_components/services-content";
import { Suspense } from "react";

export default async function Services() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    // ! serve para dizer que o id é uma string
    <Suspense fallback={<div>Carregando...</div>}>
      <ServicesContent userId={session.user.id!} />
    </Suspense>
  );
}
