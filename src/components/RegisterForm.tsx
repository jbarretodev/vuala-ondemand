"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
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

    if (!form.name || !form.email || !form.password || !form.confirm) {
      alert("Completa todos los campos.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      alert("Correo inválido.");
      return;
    }
    if (form.password !== form.confirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    router.push("/dashboard");
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

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Crear cuenta
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta ? {" "}
        <Link href="/login" className="font-medium text-blue-500 hover:underline"> Iniciar Sesión</Link>
      </p>
    </form>
  );
}
