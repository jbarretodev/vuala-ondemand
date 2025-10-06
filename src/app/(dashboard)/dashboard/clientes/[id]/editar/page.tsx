"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

type Customer = {
  id: number;
  name: string;
  lastname: string;
  address: string | null;
  dni: string;
  dob: string | null;
};

export default function EditarClientePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    address: "",
    dob: "",
  });

  useEffect(() => {
    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customers/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        const customer = data.customer;
        setFormData({
          name: customer.name,
          lastname: customer.lastname,
          address: customer.address || "",
          dob: customer.dob ? customer.dob.split("T")[0] : "",
        });
      } else {
        toast.error(data.error || "Error al cargar cliente");
        router.push("/dashboard/clientes");
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);
    setError("");

    const loadingToast = toast.loading("Actualizando cliente...");

    try {
      const response = await fetch(`/api/customers/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Cliente actualizado exitosamente", {
          id: loadingToast,
        });
        router.push(`/dashboard/clientes/${params.id}`);
      } else {
        toast.error(data.error || "Error al actualizar cliente", {
          id: loadingToast,
        });
        setError(data.error || "Error al actualizar cliente");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Error al actualizar cliente", {
        id: loadingToast,
      });
      setError("Error al actualizar cliente");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-brand-500)]"></div>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/clientes/${params.id}`}
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
          <h1 className="font-heading text-2xl font-semibold">Editar Cliente</h1>
          <p className="text-sm text-neutral-600">
            Actualiza la información del cliente
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

          <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> El DNI y los datos de usuario (username, email, contraseña, rol) no pueden ser modificados desde aquí por razones de seguridad.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <Link
              href={`/dashboard/clientes/${params.id}`}
              className="rounded-xl border border-neutral-300 px-6 py-2 text-sm font-medium hover:bg-neutral-50 transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[var(--color-brand-500)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-600)] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
