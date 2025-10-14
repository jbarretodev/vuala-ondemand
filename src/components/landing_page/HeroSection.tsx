import { Button } from "flowbite-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="alto relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 py-20 px-4">
      {/* Brillos suaves */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center text-center">
          <h1 className="mt-12 text-4xl lg:text-5xl font-bold text-white leading-tight">
            Realizamos recogidas <br />y entregas en tiempo récord!!!
          </h1>
          <p className="mt-5 mb-5 text-base sm:text-lg lg:text-2xl text-white/90">
            Integra tu negocio con nuestra plataforma y llega a más clientes con entregas rápidas y confiables.
          </p>
          <Button
            size="lg"
            className="bg-yellow-200 text-black font-bold py-4 px-8 rounded-full hover:bg-yellow-300 transition"
          >
            Comenzar ahora
          </Button>
        </div>
      </div>

      {/* Onda inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}
