"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
    customerId: number;
    status: string;
    pickupAddress: string | null;
    deliveryAddress: string | null;
    totalAmount: number | null;
    distanceKm: number | null;
    estimatedTime: string | null;
    createdAt: string;
  }>;
};

type Stats = {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  lastOrderDate: string | null;
};

export default function ClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchCustomer();
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customers/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setCustomer(data.customer);
      } else {
        alert(data.error || "Error al cargar cliente");
        router.push("/dashboard/clientes");
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/customers/${params.id}/stats`);
      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      in_transit: { label: "En tránsito", color: "bg-blue-100 text-blue-800" },
      delivered: { label: "Entregado", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-800" };

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-brand-500)]"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Cliente no encontrado</p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="font-heading text-2xl font-semibold">
              {customer.name} {customer.lastname}
            </h1>
            <p className="text-sm text-neutral-600">DNI: {customer.dni}</p>
          </div>
        </div>
        <Link
          href={`/dashboard/clientes/${customer.id}/editar`}
          className="rounded-xl bg-[var(--color-brand-500)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-600)] transition"
        >
          Editar Cliente
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-sm text-neutral-600 mb-1">Total Órdenes</div>
            <div className="text-2xl font-bold text-neutral-900">{stats.totalOrders}</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-sm text-neutral-600 mb-1">Gasto Total</div>
            <div className="text-2xl font-bold text-neutral-900">
              {formatCurrency(stats.totalSpent)}
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-sm text-neutral-600 mb-1">Promedio por Orden</div>
            <div className="text-2xl font-bold text-neutral-900">
              {formatCurrency(stats.averageOrderValue)}
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-sm text-neutral-600 mb-1">Última Orden</div>
            <div className="text-sm font-medium text-neutral-900">
              {stats.lastOrderDate ? formatDate(stats.lastOrderDate) : "—"}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold mb-4">
              Información del Cliente
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-neutral-600">Nombre Completo</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {customer.name} {customer.lastname}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-600">DNI</dt>
                <dd className="text-sm font-medium text-neutral-900">{customer.dni}</dd>
              </div>
              {customer.dob && (
                <div>
                  <dt className="text-sm text-neutral-600">Fecha de Nacimiento</dt>
                  <dd className="text-sm font-medium text-neutral-900">
                    {formatDate(customer.dob)}
                  </dd>
                </div>
              )}
              {customer.address && (
                <div>
                  <dt className="text-sm text-neutral-600">Dirección</dt>
                  <dd className="text-sm font-medium text-neutral-900">{customer.address}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-neutral-600">Usuario Asociado</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {customer.user.name}
                  <br />
                  <span className="text-xs text-neutral-500">{customer.user.email}</span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-600">Fecha de Registro</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {formatDate(customer.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="font-heading text-lg font-semibold">
                Órdenes ({customer.orders.length})
              </h2>
            </div>

            {customer.orders.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-neutral-600">No hay órdenes registradas</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {customer.orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-neutral-50 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-neutral-900">
                            Orden #{order.id}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-neutral-900">
                          {order.totalAmount ? formatCurrency(Number(order.totalAmount)) : "—"}
                        </div>
                        {order.distanceKm && (
                          <div className="text-xs text-neutral-500">
                            {order.distanceKm} km • {order.estimatedTime}
                          </div>
                        )}
                      </div>
                    </div>

                    {order.pickupAddress && (
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2">
                          <span className="text-neutral-600">📍 Recogida:</span>
                          <span className="text-neutral-900">{order.pickupAddress}</span>
                        </div>
                        {order.deliveryAddress && (
                          <div className="flex gap-2">
                            <span className="text-neutral-600">🏠 Entrega:</span>
                            <span className="text-neutral-900">{order.deliveryAddress}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-3">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-sm text-[var(--color-brand-500)] hover:underline"
                      >
                        Ver detalles →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
