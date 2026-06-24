import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
    return (
        <section className="bg-white">
            <div className="container mx-auto pt-20 pb-4 sm:pb-0 px-4 sm:px-6 lg:px-8">
                
                <main className="flex items-center justify-center">

                    <article className="flex[2] space-y-8 max-w-3xl flex flex-col justify-center">

                        <h1 className="text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight">Encontre os melhores profissionais em um único local!</h1>
                        <p className="text-base md:text-lg text-gray-600">Nós somos uma plataforma para profissionais de saúde com foco em agilizar seu atendimento de forma simplificada e organizada.</p>
                        <Button className="bg-emerald-500 hover:bg-emerald-400 w-fit px-6 font-semibold">
                            Encontre uma clínica
                        </Button>
                    
                    </article>

                    <div className="hidden lg:block">
                        <Image src={"/doctor-hero.png"} 
                            className="object-contain" width={340} height={400} 
                            alt="Foto ilustrativa"
                            quality={100}
                            priority
                        />
                    </div>

                </main>

            </div>
        </section>
    )
}