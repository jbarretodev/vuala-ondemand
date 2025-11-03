/* Este layout se va a repetir en todas las vistas de dashboard */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Map,
  Users,
  ShoppingBag,
  Route,
  Bike,
  Receipt,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
} from "lucide-react";

const NAV = [
  { label: "Inicio",            href: "/dashboard" },
  { label: " Mapa ",            href: "/dashboard/map" },
  { label: "Clientes",          href: "/dashboard/clientes" },
  { label: "Pedidos",           href: "/dashboard/orders" },
  { label: "Asignar Órdenes",   href: "/dashboard/orders/assign" },
  { label: "Couriers",          href: "/dashboard/riders" },
  { label: "Facturación",       href: "/dashboard/" },
  { label: "Ajustes",           href: "/dashboard/settings" },
  { label: "Perfil ",           href: "/dashboard/profile" },
  { label: "Salir",             href: "" },
];

// href -> icon
const ICONS: Record<string, LucideIcon> = {
  "/dashboard": Home,
  "/dashboard/map": Map,
  "/dashboard/clientes": Users,
  "/dashboard/orders": ShoppingBag,
  "/dashboard/orders/assign": Route,
  "/dashboard/riders": Bike,
  "/dashboard/": Receipt,
  "/dashboard/settings": Settings,
  "/dashboard/profile": User,
  "": LogOut,
};

function NavIcon({ href }: { href: string }) {
  const I = ICONS[href];
  return I ? (
    <I className="h-5 w-5" aria-hidden />
  ) : (
    <span className="inline-block h-4 w-4 rounded bg-neutral-300" aria-hidden />
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);        // drawer móvil
  const [collapsed, setCollapsed] = useState(false); // colapso desktop
  const pathname = usePathname();
  const router = useRouter();

  // persistir colapso
  useEffect(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("sidebar:collapsed") : null;
    if (v) setCollapsed(v === "1");
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar:collapsed", collapsed ? "1" : "0");
    }
  }, [collapsed]);

  // Salir (ajusta a tu auth)
  async function handleLogout() {
    try {
      router.push("/api/logout"); // o router.push("/")
    } catch {
      router.push("/");
    }
  }

  return (
    <div className="h-dvh w-full bg-neutral-50 text-neutral-900">
      <div className="flex h-full">
        {/* Sidebar (desktop) */}
        <aside
          className={`hidden md:block bg-white border-r border-neutral-200 transition-[width] duration-300 ${
            collapsed ? "w-20" : "w-72"
          }`}
        >
          <div className="flex h-full flex-col p-4">
            {/* Cabecera marca + toggle SIEMPRE visible */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="font-heading font-semibold text-[var(--color-brand-700)] text-xl"
                title="Vualá"
              >
                <span className={`${collapsed ? "sr-only" : ""}`}>Vualá</span>
              </Link>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white text-neutral-600 hover:bg-neutral-50"
                aria-label={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
                title={collapsed ? "Expandir" : "Contraer"}
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            </div>

            {/* Nav (desktop) */}
            <nav className="mt-6 space-y-1 pr-1">
              {NAV.map((item) => {
                const active =
                  item.href && (pathname === item.href || pathname.startsWith(item.href + "/"));
                const isLogout = item.href === "";

                const Inner = (
                  <>
                    <NavIcon href={item.href} />
                    <span className={`${collapsed ? "sr-only" : "truncate"}`}>{item.label}</span>
                    {collapsed && !isLogout && (
                      <span
                        className="pointer-events-none absolute left-full top-1/2 z-50 -translate-y-1/2 rounded-md bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 shadow transition group-hover:opacity-100 group-hover:delay-200"
                        style={{ marginLeft: 8 }}
                      >
                        {item.label}
                      </span>
                    )}
                  </>
                );

                return isLogout ? (
                  <button
                    key="logout"
                    onClick={handleLogout}
                    className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-100 ${
                      collapsed ? "justify-center px-0" : ""
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {Inner}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 ${
                      active ? "bg-neutral-100 font-medium" : ""
                    } ${collapsed ? "justify-center px-0" : ""}`}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    {Inner}
                  </Link>
                );
              })}
            </nav>

            {/* Soporte con icono */}
            <div className="mt-auto pt-4">
              <button
                className={`w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 flex items-center justify-center gap-2 ${
                  collapsed ? "px-0" : ""
                }`}
                title="Soporte"
                onClick={() => alert("Abrir soporte")}
              >
                <LifeBuoy className="h-5 w-5" />
                {!collapsed && <span>Soporte</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay + sidebar (mobile) */}
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral-200 transition-transform md:hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-[var(--color-brand-700)]">Vualá</span>
              <button className="p-2 rounded hover:bg-neutral-100" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
            <nav className="mt-6 space-y-1">
              {NAV.map((item) => {
                const isLogout = item.href === "";
                return isLogout ? (
                  <button
                    key="logout-m"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-100"
                  >
                    <NavIcon href={item.href} />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-neutral-100"
                  >
                    <NavIcon href={item.href} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            {/* Soporte en móvil con icono (opcional) */}
            <div className="mt-auto pt-4">
              <button
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 flex items-center justify-center gap-2"
                onClick={() => setOpen(false)}
                title="Soporte"
              >
                <LifeBuoy className="h-5 w-5" />
                <span>Soporte</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Columna principal */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Navbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white border-b border-neutral-200 px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button
                className="rounded p-2 hover:bg-neutral-100 md:hidden"
                aria-label="Abrir menú"
                onClick={() => setOpen(true)}
              >
                <svg width="24" height="24" stroke="currentColor" fill="none">
                  <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
              <h1 className="font-heading text-lg font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <input
                placeholder="Buscar…"
                className="hidden md:block rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
              />
              <div className="h-8 w-8 rounded-full bg-neutral-200" />
            </div>
          </header>

          {/* Main */}
          <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
