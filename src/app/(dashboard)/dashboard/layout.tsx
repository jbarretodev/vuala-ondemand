/* Este layout se va a repetir en todad las vistas de dashboard */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label:"Inicio" , href: "/dashboard" },
  { label:"Clientes" , href: "/dashboard/clientes" },
  { label:"Pedidos" , href: "/dashboard/orders" },
  { label:"Facturación" , href: "/dashboard/" },
  { label:"Ajustes" , href: "/dashboard/settings" },
  { label:"Perfil " , href: "/dashboard/profile" },
  { label:"Salir" , href: "" },
];
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="h-dvh w-full bg-neutral-50 text-neutral-900">
      <div className="flex h-full">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-72 bg-white border-r border-neutral-200">
          <div className="flex h-full flex-col p-4">
            <Link href="/" className="font-heading text-xl font-semibold text-[var(--color-brand-700)]">Vualá</Link>
            <nav className="mt-6 space-y-1">
              {NAV.map(item => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 ${active ? "bg-neutral-100 font-medium" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pt-4">
              <button className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50">
                Soporte
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay + sidebar (mobile) */}
        <div onClick={() => setOpen(false)} className={`fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral-200 transition-transform md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-[var(--color-brand-700)]">Vualá</span>
              <button className="p-2 rounded hover:bg-neutral-100" onClick={() => setOpen(false)}>✕</button>
            </div>
            <nav className="mt-6 space-y-1">
              {NAV.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Columna principal */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Navbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white border-b border-neutral-200 px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button className="rounded p-2 hover:bg-neutral-100 md:hidden" aria-label="Abrir menú" onClick={() => setOpen(true)}>
                <svg width="24" height="24" stroke="currentColor" fill="none"><path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>
              </button>
              <h1 className="font-heading text-lg font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <input placeholder="Buscar…" className="hidden md:block rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"/>
              <div className="h-8 w-8 rounded-full bg-neutral-200" />
            </div>
          </header>

          {/* Main heredado para /dashboard/* con fondo gris */}
          <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}