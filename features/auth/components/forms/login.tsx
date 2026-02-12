"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authService } from "../../services/auth.service"
import { loginSchema, LoginSchema } from "../../schemas"
import toast from "react-hot-toast"

import { useAuthStore } from "@/features/auth/store/auth.store"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      tenant: "", 
    },
  })

  async function onSubmit(values: LoginSchema) {
    setIsLoading(true)
    setError("")
    try {
      const response = await authService.login(
        { email: values.email, password: values.password },
        values.tenant
      )
      
      console.log("Login exitoso:", response)
      
      // Guardar sesión en store y cookies
      if (response.accessToken && response.refreshToken) {
        login(response.accessToken, response.refreshToken)
        
        // Redirigir al dashboard (ruta raíz)
        router.push("/")
      } else {
        throw new Error("Respuesta inválida del servidor")
      }
      
    } catch (err: any) {
      console.error(err)
      setError("Error al iniciar sesión. Por favor verifica tus credenciales.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tenant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant (Organización)</FormLabel>
              <FormControl>
                <Input placeholder="root" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="m@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-sm text-red-500 font-medium text-center">{error}</div>}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  )
}
