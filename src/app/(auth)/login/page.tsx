//importar component

import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Accede con tu correo y contraseña.
        </p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <LoginForm />
      </Suspense>

      <div className="mt-6 text-center text-sm">
        ¿No tienes cuenta?{" "}
        <a
          href="/register"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Regístrate
        </a>
      </div>
    </div>
  );
}
