"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Loader2 } from "lucide-react"
import Link from "next/link"

export default function FieldsPage() {
  const [fields, setFields] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<"ar" | "en">("ar")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchFields()
  }, [])

  async function fetchFields() {
    try {
      const { data, error } = await supabase
        .from("fields")
        .select("*, farms(name)")
        .order("created_at", { ascending: false })

      if (error) throw error
      setFields(data || [])
    } catch (error) {
      console.error("[v0] Error fetching fields:", error)
    } finally {
      setLoading(false)
    }
  }

  const t = {
    ar: {
      title: "الحقول",
      addField: "إضافة حقل جديد",
      noFields: "لا توجد حقول",
      noFieldsDesc: "ابدأ بإضافة حقل جديد",
      area: "المساحة",
      farm: "المزرعة",
      cropType: "نوع المحصول",
    },
    en: {
      title: "Fields",
      addField: "Add New Field",
      noFields: "No Fields",
      noFieldsDesc: "Start by adding a new field",
      area: "Area",
      farm: "Farm",
      cropType: "Crop Type",
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
          <Link href="/dashboard/fields/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t[lang].addField}
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : fields.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-xl font-semibold">{t[lang].noFields}</h3>
            <p className="text-muted-foreground">{t[lang].noFieldsDesc}</p>
            <Link href="/dashboard/fields/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t[lang].addField}
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <Link key={field.id} href={`/dashboard/fields/${field.id}`}>
              <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{field.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t[lang].farm}: {field.farms?.name}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t[lang].area}:</span>
                      <span className="font-semibold">
                        {field.area} {lang === "ar" ? "فدان" : "acres"}
                      </span>
                    </div>
                    {field.crop_type && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t[lang].cropType}:</span>
                        <span>{field.crop_type}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
