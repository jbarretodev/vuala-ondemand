"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Order = {
  id: string;
  date: string;          
  customer: string;
  pickup: string;
  dropoff: string;
  distance:number;
  total: number;         
  status: "pending" | "onroute" | "delivered" | "canceled";
};

const MOCK: Order[] = [
  { id: "ORD-23121", date: "2025-08-23 12:40", customer: "Pablo Sáenz", pickup: "C/ Padilla 200, BCN", dropoff: "C/ Lepant 150, BCN",distance:1.80, total: 12.9, status: "delivered" },
  { id: "ORD-23122", date: "2025-08-23 12:55", customer: "María López", pickup: "Pizzería Italia, BCN", dropoff: "C/ Marina 35, BCN",distance:2.80, total: 9.5, status: "onroute" },
  { id: "ORD-23123", date: "2025-08-23 13:05", customer: "Javier Pérez", pickup: "C/ Girona 12, BCN", dropoff: "Av. Diagonal 480, BCN",distance:1.80, total: 15.2, status: "pending" },
  { id: "ORD-23124", date: "2025-08-23 13:10", customer: "Lucía Fernández", pickup: "C/ Provença 310, BCN", dropoff: "C/ Roselló 90, BCN",distance:1.80, total: 0, status: "canceled" },
];

export default function OrdersPage() {
  const [q, setQ] = useState("");
  const data = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return MOCK;
    return MOCK.filter(o =>
      [o.id, o.customer, o.pickup, o.dropoff, o.status].some(v =>
        String(v).toLowerCase().includes(t)
      )
    );
  }, [q]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-xl font-semibold">Histórico de Pedidos</h2>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar (ID, cliente, dirección, estado)…"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4 sm:w-80"
          />
          <Link
            href="/dashboard/orders/new"
            className="whitespace-nowrap rounded-lg bg-[var(--color-brand-500)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Nuevo pedido
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="max-h-[60vh] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-neutral-50 text-neutral-600 font-heading ">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                <th className="w-[120px]">ID</th>
                <th className="w-[160px]">Fecha</th>
                <th>Cliente</th>
                <th className="min-w-[220px]">Recogida</th>
                <th className="min-w-[220px]">Entrega</th>
                <th className="w-[110px]">Estado</th>
                <th className="w-[110px]">Distancia</th>
                <th className="w-[110px] text-right">Importe</th>
                <th className="w-[110px] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50">
                  <td className="px-3 py-2 font-mono text-[13px] text-neutral-700">{o.id}</td>
                  <td className="px-3 py-2 text-neutral-700">{o.date}</td>
                  <td className="px-3 py-2">{o.customer}</td>
                  <td className="px-3 py-2 text-neutral-700">{o.pickup}</td>
                  <td className="px-3 py-2 text-neutral-700">{o.dropoff}</td>
                  <td className="px-3 py-2">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="px-3 py-2 font-semibold">
                    {` ${o.distance.toFixed(2)}kms`}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">
                    {o.status === "canceled" ? "—" : `€ ${o.total.toFixed(2)}`}
                  </td>

                  <td className="px-3 py-2 text-right">
                    <RowActions id={o.id} />
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-neutral-500">
                    No hay resultados para “{q}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


function StatusPill({ status }: { status: Order["status"] }) {
  const map: Record<Order["status"], { bg: string; text: string; label: string }> = {
    pending:   { bg: "bg-[var(--color-warning)]/15",   text: "text-[var(--color-warning)]",   label: "Pendiente" },
    onroute:   { bg: "bg-[var(--color-info)]/15",      text: "text-[var(--color-info)]",      label: "En ruta" },
    delivered: { bg: "bg-[var(--color-success)]/15",   text: "text-[var(--color-success)]",   label: "Entregado" },
    canceled:  { bg: "bg-[var(--color-danger)]/15",    text: "text-[var(--color-danger)]",    label: "Cancelado" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function RowActions({ id }: { id: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Link
        href={`/dashboard/orders/${id}`}
        className="rounded-md border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-50"
      >
        Ver
      </Link>
      <button
        className="rounded-md border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-50"
        onClick={() => alert(`Reintentar entrega de ${id} (mock)`)}
      >
        Reintentar
      </button>
      <button
        className="rounded-md border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-50"
        onClick={() => alert(`Cancelar ${id} (mock)`)}
      >
        Cancelar
      </button>
    </div>
  );
}