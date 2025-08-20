"use client";

import { useState } from "react";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Aquí conectas tu lógica real (NextAuth, API, etc.)
    // await signIn("credentials", { redirect: true, callbackUrl: "/" });
    setTimeout(() => setLoading(false), 800);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--primary)]/20 focus:ring-4 dark:border-gray-700 dark:bg-gray-900"
          placeholder="tucorreo@ejemplo.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--primary)]/20 focus:ring-4 dark:border-gray-700 dark:bg-gray-900"
          placeholder="********"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-700" />
          Recuérdame
        </label>
        <a
          href="/forgot-password"
          className="text-sm text-[var(--primary)] hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl  bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>

      {/* Opcional: separador social */}
       <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs text-gray-500">o</span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
      <button className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm dark:border-gray-700">
        Continuar con Google
      </button> 
    </form>
  );
}