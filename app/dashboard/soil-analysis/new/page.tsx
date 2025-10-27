"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"

export default function NewSoilAnalysisPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const [fields, setFields] = useState<any[]>([])
  const [lang, setLang] = useState<"ar" | "en">("ar")
  const [formData, setFormData] = useState({
    field_id: "",
    analysis_date: new Date().toISOString().split("T")[0],
    ph_level: "",
    nitrogen_ppm: "",
    phosphorus_ppm: "",
    potassium_ppm: "",
    organic_matter_percent: "",
    moisture_percent: "",
    ec_ds_m: "",
  })
  const [aiRecommendations, setAiRecommendations] = useState("")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchFields()
  }, [])

  async function fetchFields() {
    try {
      const { data, error } = await supabase.from("fields").select("id, name, farms(name)").order("name")

      if (error) throw error
      setFields(data || [])
    } catch (error) {
      console.error("[v0] Error fetching fields:", error)
    }
  }

  async function generateAIRecommendations() {
    setGeneratingAI(true)
    try {
      const response = await fetch("/api/soil-analysis/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ph_level: Number.parseFloat(formData.ph_level),
          nitrogen_ppm: Number.parseFloat(formData.nitrogen_ppm),
          phosphorus_ppm: Number.parseFloat(formData.phosphorus_ppm),
          potassium_ppm: Number.parseFloat(formData.potassium_ppm),
          organic_matter_percent: Number.parseFloat(formData.organic_matter_percent),
          moisture_percent: Number.parseFloat(formData.moisture_percent),
          language: lang,
        }),
      })

      const data = await response.json()
      setAiRecommendations(data.recommendations)
    } catch (error) {
      console.error("[v0] Error generating AI recommendations:", error)
      alert(lang === "ar" ? "حدث خطأ في توليد التوصيات" : "Error generating recommendations")
    } finally {
      setGeneratingAI(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("soil_analysis").insert({
        user_id: user.id,
        field_id: formData.field_id,
        analysis_date: formData.analysis_date,
        ph_level: Number.parseFloat(formData.ph_level),
        nitrogen_ppm: Number.parseFloat(formData.nitrogen_ppm),
        phosphorus_ppm: Number.parseFloat(formData.phosphorus_ppm),
        potassium_ppm: Number.parseFloat(formData.potassium_ppm),
        organic_matter_percent: formData.organic_matter_percent
          ? Number.parseFloat(formData.organic_matter_percent)
          : null,
        moisture_percent: formData.moisture_percent ? Number.parseFloat(formData.moisture_percent) : null,
        ec_ds_m: formData.ec_ds_m ? Number.parseFloat(formData.ec_ds_m) : null,
        ai_recommendations: aiRecommendations || null,
      })

      if (error) throw error

      router.push("/dashboard/soil-analysis")
    } catch (error) {
      console.error("[v0] Error creating soil analysis:", error)
      alert(lang === "ar" ? "حدث خطأ أثناء حفظ التحليل" : "Error saving analysis")
    } finally {
      setLoading(false)
    }
  }

  const t = {
    ar: {
      title: "إضافة تحليل تربة جديد",
      back: "رجوع",
      field: "الحقل",
      selectField: "اختر الحقل",
      date: "تاريخ التحليل",
      ph: "مستوى الحموضة (pH)",
      nitrogen: "النيتروجين (ppm)",
      phosphorus: "الفوسفور (ppm)",
      potassium: "البوتاسيوم (ppm)",
      organicMatter: "المادة العضوية (%)",
      moisture: "الرطوبة (%)",
      ec: "التوصيل الكهربائي (dS/m)",
      generateAI: "توليد توصيات بالذكاء الاصطناعي",
      generating: "جاري التوليد...",
      aiRecommendations: "توصيات الذكاء الاصطناعي",
      cancel: "إلغاء",
      save: "حفظ التحليل",
      saving: "جاري الحفظ...",
    },
    en: {
      title: "Add New Soil Analysis",
      back: "Back",
      field: "Field",
      selectField: "Select field",
      date: "Analysis Date",
      ph: "pH Level",
      nitrogen: "Nitrogen (ppm)",
      phosphorus: "Phosphorus (ppm)",
      potassium: "Potassium (ppm)",
      organicMatter: "Organic Matter (%)",
      moisture: "Moisture (%)",
      ec: "Electrical Conductivity (dS/m)",
      generateAI: "Generate AI Recommendations",
      generating: "Generating...",
      aiRecommendations: "AI Recommendations",
      cancel: "Cancel",
      save: "Save Analysis",
      saving: "Saving...",
    },
  }

  const canGenerateAI = formData.ph_level && formData.nitrogen_ppm && formData.phosphorus_ppm && formData.potassium_ppm

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/soil-analysis">
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
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="field">{t[lang].field}</Label>
              <Select
                value={formData.field_id}
                onValueChange={(value) => setFormData({ ...formData, field_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t[lang].selectField} />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name} - {field.farms?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{t[lang].date}</Label>
              <Input
                id="date"
                type="date"
                value={formData.analysis_date}
                onChange={(e) => setFormData({ ...formData, analysis_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ph">{t[lang].ph}</Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                value={formData.ph_level}
                onChange={(e) => setFormData({ ...formData, ph_level: e.target.value })}
                placeholder="6.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nitrogen">{t[lang].nitrogen}</Label>
              <Input
                id="nitrogen"
                type="number"
                step="0.1"
                value={formData.nitrogen_ppm}
                onChange={(e) => setFormData({ ...formData, nitrogen_ppm: e.target.value })}
                placeholder="35"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phosphorus">{t[lang].phosphorus}</Label>
              <Input
                id="phosphorus"
                type="number"
                step="0.1"
                value={formData.phosphorus_ppm}
                onChange={(e) => setFormData({ ...formData, phosphorus_ppm: e.target.value })}
                placeholder="25"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="potassium">{t[lang].potassium}</Label>
              <Input
                id="potassium"
                type="number"
                step="0.1"
                value={formData.potassium_ppm}
                onChange={(e) => setFormData({ ...formData, potassium_ppm: e.target.value })}
                placeholder="150"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organic">{t[lang].organicMatter}</Label>
              <Input
                id="organic"
                type="number"
                step="0.1"
                value={formData.organic_matter_percent}
                onChange={(e) => setFormData({ ...formData, organic_matter_percent: e.target.value })}
                placeholder="3.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moisture">{t[lang].moisture}</Label>
              <Input
                id="moisture"
                type="number"
                step="0.1"
                value={formData.moisture_percent}
                onChange={(e) => setFormData({ ...formData, moisture_percent: e.target.value })}
                placeholder="25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ec">{t[lang].ec}</Label>
              <Input
                id="ec"
                type="number"
                step="0.01"
                value={formData.ec_ds_m}
                onChange={(e) => setFormData({ ...formData, ec_ds_m: e.target.value })}
                placeholder="1.5"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 bg-transparent"
              onClick={generateAIRecommendations}
              disabled={!canGenerateAI || generatingAI}
            >
              {generatingAI ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t[lang].generating}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t[lang].generateAI}
                </>
              )}
            </Button>

            {aiRecommendations && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-semibold mb-2">{t[lang].aiRecommendations}</h4>
                <p className="text-sm whitespace-pre-wrap">{aiRecommendations}</p>
              </Card>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Link href="/dashboard/soil-analysis" className="flex-1">
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
