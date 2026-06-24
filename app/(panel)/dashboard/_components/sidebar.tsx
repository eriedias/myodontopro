"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Banknote, CalendarCheck2, ChevronLeft, ChevronRight, Folder, Menu, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

export function SidebarDashboard({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen w-full">

            <aside className={clsx("flex flex-col border-r bg-background transition-all duration-300 p-4 h-full",
                isCollapsed ? "w-20" : "w-64",
                "hidden md:flex md:fixed"
            )}>
                {!isCollapsed && (
                    <div className="mb-6 mt-4">
                            <Image 
                                src={"/logo-odonto.png"} 
                                alt="Logo"
                                priority
                                quality={100}
                                width={300}
                                height={300}
                                style={{width: '100%', height: 'auto'}}
                            />
                    </div>
                )}
                <Button 
                    className="bg-gray-100 px-4 hover:bg-gray-50 text-zinc-900 self-end mb-2"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="h-12 w-12" /> : <ChevronLeft className="h-12 w-12" />}
                </Button>
                {isCollapsed && (
                    <nav className="flex flex-col gap-1 overflow-hidden mt-2">
                        <SidebarLink 
                            href="/dashboard" 
                            icon={<CalendarCheck2 className="w-6 h-6" />}
                            label="Agendamentos"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarLink 
                            href="/dashboard/services" 
                            icon={<Folder className="w-6 h-6" />}
                            label="Serviços"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarLink 
                            href="/dashboard/profile" 
                            icon={<Settings className="w-6 h-6" />}
                            label="Meu perfil"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarLink 
                            href="/dashboard/plans" 
                            icon={<Banknote className="w-6 h-6" />}
                            label="Planos"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                        />
                    </nav>
                )}
                <Collapsible open={!isCollapsed}>
                    <CollapsibleContent>
                        <nav className="flex flex-col gap-1 overflow-hidden">
                            <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                                Painel
                            </span>

                            <SidebarLink 
                                href="/dashboard" 
                                icon={<CalendarCheck2 className="w-6 h-6" />}
                                label="Agendamentos"
                                pathname={pathname}
                                isCollapsed={isCollapsed}
                            />
                            <SidebarLink 
                                href="/dashboard/services" 
                                icon={<Folder className="w-6 h-6" />}
                                label="Serviços"
                                pathname={pathname}
                                isCollapsed={isCollapsed}
                            />

                            <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                                Configurações
                            </span>
                            <SidebarLink 
                                href="/dashboard/profile" 
                                icon={<Settings className="w-6 h-6" />}
                                label="Meu perfil"
                                pathname={pathname}
                                isCollapsed={isCollapsed}
                            />
                            <SidebarLink 
                                href="/dashboard/plans" 
                                icon={<Banknote className="w-6 h-6" />}
                                label="Planos"
                                pathname={pathname}
                                isCollapsed={isCollapsed}
                            />
                        </nav>
                    </CollapsibleContent>
                </Collapsible>
            </aside>
            
            <div className={clsx("flex flex-1 flex-col transition-all duration-300", isCollapsed ? "md:ml-20" : "md:ml-64")}>

                <header className="sticky top-0 bg-white md:hidden flex items-center justify-between border-b px-4 md:px-6 h-14 z-10">
                    <Sheet>
                        <div className="flex items-center gap-4">
                            <SheetTrigger className="md:hidden" onClick={() => setIsCollapsed(false)}>
                                <Menu className="w-5 h-5" />
                            </SheetTrigger>
                            <h1>Menu OdontoPRO</h1>
                        </div>
                        <SheetContent side="right" className="sm:max-w-xs text-black p-6">
                            <SheetTitle>OdontoPRO</SheetTitle>
                            <SheetDescription>
                                Menu administrativo
                            </SheetDescription>

                            <nav className="grid gap-2 text-base pt-6">
                                <SidebarLink 
                                    href="/dashboard" 
                                    icon={<CalendarCheck2 className="w-6 h-6" />}
                                    label="Agendamentos"
                                    pathname={pathname}
                                    isCollapsed={isCollapsed}
                                />
                                <SidebarLink 
                                    href="/dashboard/services" 
                                    icon={<Folder className="w-6 h-6" />}
                                    label="Serviços"
                                    pathname={pathname}
                                    isCollapsed={isCollapsed}
                                />
                                <SidebarLink 
                                    href="/dashboard/profile" 
                                    icon={<Settings className="w-6 h-6" />}
                                    label="Meu perfil"
                                    pathname={pathname}
                                    isCollapsed={isCollapsed}
                                />
                                <SidebarLink 
                                    href="/dashboard/plans" 
                                    icon={<Banknote className="w-6 h-6" />}
                                    label="Planos"
                                    pathname={pathname}
                                    isCollapsed={isCollapsed}
                                />
                            </nav>
                        </SheetContent>
                    </Sheet>
                    
                </header>
            
                <main className="flex-1 py-4 px-2 md:p-6">
                    {children}
                </main>

            </div>

        </div>
    )
}


interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    pathname: string;
    isCollapsed: boolean;
}

function SidebarLink({ href, icon, label, pathname, isCollapsed }: SidebarLinkProps) {
    return(
        <Link href={href}>
            <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-md transition-colors", pathname === href ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100")}>
                <span className="w-6 h-6">{icon}</span>
                {!isCollapsed && <span>{label}</span>}
            </div>
        </Link>
    )
}