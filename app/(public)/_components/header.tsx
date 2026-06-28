"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogIn, Menu } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { handleRegister } from "../_actions/login";

const navItems = [{ href: "#profissionais", label: "Profissionais" }];

async function handleLogin() {
  await handleRegister("google");
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const { data: session, status } = useSession();

  return (
    <>
      {navItems.map((item) => (
        <Button asChild key={item.href} variant="ghost" onClick={onClick}>
          <Link href={item.href} className="text-base">
            {item.label}
          </Link>
        </Button>
      ))}

      {status === "loading" ? (
        <></>
      ) : session ? (
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 bg-zinc-900 text-white py-1 px-4 rounded-md"
        >
          Acessar da clínica
        </Link>
      ) : (
        <Button onClick={handleLogin}>
          <LogIn />
          Fazer login
        </Button>
      )}
    </>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-zinc-900">
          Odonto<span className="text-emerald-500">PRO</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="md:hidden">
            <Menu className="w-6 h-6" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[240px] sm:w-[300px] z-[9999]"
          >
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Veja nossos links</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col space-y-4">
              <NavLinks onClick={() => setIsOpen(false)} />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
