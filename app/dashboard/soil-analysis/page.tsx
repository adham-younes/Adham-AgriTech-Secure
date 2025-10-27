"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react"
import Link from "next/link"

export default function SoilAnalysisPage() {
  const [analyses, setAnalyses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<"ar" | "en">("ar")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchAnalyses()
  }, [])

  async function fetchAnalyses() {
    try {
      const { data, error } = await supabase
        .from("soil_analysis")
        .select("*, fields(name, farms(name))")
        .order("analysis_date", { ascending: false })

      if (error) throw error
      setAnalyses(data || [])
    } catch (error) {
      console.error("[v0] Error fetching soil analyses:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (value: number, optimal: { min: number; max: number }) => {
    if (value < optimal.min) return <TrendingDown className="h-4 w-4 text-orange-500" />
    if (value > optimal.max) return <TrendingUp className="h-4 w-4 text-orange-500" />
    return <Minus className="h-4 w-4 text-green-500" />
  }

  const t = {
    ar: {
      title: "تحليل التربة",
      addAnalysis: "إضافة تحليل جديد",
      noAnalyses: "لا توجد تحليلات",
      noAnalysesDesc: "ابدأ بإضافة تحليل تربة جديد",
      field: "الحقل",
      farm: "المزرعة",
      date: "التاريخ",
      ph: "الحموضة (pH)",
      nitrogen: "النيتروجين",
      phosphorus: "الفوسفور",
      potassium: "البوتاسيوم",
      viewDetails: "عرض التفاصيل",
    },
    en: {
      title: "Soil Analysis",
      addAnalysis: "Add New Analysis",
      noAnalyses: "No Analyses",
      noAnalysesDesc: "Start by adding a new soil analysis",
      field: "Field",
      farm: "Farm",
      date: "Date",
      ph: "pH Level",
      nitrogen: "Nitrogen",
      phosphorus: "Phosphorus",
      potassium: "Potassium",
      viewDetails: "View Details",
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          {t[lang].title}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="glass-card border-white/10 hover:border-green-500/50 hover:shadow-glow transition-all"
          >
            {lang === "ar" ? "EN" : "ع"}
          </Button>
          <Link href="/dashboard/soil-analysis/new">
            <Button className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-glow hover:shadow-glow-lg transition-all">
              <Plus className="h-4 w-4" />
              {t[lang].addAnalysis}
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      ) : analyses.length === 0 ? (
        <Card className="glass-card p-12 text-center border-white/10 shadow-depth">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-2xl font-bold text-white">{t[lang].noAnalyses}</h3>
            <p className="text-gray-400">{t[lang].noAnalysesDesc}</p>
            <Link href="/dashboard/soil-analysis/new">
              <Button className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-glow hover:shadow-glow-lg transition-all">
                <Plus className="h-4 w-4" />
                {t[lang].addAnalysis}
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {analyses.map((analysis) => (
            <Card
              key={analysis.id}
              className="glass-card p-6 border-white/10 hover:border-green-500/50 hover:shadow-glow transition-all group"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">
                    {analysis.fields?.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {t[lang].farm}: {analysis.fields?.farms?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t[lang].date}:{" "}
                    {new Date(analysis.analysis_date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{t[lang].ph}</span>
                      {getStatusIcon(analysis.ph_level, { min: 6.0, max: 7.5 })}
                    </div>
                    <p className="text-lg font-bold text-green-400">{analysis.ph_level}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{t[lang].nitrogen}</span>
                      {getStatusIcon(analysis.nitrogen_ppm, { min: 20, max: 50 })}
                    </div>
                    <p className="text-lg font-bold text-green-400">{analysis.nitrogen_ppm} ppm</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{t[lang].phosphorus}</span>
                      {getStatusIcon(analysis.phosphorus_ppm, { min: 15, max: 40 })}
                    </div>
                    <p className="text-lg font-bold text-green-400">{analysis.phosphorus_ppm} ppm</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{t[lang].potassium}</span>
                      {getStatusIcon(analysis.potassium_ppm, { min: 100, max: 200 })}
                    </div>
                    <p className="text-lg font-bold text-green-400">{analysis.potassium_ppm} ppm</p>
                  </div>
                </div>

                <Link href={`/dashboard/soil-analysis/${analysis.id}`}>
                  <Button
                    variant="outline"
                    className="w-full glass-card border-white/10 hover:border-green-500/50 hover:shadow-glow transition-all bg-transparent"
                  >
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
