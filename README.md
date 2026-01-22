# ProStaff Worker - Ishchilar Ilovasi

ProStaff Worker - bu ishchilar uchun buyurtmalarni qabul qilish, boshqarish va bajarish ilovasi.

## 🚀 Xususiyatlar

### ✅ Asosiy Funksiyalar
- 🔐 Kategoriya tanlash va online/offline rejimi
- 📱 Real-time buyurtma push bildirishnomalari
- 📋 Buyurtmalarni qabul qilish/rad etish
- ✅ Ishni tugatish va tarix
- 💰 Narx oralig'ini sozlash (200,000 - 300,000)
- ⭐ Reyting va statistika
- 🌓 Tungi/Kunduzgi rejim
- 🌍 Til almashtirish (O'zbekcha/Русский)
- 🔔 Push bildirishnomalar sozlamalari

### 🎨 Kategoriyalar
1. **Buzish** (Demolition)
2. **Qurish** (Construction)
3. **Yuk ortish** (Loading)
4. **Yuk tushirish** (Unloading)

## 📱 Ekranlar

### 1. Asosiy Ekran (`index.tsx`)
- Online/Offline holat ko'rsatkich
- Kategoriya tanlash tugmasi
- Faol buyurtma (agar mavjud bo'lsa)
- Yangi buyurtmalar ro'yxati

### 2. Buyurtmalar (`orders.tsx`)
- Qabul qilingan buyurtmalar
- Tasdiqlangan ishlar
- Buyurtma tafsilotlari

### 3. Tarix (`history.tsx`)
- Tugallangan buyurtmalar
- Daromad statistikasi

### 4. Profil (`profile.tsx`)
- Reyting ko'rsatkichi
- Narx oralig'i sozlamalari
- Push bildirishnomalar sozlamalari
- Til va rejim sozlamalari
- Call Center aloqa

## 🛠️ Texnologiyalar

- **Framework**: React Native + Expo
- **Routing**: Expo Router
- **State Management**: React Context API
- **Backend**: Supabase
- **Notifications**: Expo Notifications
- **UI**: React Native Paper
- **Icons**: @expo/vector-icons
- **Storage**: AsyncStorage

## 📦 O'rnatish

```bash
# Dependencies o'rnatish
npm install

# Ilovani ishga tushirish
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🔧 Konfiguratsiya

### Environment Variables

`.env` faylini yarating:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Setup

Batafsil ko'rsatma uchun `INTEGRATION_GUIDE.md` faylini o'qing.

## 📂 Loyiha Strukturasi

```
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Asosiy ekran
│   │   ├── orders.tsx       # Buyurtmalar
│   │   ├── history.tsx      # Tarix
│   │   └── profile.tsx      # Profil
│   └── order/[id].tsx       # Buyurtma tafsilotlari
├── components/              # React components
│   ├── feature/            # Feature-specific components
│   └── ui/                 # Reusable UI components
├── services/               # Business logic
│   ├── supabaseService.ts  # Backend integration
│   ├── notificationService.ts
│   └── mockData.ts         # Test data
├── contexts/               # Global state
│   └── WorkerContext.tsx
├── hooks/                  # Custom hooks
│   └── useWorker.tsx
└── constants/              # Configuration
    ├── theme.ts            # Design tokens
    ├── translations.ts     # Localization
    └── config.ts           # App config
```

## 🔄 Workflow

### Ishchi Workflow
1. **Kategoriya tanlash** → Online bo'lish
2. **Yangi buyurtma keladi** → Push notification
3. **Buyurtmani ko'rish** → Rasm, manzil, tavsif
4. **Qabul qilish** → "Tasdiqlash jarayonida..."
5. **Mijoz tasdiqlaydi** → Status: "Tasdiqlandi" + telefon raqami ko'rinadi
6. **Ishni bajarish** → "Ishni tugatdim" tugmasini bosish
7. **Tugallash** → Avtomatik online rejimga qaytish

### Status'lar
- `pending` - Yangi buyurtma
- `accepted` - Ishchi qabul qildi (tasdiqlash kutilmoqda)
- `approved` - Mijoz tasdiqladi
- `completed` - Ish tugallandi
- `cancelled` - Bekor qilindi

## 🔔 Push Notifications

### Test Bildirishnoma
Profil → Bildirishnomalar → "Test bildirishnoma" tugmasi

### Production
- Expo push notification service ishlatiladi
- Supabase Edge Function orqali yuboriladi
- Real-time yangi buyurtmalar haqida xabar beradi

## 🌐 ProStaff Mijozlar Ilovasi bilan Integratsiya

### Integratsiya Qilish
1. Supabase loyihasini sozlang
2. Database schema'ni yarating (`INTEGRATION_GUIDE.md`)
3. `.env` fayllarni ikkala ilovada ham to'ldiring
4. Real-time subscriptions tekshiring
5. Push notifications sozlang

### Ma'lumot Oqimi
```
Mijoz → Buyurtma yaratish → Supabase DB
                               ↓
                    Ishchiga push notification
                               ↓
                    Ishchi qabul qiladi
                               ↓
                    Mijozga status yangilanishi
```

## 🎨 Dizayn

### Ranglar
- Primary: `#2196F3` (Moviy)
- Success: `#4CAF50` (Yashil)
- Warning: `#FF9800` (To'q sariq)
- Error: `#F44336` (Qizil)
- Info: `#00BCD4` (Turkuaz)

### Tungi Rejim
- Background: `#121212`
- Surface: `#1E1E1E`
- Text: `#FFFFFF`

## 📱 Ekran Ko'rinishlari

### Safe Area
- iOS: Notch va Bottom indicator
- Android: Navigation bar
- Web: Adaptive layout

### Responsive
- Phone: 320px - 414px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🧪 Testing

### Mock Ma'lumotlar
`services/mockData.ts` - Test uchun namuna buyurtmalar

### Real Backend Test
1. Supabase Dashboard → Table Editor
2. Manual buyurtma yaratish
3. Real-time notification tekshirish

## 📞 Support

**Call Center**: +998501017695

## 📄 License

MIT License - ProStaff Worker

## 🔗 Foydali Havolalar

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Backend integratsiya yo'riqnomasi
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native](https://reactnative.dev/)

---

**ProStaff Worker** - Ishchilar uchun professional buyurtmalar tizimi! 🚀
