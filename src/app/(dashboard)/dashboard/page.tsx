import Link from "next/link";

export default function DashboardHome() {
  return (
    <>
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="text-lg text-neutral-600 font-medium">Pedidos de hoy</p>
        <p className="mt-1 font-heading text-2xl font-semibold">128</p>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="text-lg text-neutral-600 font-medium">Ingresos</p>
        <p className="mt-1 font-heading text-2xl font-semibold">€ 2.340</p>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="text-lg text-neutral-600 font-medium">Repartidores activos</p>
        <p className="mt-1 font-heading text-2xl font-semibold">54</p>
      </div>
    </section>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-3">
          <h2 className="font-heading text-2xl font-semibold">Pedidos en Curso</h2>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <input
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
    </>
  );
}