"use client";

import { useState } from "react";
import { MoreVertical, Package, User, Bike, MapPin } from "lucide-react";

type OrderStatus =
  | "pendiente"
  | "asignado"
  | "recogiendo"
  | "en_ruta"
  | "entregado"
  | "fallido"
  | "cancelado";

export type OrderRow = {
  tracking: string;     // Número de seguimiento
  id: string;           // ID interno
  cliente: string;
  driver: string;
  direccion: string;    // dirección de entrega
  distanciaKm: number;  // distancia en km
  estado: OrderStatus;
  progreso: number;     // 0..100
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  asignado: "Asignado",
  recogiendo: "Recogiendo",
  en_ruta: "En ruta",
  entregado: "Entregado",
  fallido: "Fallido",
  cancelado: "Cancelado",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pendiente: "bg-neutral-100 text-neutral-700",
  asignado: "bg-sky-100 text-sky-700",
  recogiendo: "bg-violet-100 text-violet-700",
  en_ruta: "bg-indigo-100 text-indigo-700",
  entregado: "bg-emerald-100 text-emerald-700",
  fallido: "bg-rose-100 text-rose-700",
  cancelado: "bg-zinc-100 text-zinc-700",
};

const EXAMPLE_DATA: OrderRow[] = [
  {
    tracking: "TRK-932184",
    id: "ORD-653CD1",
    cliente: "Marta Romero",
    driver: "Luis A.",
    direccion: "C/ Mayor 14, 3B, Sevilla",
    distanciaKm: 12.4,
    estado: "en_ruta",
    progreso: 88,
  },
  {
    tracking: "TRK-932221",
    id: "ORD-243685",
    cliente: "Rest. La Terraza",
    driver: "Anita P.",
    direccion: "Plaza del Sol 2, Madrid",
    distanciaKm: 5.1,
    estado: "asignado",
    progreso: 32,
  },
  {
    tracking: "TRK-932300",
    id: "ORD-348975",
    cliente: "Carlos Pérez",
    driver: "Diego T.",
    direccion: "Av. Libertad 120, Valencia",
    distanciaKm: 23.8,
    estado: "recogiendo",
    progreso: 45,
  },
  {
    tracking: "TRK-932341",
    id: "ORD-934788",
    cliente: "Farmacia Centro",
    driver: "Marcos R.",
    direccion: "C/ Luna 5, Málaga",
    distanciaKm: 18.7,
    estado: "en_ruta",
    progreso: 67,
  },
  {
    tracking: "TRK-932389",
    id: "ORD-345789",
    cliente: "Ana Carrasco",
    driver: "Sofía C.",
    direccion: "C/ Jardín 9, Granada",
    distanciaKm: 2.9,
    estado: "pendiente",
    progreso: 8,
  },
];

function Km({ v }: { v: number }) {
  return <span>{v.toFixed(1)} km</span>;
}

export default function OnRouteOrderCard({ rows = EXAMPLE_DATA }: { rows?: OrderRow[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAll = () => {
    setSelected((sel) => (sel.length === rows.length ? [] : rows.map((r) => r.id)));
  };
  const toggleOne = (id: string) => {
    setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));
  };

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm mt-10">
      {/* Header */}


      <div className="h-px w-full bg-neutral-200" />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] table-fixed">
          <colgroup>
            <col className="w-12" />
            <col className="w-[16%]" />
            <col className="w-[12%]" />
            <col className="w-[16%]" />
            <col className="w-[26%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
            <col className="w-[16%]" />
          </colgroup>

          <thead>
            <tr className="text-left text-[13px] uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-[var(--color-brand-600)] focus:ring-[var(--color-brand-500)]"
                  checked={selected.length === rows.length}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3">Nº Seguimiento</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Dirección de entrega</th>
              <th className="px-4 py-3">Distancia</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Progreso</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-neutral-100 text-sm">
                {/* checkbox */}
                <td className="px-4 py-3 align-middle">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300 text-[var(--color-brand-600)] focus:ring-[var(--color-brand-500)]"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleOne(row.id)}
                  />
                </td>

                {/* tracking */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-neutral-100">
                      <Package className="h-4 w-4 text-neutral-500" />
                    </div>
                    <span className="font-medium text-neutral-800">{row.tracking}</span>
                  </div>
                </td>

                {/* id */}
                <td className="px-4 py-3 text-neutral-700">{row.id}</td>

                {/* cliente */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-800">{row.cliente}</span>
                  </div>
                </td>

                {/* driver */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Bike className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-800">{row.driver}</span>
                  </div>
                </td>

                {/* direccion */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    <span className="line-clamp-1 text-neutral-700">{row.direccion}</span>
                  </div>
                </td>

                {/* distancia */}
                <td className="px-4 py-3 text-neutral-700">
                  <Km v={row.distanciaKm} />
                </td>

                {/* estado */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[row.estado]}`}
                  >
                    {STATUS_LABEL[row.estado]}
                  </span>
                </td>

                {/* progreso */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-40 rounded-full bg-indigo-100">
                      <div
                        className="h-2 rounded-full bg-indigo-500"
                        style={{ width: `${row.progreso}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {row.progreso}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
