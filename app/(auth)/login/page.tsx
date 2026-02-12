"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { LoginForm } from "@/features/auth/components/forms/login";
import { AuthLayout } from "@/features/auth/components/shared/auth-layout";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      description="Ingresa tus credenciales para acceder a tu cuenta"
    >
      <LoginForm />
    </AuthLayout>
  );
}
