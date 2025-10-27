"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sprout } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-black relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col gap-6">
          {/* Logo and Title */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/70 shadow-3d shadow-primary/50 hover:scale-105 transition-transform duration-300">
              <Sprout className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Adham AgriTech
            </h1>
            <p className="text-white/60 text-lg">منصة الزراعة الذكية</p>
          </div>

          <Card className="glass-card border-white/10 shadow-3d">
            <CardHeader>
              <CardTitle className="text-3xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                تسجيل الدخول
              </CardTitle>
              <CardDescription className="text-white/60">
                أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-white/90">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="farmer@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      dir="ltr"
                      className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-white/90">
                      كلمة المرور
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      dir="ltr"
                      className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
                  {error && (
                    <div className="rounded-lg bg-destructive/20 border border-destructive/30 p-3 text-sm text-destructive backdrop-blur-sm">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-glow hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-white/70">
                  ليس لديك حساب؟{" "}
                  <Link
                    href="/auth/signup"
                    className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                  >
                    إنشاء حساب جديد
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
