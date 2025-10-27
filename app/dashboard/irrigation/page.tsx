"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2, Droplets, Calendar } from "lucide-react"
import Link from "next/link"

export default function IrrigationPage() {
  const [systems, setSystems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<"ar" | "en">("ar")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchSystems()
  }, [])

  async function fetchSystems() {
    try {
      const { data, error } = await supabase
        .from("irrigation_systems")
        .select("*, fields(name, farms(name))")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSystems(data || [])
    } catch (error) {
      console.error("[v0] Error fetching irrigation systems:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "scheduled":
        return "bg-blue-500"
      case "inactive":
        return "bg-gray-500"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const t = {
    ar: {
      title: "أنظمة الري",
      addSystem: "إضافة نظام جديد",
      noSystems: "لا توجد أنظمة ري",
      noSystemsDesc: "ابدأ بإضافة نظام ري جديد",
      field: "الحقل",
      farm: "المزرعة",
      type: "النوع",
      status: "الحالة",
      flowRate: "معدل التدفق",
      schedule: "الجدول",
      active: "نشط",
      scheduled: "مجدول",
      inactive: "غير نشط",
      maintenance: "صيانة",
      drip: "تنقيط",
      sprinkler: "رش",
      surface: "سطحي",
      subsurface: "تحت السطح",
      viewDetails: "عرض التفاصيل",
    },
    en: {
      title: "Irrigation Systems",
      addSystem: "Add New System",
      noSystems: "No Irrigation Systems",
      noSystemsDesc: "Start by adding a new irrigation system",
      field: "Field",
      farm: "Farm",
      type: "Type",
      status: "Status",
      flowRate: "Flow Rate",
      schedule: "Schedule",
      active: "Active",
      scheduled: "Scheduled",
      inactive: "Inactive",
      maintenance: "Maintenance",
      drip: "Drip",
      sprinkler: "Sprinkler",
      surface: "Surface",
      subsurface: "Subsurface",
      viewDetails: "View Details",
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t[lang].title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
            {lang === "ar" ? "EN" : "ع"}
          </Button>
          <Link href="/dashboard/irrigation/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t[lang].addSystem}
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : systems.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Droplets className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{t[lang].noSystems}</h3>
            <p className="text-muted-foreground">{t[lang].noSystemsDesc}</p>
            <Link href="/dashboard/irrigation/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t[lang].addSystem}
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {systems.map((system) => (
            <Card key={system.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{system.fields?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t[lang].farm}: {system.fields?.farms?.name}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(system.status)} text-white`}>
                    {t[lang][system.status as keyof typeof t.ar] || system.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t[lang].type}:</span>
                    <span className="font-medium">
                      {t[lang][system.irrigation_type as keyof typeof t.ar] || system.irrigation_type}
                    </span>
                  </div>

                  {system.flow_rate_lpm && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t[lang].flowRate}:</span>
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-primary" />
                        <span className="font-medium">{system.flow_rate_lpm} L/min</span>
                      </div>
                    </div>
                  )}

                  {system.schedule && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t[lang].schedule}:</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-primary" />
                        <span className="font-medium text-xs">{system.schedule}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Link href={`/dashboard/irrigation/${system.id}`}>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    {t[lang].viewDetails}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
