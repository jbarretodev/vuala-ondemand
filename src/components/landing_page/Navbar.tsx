"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";


type NavItem= {
  label:String;
  href:String;
};

const NAV_ITEMS: NavItem[] = [
  {label:"Inicio", href:"/"},
  {label:"Particulares", href:"/particulares"},
  {label:"Empresas/Partners", href:"/empresas"},
  {label:"Productos", href:"/productos"},
  {label:"Precios", href:"/precios"},
  {label:"Contacto", href:"/contacto"},
];

export default function Nabvar(){
  const pathname = usePathname();
  const [open, setOpen ] = useState(false);

  const isActive = (href: string) => 
    href === "/"
      ?pathname === "/"
      :pathname.startsWith(href);

  return(
    
  <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/70">
  <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
    {/* Brand con logo */}
    <div className="flex items-center gap-3">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logos/vuala.png" 
          alt="Logo Vuala"
          width={80}
          height={40}
          className="h-10 w-30 object-contain"
          priority
        />
      </Link>
    </div>

    {/* Desktop nav */}
    <ul className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={[
              "rounded-xl px-3 py-2 text-sm transition",
              isActive(item.href)
                ? "bg-blue-500 text-white dark:bg-white dark:text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
            ].join(" ")}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>

    {/* Desktop acciones */}
    <div className="hidden items-center gap-3 md:flex">
      <Link
        href="/login"
        className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        Ingresar
      </Link>
      <Link
        href="/register"
        className="rounded-xl bg-blue-500 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        Registrarse
      </Link>
    </div>

    {/* Mobile toggle */}
    <button
      aria-label="Abrir menú"
      className="inline-flex items-center justify-center rounded-xl p-2 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
      onClick={() => setOpen((v) => !v)}
    >
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        {open ? (
          <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeWidth="2" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
        )}
      </svg>
    </button>
  </nav>

  {/* Mobile menu */}
  {open && (
    <div className="border-t border-gray-200 md:hidden dark:border-gray-800">
      <ul className="space-y-1 px-4 py-3">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className={[
                "block rounded-xl px-3 py-2 text-sm transition",
                isActive(item.href)
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
              ].join(" ")}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Ingresar
          </Link>
        </li>
        <li>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="block rounded-xl bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Registrarse
          </Link>
        </li>
      </ul>
    </div>
  )}
</header>
);
}

