# TorexTalk

Ishlab chiqarishga tayyor to'liq-stack React ilovasi Telegram hisoblarini boshqarish va AI asosida avtojavoblar uchun.

## Tavsif

TorexTalk - bu foydalanuvchilarga bir nechta Telegram hisoblarini boshqarish, mass xabar yuborish, AI avtojavoblarini sozlash, xabarlarni rejalashtirish va samaradorlikni tahlil qilish imkonini beruvchi veb-platforma. Fusion Starter shabloniga asoslangan holda, u Telegram-ga o'xshash chat interfeysi bilan ilg'or avtomatlashtirish xususiyatlarini taqdim etadi.

## Xususiyatlar

- **Telegram-ga o'xshash Chat UI**: Shaxsiy va guruh chatlarini alohida boshqarish uchun ajratilgan.
- **Mass xabar yuborish**: Barcha shaxsiy chatlarga bir zumda xabar yuborish, rejalashtirish va segmentatsiya bilan.
- **AI avtojavob**: Q&A juftliklari bilan AI modellarini o'rgatish orqali aqlli javoblar.
- **Rejalashtirish va shablonlar**: Xabarlarni rejalashtirish va qayta ishlatiladigan shablonlarni saqlash.
- **Real vaqt bildirishnomalar**: Yangi xabarlar va avtojavob holatlari uchun ogohlantirishlar.
- **Statistika va tahlillar**: Xabar ko'rsatkichlari, javob vaqtlari va eksport hisobotlarini kuzatish.
- **Ko'p tilli qo'llab-quvvatlash**: O'zbek, ingliz va rus tillarida mavjud.
- **Hisob boshqaruvi**: OTP tekshiruvi bilan bir nechta Telegram hisoblarini qo'llab-quvvatlash.

### Qo'shimcha xususiyatlar

- **Avtojavoblar**: Savol-javob juftliklari bilan AI modelini o'rgating, ishonchlilik chegarasi va fallback bilan.
- **Shablonlar**: O'zgaruvchilar bilan shablonlar, vaqt zonalarini hisobga olish.
- **Mass xabarlar**: Jadval bo'yicha yuborish, segmentatsiya va rate limiting bilan xavfsiz yuborish.
- **Tahlillar**: Ochilish va javob ko'rsatkichlari, o'rtacha javob vaqti, CSV/PDF eksporti.
- **Admin panel**: Foydalanuvchi boshqaruvi va tizim monitoringi (admin foydalanuvchilar uchun).
- **Offline rejim**: Internet yo'q bo'lganda ham ishlash.

## Texnologiya steki

- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server Vite dev server bilan integratsiya qilingan
- **UI**: Radix UI + TailwindCSS 3 + Lucide React ikonlari
- **Testlash**: Vitest
- **Holat boshqaruvi**: React Query (@tanstack/react-query)
- **Formalar**: React Hook Form + Zod validatsiyasi
- **Animatsiyalar**: Framer Motion
- **Paket menejeri**: PNPM

## Loyiha tuzilmasi

```
client/                   # React SPA frontend
├── pages/                # Route komponentlari
├── components/           # Qayta ishlatiladigan UI komponentlari
│   ├── ui/               # Tayyor UI kutubxonasi
│   └── chat/             # Chat uchun maxsus komponentlar
├── layouts/              # Layout komponentlari
├── hooks/                # Maxsus React hooklar
├── lib/                  # Utilitalar
├── auth.tsx              # Autentifikatsiya konteksti
├── i18n.tsx              # Xalqaro lashtirish
└── App.tsx               # Asosiy app komponenti

server/                   # Express API backend
├── index.ts              # Asosiy server sozlamalari
└── routes/               # API handlerlari

shared/                   # Umumiy turlar va utilitalar
└── api.ts                # API interfeyslari

public/                   # Statik aktivlar
```

## O'rnatish

1. Repozitoriyani klonlang:
   ```bash
   git clone https://github.com/yourusername/torextalk.git
   cd torextalk
   ```

2. Bog'liqliklarni o'rnating:
   ```bash
   pnpm install
   ```

3. Ishlab chiqish serverini ishga tushiring:
   ```bash
   pnpm dev
   ```

Ilova `http://localhost:8080` manzilida mavjud bo'ladi.

## Foydalanish

1. Hisobingizga ro'yxatdan o'ting yoki kiring.
2. OTP tekshiruvi orqali Telegram hisoblarini qo'shing.
3. Dashboarddan chatlarni boshqaring, xabar yuboring va avtojavoblarni sozlang.
4. Admin paneliga foydalanuvchi boshqaruvi uchun kiring (faqat admin foydalanuvchilar).

## API

### Mavjud API endpointlar

Server quyidagi endpointlarni taqdim etadi:

- `GET /api/ping` - Sog'liqni tekshirish
- `GET /api/demo` - Demo javob

### Kerakli API endpointlar (TalkAppBackend bilan integratsiya uchun)

TorexTalk frontendini to'liq ishlashi uchun quyidagi API endpointlar kerak. Ular TalkAppBackend repositoriyasidan mos kelishi yoki qo'shilishi kerak:

#### Autentifikatsiya

- `POST /api/auth/login` - Foydalanuvchi kirishi
  - Body: `{ email, password }`
  - Response: `{ token, user }`
- `POST /api/auth/register` - Foydalanuvchi ro'yxatdan o'tishi
  - Body: `{ email, password, name }`
  - Response: `{ token, user }`
- `GET /api/auth/me` - Joriy foydalanuvchi ma'lumotlari
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user }`

#### Hisob boshqaruvi

- `GET /api/accounts` - Foydalanuvchi hisoblarini olish
  - Response: `{ accounts: [{ id, name, phone, status }] }`
- `POST /api/accounts/add` - Yangi hisob qo'shish (OTP bilan)
  - Body: `{ phone }`
  - Response: `{ otpRequired: true }`
- `POST /api/accounts/verify` - OTP tekshiruvi
  - Body: `{ phone, otp }`
  - Response: `{ account }`
- `DELETE /api/accounts/:id` - Hisobni o'chirish

#### Chatlar

- `GET /api/chats` - Chatlar ro'yxatini olish
  - Query: `?type=private|group`
  - Response: `{ chats: [{ id, name, type, unread, avatar }] }`
- `GET /api/chats/:id/messages` - Chat xabarlarini olish
  - Query: `?limit=50&offset=0`
  - Response: `{ messages: [{ id, sender, text, at, file? }] }`
- `POST /api/chats/:id/send` - Xabar yuborish
  - Body: `{ text?, attachment? }`
  - Response: `{ message }`
- `POST /api/chats/create` - Yangi chat yaratish
  - Body: `{ name, type }`
  - Response: `{ chat }`

#### Mass xabarlar

- `POST /api/mass/send` - Mass xabar yuborish
  - Body: `{ text, filters? }`
  - Response: `{ sentCount }`
- `GET /api/mass/history` - Mass xabarlar tarixi
  - Response: `{ history: [{ id, text, sentAt, count }] }`

#### Avtojavoblar

- `GET /api/auto-replies` - Avtojavoblar ro'yxatini olish
  - Response: `{ replies: [{ id, trigger, response, confidence }] }`
- `POST /api/auto-replies` - Yangi avtojavob qo'shish
  - Body: `{ trigger, response }`
  - Response: `{ reply }`
- `PUT /api/auto-replies/:id` - Avtojavobni yangilash
- `DELETE /api/auto-replies/:id` - Avtojavobni o'chirish

#### Shablonlar

- `GET /api/templates` - Shablonlar ro'yxatini olish
  - Response: `{ templates: [{ id, name, content }] }`
- `POST /api/templates` - Yangi shablon qo'shish
  - Body: `{ name, content }`
  - Response: `{ template }`
- `PUT /api/templates/:id` - Shablonni yangilash
- `DELETE /api/templates/:id` - Shablonni o'chirish

#### Statistika

- `GET /api/analytics/overview` - Umumiy statistika
  - Response: `{ totalMessages, totalChats, responseRate }`
- `GET /api/analytics/messages` - Xabarlar statistikasi
  - Query: `?period=day|week|month`
  - Response: `{ data: [{ date, sent, received }] }`

#### Admin

- `GET /api/admin/users` - Foydalanuvchilar ro'yxatini olish (admin)
- `POST /api/admin/users/:id/block` - Foydalanuvchini bloklash
- `GET /api/admin/stats` - Tizim statistikasi

#### Boshqa

- `GET /api/notifications` - Bildirishnomalar
- `POST /api/settings` - Sozlamalarni yangilash
  - Body: `{ key, value }`

Bu endpointlar JSON formatda bo'lishi va JWT token bilan himoyalanishi kerak. TalkAppBackend'da mavjud bo'lmagan endpointlar qo'shilishi lozim.

## Ishlab chiqish

- `pnpm dev` - Ishlab chiqish serverini ishga tushirish
- `pnpm build` - Ishlab chiqarish uchun build qilish
- `pnpm start` - Ishlab chiqarish serverini ishga tushirish
- `pnpm test` - Testlarni ishga tushirish
- `pnpm typecheck` - TypeScript validatsiyasi

## Joylashtirish

Oson hosting uchun Netlify yoki Vercelga joylashtiring. Ilova statik joylashtirish va serverless funksiyalarni qo'llab-quvvatlaydi.

## Hissa qo'shish

1. Repozitoriyani fork qiling
2. Xususiyat branchini yarating
3. O'zgarishlaringizni kiriting
4. Testlarni ishga tushiring
5. Pull request yuboring

## Litsenziya

Bu loyiha MIT Litsenziyasi ostida litsenziyalangan.

## Qo'llab-quvvatlash

Savollar yoki qo'llab-quvvatlash uchun biz bilan support@torextalk.com orqali bog'laning.

## Arxitektura

Ilova SPA (Single Page Application) arxitekturasiga asoslangan, frontend va backend birgalikda ishlaydi. Vite dev server Express server bilan integratsiya qilingan, bu issiq qayta yuklash va tez ishlab chiqishni ta'minlaydi. TypeScript butun loyihada ishlatiladi, bu xavfsizlik va ishlab chiqish tezligini oshiradi.

## Kelajakdagi rejalari

- Telegram API bilan to'liq integratsiya
- Ko'proq AI modellarini qo'llab-quvvatlash
- Mobil ilova versiyasi
- Ko'proq tahlil xususiyatlari