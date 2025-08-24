"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log(result)

      if (result?.error) {
        setError("Credenciales inválidas. Por favor, verifica tu email y contraseña.");
      } else {
        // Redirect to dashboard after successful login
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Ocurrió un error. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Error al iniciar sesión con Google.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
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
          name="password"
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

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

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
      <button 
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
      >
        Continuar con Google
      </button> 
    </form>
  );
}