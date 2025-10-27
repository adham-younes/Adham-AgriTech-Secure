"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewFarmPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<"ar" | "en">("ar")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    total_area: "",
    latitude: "",
    longitude: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const t = {
    ar: {
      title: "إضافة مزرعة جديدة",
      back: "رجوع",
      name: "اسم المزرعة",
      namePlaceholder: "أدخل اسم المزرعة",
      description: "الوصف",
      descriptionPlaceholder: "وصف المزرعة",
      location: "الموقع",
      locationPlaceholder: "المدينة، المحافظة",
      area: "المساحة (فدان)",
      areaPlaceholder: "0",
      latitude: "خط العرض",
      latitudePlaceholder: "30.0444",
      longitude: "خط الطول",
      longitudePlaceholder: "31.2357",
      cancel: "إلغاء",
      save: "حفظ المزرعة",
      saving: "جاري الحفظ...",
    },
    en: {
      title: "Add New Farm",
      back: "Back",
      name: "Farm Name",
      namePlaceholder: "Enter farm name",
      description: "Description",
      descriptionPlaceholder: "Farm description",
      location: "Location",
      locationPlaceholder: "City, Governorate",
      area: "Area (acres)",
      areaPlaceholder: "0",
      latitude: "Latitude",
      latitudePlaceholder: "30.0444",
      longitude: "Longitude",
      longitudePlaceholder: "31.2357",
      cancel: "Cancel",
      save: "Save Farm",
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

      const { error } = await supabase.from("farms").insert({
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        total_area: Number.parseFloat(formData.total_area),
        latitude: Number.parseFloat(formData.latitude),
        longitude: Number.parseFloat(formData.longitude),
      })

      if (error) throw error

      router.push("/dashboard/farms")
    } catch (error) {
      console.error("[v0] Error creating farm:", error)
      alert(lang === "ar" ? "حدث خطأ أثناء إنشاء المزرعة" : "Error creating farm")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/farms">
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
            <Label htmlFor="description">{t[lang].description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t[lang].descriptionPlaceholder}
              rows={3}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">{t[lang].location}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t[lang].locationPlaceholder}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">{t[lang].area}</Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                value={formData.total_area}
                onChange={(e) => setFormData({ ...formData, total_area: e.target.value })}
                placeholder={t[lang].areaPlaceholder}
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">{t[lang].latitude}</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder={t[lang].latitudePlaceholder}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">{t[lang].longitude}</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder={t[lang].longitudePlaceholder}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Link href="/dashboard/farms" className="flex-1">
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
