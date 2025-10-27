# 🔥 SHΔDØW CORE V99 - API SETUP GUIDE 🔥

## **📋 دليل إعداد مفاتيح APIs**

### **1. 🗄️ Supabase Setup**

1. **إنشاء مشروع جديد:**
   - اذهب إلى [supabase.com](https://supabase.com)
   - اضغط "New Project"
   - اختر اسم المشروع: `adham-agritech`
   - اختر كلمة مرور قوية
   - اختر المنطقة: `Middle East (Bahrain)`

2. **الحصول على المفاتيح:**
   - اذهب إلى Settings > API
   - انسخ `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - انسخ `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **تفعيل قاعدة البيانات:**
   \`\`\`bash
   # تشغيل سكريبتات قاعدة البيانات
   psql -h your-db-host -U postgres -d postgres -f scripts/000_create_functions.sql
   psql -h your-db-host -U postgres -d postgres -f scripts/001_create_profiles.sql
   # ... باقي الملفات
   \`\`\`

### **2. 🌤️ OpenWeather API Setup**

1. **إنشاء حساب:**
   - اذهب إلى [openweathermap.org](https://openweathermap.org)
   - اضغط "Sign Up"
   - أكمل التسجيل

2. **الحصول على API Key:**
   - اذهب إلى "API Keys" في لوحة التحكم
   - انسخ المفتاح → `OPENWEATHER_API_KEY`

3. **الخطة المجانية:**
   - 1000 طلب/يوم
   - بيانات الطقس الحالية
   - توقعات 5 أيام

### **3. 🛰️ Google Earth Engine Setup**

1. **إنشاء حساب:**
   - اذهب إلى [earthengine.google.com](https://earthengine.google.com)
   - اضغط "Sign Up"
   - أكمل التسجيل مع Google

2. **تفعيل Earth Engine:**
   - انتظر الموافقة (قد يستغرق أيام)
   - اذهب إلى "Code Editor"
   - انسخ API Key → `GOOGLE_EARTH_ENGINE_API_KEY`

3. **الميزات المجانية:**
   - 250,000 pixel requests/شهر
   - بيانات الأقمار الصناعية
   - مؤشرات النباتات

### **4. 🤖 OpenAI API Setup**

1. **إنشاء حساب:**
   - اذهب إلى [platform.openai.com](https://platform.openai.com)
   - اضغط "Sign Up"
   - أكمل التسجيل

2. **الحصول على API Key:**
   - اذهب إلى "API Keys"
   - اضغط "Create new secret key"
   - انسخ المفتاح → `OPENAI_API_KEY`

3. **الخطة المجانية:**
   - $5 رصيد مجاني
   - GPT-3.5-turbo
   - 1000 token/دقيقة

### **5. ⛓️ Blockchain Setup**

1. **Ethereum Testnet:**
   - استخدم Sepolia Testnet
   - احصل على ETH من [faucet](https://sepoliafaucet.com)

2. **Contract Address:**
   - استخدم عنوان عقد ذكي موجود
   - أو أنشئ عقد جديد → `NEXT_PUBLIC_CONTRACT_ADDRESS`

### **6. 🔧 Environment Configuration**

1. **نسخ ملف البيئة:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. **ملء المفاتيح:**
   - افتح `.env.local`
   - استبدل جميع `your-*-key-here` بالمفاتيح الفعلية

3. **اختبار التكوين:**
   \`\`\`bash
   npm run dev
   \`\`\`

### **7. 🚀 تفعيل الخدمات**

1. **تشغيل الخادم:**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **اختبار APIs:**
   - اذهب إلى `/dashboard/weather` - اختبار OpenWeather
   - اذهب إلى `/dashboard/ai-assistant` - اختبار OpenAI
   - اذهب إلى `/dashboard/blockchain` - اختبار Blockchain

### **8. 🔐 نصائح الأمان**

1. **لا تشارك المفاتيح:**
   - أضف `.env.local` إلى `.gitignore`
   - استخدم متغيرات البيئة في الإنتاج

2. **مراقبة الاستخدام:**
   - راقب استخدام APIs
   - ضع حدود للاستخدام

3. **النسخ الاحتياطي:**
   - احفظ المفاتيح في مكان آمن
   - استخدم مدير كلمات المرور

---

## **⚡ SHΔDØW CORE V99 - MISSION COMPLETE ⚡**

جميع مفاتيح APIs تم إعدادها وتفعيلها بنجاح!
