"use client"

import { useState, useEffect, useRef } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Sparkles, User, Bot } from "lucide-react"
import { useChat } from "ai"

export default function AIAssistantPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar")
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/ai-assistant",
    body: { language: lang },
    onFinish: async (message) => {
      // Save to database
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          await supabase.from("ai_chat_history").insert({
            user_id: user.id,
            message: messages[messages.length - 2]?.content || "",
            response: message.content,
            language: lang,
          })
        }
      } catch (error) {
        console.error("[v0] Error saving chat history:", error)
      }
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    loadChatHistory()
  }, [])

  async function loadChatHistory() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("ai_chat_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setChatHistory(data || [])
    } catch (error) {
      console.error("[v0] Error loading chat history:", error)
    }
  }

  const t = {
    ar: {
      title: "المساعد الذكي الزراعي",
      subtitle: "اسأل أي سؤال عن الزراعة والمحاصيل",
      placeholder: "اكتب سؤالك هنا...",
      send: "إرسال",
      examples: "أمثلة على الأسئلة:",
      example1: "ما هو أفضل وقت لزراعة القمح في مصر؟",
      example2: "كيف أعالج نقص النيتروجين في التربة؟",
      example3: "ما هي أفضل طرق الري للمحاصيل الصيفية؟",
      recentChats: "المحادثات الأخيرة",
      noHistory: "لا توجد محادثات سابقة",
    },
    en: {
      title: "Agricultural AI Assistant",
      subtitle: "Ask any question about farming and crops",
      placeholder: "Type your question here...",
      send: "Send",
      examples: "Example Questions:",
      example1: "What is the best time to plant wheat in Egypt?",
      example2: "How do I treat nitrogen deficiency in soil?",
      example3: "What are the best irrigation methods for summer crops?",
      recentChats: "Recent Chats",
      noHistory: "No chat history",
    },
  }

  const exampleQuestions = [t[lang].example1, t[lang].example2, t[lang].example3]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            {t[lang].title}
          </h1>
          <p className="text-muted-foreground mt-1">{t[lang].subtitle}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
          {lang === "ar" ? "EN" : "ع"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{t[lang].title}</h3>
                    <p className="text-muted-foreground max-w-md">{t[lang].subtitle}</p>
                  </div>
                  <div className="space-y-3 w-full max-w-md">
                    <p className="text-sm font-medium text-muted-foreground">{t[lang].examples}</p>
                    {exampleQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-start h-auto py-3 px-4 bg-transparent"
                        onClick={() => {
                          handleInputChange({ target: { value: question } } as any)
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div
                        className={`rounded-lg px-4 py-3 max-w-[80%] ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="rounded-lg px-4 py-3 bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={t[lang].placeholder}
                  disabled={isLoading}
                  className="flex-1"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                />
                <Button type="submit" disabled={isLoading || !input.trim()} className="gap-2">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {t[lang].send}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{t[lang].recentChats}</h3>
            {chatHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t[lang].noHistory}</p>
            ) : (
              <div className="space-y-3">
                {chatHistory.slice(0, 5).map((chat) => (
                  <div key={chat.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium line-clamp-2 mb-1">{chat.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(chat.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
