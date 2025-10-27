"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, LogOut, User, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface HeaderProps {
  user: any
  profile: any
}

export function DashboardHeader({ user, profile }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 shadow-3d">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          مرحباً، {profile?.full_name || "مستخدم"}
        </h1>
        <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary border border-primary/30 shadow-glow">
          {profile?.role === "farmer" ? "مزارع" : profile?.role === "engineer" ? "مهندس زراعي" : "مدير"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-white/5 transition-all duration-300 hover:shadow-glow"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-glow" />
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 hover:bg-white/5 transition-all duration-300">
              <Avatar className="h-8 w-8 border-2 border-primary/30 shadow-glow">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">{profile?.full_name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card border-white/10">
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/5">
              <User className="ml-2 h-4 w-4" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/5">
              <Settings className="ml-2 h-4 w-4" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:bg-destructive/10">
              <LogOut className="ml-2 h-4 w-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
