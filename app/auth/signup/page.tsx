"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sprout } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<string>("farmer")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
          },
        },
      })
      if (error) throw error
      router.push("/auth/signup-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col gap-6">
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
                إنشاء حساب جديد
              </CardTitle>
              <CardDescription className="text-white/60">أدخل بياناتك لإنشاء حساب جديد في المنصة</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" className="text-white/90">
                      الاسم الكامل
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="أحمد محمد"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
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
                    <Label htmlFor="phone" className="text-white/90">
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+20 123 456 7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                      className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role" className="text-white/90">
                      نوع الحساب
                    </Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger
                        id="role"
                        className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10">
                        <SelectItem value="farmer">مزارع</SelectItem>
                        <SelectItem value="engineer">مهندس زراعي</SelectItem>
                        <SelectItem value="manager">مدير</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-white/90">
                      تأكيد كلمة المرور
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-white/70">
                  لديك حساب بالفعل؟{" "}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                  >
                    تسجيل الدخول
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
