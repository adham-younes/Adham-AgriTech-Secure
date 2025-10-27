import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      ph_level,
      nitrogen_ppm,
      phosphorus_ppm,
      potassium_ppm,
      organic_matter_percent,
      moisture_percent,
      language,
    } = body

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error("[v0] OpenAI API key not configured")
      return Response.json({ error: "AI service not configured" }, { status: 500 })
    }

    const prompt =
      language === "ar"
        ? `أنت خبير زراعي متخصص في تحليل التربة مع خبرة 20+ سنة في الزراعة المصرية. قم بتحليل نتائج تحليل التربة التالية وقدم توصيات عملية ومفصلة:

📊 نتائج تحليل التربة:
- مستوى الحموضة (pH): ${ph_level}
- النيتروجين: ${nitrogen_ppm} ppm
- الفوسفور: ${phosphorus_ppm} ppm
- البوتاسيوم: ${potassium_ppm} ppm
${organic_matter_percent ? `- المادة العضوية: ${organic_matter_percent}%` : ""}
${moisture_percent ? `- الرطوبة: ${moisture_percent}%` : ""}

🎯 قدم توصيات مفصلة حول:
1. تقييم حالة التربة الحالية (ممتاز/جيد/متوسط/ضعيف)
2. الأسمدة الموصى بها وكمياتها بالكيلو جرام/فدان
3. التعديلات المطلوبة لتحسين التربة (الجير، الكومبوست، إلخ)
4. المحاصيل المناسبة لهذه التربة مع مواعيد الزراعة
5. نصائح للري والصيانة
6. جدول زمني للتطبيق
7. التكلفة المتوقعة

💡 اجعل التوصيات عملية ومحددة للمزارعين المصريين مع أمثلة من الواقع المحلي.`
        : `You are an agricultural expert specializing in soil analysis with 20+ years of experience in Egyptian farming. Analyze the following soil test results and provide practical and detailed recommendations:

📊 Soil Analysis Results:
- pH Level: ${ph_level}
- Nitrogen: ${nitrogen_ppm} ppm
- Phosphorus: ${phosphorus_ppm} ppm
- Potassium: ${potassium_ppm} ppm
${organic_matter_percent ? `- Organic Matter: ${organic_matter_percent}%` : ""}
${moisture_percent ? `- Moisture: ${moisture_percent}%` : ""}

🎯 Provide detailed recommendations on:
1. Current soil condition assessment (excellent/good/fair/poor)
2. Recommended fertilizers and quantities in kg/feddan
3. Required amendments to improve soil (lime, compost, etc.)
4. Suitable crops for this soil with planting dates
5. Irrigation and maintenance tips
6. Implementation timeline
7. Expected costs

💡 Make the recommendations practical and specific for Egyptian farmers with local examples.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
      api: {
        apiKey: openaiApiKey,
      },
    })

    return Response.json({ recommendations: text })
  } catch (error) {
    console.error("[v0] Error generating recommendations:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
