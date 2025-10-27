import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <h1 className="mb-6 text-6xl font-bold tracking-tight text-glow sm:text-7xl md:text-8xl">
            شركاؤنا في النجاح
          </h1>
          <p className="mx-auto mb-4 max-w-3xl text-xl text-foreground/90 sm:text-2xl">Our Partners in Success</p>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
            نتعاون مع أفضل الشركات العالمية في مجال التكنولوجيا الزراعية والذكاء الاصطناعي لتقديم أفضل الحلول للمزارعين
          </p>
          <Button asChild size="lg" className="group">
            <Link href="/auth/signup">
              انضم إلينا
              <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">شركاء التكنولوجيا</h2>
            <p className="text-lg text-muted-foreground">Technology Partners</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {techPartners.map((partner) => (
              <div
                key={partner.name}
                className="depth-card hover-lift group flex flex-col items-center justify-center rounded-2xl p-8"
              >
                <div className="mb-6 flex h-24 w-full items-center justify-center">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={160}
                    height={60}
                    className="h-auto w-full max-w-[160px] object-contain opacity-70 transition-opacity group-hover:opacity-100"
                    query={`${partner.name} logo white on transparent background`}
                  />
                </div>
                <h3 className="mb-2 text-center text-lg font-semibold">{partner.name}</h3>
                <p className="text-center text-sm text-muted-foreground">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agricultural Partners */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">الشركاء الزراعيون</h2>
            <p className="text-lg text-muted-foreground">Agricultural Partners</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {agriPartners.map((partner) => (
              <div key={partner.name} className="glass-card hover-lift group rounded-2xl p-8">
                <div className="mb-6 flex h-20 w-full items-center justify-center">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={140}
                    height={50}
                    className="h-auto w-full max-w-[140px] object-contain opacity-70 transition-opacity group-hover:opacity-100"
                    query={`${partner.name} agricultural company logo`}
                  />
                </div>
                <h3 className="mb-2 text-center text-lg font-semibold">{partner.name}</h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">{partner.description}</p>
                <div className="space-y-2">
                  {partner.services.map((service) => (
                    <div key={service} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="depth-card rounded-2xl p-8 text-center">
                <div className="mb-2 text-5xl font-bold text-primary">{stat.value}</div>
                <div className="mb-1 text-lg font-semibold">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.labelEn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="glass-card glow-primary rounded-3xl p-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">هل تريد أن تصبح شريكاً؟</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              انضم إلى شبكتنا من الشركاء الرائدين في مجال التكنولوجيا الزراعية
            </p>
            <Button asChild size="lg" variant="outline" className="group bg-transparent">
              <Link href="/contact">
                تواصل معنا
                <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

const techPartners = [
  {
    name: "Google Earth Engine",
    logo: "/placeholder.svg?height=60&width=160",
    description: "خدمات الأقمار الصناعية والتحليل الجغرافي",
  },
  {
    name: "OpenAI",
    logo: "/placeholder.svg?height=60&width=160",
    description: "الذكاء الاصطناعي والمساعد الذكي",
  },
  {
    name: "Microsoft Azure",
    logo: "/placeholder.svg?height=60&width=160",
    description: "الحوسبة السحابية والبنية التحتية",
  },
  {
    name: "Ethereum",
    logo: "/placeholder.svg?height=60&width=160",
    description: "تقنية البلوكتشين والعقود الذكية",
  },
]

const agriPartners = [
  {
    name: "وزارة الزراعة المصرية",
    logo: "/placeholder.svg?height=50&width=140",
    description: "الشريك الحكومي الرسمي",
    services: ["الدعم الفني", "التدريب", "الإرشاد الزراعي"],
  },
  {
    name: "شركة الأسمدة المصرية",
    logo: "/placeholder.svg?height=50&width=140",
    description: "توريد الأسمدة والمبيدات",
    services: ["أسمدة عضوية", "مبيدات آمنة", "استشارات"],
  },
  {
    name: "بنك التنمية الزراعي",
    logo: "/placeholder.svg?height=50&width=140",
    description: "التمويل والقروض الزراعية",
    services: ["قروض ميسرة", "تأمين المحاصيل", "دعم مالي"],
  },
]

const stats = [
  { value: "50+", label: "شريك تقني", labelEn: "Tech Partners" },
  { value: "100+", label: "شريك زراعي", labelEn: "Agri Partners" },
  { value: "10K+", label: "مزارع مستفيد", labelEn: "Farmers Served" },
  { value: "95%", label: "رضا الشركاء", labelEn: "Partner Satisfaction" },
]
