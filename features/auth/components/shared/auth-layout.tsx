import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  className,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4">
      {/* Absolute Blue Blur Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        {/* Logo/Brand Section */}

        <Card
          className={cn(
            "w-full border-white/20 shadow-2xl bg-white/60 backdrop-blur-xl ring-1 ring-black/5",
            className,
          )}
        >
         
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-center text-slate-500 text-base">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>

          {/* Footer inside card or below */}
          <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
            <a
              href="#"
              className="hover:text-slate-600 transition-colors flex items-center gap-1"
            >
              Solicitar acceso
              <span className="text-[10px] leading-none">↗</span>
            </a>
          </div>
        </Card>

        <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
          © {new Date().getFullYear()} Qualitas Nexus Systems • v2.4.0
        </div>
      </div>
    </div>
  );
}
