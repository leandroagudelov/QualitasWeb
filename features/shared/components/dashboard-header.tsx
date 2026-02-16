"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export function DashboardHeader({ onMenuClick, sidebarOpen = true }: DashboardHeaderProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/80 bg-white px-4 dark:border-slate-800 dark:bg-slate-900"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </Button>

      <Link href="/" className="flex items-center gap-2 shrink-0">
        <Image
          src="/logo.svg"
          alt="Qualitas"
          width={28}
          height={28}
          className="size-7 object-contain"
        />
        <span className="font-semibold text-slate-900 dark:text-slate-100 hidden sm:inline">
          Qualitas
        </span>
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-slate-600 dark:text-slate-400 sm:block">
          {user?.email ?? user?.name ?? "Usuario"}
        </span>
        <Button variant="ghost" size="icon" aria-label="Perfil" asChild>
          <Link href="/">
            <User className="size-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Ajustes" asChild>
          <Link href="/">
            <Settings className="size-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
