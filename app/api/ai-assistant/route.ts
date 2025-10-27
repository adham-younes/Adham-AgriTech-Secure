import { streamText } from "ai"

export async function POST(request: Request) {
  try {
    const { messages, language } = await request.json()

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error("[v0] OpenAI API key not configured")
      return Response.json({ error: "AI service not configured" }, { status: 500 })
    }

    const systemPrompt =
      language === "ar"
        ? `أنت مساعد زراعي ذكي متخصص في الزراعة المصرية. تقدم نصائح عملية ومفصلة للمزارعين حول:
- زراعة المحاصيل المختلفة (القمح، الذرة، القطن، الأرز، الخضروات، الفواكه)
- إدارة التربة والأسمدة
- أنظمة الري والمياه
- مكافحة الآفات والأمراض
- الطقس وتأثيره على المحاصيل
- أفضل الممارسات الزراعية في المناخ المصري
- استخدام التكنولوجيا في الزراعة (الأقمار الصناعية، الذكاء الاصطناعي)
- الاستدامة الزراعية وحماية البيئة

قدم إجابات واضحة ومفيدة باللغة العربية الفصحى البسيطة مع أمثلة عملية من الواقع المصري.`
        : `You are an intelligent agricultural assistant specializing in Egyptian farming. You provide practical and detailed advice to farmers about:
- Growing different crops (wheat, corn, cotton, rice, vegetables, fruits)
- Soil management and fertilizers
- Irrigation systems and water management
- Pest and disease control
- Weather and its impact on crops
- Best agricultural practices in the Egyptian climate
- Technology in agriculture (satellites, AI, IoT)
- Sustainable farming and environmental protection

Provide clear and helpful answers in English with practical examples from Egyptian agriculture.`

    const result = await streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 2000,
      api: {
        apiKey: openaiApiKey,
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("[v0] Error in AI assistant:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}
