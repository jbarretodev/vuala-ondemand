import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta | Vuala",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Izquierda: igual que login pero con copy de registro */}
      <section className="hidden md:flex flex-col justify-between bg-blue-500 px-10 py-8 text-white">
        {/* Logo + mensaje */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="mb-6">
            <Image
              src="/logo.png"   // <-- cambia por tu ruta real
              alt="Vuala"
              width={48}
              height={48}
              className="mx-auto h-12 w-12 object-contain"
              priority
            />
          </div>

          <div className="max-w-lg">
            <h1 className="text-4xl font-bold leading-tight">¡Bienvenido a Vuala!</h1>
            <p className="mt-4 text-lg text-white/80">
              Crea tu cuenta y empieza a gestionar <strong>todas tus recogidas y entrgas</strong>,
              en un panel rápido y seguro.
            </p>
            <ul className="mt-6 space-y-2 text-white/80">
              <li>• Regístrate llenando 4 campos</li>
              <li>• Acceso seguro y roles</li>
              <li>• Planes flexibles</li>
            </ul>
          </div>
        </div>

        <footer className="text-xs text-white/70">
          © {new Date().getFullYear()} Vuala Plataforma
        </footer>
      </section>

      {/* Derecha: formulario */}
      <main className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
