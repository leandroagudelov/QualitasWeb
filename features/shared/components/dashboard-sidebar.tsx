"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  UsersRound,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";

// Enlaces siempre visibles para usuarios autenticados. Las acciones dentro de cada página (crear, editar, eliminar) siguen protegidas por permisos.
const SIDEBAR_SECTIONS = [
  {
    title: "HOME",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard, permission: null },
    ],
  },
  {
    title: "ADMINISTRACIÓN",
    items: [
      { href: "/usuarios", label: "Usuarios", icon: Users, permission: null },
      { href: "/roles", label: "Roles", icon: Shield, permission: null },
      { href: "/grupos", label: "Grupos", icon: UsersRound, permission: null },
    ],
  },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col",
        "border-r border-slate-200/80 bg-white",
        "dark:border-slate-800 dark:bg-slate-900"
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/80 px-5 dark:border-slate-800">
        <Image
          src="/logo.svg"
          alt="Qualitas"
          width={32}
          height={32}
          className="size-8 object-contain"
        />
        <span className="font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Qualitas
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.title} className="mb-2">
            <p className="mb-1 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === href || (href !== "/" && pathname.startsWith(href))
                      ? "bg-primary text-primary-foreground"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200/80 p-3 dark:border-slate-800">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          onClick={() => logout()}
        >
          <LogOut className="size-4 shrink-0" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
