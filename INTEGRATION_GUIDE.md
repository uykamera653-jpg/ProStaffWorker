# ProStaff Worker va ProStaff Mijozlar Integratsiya Yo'riqnomasi

Bu yo'riqnoma **ProStaff Worker** (ishchilar) va **ProStaff** (mijozlar) ilovalarini Supabase backend orqali bir-biriga ulash jarayonini tushuntiradi.

## 📋 Zarur Talablar

### 1. Supabase Loyihasi
- Supabase account yaratish: https://supabase.com
- Yangi loyiha yaratish
- Database URL va Anon Key olish

### 2. Ikkala Ilova
- ✅ ProStaff Worker (ishchilar ilovasi)
- ✅ ProStaff (mijozlar ilovasi)

---

## 🗄️ 1-QADAM: Database Schema Yaratish

Supabase Dashboard → SQL Editor → New Query ga o'ting va quyidagi SQL kodlarni bajaring:

### Categories Jadvali
```sql
-- Kategoriyalar jadvali
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_uz TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dastlabki kategoriyalar
INSERT INTO categories (id, name_uz, name_ru, icon) VALUES
('demolition', 'Buzish', 'Снос', 'delete'),
('construction', 'Qurish', 'Строительство', 'construction'),
('loading', 'Yuk ortish', 'Погрузка', 'local-shipping'),
('unloading', 'Yuk tushirish', 'Разгрузка', 'inventory');

-- RLS (Row Level Security) yoqish
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Hamma o'qiy oladi
CREATE POLICY "Categories are viewable by everyone"
ON categories FOR SELECT
USING (true);
```

### Workers Jadvali
```sql
-- Ishchilar jadvali
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  categories TEXT[] DEFAULT '{}',
  is_online BOOLEAN DEFAULT false,
  min_price INTEGER DEFAULT 200000,
  max_price INTEGER DEFAULT 300000,
  rating NUMERIC(2,1) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS yoqish
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Ishchi o'z profilini ko'rishi va tahrirlashi mumkin
CREATE POLICY "Workers can view own profile"
ON workers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Workers can update own profile"
ON workers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Workers can insert own profile"
ON workers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Trigger: updated_at avtomatik yangilanishi
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workers_updated_at
BEFORE UPDATE ON workers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

### Orders Jadvali
```sql
-- Buyurtmalar jadvali
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
  category_id TEXT REFERENCES categories(id),
  category_name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'approved', 'completed', 'cancelled')),
  client_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index: tezkor qidiruv uchun
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_category ON orders(category_id);
CREATE INDEX idx_orders_worker ON orders(worker_id);
CREATE INDEX idx_orders_client ON orders(client_id);

-- RLS yoqish
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Mijozlar o'z buyurtmalarini ko'rishlari mumkin
CREATE POLICY "Clients can view own orders"
ON orders FOR SELECT
USING (auth.uid() = client_id);

-- Mijozlar buyurtma yaratishlari mumkin
CREATE POLICY "Clients can create orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = client_id);

-- Ishchilar pending buyurtmalarni ko'rishlari mumkin
CREATE POLICY "Workers can view pending orders in their categories"
ON orders FOR SELECT
USING (
  status = 'pending' AND
  category_id = ANY(
    SELECT unnest(categories) FROM workers WHERE user_id = auth.uid()
  )
);

-- Ishchilar o'z qabul qilgan buyurtmalarini ko'rishlari mumkin
CREATE POLICY "Workers can view accepted orders"
ON orders FOR SELECT
USING (
  worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid())
);

-- Ishchilar buyurtma holatini yangilashlari mumkin
CREATE POLICY "Workers can update order status"
ON orders FOR UPDATE
USING (
  worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid())
);
```

---

## 🔧 2-QADAM: Environment Variables Sozlash

### ProStaff Worker Ilovasida

1. Loyiha root papkasida `.env` fayli yarating:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Supabase Dashboard → Settings → API dan quyidagi ma'lumotlarni oling:
   - Project URL → `EXPO_PUBLIC_SUPABASE_URL`
   - Project API Keys → `anon` `public` → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### ProStaff (Mijozlar) Ilovasida

Xuddi shu jarayonni takrorlang - bir xil URL va Key ishlatiladi.

---

## 📱 3-QADAM: Ikki Ilovani Ulash

### Data Flow (Ma'lumot Oqimi)

```
┌─────────────────────┐         ┌──────────────────┐         ┌─────────────────────┐
│   ProStaff Client   │────────▶│  Supabase DB     │◀────────│  ProStaff Worker    │
│   (Mijozlar)        │         │                  │         │  (Ishchilar)        │
└─────────────────────┘         └──────────────────┘         └─────────────────────┘
        │                                │                              │
        │ 1. Buyurtma yaratish           │                              │
        │────────────────────────────────▶                              │
        │                                │                              │
        │                                │  2. Real-time notification   │
        │                                │──────────────────────────────▶
        │                                │                              │
        │                                │  3. Buyurtma qabul qilish    │
        │                                │◀──────────────────────────────
        │                                │                              │
        │ 4. Status update notification  │                              │
        │◀────────────────────────────────                              │
```

### Asosiy Workflow

#### ProStaff (Mijozlar) tarafida:
1. Mijoz buyurtma yaratadi → `orders` jadvaliga INSERT
2. Real-time tinglaydi → order status o'zgarishini kuzatadi
3. Ishchi buyurtmani qabul qilganda → status `accepted` → `approved`
4. Mijoz ishchini tasdiqlaydi → push notification ishchiga
5. Ish tugagach → status `completed`

#### ProStaff Worker (Ishchilar) tarafida:
1. Ishchi online bo'ladi → `workers.is_online = true`
2. Real-time subscription → yangi buyurtmalar kelishi
3. Push notification → yangi buyurtma haqida
4. Ishchi buyurtmani ko'radi va qabul qiladi/rad etadi
5. Mijoz tasdiqlasa → status `approved` → telefon raqami ko'rinadi
6. Ishni tugatadi → status `completed`

---

## 🔔 4-QADAM: Push Notifications

### Expo Notifications Setup

Ikkala ilovada ham:

```bash
npm install expo-notifications
```

### ProStaff Worker ilovasida push token saqlash:

```typescript
// services/notificationService.ts da allaqachon mavjud
import * as Notifications from 'expo-notifications';

// Push token olish va serverga yuborish
async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const token = await Notifications.getExpoPushTokenAsync();
  
  // Token'ni workers jadvaliga saqlash
  await supabase
    .from('workers')
    .update({ push_token: token.data })
    .eq('user_id', userId);
}
```

### Supabase Edge Function: Notification yuborish

Supabase Dashboard → Edge Functions → New Function:

```typescript
// supabase/functions/send-order-notification/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

serve(async (req) => {
  const { orderId, workerId } = await req.json();

  // Worker push token'ini olish
  const { data: worker } = await supabase
    .from('workers')
    .select('push_token')
    .eq('id', workerId)
    .single();

  if (!worker?.push_token) {
    return new Response('No push token', { status: 400 });
  }

  // Expo push notification yuborish
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: worker.push_token,
      title: 'Yangi buyurtma!',
      body: 'Siz uchun yangi buyurtma keldi',
      data: { orderId },
    }),
  });

  return new Response('OK', { status: 200 });
});
```

---

## 🧪 5-QADAM: Test Qilish

### 1. Database Test
Supabase Dashboard → Table Editor:
- `categories` jadvalida 4 ta kategoriya borligini tekshiring
- `workers` va `orders` jadvallari bo'sh

### 2. ProStaff Worker Test
1. Ilovani ishga tushiring
2. Kategoriya tanlang va online bo'ling
3. `workers` jadvalida ishchi yaratilganini tekshiring

### 3. ProStaff (Mijozlar) Test
1. Mijoz ilovasidan buyurtma yarating
2. ProStaff Worker ilovasida real-time notification kelishini kuzating
3. Buyurtmani qabul qiling
4. Status o'zgarishini ikkala ilovada ham kuzating

### 4. Real-time Test
```typescript
// Test: Console'da real-time ni kuzatish
const subscription = supabase
  .channel('test-orders')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => console.log('Order changed:', payload)
  )
  .subscribe();
```

---

## 🔐 6-QADAM: Production Deployment

### Authentication Setup
Supabase Dashboard → Authentication → Settings:

1. **Email/Password** yoqish
2. **Email confirmation** sozlash
3. **Redirect URLs** qo'shish:
   ```
   prostaffworker://
   prostaff://
   ```

### Storage (Rasmlar uchun)
Supabase Dashboard → Storage → New Bucket:

- Bucket name: `order-images`
- Public bucket: `true`
- RLS policies:
  ```sql
  -- Hamma o'qiy oladi
  CREATE POLICY "Images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'order-images');

  -- Faqat authenticated foydalanuvchilar yuklashi mumkin
  CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'order-images' AND auth.role() = 'authenticated');
  ```

---

## 📊 7-QADAM: Monitoring va Analytics

### Supabase Dashboard
- **Logs** → Real-time database queries
- **API** → Request usage
- **Database** → Table sizes and performance

### Error Handling
Ikkala ilovada ham:

```typescript
// Global error handler
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Redirect to login
  }
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed');
  }
});

// Database error handler
try {
  const { data, error } = await supabase.from('orders').select();
  if (error) throw error;
} catch (error) {
  console.error('Database error:', error);
  // Show user-friendly message
}
```

---

## 🎯 Xulosa

### Tayyor Funksiyalar
✅ Database schema yaratildi  
✅ Real-time subscriptions sozlandi  
✅ Push notifications integratsiya qilindi  
✅ RLS (Row Level Security) sozlandi  
✅ Ikkala ilova backend bilan ishlashga tayyor  

### Keyingi Qadamlar
1. `.env` fayllarni to'ldiring
2. Database migration'larni bajaring
3. Test qiling
4. Production'ga deploy qiling

### Qo'shimcha Resurslar
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Notifications](https://docs.expo.dev/push-notifications/overview/)
- [React Native Best Practices](https://reactnative.dev/docs/performance)

---

**Muammo yuzaga kelsa:**
- Supabase Logs'ni tekshiring
- Console error'larni o'qing
- RLS policy'larni qayta ko'rib chiqing
- Edge Function logs'ni tekshiring

**Yordam kerakmi?**
Call Center: +998501017695
