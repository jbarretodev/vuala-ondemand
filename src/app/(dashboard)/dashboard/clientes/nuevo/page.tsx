"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NuevoClientePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    dni: "",
    address: "",
    dob: "",
    // User fields
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: "2", // Default to customer role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const loadingToast = toast.loading("Creando cliente y usuario...");

    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...dataToSend } = formData;

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Cliente y usuario creados exitosamente", {
          id: loadingToast,
        });
        router.push("/dashboard/clientes");
      } else {
        toast.error(data.error || "Error al crear cliente", {
          id: loadingToast,
        });
        setError(data.error || "Error al crear cliente");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Error al crear cliente", {
        id: loadingToast,
      });
      setError("Error al crear cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/clientes"
          className="rounded-lg p-2 hover:bg-neutral-100 transition"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-semibold">Nuevo Cliente</h1>
          <p className="text-sm text-neutral-600">
            Completa la información del cliente
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
                  placeholder="Juan"
                />
              </div>

              {/* Apellido */}
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-neutral-700 mb-2">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
                  placeholder="Pérez García"
                />
              </div>

              {/* DNI */}
              <div>
                <label htmlFor="dni" className="block text-sm font-medium text-neutral-700 mb-2">
                  DNI / Documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  minLength={5}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
                  placeholder="12345678A"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Mínimo 5 caracteres
                </p>
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-neutral-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
                />
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-2">
                Dirección
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
                placeholder="Calle Mayor 123, Madrid, 28001"
              />
            </div>
          </div>

          {/* Información de Usuario */}
          <div className="space-y-4 pt-6 border-t border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Información de Usuario</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre de Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
                  placeholder="juanperez"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
                  placeholder="juan@example.com"
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="roleId" className="block text-sm font-medium text-neutral-700 mb-2">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  id="roleId"
                  name="roleId"
                  value={formData.roleId}
                  onChange={(e) => handleChange(e as any)}
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
                >
                  <option value="1">Admin</option>
                  <option value="2">Customer</option>
                  <option value="3">Rider</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Mínimo 6 caracteres
                </p>
              </div>

              {/* Confirm Password */}
              <div className="md:col-span-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <Link
              href="/dashboard/clientes"
              className="rounded-xl border border-neutral-300 px-6 py-2 text-sm font-medium hover:bg-neutral-50 transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--color-brand-500)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-600)] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Creando..." : "Crear Cliente"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
