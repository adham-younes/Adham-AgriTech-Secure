"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewFieldPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const farmIdParam = searchParams.get("farm_id")

  const [loading, setLoading] = useState(false)
  const [farms, setFarms] = useState<any[]>([])
  const [lang, setLang] = useState<"ar" | "en">("ar")
  const [formData, setFormData] = useState({
    name: "",
    farm_id: farmIdParam || "",
    area: "",
    crop_type: "",
    soil_type: "",
    boundary_coordinates: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchFarms()
  }, [])

  async function fetchFarms() {
    try {
      const { data, error } = await supabase.from("farms").select("id, name").order("name")

      if (error) throw error
      setFarms(data || [])
    } catch (error) {
      console.error("[v0] Error fetching farms:", error)
    }
  }

  const t = {
    ar: {
      title: "إضافة حقل جديد",
      back: "رجوع",
      name: "اسم الحقل",
      namePlaceholder: "أدخل اسم الحقل",
      farm: "المزرعة",
      selectFarm: "اختر المزرعة",
      area: "المساحة (فدان)",
      areaPlaceholder: "0",
      cropType: "نوع المحصول",
      cropPlaceholder: "قمح، ذرة، قطن، إلخ",
      soilType: "نوع التربة",
      soilPlaceholder: "طينية، رملية، إلخ",
      boundary: "إحداثيات الحدود (JSON)",
      boundaryPlaceholder: "[[lat, lng], [lat, lng], ...]",
      cancel: "إلغاء",
      save: "حفظ الحقل",
      saving: "جاري الحفظ...",
    },
    en: {
      title: "Add New Field",
      back: "Back",
      name: "Field Name",
      namePlaceholder: "Enter field name",
      farm: "Farm",
      selectFarm: "Select farm",
      area: "Area (acres)",
      areaPlaceholder: "0",
      cropType: "Crop Type",
      cropPlaceholder: "Wheat, Corn, Cotton, etc",
      soilType: "Soil Type",
      soilPlaceholder: "Clay, Sandy, etc",
      boundary: "Boundary Coordinates (JSON)",
      boundaryPlaceholder: "[[lat, lng], [lat, lng], ...]",
      cancel: "Cancel",
      save: "Save Field",
      saving: "Saving...",
    },
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      let boundaryCoords = null
      if (formData.boundary_coordinates) {
        try {
          boundaryCoords = JSON.parse(formData.boundary_coordinates)
        } catch {
          alert(lang === "ar" ? "صيغة الإحداثيات غير صحيحة" : "Invalid coordinates format")
          setLoading(false)
          return
        }
      }

      const { error } = await supabase.from("fields").insert({
        user_id: user.id,
        farm_id: formData.farm_id,
        name: formData.name,
        area: Number.parseFloat(formData.area),
        crop_type: formData.crop_type || null,
        soil_type: formData.soil_type || null,
        boundary_coordinates: boundaryCoords,
      })

      if (error) throw error

      router.push("/dashboard/fields")
    } catch (error) {
      console.error("[v0] Error creating field:", error)
      alert(lang === "ar" ? "حدث خطأ أثناء إنشاء الحقل" : "Error creating field")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/fields">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{t[lang].title}</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
          {lang === "ar" ? "EN" : "ع"}
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t[lang].name}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t[lang].namePlaceholder}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farm">{t[lang].farm}</Label>
            <Select
              value={formData.farm_id}
              onValueChange={(value) => setFormData({ ...formData, farm_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={t[lang].selectFarm} />
              </SelectTrigger>
              <SelectContent>
                {farms.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area">{t[lang].area}</Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder={t[lang].areaPlaceholder}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crop_type">{t[lang].cropType}</Label>
              <Input
                id="crop_type"
                value={formData.crop_type}
                onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                placeholder={t[lang].cropPlaceholder}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="soil_type">{t[lang].soilType}</Label>
            <Input
              id="soil_type"
              value={formData.soil_type}
              onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
              placeholder={t[lang].soilPlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="boundary">{t[lang].boundary}</Label>
            <Textarea
              id="boundary"
              value={formData.boundary_coordinates}
              onChange={(e) => setFormData({ ...formData, boundary_coordinates: e.target.value })}
              placeholder={t[lang].boundaryPlaceholder}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Link href="/dashboard/fields" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                {t[lang].cancel}
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t[lang].saving}
                </>
              ) : (
                t[lang].save
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
