"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Completa todos los campos.");
      setLoading(false);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Correo inválido.");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al crear la cuenta.");
        return;
      }

      // Redirect to login page after successful registration
      router.push("/login?message=Cuenta creada exitosamente. Inicia sesión con tus credenciales.");
    } catch (error) {
      setError("Error de conexión. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Nombre completo
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--primary)]/20 focus:ring-4"
          placeholder="Tu nombre"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--primary)]/20 focus:ring-4"
          placeholder="tucorreo@ejemplo.com"
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--primary)]/20 focus:ring-4"
          placeholder="********"
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm" className="block text-sm font-medium">
          Repetir contraseña
        </label>
        <input
          id="confirm"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--primary)]/20 focus:ring-4"
          placeholder="********"
          autoComplete="new-password"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta ? {" "}
        <Link href="/login" className="font-medium text-blue-500 hover:underline"> Iniciar Sesión</Link>
      </p>
    </form>
  );
}
