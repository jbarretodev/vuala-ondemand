import  { Metadata } from "next";

export const metadata: Metadata = {
  title : "Ingresar | Vualá",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Columna izquierda: texto */}
      
      <section className="hidden md:flex flex-col items-center justify-center bg-[var(--color-brand-500)] px-12 text-center text-white">
      {/* Contenido central */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold leading-tight">
            Bienvenido a <span className="text-white">Vualá</span>
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Centraliza todas <strong>tus entregas </strong>, con un equipo logístico  rápido y seguro.
          </p>
          <ul className="mt-6 space-y-2 text-white/80">
            <li>• Gestión en tiempo real</li>
            <li>• Roles y permisos</li>
            <li>• Pagos y conciliación</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-xs text-white/60">
        © {new Date().getFullYear()} Vuala Plataforma
      </footer>
    </section>
      {/* Columna derecha: contenido (form) */}
      <main className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}

