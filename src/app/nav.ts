// nav.ts
import React from "react";
import { LayoutDashboard, Truck, Package, Settings } from "./icons"; // o comenta si no usas Lucide

type IconComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type NavItem = {
  href: string;
  label: string;
  icon?: IconComp;      // para SVG/React (Lucide)
  iconCls?: string;     // para icon font del template (ej: "ti ti-dashboard")
};

export const NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, iconCls: "ti ti-smart-home" },
  { href: "/logistica", label: "Logística", icon: Truck,          iconCls: "ti ti-truck" },
  { href: "/pedidos",   label: "Pedidos",   icon: Package,        iconCls: "ti ti-package" },
  { href: "/ajustes",   label: "Ajustes",   icon: Settings,       iconCls: "ti ti-settings" },
];
