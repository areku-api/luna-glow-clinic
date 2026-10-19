# Luna Glow Clinic — เว็บเดียวจบ (CRUD)

ระบบคลินิกความงามครบวงจรใน Next.js เดียว  
ดีไซน์ Minimal สีกรม · ไทยอ่านง่าย · โชว์บน Fastwork

## รัน

```bash
cd web
npm install
npm run dev
```

เปิด http://localhost:3000  
แอดมิน: http://localhost:3000/admin · รหัส `admin123`

## มีอะไรบ้าง

**สาธารณะ**
- `/` หน้าแรกโปรโมทคลินิก
- `/book` จองคิว (กันช่วงเวลาซ้ำ)
- `/shop` ร้านสกินแคร์ + ตะกร้า
- `/shop/cart`  PromptPay mock  ชำระ
- `/status` เช็กสถานะออเดอร์

**แอดมิน CRUD**
- `/admin` ภาพรวมตัวเลข
- `/admin/services` บริการ — สร้าง/อ่าน/แก้/ลบ
- `/admin/bookings` คิวจอง — อัปเดตสถานะ/ลบ
- `/admin/products` สินค้า — สร้าง/อ่าน/แก้/ลบ
- `/admin/orders` ออเดอร์ — อัปเดตสถานะ/ลบ

## Deploy

Deploy โฟลเดอร์ `web` ขึ้น Vercel โปรเจกต์เดียว

ข้อความคัดลอก Fastwork: [`FASTWORK_PROFILE.md`](./FASTWORK_PROFILE.md)
