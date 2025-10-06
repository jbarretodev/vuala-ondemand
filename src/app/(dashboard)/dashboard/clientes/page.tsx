"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

type Customer = {
  id: number;
  name: string;
  lastname: string;
  address: string | null;
  dni: string;
  dob: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  orders: Array<{
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
  }>;
  _count?: {
    orders: number;
  };
};

type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function ClientesPage() {
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchCustomers = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/customers?${params}`);
      const data = await response.json();

      if (search) {
        // Search returns customers array directly
        setCustomers(data.customers || []);
        setPagination({
          page: 1,
          limit: 10,
          total: data.customers?.length || 0,
          totalPages: 1,
        });
      } else {
        setCustomers(data.customers || []);
        setPagination(data.pagination || pagination);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchCustomers(1, value);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handlePageChange = (newPage: number) => {
    fetchCustomers(newPage, searchQuery);
  };

  const handleDelete = async (id: number, customerName: string) => {
    // Confirmación con toast
    const confirmed = window.confirm(`¿Estás seguro de eliminar al cliente ${customerName}?`);
    
    if (!confirmed) {
      return;
    }

    const loadingToast = toast.loading("Eliminando cliente...");

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Cliente eliminado exitosamente", {
          id: loadingToast,
        });
        fetchCustomers(pagination.page, searchQuery);
      } else {
        toast.error(data.error || "Error al eliminar cliente", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error al eliminar cliente", {
        id: loadingToast,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      in_transit: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Clientes</h1>
          <p className="text-sm text-neutral-600">
            Gestiona tus clientes y sus pedidos
          </p>
        </div>
        <Link
          href="/dashboard/clientes/nuevo"
          className="rounded-xl bg-[var(--color-brand-500)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-600)] transition"
        >
          + Nuevo Cliente
        </Link>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m1.85-4.65a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 py-2 pl-10 pr-4 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-brand-500)]"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-neutral-600">No se encontraron clientes</p>
            <Link
              href="/dashboard/clientes/nuevo"
              className="mt-4 inline-block text-sm text-[var(--color-brand-500)] hover:underline"
            >
              Crear primer cliente
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Órdenes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-neutral-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-neutral-900">
                            {customer.name} {customer.lastname}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {customer.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {customer.dni}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs truncate">
                        {customer.address || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {customer.orders?.length || customer._count?.orders || 0} órdenes
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/clientes/${customer.id}`}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[var(--color-brand-500)] hover:bg-[var(--color-brand-50)] transition"
                            title="Ver detalles"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Ver</span>
                          </Link>
                          <Link
                            href={`/dashboard/clientes/${customer.id}/editar`}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-blue-600 hover:bg-blue-50 transition"
                            title="Editar cliente"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Editar</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(customer.id, `${customer.name} ${customer.lastname}`)}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50 transition"
                            title="Eliminar cliente"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!searchQuery && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-6 py-4">
                <div className="text-sm text-neutral-600">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
                  {pagination.total} clientes
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="rounded-lg border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="rounded-lg border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
