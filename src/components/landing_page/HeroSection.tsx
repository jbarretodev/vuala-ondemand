import { Button } from "flowbite-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-[var(--color-brand-500)] py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Realizamos recogidas y entregas en tiempo récord!!!
            </h1>
            <p className="text-lg text-white max-w-md">
              Integra tu negocio con nuestra plataforma y llega a más clientes con entregas rápidas y confiables.
            </p>
            <Button 
              size="lg" 
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg"
            >
              Comenzar ahora
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-lg p-4 transform rotate-3">
              <Image
                src="/api/placeholder/400/300"
                alt="Delivery person with Glovo"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative wave */}
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
