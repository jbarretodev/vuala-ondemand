"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CourierCombobox from "@/components/CourierCombobox";

type Order = {
  id: number;
  customerId: number;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  distanceKm: number;
  estimatedPrice: number;
  createdAt: string;
  customer: {
    id: number;
    name: string;
    lastname: string;
  };
  rider: null | {
    id: number;
    phone: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
};

type Rider = {
  id: number;
  phone: string;
  status: string;
  isActive: boolean;
  rating: number | null;
  completedOrders: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  };
  vehicle: {
    id: number;
    type: string;
    brand: string | null;
    model: string | null;
    licensePlate: string;
  } | null;
  lastLocation: {
    lat: number;
    lng: number;
    timestamp: string;
  } | null;
};

export default function AssignOrdersPage() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, ridersRes] = await Promise.all([
        fetch("/api/orders?all=true"),
        fetch("/api/riders/available"),
      ]);

      if (ordersRes.ok && ridersRes.ok) {
        const ordersData = await ordersRes.json();
        const ridersData = await ridersRes.json();
        
        const allOrders = ordersData.orders || [];
        
        // Separar órdenes pendientes (sin rider) y asignadas (con rider)
        const pending = allOrders.filter((order: Order) => !order.rider && order.status === "pending");
        const assigned = allOrders.filter((order: Order) => order.rider && order.status === "pending");
        
        setPendingOrders(pending);
        setAssignedOrders(assigned);
        setRiders(ridersData.riders || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (orderId: number, riderId: number) => {
    setAssigning(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riderId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Orden asignada correctamente");
        // Recargar datos
        await fetchData();
      } else {
        toast.error(data.error || "Error al asignar orden");
      }
    } catch (error) {
      console.error("Error assigning order:", error);
      toast.error("Error al asignar orden");
    } finally {
      setAssigning(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-500)] mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando órdenes y couriers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold">
            Asignación Manual de Órdenes
          </h2>
          <p className="text-neutral-600 text-sm mt-1">
            Asigna órdenes pendientes a couriers disponibles
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50"
        >
          <RefreshIcon />
          Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="text-sm text-neutral-600">Órdenes Pendientes</div>
          <div className="text-3xl font-bold text-[var(--color-warning)] mt-1">
            {pendingOrders.length}
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="text-sm text-neutral-600">Órdenes Asignadas</div>
          <div className="text-3xl font-bold text-[var(--color-info)] mt-1">
            {assignedOrders.length}
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="text-sm text-neutral-600">Couriers Disponibles</div>
          <div className="text-3xl font-bold text-[var(--color-success)] mt-1">
            {riders.length}
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="text-sm text-neutral-600">Ratio</div>
          <div className="text-3xl font-bold text-[var(--color-info)] mt-1">
            {riders.length > 0
              ? (pendingOrders.length / riders.length).toFixed(1)
              : "—"}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="font-semibold">Órdenes Pendientes de Asignación</h3>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-neutral-500">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-lg font-medium">No hay órdenes pendientes</p>
            <p className="text-sm mt-1">
              Todas las órdenes han sido asignadas
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600 font-heading">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-medium">
                  <th className="w-[100px]">ID</th>
                  <th>Cliente</th>
                  <th className="min-w-[200px]">Recogida</th>
                  <th className="min-w-[200px]">Entrega</th>
                  <th className="w-[100px]">Distancia</th>
                  <th className="w-[100px]">Precio</th>
                  <th className="w-[400px]">Asignar Courier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pendingOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-mono text-xs text-neutral-700">
                      #{order.id}
                    </td>
                    <td className="px-4 py-3">
                      {order.customer.name} {order.customer.lastname}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {order.pickupAddress}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {order.deliveryAddress}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {Number(order.distanceKm).toFixed(2)} km
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      €{Number(order.estimatedPrice).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-[400px]">
                        <RiderSelector
                          riders={riders}
                          onAssign={(riderId) => handleAssign(order.id, riderId)}
                          disabled={assigning === order.id}
                          loading={assigning === order.id}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assigned Orders Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Órdenes Asignadas</h3>
            <span className="text-sm text-neutral-600">
              {assignedOrders.length} orden{assignedOrders.length !== 1 ? "es" : ""}
            </span>
          </div>
        </div>

        {assignedOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-neutral-500">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg font-medium">No hay órdenes asignadas</p>
            <p className="text-sm mt-1">
              Asigna couriers a las órdenes pendientes
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600 font-heading">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-medium">
                  <th className="w-[100px]">ID</th>
                  <th>Cliente</th>
                  <th className="min-w-[180px]">Recogida</th>
                  <th className="min-w-[180px]">Entrega</th>
                  <th className="min-w-[180px]">Courier Asignado</th>
                  <th className="w-[100px]">Distancia</th>
                  <th className="w-[100px]">Precio</th>
                  <th className="w-[120px]">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {assignedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-mono text-xs text-neutral-700">
                      #{order.id}
                    </td>
                    <td className="px-4 py-3">
                      {order.customer.name} {order.customer.lastname}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 text-xs">
                      {order.pickupAddress}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 text-xs">
                      {order.deliveryAddress}
                    </td>
                    <td className="px-4 py-3">
                      {order.rider && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-brand-500)] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {order.rider.user.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">
                              {order.rider.user.name}
                            </div>
                            <div className="text-xs text-neutral-600 truncate">
                              {order.rider.phone}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {Number(order.distanceKm).toFixed(2)} km
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      €{Number(order.estimatedPrice).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-[var(--color-info)]/15 text-[var(--color-info)]">
                        Asignada
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Available Riders */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="font-semibold">Couriers Disponibles</h3>
        </div>

        {riders.length === 0 ? (
          <div className="px-6 py-12 text-center text-neutral-500">
            <div className="text-6xl mb-4">🚫</div>
            <p className="text-lg font-medium">No hay couriers disponibles</p>
            <p className="text-sm mt-1">
              Todos los couriers están ocupados o inactivos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {riders.map((rider) => (
              <RiderCard key={rider.id} rider={rider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RiderSelector({
  riders,
  onAssign,
  disabled,
  loading,
}: {
  riders: Rider[];
  onAssign: (riderId: number) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [selectedRider, setSelectedRider] = useState<number | null>(null);

  const handleAssign = () => {
    if (selectedRider) {
      onAssign(selectedRider);
      setSelectedRider(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <CourierCombobox
          riders={riders}
          selectedRiderId={selectedRider}
          onSelect={setSelectedRider}
          disabled={disabled || riders.length === 0}
          placeholder="Seleccionar courier..."
        />
      </div>
      <button
        onClick={handleAssign}
        disabled={!selectedRider || disabled || loading}
        className="px-4 py-2 rounded-lg bg-[var(--color-brand-500)] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? "Asignando..." : "Asignar"}
      </button>
    </div>
  );
}

function RiderCard({ rider }: { rider: Rider }) {
  return (
    <div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-[var(--color-brand-500)] text-white flex items-center justify-center font-bold text-lg">
          {rider.user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{rider.user.name}</h4>
          <p className="text-xs text-neutral-600 truncate">{rider.phone}</p>
          {rider.vehicle && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded">
                {rider.vehicle.type}
              </span>
              {rider.vehicle.licensePlate && (
                <span className="text-xs text-neutral-600">
                  {rider.vehicle.licensePlate}
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-neutral-600">⭐</span>
              <span className="font-semibold">
                {rider.rating ? Number(rider.rating).toFixed(1) : "N/A"}
              </span>
            </div>
            <div className="text-neutral-600">
              {rider.completedOrders} entregas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}
